// SPDX-License-Identifier: MIT
/**
 * React Native theming module
 *
 * Provides a complete theming solution for React Native apps including:
 * - ThemeProvider context for app-wide theme state
 * - Hooks for accessing and switching themes
 * - System appearance detection
 * - Pre-built styles for common components
 *
 * @example Basic usage with ThemeProvider
 * ```tsx
 * import { ThemeProvider, useThemeContext } from '@turbocoder13/bulma-turbo-themes/tokens/react-native';
 * import { useColorScheme } from 'react-native';
 *
 * function App() {
 *   return (
 *     <ThemeProvider useColorScheme={useColorScheme} followSystem>
 *       <MyApp />
 *     </ThemeProvider>
 *   );
 * }
 *
 * function MyApp() {
 *   const { colors, styles, setTheme } = useThemeContext();
 *   return (
 *     <View style={styles.container}>
 *       <Text style={styles.h1}>Welcome!</Text>
 *     </View>
 *   );
 * }
 * ```
 *
 * @example Usage without context
 * ```tsx
 * import { useTheme, useThemeColors } from '@turbocoder13/bulma-turbo-themes/tokens/react-native';
 *
 * function MyComponent() {
 *   const { colors, styles } = useTheme('catppuccin-mocha');
 *   return <View style={styles.container} />;
 * }
 * ```
 */

// Colors - flattened color palettes
export { flattenTokens, getColorPalette, palettes, type FlatColorPalette } from './colors.js';

// Styles - pre-built component styles
export {
  createBaseStyles,
  createStateStyles,
  spacing,
  typography,
  borderRadius,
  shadows,
  type BaseStyles,
} from './styles.js';

// Context - ThemeProvider and related
export {
  ThemeProvider,
  useThemeContext,
  getDefaultThemeForAppearance,
  getThemesForAppearance,
  DEFAULT_LIGHT_THEME,
  DEFAULT_DARK_THEME,
  type ThemeProviderProps,
  type ThemeContextValue,
} from './ThemeProvider.js';

// Hooks - standalone theme hooks
export {
  useTheme,
  useThemeColors,
  useThemeStyles,
  useThemeData,
  useThemeTokens,
} from './useTheme.js';

// System appearance - dark mode detection
export {
  useSystemAppearance,
  useAutoTheme,
  useAppearanceListener,
  getThemeForAppearance,
  getAvailableThemesForAppearance,
  createThemeCycler,
  type ColorScheme,
  type UseColorSchemeHook,
} from './useSystemAppearance.js';

// Re-export commonly used items from the main tokens module
export {
  getTheme,
  getTokens,
  getThemesByAppearance,
  getThemesByVendor,
  flavors,
  themeIds,
  vendors,
  type ThemeFlavor,
  type ThemeTokens,
  type ThemePackage,
} from '../index.js';
