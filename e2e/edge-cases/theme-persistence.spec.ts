import { expect, test } from '../fixtures';

/**
 * Theme persistence and switching edge case tests.
 *
 * Tests:
 * - Rapid theme switching
 * - Theme persistence across navigation
 * - Empty localStorage handling
 * - Invalid localStorage theme handling
 * - CSS link updates
 * - Selector state preservation
 */
test.describe('Theme Persistence Edge Cases', () => {
  test('should handle rapid theme switching', async ({ homePage }) => {
    await homePage.goto();

    await test.step('Rapidly switch between themes', async () => {
      // Switch to catppuccin-mocha
      await homePage.selectTheme('catppuccin-mocha');

      // Immediately switch to catppuccin-latte
      await homePage.selectTheme('catppuccin-latte');

      // Immediately switch back to catppuccin-mocha
      await homePage.selectTheme('catppuccin-mocha');
    });

    await test.step('Verify final theme is correctly applied', async () => {
      await homePage.expectThemeApplied('catppuccin-mocha');
    });
  });

  test('should maintain theme consistency across page navigations', async ({ basePage }) => {
    await basePage.goto('/');

    await test.step('Set theme to catppuccin-mocha', async () => {
      await basePage.selectTheme('catppuccin-mocha');
      await basePage.expectThemeApplied('catppuccin-mocha');
    });

    await test.step('Navigate to components page', async () => {
      await basePage.navigateToPage('components');
    });

    await test.step('Verify theme persists on components page', async () => {
      await basePage.expectThemeApplied('catppuccin-mocha');
    });

    await test.step('Navigate to themes page', async () => {
      await basePage.navigateToPage('themes');
    });

    await test.step('Verify theme persists on themes page', async () => {
      await basePage.expectThemeApplied('catppuccin-mocha');
    });

    await test.step('Navigate back to home', async () => {
      await basePage.navigateToPage('home');
    });

    await test.step('Verify theme still persists on home page', async () => {
      await basePage.expectThemeApplied('catppuccin-mocha');
    });
  });

  test('should handle empty localStorage gracefully', async ({ homePage }) => {
    await test.step('Navigate to page, then clear localStorage before reload to test default theme loading', async () => {
      await homePage.goto();
      await homePage.page.evaluate(() => localStorage.clear());
    });

    await test.step('Reload and verify default theme loads', async () => {
      await homePage.page.reload();
      await homePage.page.waitForLoadState('domcontentloaded');

      // Should load with a default theme (catppuccin-mocha)
      const dataTheme = await homePage.page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
      );
      expect(dataTheme).toBe('catppuccin-mocha');
    });
  });

  test('should update theme CSS link href correctly', async ({ homePage }) => {
    await homePage.goto();

    await test.step('Switch to catppuccin-mocha and verify CSS link', async () => {
      await homePage.selectTheme('catppuccin-mocha');

      const themeCss = homePage.page.locator('#turbo-theme-css');
      const href = await themeCss.getAttribute('href');

      expect(href).toContain('catppuccin-mocha.css');
    });

    await test.step('Switch to catppuccin-latte and verify CSS link updated', async () => {
      await homePage.selectTheme('catppuccin-latte');

      const themeCss = homePage.page.locator('#turbo-theme-css');
      const href = await themeCss.getAttribute('href');

      expect(href).toContain('catppuccin-latte.css');
      expect(href).not.toContain('catppuccin-mocha.css');
    });
  });

  test('should handle invalid localStorage theme gracefully', async ({ homePage }) => {
    // Navigate first to get access to localStorage
    await homePage.goto();

    await test.step('Set invalid theme in localStorage', async () => {
      await homePage.page.evaluate(() => {
        localStorage.setItem('turbo-theme', 'invalid-theme-that-does-not-exist');
      });
    });

    await test.step('Reload and verify fallback to default theme', async () => {
      await homePage.page.reload();
      await homePage.page.waitForLoadState('domcontentloaded');

      // Should fall back to default theme since invalid theme doesn't exist
      const dataTheme = await homePage.page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
      );

      // The blocking script validates themes and falls back to default
      expect(dataTheme).toBe('catppuccin-mocha');
    });
  });

  test('should preserve theme selection in selector after page load', async ({ homePage, browserName }) => {
    // Skip on webkit due to CSS loading timing issues
    test.skip(browserName === 'webkit', 'Webkit has different CSS loading timing');
    await homePage.goto();

    await test.step('Select a theme', async () => {
      await homePage.selectTheme('dracula');
      await homePage.expectThemeApplied('dracula');
    });

    await test.step('Reload and verify selector shows correct theme', async () => {
      await homePage.page.reload();
      await homePage.page.waitForLoadState('domcontentloaded');

      // Verify the theme label shows the saved theme
      const themeLabel = homePage.page.locator('#theme-label');
      await expect(themeLabel).toHaveText('Dracula');

      // Verify theme is applied
      await homePage.expectThemeApplied('dracula');
    });
  });
});
