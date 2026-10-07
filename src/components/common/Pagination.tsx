import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (page > 3) pages.push('...');

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-1 py-4">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={page === p ? 'default' : 'outline'}
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <span className="text-xs text-muted-foreground ml-2">
        共 {total} 篇
      </span>
    </div>
  );
}
