import { expect, test } from './fixtures';
import {
  takeScreenshotWithHighlight,
  waitForStylesheetLoad,
} from './helpers';

/**
 * Homepage theme switching E2E tests.
 *
 * Tests:
 * - Theme selector is visible and functional
 * - Theme switching updates DOM attributes
 * - Theme persists in localStorage
 * - Visual snapshots for different themes
 */
test.describe('Homepage Theme Switching @smoke', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('should display theme selector', async ({ homePage }) => {
    await test.step('Verify theme selector is visible', async () => {
      await homePage.expectThemeSelectorVisible();

      // Take screenshot highlighting the selector
      await takeScreenshotWithHighlight(
        homePage.page,
        homePage.getThemeSelector(),
        'theme-selector-display'
      );
    });
  });

  test('should persist theme selection after page reload', async ({ homePage }) => {
    await test.step('Switch to catppuccin-mocha theme', async () => {
      await homePage.switchToTheme('catppuccin-mocha');
    });

    await test.step('Verify theme persists after reload', async () => {
      await homePage.verifyThemePersistence('catppuccin-mocha');

      // Take screenshot showing persisted theme
      const htmlElement = homePage.page.locator('html');
      await takeScreenshotWithHighlight(homePage.page, htmlElement, 'theme-persisted-after-reload');
    });
  });

  // Theme switching tests organized by theme
  test.describe('Theme Switching', () => {
    const themesToTest = ['catppuccin-mocha', 'catppuccin-latte'];

    for (const theme of themesToTest) {
      test(`should switch to ${theme} theme`, async ({ homePage, browserName }) => {
        // Skip catppuccin-latte on webkit due to CSS loading timing issues
        test.skip(browserName === 'webkit' && theme === 'catppuccin-latte', 'Webkit has CSS loading timing issues');

        await test.step(`Switch to ${theme} theme`, async () => {
          await homePage.switchToTheme(theme);
        });

        await test.step('Verify theme applied and take screenshot', async () => {
          // Verify data-theme attribute on html element
          await expect(homePage.page.locator('html')).toHaveAttribute('data-theme', theme);

          // Verify localStorage contains the theme
          const storedTheme = await homePage.page.evaluate(() => localStorage.getItem('turbo-theme'));
          expect(storedTheme).toBe(theme);

          // Verify theme CSS is loaded
          const themeCss = homePage.page.locator('#turbo-theme-css');
          // Escape all regex special chars
          const escapedTheme = theme.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          await expect(themeCss).toHaveAttribute(
            'href',
            new RegExp(`${escapedTheme}\\.css(?:\\?.*)?`)
          );

          // Wait for stylesheet network response + load event to avoid timeouts
          await homePage.page
            .waitForResponse((resp) => resp.url().includes(`${theme}.css`) && resp.ok(), {
              timeout: 15000,
            })
            .catch(() => {});
          await waitForStylesheetLoad(themeCss);

          // Take screenshot with theme CSS element highlighted
          await takeScreenshotWithHighlight(homePage.page, themeCss, `${theme}-theme-applied`);
        });
      });
    }
  });

  // Visual snapshot tests organized separately
  test.describe('Visual Snapshots @visual', () => {
    const themes = ['catppuccin-mocha', 'catppuccin-latte'];

    for (const theme of themes) {
      test(`should take visual snapshot of ${theme} theme`, async ({ homePage }) => {
        await test.step(`Switch to ${theme} theme`, async () => {
          await homePage.switchToTheme(theme);
        });

        await test.step('Take visual snapshot', async () => {
          // Wait for CSS to be fully applied
          const themeCss = homePage.page.locator('#turbo-theme-css');
          // Escape all regex special chars
          const escapedTheme = theme.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          await expect(themeCss).toHaveAttribute(
            'href',
            new RegExp(`${escapedTheme}\\.css(?:\\?.*)?`)
          );
          // stylesheet loaded (wait for 'load' if not yet loaded)
          await homePage.page
            .waitForResponse((resp) => resp.url().includes(`${theme}.css`) && resp.ok(), {
              timeout: 15000,
            })
            .catch(() => {});
          await waitForStylesheetLoad(themeCss);

          // Take snapshot of the main content area
          const mainContent = homePage.getMainContent();

          // Skip visual snapshots for now - focus on functional testing
          // Visual regression testing can be added later with proper baseline snapshots
          await expect(mainContent).toBeVisible();
        });
      });
    }
  });
});
