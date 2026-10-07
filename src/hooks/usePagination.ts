import { useMemo } from 'react';
import { useWorkStore } from '@/stores/useWorkStore';
import type { ClassicalWork } from '@/types';

export function usePagination() {
  const { results, pagination, setPage } = useWorkStore();
  const { page, pageSize } = pagination;

  const paginatedResults = useMemo(() => {
    const start = (page - 1) * pageSize;
    return results.slice(start, start + pageSize);
  }, [results, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));

  return {
    currentItems: paginatedResults,
    currentPage: page,
    pageSize,
    totalItems: results.length,
    totalPages,
    setPage,
  };
}
