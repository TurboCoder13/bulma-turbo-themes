// SPDX-License-Identifier: MIT
/**
 * Platform-agnostic design tokens export
 *
 * This module exports pure theme data (colors, typography, etc.) without
 * any DOM, CSS, or platform-specific code. Use this for:
 *
 * - React Native apps
 * - Flutter apps (via JSON export)
 * - iOS/Android native apps
 * - Any platform that needs theme colors
 *
 * For web apps, you can also import the CSS files directly:
 * import '@turbocoder13/turbo-themes/css/catppuccin-mocha.css'
 */

// Re-export types for consumers
export type { ThemeTokens, ThemeFlavor, ThemePackage } from '../themes/types.js';

import type { ThemeFlavor, ThemeTokens } from '../themes/types.js';

// Import tokens data (copied from dist/tokens.json during build)
import tokensData from '../themes/tokens.json' with { type: 'json' };

// Type assertion for the imported JSON
interface TokensJson {
  themes: Record<string, {
    id: string;
    label: string;
    vendor: string;
    appearance: 'light' | 'dark';
    iconUrl?: string;
    tokens: ThemeTokens;
  }>;
  byVendor: Record<string, {
    name: string;
    homepage: string;
    themes: string[];
  }>;
}

const tokens = tokensData as TokensJson;

/**
 * All available theme flavors as a flat array
 */
export const flavors: readonly ThemeFlavor[] = Object.values(tokens.themes).map((theme) => ({
  id: theme.id,
  label: theme.label,
  vendor: theme.vendor,
  appearance: theme.appearance,
  ...(theme.iconUrl !== undefined && { iconUrl: theme.iconUrl }),
  tokens: theme.tokens,
}));

/**
 * Theme flavors indexed by ID for quick lookup
 */
export const themesById: Record<string, ThemeFlavor> = Object.fromEntries(
  flavors.map((flavor) => [flavor.id, flavor])
);

/**
 * All available theme packages (grouped by vendor)
 */
export const packages = Object.fromEntries(
  Object.entries(tokens.byVendor).map(([vendorId, vendor]) => [
    vendorId,
    {
      id: vendorId,
      name: vendor.name,
      homepage: vendor.homepage,
      flavors: vendor.themes.map((themeId) => themesById[themeId]).filter(Boolean),
    },
  ])
);

/**
 * Get a theme by ID
 * @param id - Theme identifier (e.g., 'catppuccin-mocha')
 * @returns The theme flavor or undefined if not found
 */
export function getTheme(id: string): ThemeFlavor | undefined {
  return themesById[id];
}

/**
 * Get theme tokens by ID (convenience function)
 * @param id - Theme identifier (e.g., 'catppuccin-mocha')
 * @returns The theme tokens or undefined if not found
 */
export function getTokens(id: string): ThemeTokens | undefined {
  return themesById[id]?.tokens;
}

/**
 * Get all themes matching an appearance (light/dark)
 * @param appearance - 'light' or 'dark'
 * @returns Array of matching theme flavors
 */
export function getThemesByAppearance(appearance: 'light' | 'dark'): readonly ThemeFlavor[] {
  return flavors.filter((f) => f.appearance === appearance);
}

/**
 * Get all themes from a specific vendor
 * @param vendor - Vendor name (e.g., 'catppuccin', 'github')
 * @returns Array of matching theme flavors
 */
export function getThemesByVendor(vendor: string): readonly ThemeFlavor[] {
  return flavors.filter((f) => f.vendor === vendor);
}

/**
 * List of all available theme IDs
 */
export const themeIds: readonly string[] = flavors.map((f) => f.id);

/**
 * List of all available vendors
 */
export const vendors: readonly string[] = [...new Set(flavors.map((f) => f.vendor))];
