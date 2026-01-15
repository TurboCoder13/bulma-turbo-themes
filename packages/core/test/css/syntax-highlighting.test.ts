import { describe, expect, it } from 'vitest';
import { cssForFlavor } from '../../src/themes/css.js';
import { createMockFlavor } from '../../../../test/helpers/mocks.js';

describe('cssForFlavor - syntax highlighting', () => {
  it('generates syntax highlighting CSS', () => {
    const flavor = createMockFlavor();
    const css = cssForFlavor(flavor);
    expect(css).toContain('.highlight');
    expect(css).toContain('background:');
    expect(css).toContain('color:');
  });

  it('generates syntax class selectors for comments', () => {
    const flavor = createMockFlavor();
    const css = cssForFlavor(flavor);
    expect(css).toContain('.c');
    expect(css).toContain('.cm');
    expect(css).toContain('.c1');
  });

  it('generates syntax class selectors for keywords', () => {
    const flavor = createMockFlavor();
    const css = cssForFlavor(flavor);
    expect(css).toContain('.k');
    expect(css).toContain('.kc');
    expect(css).toContain('.kd');
  });

  it('generates syntax class selectors for strings', () => {
    const flavor = createMockFlavor();
    const css = cssForFlavor(flavor);
    expect(css).toContain('.s');
    expect(css).toContain('.s1');
    expect(css).toContain('.sb');
  });

  it('generates syntax class selectors for numbers', () => {
    const flavor = createMockFlavor();
    const css = cssForFlavor(flavor);
    expect(css).toContain('.m');
    expect(css).toContain('.mi');
    expect(css).toContain('.mf');
  });

  it('generates syntax highlighting variables', () => {
    const flavor = createMockFlavor();
    const css = cssForFlavor(flavor);
    expect(css).toContain('--syntax-fg:');
    expect(css).toContain('--syntax-bg:');
    expect(css).toContain('--syntax-keyword:');
    expect(css).toContain('--syntax-string:');
    expect(css).toContain('--syntax-number:');
    expect(css).toContain('--syntax-comment:');
    expect(css).toContain('--syntax-title:');
    expect(css).toContain('--syntax-attr:');
  });
});
