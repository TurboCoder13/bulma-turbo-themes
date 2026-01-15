import { type Page, test as base } from '@playwright/test';
import { themeIds } from '../../packages/core/src/tokens/index.js';

/**
 * Valid theme IDs used across all examples.
 * Imported from core package (single source of truth).
 */
export const VALID_THEMES = themeIds;

export type ThemeId = (typeof themeIds)[number];

/**
 * Extended test fixtures for example tests.
 */
export type ExampleTestFixtures = {
  examplePage: Page;
};

/**
 * Helper function to clean up localStorage after tests.
 */
async function cleanupLocalStorage(page: Page): Promise<void> {
  try {
    if (!page.isClosed()) {
      await page.evaluate(() => localStorage.clear());
    }
  } catch {
    // Swallow cleanup errors to avoid masking test failures
  }
}

/**
 * Extended test with example fixtures.
 */
export const test = base.extend<ExampleTestFixtures>({
  examplePage: async ({ page }, use) => {
    await use(page);
    await cleanupLocalStorage(page);
  },
});

export { expect } from '@playwright/test';
