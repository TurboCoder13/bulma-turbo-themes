const VALID_THEMES = [
  'catppuccin-mocha',
  'catppuccin-macchiato',
  'catppuccin-frappe',
  'catppuccin-latte',
  'dracula',
  'github-dark',
  'github-light',
  'bulma-dark',
  'bulma-light',
];
const DEFAULT_THEME = 'catppuccin-mocha';
const LIGHT_THEMES = ['catppuccin-latte', 'github-light', 'bulma-light'];

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
