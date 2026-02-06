const THEMES = [
  { id: 'catppuccin-mocha', isLight: false },
  { id: 'catppuccin-macchiato', isLight: false },
  { id: 'catppuccin-frappe', isLight: false },
  { id: 'catppuccin-latte', isLight: true },
  { id: 'dracula', isLight: false },
  { id: 'gruvbox-dark-hard', isLight: false },
  { id: 'gruvbox-dark', isLight: false },
  { id: 'gruvbox-dark-soft', isLight: false },
  { id: 'gruvbox-light-hard', isLight: true },
  { id: 'gruvbox-light', isLight: true },
  { id: 'gruvbox-light-soft', isLight: true },
  { id: 'github-dark', isLight: false },
  { id: 'github-light', isLight: true },
  { id: 'bulma-dark', isLight: false },
  { id: 'bulma-light', isLight: true },
  { id: 'nord', isLight: false },
  { id: 'solarized-dark', isLight: false },
  { id: 'solarized-light', isLight: true },
  { id: 'rose-pine', isLight: false },
  { id: 'rose-pine-moon', isLight: false },
  { id: 'rose-pine-dawn', isLight: true },
];
const VALID_THEMES = THEMES.map((t) => t.id);
const LIGHT_THEMES = THEMES.filter((t) => t.isLight).map((t) => t.id);
const DEFAULT_THEME = 'catppuccin-mocha';

const selector = document.getElementById('theme-selector');
const themeLink = document.getElementById('theme-css');
const currentThemeDisplay = document.getElementById('current-theme');

function isValidTheme(theme) {
  return theme && VALID_THEMES.includes(theme);
}

function applyTheme(theme) {
  const safeTheme = isValidTheme(theme) ? theme : DEFAULT_THEME;
  if (themeLink) {
    themeLink.href = `/node_modules/turbo-themes/css/themes/turbo/${safeTheme}.css`;
  }
  document.documentElement.setAttribute('data-theme', safeTheme);
  document.documentElement.setAttribute(
    'data-bs-theme',
    LIGHT_THEMES.includes(safeTheme) ? 'light' : 'dark'
  );
  localStorage.setItem('turbo-theme', safeTheme);
  if (currentThemeDisplay) {
    currentThemeDisplay.textContent = safeTheme;
  }
  if (selector) {
    selector.value = safeTheme;
  }
}

// Load saved theme
const saved = localStorage.getItem('turbo-theme');
applyTheme(saved || DEFAULT_THEME);

// Handle theme change
if (selector) {
  selector.addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });
}
