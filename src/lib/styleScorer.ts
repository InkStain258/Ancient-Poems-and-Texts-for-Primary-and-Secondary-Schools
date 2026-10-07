/**
 * 诗词风格评分算法
 *
 * 6 维度：写景 / 抒情 / 叙事 / 哲理 / 豪放 / 婉约
 * 每维度 0-100 分，基于 themes / genre / subGenre / visualization / 文本特征综合判定
 */

export interface StyleScores {
  写景: number;
  抒情: number;
  叙事: number;
  哲理: number;
  豪放: number;
  婉约: number;
}

export type StyleDimension = keyof StyleScores;

export const STYLE_DIMENSIONS: StyleDimension[] = ['写景', '抒情', '叙事', '哲理', '豪放', '婉约'];

export const DIMENSION_LABELS: Record<StyleDimension, string> = {
  写景: '写景描摹',
  抒情: '抒情达意',
  叙事: '叙事铺陈',
  哲理: '哲思理趣',
  豪放: '豪迈奔放',
  婉约: '婉约含蓄',
};

export const DIMENSION_COLORS: Record<StyleDimension, string> = {
  写景: '#4ade80',
  抒情: '#f472b6',
  叙事: '#60a5fa',
  哲理: '#a78bfa',
  豪放: '#f97316',
  婉约: '#67e8f9',
};

import type { ClassicalWork, Theme, SubGenre, VisualizationType } from '@/types';

/** theme → 各维度的贡献值 */
const THEME_SCORES: Record<Theme, Partial<StyleScores>> = {
  '爱国': { 豪放: 35, 叙事: 15 },
  '山水': { 写景: 40, 哲理: 10 },
  '友情': { 抒情: 30, 叙事: 10 },
  '思乡': { 抒情: 35, 婉约: 15 },
  '哲理': { 哲理: 45 },
  '田园': { 写景: 35, 婉约: 10 },
  '战争': { 豪放: 35, 叙事: 20 },
  '咏物': { 写景: 25, 哲理: 10 },
  '咏史': { 叙事: 30, 哲理: 15 },
  '送别': { 抒情: 30, 婉约: 20 },
  '边塞': { 豪放: 35, 写景: 15 },
  '闺怨': { 婉约: 40, 抒情: 20 },
  '节日': { 叙事: 15, 抒情: 15 },
  '人生': { 哲理: 30, 抒情: 15 },
  '爱情': { 婉约: 30, 抒情: 25 },
};

/** subGenre → 各维度的贡献值 */
const SUBGENRE_SCORES: Record<SubGenre, Partial<StyleScores>> = {
  '古体诗': { 叙事: 15, 豪放: 10 },
  '近体诗': { 抒情: 15, 婉约: 10 },
  '词': { 抒情: 20, 婉约: 15 },
  '曲': { 叙事: 15, 抒情: 10 },
  '记叙文': { 叙事: 40 },
  '说理文': { 哲理: 40 },
  '写景文': { 写景: 40 },
  '抒情文': { 抒情: 35 },
  '豪放派': { 豪放: 50 },
  '婉约派': { 婉约: 50 },
};

/** visualization type → 维度加成 */
const VIZ_SCORES: Record<VisualizationType, Partial<StyleScores>> = {
  'narrative': { 叙事: 25 },
  'scenic': { 写景: 25 },
  'lyrical': { 抒情: 25 },
  'none': {},
};

/** 文本特征关键词加分 */
const TEXT_KEYWORD_SCORES: Record<string, Partial<StyleScores>> = {
  // 豪放特征
  '大江': { 豪放: 8 }, '万里': { 豪放: 6 }, '千古': { 豪放: 6 }, '苍茫': { 豪放: 5 },
  '天地': { 豪放: 6 }, '长风': { 豪放: 5 }, '破': { 豪放: 4 }, '壮': { 豪放: 5 },
  '豪': { 豪放: 4 }, '雄': { 豪放: 5 }, '狂': { 豪放: 5 }, '烈': { 豪放: 4 },
  // 婉约特征
  '相思': { 婉约: 8 }, '愁': { 婉约: 5 }, '泪': { 婉约: 6 }, '寂寞': { 婉约: 6 },
  '芳': { 婉约: 4 }, '柔情': { 婉约: 6 }, '细': { 婉约: 3 }, '幽': { 婉约: 4 },
  '怜': { 婉约: 5 }, '叹': { 婉约: 4 }, '忆': { 婉约: 4 },
  // 写景特征
  '青山': { 写景: 6 }, '碧': { 写景: 4 }, '翠': { 写景: 4 }, '云': { 写景: 3 },
  '月': { 写景: 3 }, '日': { 写景: 3 }, '山': { 写景: 3 }, '水': { 写景: 3 },
  '花': { 写景: 3 }, '树': { 写景: 3 }, '风': { 写景: 2 },
  // 哲理特征
  '道': { 哲理: 5 }, '理': { 哲理: 5 }, '悟': { 哲理: 6 }, '知': { 哲理: 3 },
  '生': { 哲理: 3 }, '死': { 哲理: 4 }, '命': { 哲理: 4 },
};

/** 为一首作品计算 6 维风格评分 */
export function computeStyleScores(work: ClassicalWork): StyleScores {
  const scores: StyleScores = { 写景: 0, 抒情: 0, 叙事: 0, 哲理: 0, 豪放: 0, 婉约: 0 };

  // 1. themes 贡献
  for (const theme of work.themes) {
    const ts = THEME_SCORES[theme];
    if (ts) {
      for (const [dim, val] of Object.entries(ts)) {
        scores[dim as StyleDimension] += val;
      }
    }
  }

  // 2. subGenre 贡献
  const sgs = SUBGENRE_SCORES[work.genre.subGenre];
  if (sgs) {
    for (const [dim, val] of Object.entries(sgs)) {
      scores[dim as StyleDimension] += val;
    }
  }

  // 3. visualization 贡献
  if (work.visualization) {
    const vs = VIZ_SCORES[work.visualization.type];
    if (vs) {
      for (const [dim, val] of Object.entries(vs)) {
        scores[dim as StyleDimension] += val;
      }
    }
  }

  // 4. 文本关键词贡献
  const text = work.text.original;
  for (const [keyword, ks] of Object.entries(TEXT_KEYWORD_SCORES)) {
    if (text.includes(keyword)) {
      for (const [dim, val] of Object.entries(ks)) {
        scores[dim as StyleDimension] += val;
      }
    }
  }

  // 5. 基础分（确保每首诗都有最低表现）
  for (const dim of STYLE_DIMENSIONS) {
    scores[dim] += 5;
  }

  // 6. 归一化到 0-100
  for (const dim of STYLE_DIMENSIONS) {
    scores[dim] = Math.min(100, Math.max(0, Math.round(scores[dim])));
  }

  return scores;
}

/** 缓存：workId → scores，避免重复计算 */
const scoreCache = new Map<string, StyleScores>();

/** 获取作品的风格评分（带缓存） */
export function getStyleScores(work: ClassicalWork): StyleScores {
  const cached = scoreCache.get(work.id);
  if (cached) return cached;
  const scores = computeStyleScores(work);
  scoreCache.set(work.id, scores);
  return scores;
}

/** 获取主导风格维度 */
export function getDominantStyle(scores: StyleScores): StyleDimension {
  let max = 0;
  let dominant: StyleDimension = '抒情';
  for (const dim of STYLE_DIMENSIONS) {
    if (scores[dim] > max) {
      max = scores[dim];
      dominant = dim;
    }
  }
  return dominant;
}
