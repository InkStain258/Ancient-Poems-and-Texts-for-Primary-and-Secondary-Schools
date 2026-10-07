import type { Stage, Dynasty, Theme, SubGenre } from '../types';
import { getAllWorks, getCountsByStage, getCountsByDynasty, getCountsByTheme, getUniqueAuthors } from './DataService';
import { authors } from '../data/authors';
import { DYNASTIES, STAGES } from '../types';

/** Detect if dark mode is active */
function isDarkMode(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
}

/** Dynasty color palette — warm ink tones */
const DYNASTY_COLORS = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#B8860B', '#DAA520', '#BC8F8F', '#C19A6B'];

/** Stage colors */
const STAGE_COLORS = ['#8B4513', '#CD853F', '#2D8F5E'];

/** Sub-genre colors */
const SUBGENRE_COLORS: Record<string, string> = {
  '古体诗': '#8B4513', '近体诗': '#CD853F', '词': '#B8860B',
  '曲': '#DAA520', '记叙文': '#2D8F5E', '说理文': '#4682B4',
  '写景文': '#6B8E23', '抒情文': '#C71585',
};

/** ECharts bar chart option for dynasty distribution — enhanced with dark mode */
export function getDynastyDistributionOption() {
  const counts = getCountsByDynasty();
  const data = DYNASTIES.map((d) => counts[d] || 0);
  const isDark = isDarkMode();
  const labelColor = isDark ? '#ccc' : '#555';

  return {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: isDark ? '#555' : '#ddd',
      textStyle: { color: isDark ? '#eee' : '#333' },
    },
    xAxis: {
      type: 'category' as const,
      data: DYNASTIES,
      axisLabel: { fontSize: 11, color: labelColor, rotate: 30, interval: 0 },
      axisLine: { lineStyle: { color: isDark ? '#444' : '#ddd' } },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { color: labelColor },
      splitLine: { lineStyle: { color: isDark ? '#333' : '#eee' } },
    },
    series: [{
      type: 'bar' as const,
      data: data.map((v, i) => ({
        value: v,
        itemStyle: { color: DYNASTY_COLORS[i], borderRadius: [4, 4, 0, 0] },
      })),
      barWidth: '50%',
      label: { show: true, position: 'top' as const, fontSize: 11, color: labelColor },
    }],
    grid: { left: '10%', right: '5%', bottom: '22%', top: '12%' },
  };
}

/** ECharts bar chart option for grade distribution — enhanced */
export function getGradeDistributionOption() {
  const stageCounts = getCountsByStage();
  const data = STAGES.map((s) => stageCounts[s] || 0);
  const isDark = isDarkMode();
  const labelColor = isDark ? '#ccc' : '#555';

  return {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: isDark ? '#555' : '#ddd',
      textStyle: { color: isDark ? '#eee' : '#333' },
    },
    xAxis: {
      type: 'category' as const,
      data: STAGES,
      axisLabel: { fontSize: 12, color: labelColor },
      axisLine: { lineStyle: { color: isDark ? '#444' : '#ddd' } },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { color: labelColor },
      splitLine: { lineStyle: { color: isDark ? '#333' : '#eee' } },
    },
    series: [{
      type: 'bar' as const,
      data: data.map((v, i) => ({
        value: v,
        itemStyle: { color: STAGE_COLORS[i], borderRadius: [6, 6, 0, 0] },
      })),
      barWidth: '40%',
      label: { show: true, position: 'top' as const, fontSize: 13, fontWeight: 'bold', color: labelColor },
    }],
    grid: { left: '10%', right: '5%', bottom: '10%', top: '12%' },
  };
}

