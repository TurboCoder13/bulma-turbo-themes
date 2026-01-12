import { test, expect, type ThemeId } from '../../test-utils';
import { VueExamplePage } from './pages/VueExamplePage';

test.describe('Vue Example', () => {
  let vuePage: VueExamplePage;

  test.beforeEach(async ({ examplePage }) => {
    vuePage = new VueExamplePage(examplePage);
    await vuePage.goto();
  });

  test.describe('Theme Selector', () => {
    test('should display the theme selector', async () => {
      await vuePage.expectSelectorVisible();
    });

    test('should have default theme set to catppuccin-mocha', async () => {
      const currentTheme = await vuePage.getCurrentTheme();
      expect(currentTheme).toBe('catppuccin-mocha');
    });

    test('should have all expected theme options', async () => {
      const selector = vuePage.getThemeSelector();
      const options = await selector.locator('option').allTextContents();

      expect(options).toContain('Catppuccin Mocha');
      expect(options).toContain('Catppuccin Latte');
      expect(options).toContain('Dracula');
      expect(options).toContain('GitHub Dark');
      expect(options).toContain('GitHub Light');
    });

    test('should have aria-label for accessibility', async () => {
      const selector = vuePage.getThemeSelector();
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
        await vuePage.selectTheme(themeId);
        await vuePage.expectThemeApplied(themeId);
      });
    }

    test('should update data-theme attribute when switching themes', async () => {
      await vuePage.selectTheme('dracula');
      await expect(vuePage.page.locator('html')).toHaveAttribute('data-theme', 'dracula');

      await vuePage.selectTheme('github-light');
      await expect(vuePage.page.locator('html')).toHaveAttribute('data-theme', 'github-light');
    });
  });

  test.describe('LocalStorage Persistence', () => {
    test('should persist theme selection in localStorage', async () => {
      await vuePage.selectTheme('dracula');

      const storedTheme = await vuePage.page.evaluate(() =>
        localStorage.getItem('turbo-theme')
      );
      expect(storedTheme).toBe('dracula');
    });

    test('should restore theme from localStorage on page reload', async () => {
      await vuePage.selectTheme('github-light');
      await vuePage.expectThemePersistsAfterReload('github-light');
    });
  });

  test.describe('Vue Integration', () => {
    test('should display page title', async () => {
      const title = vuePage.getTitle();
      await expect(title).toContainText('Vue + Turbo Themes');
    });

    test('should show current theme in footer', async () => {
      const footer = vuePage.getFooter();
      await expect(footer).toContainText('catppuccin-mocha');

      await vuePage.selectTheme('dracula');
      await expect(footer).toContainText('dracula');
    });

    test('should display color swatches', async () => {
      const swatches = vuePage.getSwatches();
      await expect(swatches).toHaveCount(5); // primary, success, warning, danger, info
    });
  });

  test.describe('CSS Variables', () => {
    test('should apply CSS custom properties from theme', async () => {
      await vuePage.selectTheme('catppuccin-mocha');

      const bgBase = await vuePage.getCssVariable('--turbo-bg-base');
      expect(bgBase).toBeTruthy();
    });

    test('should change CSS variables when switching themes', async () => {
      await vuePage.selectTheme('github-light');
      const lightBg = await vuePage.getCssVariable('--turbo-bg-base');

      await vuePage.selectTheme('github-dark');
      const darkBg = await vuePage.getCssVariable('--turbo-bg-base');

      expect(lightBg).not.toBe(darkBg);
    });
  });

  test.describe('UI Components', () => {
    test('should display all button types', async () => {
      const primaryBtn = vuePage.getPrimaryButton();
      const successBtn = vuePage.getSuccessButton();
      const dangerBtn = vuePage.getDangerButton();

      await expect(primaryBtn).toBeVisible();
      await expect(successBtn).toBeVisible();
      await expect(dangerBtn).toBeVisible();
    });

    test('should display cards', async () => {
      const cards = vuePage.getCards();
      await expect(cards).toHaveCount(4); // Buttons, Content, Metrics, Color Swatches
    });

    test('buttons should have proper background color', async () => {
      await vuePage.selectTheme('catppuccin-mocha');

      const primaryBtn = vuePage.getPrimaryButton();
      const bgColor = await primaryBtn.evaluate((el) => getComputedStyle(el).backgroundColor);

      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(bgColor).not.toBe('transparent');
    });
  });

  test.describe('FOUC Prevention', () => {
    test('should have data-theme attribute set on initial load', async ({ examplePage }) => {
      await examplePage.evaluate(() => localStorage.clear());
      await examplePage.goto('/examples/vue/');

      await expect(examplePage.locator('html')).toHaveAttribute('data-theme', 'catppuccin-mocha');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle rapid theme switching', async () => {
      await vuePage.selectTheme('dracula');
      await vuePage.selectTheme('github-light');
      await vuePage.selectTheme('catppuccin-latte');
      await vuePage.selectTheme('github-dark');

      await vuePage.expectThemeApplied('github-dark');
    });
  });
});
