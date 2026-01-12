const LIGHT_THEMES = ['catppuccin-latte', 'github-light', 'bulma-light'];

const selector = document.getElementById('theme-selector');
const themeLink = document.getElementById('theme-css');
const currentThemeDisplay = document.getElementById('current-theme');

function applyTheme(theme) {
  themeLink.href = `/node_modules/turbo-themes/css/themes/turbo/${theme}.css`;
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-bs-theme', LIGHT_THEMES.includes(theme) ? 'light' : 'dark');
  localStorage.setItem('turbo-theme', theme);
  currentThemeDisplay.textContent = theme;
}

// Load saved theme
const saved = localStorage.getItem('turbo-theme');
if (saved) {
  selector.value = saved;
  applyTheme(saved);
}

// Handle theme change
selector.addEventListener('change', (e) => {
  applyTheme(e.target.value);
});
