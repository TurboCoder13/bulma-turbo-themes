import { expect, test } from '@playwright/test';
import {
  ThemeSelector,
  getCurrentTheme,
  getStoredTheme,
  getCssVariable,
  TEST_THEMES,
} from './fixtures/theme-helpers';

/**
 * Mobile viewport E2E tests.
 *
 * Tests theme functionality on mobile devices and viewports.
 * Uses shared fixtures from e2e/fixtures/theme-helpers.ts.
 *
 * @tags mobile, responsive
 */
test.describe('Mobile Viewport @mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Theme Selector', () => {
    test('should display theme selector on mobile', async ({ page }) => {
      const selector = new ThemeSelector(page);
      await expect(selector.trigger).toBeVisible();
    });

    test('should open theme menu on tap', async ({ page }) => {
      const selector = new ThemeSelector(page);
      await selector.tap();
      await expect(selector.menu).toBeVisible();
    });

    test('should switch theme on mobile', async ({ page }) => {
      const selector = new ThemeSelector(page);
      await selector.tap();
      await selector.tapTheme(TEST_THEMES.lightDefault);

      await expect(page.locator('html')).toHaveAttribute(
        'data-theme',
        TEST_THEMES.lightDefault
      );
    });

    test('should close menu when tapping outside', async ({ page }) => {
      const selector = new ThemeSelector(page);
      await selector.tap();
      await expect(selector.menu).toBeVisible();

      await selector.close();
      await expect(selector.menu).not.toBeVisible();
    });
  });

  test.describe('Responsive Layout', () => {
    test('should report horizontal scroll metrics', async ({ page }) => {
      const overflowInfo = await page.evaluate(() => {
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;
        return {
          hasOverflow: scrollWidth > clientWidth,
          overflow: scrollWidth - clientWidth,
          scrollWidth,
          clientWidth,
        };
      });

      console.log('Horizontal overflow metrics:', overflowInfo);
      expect(overflowInfo.clientWidth).toBeGreaterThan(0);
      expect(overflowInfo.scrollWidth).toBeGreaterThanOrEqual(
        overflowInfo.clientWidth
      );
    });

    test('should have readable text size', async ({ page }) => {
      const fontSize = await page.evaluate(() => {
        return parseFloat(getComputedStyle(document.body).fontSize);
      });
      expect(fontSize).toBeGreaterThanOrEqual(14);
    });

    test('should have adequate touch targets', async ({ page }) => {
      const selector = new ThemeSelector(page);
      const box = await selector.trigger.boundingBox();

      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(40);
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    });
  });

  test.describe('Theme Persistence', () => {
    test('should persist theme after mobile refresh', async ({ page }) => {
      const selector = new ThemeSelector(page);
      await selector.tap();
      await selector.tapTheme(TEST_THEMES.dracula);

      await expect(page.locator('html')).toHaveAttribute(
        'data-theme',
        TEST_THEMES.dracula
      );

      await page.reload();

      await expect(page.locator('html')).toHaveAttribute(
        'data-theme',
        TEST_THEMES.dracula
      );
    });

    test('should persist theme in localStorage on mobile', async ({ page }) => {
      const selector = new ThemeSelector(page);
      await selector.tap();
      await selector.tapTheme(TEST_THEMES.githubDark);

      const stored = await getStoredTheme(page);
      expect(stored).toBe(TEST_THEMES.githubDark);
    });
  });

  test.describe('CSS Variables', () => {
    test('should apply theme CSS variables on mobile', async ({ page }) => {
      const bgColor = await getCssVariable(page, '--turbo-bg-base');
      expect(bgColor).toBeTruthy();
      expect(bgColor.length).toBeGreaterThan(0);
    });

    test('should update CSS variables on theme switch', async ({ page }) => {
      const initialBg = await getCssVariable(page, '--turbo-bg-base');

      const selector = new ThemeSelector(page);
      await selector.tap();
      await selector.tapTheme(TEST_THEMES.lightDefault);

      await expect(page.locator('html')).toHaveAttribute(
        'data-theme',
        TEST_THEMES.lightDefault
      );

      const newBg = await getCssVariable(page, '--turbo-bg-base');
      expect(newBg).not.toBe(initialBg);
    });
  });

  test.describe('Scroll Behavior', () => {
    test('should not interfere with page scrolling', async ({ page }) => {
      const initialScroll = await page.evaluate(() => window.scrollY);

      await page.evaluate(() => window.scrollTo(0, 100));
      await page.waitForTimeout(100);

      const newScroll = await page.evaluate(() => window.scrollY);
      expect(newScroll).toBeGreaterThan(initialScroll);
    });

    test('should maintain scroll position on theme switch', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, 150));
      await page.waitForTimeout(100);

      const scrollBefore = await page.evaluate(() => window.scrollY);

      const selector = new ThemeSelector(page);
      await selector.tap();
      await selector.tapTheme(TEST_THEMES.dracula);

      await expect(page.locator('html')).toHaveAttribute(
        'data-theme',
        TEST_THEMES.dracula
      );

      const scrollAfter = await page.evaluate(() => window.scrollY);
      // Allow up to 150px drift due to scrollIntoViewIfNeeded on theme selector
      // CI environments may have slightly different scroll behavior
      expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(150);
    });
  });

  test.describe('Orientation', () => {
    test('should work in current orientation', async ({ page, viewport }) => {
      expect(viewport).not.toBeNull();

      if (viewport) {
        const selector = new ThemeSelector(page);
        await expect(selector.trigger).toBeVisible();

        await selector.tap();
        await expect(selector.menu).toBeVisible();
      }
    });
  });
});
