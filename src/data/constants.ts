/** localStorage key prefix for the app */
export const STORAGE_PREFIX = 'bbc_';

/** localStorage keys */
export const STORAGE_KEYS = {
  favorites: `${STORAGE_PREFIX}favorites`,
  searchHistory: `${STORAGE_PREFIX}search_history`,
  theme: `${STORAGE_PREFIX}theme`,
  recentViewed: `${STORAGE_PREFIX}recent_viewed`,
} as const;

/** Maximum search history entries */
export const MAX_SEARCH_HISTORY = 20;

/** Maximum recent viewed works */
export const MAX_RECENT_VIEWED = 10;

/** Default page size for pagination */
export const DEFAULT_PAGE_SIZE = 12;

/** Site metadata */
export const SITE_META = {
  name: '部编古诗文',
  fullName: '部编版语文古诗文文化网站',
  description: '探索中华经典诗文之美',
  version: '1.0.0',
} as const;

/** Primary color palette for the app */
export const APP_COLORS = {
  primary: '#8B4513',
  secondary: '#D2691E',
  accent: '#CD853F',
  background: '#FFF8F0',
  darkBackground: '#1a1410',
} as const;
