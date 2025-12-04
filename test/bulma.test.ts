import { describe, it, expect } from 'vitest';
import { generateBulmaConfig, generateBulmaUse } from '../src/themes/bulma';
import type { BulmaConfig } from '../src/themes/types';

describe('generateBulmaConfig', () => {
  it('returns empty string for empty config', () => {
    const config: BulmaConfig = {};
    expect(generateBulmaConfig(config)).toBe('');
  });

  it('generates breakpoint variables', () => {
    const config: BulmaConfig = {
      breakpoints: {
        mobile: '768px',
        tablet: '1024px',
        desktop: '1216px',
        widescreen: '1408px',
        fullhd: '1600px',
      },
    };
    const output = generateBulmaConfig(config);
    expect(output).toContain('// Custom breakpoints');
    expect(output).toContain('$mobile: 768px;');
    expect(output).toContain('$tablet: 1024px;');
    expect(output).toContain('$desktop: 1216px;');
    expect(output).toContain('$widescreen: 1408px;');
    expect(output).toContain('$fullhd: 1600px;');
  });

  it('generates spacing variables', () => {
    const config: BulmaConfig = {
      spacing: {
        small: '0.5rem',
        medium: '1rem',
        large: '2rem',
      },
    };
    const output = generateBulmaConfig(config);
    expect(output).toContain('// Custom spacing scale');
    expect(output).toContain('$spacing-small: 0.5rem;');
    expect(output).toContain('$spacing-medium: 1rem;');
    expect(output).toContain('$spacing-large: 2rem;');
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
    const output = generateBulmaConfig(config);
    expect(output).toContain('// Custom typography sizes');
    expect(output).toContain('$size-small: 0.75rem;');
    expect(output).toContain('$size-normal: 1rem;');
    expect(output).toContain('$size-medium: 1.25rem;');
    expect(output).toContain('$size-large: 1.5rem;');
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
    const output = generateBulmaConfig(config);
    expect(output).toContain('// Custom border radius');
    expect(output).toContain('$radius-small: 2px;');
    expect(output).toContain('$radius: 4px;');
    expect(output).toContain('$radius-medium: 6px;');
    expect(output).toContain('$radius-large: 8px;');
    expect(output).toContain('$radius-rounded: 9999px;');
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
    const output = generateBulmaConfig(config);
    expect(output).toContain('// Custom shadows');
    expect(output).toContain('$shadow-small: 0 1px 2px rgba(0,0,0,0.1);');
    expect(output).toContain('$shadow-normal: 0 2px 4px rgba(0,0,0,0.1);');
    expect(output).toContain('$shadow-medium: 0 4px 8px rgba(0,0,0,0.1);');
    expect(output).toContain('$shadow-large: 0 8px 16px rgba(0,0,0,0.1);');
  });

  it('handles partial config', () => {
    const config: BulmaConfig = {
      breakpoints: {
        mobile: '768px',
      },
      radius: {
        small: '2px',
      },
    };
    const output = generateBulmaConfig(config);
    expect(output).toContain('$mobile: 768px;');
    expect(output).toContain('$radius-small: 2px;');
    expect(output).not.toContain('$tablet:');
    expect(output).not.toContain('$radius:');
  });
});

describe('generateBulmaUse', () => {
  const defaultColors = {
    primary: '#89b4fa',
    link: '#89b4fa',
    info: '#74c7ec',
    success: '#a6e3a1',
    warning: '#f9e2af',
    danger: '#f38ba8',
  };

  it('returns basic use statement for empty config', () => {
    const output = generateBulmaUse(defaultColors);
    expect(output).toContain("@use 'bulma/sass' with (");
    expect(output).toContain('$primary: hsl(');
    expect(output).toContain('$link: hsl(');
    expect(output).toContain('$info: hsl(');
    expect(output).toContain('$success: hsl(');
    expect(output).toContain('$warning: hsl(');
    expect(output).toContain('$danger: hsl(');
  });

  it('includes config variables before use statement', () => {
    const config: BulmaConfig = {
      breakpoints: { mobile: '768px' },
    };
    const output = generateBulmaUse(defaultColors, config);
    expect(output).toContain('$mobile: 768px;');
    expect(output).toContain("@use 'bulma/sass' with (");
    expect(output).toContain('$primary: hsl(');
  });
});
