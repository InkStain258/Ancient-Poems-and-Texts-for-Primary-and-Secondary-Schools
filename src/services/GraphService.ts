import type { GraphNode, GraphEdge } from '../types';
import { getAllWorks } from './DataService';
import { authors } from '../data/authors';

/** Maximum nodes for single-work mode */
const SINGLE_WORK_MAX_NODES = 50;

/** Maximum nodes for global mode (increased to accommodate work nodes) */
const GLOBAL_MAX_NODES = 150;

/** Minimum work count for an author to appear in global mode */
const GLOBAL_MIN_WORK_COUNT = 2;

/**
 * Build relationship graph data for visualization.
 *
 * Single-work mode (workId provided):
 *   Generates a network centered on the given work, including:
 *   - The work itself and its author
 *   - Other works by the same author
 *   - Authors from the same dynasty
 *   - Works sharing the same themes
 *   Total nodes capped at SINGLE_WORK_MAX_NODES (50).
 *
 * Global mode (workId not provided):
 *   Generates a macro-level network with:
 *   - Author nodes (workCount >= 2)
 *   - Dynasty nodes
 *   - Theme nodes
 *   - Representative work nodes (max 3 per author)
 *   Total nodes capped at GLOBAL_MAX_NODES (150).
 */
export function buildRelationGraph(workId?: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
  if (workId) {
    return buildSingleWorkGraph(workId);
  }
  return buildGlobalGraph();
}

/**
 * Single-work mode: build a relationship graph centered on one work.
 */
function buildSingleWorkGraph(workId: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const allWorks = getAllWorks();
  const targetWork = allWorks.find((w) => w.id === workId);
  if (!targetWork) {
    return { nodes: [], edges: [] };
  }

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();

  /** Helper: add a node if not already present and within limit */
  const tryAddNode = (node: GraphNode): boolean => {
    if (nodeIds.has(node.id)) return true;
    if (nodeIds.size >= SINGLE_WORK_MAX_NODES) return false;
    nodeIds.add(node.id);
    nodes.push(node);
    return true;
  };

  // 1. Add the target work node
  tryAddNode({ id: targetWork.id, name: targetWork.title, type: 'work', size: 25 });

  // 2. Add the author node and edge
  const authorId = `author_${targetWork.author}`;
  const authorInfo = authors.find((a) => a.name === targetWork.author && a.dynasty === targetWork.dynasty);
  const authorWorkCount = authorInfo?.workCount ?? allWorks.filter((w) => w.author === targetWork.author).length;
  tryAddNode({ id: authorId, name: targetWork.author, type: 'author', size: 30 + Math.min(authorWorkCount * 2, 20) });
  edges.push({ source: authorId, target: targetWork.id, relation: '创作' });

  // 3. Add other works by the same author
  const sameAuthorWorks = allWorks.filter((w) => w.author === targetWork.author && w.id !== workId);
  for (const w of sameAuthorWorks) {
    if (!tryAddNode({ id: w.id, name: w.title, type: 'work', size: 15 })) break;
    edges.push({ source: authorId, target: w.id, relation: '创作' });
  }

  // 4. Add dynasty node and edges
  const dynastyId = `dynasty_${targetWork.dynasty}`;
  if (tryAddNode({ id: dynastyId, name: targetWork.dynasty, type: 'dynasty', size: 22 })) {
    edges.push({ source: authorId, target: dynastyId, relation: '同朝代' });
  }

  // 5. Add other authors from the same dynasty
  const sameDynastyAuthors = authors.filter(
    (a) => a.dynasty === targetWork.dynasty && a.name !== targetWork.author && a.workCount >= 2
  );
  for (const a of sameDynastyAuthors) {
    const aId = `author_${a.name}`;
    if (!tryAddNode({ id: aId, name: a.name, type: 'author', size: 20 + Math.min(a.workCount * 2, 15) })) break;
    edges.push({ source: aId, target: dynastyId, relation: '同朝代' });
  }

  // 6. Add theme nodes for the target work and edges
  const addedThemeIds: string[] = [];
  for (const theme of targetWork.themes) {
    const themeId = `theme_${theme}`;
    if (tryAddNode({ id: themeId, name: theme, type: 'theme', size: 16 })) {
      edges.push({ source: targetWork.id, target: themeId, relation: '同主题' });
      addedThemeIds.push(themeId);
    }
  }

  // 7. Add works that share themes with the target work (scored by shared theme count)
  const sharedThemeWorks = allWorks
    .filter((w) => w.id !== workId && w.author !== targetWork.author)
    .map((w) => ({
      work: w,
      sharedCount: w.themes.filter((t) => targetWork.themes.includes(t)).length,
    }))
    .filter((item) => item.sharedCount > 0)
    .sort((a, b) => b.sharedCount - a.sharedCount);

  for (const { work: w } of sharedThemeWorks) {
    if (nodeIds.size >= SINGLE_WORK_MAX_NODES) break;
    if (nodeIds.has(w.id)) continue;

    tryAddNode({ id: w.id, name: w.title, type: 'work', size: 15 });
    // Connect shared-theme works to the theme nodes
    for (const theme of w.themes) {
      const themeId = `theme_${theme}`;
      if (nodeIds.has(themeId)) {
        edges.push({ source: w.id, target: themeId, relation: '同主题' });
      }
    }

    // Add the author of this shared-theme work if not present
    const wAuthorId = `author_${w.author}`;
    if (!nodeIds.has(wAuthorId)) {
      if (tryAddNode({ id: wAuthorId, name: w.author, type: 'author', size: 18 })) {
        edges.push({ source: wAuthorId, target: w.id, relation: '创作' });
      }
    } else {
      edges.push({ source: wAuthorId, target: w.id, relation: '创作' });
    }
  }

  return { nodes, edges };
}

