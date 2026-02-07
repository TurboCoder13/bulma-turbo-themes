/* SPDX-License-Identifier: MIT */

/**
 * Check if a key is a valid unquoted JavaScript identifier.
 * @param {string} key - The key to check
 * @returns {boolean} True if the key can be used unquoted
 */
export function isValidIdentifier(key) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}

/**
 * Escape a string for use as a quoted key or value.
 * @param {string} str - The string to escape
 * @returns {string} The escaped string
 */
export function escapeString(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

// ---------------------------------------------------------------------------
// WCAG contrast helpers for per-state text color overrides (#267)
// ---------------------------------------------------------------------------

function sRGBtoLinear(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Relative luminance per WCAG 2.1.
 * @param {string} hex - Hex color (e.g. '#ff0000')
 * @returns {number}
 */
export function getLuminance(hex) {
  const h = hex.replace('#', '');
  const r = sRGBtoLinear(parseInt(h.slice(0, 2), 16) / 255);
  const g = sRGBtoLinear(parseInt(h.slice(2, 4), 16) / 255);
  const b = sRGBtoLinear(parseInt(h.slice(4, 6), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * WCAG contrast ratio between two hex colors.
 * @param {string} fg
 * @param {string} bg
 * @returns {number}
 */
export function contrastRatio(fg, bg) {
  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Compute per-state text color overrides where the default inverse text
 * does not meet WCAG AA large-text contrast (3:1) against the state
 * background color.
 *
 * @param {Record<string, string>} stateColors - e.g. { info, success, warning, danger }
 * @param {string} inverse - Default text color used on state buttons
 * @param {string} textPrimary - Theme primary text color (candidate override)
 * @returns {Record<string, string>} e.g. { successText: '#000000', warningText: '#363636' }
 */
export function stateTextOverrides(stateColors, inverse, textPrimary) {
  const overrides = {};
  const WCAG_AA_LARGE = 3.0;
  for (const [key, bg] of Object.entries(stateColors)) {
    const invCR = contrastRatio(inverse, bg);
    if (invCR >= WCAG_AA_LARGE) continue;
    const candidates = [
      { color: textPrimary, cr: contrastRatio(textPrimary, bg) },
      { color: '#ffffff', cr: contrastRatio('#ffffff', bg) },
      { color: '#000000', cr: contrastRatio('#000000', bg) },
    ];
    candidates.sort((a, b) => b.cr - a.cr);
    if (candidates[0].cr >= WCAG_AA_LARGE) {
      overrides[`${key}Text`] = candidates[0].color;
    }
  }
  return overrides;
}
