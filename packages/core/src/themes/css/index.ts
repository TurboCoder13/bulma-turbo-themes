// SPDX-License-Identifier: MIT
// CSS generation module - Public API

export * from './types.js';

import type { ThemeFlavor } from '../types.js';
import { generateSyntaxHighlightingCSS } from './syntax-generator.js';
import { generateThemeCSSVariables } from './bulma-generator.js';
import { cssGlobalOverrides as globalOverrides } from './global-overrides.js';

/**
 * Generate CSS for a specific flavor.
 */
export function cssForFlavor(flavor: ThemeFlavor): string {
  const syntaxCSS = generateSyntaxHighlightingCSS(flavor);
  const variablesCSS = generateThemeCSSVariables(flavor);

  return `/* SPDX-License-Identifier: MIT */
${syntaxCSS}
${variablesCSS}`;
}

/**
 * Generate global CSS overrides that apply theme variables.
 */
export function cssGlobalOverrides(): string {
  return globalOverrides();
}

// Re-export internal modules for advanced usage
export { generateSyntaxHighlightingCSS } from './syntax-generator.js';
export { generateThemeCSSVariables } from './bulma-generator.js';
