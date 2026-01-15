import { test, expect, VALID_THEMES, type ThemeId } from '../../test-utils';
import { HtmlVanillaPage } from './pages/HtmlVanillaPage';

test.describe('HTML Vanilla Example', () => {
  let htmlPage: HtmlVanillaPage;

  test.beforeEach(async ({ examplePage }) => {
    htmlPage = new HtmlVanillaPage(examplePage);
    await htmlPage.goto();
  });

  test.describe('Theme Selector', () => {
    test('should display the theme selector', async () => {
      await htmlPage.expectSelectorVisible();
    });

    test('should have default theme set to catppuccin-mocha', async () => {
      const currentTheme = await htmlPage.getCurrentTheme();
      expect(currentTheme).toBe('catppuccin-mocha');
    });

    test('should have all expected theme options', async () => {
      const selector = htmlPage.getThemeSelector();
      const options = await selector.locator('option').allTextContents();

      expect(options).toContain('Catppuccin Mocha');
      expect(options).toContain('Catppuccin Latte');
      expect(options).toContain('Dracula');
      expect(options).toContain('GitHub Dark');
      expect(options).toContain('GitHub Light');
    });
  });

  test.describe('Theme Switching', () => {
    const themesToTest: ThemeId[] = [
      'catppuccin-latte',
      'dracula',
      'github-dark',
      'github-light',
    ];

    for (const themeId of themesToTest) {
      test(`should switch to ${themeId} theme`, async () => {
        await htmlPage.selectTheme(themeId);
        await htmlPage.expectThemeApplied(themeId);
      });
    }

    test('should update data-theme attribute when switching themes', async () => {
      await htmlPage.selectTheme('dracula');
      await expect(htmlPage.page.locator('html')).toHaveAttribute('data-theme', 'dracula');

      await htmlPage.selectTheme('github-light');
      await expect(htmlPage.page.locator('html')).toHaveAttribute('data-theme', 'github-light');
    });

    test('should update CSS link href when switching themes', async () => {
      await htmlPage.selectTheme('github-dark');
      await expect(htmlPage.getThemeCss()).toHaveAttribute('href', /github-dark\.css/);
    });
  });

  test.describe('LocalStorage Persistence', () => {
    test('should persist theme selection in localStorage', async () => {
      await htmlPage.selectTheme('dracula');

      const storedTheme = await htmlPage.page.evaluate(() =>
        localStorage.getItem('turbo-theme')
      );
      expect(storedTheme).toBe('dracula');
    });

    test('should restore theme from localStorage on page reload', async () => {
      await htmlPage.selectTheme('github-light');
      await htmlPage.expectThemePersistsAfterReload('github-light');
    });

    test('should handle multiple theme changes and persist the last one', async () => {
      await htmlPage.selectTheme('dracula');
      await htmlPage.selectTheme('github-dark');
      await htmlPage.selectTheme('catppuccin-latte');

      await htmlPage.expectThemePersistsAfterReload('catppuccin-latte');
    });
  });

  test.describe('CSS Variables', () => {
    test('should apply CSS custom properties from theme', async () => {
      await htmlPage.selectTheme('catppuccin-mocha');

      // Check that CSS variables are defined
      const bgBase = await htmlPage.getCssVariable('--turbo-bg-base');
      expect(bgBase).toBeTruthy();
    });

    test('should change CSS variables when switching themes', async ({ examplePage }) => {
      await htmlPage.selectTheme('github-light');
      const lightBg = await htmlPage.getCssVariable('--turbo-bg-base');

      await htmlPage.selectTheme('github-dark');
      const darkBg = await htmlPage.getCssVariable('--turbo-bg-base');

      // Light and dark themes should have different background colors
      expect(lightBg).not.toBe(darkBg);
    });
  });

  test.describe('UI Components', () => {
    test('should display buttons with theme colors', async () => {
      const primaryBtn = htmlPage.getPrimaryButton();
      const successBtn = htmlPage.getSuccessButton();
      const dangerBtn = htmlPage.getDangerButton();

      await expect(primaryBtn).toBeVisible();
      await expect(successBtn).toBeVisible();
      await expect(dangerBtn).toBeVisible();
    });

    test('should display cards', async () => {
      const cards = htmlPage.getCards();
      await expect(cards).toHaveCount(3);
    });

    test('should display page title', async () => {
      const title = htmlPage.getTitle();
      await expect(title).toContainText('Turbo Themes');
    });

    test('buttons should have proper styling with theme', async () => {
      await htmlPage.selectTheme('catppuccin-mocha');

      const primaryBtn = htmlPage.getPrimaryButton();
      const bgColor = await primaryBtn.evaluate((el) => getComputedStyle(el).backgroundColor);

      // Should have some background color (not transparent)
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(bgColor).not.toBe('transparent');
    });
  });

  test.describe('FOUC Prevention', () => {
    test('should have data-theme attribute set on initial load', async ({ examplePage }) => {
      // Navigate fresh without any localStorage
      await examplePage.evaluate(() => localStorage.clear());
      await examplePage.goto('/examples/html-vanilla/');

      // Check that data-theme is set immediately (before any user interaction)
      await expect(examplePage.locator('html')).toHaveAttribute('data-theme', 'catppuccin-mocha');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle rapid theme switching', async () => {
      // Rapidly switch between themes
      await htmlPage.selectTheme('dracula');
      await htmlPage.selectTheme('github-light');
      await htmlPage.selectTheme('catppuccin-latte');
      await htmlPage.selectTheme('github-dark');

      // Final state should be consistent
      await htmlPage.expectThemeApplied('github-dark');
    });

    test('should maintain theme after navigation away and back', async ({ examplePage }) => {
      await htmlPage.selectTheme('dracula');

      // Navigate to a different page (root)
      await examplePage.goto('/');
      await examplePage.waitForLoadState('domcontentloaded');

      // Navigate back to the example
      await htmlPage.goto();

      // Theme should still be persisted
      await expect(htmlPage.getThemeSelector()).toHaveValue('dracula');
    });
  });
});
