/**
 * Network utility functions for E2E tests.
 * Request interception helpers for testing network failure scenarios.
 */

import { type Page } from '@playwright/test';

/**
 * Intercepts CSS requests and aborts theme CSS files while allowing other CSS to load.
 * This is useful for testing theme switching behavior when CSS files fail to load.
 *
 * @param page - The Playwright page object
 * @param abortReason - The reason to abort the request ('failed' or 'timedout')
 */
export async function interceptThemeCSS(
  page: Page,
  abortReason: 'failed' | 'timedout'
): Promise<void> {
  await page.route('**/*.css', (route) => {
    const url = route.request().url();
    // Only abort theme CSS files, not other CSS
    if (url.includes('themes/')) {
      route.abort(abortReason);
    } else {
      route.continue();
    }
  });
}

/**
 * Removes CSS route interception previously set up by interceptThemeCSS.
 *
 * @param page - The Playwright page object
 */
export async function removeThemeCSSInterception(page: Page): Promise<void> {
  await page.unroute('**/*.css');
}
