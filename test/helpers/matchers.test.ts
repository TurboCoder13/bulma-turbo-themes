/**
 * Tests for custom Vitest matchers.
 */
import { describe, expect, it } from 'vitest';
import './matchers.js';

describe('Custom Matchers', () => {
  describe('toBeValidHexColor', () => {
    it('accepts valid 6-digit hex colors', () => {
      expect('#ff0000').toBeValidHexColor();
      expect('#00ff00').toBeValidHexColor();
      expect('#0000ff').toBeValidHexColor();
      expect('#ffffff').toBeValidHexColor();
      expect('#000000').toBeValidHexColor();
    });

    it('accepts valid 3-digit hex colors', () => {
      expect('#f00').toBeValidHexColor();
      expect('#0f0').toBeValidHexColor();
      expect('#00f').toBeValidHexColor();
      expect('#fff').toBeValidHexColor();
      expect('#000').toBeValidHexColor();
    });

    it('accepts valid 8-digit hex colors with alpha', () => {
      expect('#ff0000ff').toBeValidHexColor();
      expect('#00ff00aa').toBeValidHexColor();
    });

    it('accepts valid 4-digit hex colors with alpha', () => {
      expect('#f00f').toBeValidHexColor();
      expect('#0f0a').toBeValidHexColor();
    });

    it('rejects invalid colors', () => {
      expect(() => expect('red').toBeValidHexColor()).toThrow();
      expect(() => expect('rgb(255,0,0)').toBeValidHexColor()).toThrow();
      expect(() => expect('#gg0000').toBeValidHexColor()).toThrow();
      expect(() => expect('#f').toBeValidHexColor()).toThrow();
    });
  });

  describe('toHaveValidContrast', () => {
    it('passes for high contrast colors', () => {
      expect({ fg: '#ffffff', bg: '#000000' }).toHaveValidContrast(4.5);
      expect({ fg: '#000000', bg: '#ffffff' }).toHaveValidContrast(4.5);
    });

    it('fails for low contrast colors', () => {
      expect(() =>
        expect({ fg: '#888888', bg: '#999999' }).toHaveValidContrast(4.5)
      ).toThrow();
    });

    it('passes for WCAG AA large text (3:1)', () => {
      expect({ fg: '#767676', bg: '#ffffff' }).toHaveValidContrast(3.0);
    });

    it('handles edge cases', () => {
      // Same color should have 1:1 ratio
      expect(() =>
        expect({ fg: '#ffffff', bg: '#ffffff' }).toHaveValidContrast(1.1)
      ).toThrow();
    });
  });

  describe('toContainCssVariable', () => {
    it('finds CSS variables in content', () => {
      const css = `
        :root {
          --turbo-bg-base: #ffffff;
          --turbo-text-primary: #333333;
        }
      `;
      expect(css).toContainCssVariable('--turbo-bg-base');
      expect(css).toContainCssVariable('--turbo-text-primary');
    });

    it('fails when variable is missing', () => {
      const css = ':root { --turbo-bg-base: #fff; }';
      expect(() => expect(css).toContainCssVariable('--turbo-not-defined')).toThrow();
    });
  });

  describe('toHaveValidRootSelector', () => {
    it('passes for valid CSS with :root and variables', () => {
      const css = ':root { --color: #fff; }';
      expect(css).toHaveValidRootSelector();
    });

    it('fails for CSS without :root', () => {
      const css = '.class { color: red; }';
      expect(() => expect(css).toHaveValidRootSelector()).toThrow();
    });

    it('fails for :root without variables', () => {
      const css = ':root { color: red; }';
      expect(() => expect(css).toHaveValidRootSelector()).toThrow();
    });
  });

  describe('toHaveBrightness', () => {
    it('white has high brightness', () => {
      expect('#ffffff').toHaveBrightness({ min: 0.9 });
    });

    it('black has low brightness', () => {
      expect('#000000').toHaveBrightness({ max: 0.1 });
    });

    it('gray has mid brightness', () => {
      expect('#808080').toHaveBrightness({ min: 0.4, max: 0.6 });
    });

    it('fails when brightness is outside range', () => {
      expect(() => expect('#ffffff').toHaveBrightness({ max: 0.5 })).toThrow();
      expect(() => expect('#000000').toHaveBrightness({ min: 0.5 })).toThrow();
    });
  });
});
