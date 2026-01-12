const selector = document.getElementById('theme-selector');
const themeLink = document.getElementById('theme-css');
const currentThemeDisplay = document.getElementById('current-theme');

// Load saved theme
const saved = localStorage.getItem('turbo-theme');
if (saved) {
  selector.value = saved;
  themeLink.href = `/node_modules/turbo-themes/css/themes/turbo/${saved}.css`;
  document.documentElement.setAttribute('data-theme', saved);
  currentThemeDisplay.textContent = saved;
}

// Handle theme change
selector.addEventListener('change', (e) => {
  const theme = e.target.value;
  themeLink.href = `/node_modules/turbo-themes/css/themes/turbo/${theme}.css`;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('turbo-theme', theme);
  currentThemeDisplay.textContent = theme;
});
