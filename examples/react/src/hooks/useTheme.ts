import { useState, useEffect, useCallback } from 'react';
import { themeIds, flavors } from '@turbocoder13/turbo-themes-core/tokens';

const STORAGE_KEY = 'turbo-theme';
const DEFAULT_THEME = 'catppuccin-mocha';

// Import theme IDs from core package (single source of truth)
export const VALID_THEMES = themeIds;

export type ThemeId = (typeof themeIds)[number];

export interface ThemeOption {
  id: ThemeId;
  label: string;
}

// Generate theme options from core flavors
export const THEME_OPTIONS: ThemeOption[] = flavors.map((f) => ({
  id: f.id as ThemeId,
  label: f.label,
}));

function getInitialTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_THEMES.includes(saved as ThemeId)) {
      return saved as ThemeId;
    }
  } catch {
    // localStorage not available
  }
  return DEFAULT_THEME;
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(getInitialTheme);

  const setTheme = useCallback((newTheme: ThemeId) => {
    if (!VALID_THEMES.includes(newTheme)) {
      console.warn('Invalid theme ID:', newTheme);
      return;
    }

    setThemeState(newTheme);

    // Update DOM
    document.documentElement.setAttribute('data-theme', newTheme);

    // Update CSS link
    const themeLink = document.getElementById('theme-css') as HTMLLinkElement | null;
    if (themeLink) {
      themeLink.href = `./turbo-themes/themes/${newTheme}.css`;
    }

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      console.warn('Could not persist theme selection');
    }
  }, []);

  // Sync with DOM on mount
  useEffect(() => {
    // Validate theme before using in URL to prevent XSS
    if (!VALID_THEMES.includes(theme)) return;

    document.documentElement.setAttribute('data-theme', theme);
    const themeLink = document.getElementById('theme-css') as HTMLLinkElement | null;
    if (themeLink) {
      themeLink.href = `./turbo-themes/themes/${theme}.css`;
    }
  }, [theme]);

  return {
    theme,
    setTheme,
    themes: THEME_OPTIONS,
  };
}
