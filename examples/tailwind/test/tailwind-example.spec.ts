import { test, expect, type ThemeId } from '../../test-utils';
import { TailwindExamplePage } from './pages/TailwindExamplePage';

test.describe('Tailwind CSS Example', () => {
  let tailwindPage: TailwindExamplePage;

  test.beforeEach(async ({ examplePage }) => {
    tailwindPage = new TailwindExamplePage(examplePage);
    await tailwindPage.goto();
  });

  test.describe('Theme Selector', () => {
    test('should display the theme selector', async () => {
      await tailwindPage.expectSelectorVisible();
    });

    test('should have default theme set to catppuccin-mocha', async () => {
      const currentTheme = await tailwindPage.getCurrentTheme();
      expect(currentTheme).toBe('catppuccin-mocha');
    });

    test('should have expected theme options', async () => {
      const selector = tailwindPage.getThemeSelector();
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
        await tailwindPage.selectTheme(themeId);
        await tailwindPage.expectThemeApplied(themeId);
      });
    }

    test('should update data-theme attribute when switching themes', async () => {
      await tailwindPage.selectTheme('dracula');
      await expect(tailwindPage.page.locator('html')).toHaveAttribute('data-theme', 'dracula');

      await tailwindPage.selectTheme('github-light');
      await expect(tailwindPage.page.locator('html')).toHaveAttribute(
        'data-theme',
        'github-light'
      );
    });
  });

  test.describe('LocalStorage Persistence', () => {
    test('should persist theme selection in localStorage', async () => {
      await tailwindPage.selectTheme('dracula');

      const storedTheme = await tailwindPage.page.evaluate(() =>
        localStorage.getItem('turbo-theme')
      );
      expect(storedTheme).toBe('dracula');
    });

    test('should restore theme from localStorage on page reload', async () => {
      await tailwindPage.selectTheme('github-light');
      await tailwindPage.expectThemePersistsAfterReload('github-light');
    });
  });

  test.describe('Tailwind Integration', () => {
    test('should apply Tailwind utility classes', async () => {
      await tailwindPage.expectTailwindClassesApplied();
    });

    test('should display page title with Tailwind styling', async () => {
      const title = tailwindPage.getTitle();
      await expect(title).toContainText('Tailwind + Turbo Themes');
      await expect(title).toHaveClass(/text-3xl/);
      await expect(title).toHaveClass(/font-semibold/);
    });

    test('buttons should have Tailwind classes applied', async () => {
      const primaryBtn = tailwindPage.getPrimaryButton();
      await expect(primaryBtn).toBeVisible();
      await expect(primaryBtn).toHaveClass(/bg-primary/);
      await expect(primaryBtn).toHaveClass(/px-4/);
      await expect(primaryBtn).toHaveClass(/py-2/);
      await expect(primaryBtn).toHaveClass(/rounded/);
    });
  });

  test.describe('CSS Variables', () => {
    test('should apply CSS custom properties from theme', async () => {
      await tailwindPage.selectTheme('catppuccin-mocha');

      const bgBase = await tailwindPage.getCssVariable('--turbo-bg-base');
      expect(bgBase).toBeTruthy();
    });

    test('should change CSS variables when switching themes', async () => {
      await tailwindPage.selectTheme('github-light');
      const lightBg = await tailwindPage.getCssVariable('--turbo-bg-base');

      await tailwindPage.selectTheme('github-dark');
      const darkBg = await tailwindPage.getCssVariable('--turbo-bg-base');

      expect(lightBg).not.toBe(darkBg);
    });
  });

  test.describe('UI Components', () => {
    test('should display buttons section', async () => {
      const buttonsSection = tailwindPage.getButtonsSection();
      await expect(buttonsSection).toBeVisible();
    });

    test('should display all button types', async () => {
      const primaryBtn = tailwindPage.getPrimaryButton();
      const successBtn = tailwindPage.getSuccessButton();
      const dangerBtn = tailwindPage.getDangerButton();

      await expect(primaryBtn).toBeVisible();
      await expect(successBtn).toBeVisible();
      await expect(dangerBtn).toBeVisible();
    });

    test('should display card grid', async () => {
      const cards = tailwindPage.getCards();
      await expect(cards).toHaveCount(3);
    });

    test('should display alerts', async () => {
      const alerts = tailwindPage.getAlerts();
      await expect(alerts).toHaveCount(3);
    });

    test('buttons should have proper background color', async () => {
      await tailwindPage.selectTheme('catppuccin-mocha');

      const primaryBtn = tailwindPage.getPrimaryButton();
      const bgColor = await primaryBtn.evaluate((el) => getComputedStyle(el).backgroundColor);

      // Should have some background color (not transparent)
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(bgColor).not.toBe('transparent');
    });
  });

  test.describe('Responsive Design', () => {
    test('should have responsive grid classes on cards', async () => {
      const grid = tailwindPage.page.locator('.grid.gap-4');
      await expect(grid).toBeVisible();
      await expect(grid).toHaveClass(/md:grid-cols-3/);
    });

    test('should have responsive header layout', async () => {
      const header = tailwindPage.page.locator('header');
      await expect(header).toHaveClass(/flex/);
      await expect(header).toHaveClass(/md:flex-row/);
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle rapid theme switching', async () => {
      await tailwindPage.selectTheme('dracula');
      await tailwindPage.selectTheme('github-light');
      await tailwindPage.selectTheme('catppuccin-latte');
      await tailwindPage.selectTheme('github-dark');

      await tailwindPage.expectThemeApplied('github-dark');
    });
  });
});
