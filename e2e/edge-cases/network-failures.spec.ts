import { expect, test } from '../fixtures';
import { interceptThemeCSS, removeThemeCSSInterception } from '../helpers/network-utils';

/**
 * Network failure and offline mode tests.
 *
 * Tests:
 * - Offline mode theme switching
 * - CSS load failure handling
 * - CSS timeout handling
 * - Network recovery
 * - UI responsiveness during slow loads
 */
test.describe('Offline Mode', () => {
  test('should handle theme switching in offline mode', async ({ homePage }) => {
    await homePage.goto();

    await test.step('Set initial theme', async () => {
      await homePage.selectTheme('catppuccin-mocha');
      await homePage.expectThemeApplied('catppuccin-mocha');
    });

    await test.step('Switch theme while offline', async () => {
      await homePage.page.context().setOffline(true);
      try {
        // Theme switching should still work (localStorage and DOM updates)
        // The data-theme attribute should update immediately
        const trigger = homePage.page.locator('#theme-trigger');
        await trigger.click();

        const themeMenu = homePage.page.locator('#theme-menu');
        await themeMenu.waitFor({ state: 'visible', timeout: 5000 });

        const themeOption = homePage.page.locator('.theme-option[data-theme="catppuccin-latte"]');
        await themeOption.click();

        // Verify data-theme attribute is updated (this doesn't require network)
        await expect(homePage.page.locator('html')).toHaveAttribute('data-theme', 'catppuccin-latte');

        // Verify localStorage is updated
        const storedTheme = await homePage.page.evaluate(() => localStorage.getItem('turbo-theme'));
        expect(storedTheme).toBe('catppuccin-latte');
      } finally {
        await homePage.page.context().setOffline(false);
      }
    });
  });
});

test.describe('Network Failure Handling', () => {
  // Skip network failure tests on webkit due to timing issues
  test.skip(({ browserName }) => browserName === 'webkit', 'Webkit has timing issues with network interception');

  test('should handle theme CSS load failure gracefully', async ({ homePage }) => {
    await homePage.goto();

    await test.step('Set initial theme successfully', async () => {
      await homePage.selectTheme('catppuccin-mocha');
      await homePage.expectThemeApplied('catppuccin-mocha');
    });

    await test.step('Intercept and fail CSS requests', async () => {
      await interceptThemeCSS(homePage.page, 'failed');
    });

    await test.step('Attempt theme switch with failing CSS', async () => {
      const trigger = homePage.page.locator('#theme-trigger');
      await trigger.click();

      const themeMenu = homePage.page.locator('#theme-menu');
      await expect(themeMenu).toBeVisible();

      const themeOption = homePage.page.locator('.theme-option[data-theme="catppuccin-latte"]');
      await themeOption.click();

      // data-theme should still update (localStorage and DOM update don't require network)
      await expect(homePage.page.locator('html')).toHaveAttribute(
        'data-theme',
        'catppuccin-latte'
      );

      // localStorage should be updated
      const storedTheme = await homePage.page.evaluate(() =>
        localStorage.getItem('turbo-theme')
      );
      expect(storedTheme).toBe('catppuccin-latte');
    });

    await test.step('Clean up interception', async () => {
      await removeThemeCSSInterception(homePage.page);
    });
  });

  test('should handle theme CSS timeout gracefully', async ({ homePage }) => {
    await homePage.goto();

    await test.step('Set initial theme successfully', async () => {
      await homePage.selectTheme('dracula');
      await homePage.expectThemeApplied('dracula');
    });

    await test.step('Intercept and timeout CSS requests', async () => {
      await interceptThemeCSS(homePage.page, 'timedout');
    });

    await test.step('Attempt theme switch with timing out CSS', async () => {
      const trigger = homePage.page.locator('#theme-trigger');
      await trigger.click();

      const themeMenu = homePage.page.locator('#theme-menu');
      await expect(themeMenu).toBeVisible();

      const themeOption = homePage.page.locator('.theme-option[data-theme="github-dark"]');
      await themeOption.click();

      // Theme selection should still work at the DOM level
      await expect(homePage.page.locator('html')).toHaveAttribute('data-theme', 'github-dark');
    });

    await test.step('Clean up interception', async () => {
      await removeThemeCSSInterception(homePage.page);
    });
  });

  test('should recover after network failure is resolved', async ({ homePage }) => {
    await homePage.goto();

    await test.step('Set initial theme', async () => {
      await homePage.selectTheme('catppuccin-mocha');
      await homePage.expectThemeApplied('catppuccin-mocha');
    });

    await test.step('Cause network failure', async () => {
      await interceptThemeCSS(homePage.page, 'failed');
    });

    await test.step('Attempt switch during failure', async () => {
      const trigger = homePage.page.locator('#theme-trigger');
      await trigger.click();

      const themeMenu = homePage.page.locator('#theme-menu');
      await expect(themeMenu).toBeVisible();

      const themeOption = homePage.page.locator('.theme-option[data-theme="catppuccin-latte"]');
      await themeOption.click();

      await expect(homePage.page.locator('html')).toHaveAttribute(
        'data-theme',
        'catppuccin-latte'
      );
    });

    await test.step('Remove interception and verify recovery on reload', async () => {
      await removeThemeCSSInterception(homePage.page);

      // Reload page - CSS should now load successfully
      await homePage.page.reload();
      await homePage.page.waitForLoadState('domcontentloaded');

      // Theme should persist from localStorage and CSS should load
      await homePage.expectThemeApplied('catppuccin-latte');

      // Verify CSS link is present
      const themeCss = homePage.page.locator('#turbo-theme-css');
      const href = await themeCss.getAttribute('href');
      expect(href).toContain('catppuccin-latte.css');
    });
  });

  test('should maintain UI responsiveness during slow CSS loads', async ({ homePage }) => {
    await homePage.goto();

    await test.step('Add artificial delay to CSS loading', async () => {
      await homePage.page.route('**/*.css', async (route) => {
        const url = route.request().url();
        if (url.includes('themes/')) {
          // Add 500ms delay to theme CSS (not too long to avoid timeout)
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
        await route.continue();
      });
    });

    await test.step('Verify UI remains interactive during slow load', async () => {
      const trigger = homePage.page.locator('#theme-trigger');

      // Trigger should be clickable immediately
      await trigger.click();

      const themeMenu = homePage.page.locator('#theme-menu');
      await themeMenu.waitFor({ state: 'visible', timeout: 5000 });

      // Menu should be visible and interactive
      await expect(themeMenu).toBeVisible();

      const themeOption = homePage.page.locator('.theme-option[data-theme="github-light"]');
      await expect(themeOption).toBeVisible();
    });

    await test.step('Clean up route', async () => {
      await homePage.page.unroute('**/*.css');
    });
  });
});
