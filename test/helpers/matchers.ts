/**
 * Custom Vitest matchers for theme testing.
 *
 * Provides domain-specific assertions for testing CSS variables,
 * color values, and contrast ratios.
 *
 * @example
 * // In vitest.setup.ts or test file:
 * import './test/helpers/matchers';
 *
 * // Then in tests:
 * expect('#ff0000').toBeValidHexColor();
 * expect({ fg: '#ffffff', bg: '#000000' }).toHaveValidContrast(4.5);
 * expect(cssContent).toContainCssVariable('--turbo-bg-base');
 */
import { expect } from 'vitest';

// Hex color pattern: #RGB, #RGBA, #RRGGBB, or #RRGGBBAA
const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}){1,2}$|^#(?:[0-9a-fA-F]{4}){1,2}$/;

// CSS variable pattern: --name
const CSS_VAR_PATTERN = /--[\w-]+\s*:/;

/**
 * Convert hex color to RGB components.
 * Supports 3, 4, 6, and 8 digit hex formats.
 * For 4/8 digit formats, the alpha channel is ignored.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Try 6-digit format #RRGGBB
  const result6 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result6) {
    return {
      r: parseInt(result6[1], 16),
      g: parseInt(result6[2], 16),
      b: parseInt(result6[3], 16),
    };
  }

  // Try 8-digit format #RRGGBBAA (ignore alpha)
  const result8 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[a-f\d]{2}$/i.exec(hex);
  if (result8) {
    return {
      r: parseInt(result8[1], 16),
      g: parseInt(result8[2], 16),
      b: parseInt(result8[3], 16),
    };
  }

  // Try short 3-digit format #RGB
  const short3 = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
  if (short3) {
    return {
      r: parseInt(short3[1] + short3[1], 16),
      g: parseInt(short3[2] + short3[2], 16),
      b: parseInt(short3[3] + short3[3], 16),
    };
  }

  // Try short 4-digit format #RGBA (ignore alpha)
  const short4 = /^#?([a-f\d])([a-f\d])([a-f\d])[a-f\d]$/i.exec(hex);
  if (short4) {
    return {
      r: parseInt(short4[1] + short4[1], 16),
      g: parseInt(short4[2] + short4[2], 16),
      b: parseInt(short4[3] + short4[3], 16),
    };
  }

  return null;
}

/**
 * Calculate relative luminance (WCAG)
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const sRGB = v / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(fg: string, bg: string): number | null {
  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);

  if (!fgRgb || !bgRgb) {
    return null;
  }

  const l1 = getRelativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const l2 = getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Extend Vitest's expect
expect.extend({
  /**
   * Assert that a string is a valid hex color
   *
   * @example
   * expect('#ff0000').toBeValidHexColor(); // passes
   * expect('red').toBeValidHexColor(); // fails
   * expect('#fff').toBeValidHexColor(); // passes (short format)
   */
  toBeValidHexColor(received: string) {
    const pass = HEX_COLOR_PATTERN.test(received);
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid hex color`
          : `expected ${received} to be a valid hex color (format: #RGB, #RRGGBB, #RGBA, or #RRGGBBAA)`,
    };
  },

  /**
   * Assert that foreground and background colors have sufficient contrast
   *
   * @example
   * expect({ fg: '#ffffff', bg: '#000000' }).toHaveValidContrast(4.5); // passes (21:1)
   * expect({ fg: '#999999', bg: '#888888' }).toHaveValidContrast(4.5); // fails (~1.26:1)
   */
  toHaveValidContrast(
    received: { fg: string; bg: string },
    threshold: number
  ) {
    const ratio = getContrastRatio(received.fg, received.bg);

    if (ratio === null) {
      return {
        pass: false,
        message: () =>
          `Invalid color format: fg=${received.fg}, bg=${received.bg}. Expected hex colors.`,
      };
    }

    const pass = ratio >= threshold;
    return {
      pass,
      message: () =>
        pass
          ? `expected contrast ratio ${ratio.toFixed(2)}:1 to be less than ${threshold}:1`
          : `expected contrast ratio ${ratio.toFixed(2)}:1 to be at least ${threshold}:1 (fg: ${received.fg}, bg: ${received.bg})`,
    };
  },

  /**
   * Assert that CSS content contains a specific CSS variable
   *
   * @example
   * expect(cssContent).toContainCssVariable('--turbo-bg-base');
   * expect(cssContent).toContainCssVariable('--turbo-text-primary');
   */
  toContainCssVariable(received: string, varName: string) {
    // Escape special regex characters (backslash first, then others)
    const escaped = varName.replace(/\\/g, '\\\\').replace(/[-/{}()*+?.^$|[\]]/g, '\\$&');
    const pattern = new RegExp(`${escaped}\\s*:`, 'g'); // nosemgrep: detect-non-literal-regexp
    const pass = pattern.test(received);
    return {
      pass,
      message: () =>
        pass
          ? `expected CSS not to contain variable ${varName}`
          : `expected CSS to contain variable ${varName}`,
    };
  },

  /**
   * Assert that CSS content has valid :root selector with variables
   *
   * @example
   * expect(cssContent).toHaveValidRootSelector();
   */
  toHaveValidRootSelector(received: string) {
    const hasRoot = received.includes(':root');
    const hasVariables = CSS_VAR_PATTERN.test(received);
    const pass = hasRoot && hasVariables;
    return {
      pass,
      message: () =>
        pass
          ? `expected CSS not to have valid :root selector with variables`
          : `expected CSS to have :root selector with CSS variables (hasRoot: ${hasRoot}, hasVariables: ${hasVariables})`,
    };
  },

  /**
   * Assert that a color is within a brightness range
   *
   * @example
   * expect('#ffffff').toHaveBrightness({ min: 0.9 }); // white is bright
   * expect('#000000').toHaveBrightness({ max: 0.1 }); // black is dark
   */
  toHaveBrightness(
    received: string,
    options: { min?: number; max?: number }
  ) {
    const rgb = hexToRgb(received);
    if (!rgb) {
      return {
        pass: false,
        message: () => `Invalid hex color: ${received}`,
      };
    }

    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 / 255;
    const { min = 0, max = 1 } = options;
    const pass = brightness >= min && brightness <= max;

    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} brightness (${brightness.toFixed(2)}) to be outside range [${min}, ${max}]`
          : `expected ${received} brightness (${brightness.toFixed(2)}) to be within range [${min}, ${max}]`,
    };
  },
});

// TypeScript declarations for custom matchers
declare module 'vitest' {
  interface Assertion<T = unknown> {
    toBeValidHexColor(): T;
    toHaveValidContrast(threshold: number): T;
    toContainCssVariable(varName: string): T;
    toHaveValidRootSelector(): T;
    toHaveBrightness(options: { min?: number; max?: number }): T;
  }

  interface AsymmetricMatchersContaining {
    toBeValidHexColor(): unknown;
    toHaveValidContrast(threshold: number): unknown;
    toContainCssVariable(varName: string): unknown;
    toHaveValidRootSelector(): unknown;
    toHaveBrightness(options: { min?: number; max?: number }): unknown;
  }
}
