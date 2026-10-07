import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoryGrid from '@/components/common/CategoryGrid';
import { dynastyCategories, themeCategories, gradeCategories } from '@/data/categories';
import { GENRE_CATEGORIES, SUB_GENRES } from '@/types';
import type { CategoryEntry } from '@/types';
import { getAllWorks, getCountsByDynasty, getCountsByTheme } from '@/services/DataService';

/** Build category entries with counts populated from actual data */
function buildGenreCategories(): CategoryEntry[] {
  const works = getAllWorks();
  return GENRE_CATEGORIES.map((g) => ({
    label: g,
    value: g,
    count: works.filter((w) => w.genre.category === g).length,
    icon: g === '诗' ? '📜' : '📖',
  }));
}

function buildSubGenreCategories(): CategoryEntry[] {
  const works = getAllWorks();
  return SUB_GENRES.map((s) => ({
    label: s,
    value: s,
    count: works.filter((w) => w.genre.subGenre === s).length,
  }));
}

function buildDynastyCategoriesWithCounts(): CategoryEntry[] {
  const counts = getCountsByDynasty();
  return dynastyCategories.map((d) => ({
    ...d,
    count: counts[d.value] || 0,
  }));
}

function buildThemeCategoriesWithCounts(): CategoryEntry[] {
  const counts = getCountsByTheme();
  return themeCategories.map((t) => ({
    ...t,
    count: counts[t.value] || 0,
  }));
}

function buildGradeCategoriesWithCounts(): Record<string, CategoryEntry[]> {
  const works = getAllWorks();
  const result: Record<string, CategoryEntry[]> = {};
  for (const [stage, entries] of Object.entries(gradeCategories)) {
    result[stage] = entries.map((e) => ({
      ...e,
      count: works.filter((w) => w.gradeLevel.stage === stage && w.gradeLevel.grade === e.value).length,
    }));
  }
  return result;
}

export default function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'genre';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const gradeCategoriesWithCounts = buildGradeCategoriesWithCounts();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Banner with enhanced visuals */}
      <div className="relative rounded-xl overflow-hidden animate-fade-in-up">
        <img
          src="./images/ink-pavilion.webp"
          alt=""
          className="w-full h-28 md:h-36 object-cover opacity-10 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/30 pointer-events-none" />
        <div className="ink-dot absolute top-3 right-6 opacity-25" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <h1 className="text-3xl font-bold poem-title brush-underline pb-1">分类浏览</h1>
          <p className="text-sm text-muted-foreground mt-2 verse-highlight inline-block px-3 py-1">千丝万缕，各有归属</p>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
        <TabsList className="animate-fade-in-up stagger-1">
          <TabsTrigger value="genre">文体</TabsTrigger>
          <TabsTrigger value="grade">年级</TabsTrigger>
          <TabsTrigger value="theme">主题</TabsTrigger>
          <TabsTrigger value="dynasty">朝代</TabsTrigger>
        </TabsList>

        <TabsContent value="genre" className="space-y-6">
          <CategoryGrid
            title="文体分类"
            categories={buildGenreCategories()}
            basePath="/works"
            filterKey="genreCategory"
          />
          <CategoryGrid
            title="子文体分类"
            categories={buildSubGenreCategories()}
            basePath="/works"
            filterKey="subGenre"
          />
        </TabsContent>

        <TabsContent value="grade" className="space-y-6">
          {Object.entries(gradeCategoriesWithCounts).map(([stage, entries]) => (
            <CategoryGrid
              key={stage}
              title={`${stage}`}
              categories={entries}
              basePath="/works"
              filterKey="grade"
            />
          ))}
        </TabsContent>

        <TabsContent value="theme">
          <CategoryGrid
            title="主题分类"
            categories={buildThemeCategoriesWithCounts()}
            basePath="/works"
            filterKey="theme"
          />
        </TabsContent>

        <TabsContent value="dynasty">
          <CategoryGrid
            title="朝代分类"
            categories={buildDynastyCategoriesWithCounts()}
            basePath="/works"
            filterKey="dynasty"
          />
        </TabsContent>
      </Tabs>

      {/* Bottom poetic divider */}
      <div className="pt-4 text-center">
        <div className="ink-divider max-w-xs mx-auto" />
        <p className="mt-3 text-xs text-muted-foreground/50 poem-text">物以类聚，诗以群分</p>
      </div>
    </div>
  );
}
