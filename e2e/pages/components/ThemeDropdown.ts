import { type Locator, type Page, expect } from '@playwright/test';
import { escapeCssAttributeSelector, escapeRegex } from '../../helpers';

/**
 * Theme dropdown component object.
 * Encapsulates all interactions with the custom theme dropdown.
 */
export class ThemeDropdown {
  /**
   * Timeout for waiting for theme to be applied (in milliseconds).
   */
  static readonly THEME_APPLY_TIMEOUT = 5000;

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get the dropdown wrapper element.
   */
  get dropdown(): Locator {
    return this.page.locator('#theme-dropdown');
  }

  /**
   * Get the trigger button element.
   */
  get trigger(): Locator {
    return this.page.locator('#theme-trigger');
  }

  /**
   * Get the menu element containing theme options.
   */
  get menu(): Locator {
    return this.page.locator('#theme-menu');
  }

  /**
   * Check if dropdown is visible.
   */
  async isVisible(): Promise<boolean> {
    return this.trigger.isVisible();
  }

  /**
   * Open the dropdown by clicking the trigger.
   */
  async open(): Promise<void> {
    await this.trigger.click();
    await expect(this.menu).toBeVisible();
  }

  /**
   * Close the dropdown by pressing Escape.
   */
  async close(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await expect(this.menu).not.toBeVisible();
  }

  /**
   * Select a theme by ID.
   */
  async selectTheme(themeId: string): Promise<void> {
    await this.open();
    const escapedSelector = escapeCssAttributeSelector(themeId);
    const option = this.page.locator(`.theme-option[data-theme="${escapedSelector}"]`);
    await option.click();
    // Verify theme was applied by checking data-theme attribute on html element
    const escapedThemeId = escapeRegex(themeId);
    await expect(this.page.locator('html')).toHaveAttribute(
      'data-theme',
      new RegExp(`^${escapedThemeId}$`), // nosemgrep: detect-non-literal-regexp
    );
  }

  /**
   * Get the currently selected theme value from HTML data-theme attribute.
   */
  async getSelectedTheme(): Promise<string | null> {
    return this.page.locator('html').getAttribute('data-theme');
  }

  /**
   * Verify dropdown trigger is visible and functional.
   */
  async expectVisible(): Promise<void> {
    await expect(this.trigger).toBeVisible();
  }

  /**
   * Verify a specific theme is applied.
   */
  async expectThemeSelected(themeId: string): Promise<void> {
    const escapedThemeId = escapeRegex(themeId);
    await expect(this.page.locator('html')).toHaveAttribute(
      'data-theme',
      new RegExp(`^${escapedThemeId}$`), // nosemgrep: detect-non-literal-regexp
    );
  }
}
