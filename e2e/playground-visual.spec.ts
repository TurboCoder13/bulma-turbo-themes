import { expect, test } from '@playwright/test';

/**
 * Visual regression tests for example pages.
 *
 * Tests representative themes across example pages using Playwright's
 * built-in screenshot comparison. Baselines are stored per-platform in
 * e2e/snapshots/{platform}/ to handle rendering differences.
 *
 * Note: Visual tests run only on Chromium for consistency.
 * Different browsers render fonts and colors differently, so
 * maintaining separate baselines per browser is impractical.
 *
 * To update baselines locally:
 *   bun run test:e2e --update-snapshots
 *
 * @see playwright.config.ts for snapshot configuration
 */

// Skip on non-chromium browsers - visual tests run only on Chromium for consistent baselines
test.skip(({ browserName }) => browserName !== 'chromium', 'Visual tests run only on Chromium');

// Representative theme samples (light and dark variants)
const themes = ['catppuccin-mocha', 'catppuccin-latte', 'dracula', 'github-dark', 'github-light'];

// Example pages to test
const examples = [
  { name: 'html-vanilla', path: '/examples/html-vanilla/index.html' },
  { name: 'tailwind', path: '/examples/tailwind/index.html' },
  { name: 'jekyll', path: '/examples/jekyll/index.html' },
];

test.describe('Example Visual Regression @visual', () => {
  for (const example of examples) {
    test.describe(example.name, () => {
      for (const theme of themes) {
        test(`renders correctly with ${theme}`, async ({ page }) => {
          // Navigate and wait for page to be fully loaded
          await page.goto(example.path);
          await page.waitForLoadState('networkidle');

          // Apply theme via JavaScript (same as user selection would)
          await page.evaluate((t) => {
            document.documentElement.dataset.theme = t;
            localStorage.setItem('turbo-theme', t);
          }, theme);

          // Wait for CSS to apply (transition time + buffer)
          await page.waitForTimeout(100);

          // Verify theme was applied
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

          // Take full-page screenshot and compare to baseline
          // Screenshot name format: {example}-{theme}.png
          await expect(page).toHaveScreenshot(`${example.name}-${theme}.png`, {
            fullPage: true,
          });
        });
      }
    });
  }
});

test.describe('Theme Selector Component @visual', () => {
  const selectorThemes = ['catppuccin-mocha', 'dracula'];

  for (const theme of selectorThemes) {
    test(`dropdown open state with ${theme}`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Apply theme
      await page.evaluate((t) => {
        document.documentElement.dataset.theme = t;
      }, theme);

      // Open theme selector dropdown
      const trigger = page.locator('#theme-trigger');
      await trigger.click();

      const menu = page.locator('#theme-menu');
      await expect(menu).toBeVisible();

      // Take screenshot of dropdown in open state
      await expect(page).toHaveScreenshot(`theme-selector-open-${theme}.png`, {
        fullPage: false,
      });
    });
  }
});
