// SPDX-License-Identifier: MIT
/**
 * useTheme hook and related utilities
 *
 * Provides hooks for accessing theme data with or without context.
 */

import { useMemo } from 'react';
import { getTheme, getTokens, type ThemeFlavor, type ThemeTokens } from '../index.js';
import { getColorPalette, type FlatColorPalette } from './colors.js';
import { createBaseStyles, type BaseStyles } from './styles.js';

// Re-export context hook for convenience
export { useThemeContext } from './ThemeProvider.js';

/**
 * Hook to get colors for a specific theme (no context required)
 *
 * Use this when you need theme colors but don't want to use the full
 * ThemeProvider context system.
 *
 * @param themeId - Theme identifier (e.g., 'catppuccin-mocha')
 * @returns Flat color palette
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const colors = useThemeColors('catppuccin-mocha');
 *   return <View style={{ backgroundColor: colors.backgroundBase }} />;
 * }
 * ```
 */
export function useThemeColors(themeId: string): FlatColorPalette {
  return useMemo(() => {
    const palette = getColorPalette(themeId);
    if (!palette) {
      // Fallback to catppuccin-mocha if theme not found
      return getColorPalette('catppuccin-mocha')!;
    }
    return palette;
  }, [themeId]);
}

/**
 * Hook to get styles for a specific theme (no context required)
 *
 * Use this when you need pre-built styles but don't want to use the full
 * ThemeProvider context system.
 *
 * @param themeId - Theme identifier (e.g., 'catppuccin-mocha')
 * @returns Base styles object
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const styles = useThemeStyles('catppuccin-mocha');
 *   return (
 *     <View style={styles.container}>
 *       <Text style={styles.text}>Hello</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useThemeStyles(themeId: string): BaseStyles {
  return useMemo(() => {
    const styles = createBaseStyles(themeId);
    if (!styles) {
      // Fallback to catppuccin-mocha if theme not found
      return createBaseStyles('catppuccin-mocha')!;
    }
    return styles;
  }, [themeId]);
}

/**
 * Hook to get full theme data (no context required)
 *
 * Returns the complete theme object including metadata.
 *
 * @param themeId - Theme identifier (e.g., 'catppuccin-mocha')
 * @returns Theme flavor object
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const theme = useThemeData('catppuccin-mocha');
 *   console.log(theme.appearance); // 'dark'
 *   console.log(theme.vendor); // 'catppuccin'
 * }
 * ```
 */
export function useThemeData(themeId: string): ThemeFlavor {
  return useMemo(() => {
    const theme = getTheme(themeId);
    if (!theme) {
      return getTheme('catppuccin-mocha')!;
    }
    return theme;
  }, [themeId]);
}

/**
 * Hook to get raw tokens for a specific theme (no context required)
 *
 * Returns the nested token structure (not flattened).
 *
 * @param themeId - Theme identifier (e.g., 'catppuccin-mocha')
 * @returns Theme tokens object
 */
export function useThemeTokens(themeId: string): ThemeTokens {
  return useMemo(() => {
    const tokens = getTokens(themeId);
    if (!tokens) {
      return getTokens('catppuccin-mocha')!;
    }
    return tokens;
  }, [themeId]);
}

/**
 * Combined hook that returns all theme-related data
 *
 * @param themeId - Theme identifier (e.g., 'catppuccin-mocha')
 * @returns Object with theme, colors, and styles
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, colors, styles } = useTheme('catppuccin-mocha');
 *   return (
 *     <View style={styles.container}>
 *       <Text style={[styles.text, { color: colors.brandPrimary }]}>
 *         Theme: {theme.label}
 *       </Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useTheme(themeId: string): {
  theme: ThemeFlavor;
  colors: FlatColorPalette;
  styles: BaseStyles;
  tokens: ThemeTokens;
} {
  const theme = useThemeData(themeId);
  const colors = useThemeColors(themeId);
  const styles = useThemeStyles(themeId);
  const tokens = useThemeTokens(themeId);

  return useMemo(
    () => ({ theme, colors, styles, tokens }),
    [theme, colors, styles, tokens]
  );
}

