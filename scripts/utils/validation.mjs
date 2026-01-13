// SPDX-License-Identifier: MIT
/**
 * Shared validation utilities for build scripts.
 * Provides input sanitization to prevent injection vulnerabilities.
 */

/**
 * Regex pattern for valid theme IDs.
 * Only allows alphanumeric characters, hyphens, and underscores.
 */
const VALID_THEME_ID_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

/**
 * Regex pattern for valid semantic version strings.
 * Matches: major.minor.patch with optional pre-release and build metadata.
 */
const VALID_VERSION_PATTERN = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;

/**
 * Validates a theme ID to ensure it only contains safe characters.
 * Theme IDs are used in CSS selectors and file paths.
 *
 * @param {string} themeId - The theme ID to validate
 * @returns {boolean} True if the theme ID is valid
 */
export function isValidThemeId(themeId) {
  if (typeof themeId !== 'string' || themeId.length === 0 || themeId.length > 64) {
    return false;
  }
  return VALID_THEME_ID_PATTERN.test(themeId);
}

/**
 * Validates and sanitizes a theme ID.
 * Throws an error if the theme ID is invalid.
 *
 * @param {string} themeId - The theme ID to validate
 * @returns {string} The validated theme ID
 * @throws {Error} If the theme ID is invalid
 */
export function validateThemeId(themeId) {
  if (!isValidThemeId(themeId)) {
    throw new Error(
      `Invalid theme ID: "${themeId}". Theme IDs must start with a letter and contain only alphanumeric characters, hyphens, and underscores.`
    );
  }
  return themeId;
}

/**
 * Validates a version string to ensure it follows semantic versioning.
 *
 * @param {string} version - The version string to validate
 * @returns {boolean} True if the version is valid
 */
export function isValidVersion(version) {
  if (typeof version !== 'string' || version.length === 0 || version.length > 64) {
    return false;
  }
  return VALID_VERSION_PATTERN.test(version);
}

/**
 * Validates and returns a version string.
 * Throws an error if the version is invalid.
 *
 * @param {string} version - The version string to validate
 * @returns {string} The validated version string
 * @throws {Error} If the version is invalid
 */
export function validateVersion(version) {
  if (!isValidVersion(version)) {
    throw new Error(
      `Invalid version: "${version}". Version must follow semantic versioning (e.g., 1.0.0, 1.0.0-beta.1).`
    );
  }
  return version;
}

/**
 * Escapes special characters in a string for safe use in Swift source code.
 * Handles Swift keywords and invalid identifier characters.
 *
 * @param {string} identifier - The identifier to escape
 * @returns {string} The escaped identifier safe for Swift
 */
export function escapeSwiftIdentifier(identifier) {
  // Swift reserved keywords that need backtick escaping
  const swiftKeywords = new Set([
    'associatedtype', 'class', 'deinit', 'enum', 'extension', 'fileprivate',
    'func', 'import', 'init', 'inout', 'internal', 'let', 'open', 'operator',
    'private', 'protocol', 'public', 'rethrows', 'static', 'struct', 'subscript',
    'typealias', 'var', 'break', 'case', 'continue', 'default', 'defer', 'do',
    'else', 'fallthrough', 'for', 'guard', 'if', 'in', 'repeat', 'return',
    'switch', 'where', 'while', 'as', 'Any', 'catch', 'false', 'is', 'nil',
    'super', 'self', 'Self', 'throw', 'throws', 'true', 'try', 'Type',
    // Context-sensitive keywords
    'associativity', 'convenience', 'dynamic', 'didSet', 'final', 'get',
    'infix', 'indirect', 'lazy', 'left', 'mutating', 'none', 'nonmutating',
    'optional', 'override', 'postfix', 'precedence', 'prefix', 'Protocol',
    'required', 'right', 'set', 'some', 'unowned', 'weak', 'willSet',
  ]);

  // If it's a keyword, wrap in backticks
  if (swiftKeywords.has(identifier)) {
    return `\`${identifier}\``;
  }

  // Check if identifier is valid (starts with letter/underscore, contains only valid chars)
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
    // Replace invalid characters with underscores
    const sanitized = identifier
      .replace(/^[^a-zA-Z_]/, '_')
      .replace(/[^a-zA-Z0-9_]/g, '_');
    return sanitized;
  }

  return identifier;
}

/**
 * Escapes a string value for use in Swift string literals.
 *
 * @param {string} value - The string value to escape
 * @returns {string} The escaped string safe for Swift string literals
 */
export function escapeSwiftString(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Escapes a string value for use in CSS.
 * Prevents CSS injection attacks.
 *
 * @param {string} value - The CSS value to escape
 * @returns {string} The escaped CSS value
 */
export function escapeCssValue(value) {
  // Remove potentially dangerous characters and escape others
  return String(value)
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/[{}]/g, '') // Remove braces (can break CSS structure)
    .replace(/;/g, '') // Remove semicolons (can inject properties)
    .replace(/\\/g, '\\\\'); // Escape backslashes
}
