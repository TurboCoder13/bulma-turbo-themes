/**
 * Tests for fixture module to ensure exports work correctly.
 */
import { describe, expect, it } from 'vitest';
import {
  // Theme fixtures
  LIGHT_THEME,
  DARK_THEME,
  THEME_IDS,
  createMockFlavor,
  createTestThemes,
  // Token fixtures
  LIGHT_THEME_TOKENS,
  DARK_THEME_TOKENS,
  createMockTokens,
  // DOM fixtures
  createMockElement,
  createMockLocalStorage,
  createMockKeyEvent,
} from './index.js';

describe('fixtures', () => {
  describe('theme fixtures', () => {
    it('exports LIGHT_THEME with correct properties', () => {
      expect(LIGHT_THEME.id).toBe('test-light');
      expect(LIGHT_THEME.appearance).toBe('light');
      expect(LIGHT_THEME.tokens).toBeDefined();
    });

    it('exports DARK_THEME with correct properties', () => {
      expect(DARK_THEME.id).toBe('test-dark');
      expect(DARK_THEME.appearance).toBe('dark');
    });

    it('exports THEME_IDS constants', () => {
      expect(THEME_IDS.light).toBe('test-light');
      expect(THEME_IDS.dark).toBe('test-dark');
      expect(THEME_IDS.default).toBe('catppuccin-mocha');
    });

    it('createMockFlavor creates valid theme', () => {
      const theme = createMockFlavor({ id: 'custom' });
      expect(theme.id).toBe('custom');
      expect(theme.tokens.background.base).toBeDefined();
    });

    it('createTestThemes creates specified number of themes', () => {
      const themes = createTestThemes(5);
      expect(themes).toHaveLength(5);
      themes.forEach((t, i) => {
        expect(t.id).toBe(`test-theme-${i}`);
      });
    });
  });

  describe('token fixtures', () => {
    it('exports LIGHT_THEME_TOKENS with all required fields', () => {
      expect(LIGHT_THEME_TOKENS.background.base).toBeDefined();
      expect(LIGHT_THEME_TOKENS.text.primary).toBeDefined();
      expect(LIGHT_THEME_TOKENS.state.info).toBeDefined();
    });

    it('exports DARK_THEME_TOKENS with dark colors', () => {
      expect(DARK_THEME_TOKENS.background.base).toBe('#1e1e2e');
    });

    it('createMockTokens allows overrides', () => {
      const tokens = createMockTokens({
        background: { base: '#000000', surface: '#111111', overlay: '#222222' },
      });
      expect(tokens.background.base).toBe('#000000');
      expect(tokens.text.primary).toBeDefined(); // Other fields preserved
    });
  });

  describe('DOM fixtures', () => {
    it('createMockElement creates element with classList', () => {
      const el = createMockElement();
      expect(el.classList.add).toBeDefined();
      expect(el.classList.remove).toBeDefined();
      expect(el.setAttribute).toBeDefined();
    });

    it('createMockLocalStorage creates storage mock', () => {
      const storage = createMockLocalStorage();
      expect(storage.getItem).toBeDefined();
      expect(storage.setItem).toBeDefined();
      storage.setItem('key', 'value');
      expect(storage.setItem).toHaveBeenCalledWith('key', 'value');
    });

    it('createMockKeyEvent creates keyboard event', () => {
      const event = createMockKeyEvent('Enter');
      expect(event.key).toBe('Enter');
      expect(event.preventDefault).toBeDefined();
    });
  });
});
