/**
 * Tests for the consolidated theme metadata module.
 */
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_THEME,
  VALID_THEMES,
  VALID_THEME_SET,
  THEME_NAMES,
  THEME_APPEARANCES,
  VENDOR_ORDER,
  VENDOR_GROUPS,
  THEME_SHORT_LABELS,
  getShortLabel,
} from '../src/themes/metadata.js';

describe('metadata', () => {
  describe('VALID_THEMES', () => {
    it('contains 24 themes', () => {
      expect(VALID_THEMES).toHaveLength(24);
    });

    it('contains unique IDs', () => {
      expect(new Set(VALID_THEMES).size).toBe(VALID_THEMES.length);
    });
  });

  describe('VALID_THEME_SET', () => {
    it('has the same size as VALID_THEMES', () => {
      expect(VALID_THEME_SET.size).toBe(VALID_THEMES.length);
    });
  });

  describe('DEFAULT_THEME', () => {
    it('is in VALID_THEMES', () => {
      expect(VALID_THEME_SET.has(DEFAULT_THEME)).toBe(true);
    });

    it('is catppuccin-mocha', () => {
      expect(DEFAULT_THEME).toBe('catppuccin-mocha');
    });
  });

  describe('THEME_NAMES', () => {
    it('has entry for every valid theme', () => {
      for (const id of VALID_THEMES) {
        expect(THEME_NAMES[id], `missing THEME_NAMES entry for "${id}"`).toBeDefined();
        expect(THEME_NAMES[id].length).toBeGreaterThan(0);
      }
    });
  });

  describe('THEME_APPEARANCES', () => {
    it('has entry for every valid theme', () => {
      for (const id of VALID_THEMES) {
        expect(THEME_APPEARANCES[id], `missing THEME_APPEARANCES entry for "${id}"`).toBeDefined();
        expect(['light', 'dark']).toContain(THEME_APPEARANCES[id]);
      }
    });
  });

  describe('VENDOR_GROUPS', () => {
    it('covers all themes (no orphans)', () => {
      const grouped = VENDOR_GROUPS.flatMap((g) => g.themeIds);
      expect(new Set(grouped)).toEqual(VALID_THEME_SET);
    });

    it('every theme appears in exactly one group', () => {
      const seen = new Map<string, string>();
      for (const group of VENDOR_GROUPS) {
        for (const id of group.themeIds) {
          expect(seen.has(id), `"${id}" appears in both "${seen.get(id)}" and "${group.id}"`).toBe(
            false,
          );
          seen.set(id, group.id);
        }
      }
      expect(seen.size).toBe(VALID_THEMES.length);
    });

    it('follows VENDOR_ORDER', () => {
      const groupIds = VENDOR_GROUPS.map((g) => g.id);
      expect(groupIds).toEqual(VENDOR_ORDER);
    });

    it('has no "(synced)" in display names', () => {
      for (const group of VENDOR_GROUPS) {
        expect(group.displayName).not.toMatch(/synced/i);
      }
    });
  });

  describe('getShortLabel', () => {
    it('strips vendor prefix for multi-flavor vendors', () => {
      expect(getShortLabel('catppuccin-mocha')).toBe('Mocha');
      expect(getShortLabel('catppuccin-latte')).toBe('Latte');
      expect(getShortLabel('github-dark')).toBe('Dark');
      expect(getShortLabel('solarized-light')).toBe('Light');
    });

    it('returns full label for single-flavor vendors', () => {
      expect(getShortLabel('dracula')).toBe('Dracula');
      expect(getShortLabel('nord')).toBe('Nord');
    });

    it('handles rose-pine accented prefix', () => {
      expect(getShortLabel('rose-pine-dawn')).toBe('Dawn');
      expect(getShortLabel('rose-pine-moon')).toBe('Moon');
    });

    it('returns full label for the base rose-pine flavor', () => {
      expect(getShortLabel('rose-pine')).toBe('Rosé Pine');
    });

    it('returns themeId for unknown themes', () => {
      expect(getShortLabel('nonexistent')).toBe('nonexistent');
    });
  });

  describe('THEME_SHORT_LABELS', () => {
    it('has no empty values', () => {
      for (const id of VALID_THEMES) {
        expect(THEME_SHORT_LABELS[id], `empty short label for "${id}"`).toBeTruthy();
        expect(THEME_SHORT_LABELS[id].length).toBeGreaterThan(0);
      }
    });

    it('has entry for every valid theme', () => {
      for (const id of VALID_THEMES) {
        expect(THEME_SHORT_LABELS[id]).toBeDefined();
      }
    });
  });
});
