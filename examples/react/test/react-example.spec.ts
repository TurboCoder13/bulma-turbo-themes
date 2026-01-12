import { test, expect, type ThemeId } from '../../test-utils';
import { ReactExamplePage } from './pages/ReactExamplePage';

test.describe('React Example', () => {
  let reactPage: ReactExamplePage;

  test.beforeEach(async ({ examplePage }) => {
    reactPage = new ReactExamplePage(examplePage);
    await reactPage.goto();
  });

  test.describe('Theme Selector', () => {
    test('should display the theme selector', async () => {
      await reactPage.expectSelectorVisible();
    });

    test('should have default theme set to catppuccin-mocha', async () => {
      const currentTheme = await reactPage.getCurrentTheme();
      expect(currentTheme).toBe('catppuccin-mocha');
    });

    test('should have all expected theme options', async () => {
      const selector = reactPage.getThemeSelector();
      const options = await selector.locator('option').allTextContents();

      expect(options).toContain('Catppuccin Mocha');
      expect(options).toContain('Catppuccin Latte');
      expect(options).toContain('Dracula');
      expect(options).toContain('GitHub Dark');
      expect(options).toContain('GitHub Light');
    });

    test('should have aria-label for accessibility', async () => {
      const selector = reactPage.getThemeSelector();
      await expect(selector).toHaveAttribute('aria-label', 'Select theme');
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
        await reactPage.selectTheme(themeId);
        await reactPage.expectThemeApplied(themeId);
      });
    }

    test('should update data-theme attribute when switching themes', async () => {
      await reactPage.selectTheme('dracula');
      await expect(reactPage.page.locator('html')).toHaveAttribute('data-theme', 'dracula');

      await reactPage.selectTheme('github-light');
      await expect(reactPage.page.locator('html')).toHaveAttribute('data-theme', 'github-light');
    });
  });

  test.describe('LocalStorage Persistence', () => {
    test('should persist theme selection in localStorage', async () => {
      await reactPage.selectTheme('dracula');

      const storedTheme = await reactPage.page.evaluate(() =>
        localStorage.getItem('turbo-theme')
      );
      expect(storedTheme).toBe('dracula');
    });

    test('should restore theme from localStorage on page reload', async () => {
      await reactPage.selectTheme('github-light');
      await reactPage.expectThemePersistsAfterReload('github-light');
    });
  });

  test.describe('React Integration', () => {
    test('should display page title', async () => {
      const title = reactPage.getTitle();
      await expect(title).toContainText('React + Turbo Themes');
    });

    test('should show current theme in footer', async () => {
      const footer = reactPage.getFooter();
      await expect(footer).toContainText('catppuccin-mocha');

      await reactPage.selectTheme('dracula');
      await expect(footer).toContainText('dracula');
    });

    test('should display color swatches', async () => {
      const swatches = reactPage.getSwatches();
      await expect(swatches).toHaveCount(5); // primary, success, warning, danger, info
    });
  });

  test.describe('CSS Variables', () => {
    test('should apply CSS custom properties from theme', async () => {
      await reactPage.selectTheme('catppuccin-mocha');

      const bgBase = await reactPage.getCssVariable('--turbo-bg-base');
      expect(bgBase).toBeTruthy();
    });

    test('should change CSS variables when switching themes', async () => {
      await reactPage.selectTheme('github-light');
      const lightBg = await reactPage.getCssVariable('--turbo-bg-base');

      await reactPage.selectTheme('github-dark');
      const darkBg = await reactPage.getCssVariable('--turbo-bg-base');

      expect(lightBg).not.toBe(darkBg);
    });
  });

  test.describe('UI Components', () => {
    test('should display all button types', async () => {
      const primaryBtn = reactPage.getPrimaryButton();
      const successBtn = reactPage.getSuccessButton();
      const dangerBtn = reactPage.getDangerButton();

      await expect(primaryBtn).toBeVisible();
      await expect(successBtn).toBeVisible();
      await expect(dangerBtn).toBeVisible();
    });

    test('should display cards', async () => {
      const cards = reactPage.getCards();
      await expect(cards).toHaveCount(4); // Buttons, Content, Metrics, Color Swatches
    });

    test('buttons should have proper background color', async () => {
      await reactPage.selectTheme('catppuccin-mocha');

      const primaryBtn = reactPage.getPrimaryButton();
      const bgColor = await primaryBtn.evaluate((el) => getComputedStyle(el).backgroundColor);

      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(bgColor).not.toBe('transparent');
    });
  });

  test.describe('FOUC Prevention', () => {
    test('should have data-theme attribute set on initial load', async ({ examplePage }) => {
      await examplePage.evaluate(() => localStorage.clear());
      await examplePage.goto('/examples/react/');

      await expect(examplePage.locator('html')).toHaveAttribute('data-theme', 'catppuccin-mocha');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle rapid theme switching', async () => {
      await reactPage.selectTheme('dracula');
      await reactPage.selectTheme('github-light');
      await reactPage.selectTheme('catppuccin-latte');
      await reactPage.selectTheme('github-dark');

      await reactPage.expectThemeApplied('github-dark');
    });
  });
});
