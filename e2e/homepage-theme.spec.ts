import { test, expect } from "./fixtures";
import {
  takeScreenshotWithHighlight,
  takeScreenshotWithMultipleHighlights,
} from "./helpers";

/**
 * Homepage theme switching E2E tests.
 *
 * Tests:
 * - Theme dropdown is visible and functional
 * - Theme switching updates DOM attributes
 * - Theme persists in localStorage
 * - Visual snapshots for different themes
 */
test.describe("Homepage Theme Switching @smoke", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test("should display theme dropdown", async ({ homePage }) => {
    await test.step("Verify dropdown and trigger are visible", async () => {
      await homePage.expectThemeDropdownVisible();

      // Take screenshot highlighting both elements
      await takeScreenshotWithMultipleHighlights(
        homePage.page,
        [homePage.getThemeDropdown(), homePage.getThemeTrigger()],
        "theme-dropdown-display",
      );
    });
  });

  test("should switch to github-dark theme", async ({ homePage }) => {
    await test.step("Open theme dropdown", async () => {
      await homePage.openThemeDropdown();

      // Take screenshot with dropdown highlighted
      await takeScreenshotWithHighlight(
        homePage.page,
        homePage.getThemeDropdown(),
        "theme-dropdown-open",
      );
    });

    await test.step("Select github-dark theme", async () => {
      const githubDarkOption = homePage.page.locator('[data-theme-id="github-dark"]');
      await githubDarkOption.click();
    });

    await test.step("Verify theme applied", async () => {
      await homePage.expectThemeApplied("github-dark");

      // Take screenshot with theme CSS element highlighted
      const themeCss = homePage.page.locator("#theme-flavor-css");
      await takeScreenshotWithHighlight(
        homePage.page,
        themeCss,
        "github-dark-theme-applied",
      );
    });
  });

  test("should switch to catppuccin-latte theme", async ({ homePage }) => {
    await test.step("Open theme dropdown", async () => {
      await homePage.openThemeDropdown();
    });

    await test.step("Select catppuccin-latte theme", async () => {
      const latteOption = homePage.page.locator('[data-theme-id="catppuccin-latte"]');
      await latteOption.click();
    });

    await test.step("Verify theme applied", async () => {
      await homePage.expectThemeApplied("catppuccin-latte");

      // Take screenshot with theme CSS element highlighted
      const themeCss = homePage.page.locator("#theme-flavor-css");
      await takeScreenshotWithHighlight(
        homePage.page,
        themeCss,
        "catppuccin-latte-theme-applied",
      );
    });
  });

  test("should persist theme selection after page reload", async ({ homePage }) => {
    await test.step("Switch to github-dark theme", async () => {
      await homePage.switchToTheme("github-dark");
    });

    await test.step("Verify theme persists after reload", async () => {
      await homePage.verifyThemePersistence("github-dark");

      // Take screenshot showing persisted theme
      const htmlElement = homePage.page.locator("html");
      await takeScreenshotWithHighlight(
        homePage.page,
        htmlElement,
        "theme-persisted-after-reload",
      );
    });
  });

  test("should take visual snapshot of github-dark theme @visual", async ({
    homePage,
  }) => {
    await test.step("Switch to github-dark theme", async () => {
      await homePage.switchToTheme("github-dark");
    });

    await test.step("Take visual snapshot", async () => {
      // Wait for CSS to be fully applied
      const themeCss = homePage.page.locator("#theme-flavor-css");
      await expect(themeCss).toHaveAttribute("href", /github-dark\.css/);

      // Take snapshot of the main content area
      const mainContent = homePage.getMainContent();
      await expect(mainContent).toHaveScreenshot("homepage-github-dark");
    });
  });

  test("should take visual snapshot of catppuccin-latte theme @visual", async ({
    homePage,
  }) => {
    await test.step("Switch to catppuccin-latte theme", async () => {
      await homePage.switchToTheme("catppuccin-latte");
    });

    await test.step("Take visual snapshot", async () => {
      // Wait for CSS to be fully applied
      const themeCss = homePage.page.locator("#theme-flavor-css");
      await expect(themeCss).toHaveAttribute("href", /catppuccin-latte\.css/);

      // Take snapshot of the main content area
      const mainContent = homePage.getMainContent();
      await expect(mainContent).toHaveScreenshot("homepage-catppuccin-latte");
    });
  });
});
