/**
 * Shared theme display metadata consumed by BaseLayout and index page inline scripts.
 *
 * Single source of truth for theme label and icon mappings used in the header
 * dropdown and the hero theme-preview strip.
 */

/** Theme group for dropdown rendering. */
export interface ThemeGroup {
  id: string;
  displayName: string;
  flavors: string[];
}

/** Ordered theme groups for dropdown rendering. */
export const themeGroups: ThemeGroup[] = [
  {
    id: 'catppuccin',
    displayName: 'Catppuccin',
    flavors: ['catppuccin-mocha', 'catppuccin-macchiato', 'catppuccin-frappe', 'catppuccin-latte'],
  },
  {
    id: 'dracula',
    displayName: 'Dracula',
    flavors: ['dracula'],
  },
  {
    id: 'gruvbox',
    displayName: 'Gruvbox',
    flavors: [
      'gruvbox-dark-hard',
      'gruvbox-dark',
      'gruvbox-dark-soft',
      'gruvbox-light-hard',
      'gruvbox-light',
      'gruvbox-light-soft',
    ],
  },
  {
    id: 'github',
    displayName: 'GitHub',
    flavors: ['github-dark', 'github-light'],
  },
  {
    id: 'bulma',
    displayName: 'Bulma',
    flavors: ['bulma-dark', 'bulma-light'],
  },
  {
    id: 'nord',
    displayName: 'Nord',
    flavors: ['nord'],
  },
  {
    id: 'solarized',
    displayName: 'Solarized',
    flavors: ['solarized-dark', 'solarized-light'],
  },
  {
    id: 'rose-pine',
    displayName: 'Rosé Pine',
    flavors: ['rose-pine', 'rose-pine-moon', 'rose-pine-dawn'],
  },
];

/** All valid theme IDs derived from the groups. */
export const validThemeIds: string[] = themeGroups.flatMap((g) => g.flavors);

/** Human-readable short label shown in the theme dropdown trigger. */
export const themeNames: Record<string, string> = {
  'catppuccin-mocha': 'Mocha',
  'catppuccin-macchiato': 'Macchiato',
  'catppuccin-frappe': 'Frappé',
  'catppuccin-latte': 'Latte',
  dracula: 'Dracula',
  'gruvbox-dark-hard': 'Dark Hard',
  'gruvbox-dark': 'Dark',
  'gruvbox-dark-soft': 'Dark Soft',
  'gruvbox-light-hard': 'Light Hard',
  'gruvbox-light': 'Light',
  'gruvbox-light-soft': 'Light Soft',
  'github-dark': 'Dark',
  'github-light': 'Light',
  'bulma-dark': 'Dark',
  'bulma-light': 'Light',
  nord: 'Nord',
  'solarized-dark': 'Dark',
  'solarized-light': 'Light',
  'rose-pine': 'Rosé Pine',
  'rose-pine-moon': 'Moon',
  'rose-pine-dawn': 'Dawn',
};

/** Icon filename (relative to /assets/img/) for the theme dropdown trigger. */
export const themeIcons: Record<string, string> = {
  'catppuccin-mocha': 'catppuccin-logo-macchiato.png',
  'catppuccin-macchiato': 'catppuccin-logo-macchiato.png',
  'catppuccin-frappe': 'catppuccin-logo-macchiato.png',
  'catppuccin-latte': 'catppuccin-logo-latte.png',
  dracula: 'dracula-logo.png',
  'gruvbox-dark-hard': 'gruvbox-dark-hard.png',
  'gruvbox-dark': 'gruvbox-dark.png',
  'gruvbox-dark-soft': 'gruvbox-dark-soft.png',
  'gruvbox-light-hard': 'gruvbox-light-hard.png',
  'gruvbox-light': 'gruvbox-light.png',
  'gruvbox-light-soft': 'gruvbox-light-soft.png',
  'github-dark': 'github-logo-dark.png',
  'github-light': 'github-logo-light.png',
  'bulma-dark': 'turbo-themes-logo-dark.png',
  'bulma-light': 'turbo-themes-logo.png',
  nord: 'nord.png',
  'solarized-dark': 'solarized-dark.png',
  'solarized-light': 'solarized-light.png',
  'rose-pine': 'rose-pine.png',
  'rose-pine-moon': 'rose-pine-moon.png',
  'rose-pine-dawn': 'rose-pine-dawn.png',
};
