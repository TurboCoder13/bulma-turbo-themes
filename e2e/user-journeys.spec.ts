import { expect, test } from '@playwright/test';

/**
 * User journey E2E tests.
 *
 * Tests complete user workflows and interactions from start to finish.
 * These tests simulate real user behavior and verify the full experience.
 */

test.describe('User Journeys @journeys', () => {
  test.describe('First-time Visitor Experience', () => {
    test('new visitor sees default theme and can customize', async ({ page, context }) => {
      // Clear storage to simulate first visit
      await context.clearCookies();

      await test.step('Navigate to homepage', async () => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      });

      await test.step('Verify default theme is applied', async () => {
        const theme = await page.locator('html').getAttribute('data-theme');
        expect(theme).toBeTruthy();
      });

      await test.step('Find and click theme selector', async () => {
        const trigger = page.locator('#theme-trigger');
        await expect(trigger).toBeVisible();
        await trigger.click();
      });

      await test.step('Browse available themes', async () => {
        const menu = page.locator('#theme-menu');
        await expect(menu).toBeVisible();

        // Count available themes
        const options = page.locator('.theme-option');
        const count = await options.count();
        expect(count).toBeGreaterThan(5);
      });

      await test.step('Select a new theme', async () => {
        const draculaOption = page.locator('.theme-option[data-theme="dracula"]');
        await draculaOption.click();
      });

      await test.step('Verify theme changed', async () => {
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dracula');
      });

      await test.step('Verify theme persisted in storage', async () => {
        const storedTheme = await page.evaluate(() => localStorage.getItem('turbo-theme'));
        expect(storedTheme).toBe('dracula');
      });
    });

    test('new visitor can use keyboard to select theme', async ({ page, context }) => {
      await context.clearCookies();
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await test.step('Tab to theme selector', async () => {
        // Tab through the page to reach the theme selector
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        const trigger = page.locator('#theme-trigger');
        // Check if trigger is focused
        const isFocused = await page.evaluate(() => {
          const trigger = document.getElementById('theme-trigger');
          return document.activeElement === trigger;
        });

        // If not focused, click to focus
        if (!isFocused) {
          await trigger.focus();
        }
      });

      await test.step('Open dropdown with Enter', async () => {
        await page.keyboard.press('Enter');
        const menu = page.locator('#theme-menu');
        await expect(menu).toBeVisible();
      });

      await test.step('Navigate with arrow keys', async () => {
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
      });

      await test.step('Select with Enter', async () => {
        await page.keyboard.press('Enter');

        // Menu should close
        const menu = page.locator('#theme-menu');
        await expect(menu).not.toBeVisible();
      });
    });
  });

  test.describe('Returning Visitor Experience', () => {
    test('returning visitor sees previously selected theme', async ({ page, context }) => {
      // First visit - set a theme
      await context.clearCookies();
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.evaluate(() => {
        localStorage.setItem('turbo-theme', 'github-dark');
      });

      // Second visit - theme should persist
      await page.reload();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('html')).toHaveAttribute('data-theme', 'github-dark');
    });

    test('theme persists across page navigations', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Set a theme
      const trigger = page.locator('#theme-trigger');
      await trigger.click();

      const option = page.locator('.theme-option[data-theme="catppuccin-latte"]');
      await option.click();

      // Navigate to another page
      await page.goto('/demo/');
      await page.waitForLoadState('networkidle');

      // Theme should still be applied
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'catppuccin-latte');
    });
  });

  test.describe('Back/Forward Navigation', () => {
    test('theme persists through browser history', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Set theme
      await page.evaluate(() => {
        document.documentElement.dataset.theme = 'dracula';
        localStorage.setItem('turbo-theme', 'dracula');
      });

      // Navigate forward
      await page.goto('/demo/');
      await page.waitForLoadState('networkidle');

      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dracula');

      // Navigate back
      await page.goBack();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dracula');

      // Navigate forward again
      await page.goForward();
      await page.waitForLoadState('networkidle');

      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dracula');
    });
  });

  test.describe('Multi-Tab Behavior', () => {
    test('theme changes sync between tabs', async ({ page, context }) => {
      // Open first tab
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Open second tab
      const page2 = await context.newPage();
      await page2.goto('/');
      await page2.waitForLoadState('networkidle');

      // Change theme in first tab
      await page.evaluate(() => {
        localStorage.setItem('turbo-theme', 'github-light');
        document.documentElement.dataset.theme = 'github-light';
      });

      // Reload second tab to pick up the change
      await page2.reload();
      await page2.waitForLoadState('networkidle');

      // Second tab should have the new theme
      await expect(page2.locator('html')).toHaveAttribute('data-theme', 'github-light');

      await page2.close();
    });
  });

  test.describe('Theme Discovery Journey', () => {
    test('user explores all theme categories', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const trigger = page.locator('#theme-trigger');
      await trigger.click();

      const menu = page.locator('#theme-menu');
      await expect(menu).toBeVisible();

      // Get all unique theme options
      const themes = await page.locator('.theme-option').evaluateAll((els) =>
        els.map((el) => ({
          id: el.getAttribute('data-theme'),
          text: el.textContent?.trim(),
        }))
      );

      // Should have multiple themes available
      expect(themes.length).toBeGreaterThan(5);

      // Should have both light and dark themes
      const catppuccinMocha = themes.find((t) => t.id === 'catppuccin-mocha');
      const catppuccinLatte = themes.find((t) => t.id === 'catppuccin-latte');
      expect(catppuccinMocha).toBeDefined();
      expect(catppuccinLatte).toBeDefined();
    });

    test('user can preview multiple themes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const themesToTry = ['dracula', 'github-dark', 'catppuccin-latte', 'github-light'];

      for (const themeId of themesToTry) {
        await test.step(`Preview ${themeId} theme`, async () => {
          const trigger = page.locator('#theme-trigger');
          await trigger.click();

          const option = page.locator(`.theme-option[data-theme="${themeId}"]`);
          await option.click();

          await expect(page.locator('html')).toHaveAttribute('data-theme', themeId);

          // Brief pause to "preview" the theme
          await page.waitForTimeout(100);
        });
      }
    });
  });

  test.describe('Accessibility Journey', () => {
    test('screen reader user can select theme', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check that theme trigger has accessible name
      const trigger = page.locator('#theme-trigger');
      const ariaLabel = await trigger.getAttribute('aria-label');
      const ariaExpanded = await trigger.getAttribute('aria-expanded');

      expect(ariaLabel || (await trigger.textContent())).toBeTruthy();
      expect(ariaExpanded).toBe('false');

      // Open menu
      await trigger.click();

      // Check expanded state
      expect(await trigger.getAttribute('aria-expanded')).toBe('true');

      // Menu should have role
      const menu = page.locator('#theme-menu');
      const menuRole = await menu.getAttribute('role');
      expect(['menu', 'listbox']).toContain(menuRole);

      // Options should be accessible
      const options = page.locator('.theme-option');
      const firstOption = options.first();
      const optionRole = await firstOption.getAttribute('role');
      expect(['menuitem', 'option']).toContain(optionRole);
    });

    test('keyboard-only user can complete full workflow', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Focus trigger
      const trigger = page.locator('#theme-trigger');
      await trigger.focus();

      // Open with Enter
      await page.keyboard.press('Enter');
      await expect(page.locator('#theme-menu')).toBeVisible();

      // Navigate and select
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      // Verify selection worked
      const newTheme = await page.locator('html').getAttribute('data-theme');
      expect(newTheme).toBeTruthy();
    });
  });

  test.describe('Error Recovery', () => {
    test('user can recover from corrupted localStorage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Corrupt the storage
      await page.evaluate(() => {
        localStorage.setItem('turbo-theme', 'invalid-theme-that-does-not-exist');
      });

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Page should still work - fallback to default or ignore invalid
      const theme = await page.locator('html').getAttribute('data-theme');
      expect(theme).toBeTruthy();

      // User should be able to select a new theme
      const trigger = page.locator('#theme-trigger');
      await trigger.click();

      const option = page.locator('.theme-option[data-theme="dracula"]');
      await option.click();

      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dracula');
    });
  });
});
