import { Page, Locator, expect } from '@playwright/test';
import { escapeCssAttributeSelector } from '../../helpers';

/**
 * Theme dropdown component object.
 * Encapsulates all interactions with the theme dropdown.
 */
export class ThemeDropdown {
  /**
   * Timeout for waiting for dropdown to become active (in milliseconds).
   */
  static readonly THEME_DROPDOWN_ACTIVE_TIMEOUT = 5000;

  readonly page: Page;
  readonly dropdown: Locator;
  readonly trigger: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropdown = page.getByTestId('theme-dropdown');
    this.trigger = page.getByTestId('theme-trigger');
  }

  /**
   * Check if dropdown is visible.
   */
  async isVisible(): Promise<boolean> {
    return this.dropdown.isVisible();
  }

  /**
   * Open the dropdown by hovering.
   */
  async open(): Promise<void> {
    // Ensure elements exist; dropdown may be hidden before activation
    await expect(this.dropdown).toBeAttached();
    await expect(this.trigger).toBeVisible();
    // Prefer hover; fall back to click when hover is not supported
    const supportsHover = await this.page.evaluate(
      () => window.matchMedia('(hover: hover)').matches
    );
    if (supportsHover) {
      await this.trigger.hover();
    } else {
      await this.trigger.click();
    }
    // Assert the active state with timeout (word-boundary class match)
    await expect(this.dropdown).toHaveClass(/(?:^|\s)is-active(?:\s|$)/, {
      timeout: ThemeDropdown.THEME_DROPDOWN_ACTIVE_TIMEOUT,
    });
  }

  /**
   * Select a theme by ID.
   */
  async selectTheme(themeId: string): Promise<void> {
    await this.open();
    const option = this.getThemeOption(themeId);
    await option.click();
    // Verify dropdown closed after selection
    await expect(this.dropdown).not.toHaveClass(/(?:^|\s)is-active(?:\s|$)/, {
      timeout: ThemeDropdown.THEME_DROPDOWN_ACTIVE_TIMEOUT,
    });
    // Verify theme was applied by checking data-flavor attribute on html element
    await expect(this.page.locator('html')).toHaveAttribute('data-flavor', themeId);
  }

  /**
   * Get a theme option by ID.
   */
  getThemeOption(themeId: string): Locator {
    const escapedThemeId = escapeCssAttributeSelector(themeId);
    return this.dropdown.locator(`[data-theme-id="${escapedThemeId}"]`);
  }

  /**
   * Verify dropdown is visible and functional.
   */
  async expectVisible(): Promise<void> {
    await expect(this.dropdown).toBeVisible();
    await expect(this.trigger).toBeVisible();
  }

  /**
   * Verify dropdown is in active state.
   *
   * @param timeout - Optional timeout in milliseconds. Defaults to THEME_DROPDOWN_ACTIVE_TIMEOUT.
   */
  async expectActive(timeout: number = ThemeDropdown.THEME_DROPDOWN_ACTIVE_TIMEOUT): Promise<void> {
    await expect(this.dropdown).toHaveClass(/(?:^|\s)is-active(?:\s|$)/, {
      timeout,
    });
  }
}
