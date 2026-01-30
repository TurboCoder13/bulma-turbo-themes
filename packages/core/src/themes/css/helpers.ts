// SPDX-License-Identifier: MIT
// Helper functions for CSS generation

import { hexToHsl } from '../bulma.js';
import type { ThemeTokens } from '../types.js';
import type {
  CSSVariableMapping,
  HSLVariableMapping,
  HSLColorMapping,
  ComponentTokenMapping,
} from './types.js';

/**
 * Unified token path resolver options.
 */
interface ResolveTokenOptions {
  /** Optional path prefix (e.g., 'components' for component tokens) */
  prefix?: string;
  /** Fallback path to try if primary path fails */
  fallbackPath?: string;
}

/**
 * Traverses an object using a dot-separated path.
 * Internal helper used by all token resolution functions.
 */
function traversePath(obj: unknown, path: string): unknown {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    // Safe: path is from hardcoded TOKEN_MAPPINGS, not user input
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

/**
 * Unified token path resolver.
 * Gets a value from tokens using a dot-separated path with optional prefix and fallback.
 */
export function resolveTokenPath(
  tokens: ThemeTokens,
  path: string,
  options?: ResolveTokenOptions
): string | undefined {
  const { prefix, fallbackPath } = options ?? {};

  // Build full path with optional prefix
  const fullPath = prefix ? `${prefix}.${path}` : path;

  // Try primary path
  const value = traversePath(tokens, fullPath);
  if (typeof value === 'string') {
    return value;
  }

  // Try fallback path if provided
  if (fallbackPath) {
    const fallbackValue = traversePath(tokens, fallbackPath);
    if (typeof fallbackValue === 'string') {
      return fallbackValue;
    }
  }

  return undefined;
}

/**
 * Gets a nested value from an object using a dot-separated path.
 * Convenience wrapper around resolveTokenPath.
 */
export function getTokenValue(tokens: ThemeTokens, path: string): string | undefined {
  return resolveTokenPath(tokens, path);
}

/**
 * Gets a component token value with fallback.
 * Convenience wrapper around resolveTokenPath for component tokens.
 */
export function getComponentTokenValue(
  tokens: ThemeTokens,
  componentPath: string,
  fallbackPath: string
): string {
  if (!tokens.components) {
    return fallbackPath ? (resolveTokenPath(tokens, fallbackPath) ?? '') : '';
  }

  return (
    resolveTokenPath(tokens, componentPath, { prefix: 'components', fallbackPath }) ?? ''
  );
}

/**
 * Converts a hex color to an HSL string.
 */
export function hexToHslString(hex: string): string {
  const hsl = hexToHsl(hex);
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

/**
 * Escapes a string for use in CSS selectors.
 * Fallback implements CSS.escape algorithm per CSSOM spec when native is unavailable.
 */
export function escapeCssId(id: string): string {
  if (typeof CSS !== 'undefined' && CSS.escape) {
    return CSS.escape(id);
  }
  // Fallback: escape per CSSOM spec (simplified for valid identifier chars)
  return id.replace(/[\0-\x1f\x7f]|^-?[0-9]|[^a-zA-Z0-9_-]/g, (char) => {
    if (char === '\0') return '\uFFFD';
    const code = char.charCodeAt(0);
    return '\\' + code.toString(16) + ' ';
  });
}

/**
 * Validates and sanitizes a CSS color value.
 * Returns the value if valid, or a transparent fallback if invalid.
 */
export function sanitizeCssColor(value: string | undefined): string {
  if (!value || typeof value !== 'string') {
    return 'transparent';
  }
  // Allow hex colors, rgb/rgba/hsl/hsla functions, and named colors
  const trimmed = value.trim();
  // Hex color validation
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed)) {
    return trimmed;
  }
  // RGB/RGBA/HSL/HSLA function validation
  if (/^(rgb|rgba|hsl|hsla)\([^)]+\)$/i.test(trimmed)) {
    // Additional check: no semicolons or braces in the value
    if (!/[;{}]/.test(trimmed)) {
      return trimmed;
    }
  }
  // Named color validation (common named colors only)
  const namedColors = new Set([
    'transparent', 'inherit', 'currentColor', 'initial', 'unset',
    'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange',
    'purple', 'gray', 'grey', 'pink', 'brown', 'cyan', 'magenta',
  ]);
  if (namedColors.has(trimmed.toLowerCase())) {
    return trimmed;
  }
  // Default fallback for invalid values
  return 'transparent';
}

/**
 * Generates CSS variable declarations from a mapping array.
 */
export function generateVariables(tokens: ThemeTokens, mappings: CSSVariableMapping[]): string[] {
  return mappings.map((mapping) => {
    let value = getTokenValue(tokens, mapping.tokenPath);
    if (value === undefined && mapping.fallbackPath) {
      value = getTokenValue(tokens, mapping.fallbackPath);
    }
    return `  ${mapping.cssVar}: ${value ?? ''};`;
  });
}

/**
 * Generates HSL component variables (h, s%, l%).
 */
export function generateHSLComponents(tokens: ThemeTokens, mapping: HSLVariableMapping): string[] {
  const hex = getTokenValue(tokens, mapping.tokenPath);
  if (!hex) return [];

  const hsl = hexToHsl(hex);
  return [
    `  ${mapping.hVar}: ${hsl.h};`,
    `  ${mapping.sVar}: ${hsl.s}%;`,
    `  ${mapping.lVar}: ${hsl.l}%;`,
  ];
}

/**
 * Generates HSL color variables.
 */
export function generateHSLColors(tokens: ThemeTokens, mappings: HSLColorMapping[]): string[] {
  return mappings.map((mapping) => {
    const hex = getTokenValue(tokens, mapping.tokenPath);
    if (!hex) return `  ${mapping.cssVar}: ;`;
    return `  ${mapping.cssVar}: ${hexToHslString(hex)};`;
  });
}

/**
 * Generates component token variables with fallbacks.
 */
export function generateComponentVariables(
  tokens: ThemeTokens,
  mappings: ComponentTokenMapping[]
): string[] {
  if (!tokens.components) return [];

  const lines: string[] = [];
  let currentComponent = '';

  for (const mapping of mappings) {
    const component = mapping.componentPath.split('.')[0] ?? '';

    // Add comment for new component section
    if (component && component !== currentComponent) {
      const componentName = component.charAt(0).toUpperCase() + component.slice(1);
      lines.push(`  /* ${componentName} component tokens */`);
      currentComponent = component;
    }

    // Special case for modal.bg which has a non-token fallback
    let value: string;
    if (mapping.componentPath === 'modal.bg' && !mapping.fallbackPath) {
      value = getComponentTokenValue(tokens, mapping.componentPath, '') || 'rgba(10, 10, 10, 0.86)';
    } else {
      value = getComponentTokenValue(tokens, mapping.componentPath, mapping.fallbackPath);
    }

    lines.push(`  ${mapping.cssVar}: ${value};`);
  }

  return lines;
}
