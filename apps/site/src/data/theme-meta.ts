/**
 * Shared theme display metadata consumed by BaseLayout and index page inline scripts.
 *
 * Derived from the canonical core metadata — automatically stays in sync
 * when themes are added or removed.
 */

import {
  VENDOR_GROUPS,
  THEME_SHORT_LABELS,
  THEME_APPEARANCES as coreAppearances,
  VALID_THEMES,
} from '@lgtm-hq/turbo-themes-core/metadata';

/** Theme group for dropdown rendering. */
export interface ThemeGroup {
  id: string;
  displayName: string;
  flavors: string[];
}

/** Ordered theme groups for dropdown rendering. */
export const themeGroups: ThemeGroup[] = VENDOR_GROUPS.map((g) => ({
  id: g.id,
  displayName: g.displayName,
  flavors: [...g.themeIds],
}));

/** All valid theme IDs derived from the groups. */
export const validThemeIds: string[] = [...VALID_THEMES];

/** Human-readable short label shown in the theme dropdown trigger. */
export const themeNames: Record<string, string> = { ...THEME_SHORT_LABELS };

/** Appearance (light/dark) for each theme. */
export const themeAppearances: Record<string, 'light' | 'dark'> = { ...coreAppearances };

/**
 * Icon configuration per vendor, keyed by vendor ID.
 * Each entry has a dark icon and a light icon filename.
 */
const VENDOR_ICON_CONFIG: Record<string, { dark: string; light: string }> = {
  catppuccin: { dark: 'catppuccin-logo-macchiato.png', light: 'catppuccin-logo-latte.png' },
  dracula: { dark: 'dracula-logo.png', light: 'dracula-logo.png' },
  gruvbox: { dark: 'turbo-themes-logo-dark.png', light: 'turbo-themes-logo.png' },
  github: { dark: 'github-logo-dark.png', light: 'github-logo-light.png' },
  bulma: { dark: 'turbo-themes-logo-dark.png', light: 'turbo-themes-logo.png' },
  nord: { dark: 'nord.png', light: 'nord.png' },
  solarized: { dark: 'solarized-dark.png', light: 'solarized-light.png' },
  'rose-pine': { dark: 'rose-pine.png', light: 'rose-pine-dawn.png' },
  'tokyo-night': { dark: 'turbo-themes-logo-dark.png', light: 'turbo-themes-logo.png' },
};

/** Per-theme icon overrides (where the vendor-level default is wrong). */
const THEME_ICON_OVERRIDES: Record<string, string> = {
  'gruvbox-dark-hard': 'gruvbox-dark-hard.png',
  'gruvbox-dark': 'gruvbox-dark.png',
  'gruvbox-dark-soft': 'gruvbox-dark-soft.png',
  'gruvbox-light-hard': 'gruvbox-light-hard.png',
  'gruvbox-light': 'gruvbox-light.png',
  'gruvbox-light-soft': 'gruvbox-light-soft.png',
  'rose-pine-moon': 'rose-pine-moon.png',
};

/** Icon filename (relative to /assets/img/) for the theme dropdown trigger. */
export const themeIcons: Record<string, string> = {};

const DEFAULT_ICONS = { dark: 'turbo-themes-logo-dark.png', light: 'turbo-themes-logo.png' };

for (const group of VENDOR_GROUPS) {
  const vendorIcons = VENDOR_ICON_CONFIG[group.id];
  if (!vendorIcons) {
    console.warn(
      `[theme-meta] Missing VENDOR_ICON_CONFIG for "${group.id}", using default icons for: ${group.themeIds.join(', ')}`,
    );
  }
  const icons = vendorIcons ?? DEFAULT_ICONS;
  for (const id of group.themeIds) {
    if (id in THEME_ICON_OVERRIDES) {
      themeIcons[id] = THEME_ICON_OVERRIDES[id];
    } else {
      const appearance = coreAppearances[id] ?? 'dark';
      themeIcons[id] = appearance === 'dark' ? icons.dark : icons.light;
    }
  }
}
Object.freeze(themeIcons);
