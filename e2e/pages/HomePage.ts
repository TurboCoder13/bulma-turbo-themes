import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { escapeCssAttributeSelector } from '../helpers';
import { BasePage } from './BasePage';

/**
 * Home page object with theme-specific functionality.
 */
export class HomePage extends BasePage {
  /**
   * Navigate to the home page.
   */
  async goto(): Promise<void> {
    await super.goto('/');
  }

  /**
   * Switch to a specific theme with full verification.
   */
  async switchToTheme(themeId: string): Promise<void> {
    await this.selectTheme(themeId);
    await this.expectThemeApplied(themeId);
  }

  /**
   * Verify theme persists after reload.
   */
  async verifyThemePersistence(themeId: string): Promise<void> {
    await this.page.reload();
    await this.expectThemeApplied(themeId);
  }

  /**
   * Get a theme option locator by theme ID.
   */
  getThemeOption(themeId: string): Locator {
    const escapedThemeId = escapeCssAttributeSelector(themeId);
    return this.page.locator(`[data-theme-id="${escapedThemeId}"]`);
  }

  /**
   * Get the theme dropdown wrapper element.
   */
  getThemeDropdown(): Locator {
    return this.page.locator('#theme-dropdown');
  }

  /**
   * Open the theme dropdown menu.
   */
  async openThemeDropdown(): Promise<void> {
    const trigger = this.page.locator('#theme-trigger');
    await trigger.click();
    const menu = this.page.locator('#theme-menu');
    await expect(menu).toBeVisible();
  }

  /**
   * Close the theme dropdown menu.
   */
  async closeThemeDropdown(): Promise<void> {
    await this.page.keyboard.press('Escape');
    const menu = this.page.locator('#theme-menu');
    await expect(menu).not.toBeVisible();
  }
}
