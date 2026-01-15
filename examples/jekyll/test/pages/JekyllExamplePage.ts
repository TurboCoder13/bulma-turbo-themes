// SPDX-License-Identifier: MIT
import { type Locator, type Page } from '@playwright/test';

import { BaseExamplePage } from '../../../test-utils';

/**
 * Page object for the Jekyll example.
 * Extends BaseExamplePage with Jekyll/Bulma-specific element locators.
 */
export class JekyllExamplePage extends BaseExamplePage {
  constructor(page: Page) {
    super(page, {
      examplePath: '/examples/jekyll/',
      themeCssSelector: '#theme-css',
    });
  }

  getPrimaryButton(): Locator {
    return this.page.locator('.button.is-primary');
  }

  getSuccessButton(): Locator {
    return this.page.locator('.button.is-success');
  }

  getDangerButton(): Locator {
    return this.page.locator('.button.is-danger');
  }

  getCards(): Locator {
    return this.page.locator('.card');
  }

  getTitle(): Locator {
    return this.page.locator('.site-title');
  }

  /**
   * Get site title element (alias for getTitle for Jekyll-specific tests).
   */
  getSiteTitle(): Locator {
    return this.getTitle();
  }

  /**
   * Get all Bulma buttons.
   */
  getButtons(): Locator {
    return this.page.locator('.buttons .button');
  }

  /**
   * Get blockquote element.
   */
  getBlockquote(): Locator {
    return this.page.locator('blockquote');
  }

  /**
   * Get code blocks.
   */
  getCodeBlocks(): Locator {
    return this.page.locator('pre.highlight');
  }

  /**
   * Get heading elements.
   */
  getHeadings(): { h1: Locator; h2: Locator; h3: Locator } {
    return {
      h1: this.page.locator('main h1'),
      h2: this.page.locator('main h2'),
      h3: this.page.locator('main h3'),
    };
  }
}
