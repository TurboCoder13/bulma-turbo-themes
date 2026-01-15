// SPDX-License-Identifier: MIT
/**
 * ThemeProvider - React Context for theme management
 *
 * Provides theme state to all child components and handles:
 * - Theme switching
 * - System appearance detection
 * - Persistence (optional)
 */

import type React from 'react';
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getTheme, getThemesByAppearance, type ThemeFlavor } from '../index.js';
import { getColorPalette, type FlatColorPalette } from './colors.js';
import { createBaseStyles, type BaseStyles } from './styles.js';

/**
 * Default themes for light and dark modes
 */
export const DEFAULT_LIGHT_THEME = 'catppuccin-latte';
export const DEFAULT_DARK_THEME = 'catppuccin-mocha';

/**
 * Theme context value interface
 */
export interface ThemeContextValue {
  /** Current theme ID */
  themeId: string;
  /** Full theme flavor object */
  theme: ThemeFlavor;
  /** Flattened color palette for easy access */
  colors: FlatColorPalette;
  /** Pre-built styles for common components */
  styles: BaseStyles;
  /** Current appearance (light or dark) */
  appearance: 'light' | 'dark';
  /** Function to change the theme */
  setTheme: (themeId: string) => void;
  /** Toggle between light and dark themes */
  toggleAppearance: () => void;
}

/**
 * Theme context (internal)
 */
const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Props for ThemeProvider component
 */
export interface ThemeProviderProps {
  /** Initial theme ID (defaults based on system appearance) */
  initialTheme?: string;
  /** Whether to follow system dark/light mode preference */
  followSystem?: boolean;
  /** Custom hook to get system color scheme (for React Native) */
  useColorScheme?: () => 'light' | 'dark' | null | undefined;
  /** Callback when theme changes */
  onThemeChange?: (themeId: string) => void;
  /** Default theme for light mode */
  lightTheme?: string;
  /** Default theme for dark mode */
  darkTheme?: string;
  /** Child components */
  children: React.ReactNode;
}

/**
 * Get default theme based on appearance
 */
export function getDefaultThemeForAppearance(
  appearance: 'light' | 'dark',
  lightTheme = DEFAULT_LIGHT_THEME,
  darkTheme = DEFAULT_DARK_THEME
): string {
  return appearance === 'light' ? lightTheme : darkTheme;
}

/**
 * ThemeProvider component
 *
 * Wraps your app to provide theme context to all child components.
 *
 * @example
 * ```tsx
 * import { ThemeProvider } from '@turbocoder13/turbo-themes/tokens/react-native';
 * import { useColorScheme } from 'react-native';
 *
 * function App() {
 *   return (
 *     <ThemeProvider useColorScheme={useColorScheme} followSystem>
 *       <MyApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export function ThemeProvider({
  initialTheme,
  followSystem = false,
  useColorScheme,
  onThemeChange,
  lightTheme = DEFAULT_LIGHT_THEME,
  darkTheme = DEFAULT_DARK_THEME,
  children,
}: ThemeProviderProps): React.ReactElement {
  // Get system color scheme if hook is provided
  const systemColorScheme = useColorScheme?.() ?? null;
  const systemAppearance: 'light' | 'dark' = systemColorScheme === 'dark' ? 'dark' : 'light';

  // Determine initial theme
  const getInitialTheme = useCallback(() => {
    if (initialTheme) {
      return initialTheme;
    }
    if (followSystem) {
      return getDefaultThemeForAppearance(systemAppearance, lightTheme, darkTheme);
    }
    return darkTheme;
  }, [initialTheme, followSystem, systemAppearance, lightTheme, darkTheme]);

  const [themeId, setThemeId] = useState<string>(getInitialTheme);

  // Update theme when system appearance changes (if following system)
  useEffect(() => {
    if (followSystem && !initialTheme) {
      const newTheme = getDefaultThemeForAppearance(systemAppearance, lightTheme, darkTheme);
      setThemeId(newTheme);
    }
  }, [followSystem, initialTheme, systemAppearance, lightTheme, darkTheme]);

  // Get theme data
  const theme = useMemo(() => {
    const t = getTheme(themeId);
    if (!t) {
      // Fallback to default dark theme if theme not found
      return getTheme(darkTheme)!;
    }
    return t;
  }, [themeId, darkTheme]);

  const colors = useMemo(() => {
    return getColorPalette(theme.id)!;
  }, [theme.id]);

  const styles = useMemo(() => {
    return createBaseStyles(theme.id)!;
  }, [theme.id]);

  // Theme setter with callback
  const handleSetTheme = useCallback(
    (newThemeId: string) => {
      const newTheme = getTheme(newThemeId);
      if (newTheme) {
        setThemeId(newThemeId);
        onThemeChange?.(newThemeId);
      }
    },
    [onThemeChange]
  );

  // Toggle between light and dark
  const toggleAppearance = useCallback(() => {
    const newTheme = theme.appearance === 'dark' ? lightTheme : darkTheme;
    handleSetTheme(newTheme);
  }, [theme.appearance, lightTheme, darkTheme, handleSetTheme]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      themeId: theme.id,
      theme,
      colors,
      styles,
      appearance: theme.appearance,
      setTheme: handleSetTheme,
      toggleAppearance,
    }),
    [theme, colors, styles, handleSetTheme, toggleAppearance]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context
 *
 * Must be used within a ThemeProvider.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { colors, styles, setTheme, appearance } = useThemeContext();
 *
 *   return (
 *     <View style={styles.container}>
 *       <Text style={styles.text}>Current theme: {appearance}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Get all available themes for a specific appearance
 */
export function getThemesForAppearance(appearance: 'light' | 'dark'): readonly ThemeFlavor[] {
  return getThemesByAppearance(appearance);
}
