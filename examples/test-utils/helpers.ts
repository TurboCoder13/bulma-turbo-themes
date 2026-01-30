import { type Locator, type Page, expect } from '@playwright/test';

import type { ThemeId } from './fixtures';

/**
 * Escapes special regex characters in a string.
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Selects a theme using a <select> element.
 *
 * @param page - The Playwright page object
 * @param themeId - The theme ID to select
 * @param selectorId - The ID of the select element (default: 'theme-selector')
 */
export async function selectTheme(
  page: Page,
  themeId: ThemeId,
  selectorId = 'theme-selector'
): Promise<void> {
  const selector = page.locator(`#${selectorId}`);
  await expect(selector).toBeVisible({ timeout: 2000 });
  await selector.selectOption(themeId);

  // Verify theme was applied
  await expect(page.locator('html')).toHaveAttribute('data-theme', themeId);
}

/**
 * Gets the currently selected theme.
 *
 * @param page - The Playwright page object
 * @param selectorId - The ID of the select element (default: 'theme-selector')
 * @returns The currently selected theme ID
 */
export async function getCurrentTheme(page: Page, selectorId = 'theme-selector'): Promise<string> {
  const selector = page.locator(`#${selectorId}`);
  return selector.inputValue();
}

/**
 * Verifies that a specific theme is applied.
 *
 * @param page - The Playwright page object
 * @param themeId - The expected theme ID
 * @param cssLinkId - The ID of the theme CSS link element (default: 'theme-css')
 */
export async function expectThemeApplied(
  page: Page,
  themeId: ThemeId,
  cssLinkId = 'theme-css'
): Promise<void> {
  // Check data-theme attribute
  await expect(page.locator('html')).toHaveAttribute('data-theme', themeId);

  // Check localStorage
  const storedTheme = await page.evaluate(() => localStorage.getItem('turbo-theme'));
  expect(storedTheme).toBe(themeId);

  // Check CSS link href
  const themeCss = page.locator(`#${cssLinkId}`);
  const escapedThemeId = escapeRegex(themeId);
  // Safe: input is escaped via escapeRegex() or is a controlled test value
  // nosemgrep: detect-non-literal-regexp
  await expect(themeCss).toHaveAttribute('href', new RegExp(`${escapedThemeId}\\.css`));
}

/**
 * Waits for a stylesheet to load by checking if it has loaded styles.
 *
 * @param locator - The locator for the link element
 * @param timeout - Timeout in milliseconds (default: 5000)
 */
export async function waitForStylesheetLoad(locator: Locator, timeout = 5000): Promise<void> {
  await expect
    .poll(
      async () => {
        const href = await locator.getAttribute('href');
        if (!href) return false;

        // Check if the stylesheet has been applied
        return await locator.evaluate((link: HTMLLinkElement) => {
          return link.sheet !== null;
        });
      },
      { timeout }
    )
    .toBe(true);
}

/**
 * Gets a CSS custom property value from an element.
 *
 * @param page - The Playwright page object
 * @param propertyName - The CSS custom property name (e.g., '--turbo-bg-base')
 * @param selector - The CSS selector for the element (default: ':root')
 * @returns The computed value of the CSS property
 */
export async function getCssVariable(
  page: Page,
  propertyName: string,
  selector = ':root'
): Promise<string> {
  return page.evaluate(
    ({ propertyName, selector }) => {
      const element = document.querySelector(selector);
      if (!element) return '';
      return getComputedStyle(element).getPropertyValue(propertyName).trim();
    },
    { propertyName, selector }
  );
}

/**
 * Verifies that a button element has the expected background color.
 *
 * @param locator - The locator for the button element
 * @param expectedColor - The expected RGB or RGBA color string pattern
 */
export async function expectButtonColor(locator: Locator, expectedColor: RegExp): Promise<void> {
  const bgColor = await locator.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bgColor).toMatch(expectedColor);
}

/**
 * Verifies theme persistence by reloading the page.
 *
 * @param page - The Playwright page object
 * @param themeId - The expected theme ID after reload
 * @param selectorId - The ID of the select element (default: 'theme-selector')
 */
export async function expectThemePersistsAfterReload(
  page: Page,
  themeId: ThemeId,
  selectorId = 'theme-selector'
): Promise<void> {
  await page.reload();
  await page.waitForLoadState('domcontentloaded');

  // Check the selector value
  const selector = page.locator(`#${selectorId}`);
  await expect(selector).toHaveValue(themeId);

  // Check data-theme attribute
  await expect(page.locator('html')).toHaveAttribute('data-theme', themeId);
}
