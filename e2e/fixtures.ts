import { type Page, test as base } from '@playwright/test';
import { BasePage } from './pages/BasePage';
import { HomePage } from './pages/HomePage';
import { ThemeDropdown } from './pages/components/ThemeDropdown';

/**
 * Extended test fixtures with page objects.
 * Provides easy access to page objects and ensures proper cleanup.
 */
export type TestFixtures = {
  homePage: HomePage;
  basePage: BasePage;
  themeDropdown: ThemeDropdown;
};

/**
 * Helper function to clean up localStorage after tests.
 * Swallows errors to avoid masking test failures.
 *
 * @param page - The Playwright page instance to clean up.
 */
async function cleanupLocalStorage(page: Page): Promise<void> {
  try {
    if (!page.isClosed()) {
      await page.evaluate(() => localStorage.clear());
    }
  } catch {
    // Swallow cleanup errors to avoid masking test failures
    // Page may be closed or navigated away, which is fine
  }
}

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
    await cleanupLocalStorage(page);
  },

  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
    await cleanupLocalStorage(page);
  },

  themeDropdown: async ({ page }, use) => {
    const themeDropdown = new ThemeDropdown(page);
    await use(themeDropdown);
    await cleanupLocalStorage(page);
  },
});

export { expect } from '@playwright/test';
