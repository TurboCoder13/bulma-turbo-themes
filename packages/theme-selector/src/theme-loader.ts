// SPDX-License-Identifier: MIT
/**
 * Theme CSS loading utilities
 */

import { CSS_LINK_ID, DOM_SELECTORS } from './constants.js';
import { ThemeErrors, logThemeError } from './errors.js';

export interface ThemeInfo {
  id: string;
  cssFile: string;
  icon?: string | undefined;
}

/**
 * Resolves an asset path relative to the site's base URL.
 */
export function resolveAssetPath(assetPath: string, baseUrl: string): string {
  // Normalize baseUrl - remove trailing slash if present, then add one
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const base = normalizedBase ? `${window.location.origin}${normalizedBase}/` : `${window.location.origin}/`;
  return new URL(assetPath, base).pathname;
}

/**
 * Gets the base URL from the document's data-baseurl attribute.
 * Validates the URL to prevent injection attacks:
 * - Rejects protocol-relative URLs (//example.com)
 * - Rejects non-HTTPS absolute URLs (except localhost)
 * - Only allows same-origin or relative paths
 */
export function getBaseUrl(doc: Document): string {
  const baseElement = doc.documentElement;
  const raw = baseElement?.getAttribute('data-baseurl') || '';

  // Empty base URL is valid (use site root)
  if (!raw) return '';

  // Reject protocol-relative URLs (security risk)
  if (raw.startsWith('//')) {
    logThemeError(ThemeErrors.PROTOCOL_REJECTED());
    return '';
  }

  // Reject non-HTTPS absolute URLs (except localhost for development)
  if (raw.startsWith('http://') && !raw.startsWith('http://localhost')) {
    logThemeError(ThemeErrors.INSECURE_HTTP_REJECTED());
    return '';
  }

  try {
    // Parse relative to current origin to validate
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const u = new URL(raw, currentOrigin);

    // Only allow same-origin URLs or relative paths
    if (u.origin !== currentOrigin) {
      logThemeError(ThemeErrors.CROSS_ORIGIN_REJECTED(u.origin));
      return '';
    }

    return u.pathname.replace(/\/$/, '');
  } catch {
    return '';
  }
}

/**
 * Extracts the theme ID from a theme link element's ID.
 * Strips a leading "theme-" prefix and trailing "-css" suffix.
 */
function extractThemeIdFromLinkId(linkId: string): string {
  return linkId.replace(/^theme-/, '').replace(/-css$/, '');
}

/**
 * Clears onload/onerror handlers from a link element to prevent memory leaks.
 */
function clearLinkHandlers(link: HTMLLinkElement): void {
  link.onload = null;
  link.onerror = null;
}

/**
 * Loads a CSS file with a timeout, returning a promise that resolves when loaded.
 */
export function loadCSSWithTimeout(
  link: HTMLLinkElement,
  themeId: string,
  timeoutMs = 10000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      clearLinkHandlers(link);
      reject(new Error(`Theme ${themeId} load timeout`));
    }, timeoutMs);

    link.onload = () => {
      clearTimeout(timeoutId);
      clearLinkHandlers(link);
      resolve();
    };

    link.onerror = () => {
      clearTimeout(timeoutId);
      clearLinkHandlers(link);
      reject(new Error(`Failed to load theme ${themeId}`));
    };
  });
}

/**
 * Gets the current theme from document element classes
 */
export function getCurrentThemeFromClasses(element: HTMLElement): string | null {
  const classList = Array.from(element.classList);
  for (const className of classList) {
    if (className.startsWith('theme-')) {
      return className.substring(6); // Remove 'theme-' prefix
    }
  }
  return null;
}

/**
 * Applies theme class to document element
 */
export function applyThemeClass(doc: Document, themeId: string): void {
  // Remove existing theme classes in a single batch operation
  const themeClasses = Array.from(doc.documentElement.classList).filter((className) =>
    className.startsWith('theme-'),
  );
  if (themeClasses.length > 0) {
    doc.documentElement.classList.remove(...themeClasses);
  }

  // Add the new theme class
  doc.documentElement.classList.add(`theme-${themeId}`);
}

/**
 * Loads theme CSS file if not already loaded
 */
export async function loadThemeCSS(
  doc: Document,
  theme: ThemeInfo,
  baseUrl: string
): Promise<void> {
  const themeLinkId = `theme-${theme.id}-css`;
  let themeLink = doc.getElementById(themeLinkId) as HTMLLinkElement | null;

  // Adopt the blocking script's link element if present (prevents duplicate CSS loads)
  if (!themeLink) {
    const blockingLink = doc.getElementById(CSS_LINK_ID) as HTMLLinkElement | null;
    if (blockingLink) {
      blockingLink.id = themeLinkId;
      blockingLink.setAttribute('data-theme-id', theme.id);
      themeLink = blockingLink;
    }
  }

  if (!themeLink) {
    // Record existing theme links before appending the new one
    const existingLinks = doc.querySelectorAll(DOM_SELECTORS.THEME_CSS_LINKS);

    themeLink = doc.createElement('link');
    themeLink.id = themeLinkId;
    themeLink.rel = 'stylesheet';
    themeLink.type = 'text/css';
    themeLink.setAttribute('data-theme-id', theme.id);

    try {
      themeLink.href = resolveAssetPath(theme.cssFile, baseUrl);
    } catch {
      logThemeError(ThemeErrors.INVALID_CSS_PATH(theme.id));
      return;
    }

    doc.head.appendChild(themeLink);

    try {
      await loadCSSWithTimeout(themeLink, theme.id);

      // Only remove old theme links after successful load
      existingLinks.forEach((link) => {
        const linkThemeId = extractThemeIdFromLinkId(link.id);
        if (linkThemeId !== theme.id && linkThemeId !== 'base') {
          link.remove();
        }
      });
    } catch (error) {
      // Loading failed — remove the new link and keep prior theme intact
      themeLink.remove();
      logThemeError(ThemeErrors.CSS_LOAD_FAILED(theme.id, error));
    }
  } else {
    // Link already exists — clean up any other stale theme links
    doc.querySelectorAll(DOM_SELECTORS.THEME_CSS_LINKS).forEach((link) => {
      const linkThemeId = extractThemeIdFromLinkId(link.id);
      if (linkThemeId !== theme.id && linkThemeId !== 'base') {
        link.remove();
      }
    });
  }
}
