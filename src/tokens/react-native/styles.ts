// SPDX-License-Identifier: MIT
/**
 * Style utilities for React Native
 *
 * Provides pre-built styles and style generators for React Native components.
 */

import { getTheme } from '../index.js';

/**
 * Spacing scale (in pixels)
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Typography scale
 */
export const typography = {
  h1: { fontSize: 32, lineHeight: 40, fontWeight: 'bold' as const },
  h2: { fontSize: 28, lineHeight: 36, fontWeight: 'bold' as const },
  h3: { fontSize: 24, lineHeight: 32, fontWeight: 'bold' as const },
  h4: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  h5: { fontSize: 18, lineHeight: 26, fontWeight: '600' as const },
  h6: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: 'normal' as const },
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: 'normal' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: 'normal' as const },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
} as const;

/**
 * Border radius scale
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

/**
 * Shadow presets for different elevations
 * Works on both iOS and Android
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
} as const;

/**
 * Base styles template for React Native
 * These can be used directly or as a starting point for your own styles
 */
export interface BaseStyles {
  // Layout
  container: {
    flex: number;
    backgroundColor: string;
  };
  safeArea: {
    flex: number;
    backgroundColor: string;
  };
  centered: {
    flex: number;
    justifyContent: 'center';
    alignItems: 'center';
    backgroundColor: string;
  };
  row: {
    flexDirection: 'row';
    alignItems: 'center';
  };

  // Typography
  text: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
  };
  textSecondary: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
  };
  h1: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    fontWeight: 'bold';
  };
  h2: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    fontWeight: 'bold';
  };
  h3: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    fontWeight: 'bold';
  };
  h4: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    fontWeight: '600';
  };
  h5: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    fontWeight: '600';
  };
  h6: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    fontWeight: '600';
  };
  caption: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
  };
  label: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    fontWeight: '500';
  };
  link: {
    color: string;
  };

  // Components
  card: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  cardElevated: {
    backgroundColor: string;
    borderRadius: number;
    padding: number;
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  button: {
    backgroundColor: string;
    paddingVertical: number;
    paddingHorizontal: number;
    borderRadius: number;
    alignItems: 'center';
    justifyContent: 'center';
  };
  buttonOutline: {
    backgroundColor: string;
    paddingVertical: number;
    paddingHorizontal: number;
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
    alignItems: 'center';
    justifyContent: 'center';
  };
  buttonText: {
    color: string;
    fontWeight: 'bold';
    fontSize: number;
  };
  buttonTextOutline: {
    color: string;
    fontWeight: 'bold';
    fontSize: number;
  };
  input: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
    color: string;
    fontSize: number;
  };
  inputFocused: {
    borderColor: string;
    borderWidth: number;
  };

  // List items
  listItem: {
    flexDirection: 'row';
    alignItems: 'center';
    paddingVertical: number;
    paddingHorizontal: number;
    backgroundColor: string;
    borderBottomWidth: number;
    borderBottomColor: string;
  };
  listItemPressed: {
    backgroundColor: string;
  };

  // Badges & Tags
  badge: {
    paddingVertical: number;
    paddingHorizontal: number;
    borderRadius: number;
    backgroundColor: string;
  };
  badgeText: {
    color: string;
    fontSize: number;
    fontWeight: '600';
  };
  tag: {
    paddingVertical: number;
    paddingHorizontal: number;
    borderRadius: number;
    backgroundColor: string;
    borderWidth: number;
    borderColor: string;
  };
  tagText: {
    color: string;
    fontSize: number;
  };

  // Divider
  divider: {
    height: number;
    backgroundColor: string;
  };

  // State colors
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
    // Layout
    container: {
      flex: 1,
      backgroundColor: tokens.background.base,
    },
    safeArea: {
      flex: 1,
      backgroundColor: tokens.background.base,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: tokens.background.base,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    // Typography
    text: {
      color: tokens.text.primary,
      fontFamily,
      ...typography.body,
    },
    textSecondary: {
      color: tokens.text.secondary,
      fontFamily,
      ...typography.body,
    },
    h1: {
      color: tokens.content.heading.h1,
      fontFamily,
      ...typography.h1,
    },
    h2: {
      color: tokens.content.heading.h2,
      fontFamily,
      ...typography.h2,
    },
    h3: {
      color: tokens.content.heading.h3,
      fontFamily,
      ...typography.h3,
    },
    h4: {
      color: tokens.content.heading.h4,
      fontFamily,
      ...typography.h4,
    },
    h5: {
      color: tokens.content.heading.h5,
      fontFamily,
      ...typography.h5,
    },
    h6: {
      color: tokens.content.heading.h6,
      fontFamily,
      ...typography.h6,
    },
    caption: {
      color: tokens.text.secondary,
      fontFamily,
      ...typography.caption,
    },
    label: {
      color: tokens.text.primary,
      fontFamily,
      ...typography.label,
    },
    link: {
      color: tokens.accent.link,
    },

    // Components
    card: {
      backgroundColor: tokens.background.surface,
      borderColor: tokens.border.default,
      borderWidth: 1,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      ...shadows.sm,
    },
    cardElevated: {
      backgroundColor: tokens.background.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      ...shadows.md,
    },
    button: {
      backgroundColor: tokens.brand.primary,
      paddingVertical: spacing.sm + 4,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      paddingVertical: spacing.sm + 4,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: tokens.brand.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: tokens.text.inverse,
      fontWeight: 'bold',
      fontSize: 16,
    },
    buttonTextOutline: {
      color: tokens.brand.primary,
      fontWeight: 'bold',
      fontSize: 16,
    },
    input: {
      backgroundColor: tokens.background.surface,
      borderColor: tokens.border.default,
      borderWidth: 1,
      borderRadius: borderRadius.md,
      padding: spacing.sm + 4,
      color: tokens.text.primary,
      fontSize: 16,
    },
    inputFocused: {
      borderColor: tokens.brand.primary,
      borderWidth: 2,
    },

    // List items
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm + 4,
      paddingHorizontal: spacing.md,
      backgroundColor: tokens.background.base,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border.default,
    },
    listItemPressed: {
      backgroundColor: tokens.background.surface,
    },

    // Badges & Tags
    badge: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: tokens.brand.primary,
    },
    badgeText: {
      color: tokens.text.inverse,
      fontSize: 12,
      fontWeight: '600',
    },
    tag: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.sm,
      backgroundColor: tokens.background.surface,
      borderWidth: 1,
      borderColor: tokens.border.default,
    },
    tagText: {
      color: tokens.text.primary,
      fontSize: 12,
    },

    // Divider
    divider: {
      height: 1,
      backgroundColor: tokens.border.default,
    },

    // State colors
    success: { color: tokens.state.success },
    warning: { color: tokens.state.warning },
    danger: { color: tokens.state.danger },
    info: { color: tokens.state.info },
  };
}

/**
 * Create styles for a specific state color
 */
export function createStateStyles(themeId: string) {
  const theme = getTheme(themeId);
  if (!theme) return undefined;

  const { tokens } = theme;

  return {
    successBg: { backgroundColor: tokens.state.success },
    warningBg: { backgroundColor: tokens.state.warning },
    dangerBg: { backgroundColor: tokens.state.danger },
    infoBg: { backgroundColor: tokens.state.info },
    successText: { color: tokens.state.success },
    warningText: { color: tokens.state.warning },
    dangerText: { color: tokens.state.danger },
    infoText: { color: tokens.state.info },
  };
}

