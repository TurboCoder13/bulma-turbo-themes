// SPDX-License-Identifier: MIT
/**
 * Shared test suite factory for example E2E tests.
 * Creates parameterized tests for common theme selector functionality.
 */

import { expect } from '@playwright/test';

import { type BaseExamplePage } from './BaseExamplePage';
import { test, VALID_THEMES, type ThemeId } from './fixtures';

/**
 * Configuration for the example test suite.
 */
export interface ExampleTestSuiteConfig<T extends BaseExamplePage> {
  /** Display name for the example (e.g., "HTML Vanilla Example") */
  name: string;
  /** Factory function to create the page object */
  createPage: (page: T['page']) => T;
  /** Default theme ID (default: 'catppuccin-mocha') */
  defaultTheme?: ThemeId;
  /** Themes to test switching (default: first 4 non-default themes) */
  themesToTest?: ThemeId[];
  /** Expected card count (if applicable) */
  expectedCardCount?: number;
  /** Expected title text pattern */
  expectedTitle?: string | RegExp;
  /** Custom test hooks */
  hooks?: {
    /** Called after page navigation */
    afterGoto?: (page: T) => Promise<void>;
    /** Called before theme switch tests */
    beforeThemeSwitch?: (page: T) => Promise<void>;
  };
}

/**
 * Creates a shared test suite for example pages.
 * Includes parametrized tests for theme switching, persistence, and UI components.
 */
