import { describe, expect, it } from 'vitest';
import { cssForFlavor } from '../../src/themes/css.js';
import { flavors } from '../../src/tokens/index.js';
import { createMockFlavor, createMockTokens } from '../../../../test/helpers/mocks.js';

describe('cssForFlavor - basic generation', () => {
  it('generates CSS with SPDX license header', () => {
    const flavor = createMockFlavor();
    const css = cssForFlavor(flavor);
    expect(css).toContain('/* SPDX-License-Identifier: MIT */');
  });

  it('generates CSS with data-flavor selector', () => {
    const flavor = createMockFlavor({ id: 'my-custom-theme' });
    const css = cssForFlavor(flavor);
    expect(css).toContain("html[data-flavor='my-custom-theme']");
  });

  it.each([
    { appearance: 'light' as const },
    { appearance: 'dark' as const },
  ])('generates color-scheme for $appearance themes', ({ appearance }) => {
    const flavor = createMockFlavor({ appearance });
    const css = cssForFlavor(flavor);
    expect(css).toContain(`color-scheme: ${appearance};`);
  });
});

// Bulma variable category test cases for parametrized testing
const bulmaVariableCases = [
  {
    category: 'scheme',
    expectedVars: [
      '--bulma-body-background-color:',
      '--bulma-body-color:',
      '--bulma-scheme-main:',
      '--bulma-scheme-main-bis:',
      '--bulma-scheme-main-ter:',
      '--bulma-scheme-invert:',
      '--bulma-border:',
    ],
    expectedPattern: null,
  },
  {
    category: 'primary color HSL',
    expectedVars: [
      '--bulma-primary-h:',
      '--bulma-primary-s:',
      '--bulma-primary-l:',
    ],
    expectedPattern: null,
  },
  {
    category: 'state colors',
    expectedVars: [
      '--bulma-link:',
      '--bulma-info:',
      '--bulma-success:',
      '--bulma-warning:',
      '--bulma-danger:',
    ],
    expectedPattern: /--bulma-link:\s*hsl\(/,
  },
];

describe('cssForFlavor - Bulma variables', () => {
  it.each(bulmaVariableCases)(
    'generates Bulma $category variables',
    ({ expectedVars, expectedPattern }) => {
      const flavor = createMockFlavor();
      const css = cssForFlavor(flavor);

      for (const cssVar of expectedVars) {
        expect(css).toContain(cssVar);
      }
      if (expectedPattern) {
        expect(css).toMatch(expectedPattern);
      }
    }
  );
});

// Theme variable category test cases for parametrized testing
const themeVariableCases = [
  {
    category: 'typography font',
    expectedVars: ['--theme-font-sans:', '--theme-font-mono:'],
    expectedValues: ['Inter, sans-serif', 'JetBrains Mono, monospace'],
  },
  {
    category: 'text',
    expectedVars: ['--theme-text:', '--theme-text-muted:'],
    expectedValues: [],
  },
  {
    category: 'heading',
    expectedVars: [
      '--theme-h1:',
      '--theme-h2:',
      '--theme-h3:',
      '--theme-h4:',
      '--theme-h5:',
      '--theme-h6:',
    ],
    expectedValues: [],
  },
  {
    category: 'content element',
    expectedVars: [
      '--theme-link:',
      '--theme-blockquote-border:',
      '--theme-blockquote-fg:',
      '--theme-blockquote-bg:',
      '--theme-code-fg:',
      '--theme-code-bg:',
      '--theme-pre-fg:',
      '--theme-pre-bg:',
      '--theme-selection-fg:',
      '--theme-selection-bg:',
    ],
    expectedValues: [],
  },
  {
    category: 'table',
    expectedVars: [
      '--theme-table-border:',
      '--theme-table-stripe:',
      '--theme-table-thead-bg:',
      '--theme-table-cell-bg:',
      '--theme-table-header-fg:',
    ],
    expectedValues: [],
  },
  {
    category: 'surface',
    expectedVars: [
      '--theme-surface-0:',
      '--theme-surface-1:',
      '--theme-surface-2:',
      '--theme-border:',
    ],
    expectedValues: [],
  },
];

describe('cssForFlavor - theme variables', () => {
  it.each(themeVariableCases)(
    'generates $category variables',
    ({ expectedVars, expectedValues }) => {
      const flavor = createMockFlavor();
      const css = cssForFlavor(flavor);

      for (const cssVar of expectedVars) {
        expect(css).toContain(cssVar);
      }
      for (const value of expectedValues) {
        expect(css).toContain(value);
      }
    }
  );

  it('uses table fallback values when cellBg is not defined', () => {
    const tokens = createMockTokens();
    const flavor = createMockFlavor({ tokens });
    const css = cssForFlavor(flavor);
    expect(css).toContain('--theme-table-cell-bg:');
  });

  it('uses table fallback values when headerFg is not defined', () => {
    const tokens = createMockTokens();
    const flavor = createMockFlavor({ tokens });
    const css = cssForFlavor(flavor);
    expect(css).toContain('--theme-table-header-fg:');
  });
});

describe('cssForFlavor - real flavors', () => {
  it('generates valid CSS for catppuccin-mocha', () => {
    const mocha = flavors.find((f) => f.id === 'catppuccin-mocha');
    expect(mocha).toBeDefined();
    const css = cssForFlavor(mocha!);
    expect(css).toContain("html[data-flavor='catppuccin-mocha']");
    expect(css).toContain('color-scheme: dark;');
    expect(css).toContain('#1e1e2e');
  });

  it('generates valid CSS for github-light', () => {
    const githubLight = flavors.find((f) => f.id === 'github-light');
    expect(githubLight).toBeDefined();
    const css = cssForFlavor(githubLight!);
    expect(css).toContain("html[data-flavor='github-light']");
    expect(css).toContain('color-scheme: light;');
  });

  it.each(flavors.map((f) => [f.id, f] as const))(
    'generates valid CSS for %s',
    (id, flavor) => {
      const css = cssForFlavor(flavor);
      expect(css).toContain('/* SPDX-License-Identifier: MIT */');
      expect(css).toContain(`html[data-flavor='${id}']`);
      expect(css).toContain(`color-scheme: ${flavor.appearance};`);
    }
  );
});
