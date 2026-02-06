// SPDX-License-Identifier: MIT
/**
 * Consolidated theme metadata derived from tokens.json.
 *
 * All display metadata (names, appearances, vendor groups) is computed from
 * the canonical token data at module evaluation time. Consumers should import
 * from here instead of maintaining their own hardcoded copies.
 */

import { flavors, themeIds, packages } from '../tokens/index.js';

/** Default theme applied when no preference is stored. */
export const DEFAULT_THEME = 'catppuccin-mocha' as const;

/** All valid theme IDs (re-export for convenience). */
export const VALID_THEMES: readonly string[] = themeIds;

/** Set of valid theme IDs for O(1) lookup. */
export const VALID_THEME_SET: ReadonlySet<string> = /*#__PURE__*/ new Set(themeIds);

/** Full human-readable label for each theme (e.g., "Catppuccin Mocha"). */
export const THEME_NAMES: Readonly<Record<string, string>> = /*#__PURE__*/ Object.fromEntries(
  flavors.map((f) => [f.id, f.label]),
);

/** Appearance (light/dark) for each theme. */
export const THEME_APPEARANCES: Readonly<Record<string, 'light' | 'dark'>> =
  /*#__PURE__*/ Object.fromEntries(flavors.map((f) => [f.id, f.appearance]));

/**
 * Ordered list of vendor IDs controlling display order in dropdowns.
 * New vendors should be appended here.
 */
export const VENDOR_ORDER: readonly string[] = [
  'catppuccin',
  'dracula',
  'gruvbox',
  'github',
  'bulma',
  'nord',
  'solarized',
  'rose-pine',
  'tokyo-night',
];

/** A vendor group with its display name and ordered theme IDs. */
export interface VendorGroup {
  id: string;
  displayName: string;
  themeIds: string[];
}

/**
 * Ordered array of vendor groups derived from packages + VENDOR_ORDER.
 * The "(synced)" suffix is stripped from display names.
 */
export const VENDOR_GROUPS: readonly VendorGroup[] = /*#__PURE__*/ VENDOR_ORDER.filter(
  (id) => id in packages,
).map((id) => {
  const pkg = packages[id]!;
  return {
    id,
    displayName: pkg.name.replace(/\s*\(synced\)\s*/i, ''),
    themeIds: pkg.flavors.map((f) => f!.id),
  };
});

/**
 * Strip the vendor prefix from a theme label to produce a short label.
 *
 * For single-flavor vendors (e.g., "Dracula", "Nord") the full label is returned.
 * For multi-flavor vendors the vendor name prefix is stripped:
 *   "Catppuccin Mocha" -> "Mocha"
 *   "Gruvbox Dark Hard" -> "Dark Hard"
 *
 * @param themeId - A valid theme ID
 * @returns The short display label, or the full label if the theme is not found
 */
export function getShortLabel(themeId: string): string {
  const flavor = flavors.find((f) => f.id === themeId);
  if (!flavor) return themeId;

  const vendorPkg = packages[flavor.vendor];
  if (!vendorPkg) return flavor.label;

  // Single-flavor vendors keep their full label
  if (vendorPkg.flavors.length === 1) return flavor.label;

  // Strip vendor display name prefix (case-insensitive, handles accented chars)
  const displayName = vendorPkg.name.replace(/\s*\(synced\)\s*/i, '');
  const label = flavor.label;

  if (label.toLowerCase().startsWith(displayName.toLowerCase())) {
    const stripped = label.slice(displayName.length).trim();
    return stripped || label;
  }

  return label;
}

/** Pre-computed short labels for all themes. */
export const THEME_SHORT_LABELS: Readonly<Record<string, string>> =
  /*#__PURE__*/ Object.fromEntries(flavors.map((f) => [f.id, getShortLabel(f.id)]));
