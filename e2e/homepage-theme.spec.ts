import { test, expect } from "@playwright/test";

/**
 * Homepage theme switching E2E tests.
 *
 * Tests:
 * - Theme dropdown is visible and functional
 * - Theme switching updates DOM attributes
 * - Theme persists in localStorage
 * - Visual snapshots for different themes
 */
test.describe("Homepage Theme Switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for theme initialization
    await page.waitForLoadState("networkidle");
  });

  test("should display theme dropdown", async ({ page }) => {
    const dropdown = page.getByTestId("theme-dropdown");
    await expect(dropdown).toBeVisible();

    const trigger = page.getByTestId("theme-trigger");
    await expect(trigger).toBeVisible();
  });

  test("should switch to github-dark theme", async ({ page }) => {
    // Hover over dropdown to open it (Bulma dropdown opens on hover)
    const dropdown = page.getByTestId("theme-dropdown");
    await dropdown.hover();

    // Wait for dropdown to be visible
    await expect(dropdown).toHaveClass(/is-active/);

    // Click github-dark theme option
    const githubDarkOption = page.locator('[data-theme-id="github-dark"]');
    await githubDarkOption.click();

    // Wait for theme to apply
    await page.waitForLoadState("networkidle");

    // Verify DOM attribute updated
    await expect(page.locator("html")).toHaveAttribute("data-flavor", "github-dark");

    // Verify localStorage updated
    const savedTheme = await page.evaluate(() =>
      localStorage.getItem("bulma-theme-flavor"),
    );
    expect(savedTheme).toBe("github-dark");

    // Wait for CSS to load
    const themeCss = page.locator("#theme-flavor-css");
    await expect(themeCss).toHaveAttribute("href", /github-dark\.css/);
  });

  test("should switch to catppuccin-latte theme", async ({ page }) => {
    // Hover over dropdown to open it
    const dropdown = page.getByTestId("theme-dropdown");
    await dropdown.hover();

    // Wait for dropdown to be visible
    await expect(dropdown).toHaveClass(/is-active/);

    // Click catppuccin-latte theme option
    const latteOption = page.locator('[data-theme-id="catppuccin-latte"]');
    await latteOption.click();

    // Wait for theme to apply
    await page.waitForLoadState("networkidle");

    // Verify DOM attribute updated
    await expect(page.locator("html")).toHaveAttribute(
      "data-flavor",
      "catppuccin-latte",
    );

    // Verify localStorage updated
    const savedTheme = await page.evaluate(() =>
      localStorage.getItem("bulma-theme-flavor"),
    );
    expect(savedTheme).toBe("catppuccin-latte");

    // Wait for CSS to load
    const themeCss = page.locator("#theme-flavor-css");
    await expect(themeCss).toHaveAttribute("href", /catppuccin-latte\.css/);
  });

  test("should persist theme selection after page reload", async ({ page }) => {
    // Set theme to github-dark
    const dropdown = page.getByTestId("theme-dropdown");
    await dropdown.hover();

    const githubDarkOption = page.locator('[data-theme-id="github-dark"]');
    await githubDarkOption.click();

    await page.waitForLoadState("networkidle");

    // Reload page
    await page.reload();

    // Wait for theme initialization
    await page.waitForLoadState("networkidle");

    // Verify theme persisted
    await expect(page.locator("html")).toHaveAttribute("data-flavor", "github-dark");

    const savedTheme = await page.evaluate(() =>
      localStorage.getItem("bulma-theme-flavor"),
    );
    expect(savedTheme).toBe("github-dark");
  });

  test("should take visual snapshot of github-dark theme", async ({ page }) => {
    // Switch to github-dark
    const dropdown = page.getByTestId("theme-dropdown");
    await dropdown.hover();

    const githubDarkOption = page.locator('[data-theme-id="github-dark"]');
    await githubDarkOption.click();

    await page.waitForLoadState("networkidle");

    // Wait for CSS to fully load
    await page.waitForTimeout(500);

    // Take snapshot of the main content area
    const mainContent = page.getByTestId("main-content");
    await expect(mainContent).toHaveScreenshot("homepage-github-dark.png");
  });

  test("should take visual snapshot of catppuccin-latte theme", async ({ page }) => {
    // Switch to catppuccin-latte
    const dropdown = page.getByTestId("theme-dropdown");
    await dropdown.hover();

    const latteOption = page.locator('[data-theme-id="catppuccin-latte"]');
    await latteOption.click();

    await page.waitForLoadState("networkidle");

    // Wait for CSS to fully load
    await page.waitForTimeout(500);

    // Take snapshot of the main content area
    const mainContent = page.getByTestId("main-content");
    await expect(mainContent).toHaveScreenshot("homepage-catppuccin-latte.png");
  });
});
