import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';

/**
 * Reports dropdown links tests.
 *
 * Verifies that Coverage, Playwright, and Lighthouse links open successfully
 * and render either the real report or a placeholder page.
 */
test.describe('Reports Links @reports', () => {
  test.beforeEach(async ({ basePage }) => {
    await basePage.goto('/');
  });

  async function assertPopupLoadsWithTitle(
    page: Page,
    linkTestId: string,
    titleRegex: RegExp
  ): Promise<void> {
    await test.step(`Open reports dropdown`, async () => {
      await page.getByTestId('nav-reports').hover();
      await expect(page.getByTestId(linkTestId)).toBeVisible();
    });

    await test.step(`Click ${linkTestId} link and wait for popup`, async () => {
      const [popup] = await Promise.all([
        page.waitForEvent('popup'),
        page.getByTestId(linkTestId).click(),
      ]);

      try {
        await popup.waitForLoadState('domcontentloaded');
        await expect(popup).toHaveTitle(titleRegex);
      } finally {
        await popup.close();
      }
    });
  }

  test('should open Coverage report', async ({ page }) => {
    await assertPopupLoadsWithTitle(page, 'nav-reports-coverage', /Coverage/i);
  });

  test('should open Playwright report', async ({ page }) => {
    await assertPopupLoadsWithTitle(
      page,
      'nav-reports-playwright',
      /(Playwright Test Report|Playwright E2E Test Reports)/i
    );
  });

  test('should open Lighthouse report', async ({ page }) => {
    await assertPopupLoadsWithTitle(
      page,
      'nav-reports-lighthouse',
      /(Lighthouse Report|Lighthouse Reports)/i
    );
  });
});
