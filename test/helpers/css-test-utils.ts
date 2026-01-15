/**
 * CSS Test Utilities
 * Helper functions for CSS output validation tests.
 */
import fs from 'node:fs';

/**
 * Parse CSS content and extract variable definitions.
 * Returns a map of variable name to value.
 *
 * @param css - CSS content to parse
 * @returns Map of variable name (including --) to value
 */
export function parseCssVariables(css: string): Map<string, string> {
  const variables = new Map<string, string>();
  // Match CSS variable definitions: --name: value;
  const regex = /--([\w-]+):\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(css)) !== null) {
    variables.set(`--${match[1]}`, match[2].trim());
  }
  return variables;
}

/**
 * Check if a file exists.
 *
 * @param filePath - Path to check
 * @returns True if file exists
 */
export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Read file content as string.
 *
 * @param filePath - Path to read
 * @returns File content as UTF-8 string
 */
export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

// Hex color pattern (3, 4, 6, or 8 hex digits)
export const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

// Required CSS variables that every theme must have
export const REQUIRED_CSS_VARIABLES = [
  '--turbo-bg-base',
  '--turbo-bg-surface',
  '--turbo-bg-overlay',
  '--turbo-text-primary',
  '--turbo-text-secondary',
  '--turbo-text-inverse',
  '--turbo-brand-primary',
  '--turbo-state-info',
  '--turbo-state-success',
  '--turbo-state-warning',
  '--turbo-state-danger',
  '--turbo-border-default',
  '--turbo-accent-link',
  '--turbo-heading-h1',
  '--turbo-heading-h2',
  '--turbo-heading-h3',
  '--turbo-heading-h4',
  '--turbo-heading-h5',
  '--turbo-heading-h6',
  '--turbo-body-primary',
  '--turbo-body-secondary',
  '--turbo-link-default',
  '--turbo-selection-fg',
  '--turbo-selection-bg',
  '--turbo-blockquote-border',
  '--turbo-blockquote-fg',
  '--turbo-blockquote-bg',
  '--turbo-code-inline-fg',
  '--turbo-code-inline-bg',
  '--turbo-code-block-fg',
  '--turbo-code-block-bg',
  '--turbo-table-border',
  '--turbo-table-stripe',
  '--turbo-table-thead-bg',
  '--turbo-font-sans',
  '--turbo-font-mono',
];

// Variables that should contain hex color values
export const HEX_COLOR_VARIABLES = [
  '--turbo-bg-base',
  '--turbo-bg-surface',
  '--turbo-bg-overlay',
  '--turbo-text-primary',
  '--turbo-text-secondary',
  '--turbo-text-inverse',
  '--turbo-brand-primary',
  '--turbo-state-info',
  '--turbo-state-success',
  '--turbo-state-warning',
  '--turbo-state-danger',
  '--turbo-border-default',
  '--turbo-accent-link',
  '--turbo-heading-h1',
  '--turbo-heading-h2',
  '--turbo-heading-h3',
  '--turbo-heading-h4',
  '--turbo-heading-h5',
  '--turbo-heading-h6',
  '--turbo-body-primary',
  '--turbo-body-secondary',
  '--turbo-link-default',
  '--turbo-selection-fg',
  '--turbo-selection-bg',
  '--turbo-blockquote-border',
  '--turbo-blockquote-fg',
  '--turbo-blockquote-bg',
  '--turbo-code-inline-fg',
  '--turbo-code-inline-bg',
  '--turbo-code-block-fg',
  '--turbo-code-block-bg',
  '--turbo-table-border',
  '--turbo-table-stripe',
  '--turbo-table-thead-bg',
];
