// SPDX-License-Identifier: MIT
/**
 * Color utilities for React Native
 *
 * Provides flattened color palettes optimized for React Native StyleSheet usage.
 */

import { getTokens, flavors, type ThemeTokens } from '../index.js';

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

