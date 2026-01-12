import { describe, expect, it } from 'vitest';
import { generateBulmaConfig, generateBulmaUse } from '../src/index.js';
import type { BulmaConfig } from '@turbocoder13/turbo-themes-core/themes/types';

// Test data for config categories - data-driven parametrization
const configCategories = [
  {
    name: 'breakpoints',
    config: {
      breakpoints: {
        mobile: '768px',
        tablet: '1024px',
        desktop: '1216px',
        widescreen: '1408px',
        fullhd: '1600px',
      },
    } as BulmaConfig,
    expectedComment: '// Custom breakpoints',
    expectedVariables: [
      '$mobile: 768px;',
      '$tablet: 1024px;',
      '$desktop: 1216px;',
      '$widescreen: 1408px;',
      '$fullhd: 1600px;',
    ],
  },
  {
    name: 'spacing',
    config: {
      spacing: {
        small: '0.5rem',
        medium: '1rem',
        large: '2rem',
      },
    } as BulmaConfig,
    expectedComment: '// Custom spacing scale',
    expectedVariables: [
      '$spacing-small: 0.5rem;',
      '$spacing-medium: 1rem;',
      '$spacing-large: 2rem;',
    ],
  },
  {
    name: 'sizes',
    config: {
      sizes: {
        small: '0.75rem',
        normal: '1rem',
        medium: '1.25rem',
        large: '1.5rem',
      },
    } as BulmaConfig,
    expectedComment: '// Custom typography sizes',
    expectedVariables: [
      '$size-small: 0.75rem;',
      '$size-normal: 1rem;',
      '$size-medium: 1.25rem;',
      '$size-large: 1.5rem;',
    ],
  },
  {
    name: 'radius',
    config: {
      radius: {
        small: '2px',
        normal: '4px',
        medium: '6px',
        large: '8px',
        rounded: '9999px',
      },
    } as BulmaConfig,
    expectedComment: '// Custom border radius',
    expectedVariables: [
      '$radius-small: 2px;',
      '$radius: 4px;',
      '$radius-medium: 6px;',
      '$radius-large: 8px;',
      '$radius-rounded: 9999px;',
    ],
  },
  {
    name: 'shadows',
    config: {
      shadows: {
        small: '0 1px 2px rgba(0,0,0,0.1)',
        normal: '0 2px 4px rgba(0,0,0,0.1)',
        medium: '0 4px 8px rgba(0,0,0,0.1)',
        large: '0 8px 16px rgba(0,0,0,0.1)',
      },
    } as BulmaConfig,
    expectedComment: '// Custom shadows',
    expectedVariables: [
      '$shadow-small: 0 1px 2px rgba(0,0,0,0.1);',
      '$shadow-normal: 0 2px 4px rgba(0,0,0,0.1);',
      '$shadow-medium: 0 4px 8px rgba(0,0,0,0.1);',
      '$shadow-large: 0 8px 16px rgba(0,0,0,0.1);',
    ],
  },
];

describe('generateBulmaConfig', () => {
  it('returns empty string for empty config', () => {
    const config: BulmaConfig = {};
    expect(generateBulmaConfig(config)).toBe('');
  });

  it.each(configCategories)(
    'generates $name variables',
    ({ config, expectedComment, expectedVariables }) => {
      const output = generateBulmaConfig(config);
      expect(output).toContain(expectedComment);
      expectedVariables.forEach((variable) => {
        expect(output).toContain(variable);
      });
    }
  );

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

  it.each([
    { colorName: 'primary', invalidValue: undefined },
    { colorName: 'link', invalidValue: null },
  ])('throws error when $colorName is $invalidValue', ({ colorName, invalidValue }) => {
    const invalidColors = {
      ...defaultColors,
      [colorName]: invalidValue as unknown as string,
    };
    expect(() => generateBulmaUse(invalidColors)).toThrow('Invalid theme colors');
  });

  it('handles malformed hex gracefully (returns NaN HSL values)', () => {
    // Note: Invalid hex strings like '#GGG' or 'not-a-hex' don't throw errors
    // They result in NaN values in the output. This test documents current behavior.
    const malformedColors = {
      ...defaultColors,
      info: 'not-a-hex',
    };
    const output = generateBulmaUse(malformedColors);
    // The output will contain NaN values - this is expected current behavior
    expect(output).toContain('$info: hsl(NaN');
  });
});