/** ECharts pie chart option for theme distribution — enhanced */
export function getThemeDistributionOption() {
  const counts = getCountsByTheme();
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const isDark = isDarkMode();

  const pieColors = [
    '#B22222', '#8B4513', '#CD853F', '#D2691E', '#DAA520',
    '#2D8F5E', '#4682B4', '#6B8E23', '#C71585', '#9370DB',
    '#FF6347', '#20B2AA', '#FF8C00', '#708090', '#DB7093',
  ];

  return {
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: isDark ? '#555' : '#ddd',
      textStyle: { color: isDark ? '#eee' : '#333' },
    },
    legend: {
      type: 'scroll' as const,
      orient: 'vertical' as const,
      right: '5%',
      top: 'middle',
      textStyle: { fontSize: 11, color: isDark ? '#ccc' : '#555' },
    },
    series: [{
      type: 'pie' as const,
      radius: ['30%', '60%'],
      center: ['35%', '50%'],
      data: entries.map(([name, value], i) => ({
        name,
        value,
        itemStyle: { color: pieColors[i % pieColors.length] },
      })),
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
      },
      label: {
        color: isDark ? '#ccc' : '#555',
        fontSize: 11,
      },
    }],
  };
}

/** ECharts bar chart option for sub-genre distribution */
export function getGenreDistributionOption() {
  const works = getAllWorks();
  const subGenreCounts: Record<string, number> = {};
  for (const w of works) {
    const sg = w.genre.subGenre;
    subGenreCounts[sg] = (subGenreCounts[sg] || 0) + 1;
  }

  // Group by category
  const poetryGenres = ['古体诗', '近体诗', '词', '曲'];
  const proseGenres = ['记叙文', '说理文', '写景文', '抒情文'];
  const ordered = [...poetryGenres, ...proseGenres];
  const data = ordered.map((sg) => subGenreCounts[sg] || 0);
  const isDark = isDarkMode();
  const labelColor = isDark ? '#ccc' : '#555';

  return {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: isDark ? '#555' : '#ddd',
      textStyle: { color: isDark ? '#eee' : '#333' },
    },
    xAxis: {
      type: 'category' as const,
      data: ordered,
      axisLabel: { fontSize: 11, color: labelColor, rotate: 30, interval: 0 },
      axisLine: { lineStyle: { color: isDark ? '#444' : '#ddd' } },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { color: labelColor },
      splitLine: { lineStyle: { color: isDark ? '#333' : '#eee' } },
    },
    series: [{
      type: 'bar' as const,
      data: data.map((v, i) => ({
        value: v,
        itemStyle: {
          color: SUBGENRE_COLORS[ordered[i]] || '#8B4513',
          borderRadius: [4, 4, 0, 0],
        },
      })),
      barWidth: '50%',
      label: { show: true, position: 'top' as const, fontSize: 11, color: labelColor },
    }],
    grid: { left: '10%', right: '5%', bottom: '25%', top: '8%' },
  };
}

/** ECharts horizontal bar chart for top authors by work count */
export function getAuthorTopOption(topN: number = 10) {
  const works = getAllWorks();
  const authorCounts: Record<string, number> = {};
  for (const w of works) {
    authorCounts[w.author] = (authorCounts[w.author] || 0) + 1;
  }

  const sorted = Object.entries(authorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .reverse(); // reverse for horizontal bar (bottom-to-top)

  const names = sorted.map(([name]) => name);
  const data = sorted.map(([, count]) => count);
  const isDark = isDarkMode();
  const labelColor = isDark ? '#ccc' : '#555';

  return {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: isDark ? '#555' : '#ddd',
      textStyle: { color: isDark ? '#eee' : '#333' },
    },
    xAxis: {
      type: 'value' as const,
      axisLabel: { color: labelColor },
      splitLine: { lineStyle: { color: isDark ? '#333' : '#eee' } },
    },
    yAxis: {
      type: 'category' as const,
      data: names,
      axisLabel: { fontSize: 12, color: labelColor },
      axisLine: { lineStyle: { color: isDark ? '#444' : '#ddd' } },
    },
    series: [{
      type: 'bar' as const,
      data: data.map((v, i) => ({
        value: v,
        itemStyle: {
          color: `hsl(${25 + (i / sorted.length) * 30}, ${60 + (i / sorted.length) * 20}%, ${35 + (i / sorted.length) * 20}%)`,
          borderRadius: [0, 4, 4, 0],
        },
      })),
      barWidth: '55%',
      label: { show: true, position: 'right' as const, fontSize: 11, color: labelColor },
    }],
    grid: { left: '22%', right: '10%', bottom: '5%', top: '5%' },
  };
}

