import { create } from 'zustand';
import type { ClassicalWork, FilterState, PaginationState } from '../types';
import { getAllWorks } from '../services/DataService';
import { searchAndFilter } from '../services/SearchService';
import { DEFAULT_PAGE_SIZE } from '../data/constants';

interface WorkStore {
  /** Current search keyword */
  keyword: string;
  /** Current filter state */
  filter: FilterState;
  /** Pagination state */
  pagination: PaginationState;
  /** Filtered results */
  results: ClassicalWork[];
  /** Set search keyword and update results */
  setKeyword: (keyword: string) => void;
  /** Set filter (merge) and update results */
  setFilter: (filter: Partial<FilterState>) => void;
  /** Replace entire filter (no merge) and update results */
  setFilterReplace: (filter: Partial<FilterState>) => void;
  /** Reset all filters */
  resetFilter: () => void;
  /** Set page */
  setPage: (page: number) => void;
  /** Set page size */
  setPageSize: (size: number) => void;
  /** Refresh results based on current keyword and filter */
  refreshResults: () => void;
}

const initialFilter: FilterState = {
  stage: [],
  grade: [],
  genreCategory: [],
  subGenre: [],
  dynasty: [],
  themes: [],
};

export const useWorkStore = create<WorkStore>()((set, get) => ({
  keyword: '',
  filter: { ...initialFilter },
  pagination: { page: 1, pageSize: DEFAULT_PAGE_SIZE, total: 0 },
  results: getAllWorks(),

  setKeyword: (keyword) => {
    set({ keyword });
    get().refreshResults();
  },

  setFilter: (partialFilter) => {
    const newFilter = { ...get().filter, ...partialFilter };
    set({ filter: newFilter, pagination: { ...get().pagination, page: 1 } });
    get().refreshResults();
  },

  setFilterReplace: (partialFilter) => {
    const newFilter = { ...initialFilter, ...partialFilter };
    set({ filter: newFilter, keyword: '', pagination: { ...get().pagination, page: 1 } });
    get().refreshResults();
  },

  resetFilter: () => {
    set({ filter: { ...initialFilter }, keyword: '', pagination: { ...get().pagination, page: 1 } });
    get().refreshResults();
  },

  setPage: (page) => {
    set({ pagination: { ...get().pagination, page } });
  },

  setPageSize: (pageSize) => {
    set({ pagination: { ...get().pagination, pageSize, page: 1 } });
  },

  refreshResults: () => {
    const { keyword, filter, pagination } = get();
    const results = searchAndFilter(keyword, filter);
    set({
      results,
      pagination: { ...pagination, total: results.length },
    });
  },
}));
