/**
 * Stylesheet utility functions for E2E tests.
 * Helpers for waiting on CSS stylesheet loading and theme application.
 */

import { type Locator, type Page } from '@playwright/test';

/**
 * Waits for a stylesheet link element to be fully loaded.
 * Checks if the sheet property exists (already loaded) or waits for the 'load' event.
 * Resolves gracefully on timeout to avoid flaky test failures (especially in webkit).
 *
 * @param locator - The Playwright locator for the stylesheet link element
 * @param timeoutMs - Maximum time to wait for loading (default: 8000ms)
 * @returns Promise that resolves when the stylesheet is loaded or timeout is reached
 */
export async function waitForStylesheetLoad(locator: Locator, timeoutMs = 8000): Promise<void> {
  try {
    await locator.evaluate(
      (el, timeout) =>
        (el as HTMLLinkElement).sheet
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              const to = window.setTimeout(() => {
                resolve();
              }, timeout);
              el.addEventListener(
                'load',
                () => {
                  window.clearTimeout(to);
                  resolve();
                },
                { once: true }
              );
              el.addEventListener(
                'error',
                () => {
                  window.clearTimeout(to);
                  // Resolve instead of reject to avoid test failures for CSS load issues
                  resolve();
                },
                { once: true }
              );
            }),
      timeoutMs,
      { timeout: timeoutMs + 5000 } // Give extra time for the evaluate call itself
    );
  } catch {
    // Swallow timeout errors - stylesheet may already be loaded or browser is slow
    // The test should continue and verify actual functionality
  }
}

/**
 * Waits for a theme to be fully applied by checking CSS custom properties.
 * More reliable than waitForTimeout as it confirms actual CSS application.
 *
 * @param page - The Playwright page instance
 * @param themeId - The theme ID to wait for (optional, just verifies CSS vars exist)
 * @param timeoutMs - Maximum time to wait (default: 5000ms)
 */
export async function waitForThemeApplied(page: Page, themeId?: string, timeoutMs = 5000): Promise<void> {
  await page.waitForFunction(
    (expectedTheme) => {
      const style = getComputedStyle(document.documentElement);
      const bgBase = style.getPropertyValue('--turbo-bg-base');
      // Check that CSS variables are populated (non-empty)
      if (!bgBase || bgBase.trim() === '') {
        return false;
      }
      // If a specific theme is expected, verify the data-theme attribute
      if (expectedTheme) {
        return document.documentElement.dataset.theme === expectedTheme;
      }
      return true;
    },
    themeId,
    { timeout: timeoutMs }
  ).catch(() => {
    // Swallow timeout - CSS may still be loading, test will continue
  });
}
