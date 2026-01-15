import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { escapeCssAttributeSelector } from '../helpers';

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
}
