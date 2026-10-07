import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '@/components/common/SearchBar';
import FilterBar from '@/components/common/FilterBar';
import WorkCard from '@/components/common/WorkCard';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import { useWorkStore } from '@/stores/useWorkStore';
import { usePagination } from '@/hooks/usePagination';

export default function WorkListPage() {
  const [searchParams] = useSearchParams();
  const { keyword, setKeyword, filter, setFilter, setFilterReplace, pagination, setPage } = useWorkStore();
  const { currentItems, totalItems } = usePagination();

  // Apply URL params on mount — use replace to clear any stale filters
  useEffect(() => {
    const stage = searchParams.get('stage');
    const dynasty = searchParams.get('dynasty');
    const theme = searchParams.get('theme');
    const genreCategory = searchParams.get('genreCategory');
    const subGenre = searchParams.get('subGenre');
    const grade = searchParams.get('grade');

    const updates: Record<string, string[]> = {};
    if (stage) updates.stage = [stage];
    if (dynasty) updates.dynasty = [dynasty];
    if (theme) updates.themes = [theme];
    if (genreCategory) updates.genreCategory = [genreCategory];
    if (subGenre) updates.subGenre = [subGenre];
    if (grade) updates.grade = [grade];

    if (Object.keys(updates).length > 0) {
      setFilterReplace(updates as Parameters<typeof setFilterReplace>[0]);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Banner with ink painting */}
      <div className="relative rounded-xl overflow-hidden py-10 px-6 text-center animate-fade-in-up">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{ backgroundImage: "url('./images/ink-bridge.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40 pointer-events-none" />
        {/* Floating ink dots */}
        <div className="ink-dot absolute top-4 left-8 opacity-30" />
        <div className="ink-dot absolute bottom-6 right-10 opacity-20" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold poem-title brush-underline pb-1 inline-block">诗文列表</h1>
          <p className="text-sm text-muted-foreground mt-3 verse-highlight inline-block px-3 py-1">漫步古诗文长廊，寻一段千年回响</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in-up stagger-1">
        <div className="w-full max-w-md">
          <SearchBar />
        </div>
      </div>

      <FilterBar />

      {/* Results count */}
      <p className="text-sm text-muted-foreground animate-fade-in-up stagger-2">
        共找到 <span className="font-semibold text-foreground">{totalItems}</span> 篇诗文
        {keyword && <span>，搜索关键词：<span className="font-medium text-primary">"{keyword}"</span></span>}
      </p>

      {/* Search context snippets (shown when keyword is active) */}

      {/* Work grid */}
      {currentItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((work, i) => (
              <div key={work.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i * 50, 500)}ms` }}>
                <WorkCard work={work} keyword={keyword || undefined} />
              </div>
            ))}
          </div>
          <Pagination
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={totalItems}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState
          title="未找到诗文"
          description="尝试调整搜索关键词或筛选条件"
        />
      )}

      {/* Bottom poetic divider */}
      <div className="pt-4 text-center">
        <div className="ink-divider max-w-xs mx-auto" />
        <p className="mt-3 text-xs text-muted-foreground/50 poem-text">文章本天成，妙手偶得之</p>
      </div>
    </div>
  );
}
