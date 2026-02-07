// SPDX-License-Identifier: MIT
/**
 * Generates a self-contained inline JavaScript string that prevents FOUC
 * (Flash of Unstyled Content) by applying the saved theme before first paint.
 *
 * The returned string is a complete IIFE suitable for injection into a
 * `<script>` tag in the document `<head>`. It has no module dependencies.
 *
 * @example
 * // Astro frontmatter
 * import { generateBlockingScript } from '@lgtm-hq/turbo-theme-selector';
 * const blockingScript = generateBlockingScript();
 *
 * // Astro template
 * <Fragment set:html={`<script>${blockingScript}</script>`} />
 */

import { DEFAULT_THEME, VALID_THEMES } from '@lgtm-hq/turbo-themes-core';
import { CSS_LINK_ID, STORAGE_KEY, LEGACY_STORAGE_KEYS } from './constants.js';

export interface BlockingScriptOptions {
  /** Valid theme IDs to accept. Defaults to VALID_THEMES from core. */
  validThemes?: readonly string[];
  /** Fallback theme when no preference is stored. Defaults to DEFAULT_THEME from core. */
  defaultTheme?: string;
  /** localStorage key for the active theme. Defaults to STORAGE_KEY from core. */
  storageKey?: string;
  /** Legacy localStorage keys to migrate from. Defaults to LEGACY_STORAGE_KEYS from core. */
  legacyKeys?: readonly string[];
}

/**
 * Generates a self-contained inline JavaScript string that prevents FOUC.
 *
 * The returned string is a complete IIFE that:
 * 1. Migrates legacy storage keys
 * 2. Reads and validates the stored theme against the allowlist
 * 3. Sets `data-theme` on `<html>`
 * 4. Sets `window.__INITIAL_THEME__`
 * 5. Updates the CSS `<link>` href if the theme differs from the default
 */
export function generateBlockingScript(options: BlockingScriptOptions = {}): string {
  const {
    validThemes = VALID_THEMES,
    defaultTheme = DEFAULT_THEME,
    storageKey = STORAGE_KEY,
    legacyKeys = LEGACY_STORAGE_KEYS,
  } = options;

  const S = JSON.stringify(storageKey);
  const D = JSON.stringify(defaultTheme);
  const V = JSON.stringify(validThemes);
  const L = JSON.stringify(legacyKeys);
  const C = JSON.stringify(CSS_LINK_ID);

  return [
    '(function(){try{',
    `var S=${S};var D=${D};var V=${V};var L=${L};var C=${C};`,
    // Legacy migration
    'for(var i=0;i<L.length;i++){var lv=localStorage.getItem(L[i]);',
    'if(lv&&!localStorage.getItem(S)){localStorage.setItem(S,lv);localStorage.removeItem(L[i])}}',
    // Read and validate
    'var t=localStorage.getItem(S)||D;if(V.indexOf(t)===-1)t=D;',
    // Apply to DOM
    'document.documentElement.setAttribute("data-theme",t);window.__INITIAL_THEME__=t;',
    // Update CSS link href for non-default theme
    'if(t!==D){var b=document.documentElement.getAttribute("data-baseurl")||"";',
    'var l=document.getElementById(C);',
    'if(l)l.href=b+"/assets/css/themes/turbo/"+t+".css"}',
    '}catch(e){console.warn("Unable to load saved theme:",e)}})();',
  ].join('');
}
