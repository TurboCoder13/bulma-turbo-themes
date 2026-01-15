// SPDX-License-Identifier: MIT
/**
 * Tests for storage utilities
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  migrateLegacyStorage,
  getSavedTheme,
  saveTheme,
  validateThemeId,
  DEFAULT_THEME,
} from '../src/storage.js';

describe('storage', () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    } as unknown as Storage;

    // Mock window.localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  describe('migrateLegacyStorage', () => {
    it('migrates legacy key to new key', () => {
      mockLocalStorage.getItem = vi.fn((key: string) => {
        if (key === 'bulma-theme-flavor') return 'catppuccin-mocha';
        return null;
      });

      migrateLegacyStorage(window);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('bulma-theme-flavor');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('turbo-theme', 'catppuccin-mocha');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('bulma-theme-flavor');
    });

    it('does not overwrite existing new key', () => {
      mockLocalStorage.getItem = vi.fn((key: string) => {
        if (key === 'bulma-theme-flavor') return 'catppuccin-mocha';
        if (key === 'turbo-theme') return 'bulma-light';
        return null;
      });

      migrateLegacyStorage(window);

      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });

    it('handles multiple legacy keys', () => {
      mockLocalStorage.getItem = vi.fn((key: string) => {
        if (key === 'bulma-theme-flavor') return 'catppuccin-mocha';
        return null;
      });

      migrateLegacyStorage(window);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('bulma-theme-flavor');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('turbo-theme', 'catppuccin-mocha');
    });

    it('does nothing when no legacy keys exist', () => {
      mockLocalStorage.getItem = vi.fn(() => null);

      migrateLegacyStorage(window);

      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });
  });

  describe('validateThemeId', () => {
    const validIds = new Set(['theme-a', 'theme-b', 'theme-c']);

    it.each([
      ['theme-a', 'theme-a', 'valid theme-a'],
      ['theme-b', 'theme-b', 'valid theme-b'],
      ['theme-c', 'theme-c', 'valid theme-c'],
    ])('returns "%s" for %s', (input, expected) => {
      expect(validateThemeId(input, validIds)).toBe(expected);
    });

    it.each([
      ['invalid-theme', 'invalid theme ID'],
      [null, 'null'],
      ['', 'empty string'],
      ['  ', 'whitespace only'],
      ['THEME-A', 'wrong case'],
    ])('returns default theme for %s (%s)', (input) => {
      expect(validateThemeId(input, validIds)).toBe(DEFAULT_THEME);
    });
  });

  describe('getSavedTheme', () => {
    it('returns saved theme from localStorage', () => {
      mockLocalStorage.getItem = vi.fn(() => 'bulma-dark');

      const theme = getSavedTheme(window);

      expect(theme).toBe('bulma-dark');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('turbo-theme');
    });

    it('returns default when no theme saved', () => {
      mockLocalStorage.getItem = vi.fn(() => null);

      const theme = getSavedTheme(window);

      expect(theme).toBe(DEFAULT_THEME);
    });

    it('validates theme when validIds provided', () => {
      const validIds = new Set(['valid-theme']);
      mockLocalStorage.getItem = vi.fn(() => 'valid-theme');

      const theme = getSavedTheme(window, validIds);

      expect(theme).toBe('valid-theme');
    });

    it('returns default for invalid theme when validIds provided', () => {
      const validIds = new Set(['valid-theme']);
      mockLocalStorage.getItem = vi.fn(() => 'invalid-theme');

      const theme = getSavedTheme(window, validIds);

      expect(theme).toBe(DEFAULT_THEME);
    });
  });

  describe('saveTheme', () => {
    it('saves theme to localStorage', () => {
      const result = saveTheme(window, 'catppuccin-latte');

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('turbo-theme', 'catppuccin-latte');
    });

    it('returns false when localStorage throws', () => {
      mockLocalStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const result = saveTheme(window, 'catppuccin-latte');

      expect(result).toBe(false);
    });

    it('returns false for invalid theme ID with validIds', () => {
      const validIds = new Set(['valid-theme']);
      const result = saveTheme(window, 'invalid-theme', validIds);

      expect(result).toBe(false);
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('storage unavailable handling', () => {
    it('getSavedTheme returns default when localStorage throws', () => {
      mockLocalStorage.getItem = vi.fn(() => {
        throw new Error('SecurityError: localStorage is not available');
      });

      const theme = getSavedTheme(window);

      expect(theme).toBe(DEFAULT_THEME);
    });

    it('getSavedTheme returns default with validation when localStorage throws', () => {
      const validIds = new Set(['valid-theme']);
      mockLocalStorage.getItem = vi.fn(() => {
        throw new Error('SecurityError');
      });

      const theme = getSavedTheme(window, validIds);

      expect(theme).toBe(DEFAULT_THEME);
    });

    it('migrateLegacyStorage handles localStorage getItem throwing', () => {
      mockLocalStorage.getItem = vi.fn(() => {
        throw new Error('SecurityError');
      });

      // Should not throw
      expect(() => migrateLegacyStorage(window)).not.toThrow();
    });

    it('migrateLegacyStorage handles localStorage setItem throwing', () => {
      mockLocalStorage.getItem = vi.fn((key: string) => {
        if (key === 'bulma-theme-flavor') return 'catppuccin-mocha';
        return null;
      });
      mockLocalStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      // Should not throw
      expect(() => migrateLegacyStorage(window)).not.toThrow();
    });

    it('migrateLegacyStorage handles localStorage removeItem throwing', () => {
      mockLocalStorage.getItem = vi.fn((key: string) => {
        if (key === 'bulma-theme-flavor') return 'catppuccin-mocha';
        return null;
      });
      mockLocalStorage.removeItem = vi.fn(() => {
        throw new Error('SecurityError');
      });

      // Should not throw
      expect(() => migrateLegacyStorage(window)).not.toThrow();
    });
  });
});
