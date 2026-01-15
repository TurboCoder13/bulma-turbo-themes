import { test, expect, type ThemeId } from '../../test-utils';
import { BootstrapExamplePage } from './pages/BootstrapExamplePage';

test.describe('Bootstrap Example', () => {
  let bootstrapPage: BootstrapExamplePage;

  test.beforeEach(async ({ examplePage }) => {
    bootstrapPage = new BootstrapExamplePage(examplePage);
    await bootstrapPage.goto();
  });

  test.describe('Theme Selector', () => {
    test('should display the theme selector', async () => {
      await bootstrapPage.expectSelectorVisible();
    });

    test('should have default theme set to catppuccin-mocha', async () => {
      const currentTheme = await bootstrapPage.getCurrentTheme();
      expect(currentTheme).toBe('catppuccin-mocha');
    });

    test('should have all expected theme options', async () => {
      const selector = bootstrapPage.getThemeSelector();
      const options = await selector.locator('option').allTextContents();

      expect(options).toContain('Catppuccin Mocha');
      expect(options).toContain('Catppuccin Latte');
      expect(options).toContain('Dracula');
      expect(options).toContain('GitHub Dark');
      expect(options).toContain('GitHub Light');
    });

    test('should have aria-label for accessibility', async () => {
      const selector = bootstrapPage.getThemeSelector();
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
        await bootstrapPage.selectTheme(themeId);
        await bootstrapPage.expectThemeApplied(themeId);
      });
    }

    test('should update data-theme attribute when switching themes', async () => {
      await bootstrapPage.selectTheme('dracula');
      await expect(bootstrapPage.page.locator('html')).toHaveAttribute('data-theme', 'dracula');

      await bootstrapPage.selectTheme('github-light');
      await expect(bootstrapPage.page.locator('html')).toHaveAttribute(
        'data-theme',
        'github-light'
      );
    });
  });

  test.describe('Bootstrap Integration', () => {
    test('should set data-bs-theme to dark for dark themes', async () => {
      await bootstrapPage.selectTheme('catppuccin-mocha');
      await expect(bootstrapPage.page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');

      await bootstrapPage.selectTheme('dracula');
      await expect(bootstrapPage.page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
    });

    test('should set data-bs-theme to light for light themes', async () => {
      await bootstrapPage.selectTheme('catppuccin-latte');
      await expect(bootstrapPage.page.locator('html')).toHaveAttribute('data-bs-theme', 'light');

      await bootstrapPage.selectTheme('github-light');
      await expect(bootstrapPage.page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
    });

    test('should display navbar brand', async () => {
      const brand = bootstrapPage.getNavbarBrand();
      await expect(brand).toBeVisible();
      await expect(brand).toContainText('Bootstrap + Turbo Themes');
    });
  });

  test.describe('LocalStorage Persistence', () => {
    test('should persist theme selection in localStorage', async () => {
      await bootstrapPage.selectTheme('dracula');

      const storedTheme = await bootstrapPage.page.evaluate(() =>
        localStorage.getItem('turbo-theme')
      );
      expect(storedTheme).toBe('dracula');
    });

    test('should restore theme from localStorage on page reload', async () => {
      await bootstrapPage.selectTheme('github-light');
      await bootstrapPage.expectThemePersistsAfterReload('github-light');
    });
  });

  test.describe('CSS Variables', () => {
    test('should apply CSS custom properties from theme', async () => {
      await bootstrapPage.selectTheme('catppuccin-mocha');

      const bgBase = await bootstrapPage.getCssVariable('--turbo-bg-base');
      expect(bgBase).toBeTruthy();
    });

    test('should change CSS variables when switching themes', async () => {
      await bootstrapPage.selectTheme('github-light');
      const lightBg = await bootstrapPage.getCssVariable('--turbo-bg-base');

      await bootstrapPage.selectTheme('github-dark');
      const darkBg = await bootstrapPage.getCssVariable('--turbo-bg-base');

      expect(lightBg).not.toBe(darkBg);
    });
  });

  test.describe('Bootstrap Components', () => {
    test('should display all button types', async () => {
      const buttons = bootstrapPage.getButtons();
      await expect(buttons).toHaveCount(6); // primary, success, danger, warning, info, secondary
    });

    test('should display primary button', async () => {
      const primaryBtn = bootstrapPage.getPrimaryButton();
      await expect(primaryBtn).toBeVisible();
      await expect(primaryBtn).toContainText('Primary');
    });

    test('should display alerts', async () => {
      const alerts = bootstrapPage.getAlerts();
      await expect(alerts).toHaveCount(3);
    });

    test('should display cards', async () => {
      const cards = bootstrapPage.getCards();
      // 5 cards: Buttons, Alerts, 3 grid cards, Form Controls, Color Swatches
      await expect(cards.first()).toBeVisible();
    });

    test('should display form inputs', async () => {
      const inputs = bootstrapPage.getFormInputs();
      await expect(inputs).toHaveCount(2); // email and password
    });

    test('should display color swatches', async () => {
      const swatches = bootstrapPage.getSwatches();
      await expect(swatches).toHaveCount(5);
    });

    test('buttons should have proper background color', async () => {
      await bootstrapPage.selectTheme('catppuccin-mocha');

      const primaryBtn = bootstrapPage.getPrimaryButton();
      const bgColor = await primaryBtn.evaluate((el) => getComputedStyle(el).backgroundColor);

      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(bgColor).not.toBe('transparent');
    });
  });

  test.describe('Footer', () => {
    test('should show current theme in footer', async () => {
      const footer = bootstrapPage.getFooter();
      await expect(footer).toContainText('catppuccin-mocha');

      await bootstrapPage.selectTheme('dracula');
      await expect(footer).toContainText('dracula');
    });
  });

  test.describe('FOUC Prevention', () => {
    test('should have data-theme attribute set on initial load', async ({ examplePage }) => {
      await examplePage.evaluate(() => localStorage.clear());
      await examplePage.goto('/examples/bootstrap/');

      await expect(examplePage.locator('html')).toHaveAttribute('data-theme', 'catppuccin-mocha');
      await expect(examplePage.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle rapid theme switching', async () => {
      await bootstrapPage.selectTheme('dracula');
      await bootstrapPage.selectTheme('github-light');
      await bootstrapPage.selectTheme('catppuccin-latte');
      await bootstrapPage.selectTheme('github-dark');

      await bootstrapPage.expectThemeApplied('github-dark');
    });
  });
});
