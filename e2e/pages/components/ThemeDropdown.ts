import { Page, Locator, expect } from "@playwright/test";

/**
 * Theme dropdown component object.
 * Encapsulates all interactions with the theme dropdown.
 */
export class ThemeDropdown {
  readonly page: Page;
  readonly dropdown: Locator;
  readonly trigger: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropdown = page.getByTestId("theme-dropdown");
    this.trigger = page.getByTestId("theme-trigger");
  }

  /**
   * Check if dropdown is visible.
   */
  async isVisible(): Promise<boolean> {
    return await this.dropdown.isVisible();
  }

  /**
   * Open the dropdown by hovering.
   */
  async open(): Promise<void> {
    await this.dropdown.hover();
    await expect(this.dropdown).toHaveClass(/is-active/);
  }

  /**
   * Select a theme by ID.
   */
  async selectTheme(themeId: string): Promise<void> {
    await this.open();
    const option = this.page.locator(`[data-theme-id="${themeId}"]`);
    await option.click();
  }

  /**
   * Get a theme option by ID.
   */
  getThemeOption(themeId: string): Locator {
    return this.page.locator(`[data-theme-id="${themeId}"]`);
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
   */
  async expectActive(): Promise<void> {
    await expect(this.dropdown).toHaveClass(/is-active/);
  }
}
