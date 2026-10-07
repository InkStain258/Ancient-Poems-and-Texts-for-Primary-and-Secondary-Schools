import type { ClassicalWork, Stage, Dynasty, GenreCategory, SubGenre, Theme } from '../types';
import { primaryWorks } from '../data/primary';
import { middleWorks } from '../data/middle';
import { highWorks } from '../data/high';

/** All works combined, lazily initialized */
let allWorksCache: ClassicalWork[] | null = null;

/** Get all works from all stages */
export function getAllWorks(): ClassicalWork[] {
  if (!allWorksCache) {
    allWorksCache = [...primaryWorks, ...middleWorks, ...highWorks];
  }
  return allWorksCache;
}

/** Get works by stage */
export function getWorksByStage(stage: Stage): ClassicalWork[] {
  return getAllWorks().filter((w) => w.gradeLevel.stage === stage);
}

/** Get a single work by ID */
export function getWorkById(id: string): ClassicalWork | undefined {
  return getAllWorks().find((w) => w.id === id);
}

/** Get works by author name */
export function getWorksByAuthor(author: string): ClassicalWork[] {
  return getAllWorks().filter((w) => w.author === author);
}

/** Get works by dynasty */
export function getWorksByDynasty(dynasty: Dynasty): ClassicalWork[] {
  return getAllWorks().filter((w) => w.dynasty === dynasty);
}

/** Get works by genre category */
export function getWorksByGenreCategory(category: GenreCategory): ClassicalWork[] {
  return getAllWorks().filter((w) => w.genre.category === category);
}

/** Get works by sub-genre */
export function getWorksBySubGenre(subGenre: SubGenre): ClassicalWork[] {
  return getAllWorks().filter((w) => w.genre.subGenre === subGenre);
}

/** Get works by theme */
export function getWorksByTheme(theme: Theme): ClassicalWork[] {
  return getAllWorks().filter((w) => w.themes.includes(theme));
}

/** Get related works (same author, dynasty, or themes) */
export function getRelatedWorks(workId: string, limit: number = 6): ClassicalWork[] {
  const work = getWorkById(workId);
  if (!work) return [];

  const allWorks = getAllWorks().filter((w) => w.id !== workId);
  const scored = allWorks.map((w) => {
    let score = 0;
    if (w.author === work.author) score += 3;
    if (w.dynasty === work.dynasty) score += 2;
    const sharedThemes = w.themes.filter((t) => work.themes.includes(t));
    score += sharedThemes.length * 1;
    return { work: w, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.work);
}

/** Get total work count */
export function getTotalCount(): number {
  return getAllWorks().length;
}

/** Get counts by stage */
export function getCountsByStage(): Record<Stage, number> {
  const works = getAllWorks();
  return {
    '小学': works.filter((w) => w.gradeLevel.stage === '小学').length,
    '初中': works.filter((w) => w.gradeLevel.stage === '初中').length,
    '高中': works.filter((w) => w.gradeLevel.stage === '高中').length,
  };
}

/** Get counts by dynasty */
export function getCountsByDynasty(): Record<string, number> {
  const works = getAllWorks();
  const counts: Record<string, number> = {};
  for (const w of works) {
    counts[w.dynasty] = (counts[w.dynasty] || 0) + 1;
  }
  return counts;
}

/** Get counts by theme */
export function getCountsByTheme(): Record<string, number> {
  const works = getAllWorks();
  const counts: Record<string, number> = {};
  for (const w of works) {
    for (const t of w.themes) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }
  return counts;
}

/** Get unique author names */
export function getUniqueAuthors(): string[] {
  const works = getAllWorks();
  return [...new Set(works.map((w) => w.author))];
}

/** Get summary statistics for homepage */
export function getSummaryStats() {
  const works = getAllWorks();
  const authors = new Set(works.map(w => w.author));
  const dynasties = new Set(works.map(w => w.dynasty));
  const themes = new Set(works.flatMap(w => w.themes));
  return {
    totalWorks: works.length,
    totalAuthors: authors.size,
    totalDynasties: dynasties.size,
    totalThemes: themes.size,
    totalStages: 3,
  };
}
