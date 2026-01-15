// SPDX-License-Identifier: MIT
/**
 * Base page object for all example E2E tests.
 * Provides common theme selector functionality to reduce duplication.
 */

import { type Locator, type Page, expect } from '@playwright/test';

import { escapeRegex, type ThemeId } from './index';

/**
 * Configuration options for BaseExamplePage.
 */
export interface BaseExamplePageOptions {
  /** The URL path for the example (e.g., '/examples/html-vanilla/') */
  examplePath: string;
  /** The CSS selector for the theme CSS link element (default: '#theme-css') */
  themeCssSelector?: string;
  /** The CSS selector for the theme selector dropdown (default: '#theme-selector') */
  themeSelectorId?: string;
  /** Whether to wait for framework hydration after navigation (default: false) */
  waitForHydration?: boolean;
}

/**
 * Abstract base class for example page objects.
 * Provides shared theme selector functionality for all example tests.
 *
 * Subclasses must implement framework-specific element accessors.
 */
export abstract class BaseExamplePage {
  readonly page: Page;
  protected readonly options: Required<BaseExamplePageOptions>;

  constructor(page: Page, options: BaseExamplePageOptions) {
    this.page = page;
    this.options = {
      themeCssSelector: '#theme-css',
      themeSelectorId: '#theme-selector',
      waitForHydration: false,
      ...options,
    };
  }

  /**
   * Navigate to the example page.
   */
  async goto(): Promise<void> {
    await this.page.goto(this.options.examplePath);
    await this.page.waitForLoadState('domcontentloaded');

    if (this.options.waitForHydration) {
      await this.waitForHydration();
    }
  }

  /**
   * Wait for framework hydration to complete.
   * Override in subclasses that need custom hydration logic.
   */
  protected async waitForHydration(): Promise<void> {
    // Default implementation: wait for theme selector to be visible
    await expect(this.getThemeSelector()).toBeVisible({ timeout: 5000 });
  }

  /**
   * Get the theme selector dropdown element.
   */
  getThemeSelector(): Locator {
    return this.page.locator(this.options.themeSelectorId);
  }

  /**
   * Get the theme CSS link element.
   */
  getThemeCss(): Locator {
    return this.page.locator(this.options.themeCssSelector);
  }

  /**
   * Select a theme from the dropdown.
   */
  async selectTheme(themeId: ThemeId): Promise<void> {
    const selector = this.getThemeSelector();
    await expect(selector).toBeVisible({ timeout: 2000 });

    // Check if we're already on this theme
    const currentTheme = await this.page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    const isThemeChange = currentTheme !== themeId;

    // Capture current CSS variable value before switching (for later comparison)
    const previousBgBase = isThemeChange
      ? await this.page.evaluate(() => {
          return getComputedStyle(document.documentElement)
            .getPropertyValue('--turbo-bg-base')
            .trim();
        })
      : undefined;

    // Get the actual selector ID from options, strip the '#' prefix if present
    const selectorId = this.options.themeSelectorId.replace(/^#/, '');

    // Use evaluate to set the value and dispatch change event
    // This ensures the native change event listener is triggered
    await this.page.evaluate(
      ({ theme, id }) => {
        const select = document.getElementById(id) as HTMLSelectElement;
        if (select) {
          select.value = theme;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      },
      { theme: themeId, id: selectorId }
    );

    // Wait for theme to be applied
    await this.expectThemeApplied(themeId, previousBgBase);
  }

  /**
   * Get the current theme value from the selector.
   */
  async getCurrentTheme(): Promise<string> {
    return this.getThemeSelector().inputValue();
  }

  /**
   * Verify that a theme is applied correctly.
   * Checks data-theme attribute, localStorage, and CSS link href.
   * @param themeId - The theme ID to verify
   * @param previousBgBase - Optional previous CSS variable value to detect change
   */
  async expectThemeApplied(themeId: ThemeId, previousBgBase?: string): Promise<void> {
    const escapedThemeId = escapeRegex(themeId);

    // Check data-theme attribute
    await expect(this.page.locator('html')).toHaveAttribute('data-theme', themeId);

    // Check localStorage with polling (handles async updates)
    await expect
      .poll(
        async () => {
          return await this.page.evaluate(() => localStorage.getItem('turbo-theme'));
        },
        { timeout: 5000 }
      )
      .toBe(themeId);

    // Check CSS link href
    await expect(this.getThemeCss()).toHaveAttribute(
      'href',
      new RegExp(`${escapedThemeId}\\.css`)
    );

    // Wait for CSS to actually load by checking the CSS variable changes
    // If we have a previous value, wait for it to change; otherwise just wait for it to exist
    if (previousBgBase) {
      // Wait for CSS variable to change from previous value
      await expect
        .poll(
          async () => {
            const current = await this.page.evaluate(() => {
              return getComputedStyle(document.documentElement)
                .getPropertyValue('--turbo-bg-base')
                .trim();
            });
            return current !== previousBgBase;
          },
          { timeout: 5000 }
        )
        .toBe(true);
    } else {
      // Just wait for CSS variable to exist
      await expect
        .poll(
          async () => {
            return await this.page.evaluate(() => {
              return getComputedStyle(document.documentElement)
                .getPropertyValue('--turbo-bg-base')
                .trim();
            });
          },
          { timeout: 5000 }
        )
        .toBeTruthy();
    }
  }

  /**
   * Verify that the theme selector is visible.
   */
  async expectSelectorVisible(): Promise<void> {
    await expect(this.getThemeSelector()).toBeVisible();
  }

  /**
   * Get a CSS custom property value from the document.
   */
  async getCssVariable(propertyName: string): Promise<string> {
    return this.page.evaluate((prop) => {
      return getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
    }, propertyName);
  }

  /**
   * Verify theme persists after page reload.
   */
  async expectThemePersistsAfterReload(themeId: ThemeId): Promise<void> {
    await this.page.reload();
    await this.page.waitForLoadState('domcontentloaded');

    if (this.options.waitForHydration) {
      await this.waitForHydration();
    }

    // Check the selector value
    await expect(this.getThemeSelector()).toHaveValue(themeId);

    // Check data-theme attribute
    await expect(this.page.locator('html')).toHaveAttribute('data-theme', themeId);
  }

  // Abstract methods for framework-specific elements
  abstract getPrimaryButton(): Locator;
  abstract getSuccessButton(): Locator;
  abstract getDangerButton(): Locator;
  abstract getCards(): Locator;
  abstract getTitle(): Locator;
}
