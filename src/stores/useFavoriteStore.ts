import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteStore {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (id) =>
        set({
          favoriteIds: get().favoriteIds.includes(id)
            ? get().favoriteIds.filter((f) => f !== id)
            : [...get().favoriteIds, id],
        }),
      isFavorite: (id) => get().favoriteIds.includes(id),
      clearFavorites: () => set({ favoriteIds: [] }),
    }),
    { name: 'bbc_favorites' }
  )
);
