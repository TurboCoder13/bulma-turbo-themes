/**
 * CSS utility functions for E2E tests.
 * Safe string escaping for CSS selectors and regex patterns.
 */

/**
 * Escapes a string for safe use in CSS attribute selectors.
 * Escapes backslashes and double quotes to prevent selector injection.
 *
 * @param value - The string value to escape
 * @returns The escaped string safe for use in CSS attribute selectors
 */
export function escapeCssAttributeSelector(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * Escapes regex metacharacters in a string for safe use in RegExp.
 * Prevents regex injection attacks by escaping special characters.
 *
 * @param str - The string to escape
 * @returns The escaped string safe for use in RegExp
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