/** ECharts heatmap for dynasty × stage distribution */
export function getDynastyStageHeatmapOption() {
  const works = getAllWorks();
  const isDark = isDarkMode();

  // Count works per dynasty×stage
  const data: number[][] = [];
  let maxVal = 0;
  for (let d = 0; d < DYNASTIES.length; d++) {
    for (let s = 0; s < STAGES.length; s++) {
      const count = works.filter(
        (w) => w.dynasty === DYNASTIES[d] && w.gradeLevel.stage === STAGES[s]
      ).length;
      data.push([s, d, count]);
      if (count > maxVal) maxVal = count;
    }
  }

  const labelColor = isDark ? '#ccc' : '#555';

  return {
    tooltip: {
      position: 'top' as const,
      backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: isDark ? '#555' : '#ddd',
      textStyle: { color: isDark ? '#eee' : '#333' },
      formatter: (params: { data: number[] }) => {
        const [s, d, v] = params.data;
        return `${DYNASTIES[d]} · ${STAGES[s]}：<b>${v}</b> 篇`;
      },
    },
    grid: { left: '18%', right: '12%', bottom: '12%', top: '5%' },
    xAxis: {
      type: 'category' as const,
      data: STAGES,
      axisLabel: { fontSize: 12, color: labelColor },
      axisLine: { lineStyle: { color: isDark ? '#444' : '#ddd' } },
      splitArea: { show: true, areaStyle: { color: isDark ? '#1a1a1a' : '#fafafa' } },
    },
    yAxis: {
      type: 'category' as const,
      data: DYNASTIES,
      axisLabel: { fontSize: 11, color: labelColor },
      axisLine: { lineStyle: { color: isDark ? '#444' : '#ddd' } },
    },
    visualMap: {
      min: 0,
      max: maxVal || 1,
      calculable: true,
      orient: 'vertical' as const,
      right: '2%',
      top: 'center',
      textStyle: { color: labelColor, fontSize: 10 },
      inRange: {
        color: isDark
          ? ['#1a1a2e', '#2d4a3e', '#4a7c59', '#8fbc8f', '#d4edda']
          : ['#f5f0e8', '#d4c4a8', '#b8956a', '#8B4513', '#5c2e0e'],
      },
    },
    series: [{
      type: 'heatmap' as const,
      data,
      label: {
        show: true,
        fontSize: 11,
        color: isDark ? '#ddd' : '#333',
        fontWeight: 'bold',
      },
      itemStyle: { borderWidth: 2, borderColor: isDark ? '#1a1a1a' : '#fff' },
    }],
  };
}

/** ECharts histogram for character count distribution */
export function getCharCountDistributionOption() {
  const works = getAllWorks();
  const isDark = isDarkMode();
  const labelColor = isDark ? '#ccc' : '#555';

  // Bucket character counts
  const buckets = [
    { label: '≤20', min: 0, max: 20 },
    { label: '21-40', min: 21, max: 40 },
    { label: '41-80', min: 41, max: 80 },
    { label: '81-150', min: 81, max: 150 },
    { label: '151-300', min: 151, max: 300 },
    { label: '>300', min: 301, max: Infinity },
  ];

  const data = buckets.map((b) => {
    return works.filter((w) => {
      const chars = w.stats?.charCount || 0;
      return chars >= b.min && chars <= b.max;
    }).length;
  });

  const gradientColors = [
    '#D4EDDA', '#8FBC8F', '#6B8E23', '#CD853F', '#D2691E', '#8B4513',
  ];
  const darkGradientColors = [
    '#2d4a3e', '#3a6b4f', '#4a7c2e', '#a07040', '#c06030', '#7a3515',
  ];

  return {
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: isDark ? '#555' : '#ddd',
      textStyle: { color: isDark ? '#eee' : '#333' },
    },
    xAxis: {
      type: 'category' as const,
      data: buckets.map((b) => b.label),
      axisLabel: { fontSize: 11, color: labelColor },
      axisLine: { lineStyle: { color: isDark ? '#444' : '#ddd' } },
      name: '字数',
      nameTextStyle: { color: labelColor, fontSize: 11 },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { color: labelColor },
      splitLine: { lineStyle: { color: isDark ? '#333' : '#eee' } },
      name: '篇数',
      nameTextStyle: { color: labelColor, fontSize: 11 },
    },
    series: [{
      type: 'bar' as const,
      data: data.map((v, i) => ({
        value: v,
        itemStyle: {
          color: isDark ? darkGradientColors[i] : gradientColors[i],
          borderRadius: [4, 4, 0, 0],
        },
      })),
      barWidth: '55%',
      label: { show: true, position: 'top' as const, fontSize: 11, color: labelColor },
    }],
    grid: { left: '12%', right: '5%', bottom: '12%', top: '10%' },
  };
}

