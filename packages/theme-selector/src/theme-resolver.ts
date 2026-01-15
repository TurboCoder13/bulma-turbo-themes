// SPDX-License-Identifier: MIT
/**
 * Theme resolution utilities - centralized theme lookup and validation.
 *
 * Provides cached access to theme data and validation to avoid
 * repeated mapping and set creation across the codebase.
 */

import { flavors } from '@turbocoder13/turbo-themes-core';
import { mapFlavorToUI, type ThemeFlavor } from './theme-mapper.js';
import { DEFAULT_THEME } from './constants.js';

// Cache mapped themes and valid IDs
let mappedThemes: ThemeFlavor[] | null = null;
let validThemeIds: Set<string> | null = null;

/**
 * Gets all themes mapped to UI format.
 * Results are cached for performance.
 */
export function getThemes(): ThemeFlavor[] {
  if (!mappedThemes) {
    mappedThemes = flavors.map(mapFlavorToUI);
  }
  return mappedThemes || [];
}

/**
 * Gets a Set of all valid theme IDs.
 * Results are cached for performance.
 */
export function getValidThemeIds(): Set<string> {
  if (!validThemeIds) {
    validThemeIds = new Set(flavors.map((f) => f.id));
  }
  return validThemeIds;
}

/**
 * Resolves a theme by ID, falling back to default if not found.
 *
 * @param themeId - The theme ID to resolve
 * @returns The matching theme, default theme, or first available theme
 */
export function resolveTheme(themeId: string): ThemeFlavor | undefined {
  const themes = getThemes();
  return (
    themes.find((t) => t.id === themeId) ||
    themes.find((t) => t.id === DEFAULT_THEME) ||
    themes[0]
  );
}

/**
 * Validates a theme ID for safety and format correctness.
 *
 * Accepts only alphanumeric characters, hyphens, and underscores.
 * Rejects special characters, unicode, and excessively long IDs.
 *
 * @param id - The value to validate as a theme ID
 * @returns True if the ID is valid, false otherwise
 */
export function isValidThemeId(id: unknown): boolean {
  if (typeof id !== 'string') return false;
  if (id.length === 0) return false;
  if (id.length > 100) return false;
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * Sanitizes a theme ID by removing unsafe characters.
 *
 * Removes any characters that could cause DOM/CSS/XSS issues.
 * Used as a fallback when displaying potentially untrusted input.
 *
 * @param id - The theme ID to sanitize
 * @returns The sanitized ID containing only safe characters
 */
export function sanitizeThemeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, '');
}

/**
 * Resets the cached themes. Used for testing.
 * @internal
 */
export function _resetThemeCache(): void {
  mappedThemes = null;
  validThemeIds = null;
}
