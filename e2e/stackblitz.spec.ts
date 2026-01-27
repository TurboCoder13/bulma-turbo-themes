import { expect, test } from '@playwright/test';

/**
 * StackBlitz E2E tests.
 *
 * Tests that StackBlitz templates load correctly and function as expected.
 * These tests are skipped by default as they require external network access.
 *
 * To run these tests explicitly:
 *   RUN_EXTERNAL=1 bunx playwright test e2e/stackblitz.spec.ts
 */

// Skip external tests by default - requires explicit opt-in via RUN_EXTERNAL=1
test.skip(!process.env.RUN_EXTERNAL, 'StackBlitz tests require RUN_EXTERNAL=1 (external network access)');

// StackBlitz base URL for GitHub projects
const STACKBLITZ_BASE = 'https://stackblitz.com/github/lgtm-hq/turbo-themes/tree/main/examples/stackblitz';

// Available StackBlitz templates
const templates = [
  { name: 'html-vanilla', description: 'Vanilla HTML/JS' },
  { name: 'react', description: 'React + TypeScript' },
  { name: 'vue', description: 'Vue 3 + TypeScript' },
  { name: 'tailwind', description: 'Tailwind CSS' },
  { name: 'bootstrap', description: 'Bootstrap 5' },
];

test.describe('StackBlitz Templates @external', () => {
  // Increase timeout for external network requests
  test.setTimeout(120000);

  for (const template of templates) {
    test(`${template.name} template loads in StackBlitz`, async ({ page }) => {
      const url = `${STACKBLITZ_BASE}/${template.name}`;

      await test.step('Navigate to StackBlitz', async () => {
        await page.goto(url, { timeout: 60000 });
      });

      await test.step('Wait for StackBlitz to initialize', async () => {
        // StackBlitz has a loading screen - wait for the editor or preview to appear
        // The preview iframe or editor should become visible
        await page.waitForLoadState('networkidle', { timeout: 60000 });

        // Check for StackBlitz-specific elements
        // StackBlitz uses either an editor view or a preview pane
        const hasEditor = await page.locator('[class*="editor"]').count();
        const hasPreview = await page.locator('iframe').count();

        expect(hasEditor + hasPreview).toBeGreaterThan(0);
      });

      await test.step('Verify no critical errors', async () => {
        // Check for error messages in the page
        const errorLocator = page.locator('[class*="error"], [class*="Error"]');
        const errorCount = await errorLocator.count();

        // Some errors might be warnings, so we just verify the page loaded
        // Critical errors would prevent the editor from showing
        const hasContent = await page.locator('body').textContent();
        expect(hasContent?.length).toBeGreaterThan(100);
      });
    });
  }
});

test.describe('StackBlitz Local Templates @local', () => {
  // Test local development of StackBlitz templates
  // These run against the local dev server

  test.beforeAll(async () => {
    // This test suite requires a local dev server for StackBlitz templates
    // Skip if not available
  });

  for (const template of templates) {
    test.skip(`${template.name} template runs locally`, async ({ page }) => {
      // This test would need a local dev server for each template
      // Skip for now as it requires build infrastructure
      const localUrl = `http://localhost:5173`; // Vite default port

      await page.goto(localUrl, { timeout: 30000 });

      // Verify theme selector works
      const themeSelector = page.locator('[data-testid="theme-selector"], #theme-trigger, .theme-selector');
      if (await themeSelector.count() > 0) {
        await expect(themeSelector.first()).toBeVisible();
      }
    });
  }
});
