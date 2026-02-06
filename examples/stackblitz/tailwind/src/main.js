const VALID_THEMES = [
  'catppuccin-mocha',
  'catppuccin-macchiato',
  'catppuccin-frappe',
  'catppuccin-latte',
  'dracula',
  'gruvbox-dark-hard',
  'gruvbox-dark',
  'gruvbox-dark-soft',
  'gruvbox-light-hard',
  'gruvbox-light',
  'gruvbox-light-soft',
  'github-dark',
  'github-light',
  'bulma-dark',
  'bulma-light',
  'nord',
  'solarized-dark',
  'solarized-light',
  'rose-pine',
  'rose-pine-moon',
  'rose-pine-dawn',
];
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
