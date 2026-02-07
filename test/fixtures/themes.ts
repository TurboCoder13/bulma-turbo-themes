/**
 * Theme fixtures for tests.
 *
 * Provides pre-defined theme configurations for testing
 * theme selection, persistence, and application logic.
 */
import type { ThemeFlavor } from '../../packages/core/src/themes/types.js';
import { createMockFlavor, LIGHT_THEME_TOKENS, DARK_THEME_TOKENS, NO_WEBFONTS_TOKENS } from './tokens.js';

// Re-export token factories for convenience
export { createMockFlavor, createMockTokens } from './tokens.js';

/**
 * Pre-defined light theme fixture
 */
export const LIGHT_THEME: ThemeFlavor = createMockFlavor({
  id: 'test-light',
  label: 'Test Light',
  vendor: 'test',
  appearance: 'light',
  tokens: LIGHT_THEME_TOKENS,
});

/**
 * Pre-defined dark theme fixture
 */
export const DARK_THEME: ThemeFlavor = createMockFlavor({
  id: 'test-dark',
  label: 'Test Dark',
  vendor: 'test',
  appearance: 'dark',
  tokens: DARK_THEME_TOKENS,
});

/**
 * Theme without web fonts (for testing font handling)
 */
export const NO_FONTS_THEME: ThemeFlavor = createMockFlavor({
  id: 'test-no-fonts',
  label: 'Test No Fonts',
  vendor: 'test',
  appearance: 'light',
  tokens: NO_WEBFONTS_TOKENS,
});

/**
 * Collection of test themes for parametrized tests
 */
export const TEST_THEMES: ThemeFlavor[] = [LIGHT_THEME, DARK_THEME, NO_FONTS_THEME];

/**
 * Theme ID constants for consistent test references
 */
export const THEME_IDS = {
  light: 'test-light',
  dark: 'test-dark',
  noFonts: 'test-no-fonts',
  default: 'catppuccin-mocha',
  invalid: 'nonexistent-theme-xyz',
} as const;

/**
 * Real theme IDs from the production theme registry.
 * Derived from the canonical token data — always in sync.
 */
export { themeIds as REAL_THEME_IDS } from '../../packages/core/src/tokens/index.js';

/**
 * Theme appearances for filtering tests
 */
export type ThemeAppearance = 'light' | 'dark';

/**
 * Create multiple themes for testing theme switching behavior
 *
 * @param count - Number of themes to create
 * @returns Array of test themes with unique IDs
 */
export function createTestThemes(count: number): ThemeFlavor[] {
  return Array.from({ length: count }, (_, i) =>
    createMockFlavor({
      id: `test-theme-${i}`,
      label: `Test Theme ${i}`,
      appearance: i % 2 === 0 ? 'light' : 'dark',
    })
  );
}