/** Get extended summary statistics */
export function getSummaryStats() {
  const works = getAllWorks();
  const authorCount = getUniqueAuthors().length;
  const dynastySet = new Set(works.map((w) => w.dynasty));
  const themeSet = new Set(works.flatMap((w) => w.themes));

  // Character stats
  const charCounts = works.map((w) => w.stats?.charCount || 0);
  const totalChars = charCounts.reduce((a, b) => a + b, 0);
  const avgChars = works.length > 0 ? Math.round(totalChars / works.length) : 0;
  const maxCharWork = works.reduce((a, b) => ((a.stats?.charCount || 0) >= (b.stats?.charCount || 0) ? a : b), works[0]);
  const minCharWork = works.reduce((a, b) => ((a.stats?.charCount || 0) <= (b.stats?.charCount || 0) ? a : b), works[0]);

  // Genre stats
  const poetryCount = works.filter((w) => w.genre.category === '诗').length;
  const proseCount = works.filter((w) => w.genre.category === '文言文').length;

  // Top dynasty
  const dynastyCounts: Record<string, number> = {};
  for (const w of works) {
    dynastyCounts[w.dynasty] = (dynastyCounts[w.dynasty] || 0) + 1;
  }
  const topDynasty = Object.entries(dynastyCounts).sort(([, a], [, b]) => b - a)[0];

  // Top author
  const authorCounts: Record<string, number> = {};
  for (const w of works) {
    authorCounts[w.author] = (authorCounts[w.author] || 0) + 1;
  }
  const topAuthor = Object.entries(authorCounts).sort(([, a], [, b]) => b - a)[0];

  // Top theme
  const themeCounts: Record<string, number> = {};
  for (const w of works) {
    for (const t of w.themes) {
      themeCounts[t] = (themeCounts[t] || 0) + 1;
    }
  }
  const topTheme = Object.entries(themeCounts).sort(([, a], [, b]) => b - a)[0];

  // Annotation count
  const totalAnnotations = works.reduce((sum, w) => sum + w.annotations.length, 0);

  return {
    totalWorks: works.length,
    totalAuthors: authorCount,
    totalDynasties: dynastySet.size,
    totalThemes: themeSet.size,
    totalChars,
    avgChars,
    maxCharWork: { title: maxCharWork?.title || '', count: maxCharWork?.stats?.charCount || 0 },
    minCharWork: { title: minCharWork?.title || '', count: minCharWork?.stats?.charCount || 0 },
    poetryCount,
    proseCount,
    topDynasty: { name: topDynasty?.[0] || '', count: topDynasty?.[1] || 0 },
    topAuthor: { name: topAuthor?.[0] || '', count: topAuthor?.[1] || 0 },
    topTheme: { name: topTheme?.[0] || '', count: topTheme?.[1] || 0 },
    totalAnnotations,
  };
}

/** Get author ranking data for table display */
export function getAuthorRanking(topN: number = 15) {
  const works = getAllWorks();
  const authorMap: Record<string, { count: number; dynasty: string; workIds: string[] }> = {};

  for (const w of works) {
    if (!authorMap[w.author]) {
      authorMap[w.author] = { count: 0, dynasty: w.dynasty, workIds: [] };
    }
    authorMap[w.author].count++;
    authorMap[w.author].workIds.push(w.id);
  }

  return Object.entries(authorMap)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, topN)
    .map(([name, info]) => ({
      name,
      dynasty: info.dynasty,
      count: info.count,
      representative: info.workIds[0] || '',
    }));
}
