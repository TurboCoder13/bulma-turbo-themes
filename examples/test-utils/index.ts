/**
 * Example test utilities index.
 * Re-exports all utilities for convenient importing.
 */

export { test, expect, VALID_THEMES, type ThemeId, type ExampleTestFixtures } from './fixtures';

export {
  escapeRegex,
  selectTheme,
  getCurrentTheme,
  expectThemeApplied,
  waitForStylesheetLoad,
  getCssVariable,
  expectButtonColor,
  expectThemePersistsAfterReload,
} from './helpers';

export { BaseExamplePage, type BaseExamplePageOptions } from './BaseExamplePage';

export { createExampleTestSuite, type ExampleTestSuiteConfig } from './createExampleTestSuite';
