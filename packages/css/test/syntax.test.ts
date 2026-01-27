// SPDX-License-Identifier: MIT
import { describe, it, expect } from 'vitest';
import type { ThemeFlavor, ThemeTokens } from '@lgtm-hq/turbo-themes-core';
import {
  CSS_SYNTAX,
  generateSyntaxVarsFromTokens,
  generateSyntaxCss,
  generateSyntaxBaseCss,
} from '../src/syntax.js';

const mockTokens: ThemeTokens = {
  background: {
    base: '#1e1e2e',
    surface: '#313244',
    overlay: '#45475a',
  },
  text: {
    primary: '#cdd6f4',
    secondary: '#a6adc8',
    inverse: '#1e1e2e',
  },
  brand: {
    primary: '#89b4fa',
  },
  state: {
    info: '#89dceb',
    success: '#a6e3a1',
    warning: '#f9e2af',
    danger: '#f38ba8',
  },
  border: {
    default: '#45475a',
  },
  accent: {
    link: '#89dceb',
  },
  typography: {
    fonts: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    webFonts: [],
  },
  content: {
    heading: {
      h1: '#89b4fa',
      h2: '#89b4fa',
      h3: '#89b4fa',
      h4: '#89b4fa',
      h5: '#89b4fa',
      h6: '#89b4fa',
    },
    body: {
      primary: '#cdd6f4',
      secondary: '#a6adc8',
    },
    link: {
      default: '#89dceb',
    },
    selection: {
      fg: '#1e1e2e',
      bg: '#89b4fa',
    },
    blockquote: {
      border: '#89b4fa',
      fg: '#a6adc8',
      bg: '#313244',
    },
    codeInline: {
      fg: '#f38ba8',
      bg: '#313244',
    },
    codeBlock: {
      fg: '#cdd6f4',
      bg: '#1e1e2e',
    },
    table: {
      border: '#45475a',
      stripe: '#313244',
      theadBg: '#45475a',
      cellBg: '#1e1e2e',
      headerFg: '#cdd6f4',
    },
  },
};

const mockFlavor: ThemeFlavor = {
  id: 'test-theme',
  label: 'Test Theme',
  vendor: 'test',
  appearance: 'dark',
  tokens: mockTokens,
};

describe('CSS_SYNTAX', () => {
  it('should export a non-empty string', () => {
    expect(typeof CSS_SYNTAX).toBe('string');
    expect(CSS_SYNTAX.length).toBeGreaterThan(0);
  });

  it('should include highlight container styles', () => {
    expect(CSS_SYNTAX).toContain('.highlight');
    expect(CSS_SYNTAX).toContain('var(--turbo-syntax-bg');
    expect(CSS_SYNTAX).toContain('var(--turbo-syntax-fg');
  });

  it('should include Rouge/Jekyll syntax classes', () => {
    expect(CSS_SYNTAX).toContain('.highlight .c');
    expect(CSS_SYNTAX).toContain('.highlight .k');
    expect(CSS_SYNTAX).toContain('.highlight .s');
    expect(CSS_SYNTAX).toContain('.highlight .m');
  });

  it('should include Prism syntax classes', () => {
    expect(CSS_SYNTAX).toContain('.token.comment');
    expect(CSS_SYNTAX).toContain('.token.keyword');
    expect(CSS_SYNTAX).toContain('.token.string');
    expect(CSS_SYNTAX).toContain('.token.number');
  });

  it('should include highlight.js classes', () => {
    expect(CSS_SYNTAX).toContain('.hljs-comment');
    expect(CSS_SYNTAX).toContain('.hljs-keyword');
    expect(CSS_SYNTAX).toContain('.hljs-string');
    expect(CSS_SYNTAX).toContain('.hljs-number');
  });

  it('should include diff styles', () => {
    expect(CSS_SYNTAX).toContain('.highlight .gd');
    expect(CSS_SYNTAX).toContain('.highlight .gi');
    expect(CSS_SYNTAX).toContain('.token.deleted');
    expect(CSS_SYNTAX).toContain('.token.inserted');
  });

  it('should include selection styles', () => {
    expect(CSS_SYNTAX).toContain('::selection');
  });
});

describe('generateSyntaxVarsFromTokens', () => {
  it('should generate syntax variable declarations', () => {
    const lines = generateSyntaxVarsFromTokens(mockTokens);

    expect(lines).toBeInstanceOf(Array);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('should include all syntax color variables', () => {
    const lines = generateSyntaxVarsFromTokens(mockTokens);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-syntax-fg');
    expect(joined).toContain('--turbo-syntax-bg');
    expect(joined).toContain('--turbo-syntax-comment');
    expect(joined).toContain('--turbo-syntax-keyword');
    expect(joined).toContain('--turbo-syntax-string');
    expect(joined).toContain('--turbo-syntax-number');
    expect(joined).toContain('--turbo-syntax-function');
    expect(joined).toContain('--turbo-syntax-type');
  });

  it('should use code block colors for fg/bg', () => {
    const lines = generateSyntaxVarsFromTokens(mockTokens);
    const joined = lines.join('\n');

    expect(joined).toContain(`--turbo-syntax-fg: ${mockTokens.content.codeBlock.fg}`);
    expect(joined).toContain(`--turbo-syntax-bg: ${mockTokens.content.codeBlock.bg}`);
  });

  it('should map theme tokens to syntax colors', () => {
    const lines = generateSyntaxVarsFromTokens(mockTokens);
    const joined = lines.join('\n');

    expect(joined).toContain(`--turbo-syntax-keyword: ${mockTokens.brand.primary}`);
    expect(joined).toContain(`--turbo-syntax-string: ${mockTokens.state.success}`);
    expect(joined).toContain(`--turbo-syntax-number: ${mockTokens.state.warning}`);
    expect(joined).toContain(`--turbo-syntax-comment: ${mockTokens.text.secondary}`);
  });

  it('should handle tokens without codeBlock content', () => {
    const tokensWithoutCodeBlock: ThemeTokens = {
      ...mockTokens,
      content: {
        ...mockTokens.content,
        codeBlock: undefined as unknown as typeof mockTokens.content.codeBlock,
      },
    };
    const lines = generateSyntaxVarsFromTokens(tokensWithoutCodeBlock);
    const joined = lines.join('\n');

    // Should fallback to text.primary and background.surface
    expect(joined).toContain(`--turbo-syntax-fg: ${tokensWithoutCodeBlock.text.primary}`);
    expect(joined).toContain(`--turbo-syntax-bg: ${tokensWithoutCodeBlock.background.surface}`);
  });
});

describe('generateSyntaxCss', () => {
  it('should generate CSS with data-theme selector', () => {
    const css = generateSyntaxCss(mockFlavor);

    expect(css).toContain('[data-theme="test-theme"]');
  });

  it('should include theme label in comment', () => {
    const css = generateSyntaxCss(mockFlavor);

    expect(css).toContain('Test Theme');
  });

  it('should include syntax variables', () => {
    const css = generateSyntaxCss(mockFlavor);

    expect(css).toContain('--turbo-syntax-fg');
    expect(css).toContain('--turbo-syntax-bg');
  });
});

describe('generateSyntaxBaseCss', () => {
  it('should return the CSS_SYNTAX constant', () => {
    const result = generateSyntaxBaseCss();

    expect(result).toBe(CSS_SYNTAX);
  });
});