/**
 * Global mode: build a macro-level relationship graph with work, author, dynasty, and theme nodes.
 * Works as hubs connecting authors to themes and dynasties.
 */
function buildGlobalGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const allWorks = getAllWorks();
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();

  /** Helper: add a node if not already present and within limit */
  const tryAddNode = (node: GraphNode): boolean => {
    if (nodeIds.has(node.id)) return true;
    if (nodeIds.size >= GLOBAL_MAX_NODES) return false;
    nodeIds.add(node.id);
    nodes.push(node);
    return true;
  };

  // 1. Compute author work counts from actual data
  const authorWorkCounts: Record<string, number> = {};
  const authorDynasties: Record<string, string> = {};
  for (const w of allWorks) {
    authorWorkCounts[w.author] = (authorWorkCounts[w.author] || 0) + 1;
    if (!authorDynasties[w.author]) {
      authorDynasties[w.author] = w.dynasty;
    }
  }

  // 2. Add dynasty nodes first (they are few and important)
  const dynastyNames = [...new Set(allWorks.map((w) => w.dynasty))];
  for (const dynasty of dynastyNames) {
    const dynastyId = `dynasty_${dynasty}`;
    const workCount = allWorks.filter((w) => w.dynasty === dynasty).length;
    tryAddNode({ id: dynastyId, name: dynasty, type: 'dynasty', size: 25 + Math.min(workCount, 30) });
  }

  // 3. Add author nodes (only those with workCount >= GLOBAL_MIN_WORK_COUNT), sorted by workCount desc
  const authorEntries = Object.entries(authorWorkCounts)
    .filter(([, count]) => count >= GLOBAL_MIN_WORK_COUNT)
    .sort(([, a], [, b]) => b - a);

  const addedAuthorIds = new Set<string>();
  for (const [authorName, count] of authorEntries) {
    const authorId = `author_${authorName}`;
    if (!tryAddNode({ id: authorId, name: authorName, type: 'author', size: 20 + Math.min(count * 3, 25) })) break;
    addedAuthorIds.add(authorId);

    // Edge: author -> dynasty
    const dynasty = authorDynasties[authorName];
    if (dynasty) {
      const dynastyId = `dynasty_${dynasty}`;
      if (nodeIds.has(dynastyId)) {
        edges.push({ source: authorId, target: dynastyId, relation: '同朝代' });
      }
    }
  }

  // 4. Add theme nodes (only those with enough works)
  const themeCounts: Record<string, number> = {};
  for (const w of allWorks) {
    for (const t of w.themes) {
      themeCounts[t] = (themeCounts[t] || 0) + 1;
    }
  }

  // Sort themes by count, add the most popular ones
  const themeEntries = Object.entries(themeCounts)
    .filter(([, count]) => count >= 5)
    .sort(([, a], [, b]) => b - a);

  for (const [themeName, count] of themeEntries) {
    const themeId = `theme_${themeName}`;
    if (!tryAddNode({ id: themeId, name: themeName, type: 'theme', size: 14 + Math.min(count, 15) })) break;
  }

  // 5. Add work nodes for authors already in the graph (representative works, max 3 per author)
  const addedWorkIds = new Set<string>();
  for (const [authorName] of authorEntries) {
    if (!addedAuthorIds.has(`author_${authorName}`)) continue;
    const authorWorks = allWorks
      .filter((w) => w.author === authorName)
      .slice(0, 3); // Max 3 works per author to keep graph manageable
    for (const w of authorWorks) {
      if (!tryAddNode({ id: w.id, name: w.title, type: 'work', size: 12 })) break;
      addedWorkIds.add(w.id);
      // Edge: author -> work
      edges.push({ source: `author_${authorName}`, target: w.id, relation: '创作' });
    }
  }

  // 6. Connect works to their theme nodes
  for (const wId of addedWorkIds) {
    const work = allWorks.find((w) => w.id === wId);
    if (!work) continue;
    for (const theme of work.themes) {
      const themeId = `theme_${theme}`;
      if (nodeIds.has(themeId)) {
        edges.push({ source: wId, target: themeId, relation: '同主题' });
      }
    }
  }

  // 7. Connect remaining authors (without works in graph) directly to themes
  for (const [authorName] of authorEntries) {
    const authorId = `author_${authorName}`;
    if (!nodeIds.has(authorId)) continue;
    // Skip if author already has work nodes connected to themes
    const hasWorkInGraph = [...addedWorkIds].some((wId) => {
      const w = allWorks.find((wk) => wk.id === wId);
      return w && w.author === authorName;
    });
    if (hasWorkInGraph) continue;

    const authorThemes = new Set<string>();
    for (const w of allWorks) {
      if (w.author === authorName) {
        for (const t of w.themes) {
          authorThemes.add(t);
        }
      }
    }

    for (const theme of authorThemes) {
      const themeId = `theme_${theme}`;
      if (nodeIds.has(themeId)) {
        edges.push({ source: authorId, target: themeId, relation: '同主题' });
      }
    }
  }

  return { nodes, edges };
}

