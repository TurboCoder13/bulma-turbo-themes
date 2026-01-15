// SPDX-License-Identifier: MIT
/**
 * @turbocoder13/turbo-themes-css
 *
 * Pure CSS Custom Properties output for Turbo Themes.
 * Framework-agnostic theming with minimal footprint.
 *
 * @packageDocumentation
 */

// Generator exports
export {
  CSS_VAR_PREFIX,
  generateCssVarsFromTokens,
  generateThemeCss,
  generateCoreCss,
  generateCombinedCss,
} from './generator.js';

// Base styles exports
export {
  CSS_RESET,
  CSS_BASE,
  generateBaseCss,
  generateResetCss,
} from './base.js';

// Syntax highlighting exports
export {
  CSS_SYNTAX,
  generateSyntaxVarsFromTokens,
  generateSyntaxCss,
  generateSyntaxBaseCss,
} from './syntax.js';

// Re-export types for convenience
export type { ThemeFlavor, ThemeTokens } from '@turbocoder13/turbo-themes-core';
