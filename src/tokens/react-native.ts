// SPDX-License-Identifier: MIT
/**
 * React Native adapter for design tokens
 *
 * This module provides React Native-specific utilities for using
 * the design tokens in mobile apps built with React Native or Expo.
 *
 * Usage:
 * ```typescript
 * import { createStyleSheet, useTheme } from '@turbocoder13/bulma-turbo-themes/tokens/react-native';
 *
 * const styles = createStyleSheet('catppuccin-mocha');
 * // or
 * const { theme, styles } = useTheme('catppuccin-mocha');
 * ```
 */

import { getTheme, getTokens, flavors, type ThemeTokens } from './index.js';

/**
 * Flattened color palette for React Native StyleSheet
 * All colors are flat strings, ready for use in styles
 */
export interface FlatColorPalette {
  // Background colors
  backgroundBase: string;
  backgroundSurface: string;
  backgroundOverlay: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textInverse: string;

  // Brand colors
  brandPrimary: string;

  // State colors
  stateInfo: string;
  stateSuccess: string;
  stateWarning: string;
  stateDanger: string;

  // Border colors
  borderDefault: string;

  // Accent colors
  accentLink: string;

  // Content colors
  headingH1: string;
  headingH2: string;
  headingH3: string;
  headingH4: string;
  headingH5: string;
  headingH6: string;

  bodyPrimary: string;
  bodySecondary: string;

  linkDefault: string;

  selectionFg: string;
  selectionBg: string;

  codeInlineFg: string;
  codeInlineBg: string;
  codeBlockFg: string;
  codeBlockBg: string;
}

/**
 * Convert nested ThemeTokens to a flat color palette
 */
export function flattenTokens(tokens: ThemeTokens): FlatColorPalette {
  return {
    // Background
    backgroundBase: tokens.background.base,
    backgroundSurface: tokens.background.surface,
    backgroundOverlay: tokens.background.overlay,

    // Text
    textPrimary: tokens.text.primary,
    textSecondary: tokens.text.secondary,
    textInverse: tokens.text.inverse,

    // Brand
    brandPrimary: tokens.brand.primary,

    // State
    stateInfo: tokens.state.info,
    stateSuccess: tokens.state.success,
    stateWarning: tokens.state.warning,
    stateDanger: tokens.state.danger,

    // Border
    borderDefault: tokens.border.default,

    // Accent
    accentLink: tokens.accent.link,

    // Headings
    headingH1: tokens.content.heading.h1,
    headingH2: tokens.content.heading.h2,
    headingH3: tokens.content.heading.h3,
    headingH4: tokens.content.heading.h4,
    headingH5: tokens.content.heading.h5,
    headingH6: tokens.content.heading.h6,

    // Body
    bodyPrimary: tokens.content.body.primary,
    bodySecondary: tokens.content.body.secondary,

    // Link
    linkDefault: tokens.content.link.default,

    // Selection
    selectionFg: tokens.content.selection.fg,
    selectionBg: tokens.content.selection.bg,

    // Code
    codeInlineFg: tokens.content.codeInline.fg,
    codeInlineBg: tokens.content.codeInline.bg,
    codeBlockFg: tokens.content.codeBlock.fg,
    codeBlockBg: tokens.content.codeBlock.bg,
  };
}

/**
 * Get a flat color palette for a theme by ID
 * @param themeId - Theme identifier (e.g., 'catppuccin-mocha')
 * @returns Flat color palette or undefined if theme not found
 */
export function getColorPalette(themeId: string): FlatColorPalette | undefined {
  const tokens = getTokens(themeId);
  if (!tokens) return undefined;
  return flattenTokens(tokens);
}

/**
 * Pre-built color palettes for all themes
 * Use this for static imports when you know your theme at build time
 */
export const palettes: Record<string, FlatColorPalette> = Object.fromEntries(
  flavors.map((f) => [f.id, flattenTokens(f.tokens)])
);

/**
 * Base styles template for React Native
 * These can be used directly or as a starting point for your own styles
 */
export interface BaseStyles {
  container: {
    flex: number;
    backgroundColor: string;
  };
  text: {
    color: string;
    fontFamily: string;
  };
  textSecondary: {
    color: string;
    fontFamily: string;
  };
  heading: {
    color: string;
    fontWeight: 'bold';
  };
  link: {
    color: string;
  };
  card: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
  button: {
    backgroundColor: string;
    paddingVertical: number;
    paddingHorizontal: number;
    borderRadius: number;
  };
  buttonText: {
    color: string;
    fontWeight: 'bold';
  };
  input: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
    color: string;
  };
  success: { color: string };
  warning: { color: string };
  danger: { color: string };
  info: { color: string };
}

/**
 * Create base styles for a theme
 * @param themeId - Theme identifier (e.g., 'catppuccin-mocha')
 * @returns Base styles object ready for StyleSheet.create()
 */
export function createBaseStyles(themeId: string): BaseStyles | undefined {
  const theme = getTheme(themeId);
  if (!theme) return undefined;

  const { tokens } = theme;
  const fontFamily = tokens.typography.fonts.sans.split(',')[0]?.trim() || 'System';

  return {
    container: {
      flex: 1,
      backgroundColor: tokens.background.base,
    },
    text: {
      color: tokens.text.primary,
      fontFamily,
    },
    textSecondary: {
      color: tokens.text.secondary,
      fontFamily,
    },
    heading: {
      color: tokens.text.primary,
      fontWeight: 'bold',
    },
    link: {
      color: tokens.accent.link,
    },
    card: {
      backgroundColor: tokens.background.surface,
      borderColor: tokens.border.default,
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
    },
    button: {
      backgroundColor: tokens.brand.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 6,
    },
    buttonText: {
      color: tokens.text.inverse,
      fontWeight: 'bold',
    },
    input: {
      backgroundColor: tokens.background.surface,
      borderColor: tokens.border.default,
      borderWidth: 1,
      borderRadius: 6,
      padding: 12,
      color: tokens.text.primary,
    },
    success: { color: tokens.state.success },
    warning: { color: tokens.state.warning },
    danger: { color: tokens.state.danger },
    info: { color: tokens.state.info },
  };
}

// Re-export useful items from the main tokens module
export { getTheme, getTokens, getThemesByAppearance, getThemesByVendor, flavors, themeIds, vendors } from './index.js';
export type { ThemeFlavor, ThemeTokens } from './index.js';