/** Build ECharts graph option from graph data */
export function buildGraphOption(nodes: GraphNode[], edges: GraphEdge[]) {
  // ── Color scheme: green=author, gold=theme, amber=work, crimson=dynasty ──
  const typeColors: Record<string, string> = {
    author: '#2D8F5E',   // 翠绿 — 文人风骨
    work:   '#C8922A',   // 琥珀金 — 诗篇华章
    theme:  '#D4A017',   // 明黄 — 主题意象
    dynasty:'#B22222',   // 绛红 — 朝代更替
  };

  const typeDarkColors: Record<string, string> = {
    author: '#3EC77A',   // 亮翠绿（暗色模式）
    work:   '#E8B84A',   // 亮琥珀金（暗色模式）
    theme:  '#F0C040',   // 亮明黄（暗色模式）
    dynasty:'#E04040',   // 亮绛红（暗色模式）
  };

  const typeNames: Record<string, string> = {
    author: '作者',
    work: '作品',
    theme: '主题',
    dynasty: '朝代',
  };

  // Edge color by relation type
  const edgeColors: Record<string, string> = {
    '创作': '#6B8E6B',     // 绿系 — 创作
    '同朝代': '#A0522D',   // 褐系 — 同朝代
    '同主题': '#D4A017',   // 金系 — 同主题
  };

  // Build node name map for tooltip
  const nodeNameMap: Record<string, string> = {};
  for (const n of nodes) {
    nodeNameMap[n.id] = n.name;
  }

  // Detect dark mode
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const activeColors = isDark ? typeDarkColors : typeColors;
  const labelColor = isDark ? '#E0E0E0' : '#333';

  const echartsNodes = nodes.map((n) => {
    const color = activeColors[n.type] || '#8B4513';
    return {
      id: n.id,
      name: n.name,
      symbolSize: n.size || 15,
      itemStyle: {
        color,
        borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
        borderWidth: n.type === 'author' ? 2 : 1,
        shadowBlur: n.type === 'author' ? 8 : 4,
        shadowColor: isDark ? `${color}66` : `${color}33`,
      },
      label: {
        show: true,
        fontSize: n.type === 'author' ? 13 : n.type === 'dynasty' ? 14 : 11,
        fontWeight: n.type === 'author' || n.type === 'dynasty' ? 'bold' : 'normal',
        color: labelColor,
        position: 'right' as const,
      },
      category: ['author', 'work', 'theme', 'dynasty'].indexOf(n.type),
    };
  });

  const echartsEdges = edges.map((e) => {
    const lineColor = edgeColors[e.relation] || '#888';
    return {
      source: e.source,
      target: e.target,
      lineStyle: {
        color: isDark ? `${lineColor}AA` : lineColor,
        width: e.relation === '创作' ? 2 : 1,
        type: e.relation === '创作' ? 'solid' as const : 'dashed' as const,
        curveness: 0.2,
        opacity: e.relation === '创作' ? 0.6 : 0.35,
      },
      value: e.relation,
    };
  });

  // Categories with itemStyle so legend matches node colors
  const categories = [
    { name: '作者', itemStyle: { color: activeColors.author } },
    { name: '作品', itemStyle: { color: activeColors.work } },
    { name: '主题', itemStyle: { color: activeColors.theme } },
    { name: '朝代', itemStyle: { color: activeColors.dynasty } },
  ];

  return {
    tooltip: {
      trigger: 'item' as const,
      confine: true,
      backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: isDark ? '#555' : '#ddd',
      textStyle: { color: isDark ? '#eee' : '#333', fontSize: 13 },
      formatter: (params: { dataType?: string; name?: string; value?: string; data?: { source?: string; target?: string; category?: number } }) => {
        if (params.dataType === 'edge') {
          const value = params.value || '';
          const srcName = nodeNameMap[params.data?.source || ''] || '';
          const tgtName = nodeNameMap[params.data?.target || ''] || '';
          return `<span style="color:${isDark ? '#aaa' : '#666'}">${srcName}</span> <b>— ${value} —</b> <span style="color:${isDark ? '#aaa' : '#666'}">${tgtName}</span>`;
        }
        const name = params.name || '';
        const nodeType = params.data?.category;
        const typeKey = ['author', 'work', 'theme', 'dynasty'][nodeType ?? -1];
        const typeLabel = typeKey ? typeNames[typeKey] : '';
        const dotColor = typeKey ? activeColors[typeKey] : '#888';
        return `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${dotColor};margin-right:6px;vertical-align:middle;"></span><b>${name}</b><br/><span style="color:${isDark ? '#aaa' : '#888'}">类型：${typeLabel}</span>`;
      },
    },
    legend: {
      data: categories.map((c) => c.name),
      bottom: 0,
      textStyle: { fontSize: 12, color: isDark ? '#ccc' : '#555' },
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 16,
    },
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [{
      type: 'graph' as const,
      layout: 'force' as const,
      data: echartsNodes,
      links: echartsEdges,
      categories,
      roam: true,
      draggable: true,
      label: {
        show: true,
        position: 'right' as const,
        formatter: '{b}',
        color: labelColor,
      },
      force: {
        repulsion: 400,
        gravity: 0.1,
        edgeLength: [80, 200],
        friction: 0.6,
        layoutAnimation: true,
      },
      emphasis: {
        focus: 'adjacency' as const,
        lineStyle: { width: 3 },
        label: { fontSize: 14, fontWeight: 'bold' as const },
      },
      edgeLabel: {
        show: false,
      },
    }],
  };
}
