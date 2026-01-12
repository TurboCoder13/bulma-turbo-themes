// SPDX-License-Identifier: MIT
import { type Locator, type Page, expect } from '@playwright/test';

import { BaseExamplePage } from '../../../test-utils';

/**
 * Page object for the React example.
 * Extends BaseExamplePage with React-specific hydration handling.
 */
export class ReactExamplePage extends BaseExamplePage {
  constructor(page: Page) {
    super(page, {
      examplePath: '/examples/react/',
      waitForHydration: true,
    });
  }

  /**
   * Wait for React to hydrate by checking for interactive elements.
   */
  protected override async waitForHydration(): Promise<void> {
    // Wait for React to mount and render the theme selector
    await expect(this.getThemeSelector()).toBeVisible({ timeout: 10000 });
  }

  getPrimaryButton(): Locator {
    return this.page.locator('.btn-primary');
  }

  getSuccessButton(): Locator {
    return this.page.locator('.btn-success');
  }

  getDangerButton(): Locator {
    return this.page.locator('.btn-danger');
  }

  getCards(): Locator {
    return this.page.locator('.card');
  }

  getTitle(): Locator {
    return this.page.locator('h1.title');
  }

  /**
   * Get color swatch elements.
   */
  getSwatches(): Locator {
    return this.page.locator('.swatch');
  }

  /**
   * Get the footer showing current theme.
   */
  getFooter(): Locator {
    return this.page.locator('.footer');
  }
}
