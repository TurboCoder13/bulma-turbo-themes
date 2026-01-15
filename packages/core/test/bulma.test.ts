import { describe, expect, it } from 'vitest';
import {
  hexToHsl,
  generateBulmaConfig,
  generateBulmaUse,
  type ThemeColors,
} from '../src/themes/bulma.js';
import type { BulmaConfig } from '../src/themes/types.js';

describe('bulma', () => {
  describe('hexToHsl', () => {
    it('converts white (#ffffff) correctly', () => {
      const result = hexToHsl('#ffffff');
      expect(result.h).toBe(0);
      expect(result.s).toBe(0);
      expect(result.l).toBe(100);
    });

    it('converts black (#000000) correctly', () => {
      const result = hexToHsl('#000000');
      expect(result.h).toBe(0);
      expect(result.s).toBe(0);
      expect(result.l).toBe(0);
    });

    it('converts pure red (#ff0000) correctly', () => {
      const result = hexToHsl('#ff0000');
      expect(result.h).toBe(0);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('converts pure green (#00ff00) correctly', () => {
      const result = hexToHsl('#00ff00');
      expect(result.h).toBe(120);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('converts pure blue (#0000ff) correctly', () => {
      const result = hexToHsl('#0000ff');
      expect(result.h).toBe(240);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('handles hex without # prefix', () => {
      const result = hexToHsl('ff0000');
      expect(result.h).toBe(0);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('converts gray (#808080) as achromatic', () => {
      const result = hexToHsl('#808080');
      expect(result.h).toBe(0);
      expect(result.s).toBe(0);
      expect(result.l).toBe(50);
    });

    it('converts catppuccin mocha base (#1e1e2e) correctly', () => {
      const result = hexToHsl('#1e1e2e');
      expect(result.h).toBe(240);
      expect(result.s).toBe(21);
      expect(result.l).toBe(15);
    });

    it('converts yellow (#ffff00) correctly', () => {
      const result = hexToHsl('#ffff00');
      expect(result.h).toBe(60);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('converts cyan (#00ffff) correctly', () => {
      const result = hexToHsl('#00ffff');
      expect(result.h).toBe(180);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('converts magenta (#ff00ff) correctly', () => {
      const result = hexToHsl('#ff00ff');
      expect(result.h).toBe(300);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });
  });

  describe('generateBulmaConfig', () => {
    it('returns empty string for empty config', () => {
      const result = generateBulmaConfig({});
      expect(result).toBe('');
    });

    it('generates breakpoint variables', () => {
      const config: BulmaConfig = {
        breakpoints: {
          mobile: '320px',
          tablet: '768px',
          desktop: '1024px',
          widescreen: '1216px',
          fullhd: '1408px',
        },
      };
      const result = generateBulmaConfig(config);
      expect(result).toContain('// Custom breakpoints');
      expect(result).toContain('$mobile: 320px;');
      expect(result).toContain('$tablet: 768px;');
      expect(result).toContain('$desktop: 1024px;');
      expect(result).toContain('$widescreen: 1216px;');
      expect(result).toContain('$fullhd: 1408px;');
    });

    it('generates spacing variables', () => {
      const config: BulmaConfig = {
        spacing: {
          small: '0.5rem',
          medium: '1rem',
          large: '2rem',
        },
      };
      const result = generateBulmaConfig(config);
      expect(result).toContain('// Custom spacing scale');
      expect(result).toContain('$spacing-small: 0.5rem;');
      expect(result).toContain('$spacing-medium: 1rem;');
      expect(result).toContain('$spacing-large: 2rem;');
    });

    it('generates size variables', () => {
      const config: BulmaConfig = {
        sizes: {
          small: '0.75rem',
          normal: '1rem',
          medium: '1.25rem',
          large: '1.5rem',
        },
      };
      const result = generateBulmaConfig(config);
      expect(result).toContain('// Custom typography sizes');
      expect(result).toContain('$size-small: 0.75rem;');
      expect(result).toContain('$size-normal: 1rem;');
      expect(result).toContain('$size-medium: 1.25rem;');
      expect(result).toContain('$size-large: 1.5rem;');
    });

    it('generates radius variables', () => {
      const config: BulmaConfig = {
        radius: {
          small: '2px',
          normal: '4px',
          medium: '6px',
          large: '8px',
          rounded: '9999px',
        },
      };
      const result = generateBulmaConfig(config);
      expect(result).toContain('// Custom border radius');
      expect(result).toContain('$radius-small: 2px;');
      expect(result).toContain('$radius: 4px;');
      expect(result).toContain('$radius-medium: 6px;');
      expect(result).toContain('$radius-large: 8px;');
      expect(result).toContain('$radius-rounded: 9999px;');
    });

    it('generates shadow variables', () => {
      const config: BulmaConfig = {
        shadows: {
          small: '0 1px 2px rgba(0,0,0,0.1)',
          normal: '0 2px 4px rgba(0,0,0,0.1)',
          medium: '0 4px 8px rgba(0,0,0,0.1)',
          large: '0 8px 16px rgba(0,0,0,0.1)',
        },
      };
      const result = generateBulmaConfig(config);
      expect(result).toContain('// Custom shadows');
      expect(result).toContain('$shadow-small: 0 1px 2px rgba(0,0,0,0.1);');
      expect(result).toContain('$shadow-normal: 0 2px 4px rgba(0,0,0,0.1);');
      expect(result).toContain('$shadow-medium: 0 4px 8px rgba(0,0,0,0.1);');
      expect(result).toContain('$shadow-large: 0 8px 16px rgba(0,0,0,0.1);');
    });

    it('handles partial breakpoint config', () => {
      const config: BulmaConfig = {
        breakpoints: {
          tablet: '768px',
        },
      };
      const result = generateBulmaConfig(config);
      expect(result).toContain('$tablet: 768px;');
      expect(result).not.toContain('$mobile:');
    });

    it('combines multiple config sections', () => {
      const config: BulmaConfig = {
        breakpoints: { mobile: '320px' },
        spacing: { small: '0.5rem' },
        sizes: { normal: '1rem' },
      };
      const result = generateBulmaConfig(config);
      expect(result).toContain('// Custom breakpoints');
      expect(result).toContain('// Custom spacing scale');
      expect(result).toContain('// Custom typography sizes');
    });
  });

  describe('generateBulmaUse', () => {
    const defaultColors: ThemeColors = {
      primary: '#3273dc',
      link: '#485fc7',
      info: '#3e8ed0',
      success: '#48c78e',
      warning: '#ffe08a',
      danger: '#f14668',
    };

    it('generates @use statement with HSL colors', () => {
      const result = generateBulmaUse(defaultColors);
      expect(result).toContain("@use 'bulma/sass' with (");
      expect(result).toContain('$primary: hsl(');
      expect(result).toContain('$link: hsl(');
      expect(result).toContain('$info: hsl(');
      expect(result).toContain('$success: hsl(');
      expect(result).toContain('$warning: hsl(');
      expect(result).toContain('$danger: hsl(');
    });

    it('converts colors to correct HSL format', () => {
      const colors: ThemeColors = {
        primary: '#ff0000',
        link: '#00ff00',
        info: '#0000ff',
        success: '#ffff00',
        warning: '#00ffff',
        danger: '#ff00ff',
      };
      const result = generateBulmaUse(colors);
      expect(result).toContain('$primary: hsl(0, 100%, 50%)');
      expect(result).toContain('$link: hsl(120, 100%, 50%)');
      expect(result).toContain('$info: hsl(240, 100%, 50%)');
      expect(result).toContain('$success: hsl(60, 100%, 50%)');
      expect(result).toContain('$warning: hsl(180, 100%, 50%)');
      expect(result).toContain('$danger: hsl(300, 100%, 50%)');
    });

    it('includes config when provided', () => {
      const config: BulmaConfig = {
        breakpoints: { tablet: '768px' },
      };
      const result = generateBulmaUse(defaultColors, config);
      expect(result).toContain('$tablet: 768px;');
      expect(result).toContain("@use 'bulma/sass' with (");
    });

    it('prepends config before @use statement', () => {
      const config: BulmaConfig = {
        spacing: { small: '0.5rem' },
      };
      const result = generateBulmaUse(defaultColors, config);
      const configIndex = result.indexOf('$spacing-small');
      const useIndex = result.indexOf("@use 'bulma/sass'");
      expect(configIndex).toBeLessThan(useIndex);
    });

    it('returns only color config when no additional config', () => {
      const result = generateBulmaUse(defaultColors);
      expect(result).not.toContain('// Custom');
      expect(result.startsWith("@use 'bulma/sass'")).toBe(true);
    });

    it('returns only color config when config is empty object', () => {
      const result = generateBulmaUse(defaultColors, {});
      expect(result).not.toContain('// Custom');
      expect(result.startsWith("@use 'bulma/sass'")).toBe(true);
    });
  });
});
