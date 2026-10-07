import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavoriteStore } from '@/stores/useFavoriteStore';
import { cn } from '@/lib/utils';
import { useState, useCallback, useEffect } from 'react';

interface FavoriteButtonProps {
  workId: string;
  className?: string;
}

export default function FavoriteButton({ workId, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const favorite = isFavorite(workId);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(null), 2000);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8', className)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(workId);
          setToastMsg(favorite ? '已取消收藏' : '已收藏到本地');
        }}
      >
        <Heart
          className={cn(
            'h-4 w-4 transition-colors',
            favorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
          )}
        />
      </Button>
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
            <span>{favorite ? '♡️' : '❤️'}</span>
            <span>{toastMsg}</span>
          </div>
        </div>
      )}
    </>
  );
}
