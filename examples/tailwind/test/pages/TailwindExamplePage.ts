// SPDX-License-Identifier: MIT
import { type Locator, type Page, expect } from '@playwright/test';

import { BaseExamplePage } from '../../../test-utils';

/**
 * Page object for the Tailwind CSS example.
 * Extends BaseExamplePage with Tailwind-specific element locators.
 */
export class TailwindExamplePage extends BaseExamplePage {
  constructor(page: Page) {
    super(page, {
      examplePath: '/examples/tailwind/',
    });
  }

  getPrimaryButton(): Locator {
    return this.page.locator('button.bg-primary');
  }

  getSuccessButton(): Locator {
    return this.page.locator('button.bg-success');
  }

  getDangerButton(): Locator {
    return this.page.locator('button.bg-danger');
  }

  getCards(): Locator {
    return this.page.locator('.bg-surface-alt');
  }

  getTitle(): Locator {
    return this.page.locator('h1');
  }

  /**
   * Get buttons section.
   */
  getButtonsSection(): Locator {
    return this.page.locator('section').filter({ hasText: 'Buttons' }).first();
  }

  /**
   * Get alert elements (border-l-4 style).
   */
  getAlerts(): Locator {
    return this.page.locator('.border-l-4');
  }

  /**
   * Check that Tailwind utility classes are being applied.
   */
  async expectTailwindClassesApplied(): Promise<void> {
    // Check for Tailwind utility classes on body
    const body = this.page.locator('body');
    const classes = await body.getAttribute('class');
    expect(classes).toContain('bg-background');
    expect(classes).toContain('text-foreground');
  }
}
