import { STAGES, DYNASTIES, GENRE_CATEGORIES, SUB_GENRES, THEMES } from '@/types';
import type { Stage, Dynasty, GenreCategory, SubGenre, Theme, FilterState } from '@/types';
import { useWorkStore } from '@/stores/useWorkStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  showStageFilter?: boolean;
  showGenreFilter?: boolean;
  showDynastyFilter?: boolean;
  showThemeFilter?: boolean;
}

export default function FilterBar({
  showStageFilter = true,
  showGenreFilter = true,
  showDynastyFilter = true,
  showThemeFilter = true,
}: FilterBarProps) {
  const { filter, setFilter, resetFilter } = useWorkStore();

  const hasActiveFilters =
    filter.stage.length > 0 ||
    filter.genreCategory.length > 0 ||
    filter.dynasty.length > 0 ||
    filter.themes.length > 0;

  const toggleArrayFilter = <T extends string>(key: keyof FilterState, value: T) => {
    const currentArray = filter[key] as T[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    setFilter({ [key]: newArray });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>筛选</span>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilter} className="text-xs">
            <X className="h-3 w-3 mr-1" />
            清除筛选
          </Button>
        )}
      </div>

      {/* Stage filter */}
      {showStageFilter && (
        <div className="flex flex-wrap gap-1.5">
          {STAGES.map((stage) => (
            <Badge
              key={stage}
              variant={filter.stage.includes(stage) ? 'default' : 'outline'}
              className={cn('cursor-pointer select-none', filter.stage.includes(stage) && 'bg-primary')}
              onClick={() => toggleArrayFilter<Stage>('stage', stage)}
            >
              {stage}
            </Badge>
          ))}
        </div>
      )}

      {/* Genre filter */}
      {showGenreFilter && (
        <div className="flex flex-wrap gap-1.5">
          {GENRE_CATEGORIES.map((gc) => (
            <Badge
              key={gc}
              variant={filter.genreCategory.includes(gc) ? 'default' : 'outline'}
              className={cn('cursor-pointer select-none', filter.genreCategory.includes(gc) && 'bg-primary')}
              onClick={() => toggleArrayFilter<GenreCategory>('genreCategory', gc)}
            >
              {gc}
            </Badge>
          ))}
          {SUB_GENRES.map((sg) => (
            <Badge
              key={sg}
              variant={filter.subGenre.includes(sg) ? 'default' : 'outline'}
              className={cn('cursor-pointer select-none text-xs', filter.subGenre.includes(sg) && 'bg-primary')}
              onClick={() => toggleArrayFilter<SubGenre>('subGenre', sg)}
            >
              {sg}
            </Badge>
          ))}
        </div>
      )}

      {/* Dynasty filter */}
      {showDynastyFilter && (
        <div className="flex flex-wrap gap-1.5">
          {DYNASTIES.map((d) => (
            <Badge
              key={d}
              variant={filter.dynasty.includes(d) ? 'default' : 'outline'}
              className={cn('cursor-pointer select-none', filter.dynasty.includes(d) && 'bg-primary')}
              onClick={() => toggleArrayFilter<Dynasty>('dynasty', d)}
            >
              {d}
            </Badge>
          ))}
        </div>
      )}

      {/* Theme filter */}
      {showThemeFilter && (
        <div className="flex flex-wrap gap-1.5">
          {THEMES.map((t) => (
            <span
              key={t}
              onClick={() => toggleArrayFilter<Theme>('themes', t)}
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer select-none transition-all duration-200 theme-badge-${t} ${
                filter.themes.includes(t)
                  ? 'ring-2 ring-primary/40 ring-offset-1 scale-105'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
