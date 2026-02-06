// SPDX-License-Identifier: MIT
/**
 * Tests for FOUC-prevention persistence logic.
 *
 * Covers the critical-path inline script behavior from BaseLayout.astro
 * that prevents Flash of Unstyled Content and manages theme switching.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  resolveInitialTheme,
  buildThemeCssHref,
  needsCssUpdate,
  buildThemeIconSrc,
  applyInitialTheme,
  updateActiveTheme,
  DEFAULT_THEME,
} from '../src/persistence.js';

describe('persistence', () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    mockLocalStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    } as unknown as Storage;

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  describe('resolveInitialTheme', () => {
    const validThemes = ['catppuccin-mocha', 'catppuccin-latte', 'dracula', 'nord-dark'];

    it('returns default theme when localStorage is empty', () => {
      expect(resolveInitialTheme(window, validThemes)).toBe(DEFAULT_THEME);
    });

    it('returns stored theme when valid', () => {
      mockLocalStorage.getItem = vi.fn(() => 'dracula');

      expect(resolveInitialTheme(window, validThemes)).toBe('dracula');
    });

    it('returns default theme when stored theme is invalid', () => {
      mockLocalStorage.getItem = vi.fn(() => 'nonexistent-theme');

      expect(resolveInitialTheme(window, validThemes)).toBe(DEFAULT_THEME);
    });

    it('migrates legacy storage key on first access', () => {
      const store: Record<string, string> = { 'bulma-theme-flavor': 'nord-dark' };
      mockLocalStorage.getItem = vi.fn((key: string) => store[key] ?? null);
      mockLocalStorage.setItem = vi.fn((key: string, value: string) => {
        store[key] = value;
      });
      mockLocalStorage.removeItem = vi.fn((key: string) => {
        delete store[key];
      });

      const theme = resolveInitialTheme(window, validThemes);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('turbo-theme', 'nord-dark');
      expect(theme).toBe('nord-dark');
    });

    it('removes legacy key after migration', () => {
      const store: Record<string, string> = { 'bulma-theme-flavor': 'dracula' };
      mockLocalStorage.getItem = vi.fn((key: string) => store[key] ?? null);
      mockLocalStorage.setItem = vi.fn((key: string, value: string) => {
        store[key] = value;
      });
      mockLocalStorage.removeItem = vi.fn((key: string) => {
        delete store[key];
      });

      resolveInitialTheme(window, validThemes);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('bulma-theme-flavor');
    });

    it('returns default when localStorage throws', () => {
      mockLocalStorage.getItem = vi.fn(() => {
        throw new Error('SecurityError');
      });

      expect(resolveInitialTheme(window, validThemes)).toBe(DEFAULT_THEME);
    });

    it('validates migrated legacy theme against valid list', () => {
      const store: Record<string, string> = { 'bulma-theme-flavor': 'invalid-legacy-theme' };
      mockLocalStorage.getItem = vi.fn((key: string) => store[key] ?? null);
      mockLocalStorage.setItem = vi.fn((key: string, value: string) => {
        store[key] = value;
      });
      mockLocalStorage.removeItem = vi.fn((key: string) => {
        delete store[key];
      });

      expect(resolveInitialTheme(window, validThemes)).toBe(DEFAULT_THEME);
    });

    it('returns default when valid themes list is empty', () => {
      mockLocalStorage.getItem = vi.fn(() => 'dracula');

      expect(resolveInitialTheme(window, [])).toBe(DEFAULT_THEME);
    });

    it('does not migrate when current key already exists', () => {
      mockLocalStorage.getItem = vi.fn((key: string) => {
        if (key === 'bulma-theme-flavor') return 'dracula';
        if (key === 'turbo-theme') return 'catppuccin-latte';
        return null;
      });

      const theme = resolveInitialTheme(window, validThemes);

      expect(theme).toBe('catppuccin-latte');
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });
  });

  describe('buildThemeCssHref', () => {
    it('constructs correct path with base URL', () => {
      expect(buildThemeCssHref('/turbo', 'dracula')).toBe(
        '/turbo/assets/css/themes/turbo/dracula.css',
      );
    });

    it('constructs correct path with empty base URL', () => {
      expect(buildThemeCssHref('', 'catppuccin-mocha')).toBe(
        '/assets/css/themes/turbo/catppuccin-mocha.css',
      );
    });

    it('handles base URL with nested path', () => {
      expect(buildThemeCssHref('/my-site/demo', 'nord-dark')).toBe(
        '/my-site/demo/assets/css/themes/turbo/nord-dark.css',
      );
    });

    it('preserves theme IDs with hyphens and underscores', () => {
      expect(buildThemeCssHref('', 'tokyo-night_storm')).toBe(
        '/assets/css/themes/turbo/tokyo-night_storm.css',
      );
    });
  });

  describe('needsCssUpdate', () => {
    it('returns false for default theme', () => {
      expect(needsCssUpdate(DEFAULT_THEME)).toBe(false);
    });

    it('returns true for non-default theme', () => {
      expect(needsCssUpdate('dracula')).toBe(true);
    });

    it('returns false when theme matches custom default', () => {
      expect(needsCssUpdate('nord-dark', 'nord-dark')).toBe(false);
    });

    it('returns true when theme differs from custom default', () => {
      expect(needsCssUpdate('dracula', 'nord-dark')).toBe(true);
    });
  });

  describe('buildThemeIconSrc', () => {
    const themeIcons: Record<string, string> = {
      dracula: 'dracula-logo.png',
      'catppuccin-mocha': 'catppuccin-logo-mocha.png',
    };

    it('returns correct icon path for known theme', () => {
      expect(buildThemeIconSrc('/base', themeIcons, 'dracula')).toBe(
        '/base/assets/img/dracula-logo.png',
      );
    });

    it('returns default fallback icon for unknown theme', () => {
      expect(buildThemeIconSrc('/base', themeIcons, 'unknown')).toBe(
        '/base/assets/img/catppuccin-logo-macchiato.png',
      );
    });

    it('uses custom fallback icon when provided', () => {
      expect(buildThemeIconSrc('/base', themeIcons, 'unknown', 'default.png')).toBe(
        '/base/assets/img/default.png',
      );
    });

    it('handles empty base URL', () => {
      expect(buildThemeIconSrc('', themeIcons, 'dracula')).toBe(
        '/assets/img/dracula-logo.png',
      );
    });

    it('handles empty themeIcons map', () => {
      expect(buildThemeIconSrc('/base', {}, 'dracula')).toBe(
        '/base/assets/img/catppuccin-logo-macchiato.png',
      );
    });
  });

  describe('applyInitialTheme', () => {
    afterEach(() => {
      // Clean up any elements added during tests
      document.getElementById('turbo-theme-css')?.remove();
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.removeAttribute('data-baseurl');
      delete window.__INITIAL_THEME__;
    });

    it('sets data-theme attribute on documentElement', () => {
      mockLocalStorage.getItem = vi.fn(() => 'dracula');

      const result = applyInitialTheme(document, window, ['dracula', 'catppuccin-mocha']);

      expect(document.documentElement.getAttribute('data-theme')).toBe('dracula');
      expect(result).toBe('dracula');
    });

    it('sets window.__INITIAL_THEME__', () => {
      mockLocalStorage.getItem = vi.fn(() => 'dracula');

      applyInitialTheme(document, window, ['dracula', 'catppuccin-mocha']);

      expect(window.__INITIAL_THEME__).toBe('dracula');
    });

    it('updates CSS link href for non-default theme', () => {
      mockLocalStorage.getItem = vi.fn(() => 'dracula');
      document.documentElement.setAttribute('data-baseurl', '/site');

      const link = document.createElement('link');
      link.id = 'turbo-theme-css';
      document.head.appendChild(link);

      applyInitialTheme(document, window, ['dracula', 'catppuccin-mocha']);

      expect(link.href).toContain('/site/assets/css/themes/turbo/dracula.css');
    });

    it('does not update CSS link for default theme', () => {
      mockLocalStorage.getItem = vi.fn(() => 'catppuccin-mocha');

      const link = document.createElement('link');
      link.id = 'turbo-theme-css';
      const originalHref = link.href;
      document.head.appendChild(link);

      applyInitialTheme(document, window, ['catppuccin-mocha', 'dracula']);

      expect(link.href).toBe(originalHref);
    });

    it('falls back to default when stored theme is invalid', () => {
      mockLocalStorage.getItem = vi.fn(() => 'invalid');

      const result = applyInitialTheme(document, window, ['catppuccin-mocha', 'dracula']);

      expect(result).toBe(DEFAULT_THEME);
      expect(document.documentElement.getAttribute('data-theme')).toBe(DEFAULT_THEME);
    });

    it('handles missing CSS link element gracefully', () => {
      mockLocalStorage.getItem = vi.fn(() => 'dracula');

      expect(() => applyInitialTheme(document, window, ['dracula'])).not.toThrow();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dracula');
    });

    it('uses empty string when data-baseurl attribute is missing', () => {
      mockLocalStorage.getItem = vi.fn(() => 'dracula');
      document.documentElement.removeAttribute('data-baseurl');

      const link = document.createElement('link');
      link.id = 'turbo-theme-css';
      document.head.appendChild(link);

      applyInitialTheme(document, window, ['dracula']);

      expect(link.href).toContain('/assets/css/themes/turbo/dracula.css');
    });

    it('handles localStorage error during initial theme resolution', () => {
      mockLocalStorage.getItem = vi.fn(() => {
        throw new Error('SecurityError');
      });

      const result = applyInitialTheme(document, window, ['catppuccin-mocha']);

      expect(result).toBe(DEFAULT_THEME);
      expect(window.__INITIAL_THEME__).toBe(DEFAULT_THEME);
    });
  });

  describe('updateActiveTheme', () => {
    it('adds active class to matching option', () => {
      const opt1 = document.createElement('div');
      opt1.setAttribute('data-theme', 'dracula');
      const opt2 = document.createElement('div');
      opt2.setAttribute('data-theme', 'nord-dark');

      updateActiveTheme([opt1, opt2], 'dracula');

      expect(opt1.classList.contains('active')).toBe(true);
      expect(opt2.classList.contains('active')).toBe(false);
    });

    it('removes active class from previously active option', () => {
      const opt1 = document.createElement('div');
      opt1.setAttribute('data-theme', 'dracula');
      opt1.classList.add('active');
      const opt2 = document.createElement('div');
      opt2.setAttribute('data-theme', 'nord-dark');

      updateActiveTheme([opt1, opt2], 'nord-dark');

      expect(opt1.classList.contains('active')).toBe(false);
      expect(opt2.classList.contains('active')).toBe(true);
    });

    it('handles empty options list', () => {
      expect(() => updateActiveTheme([], 'dracula')).not.toThrow();
    });

    it('removes all active classes when no theme matches', () => {
      const opt = document.createElement('div');
      opt.setAttribute('data-theme', 'dracula');
      opt.classList.add('active');

      updateActiveTheme([opt], 'nonexistent');

      expect(opt.classList.contains('active')).toBe(false);
    });

    it('works with NodeList from querySelectorAll', () => {
      const container = document.createElement('div');
      const opt1 = document.createElement('div');
      opt1.setAttribute('data-theme', 'dracula');
      opt1.classList.add('theme-option');
      const opt2 = document.createElement('div');
      opt2.setAttribute('data-theme', 'nord-dark');
      opt2.classList.add('theme-option');
      container.appendChild(opt1);
      container.appendChild(opt2);
      document.body.appendChild(container);

      const nodeList = container.querySelectorAll('.theme-option');
      updateActiveTheme(nodeList, 'nord-dark');

      expect(opt1.classList.contains('active')).toBe(false);
      expect(opt2.classList.contains('active')).toBe(true);

      document.body.removeChild(container);
    });

    it('handles option without data-theme attribute', () => {
      const opt1 = document.createElement('div');
      // No data-theme attribute
      const opt2 = document.createElement('div');
      opt2.setAttribute('data-theme', 'dracula');

      updateActiveTheme([opt1, opt2], 'dracula');

      expect(opt1.classList.contains('active')).toBe(false);
      expect(opt2.classList.contains('active')).toBe(true);
    });
  });
});
