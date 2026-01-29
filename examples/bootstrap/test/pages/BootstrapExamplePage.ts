import { type Locator, type Page, expect } from '@playwright/test';

import { escapeRegex, type ThemeId } from '../../../test-utils';

const LIGHT_THEMES: ThemeId[] = ['catppuccin-latte', 'github-light', 'bulma-light'];

/**
 * Page object for the Bootstrap example.
 */
export class BootstrapExamplePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the Bootstrap example.
   */
  async goto(): Promise<void> {
    await this.page.goto('/examples/bootstrap/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get the theme selector element.
   */
  getThemeSelector(): Locator {
    return this.page.locator('#theme-selector');
  }

  /**
   * Get the theme CSS link element.
   */
  getThemeCss(): Locator {
    return this.page.locator('#theme-css');
  }

  /**
   * Select a theme from the dropdown.
   */
  async selectTheme(themeId: ThemeId): Promise<void> {
    const selector = this.getThemeSelector();
    await expect(selector).toBeVisible({ timeout: 2000 });

    // Check if we're already on this theme
    const currentTheme = await this.page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    const isThemeChange = currentTheme !== themeId;

    // Capture current CSS variable value before switching (for later comparison)
    const previousBgBase = isThemeChange
      ? await this.page.evaluate(() => {
          return getComputedStyle(document.documentElement)
            .getPropertyValue('--turbo-bg-base')
            .trim();
        })
      : undefined;

    // Use evaluate to set the value and dispatch change event
    // This ensures the native change event listener is triggered
    await this.page.evaluate((theme) => {
      const select = document.getElementById('theme-selector') as HTMLSelectElement;
      if (select) {
        select.value = theme;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, themeId);

    await this.expectThemeApplied(themeId, previousBgBase);
  }

  /**
   * Get the current theme value from the selector.
   */
  async getCurrentTheme(): Promise<string> {
    return this.getThemeSelector().inputValue();
  }

  /**
   * Verify that a theme is applied correctly.
   * @param themeId - The theme ID to verify
   * @param previousBgBase - Optional previous CSS variable value to detect change
   */
  async expectThemeApplied(themeId: ThemeId, previousBgBase?: string): Promise<void> {
    const escapedThemeId = escapeRegex(themeId);

    // Check data-theme attribute
    await expect(this.page.locator('html')).toHaveAttribute('data-theme', themeId);

    // Check data-bs-theme attribute for Bootstrap
    const expectedBsTheme = LIGHT_THEMES.includes(themeId) ? 'light' : 'dark';
    await expect(this.page.locator('html')).toHaveAttribute('data-bs-theme', expectedBsTheme);

    // Check localStorage with polling
    await expect
      .poll(
        async () => {
          return await this.page.evaluate(() => localStorage.getItem('turbo-theme'));
        },
        { timeout: 5000 }
      )
      .toBe(themeId);

    // Check CSS link href
    await expect(this.getThemeCss()).toHaveAttribute(
      'href',
      new RegExp(`${escapedThemeId}\\.css`), // nosemgrep: detect-non-literal-regexp
    );

    // Wait for CSS to actually load by checking the CSS variable changes
    // If we have a previous value, wait for it to change; otherwise just wait for it to exist
    if (previousBgBase) {
      // Wait for CSS variable to change from previous value
      await expect
        .poll(
          async () => {
            const current = await this.page.evaluate(() => {
              return getComputedStyle(document.documentElement)
                .getPropertyValue('--turbo-bg-base')
                .trim();
            });
            return current !== previousBgBase;
          },
          { timeout: 5000 }
        )
        .toBe(true);
    } else {
      // Just wait for CSS variable to exist
      await expect
        .poll(
          async () => {
            return await this.page.evaluate(() => {
              return getComputedStyle(document.documentElement)
                .getPropertyValue('--turbo-bg-base')
                .trim();
            });
          },
          { timeout: 5000 }
        )
        .toBeTruthy();
    }
  }

  /**
   * Verify that the theme selector is visible.
   */
  async expectSelectorVisible(): Promise<void> {
    await expect(this.getThemeSelector()).toBeVisible();
  }

  /**
   * Get Bootstrap primary button.
   */
  getPrimaryButton(): Locator {
    return this.page.locator('.btn-primary');
  }

  /**
   * Get Bootstrap success button.
   */
  getSuccessButton(): Locator {
    return this.page.locator('.btn-success');
  }

  /**
   * Get Bootstrap danger button.
   */
  getDangerButton(): Locator {
    return this.page.locator('.btn-danger');
  }

  /**
   * Get all Bootstrap buttons.
   */
  getButtons(): Locator {
    return this.page.locator('.card-body .btn');
  }

  /**
   * Get Bootstrap card elements.
   */
  getCards(): Locator {
    return this.page.locator('.card');
  }

  /**
   * Get Bootstrap alert elements.
   */
  getAlerts(): Locator {
    return this.page.locator('.alert');
  }

  /**
   * Get form input elements.
   */
  getFormInputs(): Locator {
    return this.page.locator('.form-control');
  }

  /**
   * Get the navbar brand.
   */
  getNavbarBrand(): Locator {
    return this.page.locator('.navbar-brand');
  }

  /**
   * Get color swatch elements.
   */
  getSwatches(): Locator {
    return this.page.locator('.swatch');
  }

  /**
   * Get the footer showing current theme.
   */
  getFooter(): Locator {
    return this.page.locator('footer');
  }

  /**
   * Get a CSS custom property value.
   */
  async getCssVariable(propertyName: string): Promise<string> {
    return this.page.evaluate((prop) => {
      return getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
    }, propertyName);
  }

  /**
   * Verify theme persists after page reload.
   */
  async expectThemePersistsAfterReload(themeId: ThemeId): Promise<void> {
    await this.page.reload();
    await this.page.waitForLoadState('domcontentloaded');

    // Check the selector value
    await expect(this.getThemeSelector()).toHaveValue(themeId);

    // Check data-theme attribute
    await expect(this.page.locator('html')).toHaveAttribute('data-theme', themeId);
  }
}
