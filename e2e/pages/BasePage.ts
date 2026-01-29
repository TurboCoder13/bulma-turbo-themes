import { type Locator, type Page, expect } from '@playwright/test';

import { escapeRegex } from '../helpers';

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
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get navbar link by test ID.
   */
  getNavLink(name: string): Locator {
    return this.page.getByTestId(`nav-${name}`);
  }

  /**
   * Navigate to a page using navbar link.
   * Verifies that the URL changes to match the link's href after clicking.
   * @param pageName - The name of the page to navigate to (e.g., "home", "components", "forms").
   * @throws Error if navigation fails or URL does not match expected path.
   */
  async navigateToPage(pageName: string): Promise<void> {
    const link = this.getNavLink(pageName);

    // Get the expected URL from the link's href attribute
    const href = await link.getAttribute('href');
    if (!href) {
      throw new Error(`Navigation link "${pageName}" does not have an href attribute`);
    }

    // Normalize the href to get the pathname (handles both absolute and relative URLs)
    let expectedPath: string;
    try {
      // If href is absolute, extract pathname
      const url = new URL(href, this.page.url());
      expectedPath = url.pathname;
    } catch (err) {
      // Treat URL parsing failures as relative hrefs
      if (err instanceof TypeError) {
        expectedPath = href;
      } else {
        // Rethrow unexpected errors to avoid hiding genuine failures
        throw err;
      }
    }

    // Normalize path: remove trailing slashes for comparison (except root)
    const normalizedExpectedPath = expectedPath === '/' ? '/' : expectedPath.replace(/\/$/, '');

    // Click the link
    await link.click();

    // Wait for navigation to complete and verify URL matches
    const timeout = 10000; // 10 seconds timeout
    try {
      await this.page.waitForURL(
        (url) => {
          const currentPath = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '');
          return currentPath === normalizedExpectedPath;
        },
        { timeout }
      );
    } catch {
      const currentUrl = this.page.url();
      throw new Error(
        `Navigation to "${pageName}" failed: expected URL path "${normalizedExpectedPath}", but got "${currentUrl}"`
      );
    }

    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Verify that a navbar link is active.
   */
  async expectNavLinkActive(pageName: string): Promise<void> {
    const link = this.getNavLink(pageName);
    await expect(link).toHaveClass(/active/);
  }

  /**
   * Verify that a navbar link is visible.
   */
  async expectNavLinkVisible(pageName: string): Promise<void> {
    const link = this.getNavLink(pageName);
    await expect(link).toBeVisible();
  }

  /**
   * Get all navbar links dynamically by discovering nav items from the DOM.
   *
   * Discovers all navigation links by finding elements with data-testid attributes
   * starting with "nav-", extracts the nav names, and maps each to a Locator.
   *
   * @param navNames - Optional array of nav names to use instead of discovering from DOM.
   *                   If provided, only these names will be included in the result.
   * @returns A record mapping nav names to their Locators.
   */
  async getAllNavLinks(navNames?: string[]): Promise<Record<string, Locator>> {
    let names: string[];

    if (navNames && navNames.length > 0) {
      // Use provided nav names
      names = navNames;
    } else {
      // Discover nav names from DOM by finding all elements with data-testid starting with "nav-"
      const navLinkElements = await this.page.locator('[data-testid^="nav-"]').all();

      const namesWithNulls = await Promise.all(
        navLinkElements.map(async (element) => {
          const testId = await element.getAttribute('data-testid');
          if (!testId) {
            return null;
          }
          // Extract nav name by removing "nav-" prefix
          return testId.replace(/^nav-/, '');
        })
      );

      // Filter out null values and ensure we have valid names
      names = namesWithNulls.filter((name): name is string => name !== null && name.length > 0);
    }

    // Map each name to its Locator using getNavLink
    const links: Record<string, Locator> = {};
    for (const name of names) {
      links[name] = this.getNavLink(name);
    }

    return links;
  }

  /**
   * Get the theme selector element (the trigger button).
   */
  getThemeSelector(): Locator {
    return this.page.locator('#theme-trigger');
  }

  /**
   * Get the theme trigger button.
   */
  getThemeTrigger(): Locator {
    return this.page.getByTestId('theme-trigger');
  }

  /**
   * Select a theme from the dropdown menu.
   */
  async selectTheme(themeId: string): Promise<void> {
    // Click the theme trigger to open the dropdown
    const themeTrigger = this.getThemeTrigger();
    await themeTrigger.click();

    // Wait for dropdown to be visible
    const themeMenu = this.page.locator('#theme-menu');
    await themeMenu.waitFor({ state: 'visible', timeout: 5000 });

    // Click the theme option
    const themeOption = this.page.locator(`.theme-option[data-theme="${themeId}"]`);
    await themeOption.click();

    // Wait for theme to be applied before returning
    await this.expectThemeApplied(themeId);
  }

  /**
   * Verify the current theme is applied.
   */
  async expectThemeApplied(themeId: string): Promise<void> {
    // Check data-theme attribute
    const escapedThemeId = escapeRegex(themeId);
    await expect(this.page.locator('html')).toHaveAttribute(
      'data-theme',
      new RegExp(`^${escapedThemeId}$`), // nosemgrep: detect-non-literal-regexp
    );

    // Check localStorage with polling to handle race conditions
    await expect
      .poll(
        async () => {
          return await this.page.evaluate(() => localStorage.getItem('turbo-theme'));
        },
        { timeout: 5000 }
      )
      .toBe(themeId);

    // Check that theme CSS is loaded
    const themeCss = this.page.locator('#turbo-theme-css');
    await expect(themeCss).toHaveAttribute('href', new RegExp(`${escapedThemeId}\\.css`)); // nosemgrep: detect-non-literal-regexp
  }

  /**
   * Verify theme selector is visible.
   */
  async expectThemeSelectorVisible(): Promise<void> {
    await expect(this.getThemeSelector()).toBeVisible();
  }

  /**
   * Get the current page URL.
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Verify the current URL matches a pattern or predicate.
   */
  async expectUrl(pattern: string | RegExp | ((url: URL) => boolean)): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }

  /**
   * Get the main content element.
   */
  getMainContent(): Locator {
    return this.page.getByTestId('main-content');
  }

  /**
   * Get the theme CSS link element.
   */
  getThemeCss(): Locator {
    return this.page.locator('#turbo-theme-css');
  }
}
