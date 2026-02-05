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
