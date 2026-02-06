// SPDX-License-Identifier: MIT
/**
 * Theme persistence utilities for FOUC prevention.
 *
 * Provides testable implementations of the critical-path logic
 * used in the blocking inline script (BaseLayout.astro lines 85-118)
 * and the theme-switching UI script (lines 140-230).
 */

import { DEFAULT_THEME } from './constants.js';
import { migrateLegacyStorage, getSavedTheme } from './storage.js';

// Re-export for convenience
export { DEFAULT_THEME } from './constants.js';

/**
 * Resolves the initial theme for FOUC prevention.
 *
 * Performs legacy storage migration, reads the stored theme, and validates
 * it against the provided list of valid theme IDs. Returns the default
 * theme if the stored value is missing or invalid.
 *
 * Mirrors the blocking inline script logic in BaseLayout.astro.
 */
export function resolveInitialTheme(windowObj: Window, validThemes: string[]): string {
  migrateLegacyStorage(windowObj);
  const saved = getSavedTheme(windowObj);
  if (validThemes.indexOf(saved) === -1) {
    return DEFAULT_THEME;
  }
  return saved;
}

/**
 * Builds the full CSS href path for a theme.
 */
export function buildThemeCssHref(baseUrl: string, themeId: string): string {
  return `${baseUrl}/assets/css/themes/turbo/${themeId}.css`;
}

/**
 * Determines if the theme CSS link element needs updating.
 *
 * The default theme CSS is pre-loaded in the HTML, so we skip the
 * update to avoid an unnecessary network request and style flash.
 */
export function needsCssUpdate(
  themeId: string,
  defaultTheme: string = DEFAULT_THEME,
): boolean {
  return themeId !== defaultTheme;
}

/**
 * Builds the theme icon image src path.
 */
export function buildThemeIconSrc(
  baseUrl: string,
  themeIcons: Record<string, string>,
  themeId: string,
  fallbackIcon: string = 'catppuccin-logo-macchiato.png',
): string {
  return `${baseUrl}/assets/img/${themeIcons[themeId] || fallbackIcon}`;
}

/**
 * Applies the initial theme to prevent FOUC (Flash of Unstyled Content).
 *
 * This is the testable equivalent of the blocking inline script in
 * BaseLayout.astro. It:
 * 1. Migrates legacy storage keys
 * 2. Reads and validates the stored theme
 * 3. Sets the `data-theme` attribute on `<html>`
 * 4. Sets `window.__INITIAL_THEME__` for downstream scripts
 * 5. Updates the CSS link href if the theme differs from the default
 */
export function applyInitialTheme(
  doc: Document,
  windowObj: Window,
  validThemes: string[],
): string {
  const theme = resolveInitialTheme(windowObj, validThemes);

  doc.documentElement.setAttribute('data-theme', theme);
  windowObj.__INITIAL_THEME__ = theme;

  if (needsCssUpdate(theme)) {
    const baseUrl = doc.documentElement.getAttribute('data-baseurl') || '';
    const themeLink = doc.getElementById('turbo-theme-css') as HTMLLinkElement | null;
    if (themeLink) {
      themeLink.href = buildThemeCssHref(baseUrl, theme);
    }
  }

  return theme;
}

/**
 * Updates active theme state on theme option elements.
 *
 * Toggles the `active` class on each element based on whether its
 * `data-theme` attribute matches the given active theme ID.
 */
export function updateActiveTheme(options: ArrayLike<Element>, activeTheme: string): void {
  Array.from(options).forEach((opt) => {
    opt.classList.toggle('active', opt.getAttribute('data-theme') === activeTheme);
  });
}
