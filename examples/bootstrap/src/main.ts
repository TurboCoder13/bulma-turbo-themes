import { themeIds, flavors } from '@lgtm-hq/turbo-themes-core/tokens';

const STORAGE_KEY = 'turbo-theme';
const DEFAULT_THEME = 'catppuccin-mocha';

// Import theme IDs from core package (single source of truth)
const VALID_THEMES = themeIds;

type ThemeId = (typeof themeIds)[number];

// Derive light themes from flavor appearance (single source of truth)
const LIGHT_THEMES: string[] = flavors.filter((f) => f.appearance === 'light').map((f) => f.id);

function isValidTheme(theme: string): theme is ThemeId {
  return VALID_THEMES.includes(theme as ThemeId);
}

function applyTheme(themeId: ThemeId): void {
  // Set data-theme attribute
  document.documentElement.setAttribute('data-theme', themeId);

  // Set Bootstrap's data-bs-theme for light/dark mode
  const bsTheme = LIGHT_THEMES.includes(themeId) ? 'light' : 'dark';
  document.documentElement.setAttribute('data-bs-theme', bsTheme);

  // Update CSS link
  const themeLink = document.getElementById('theme-css') as HTMLLinkElement | null;
  if (themeLink) {
    themeLink.href = `./turbo-themes/themes/${themeId}.css`;
  }

  // Update footer display
  const currentThemeEl = document.getElementById('current-theme');
  if (currentThemeEl) {
    currentThemeEl.textContent = themeId;
  }

  // Persist to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {
    console.warn('Could not persist theme selection');
  }
}

function getInitialTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isValidTheme(saved)) {
      return saved;
    }
  } catch {
    // localStorage not available
  }
  return DEFAULT_THEME;
}

function init(): void {
  const selector = document.getElementById('theme-selector') as HTMLSelectElement | null;

  if (!selector) {
    console.warn('Theme selector not found');
    return;
  }

  // Set initial value
  const initialTheme = getInitialTheme();
  selector.value = initialTheme;
  applyTheme(initialTheme);

  // Listen for changes
  selector.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    const newTheme = target.value;

    if (isValidTheme(newTheme)) {
      applyTheme(newTheme);
    } else {
      console.warn('Invalid theme selected:', newTheme);
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
