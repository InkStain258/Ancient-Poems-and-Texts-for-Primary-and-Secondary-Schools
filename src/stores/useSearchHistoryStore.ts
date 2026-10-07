import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchHistoryItem } from '../types';
import { MAX_SEARCH_HISTORY } from '../data/constants';

interface SearchHistoryStore {
  history: SearchHistoryItem[];
  addHistory: (keyword: string) => void;
  removeHistory: (keyword: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryStore>()(
  persist(
    (set, get) => ({
      history: [],
      addHistory: (keyword) => {
        if (!keyword.trim()) return;
        const filtered = get().history.filter((h) => h.keyword !== keyword);
        const newItem: SearchHistoryItem = { keyword, timestamp: Date.now() };
        set({ history: [newItem, ...filtered].slice(0, MAX_SEARCH_HISTORY) });
      },
      removeHistory: (keyword) =>
        set({ history: get().history.filter((h) => h.keyword !== keyword) }),
      clearHistory: () => set({ history: [] }),
    }),
    { name: 'bbc_search_history' }
  )
);
