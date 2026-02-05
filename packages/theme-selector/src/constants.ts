// SPDX-License-Identifier: MIT
/**
 * Constants for theme selector component
 */

import type { ThemeFamily } from './types.js';

// Re-export ThemeFamily for convenience
export type { ThemeFamily } from './types.js';

export const STORAGE_KEY = 'turbo-theme';
export const LEGACY_STORAGE_KEYS = ['bulma-theme-flavor'];
export const DEFAULT_THEME = 'catppuccin-mocha';

// DOM element IDs and selectors - centralized to avoid magic strings
export const DOM_IDS = {
  THEME_FLAVOR_TRIGGER: 'theme-flavor-trigger',
  THEME_FLAVOR_TRIGGER_ICON: 'theme-flavor-trigger-icon',
  THEME_FLAVOR_TRIGGER_LABEL: 'theme-flavor-trigger-label',
  THEME_FLAVOR_MENU: 'theme-flavor-menu',
  THEME_FLAVOR_SELECT: 'theme-flavor-select',
} as const;

export const DOM_SELECTORS = {
  DROPDOWN_ITEMS: `#${DOM_IDS.THEME_FLAVOR_MENU} .dropdown-item.theme-item`,
  NAVBAR_DROPDOWN: '.navbar-item.has-dropdown',
  NAV_REPORTS: '[data-testid="nav-reports"]',
  NAVBAR_ITEM: '.navbar-item',
  HIGHLIGHT_PRE: '.highlight > pre',
  THEME_CSS_LINKS: 'link[id^="theme-"][id$="-css"]',
} as const;

export interface ThemeFamilyMeta {
  name: string;
  description: string;
}

export const THEME_FAMILIES: Record<ThemeFamily, ThemeFamilyMeta> = {
  bulma: { name: 'Bulma', description: 'Classic Bulma themes' },
  catppuccin: { name: 'Catppuccin', description: 'Soothing pastel themes' },
  github: { name: 'GitHub', description: 'GitHub-inspired themes' },
  dracula: { name: 'Dracula', description: 'Dark vampire aesthetic' },
  nord: { name: 'Nord', description: 'Arctic, north-bluish color palette' },
  'rose-pine': { name: 'Rosé Pine', description: 'All natural pine, faux fur and a bit of soho vibes' },
  solarized: { name: 'Solarized', description: 'Precision-balanced light and dark modes' },
};
