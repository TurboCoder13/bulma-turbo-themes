import { test, expect, type ThemeId } from '../../test-utils';
import { JekyllExamplePage } from './pages/JekyllExamplePage';

test.describe('Jekyll Example', () => {
  let jekyllPage: JekyllExamplePage;

  test.beforeEach(async ({ examplePage }) => {
    jekyllPage = new JekyllExamplePage(examplePage);
    await jekyllPage.goto();
  });

  test.describe('Theme Selector', () => {
    test('should display the theme selector', async () => {
      await jekyllPage.expectSelectorVisible();
    });

    test('should have default theme set to catppuccin-mocha', async () => {
      const currentTheme = await jekyllPage.getCurrentTheme();
      expect(currentTheme).toBe('catppuccin-mocha');
    });

    test('should have all expected theme options', async () => {
      const selector = jekyllPage.getThemeSelector();
      const options = await selector.locator('option').allTextContents();

      expect(options).toContain('Catppuccin Mocha');
      expect(options).toContain('Catppuccin Latte');
      expect(options).toContain('Dracula');
      expect(options).toContain('GitHub Dark');
      expect(options).toContain('GitHub Light');
      expect(options).toContain('Bulma Dark');
      expect(options).toContain('Bulma Light');
    });

    test('should have aria-label for accessibility', async () => {
      const selector = jekyllPage.getThemeSelector();
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
        await jekyllPage.selectTheme(themeId);
        await jekyllPage.expectThemeApplied(themeId);
      });
    }

    test('should update data-theme attribute when switching themes', async () => {
      await jekyllPage.selectTheme('dracula');
      await expect(jekyllPage.page.locator('html')).toHaveAttribute('data-theme', 'dracula');

      await jekyllPage.selectTheme('github-light');
      await expect(jekyllPage.page.locator('html')).toHaveAttribute(
        'data-theme',
        'github-light'
      );
    });
  });

  test.describe('LocalStorage Persistence', () => {
    test('should persist theme selection in localStorage', async () => {
      await jekyllPage.selectTheme('dracula');

      const storedTheme = await jekyllPage.page.evaluate(() =>
        localStorage.getItem('turbo-theme')
      );
      expect(storedTheme).toBe('dracula');
    });

    test('should restore theme from localStorage on page reload', async () => {
      await jekyllPage.selectTheme('github-light');
      await jekyllPage.expectThemePersistsAfterReload('github-light');
    });
  });

  test.describe('CSS Variables', () => {
    test('should apply CSS custom properties from theme', async () => {
      await jekyllPage.selectTheme('catppuccin-mocha');

      const bgBase = await jekyllPage.getCssVariable('--turbo-bg-base');
      expect(bgBase).toBeTruthy();
    });

    test('should change CSS variables when switching themes', async () => {
      await jekyllPage.selectTheme('github-light');
      const lightBg = await jekyllPage.getCssVariable('--turbo-bg-base');

      await jekyllPage.selectTheme('github-dark');
      const darkBg = await jekyllPage.getCssVariable('--turbo-bg-base');

      expect(lightBg).not.toBe(darkBg);
    });
  });

  test.describe('Bulma Components', () => {
    test('should display all button types', async () => {
      const buttons = jekyllPage.getButtons();
      await expect(buttons).toHaveCount(6); // primary, link, info, success, warning, danger
    });

    test('should display primary button', async () => {
      const primaryBtn = jekyllPage.getPrimaryButton();
      await expect(primaryBtn).toBeVisible();
      await expect(primaryBtn).toContainText('Primary');
    });

    test('should display success button', async () => {
      const successBtn = jekyllPage.getSuccessButton();
      await expect(successBtn).toBeVisible();
      await expect(successBtn).toContainText('Success');
    });

    test('should display danger button', async () => {
      const dangerBtn = jekyllPage.getDangerButton();
      await expect(dangerBtn).toBeVisible();
      await expect(dangerBtn).toContainText('Danger');
    });

    test('should display card elements', async () => {
      const cards = jekyllPage.getCards();
      await expect(cards).toHaveCount(3);
    });

    test('cards should have proper Bulma structure', async () => {
      const firstCard = jekyllPage.getCards().first();
      await expect(firstCard.locator('.card-header')).toBeVisible();
      await expect(firstCard.locator('.card-content')).toBeVisible();
      await expect(firstCard.locator('.card-footer')).toBeVisible();
    });
  });

  test.describe('Typography', () => {
    test('should display headings', async () => {
      const headings = jekyllPage.getHeadings();
      await expect(headings.h1).toBeVisible();
      await expect(headings.h2.first()).toBeVisible();
      await expect(headings.h3.first()).toBeVisible();
    });

    test('should display blockquote', async () => {
      const blockquote = jekyllPage.getBlockquote();
      await expect(blockquote).toBeVisible();
      await expect(blockquote).toContainText('Blockquotes render');
    });

    test('should display code blocks', async () => {
      const codeBlock = jekyllPage.getCodeBlocks();
      await expect(codeBlock).toBeVisible();
    });

    test('should display inline code', async () => {
      const inlineCode = jekyllPage.page.locator('code.language-plaintext');
      await expect(inlineCode).toBeVisible();
      await expect(inlineCode).toContainText('const x = 1');
    });
  });

  test.describe('Site Header', () => {
    test('should display site title', async () => {
      const title = jekyllPage.getSiteTitle();
      await expect(title).toBeVisible();
      await expect(title).toContainText('Turbo Themes Jekyll Demo');
    });

    test('site title should link to home', async () => {
      const titleLink = jekyllPage.getSiteTitle().locator('a');
      await expect(titleLink).toHaveAttribute('href', '/examples/jekyll/');
    });
  });

  test.describe('FOUC Prevention', () => {
    test('should have data-theme attribute set on initial load', async ({ examplePage }) => {
      await examplePage.evaluate(() => localStorage.clear());
      await examplePage.goto('/examples/jekyll/');

      await expect(examplePage.locator('html')).toHaveAttribute('data-theme', 'catppuccin-mocha');
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle rapid theme switching', async () => {
      await jekyllPage.selectTheme('dracula');
      await jekyllPage.selectTheme('github-light');
      await jekyllPage.selectTheme('catppuccin-latte');
      await jekyllPage.selectTheme('github-dark');

      await jekyllPage.expectThemeApplied('github-dark');
    });
  });
});