export function createExampleTestSuite<T extends BaseExamplePage>(
  config: ExampleTestSuiteConfig<T>
): void {
  const {
    name,
    createPage,
    defaultTheme = 'catppuccin-mocha',
    themesToTest = VALID_THEMES.filter((t) => t !== defaultTheme).slice(0, 4),
    expectedCardCount,
    expectedTitle,
    hooks,
  } = config;

  test.describe(name, () => {
    let examplePage: T;

    test.beforeEach(async ({ examplePage: page }) => {
      examplePage = createPage(page);
      await examplePage.goto();
      await hooks?.afterGoto?.(examplePage);
    });

    test.describe('Theme Selector', () => {
      test('should display the theme selector', async () => {
        await examplePage.expectSelectorVisible();
      });

      test(`should have default theme set to ${defaultTheme}`, async () => {
        const currentTheme = await examplePage.getCurrentTheme();
        expect(currentTheme).toBe(defaultTheme);
      });

      test('should have all expected theme options available', async () => {
        const selector = examplePage.getThemeSelector();
        const options = await selector.locator('option').allTextContents();

        // Verify at least 5 themes are available
        expect(options.length).toBeGreaterThanOrEqual(5);

        // Verify some known themes are present
        expect(options.some((o) => o.toLowerCase().includes('catppuccin'))).toBe(true);
        expect(options.some((o) => o.toLowerCase().includes('dracula'))).toBe(true);
      });
    });

    test.describe('Theme Switching', () => {
      for (const themeId of themesToTest) {
        test(`should switch to ${themeId} theme and apply it correctly`, async () => {
          await hooks?.beforeThemeSwitch?.(examplePage);
          await examplePage.selectTheme(themeId);

          // Verify theme is applied (data-theme, localStorage, CSS link)
          await examplePage.expectThemeApplied(themeId);

          // Additional verification: CSS variable should be set
          const bgBase = await examplePage.getCssVariable('--turbo-bg-base');
          expect(bgBase).toBeTruthy();
          expect(bgBase).not.toBe('');
        });
      }

      test('should update data-theme attribute when switching themes', async () => {
        const [theme1, theme2] = themesToTest.slice(0, 2);

        await examplePage.selectTheme(theme1);
        await expect(examplePage.page.locator('html')).toHaveAttribute('data-theme', theme1);

        await examplePage.selectTheme(theme2);
        await expect(examplePage.page.locator('html')).toHaveAttribute('data-theme', theme2);
      });

      test('should update CSS link href when switching themes', async () => {
        const themeId = themesToTest[0];
        await examplePage.selectTheme(themeId);

        const themeCss = examplePage.getThemeCss();
        const href = await themeCss.getAttribute('href');
        expect(href).toContain(themeId);
      });
    });

    test.describe('LocalStorage Persistence', () => {
      test('should persist theme selection in localStorage', async () => {
        const themeId = themesToTest[0];
        await examplePage.selectTheme(themeId);

        const storedTheme = await examplePage.page.evaluate(() =>
          localStorage.getItem('turbo-theme')
        );
        expect(storedTheme).toBe(themeId);
      });

      test('should restore theme from localStorage on page reload', async () => {
        const themeId = themesToTest[1];
        await examplePage.selectTheme(themeId);
        await examplePage.expectThemePersistsAfterReload(themeId);
      });

      test('should handle multiple theme changes and persist the last one', async () => {
        const [theme1, theme2, theme3] = themesToTest.slice(0, 3);

        await examplePage.selectTheme(theme1);
        await examplePage.selectTheme(theme2);
        await examplePage.selectTheme(theme3);

        await examplePage.expectThemePersistsAfterReload(theme3);
      });
    });

    test.describe('CSS Variables', () => {
      test('should apply CSS custom properties from theme', async () => {
        await examplePage.selectTheme(defaultTheme);

        // Check that core CSS variables are defined and non-empty
        const bgBase = await examplePage.getCssVariable('--turbo-bg-base');
        const textPrimary = await examplePage.getCssVariable('--turbo-text-primary');

        expect(bgBase).toBeTruthy();
        expect(bgBase).toMatch(/^#[0-9a-fA-F]{3,8}$|^rgb/);
        expect(textPrimary).toBeTruthy();
      });

      test('should change CSS variables when switching between light and dark themes', async () => {
        // Find a light and dark theme to compare
        const lightTheme = themesToTest.find((t) => t.includes('light') || t.includes('latte'));
        const darkTheme = themesToTest.find(
          (t) => t.includes('dark') || t.includes('mocha') || t.includes('dracula')
        );

        if (lightTheme && darkTheme) {
          await examplePage.selectTheme(lightTheme);
          const lightBg = await examplePage.getCssVariable('--turbo-bg-base');

          await examplePage.selectTheme(darkTheme);
          const darkBg = await examplePage.getCssVariable('--turbo-bg-base');

          // Light and dark themes should have different background colors
          expect(lightBg).not.toBe(darkBg);
        }
      });
    });

    test.describe('UI Components', () => {
      test('should display buttons with proper visibility', async () => {
        const primaryBtn = examplePage.getPrimaryButton();
        const successBtn = examplePage.getSuccessButton();
        const dangerBtn = examplePage.getDangerButton();

        await expect(primaryBtn).toBeVisible();
        await expect(successBtn).toBeVisible();
        await expect(dangerBtn).toBeVisible();
      });

      if (expectedCardCount !== undefined) {
        test(`should display exactly ${expectedCardCount} cards`, async () => {
          const cards = examplePage.getCards();
          await expect(cards).toHaveCount(expectedCardCount);
        });
      }

      if (expectedTitle !== undefined) {
        test('should display page title', async () => {
          const title = examplePage.getTitle();
          if (typeof expectedTitle === 'string') {
            await expect(title).toContainText(expectedTitle);
          } else {
            await expect(title).toHaveText(expectedTitle);
          }
        });
      }

      test('buttons should have proper background color styling', async () => {
        await examplePage.selectTheme(defaultTheme);

        const primaryBtn = examplePage.getPrimaryButton();
        const bgColor = await primaryBtn.evaluate((el) => getComputedStyle(el).backgroundColor);

        // Should have a non-transparent background color
        expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
        expect(bgColor).not.toBe('transparent');
        expect(bgColor).toMatch(/^rgb/);
      });
    });

    test.describe('FOUC Prevention', () => {
      test('should have data-theme attribute set on initial load', async ({ examplePage: page }) => {
        // Navigate fresh without any localStorage
        await page.evaluate(() => localStorage.clear());
        await examplePage.goto();

        // Check that data-theme is set immediately
        await expect(page.locator('html')).toHaveAttribute('data-theme', defaultTheme);
      });
    });

    test.describe('Edge Cases', () => {
      test('should handle rapid theme switching without errors', async () => {
        // Rapidly switch between themes
        for (const themeId of themesToTest) {
          await examplePage.selectTheme(themeId);
        }

        // Final state should be consistent
        const lastTheme = themesToTest[themesToTest.length - 1];
        await examplePage.expectThemeApplied(lastTheme);
      });
    });
  });
}
