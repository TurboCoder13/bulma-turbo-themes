/**
 * Navigation utility functions for E2E tests.
 * Theme selector helpers.
 */

import { type Page, expect } from '@playwright/test';

/**
 * Selects a theme using the theme selector.
 *
 * @param page - The Playwright page object
 * @param themeId - The theme ID to select
 */
export async function selectTheme(page: Page, themeId: string): Promise<void> {
  const selector = page.locator('#theme-selector');
  await expect(selector).toBeVisible({ timeout: 2000 });
  await selector.selectOption(themeId);

  // Verify theme was applied
  await expect(page.locator('html')).toHaveAttribute('data-theme', themeId);
}

/**
 * Gets the currently selected theme.
 *
 * @param page - The Playwright page object
 * @returns The currently selected theme ID
 */
export async function getCurrentTheme(page: Page): Promise<string> {
  const selector = page.locator('#theme-selector');
  return selector.inputValue();
}

/**
 * Verifies that a specific theme is applied.
 *
 * @param page - The Playwright page object
 * @param themeId - The expected theme ID
 */
export async function expectThemeApplied(page: Page, themeId: string): Promise<void> {
  // Check data-theme attribute
  await expect(page.locator('html')).toHaveAttribute('data-theme', themeId);

  // Check localStorage
  const storedTheme = await page.evaluate(() => localStorage.getItem('turbo-theme'));
  expect(storedTheme).toBe(themeId);

  // Check CSS link href
  const themeCss = page.locator('#turbo-theme-css');
  await expect(themeCss).toHaveAttribute('href', new RegExp(`${themeId}\\.css`));
}
