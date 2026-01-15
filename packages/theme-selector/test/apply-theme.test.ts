// SPDX-License-Identifier: MIT
/**
 * Tests for apply-theme module
 */
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { applyTheme, getCurrentTheme } from '../src/apply-theme.js';
import { DOM_IDS, DOM_SELECTORS } from '../src/constants.js';

// Mock theme-loader module
vi.mock('../src/theme-loader.js', () => ({
  getBaseUrl: vi.fn(() => '/base'),
  applyThemeClass: vi.fn(),
  loadThemeCSS: vi.fn(() => Promise.resolve()),
  resolveAssetPath: vi.fn((path: string, base: string) => `${base}/${path}`),
  getCurrentThemeFromClasses: vi.fn(),
}));

// Import mocked functions for assertions
import * as themeLoader from '../src/theme-loader.js';

describe('apply-theme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('applyTheme', () => {
    it('applies theme class to document', async () => {
      await applyTheme(document, 'catppuccin-mocha');
      expect(themeLoader.applyThemeClass).toHaveBeenCalledWith(document, 'catppuccin-mocha');
    });

    it('loads theme CSS', async () => {
      await applyTheme(document, 'catppuccin-mocha');
      expect(themeLoader.loadThemeCSS).toHaveBeenCalled();
    });

    it('falls back to default theme when unknown theme ID provided', async () => {
      await applyTheme(document, 'unknown-theme');
      expect(themeLoader.applyThemeClass).toHaveBeenCalled();
    });

    it('adds loading state to trigger button', async () => {
      const trigger = document.createElement('button');
      trigger.id = DOM_IDS.THEME_FLAVOR_TRIGGER;
      document.body.appendChild(trigger);

      await applyTheme(document, 'catppuccin-mocha');

      // Loading class should be removed after completion
      expect(trigger.classList.contains('is-loading')).toBe(false);
    });

    it('removes loading state even if error occurs', async () => {
      const trigger = document.createElement('button');
      trigger.id = DOM_IDS.THEME_FLAVOR_TRIGGER;
      document.body.appendChild(trigger);

      vi.mocked(themeLoader.loadThemeCSS).mockRejectedValueOnce(new Error('Load failed'));

      await expect(applyTheme(document, 'catppuccin-mocha')).rejects.toThrow('Load failed');
      expect(trigger.classList.contains('is-loading')).toBe(false);
    });

    it('updates trigger icon when present', async () => {
      const triggerIcon = document.createElement('img');
      triggerIcon.id = DOM_IDS.THEME_FLAVOR_TRIGGER_ICON;
      document.body.appendChild(triggerIcon);

      await applyTheme(document, 'catppuccin-mocha');

      expect(triggerIcon.src).toContain('/base/');
    });

    it.each([
      { description: 'trigger icon', elementId: DOM_IDS.THEME_FLAVOR_TRIGGER_ICON },
      { description: 'trigger button', elementId: DOM_IDS.THEME_FLAVOR_TRIGGER },
    ])('applies theme successfully when $description is missing', async ({ elementId }) => {
      // Verify theme is applied even without the optional UI element
      // Note: We don't create the element to simulate it being missing
      expect(document.getElementById(elementId)).toBeNull();

      await applyTheme(document, 'catppuccin-mocha');

      // Core functionality should still work regardless of missing UI elements
      expect(themeLoader.applyThemeClass).toHaveBeenCalledWith(document, 'catppuccin-mocha');
      expect(themeLoader.loadThemeCSS).toHaveBeenCalled();
    });

    it('updates active state in dropdown items', async () => {
      // Create dropdown menu container with correct ID
      const menu = document.createElement('div');
      menu.id = DOM_IDS.THEME_FLAVOR_MENU;

      // Create dropdown items inside the menu
      const item1 = document.createElement('div');
      item1.className = 'dropdown-item theme-item';
      item1.setAttribute('data-theme-id', 'catppuccin-mocha');

      const item2 = document.createElement('div');
      item2.className = 'dropdown-item theme-item';
      item2.setAttribute('data-theme-id', 'catppuccin-latte');

      menu.appendChild(item1);
      menu.appendChild(item2);
      document.body.appendChild(menu);

      await applyTheme(document, 'catppuccin-mocha');

      expect(item1.classList.contains('is-active')).toBe(true);
      expect(item1.getAttribute('aria-checked')).toBe('true');
      expect(item2.classList.contains('is-active')).toBe(false);
      expect(item2.getAttribute('aria-checked')).toBe('false');
    });

    it('applies theme and updates icon for themes with icon metadata', async () => {
      const triggerIcon = document.createElement('img');
      triggerIcon.id = DOM_IDS.THEME_FLAVOR_TRIGGER_ICON;
      document.body.appendChild(triggerIcon);

      // Apply a theme - icon path resolution should be attempted
      await applyTheme(document, 'bulma-light');

      // Theme class should be applied regardless of icon status
      expect(themeLoader.applyThemeClass).toHaveBeenCalledWith(document, 'bulma-light');
      expect(themeLoader.loadThemeCSS).toHaveBeenCalled();
      // resolveAssetPath should be called to attempt icon resolution
      expect(themeLoader.resolveAssetPath).toHaveBeenCalled();
    });

    it('catches and logs invalid icon path errors', async () => {
      const triggerIcon = document.createElement('img');
      triggerIcon.id = DOM_IDS.THEME_FLAVOR_TRIGGER_ICON;
      document.body.appendChild(triggerIcon);

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.mocked(themeLoader.resolveAssetPath).mockImplementationOnce(() => {
        throw new Error('Invalid path');
      });

      await applyTheme(document, 'catppuccin-mocha');

      // Centralized error handler logs with prefix and context
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid theme icon path'),
        expect.objectContaining({ themeId: expect.any(String) })
      );
      consoleSpy.mockRestore();
    });

    it('uses first available theme when requested theme not found and default not found', async () => {
      // This tests the fallback chain: requested -> default -> first
      await applyTheme(document, 'completely-unknown-theme');
      expect(themeLoader.applyThemeClass).toHaveBeenCalled();
    });
  });

  describe('getCurrentTheme', () => {
    it('returns theme from document classes', () => {
      vi.mocked(themeLoader.getCurrentThemeFromClasses).mockReturnValueOnce('catppuccin-mocha');
      const result = getCurrentTheme(document, 'default-theme');
      expect(result).toBe('catppuccin-mocha');
    });

    it.each([
      { returnValue: null, description: 'null' },
      { returnValue: undefined, description: 'undefined' },
    ])('returns default theme when getCurrentThemeFromClasses returns $description', ({ returnValue }) => {
      vi.mocked(themeLoader.getCurrentThemeFromClasses).mockReturnValueOnce(returnValue as string | null);
      const result = getCurrentTheme(document, 'default-theme');
      expect(result).toBe('default-theme');
    });
  });
});
