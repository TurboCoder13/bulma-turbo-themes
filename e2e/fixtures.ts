import { test as base } from "@playwright/test";
import { HomePage } from "./pages/HomePage";
import { BasePage } from "./pages/BasePage";
import { ThemeDropdown } from "./pages/components/ThemeDropdown";

/**
 * Extended test fixtures with page objects.
 * Provides easy access to page objects and ensures proper cleanup.
 */
type TestFixtures = {
  homePage: HomePage;
  basePage: BasePage;
  themeDropdown: ThemeDropdown;
};

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
    // Cleanup: Clear localStorage after each test
    await page.evaluate(() => localStorage.clear());
  },

  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
    // Cleanup: Clear localStorage after each test
    await page.evaluate(() => localStorage.clear());
  },

  themeDropdown: async ({ page }, use) => {
    const themeDropdown = new ThemeDropdown(page);
    await use(themeDropdown);
  },
});

export { expect } from "@playwright/test";
