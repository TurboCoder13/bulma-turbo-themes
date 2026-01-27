import { ref, onMounted, watch } from 'vue';
import { themeIds, flavors } from '@lgtm-hq/turbo-themes-core/tokens';

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

function applyThemeToDOM(themeId: ThemeId): void {
  document.documentElement.setAttribute('data-theme', themeId);

  const themeLink = document.getElementById('theme-css') as HTMLLinkElement | null;
  if (themeLink) {
    themeLink.href = `./turbo-themes/themes/${themeId}.css`;
  }

  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {
    console.warn('Could not persist theme selection');
  }
}

export function useTheme() {
  const theme = ref<ThemeId>(getInitialTheme());

  function setTheme(newTheme: ThemeId) {
    if (!VALID_THEMES.includes(newTheme)) {
      console.warn('Invalid theme ID:', newTheme);
      return;
    }
    theme.value = newTheme;
  }

  // Apply theme to DOM when it changes
  watch(
    theme,
    (newTheme) => {
      applyThemeToDOM(newTheme);
    },
    { immediate: true }
  );

  // Ensure DOM is in sync on mount
  onMounted(() => {
    applyThemeToDOM(theme.value);
  });

  return {
    theme,
    setTheme,
    themes: THEME_OPTIONS,
  };
}
