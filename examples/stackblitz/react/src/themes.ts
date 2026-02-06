export const THEMES = [
  { id: 'bulma-dark', name: 'Bulma Dark' },
  { id: 'bulma-light', name: 'Bulma Light' },
  { id: 'catppuccin-mocha', name: 'Catppuccin Mocha' },
  { id: 'catppuccin-macchiato', name: 'Catppuccin Macchiato' },
  { id: 'catppuccin-frappe', name: 'Catppuccin Frappe' },
  { id: 'catppuccin-latte', name: 'Catppuccin Latte' },
  { id: 'dracula', name: 'Dracula' },
  { id: 'github-dark', name: 'GitHub Dark' },
  { id: 'github-light', name: 'GitHub Light' },
  { id: 'gruvbox-dark-hard', name: 'Gruvbox Dark Hard' },
  { id: 'gruvbox-dark', name: 'Gruvbox Dark' },
  { id: 'gruvbox-dark-soft', name: 'Gruvbox Dark Soft' },
  { id: 'gruvbox-light-hard', name: 'Gruvbox Light Hard' },
  { id: 'gruvbox-light', name: 'Gruvbox Light' },
  { id: 'gruvbox-light-soft', name: 'Gruvbox Light Soft' },
  { id: 'nord', name: 'Nord' },
  { id: 'rose-pine', name: 'Rosé Pine' },
  { id: 'rose-pine-moon', name: 'Rosé Pine Moon' },
  { id: 'rose-pine-dawn', name: 'Rosé Pine Dawn' },
  { id: 'solarized-dark', name: 'Solarized Dark' },
  { id: 'solarized-light', name: 'Solarized Light' },
] as const;

export const VALID_THEME_IDS = THEMES.map(t => t.id);
export const DEFAULT_THEME = 'catppuccin-mocha';

export function isValidTheme(themeId: string): themeId is typeof THEMES[number]['id'] {
  return VALID_THEME_IDS.includes(themeId as typeof THEMES[number]['id']);
}
