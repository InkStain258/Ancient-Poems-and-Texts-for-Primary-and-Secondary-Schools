import { useCallback } from 'react';
import { useWorkStore } from '@/stores/useWorkStore';
import type { FilterState, Stage, Dynasty, GenreCategory, SubGenre, Theme } from '@/types';

export function useFilter() {
  const { filter, setFilter, resetFilter } = useWorkStore();

  const toggleStage = useCallback(
    (stage: Stage) => {
      const stages = filter.stage.includes(stage)
        ? filter.stage.filter((s) => s !== stage)
        : [...filter.stage, stage];
      setFilter({ stage: stages });
    },
    [filter.stage, setFilter]
  );

  const toggleDynasty = useCallback(
    (dynasty: Dynasty) => {
      const dynasties = filter.dynasty.includes(dynasty)
        ? filter.dynasty.filter((d) => d !== dynasty)
        : [...filter.dynasty, dynasty];
      setFilter({ dynasty: dynasties });
    },
    [filter.dynasty, setFilter]
  );

  const toggleGenre = useCallback(
    (genre: GenreCategory) => {
      const genres = filter.genreCategory.includes(genre)
        ? filter.genreCategory.filter((g) => g !== genre)
        : [...filter.genreCategory, genre];
      setFilter({ genreCategory: genres });
    },
    [filter.genreCategory, setFilter]
  );

  const toggleTheme = useCallback(
    (theme: Theme) => {
      const themes = filter.themes.includes(theme)
        ? filter.themes.filter((t) => t !== theme)
        : [...filter.themes, theme];
      setFilter({ themes });
    },
    [filter.themes, setFilter]
  );

  const setFilterField = useCallback(
    (partial: Partial<FilterState>) => {
      setFilter(partial);
    },
    [setFilter]
  );

  return {
    filter,
    toggleStage,
    toggleDynasty,
    toggleGenre,
    toggleTheme,
    setFilter: setFilterField,
    resetFilter,
  };
}
