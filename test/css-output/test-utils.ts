/**
 * Shared utilities for CSS output tests.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const projectRoot = path.resolve(__dirname, '../..');
export const turboThemesDir = path.join(projectRoot, 'assets', 'css', 'themes', 'turbo');
export const turboCoreFile = path.join(projectRoot, 'assets', 'css', 'turbo-core.css');

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

/**
 * Parse CSS content and extract variable definitions.
 * Returns a map of variable name to value.
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
 */
export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Read file content.
 */
export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Calculate WCAG contrast ratio between two colors.
 * Returns a ratio >= 1 (higher is better contrast).
 */
export function getContrastRatio(fg: string, bg: string): number {
  const fgLum = getRelativeLuminance(fg);
  const bgLum = getRelativeLuminance(bg);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance per WCAG 2.1 spec.
 */
export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);

  const [r, g, b] = rgb.map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB array [r, g, b].
 */
export function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');

  if (cleanHex.length === 3) {
    return [
      parseInt(cleanHex[0] + cleanHex[0], 16),
      parseInt(cleanHex[1] + cleanHex[1], 16),
      parseInt(cleanHex[2] + cleanHex[2], 16),
    ];
  }

  return [
    parseInt(cleanHex.substring(0, 2), 16),
    parseInt(cleanHex.substring(2, 4), 16),
    parseInt(cleanHex.substring(4, 6), 16),
  ];
}

/**
 * Convert hex color to brightness value (0-255).
 */
export function hexToBrightness(hex: string): number {
  const cleanHex = hex.replace('#', '');

  let r: number, g: number, b: number;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }

  // Calculate perceived brightness (ITU-R BT.601)
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
