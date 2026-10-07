import { useCallback } from 'react';
import { useWorkStore } from '@/stores/useWorkStore';
import { useSearchHistoryStore } from '@/stores/useSearchHistoryStore';

export function useSearch() {
  const { keyword, setKeyword, results, refreshResults } = useWorkStore();
  const { addHistory } = useSearchHistoryStore();

  const search = useCallback(
    (kw: string) => {
      setKeyword(kw);
      if (kw.trim()) {
        addHistory(kw);
      }
    },
    [setKeyword, addHistory]
  );

  const clear = useCallback(() => {
    setKeyword('');
  }, [setKeyword]);

  return { keyword, results, search, clear, refreshResults };
}
