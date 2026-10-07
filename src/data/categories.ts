import type { CategoryEntry } from '../types';
import { DYNASTIES, THEMES, GENRE_CATEGORIES, SUB_GENRES } from '../types';

/** 文体分类 */
export const genreCategories: CategoryEntry[] = GENRE_CATEGORIES.map((g) => ({
  label: g,
  value: g,
  count: 0,
  icon: g === '诗' ? '📜' : '📖',
}));

/** 子文体分类 */
export const subGenreCategories: CategoryEntry[] = SUB_GENRES.map((s) => ({
  label: s,
  value: s,
  count: 0,
}));

/** 朝代分类 */
export const dynastyCategories: CategoryEntry[] = DYNASTIES.map((d) => ({
  label: d,
  value: d,
  count: 0,
  icon: d === '唐' ? '🏯' : d === '宋' ? '🎎' : d === '先秦' ? '🏺' : '🏛️',
}));

/** 主题分类 */
export const themeCategories: CategoryEntry[] = THEMES.map((t) => ({
  label: t,
  value: t,
  count: 0,
  icon:
    t === '爱国' ? '🇨🇳' :
    t === '山水' ? '🏔️' :
    t === '友情' ? '🤝' :
    t === '思乡' ? '🏠' :
    t === '哲理' ? '💡' :
    t === '田园' ? '🌾' :
    t === '战争' ? '⚔️' :
    t === '咏物' ? '🌸' :
    t === '咏史' ? '📜' :
    t === '送别' ? '👋' :
    t === '边塞' ? '🏰' :
    t === '闺怨' ? '💔' :
    t === '节日' ? '🎊' :
    t === '人生' ? '🌟' :
    '❤️',
}));

/** 年级分类 */
export const gradeCategories: Record<string, CategoryEntry[]> = {
  '小学': [
    { label: '一年级', value: '一年级', count: 0 },
    { label: '二年级', value: '二年级', count: 0 },
    { label: '三年级', value: '三年级', count: 0 },
    { label: '四年级', value: '四年级', count: 0 },
    { label: '五年级', value: '五年级', count: 0 },
    { label: '六年级', value: '六年级', count: 0 },
  ],
  '初中': [
    { label: '七年级', value: '七年级', count: 0 },
    { label: '八年级', value: '八年级', count: 0 },
    { label: '九年级', value: '九年级', count: 0 },
  ],
  '高中': [
    { label: '必修上册', value: '必修上册', count: 0 },
    { label: '必修下册', value: '必修下册', count: 0 },
    { label: '选择性必修上册', value: '选择性必修上册', count: 0 },
    { label: '选择性必修中册', value: '选择性必修中册', count: 0 },
    { label: '选择性必修下册', value: '选择性必修下册', count: 0 },
  ],
};
