import Fuse, { type IFuseOptions } from 'fuse.js';
import type { ClassicalWork, FilterState } from '../types';
import { getAllWorks } from './DataService';

/** Fuse.js options for fuzzy search */
const fuseOptions: IFuseOptions<ClassicalWork> = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'author', weight: 1.5 },
    { name: 'text.original', weight: 1 },
    { name: 'themes', weight: 1 },
    { name: 'dynasty', weight: 0.8 },
    { name: 'translation', weight: 0.5 },
  ],
  threshold: 0.3,
  includeScore: true,
};

/** Cached Fuse instance */
let fuseInstance: Fuse<ClassicalWork> | null = null;

/** Get or create Fuse instance */
function getFuse(): Fuse<ClassicalWork> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(getAllWorks(), fuseOptions);
  }
  return fuseInstance;
}

/** Search works by keyword using fuzzy matching */
export function searchWorks(keyword: string): ClassicalWork[] {
  if (!keyword.trim()) return getAllWorks();
  const fuse = getFuse();
  const results = fuse.search(keyword);
  return results.map((r) => r.item);
}

/** Filter works based on filter state */
export function filterWorks(works: ClassicalWork[], filter: FilterState): ClassicalWork[] {
  return works.filter((work) => {
    if (filter.stage.length > 0 && !filter.stage.includes(work.gradeLevel.stage)) {
      return false;
    }
    if (filter.grade.length > 0 && !filter.grade.includes(work.gradeLevel.grade)) {
      return false;
    }
    if (filter.genreCategory.length > 0 && !filter.genreCategory.includes(work.genre.category)) {
      return false;
    }
    if (filter.subGenre.length > 0 && !filter.subGenre.includes(work.genre.subGenre)) {
      return false;
    }
    if (filter.dynasty.length > 0 && !filter.dynasty.includes(work.dynasty)) {
      return false;
    }
    if (filter.themes.length > 0 && !work.themes.some((t) => filter.themes.includes(t))) {
      return false;
    }
    return true;
  });
}

/** Search and filter combined */
export function searchAndFilter(keyword: string, filter: FilterState): ClassicalWork[] {
  const searched = searchWorks(keyword);
  return filterWorks(searched, filter);
}
