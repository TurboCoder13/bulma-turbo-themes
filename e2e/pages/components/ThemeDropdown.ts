import { type Locator, type Page, expect } from '@playwright/test';
import { escapeRegex } from '../../helpers';

/**
 * Theme selector component object.
 * Encapsulates all interactions with the theme selector (select element).
 */
export class ThemeDropdown {
  /**
   * Timeout for waiting for theme to be applied (in milliseconds).
   */
  static readonly THEME_APPLY_TIMEOUT = 5000;

  readonly page: Page;
  readonly selector: Locator;

  constructor(page: Page) {
    this.page = page;
    this.selector = page.locator('#theme-selector');
  }

  /**
   * Alias for selector to maintain compatibility with existing code.
   */
  get dropdown(): Locator {
    return this.selector;
  }

  /**
   * Alias for selector to maintain compatibility with existing code.
   */
  get trigger(): Locator {
    return this.selector;
  }

  /**
   * Check if selector is visible.
   */
  async isVisible(): Promise<boolean> {
    return this.selector.isVisible();
  }

  /**
   * Open the dropdown (no-op for select element, kept for compatibility).
   */
  async open(): Promise<void> {
    // For a native select, we don't need to "open" it - just verify it's visible
    await expect(this.selector).toBeVisible();
  }

  /**
   * Select a theme by ID.
   */
  async selectTheme(themeId: string): Promise<void> {
    await this.selector.selectOption(themeId);
    // Verify theme was applied by checking data-theme attribute on html element
    const escapedThemeId = escapeRegex(themeId);
    await expect(this.page.locator('html')).toHaveAttribute(
      'data-theme',
      new RegExp(`^${escapedThemeId}$`)
    );
  }

  /**
   * Get the currently selected theme value.
   */
  async getSelectedTheme(): Promise<string | null> {
    return this.selector.inputValue();
  }

  /**
   * Verify selector is visible and functional.
   */
  async expectVisible(): Promise<void> {
    await expect(this.selector).toBeVisible();
  }

  /**
   * Verify a specific theme is selected.
   */
  async expectThemeSelected(themeId: string): Promise<void> {
    await expect(this.selector).toHaveValue(themeId);
  }
}
