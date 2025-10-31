import { Page, Locator, expect } from "@playwright/test";

/**
 * Base page object with common navigation and theme functionality.
 * All page objects should extend this class.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path.
   */
  async goto(path: string = "/"): Promise<void> {
    await this.page.goto(path);
    // Wait for page to be interactive
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Get navbar link by test ID.
   */
  getNavLink(name: string): Locator {
    return this.page.getByTestId(`nav-${name}`);
  }

  /**
   * Navigate to a page using navbar link.
   */
  async navigateToPage(pageName: string): Promise<void> {
    const link = this.getNavLink(pageName);
    await link.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Verify that a navbar link is active.
   */
  async expectNavLinkActive(pageName: string): Promise<void> {
    const link = this.getNavLink(pageName);
    await expect(link).toHaveClass(/is-active/);
  }

  /**
   * Verify that a navbar link is visible.
   */
  async expectNavLinkVisible(pageName: string): Promise<void> {
    const link = this.getNavLink(pageName);
    await expect(link).toBeVisible();
  }

  /**
   * Get all navbar links.
   */
  getAllNavLinks(): { home: Locator; components: Locator; forms: Locator } {
    return {
      home: this.getNavLink("home"),
      components: this.getNavLink("components"),
      forms: this.getNavLink("forms"),
    };
  }

  /**
   * Get the theme dropdown element.
   */
  getThemeDropdown(): Locator {
    return this.page.getByTestId("theme-dropdown");
  }

  /**
   * Get the theme trigger button.
   */
  getThemeTrigger(): Locator {
    return this.page.getByTestId("theme-trigger");
  }

  /**
   * Open the theme dropdown by hovering.
   */
  async openThemeDropdown(): Promise<void> {
    const dropdown = this.getThemeDropdown();
    // Wait for dropdown to be in the DOM and initialized
    await dropdown.waitFor({ state: "visible" });
    // Ensure the trigger button is also visible
    await this.getThemeTrigger().waitFor({ state: "visible" });
    // Move to the dropdown to trigger mouseenter
    await dropdown.hover();
    // Wait for is-active class to appear with a longer timeout
    await this.page.waitForFunction(
      () => {
        const dd = document.getElementById("theme-flavor-dd");
        return dd && dd.classList.contains("is-active");
      },
      { timeout: 5000 },
    );
  }

  /**
   * Select a theme from the dropdown.
   */
  async selectTheme(themeId: string): Promise<void> {
    await this.openThemeDropdown();
    const themeOption = this.page.locator(`[data-theme-id="${themeId}"]`);
    await themeOption.click();
  }

  /**
   * Verify the current theme is applied.
   */
  async expectThemeApplied(themeId: string): Promise<void> {
    // Check HTML data attribute
    await expect(this.page.locator("html")).toHaveAttribute("data-flavor", themeId);

    // Check localStorage
    const savedTheme = await this.page.evaluate(() =>
      localStorage.getItem("bulma-theme-flavor"),
    );
    expect(savedTheme).toBe(themeId);

    // Check CSS link href
    const themeCss = this.page.locator("#theme-flavor-css");
    await expect(themeCss).toHaveAttribute("href", new RegExp(`${themeId}\\.css`));
  }

  /**
   * Verify theme dropdown is visible.
   */
  async expectThemeDropdownVisible(): Promise<void> {
    await expect(this.getThemeDropdown()).toBeVisible();
    await expect(this.getThemeTrigger()).toBeVisible();
  }

  /**
   * Get the current page URL.
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Verify the current URL matches a pattern.
   */
  async expectUrl(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }

  /**
   * Get the main content element.
   */
  getMainContent(): Locator {
    return this.page.getByTestId("main-content");
  }
}
