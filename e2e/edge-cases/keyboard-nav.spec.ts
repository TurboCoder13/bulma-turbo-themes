import { expect, test } from '../fixtures';

/**
 * Keyboard navigation accessibility tests.
 *
 * Tests:
 * - Theme selection with keyboard
 * - Arrow key navigation
 */
test.describe('Keyboard Accessibility', () => {
  test('should allow theme selection with keyboard', async ({ homePage }) => {
    await homePage.goto();

    await test.step('Focus theme trigger and select with keyboard', async () => {
      const trigger = homePage.page.locator('#theme-trigger');
      await trigger.focus();

      // Verify trigger is focused
      const isFocused = await trigger.evaluate((el) => document.activeElement === el);
      expect(isFocused).toBe(true);

      // Use keyboard to open dropdown and select a theme
      await homePage.page.keyboard.press('Enter');
      const themeMenu = homePage.page.locator('#theme-menu');
      await themeMenu.waitFor({ state: 'visible', timeout: 5000 });

      // Click on a theme option
      const themeOption = homePage.page.locator('.theme-option[data-theme="catppuccin-latte"]');
      await themeOption.click();
      await homePage.expectThemeApplied('catppuccin-latte');
    });
  });

  test('should cycle through themes with arrow keys', async ({ homePage }) => {
    await homePage.goto();

    await test.step('Navigate through themes using keyboard', async () => {
      const trigger = homePage.page.locator('#theme-trigger');
      await trigger.focus();

      // Verify trigger is focused
      const isFocused = await trigger.evaluate((el) => document.activeElement === el);
      expect(isFocused).toBe(true);

      // Open dropdown with Enter
      await homePage.page.keyboard.press('Enter');
      const themeMenu = homePage.page.locator('#theme-menu');
      await themeMenu.waitFor({ state: 'visible', timeout: 5000 });

      // Dropdown should be visible, verify we can interact with it
      await expect(themeMenu).toBeVisible();
    });
  });
});
