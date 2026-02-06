/**
 * Shared E2E fixtures for theme operations.
 *
 * Provides reusable helpers to reduce duplication across E2E tests.
 */
import type { Page, Locator } from '@playwright/test';

/**
 * Theme selector component helpers.
 */
export class ThemeSelector {
  readonly trigger: Locator;
  readonly menu: Locator;

  constructor(private page: Page) {
    this.trigger = page.locator('#theme-trigger');
    this.menu = page.locator('#theme-menu');
  }

  /** Opens the theme menu by clicking the trigger. */
  async open(): Promise<void> {
    await this.trigger.click();
  }

  /** Opens the theme menu by tapping (for mobile). */
  async tap(): Promise<void> {
    // Scroll trigger into view first to ensure it's visible
    await this.trigger.scrollIntoViewIfNeeded();
    // Use force to handle cases where nav elements may overlap in mobile landscape
    await this.trigger.tap({ force: true });
    // Wait for menu to be visible after tapping
    await this.menu.waitFor({ state: 'visible', timeout: 5000 });
  }

  /** Closes the menu by clicking outside. */
  async close(): Promise<void> {
    await this.page.locator('body').click({ position: { x: 10, y: 10 }, force: true });
  }

  /** Selects a theme by its ID. */
  async selectTheme(themeId: string): Promise<void> {
    const option = this.page.locator(`.theme-option[data-theme="${themeId}"]`);
    await option.click();
  }

  /** Selects a theme by tapping (for mobile). */
  async tapTheme(themeId: string): Promise<void> {
    const option = this.page.locator(`.theme-option[data-theme="${themeId}"]`);
    // Scroll within the theme menu container so the option is visible
    await option.scrollIntoViewIfNeeded();
    await option.tap({ force: true });
    // Wait for theme to be applied
    await this.page.waitForFunction(
      (id) => document.documentElement.dataset.theme === id,
      themeId,
      { timeout: 5000 }
    );
  }

  /** Gets all available theme options. */
  getOptions(): Locator {
    return this.page.locator('.theme-option');
  }

  /** Gets a specific theme option by ID. */
  getOption(themeId: string): Locator {
    return this.page.locator(`.theme-option[data-theme="${themeId}"]`);
  }
}

/**
 * Gets the current theme from the HTML element.
 */
export async function getCurrentTheme(page: Page): Promise<string | null> {
  return page.locator('html').getAttribute('data-theme');
}

/**
 * Sets the theme directly via JavaScript.
 */
export async function setTheme(page: Page, themeId: string): Promise<void> {
  await page.evaluate((id) => {
    document.documentElement.dataset.theme = id;
    localStorage.setItem('turbo-theme', id);
  }, themeId);
}

/**
 * Gets the stored theme from localStorage.
 */
export async function getStoredTheme(page: Page): Promise<string | null> {
  return page.evaluate(() => localStorage.getItem('turbo-theme'));
}

/**
 * Clears the stored theme from localStorage.
 */
export async function clearStoredTheme(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.removeItem('turbo-theme'));
}

/**
 * Gets a CSS variable value from the document.
 */
export async function getCssVariable(page: Page, varName: string): Promise<string> {
  return page.evaluate((name) => {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }, varName);
}

/**
 * Waits for a theme to be applied.
 */
export async function waitForTheme(page: Page, themeId: string): Promise<void> {
  await page.waitForFunction(
    (id) => document.documentElement.dataset.theme === id,
    themeId,
    { timeout: 5000 }
  );
}

/**
 * Theme IDs used in tests.
 */
export const TEST_THEMES = {
  darkDefault: 'catppuccin-mocha',
  lightDefault: 'catppuccin-latte',
  dracula: 'dracula',
  githubDark: 'github-dark',
  githubLight: 'github-light',
} as const;

/**
 * Standard viewports for responsive testing.
 */
export const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
  mobileLandscape: { width: 667, height: 375 },
} as const;
