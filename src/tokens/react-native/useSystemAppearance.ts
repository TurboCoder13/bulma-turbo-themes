// SPDX-License-Identifier: MIT
/**
 * System appearance detection utilities
 *
 * Provides helpers for detecting and responding to system dark/light mode.
 */

import { useState, useEffect } from 'react';
import { getThemesByAppearance } from '../index.js';
import { DEFAULT_LIGHT_THEME, DEFAULT_DARK_THEME } from './ThemeProvider.js';

/**
 * Type for color scheme values
 */
export type ColorScheme = 'light' | 'dark' | null | undefined;

/**
 * Type for the useColorScheme hook from React Native
 */
export type UseColorSchemeHook = () => ColorScheme;

/**
 * Hook to get system appearance with a fallback
 *
 * This wraps React Native's useColorScheme hook and provides a fallback
 * value when the system preference is not available.
 *
 * @param useColorScheme - React Native's useColorScheme hook
 * @param fallback - Fallback value (defaults to 'dark')
 * @returns 'light' or 'dark'
 *
 * @example
 * ```tsx
 * import { useColorScheme } from 'react-native';
 * import { useSystemAppearance } from '@turbocoder13/bulma-turbo-themes/tokens/react-native';
 *
 * function MyComponent() {
 *   const appearance = useSystemAppearance(useColorScheme);
 *   // appearance is always 'light' or 'dark', never null
 * }
 * ```
 */
export function useSystemAppearance(
  useColorScheme?: UseColorSchemeHook,
  fallback: 'light' | 'dark' = 'dark'
): 'light' | 'dark' {
  const systemScheme = useColorScheme?.();
  return systemScheme === 'light' ? 'light' : systemScheme === 'dark' ? 'dark' : fallback;
}

/**
 * Get the default theme ID for a given appearance
 *
 * @param appearance - 'light' or 'dark'
 * @param options - Optional custom theme mappings
 * @returns Theme ID string
 *
 * @example
 * ```tsx
 * const themeId = getThemeForAppearance('dark');
 * // Returns 'catppuccin-mocha' by default
 *
 * const customThemeId = getThemeForAppearance('light', {
 *   light: 'github-light',
 *   dark: 'github-dark'
 * });
 * // Returns 'github-light'
 * ```
 */
export function getThemeForAppearance(
  appearance: 'light' | 'dark',
  options?: { light?: string; dark?: string }
): string {
  const lightTheme = options?.light ?? DEFAULT_LIGHT_THEME;
  const darkTheme = options?.dark ?? DEFAULT_DARK_THEME;
  return appearance === 'light' ? lightTheme : darkTheme;
}

/**
 * Get all available theme IDs for a given appearance
 *
 * @param appearance - 'light' or 'dark'
 * @returns Array of theme IDs
 *
 * @example
 * ```tsx
 * const darkThemes = getAvailableThemesForAppearance('dark');
 * // ['catppuccin-mocha', 'catppuccin-macchiato', 'dracula', 'github-dark', ...]
 * ```
 */
export function getAvailableThemesForAppearance(appearance: 'light' | 'dark'): string[] {
  return getThemesByAppearance(appearance).map((t) => t.id);
}

/**
 * Hook to automatically select a theme based on system appearance
 *
 * Returns a theme ID that matches the system's dark/light mode preference.
 *
 * @param useColorScheme - React Native's useColorScheme hook
 * @param options - Optional custom theme mappings
 * @returns Theme ID string
 *
 * @example
 * ```tsx
 * import { useColorScheme } from 'react-native';
 *
 * function App() {
 *   const themeId = useAutoTheme(useColorScheme);
 *   const { colors, styles } = useTheme(themeId);
 *   // Theme automatically matches system preference
 * }
 * ```
 */
export function useAutoTheme(
  useColorScheme?: UseColorSchemeHook,
  options?: { light?: string; dark?: string }
): string {
  const appearance = useSystemAppearance(useColorScheme);
  return getThemeForAppearance(appearance, options);
}

/**
 * Hook to track appearance changes with a callback
 *
 * Useful for analytics or persisting user preferences.
 *
 * @param useColorScheme - React Native's useColorScheme hook
 * @param onAppearanceChange - Callback when appearance changes
 * @returns Current appearance
 */
export function useAppearanceListener(
  useColorScheme?: UseColorSchemeHook,
  onAppearanceChange?: (appearance: 'light' | 'dark') => void
): 'light' | 'dark' {
  const appearance = useSystemAppearance(useColorScheme);
  const [prevAppearance, setPrevAppearance] = useState(appearance);

  useEffect(() => {
    if (appearance !== prevAppearance) {
      setPrevAppearance(appearance);
      onAppearanceChange?.(appearance);
    }
  }, [appearance, prevAppearance, onAppearanceChange]);

  return appearance;
}

/**
 * Create a theme switcher function
 *
 * Returns a memoized function that cycles through themes of the same appearance.
 *
 * @param currentThemeId - Current theme ID
 * @param setTheme - Function to set the theme
 * @returns Function to cycle to next theme
 */
export function createThemeCycler(
  currentThemeId: string,
  setTheme: (themeId: string) => void
): () => void {
  return () => {
    const themes = getThemesByAppearance('dark');
    const currentIndex = themes.findIndex((t) => t.id === currentThemeId);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    if (nextTheme) {
      setTheme(nextTheme.id);
    }
  };
}
