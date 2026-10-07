/**
 * 搜索关键词高亮 + 上下文片段工具函数
 */

/**
 * 在文本中查找关键词，返回带高亮标记的 JSX 数组
 * @param text - 原始文本
 * @param keyword - 搜索关键词
 * @param highlightClassName - 高亮 CSS 类名
 * @returns React 节点数组（关键词用 <mark> 包裹）
 */
export function highlightText(
  text: string,
  keyword: string,
  highlightClassName = 'search-highlight'
): React.ReactNode[] {
  if (!keyword.trim()) return [text];

  const lowerText = text.toLowerCase();
  const lowerKW = keyword.toLowerCase();
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  let idx = lowerText.indexOf(lowerKW, lastIndex);
  while (idx !== -1) {
    // 关键词前的普通文本
    if (idx > lastIndex) {
      parts.push(text.slice(lastIndex, idx));
    }
    // 高亮关键词
    parts.push(
      <mark key={key++} className={highlightClassName}>
        {text.slice(idx, idx + keyword.length)}
      </mark>
    );
    lastIndex = idx + keyword.length;
    idx = lowerText.indexOf(lowerKW, lastIndex);
  }

  // 剩余普通文本
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/**
 * 从文本中提取包含关键词的上下文片段（前后各截取若干字符）
 * @param text - 原始文本
 * @param keyword - 搜索关键词
 * @param contextLen - 上下文字符数（默认 8）
 * @param maxSnippets - 最多返回片段数（默认 2）
 * @returns 上下文片段数组，如 ["床前...明月光，疑..."]
 */
export function getContextSnippets(
  text: string,
  keyword: string,
  contextLen = 8,
  maxSnippets = 2
): string[] {
  if (!keyword.trim()) return [];

  const lowerText = text.toLowerCase();
  const lowerKW = keyword.toLowerCase();
  const snippets: string[] = [];
  let searchFrom = 0;
  let count = 0;

  while (count < maxSnippets) {
    const idx = lowerText.indexOf(lowerKW, searchFrom);
    if (idx === -1) break;

    const start = Math.max(0, idx - contextLen);
    const end = Math.min(text.length, idx + keyword.length + contextLen);

    const prefix = start > 0 ? '...' : '';
    const suffix = end < text.length ? '...' : '';
    const fragment = text.slice(start, end);

    // 避免重复片段
    const snippet = `${prefix}${fragment}${suffix}`;
    if (!snippets.includes(snippet)) {
      snippets.push(snippet);
    }

    count++;
    searchFrom = idx + keyword.length;
  }

  return snippets;
}

/**
 * 截断文本，保留关键词所在的上下文
 * 优先保留含关键词的片段，而非固定从头截断
 */
export function smartTruncate(
  text: string,
  keyword: string,
  maxLen = 60
): string {
  if (!keyword.trim()) {
    return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
  }

  const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (idx === -1) {
    return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
  }

  // 以关键词为中心，前后各取 maxLen/2
  const half = Math.floor(maxLen / 2);
  const start = Math.max(0, idx - half);
  const end = Math.min(text.length, idx + keyword.length + half);

  const prefix = start > 0 ? '...' : '';
  const suffix = end < text.length ? '...' : '';
  return `${prefix}${text.slice(start, end)}${suffix}`;
}
