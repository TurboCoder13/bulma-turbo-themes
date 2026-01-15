/**
 * Test fixtures barrel export.
 *
 * Provides reusable test data and element factories for
 * consistent testing across the codebase.
 *
 * @example
 * import { LIGHT_THEME, createMockElement, THEME_IDS } from '../fixtures';
 */

// Theme fixtures
export {
  LIGHT_THEME,
  DARK_THEME,
  NO_FONTS_THEME,
  TEST_THEMES,
  THEME_IDS,
  REAL_THEME_IDS,
  createMockFlavor,
  createMockTokens,
  createTestThemes,
  type ThemeAppearance,
} from './themes.js';

// Token fixtures
export {
  LIGHT_THEME_TOKENS,
  DARK_THEME_TOKENS,
  NO_WEBFONTS_TOKENS,
  LOW_CONTRAST_TOKENS,
} from './tokens.js';

// DOM fixtures
export {
  // Element factories
  createMockElement,
  createMockImg,
  createMockSpan,
  createMockLink,
  createMockClassList,
  createMockDropdownContainer,
  createMockLocalStorage,
  createMockNavbarItem,
  createMockHead,
  createMockBody,
  createMockDocumentElement,
  createMockMenuItems,
  createMockKeyEvent,
  createMockAbortController,
  // Types
  type MockElement,
  type MockImg,
  type MockSpan,
  type MockLink,
  type MockClassList,
  type MockDropdownContainer,
  type MockLocalStorage,
  type MockNavbarItem,
  type MockHead,
  type MockBody,
  type MockDocumentElement,
  type MockKeyboardEvent,
  type MockAbortSignal,
  type MockAbortControllerResult,
} from './dom.js';
