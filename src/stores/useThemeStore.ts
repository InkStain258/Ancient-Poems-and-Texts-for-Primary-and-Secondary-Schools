import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** Resolved effective theme (light or dark) */
  effectiveTheme: 'light' | 'dark';
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') return getSystemTheme();
  return mode;
}

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => {
      const initialEffective = resolveTheme('system');
      applyTheme(initialEffective);

      return {
        mode: 'system',
        effectiveTheme: initialEffective,
        setMode: (mode) => {
          const effectiveTheme = resolveTheme(mode);
          applyTheme(effectiveTheme);
          set({ mode, effectiveTheme });
        },
      };
    },
    {
      name: 'bbc_theme',
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            const effective = resolveTheme(state.mode);
            applyTheme(effective);
            state.effectiveTheme = effective;
          }
        };
      },
    }
  )
);

// Listen for system theme changes
if (typeof window !== 'undefined' && window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const store = useThemeStore.getState();
    if (store.mode === 'system') {
      const effectiveTheme = getSystemTheme();
      applyTheme(effectiveTheme);
      useThemeStore.setState({ effectiveTheme });
    }
  });
}
