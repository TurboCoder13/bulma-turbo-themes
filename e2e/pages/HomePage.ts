import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Home page object with theme-specific functionality.
 */
export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the home page.
   */
  async goto(): Promise<void> {
    await super.goto("/");
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
    await this.page.waitForLoadState("domcontentloaded");
    await this.expectThemeApplied(themeId);
  }
}
