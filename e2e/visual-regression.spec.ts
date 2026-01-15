import { expect, test } from '@playwright/test';
import { waitForThemeApplied } from './helpers';

/**
 * Visual regression tests for main site pages.
 *
 * Captures full-page screenshots across different themes to detect
 * visual changes. Uses Playwright's built-in toHaveScreenshot() with
 * platform-specific baselines.
 *
 * These tests complement playground-visual.spec.ts which focuses on examples.
 *
 * To update baselines:
 *   bun run test:e2e --update-snapshots
 */

// Skip on non-chromium - visual tests need consistent baseline
test.skip(({ browserName }) => browserName !== 'chromium', 'Visual tests run only on Chromium');

// Themes to test (representative light/dark samples)
const themes = [
  { id: 'catppuccin-mocha', type: 'dark' },
  { id: 'catppuccin-latte', type: 'light' },
  { id: 'dracula', type: 'dark' },
  { id: 'github-light', type: 'light' },
];

test.describe('Homepage Visual Regression @visual', () => {
  for (const theme of themes) {
    test(`homepage renders correctly with ${theme.id}`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Apply theme
      await page.evaluate((t) => {
        document.documentElement.dataset.theme = t;
        localStorage.setItem('turbo-theme', t);
      }, theme.id);

      // Wait for theme CSS to be applied (replaces arbitrary waitForTimeout)
      await waitForThemeApplied(page, theme.id);

      // Verify theme applied
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme.id);

      // Viewport screenshot (not fullPage to avoid height variations from font rendering)
      await expect(page).toHaveScreenshot(`homepage-${theme.id}.png`);
    });
  }
});

test.describe('Demo Page Visual Regression @visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/');
    await page.waitForLoadState('networkidle');
  });

  for (const theme of themes) {
    test(`demo page renders correctly with ${theme.id}`, async ({ page }) => {
      // Apply theme
      await page.evaluate((t) => {
        document.documentElement.dataset.theme = t;
        localStorage.setItem('turbo-theme', t);
      }, theme.id);

      // Wait for theme CSS to be applied
      await waitForThemeApplied(page, theme.id);

      // Viewport screenshot (not fullPage to avoid height variations from font rendering)
      await expect(page).toHaveScreenshot(`demo-${theme.id}.png`);
    });
  }
});

test.describe('Component State Visual Regression @visual', () => {
  test('theme selector hover state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const trigger = page.locator('#theme-trigger');
    await trigger.hover();

    await expect(page).toHaveScreenshot('theme-selector-hover.png', {
      fullPage: false,
    });
  });

  test('theme selector focused state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const trigger = page.locator('#theme-trigger');
    await trigger.focus();

    await expect(page).toHaveScreenshot('theme-selector-focus.png', {
      fullPage: false,
    });
  });

  test('theme menu item hover state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open dropdown
    const trigger = page.locator('#theme-trigger');
    await trigger.click();

    const menu = page.locator('#theme-menu');
    await expect(menu).toBeVisible();

    // Hover first menu item
    const firstItem = page.locator('.theme-option').first();
    await firstItem.hover();

    await expect(page).toHaveScreenshot('theme-menu-item-hover.png', {
      fullPage: false,
    });
  });
});

test.describe('Responsive Layout Visual Regression @visual', () => {
  const viewports = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 },
  ];

  for (const viewport of viewports) {
    test(`homepage at ${viewport.name} viewport`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Capture viewport only (not fullPage) to avoid height variations from font rendering
      await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`);
    });
  }
});

test.describe('Theme Transition Visual Regression @visual', () => {
  test('captures theme transition', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Start with dark theme
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'catppuccin-mocha';
    });
    await waitForThemeApplied(page, 'catppuccin-mocha');

    // Capture before state
    await expect(page).toHaveScreenshot('transition-before.png', {
      fullPage: false,
    });

    // Switch to light theme
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'catppuccin-latte';
    });

    // Wait for theme to be applied
    await waitForThemeApplied(page, 'catppuccin-latte');

    // Capture after state
    await expect(page).toHaveScreenshot('transition-after.png', {
      fullPage: false,
    });
  });
});

test.describe('Dark/Light Mode Contrast @visual', () => {
  test('dark theme has dark background', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'catppuccin-mocha';
    });
    await waitForThemeApplied(page, 'catppuccin-mocha');

    // Get background color
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });

    // Dark themes should have low RGB values
    const rgb = bgColor.match(/\d+/g)?.map(Number) || [];
    const brightness = (rgb[0] + rgb[1] + rgb[2]) / 3;
    expect(brightness).toBeLessThan(128);
  });

  test('light theme has light background', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Use the theme selector to properly switch themes (triggers CSS file load)
    const themeTrigger = page.locator('#theme-trigger');
    await themeTrigger.click();

    const themeMenu = page.locator('#theme-menu');
    await themeMenu.waitFor({ state: 'visible', timeout: 5000 });

    const lightThemeOption = page.locator('.theme-option[data-theme="catppuccin-latte"]');
    await lightThemeOption.click();

    await waitForThemeApplied(page, 'catppuccin-latte');

    // Get background color from CSS variable (more reliable than computed backgroundColor)
    const bgBase = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--turbo-bg-base').trim();
    });

    // Parse hex color to RGB
    const hexMatch = bgBase.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/);
    if (hexMatch) {
      const r = parseInt(hexMatch[1], 16);
      const g = parseInt(hexMatch[2], 16);
      const b = parseInt(hexMatch[3], 16);
      const brightness = (r + g + b) / 3;
      // Light themes should have high RGB values
      expect(brightness).toBeGreaterThan(128);
    } else {
      // If not hex, try RGB format
      const rgb = bgBase.match(/\d+/g)?.map(Number) || [];
      const brightness = (rgb[0] + rgb[1] + rgb[2]) / 3;
      expect(brightness).toBeGreaterThan(128);
    }
  });
});
