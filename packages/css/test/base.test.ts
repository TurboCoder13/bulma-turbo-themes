// SPDX-License-Identifier: MIT
import { describe, it, expect } from 'vitest';
import { CSS_RESET, CSS_BASE, generateBaseCss, generateResetCss } from '../src/base.js';

describe('CSS_RESET', () => {
  it('should export a non-empty string', () => {
    expect(typeof CSS_RESET).toBe('string');
    expect(CSS_RESET.length).toBeGreaterThan(0);
  });

  it('should contain box-sizing reset', () => {
    expect(CSS_RESET).toContain('box-sizing: border-box');
  });

  it('should contain margin reset', () => {
    expect(CSS_RESET).toContain('margin: 0');
  });

  it('should contain text-size-adjust properties', () => {
    expect(CSS_RESET).toContain('text-size-adjust: 100%');
  });

  it('should contain min-height for body', () => {
    expect(CSS_RESET).toContain('min-height: 100vh');
  });
});

describe('CSS_BASE', () => {
  it('should export a non-empty string', () => {
    expect(typeof CSS_BASE).toBe('string');
    expect(CSS_BASE.length).toBeGreaterThan(0);
  });

  it('should use turbo CSS variables', () => {
    expect(CSS_BASE).toContain('var(--turbo-');
  });

  it('should include body styling', () => {
    // Variables now include fallbacks, so check for the variable name part
    expect(CSS_BASE).toContain('--turbo-bg-base');
    expect(CSS_BASE).toContain('--turbo-text-primary');
  });

  it('should include heading styles', () => {
    expect(CSS_BASE).toContain('var(--turbo-heading-h1');
    expect(CSS_BASE).toContain('var(--turbo-heading-h6');
  });

  it('should include link styles', () => {
    expect(CSS_BASE).toContain('var(--turbo-accent-link');
    expect(CSS_BASE).toContain('text-decoration: underline');
  });

  it('should include selection styles', () => {
    expect(CSS_BASE).toContain('::selection');
    // Variables now include fallbacks
    expect(CSS_BASE).toContain('--turbo-selection-fg');
    expect(CSS_BASE).toContain('--turbo-selection-bg');
  });

  it('should include code styles', () => {
    // Variables now include fallbacks
    expect(CSS_BASE).toContain('--turbo-code-inline-fg');
    expect(CSS_BASE).toContain('--turbo-code-block-bg');
    expect(CSS_BASE).toContain('--turbo-font-mono');
  });

  it('should include blockquote styles', () => {
    expect(CSS_BASE).toContain('var(--turbo-blockquote-fg)');
    expect(CSS_BASE).toContain('var(--turbo-blockquote-border)');
  });

  it('should include table styles', () => {
    expect(CSS_BASE).toContain('var(--turbo-table-border)');
    expect(CSS_BASE).toContain('var(--turbo-table-thead-bg)');
    expect(CSS_BASE).toContain('var(--turbo-table-stripe)');
  });

  it('should include form element styles', () => {
    expect(CSS_BASE).toContain('var(--turbo-brand-primary)');
    expect(CSS_BASE).toContain('var(--turbo-text-inverse)');
    expect(CSS_BASE).toContain('var(--turbo-border-default)');
  });

  it('should include utility classes', () => {
    expect(CSS_BASE).toContain('.surface');
    expect(CSS_BASE).toContain('.text-primary');
    expect(CSS_BASE).toContain('.text-danger');
    expect(CSS_BASE).toContain('.border');
    expect(CSS_BASE).toContain('.rounded');
  });
});

describe('generateBaseCss', () => {
  it('should return both reset and base styles', () => {
    const result = generateBaseCss();

    expect(result).toContain(CSS_RESET);
    expect(result).toContain(CSS_BASE);
  });

  it('should have reset before base styles', () => {
    const result = generateBaseCss();
    const resetIndex = result.indexOf('Minimal Reset');
    const baseIndex = result.indexOf('Base Semantic Styles');

    expect(resetIndex).toBeLessThan(baseIndex);
  });
});

describe('generateResetCss', () => {
  it('should return only the reset CSS', () => {
    const result = generateResetCss();

    expect(result).toBe(CSS_RESET);
  });
});
