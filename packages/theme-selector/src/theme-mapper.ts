// SPDX-License-Identifier: MIT
/**
 * Maps core theme flavors to UI-specific format
 */

import type { ThemeFlavor as CanonicalThemeFlavor } from '@lgtm-hq/turbo-themes-core';
import type { ThemeFamily } from './types.js';

export interface ThemeColors {
  bg: string;
  surface: string;
  accent: string;
  text: string;
}

export interface ThemeFlavor extends Pick<CanonicalThemeFlavor, 'id' | 'appearance' | 'vendor'> {
  id: string;
  name: string;
  description: string;
  cssFile: string;
  icon?: string | undefined;
  family: ThemeFamily;
  colors: ThemeColors;
}

// ============================================================================
// Lookup Tables
// ============================================================================

/** Vendor to family mapping */
const VENDOR_FAMILY_MAP: Record<string, ThemeFamily> = {
  bulma: 'bulma',
  catppuccin: 'catppuccin',
  dracula: 'dracula',
  gruvbox: 'gruvbox',
  github: 'github',
  nord: 'nord',
  'rose-pine': 'rose-pine',
  solarized: 'solarized',
  'tokyo-night': 'tokyo-night',
};

const DEFAULT_FAMILY: ThemeFamily = 'bulma';

/** Icon configuration - string for single icon, object for appearance-specific */
interface AppearanceIcons {
  light: string;
  dark: string;
}

const VENDOR_ICON_MAP: Record<string, string | AppearanceIcons> = {
  bulma: 'assets/img/turbo-themes-logo.png',
  catppuccin: {
    light: 'assets/img/catppuccin-logo-latte.png',
    dark: 'assets/img/catppuccin-logo-macchiato.png',
  },
  dracula: 'assets/img/dracula-logo.png',
  gruvbox: {
    light: 'assets/img/gruvbox-light.png',
    dark: 'assets/img/gruvbox-dark.png',
  },
  github: {
    light: 'assets/img/github-logo-light.png',
    dark: 'assets/img/github-logo-dark.png',
  },
  nord: 'assets/img/nord.png',
  'rose-pine': {
    light: 'assets/img/rose-pine-dawn.png',
    dark: 'assets/img/rose-pine.png',
  },
  solarized: {
    light: 'assets/img/solarized-light.png',
    dark: 'assets/img/solarized-dark.png',
  },
  'tokyo-night': 'assets/img/tokyo-night.png',
};

/** Predefined flavor descriptions */
const FLAVOR_DESCRIPTIONS: Record<string, string> = {
  'bulma-light': 'Classic Bulma look with a bright, neutral palette.',
  'bulma-dark': 'Dark Bulma theme tuned for low-light reading.',
  'catppuccin-latte': 'Light, soft Catppuccin palette for daytime use.',
  'catppuccin-frappe': 'Balanced dark Catppuccin theme for focused work.',
  'catppuccin-macchiato': 'Deep, atmospheric Catppuccin variant with rich contrast.',
  'catppuccin-mocha': 'Cozy, high-contrast Catppuccin theme for late-night sessions.',
  dracula: 'Iconic Dracula dark theme with vibrant accents.',
  'gruvbox-dark-hard': 'Highest contrast dark Gruvbox palette with deep shadows.',
  'gruvbox-dark': 'Classic Gruvbox dark palette with warm, muted tones.',
  'gruvbox-dark-soft': 'Softer dark Gruvbox palette with reduced contrast.',
  'gruvbox-light-hard': 'Bright, crisp Gruvbox light palette with extra contrast.',
  'gruvbox-light': 'Classic Gruvbox light palette with warm paper tones.',
  'gruvbox-light-soft': 'Soft, low-contrast Gruvbox light palette for long sessions.',
  'github-light': 'GitHub-inspired light theme suited for documentation and UI heavy pages.',
  'github-dark': 'GitHub dark theme optimized for code-heavy views.',
  nord: 'Arctic, north-bluish color palette inspired by the polar night.',
  'rose-pine': 'Elegant dark theme with natural pine and soho vibes.',
  'rose-pine-moon': 'Deeper variant of Rosé Pine with enhanced contrast.',
  'rose-pine-dawn': 'Light Rosé Pine variant for daytime use.',
  'solarized-dark': 'Solarized Dark with a balanced, low-contrast palette.',
  'solarized-light': 'Solarized Light tuned for bright, daylight-friendly UIs.',
  'tokyo-night-dark': 'Deep midnight blues with neon accents.',
  'tokyo-night-storm': 'Stormy variant with richer contrast and depth.',
  'tokyo-night-light': 'Clean daylight palette inspired by Tokyo mornings.',
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Gets the theme family from vendor name
 */
function getFamily(vendor: string): ThemeFamily {
  return VENDOR_FAMILY_MAP[vendor] ?? DEFAULT_FAMILY;
}

/**
 * Gets icon path for a vendor
 */
function getIconForVendor(vendor: string, appearance: 'light' | 'dark'): string | undefined {
  const iconConfig = VENDOR_ICON_MAP[vendor];

  if (!iconConfig) {
    return undefined;
  }

  if (typeof iconConfig === 'string') {
    return iconConfig;
  }

  return iconConfig[appearance];
}

/**
 * Gets description for a flavor
 */
function getDescriptionForFlavor(id: string, label: string): string {
  return FLAVOR_DESCRIPTIONS[id] ?? `${label} theme`;
}

/**
 * Extracts preview colors from theme tokens
 */
function extractPreviewColors(tokens: CanonicalThemeFlavor['tokens']): ThemeColors {
  return {
    bg: tokens.background.base,
    surface: tokens.background.surface,
    accent: tokens.brand.primary,
    text: tokens.text.primary,
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Maps a canonical theme flavor to UI-specific format
 */
export function mapFlavorToUI(flavor: CanonicalThemeFlavor): ThemeFlavor {
  const family = getFamily(flavor.vendor);
  return {
    id: flavor.id,
    name: flavor.label,
    description: getDescriptionForFlavor(flavor.id, flavor.label),
    cssFile: `packages/css/dist/themes/${flavor.id}.css`,
    icon: getIconForVendor(flavor.vendor, flavor.appearance),
    family,
    vendor: flavor.vendor,
    appearance: flavor.appearance,
    colors: extractPreviewColors(flavor.tokens),
  };
}
