// SPDX-License-Identifier: MIT
import { type Locator, type Page } from '@playwright/test';

import { BaseExamplePage } from '../../../test-utils';

/**
 * Page object for the HTML Vanilla example.
 * Extends BaseExamplePage with vanilla HTML-specific element locators.
 */
export class HtmlVanillaPage extends BaseExamplePage {
  constructor(page: Page) {
    super(page, {
      examplePath: '/examples/html-vanilla/',
    });
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
    return this.page.locator('h1');
  }
}
