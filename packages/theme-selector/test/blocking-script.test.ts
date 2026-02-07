// SPDX-License-Identifier: MIT
/**
 * Tests for the blocking script generator.
 *
 * Validates that generateBlockingScript() produces a self-contained IIFE
 * that correctly prevents FOUC by applying the saved theme before first paint.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generateBlockingScript } from '../src/blocking-script.js';
import { DEFAULT_THEME, VALID_THEMES } from '@lgtm-hq/turbo-themes-core';
import { STORAGE_KEY, LEGACY_STORAGE_KEYS } from '../src/constants.js';

describe('generateBlockingScript', () => {
  describe('output structure', () => {
    it('returns a non-empty string', () => {
      const script = generateBlockingScript();
      expect(script).toBeTruthy();
      expect(typeof script).toBe('string');
    });

    it('is wrapped in an IIFE', () => {
      const script = generateBlockingScript();
      expect(script).toMatch(/^\(function\(\)\{/);
      expect(script).toMatch(/\}\)\(\);$/);
    });

    it('contains try-catch for error handling', () => {
      const script = generateBlockingScript();
      expect(script).toContain('try{');
      expect(script).toContain('catch(e)');
    });
  });

  describe('embedded constants', () => {
    it('embeds STORAGE_KEY from core by default', () => {
      const script = generateBlockingScript();
      expect(script).toContain(JSON.stringify(STORAGE_KEY));
    });

    it('embeds DEFAULT_THEME from core by default', () => {
      const script = generateBlockingScript();
      expect(script).toContain(JSON.stringify(DEFAULT_THEME));
    });

    it('embeds VALID_THEMES from core by default', () => {
      const script = generateBlockingScript();
      expect(script).toContain(JSON.stringify(VALID_THEMES));
    });

    it('embeds LEGACY_STORAGE_KEYS from core by default', () => {
      const script = generateBlockingScript();
      expect(script).toContain(JSON.stringify(LEGACY_STORAGE_KEYS));
    });

    it('respects custom storageKey option', () => {
      const script = generateBlockingScript({ storageKey: 'my-theme' });
      expect(script).toContain('"my-theme"');
      expect(script).not.toContain(JSON.stringify(STORAGE_KEY));
    });

    it('respects custom defaultTheme option', () => {
      const script = generateBlockingScript({ defaultTheme: 'dracula' });
      expect(script).toContain('"dracula"');
    });

    it('respects custom validThemes option', () => {
      const script = generateBlockingScript({ validThemes: ['a', 'b'] });
      expect(script).toContain('["a","b"]');
    });

    it('respects custom legacyKeys option', () => {
      const script = generateBlockingScript({ legacyKeys: ['old-key'] });
      expect(script).toContain('["old-key"]');
    });
  });

  describe('execution behavior', () => {
    let mockLocalStorage: Record<string, string>;

    beforeEach(() => {
      mockLocalStorage = {};

      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn((key: string) => mockLocalStorage[key] ?? null),
          setItem: vi.fn((key: string, value: string) => {
            mockLocalStorage[key] = value;
          }),
          removeItem: vi.fn((key: string) => {
            delete mockLocalStorage[key];
          }),
        },
        writable: true,
        configurable: true,
      });

      // Set up minimal DOM
      document.documentElement.setAttribute('data-baseurl', '');
      document.documentElement.removeAttribute('data-theme');
      delete (window as Record<string, unknown>).__INITIAL_THEME__;

      // Create theme CSS link element
      const existing = document.getElementById('turbo-theme-css');
      if (existing) existing.remove();
      const link = document.createElement('link');
      link.id = 'turbo-theme-css';
      link.href = '/assets/css/themes/turbo/catppuccin-mocha.css';
      document.head.appendChild(link);
    });

    afterEach(() => {
      const link = document.getElementById('turbo-theme-css');
      if (link) link.remove();
    });

    const validThemes = ['catppuccin-mocha', 'dracula', 'nord'];

    function execScript(options = {}) {
      const script = generateBlockingScript({ validThemes, ...options });
      // nosemgrep: javascript.browser.security.eval-detected.eval-detected -- test-only: eval is the only way to execute the generated IIFE string in happy-dom
      eval(script);
    }

    it('sets data-theme to default when localStorage is empty', () => {
      execScript();
      expect(document.documentElement.getAttribute('data-theme')).toBe('catppuccin-mocha');
    });

    it('sets data-theme to stored theme when valid', () => {
      mockLocalStorage['turbo-theme'] = 'dracula';
      execScript();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dracula');
    });

    it('falls back to default when stored theme is invalid', () => {
      mockLocalStorage['turbo-theme'] = 'nonexistent';
      execScript();
      expect(document.documentElement.getAttribute('data-theme')).toBe('catppuccin-mocha');
    });

    it('sets window.__INITIAL_THEME__', () => {
      mockLocalStorage['turbo-theme'] = 'nord';
      execScript();
      expect(window.__INITIAL_THEME__).toBe('nord');
    });

    it('migrates legacy storage key', () => {
      mockLocalStorage['bulma-theme-flavor'] = 'dracula';
      execScript();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dracula');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('turbo-theme', 'dracula');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('bulma-theme-flavor');
    });

    it('does not migrate when current key already exists', () => {
      mockLocalStorage['turbo-theme'] = 'nord';
      mockLocalStorage['bulma-theme-flavor'] = 'dracula';
      execScript();
      expect(document.documentElement.getAttribute('data-theme')).toBe('nord');
      expect(window.localStorage.removeItem).not.toHaveBeenCalled();
    });

    it('updates CSS link href for non-default theme', () => {
      mockLocalStorage['turbo-theme'] = 'dracula';
      execScript();
      const link = document.getElementById('turbo-theme-css') as HTMLLinkElement;
      expect(link.href).toContain('/assets/css/themes/turbo/dracula.css');
    });

    it('does not update CSS link for default theme', () => {
      execScript();
      const link = document.getElementById('turbo-theme-css') as HTMLLinkElement;
      expect(link.href).toContain('catppuccin-mocha.css');
    });

    it('uses data-baseurl for CSS link href', () => {
      document.documentElement.setAttribute('data-baseurl', '/my-site');
      mockLocalStorage['turbo-theme'] = 'dracula';
      execScript();
      const link = document.getElementById('turbo-theme-css') as HTMLLinkElement;
      expect(link.href).toContain('/my-site/assets/css/themes/turbo/dracula.css');
    });

    it('handles localStorage exceptions gracefully', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('SecurityError');
        },
        configurable: true,
      });
      expect(() => execScript()).not.toThrow();
      warnSpy.mockRestore();
    });
  });
});
