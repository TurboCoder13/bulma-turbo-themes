// SPDX-License-Identifier: MIT
import { describe, it, expect } from 'vitest';
import type { ThemeFlavor, ThemeTokens } from '@turbocoder13/turbo-themes-core';
import {
  CSS_VAR_PREFIX,
  generateCssVarsFromTokens,
  generateThemeCss,
  generateCoreCss,
  generateCombinedCss,
} from '../src/generator.js';
import { CSS_GENERATOR_MOCK_TOKENS } from '../../../test/fixtures/tokens.js';

// Use shared fixture for consistent test tokens
const mockTokens = CSS_GENERATOR_MOCK_TOKENS;

const mockFlavor: ThemeFlavor = {
  id: 'test-theme',
  label: 'Test Theme',
  vendor: 'test',
  appearance: 'dark',
  tokens: mockTokens,
};

describe('CSS_VAR_PREFIX', () => {
  it('should be "turbo"', () => {
    expect(CSS_VAR_PREFIX).toBe('turbo');
  });
});

describe('generateCssVarsFromTokens', () => {
  it('should generate CSS variable declarations', () => {
    const lines = generateCssVarsFromTokens(mockTokens);

    expect(lines).toBeInstanceOf(Array);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('should include background tokens', () => {
    const lines = generateCssVarsFromTokens(mockTokens);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-bg-base: #1e1e2e');
    expect(joined).toContain('--turbo-bg-surface: #313244');
    expect(joined).toContain('--turbo-bg-overlay: #45475a');
  });

  it('should include text tokens', () => {
    const lines = generateCssVarsFromTokens(mockTokens);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-text-primary: #cdd6f4');
    expect(joined).toContain('--turbo-text-secondary: #a6adc8');
    expect(joined).toContain('--turbo-text-inverse: #1e1e2e');
  });

  it('should include brand tokens', () => {
    const lines = generateCssVarsFromTokens(mockTokens);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-brand-primary: #89b4fa');
  });

  it('should include state tokens', () => {
    const lines = generateCssVarsFromTokens(mockTokens);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-state-info: #89dceb');
    expect(joined).toContain('--turbo-state-success: #a6e3a1');
    expect(joined).toContain('--turbo-state-warning: #f9e2af');
    expect(joined).toContain('--turbo-state-danger: #f38ba8');
  });

  it('should include heading tokens', () => {
    const lines = generateCssVarsFromTokens(mockTokens);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-heading-h1: #89b4fa');
    expect(joined).toContain('--turbo-heading-h6: #89b4fa');
  });

  it('should include code tokens', () => {
    const lines = generateCssVarsFromTokens(mockTokens);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-code-inline-fg: #f38ba8');
    expect(joined).toContain('--turbo-code-block-bg: #1e1e2e');
  });
});

describe('generateThemeCss', () => {
  it('should generate CSS with data-theme selector', () => {
    const css = generateThemeCss(mockFlavor);

    expect(css).toContain('[data-theme="test-theme"]');
    expect(css).toContain('--turbo-bg-base: #1e1e2e');
  });

  it('should include color-scheme for dark themes', () => {
    const css = generateThemeCss(mockFlavor);

    expect(css).toContain('color-scheme: dark');
  });

  it('should include color-scheme for light themes', () => {
    const lightFlavor: ThemeFlavor = {
      ...mockFlavor,
      id: 'light-theme',
      appearance: 'light',
    };
    const css = generateThemeCss(lightFlavor);

    expect(css).toContain('color-scheme: light');
  });

  it('should include web font imports if provided', () => {
    const flavorWithFonts: ThemeFlavor = {
      ...mockFlavor,
      tokens: {
        ...mockTokens,
        typography: {
          ...mockTokens.typography,
          webFonts: ['https://fonts.googleapis.com/css2?family=Inter'],
        },
      },
    };
    const css = generateThemeCss(flavorWithFonts);

    expect(css).toContain("@import url('https://fonts.googleapis.com/css2?family=Inter')");
  });

  it('should reject HTTP font URLs (non-HTTPS)', () => {
    const flavorWithHttpFont: ThemeFlavor = {
      ...mockFlavor,
      tokens: {
        ...mockTokens,
        typography: {
          ...mockTokens.typography,
          webFonts: ['http://fonts.googleapis.com/css2?family=Inter'],
        },
      },
    };
    const css = generateThemeCss(flavorWithHttpFont);

    expect(css).not.toContain('@import');
  });

  it('should reject font URLs from untrusted domains', () => {
    const flavorWithUntrustedFont: ThemeFlavor = {
      ...mockFlavor,
      tokens: {
        ...mockTokens,
        typography: {
          ...mockTokens.typography,
          webFonts: ['https://malicious-domain.com/evil-font.css'],
        },
      },
    };
    const css = generateThemeCss(flavorWithUntrustedFont);

    expect(css).not.toContain('@import');
  });

  it('should reject invalid font URLs', () => {
    const flavorWithInvalidFont: ThemeFlavor = {
      ...mockFlavor,
      tokens: {
        ...mockTokens,
        typography: {
          ...mockTokens.typography,
          webFonts: ['not-a-valid-url'],
        },
      },
    };
    const css = generateThemeCss(flavorWithInvalidFont);

    expect(css).not.toContain('@import');
  });

  it('should accept fonts from trusted subdomains', () => {
    const flavorWithSubdomainFont: ThemeFlavor = {
      ...mockFlavor,
      tokens: {
        ...mockTokens,
        typography: {
          ...mockTokens.typography,
          webFonts: ['https://fonts.bunny.net/css?family=Inter'],
        },
      },
    };
    const css = generateThemeCss(flavorWithSubdomainFont);

    expect(css).toContain("@import url('https://fonts.bunny.net/css?family=Inter')");
  });
});

describe('generateCoreCss', () => {
  it('should generate CSS with :root selector', () => {
    const css = generateCoreCss(mockFlavor);

    expect(css).toContain(':root {');
    expect(css).toContain('--turbo-bg-base: #1e1e2e');
  });

  it('should not include data-theme selector', () => {
    const css = generateCoreCss(mockFlavor);

    expect(css).not.toContain('data-theme');
  });
});

describe('generateCssVarsFromTokens - optional tokens', () => {
  it('should include spacing tokens when provided', () => {
    const tokensWithSpacing: ThemeTokens = {
      ...mockTokens,
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
    };
    const lines = generateCssVarsFromTokens(tokensWithSpacing);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-spacing-xs: 0.25rem');
    expect(joined).toContain('--turbo-spacing-sm: 0.5rem');
    expect(joined).toContain('--turbo-spacing-md: 1rem');
    expect(joined).toContain('--turbo-spacing-lg: 1.5rem');
    expect(joined).toContain('--turbo-spacing-xl: 2rem');
  });

  it('should include elevation tokens when provided', () => {
    const tokensWithElevation: ThemeTokens = {
      ...mockTokens,
      elevation: {
        none: 'none',
        sm: '0 1px 2px rgba(0,0,0,0.1)',
        md: '0 2px 4px rgba(0,0,0,0.15)',
        lg: '0 4px 8px rgba(0,0,0,0.2)',
        xl: '0 8px 16px rgba(0,0,0,0.25)',
      },
    };
    const lines = generateCssVarsFromTokens(tokensWithElevation);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-elevation-none: none');
    expect(joined).toContain('--turbo-elevation-sm:');
    expect(joined).toContain('--turbo-elevation-md:');
    expect(joined).toContain('--turbo-elevation-lg:');
    expect(joined).toContain('--turbo-elevation-xl:');
  });

  it('should include component tokens when provided', () => {
    const tokensWithComponents: ThemeTokens = {
      ...mockTokens,
      components: {
        card: {
          bg: '#282a36',
          border: '#44475a',
        },
        modal: {
          bg: '#1e1e2e',
          cardBg: '#313244',
        },
        dropdown: {
          bg: '#1e1e2e',
          border: '#45475a',
          itemHoverBg: '#313244',
        },
      },
    };
    const lines = generateCssVarsFromTokens(tokensWithComponents);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-card-bg: #282a36');
    expect(joined).toContain('--turbo-card-border: #44475a');
    expect(joined).toContain('--turbo-modal-bg: #1e1e2e');
    expect(joined).toContain('--turbo-modal-card-bg: #313244');
    expect(joined).toContain('--turbo-dropdown-bg: #1e1e2e');
    expect(joined).toContain('--turbo-dropdown-border: #45475a');
    expect(joined).toContain('--turbo-dropdown-item-hover: #313244');
  });

  it('should handle tokens without optional accent', () => {
    const tokensWithoutAccent: ThemeTokens = {
      ...mockTokens,
      accent: undefined as unknown as typeof mockTokens.accent,
    };
    const lines = generateCssVarsFromTokens(tokensWithoutAccent);
    const joined = lines.join('\n');

    expect(joined).not.toContain('--turbo-accent-link');
  });

  it('should handle tokens without optional typography', () => {
    const tokensWithoutTypography: ThemeTokens = {
      ...mockTokens,
      typography: undefined as unknown as typeof mockTokens.typography,
    };
    const lines = generateCssVarsFromTokens(tokensWithoutTypography);
    const joined = lines.join('\n');

    expect(joined).not.toContain('--turbo-font-sans');
    expect(joined).not.toContain('--turbo-font-mono');
  });

  it('should handle tokens without optional content', () => {
    const tokensWithoutContent: ThemeTokens = {
      ...mockTokens,
      content: undefined as unknown as typeof mockTokens.content,
    };
    const lines = generateCssVarsFromTokens(tokensWithoutContent);
    const joined = lines.join('\n');

    expect(joined).not.toContain('--turbo-heading-h1');
    expect(joined).not.toContain('--turbo-body-primary');
    expect(joined).not.toContain('--turbo-link-default');
    expect(joined).not.toContain('--turbo-selection-fg');
    expect(joined).not.toContain('--turbo-blockquote-border');
    expect(joined).not.toContain('--turbo-code-inline-fg');
    expect(joined).not.toContain('--turbo-table-border');
  });

  it('should handle table tokens with fallbacks for optional cellBg and headerFg', () => {
    const tokensWithMinimalTable: ThemeTokens = {
      ...mockTokens,
      content: {
        ...mockTokens.content,
        table: {
          border: '#45475a',
          stripe: '#313244',
          theadBg: '#45475a',
        },
      },
    };
    const lines = generateCssVarsFromTokens(tokensWithMinimalTable);
    const joined = lines.join('\n');

    // Core table tokens should be present
    expect(joined).toContain('--turbo-table-border');
    expect(joined).toContain('--turbo-table-stripe');
    expect(joined).toContain('--turbo-table-thead-bg');

    // Fallback values should be used when specific table tokens are missing
    // table-cell-bg falls back to background.base
    expect(joined).toContain('--turbo-table-cell-bg: #1e1e2e');
    // table-header-fg falls back to text.primary
    expect(joined).toContain('--turbo-table-header-fg: #cdd6f4');
  });
});

describe('generateCombinedCss', () => {
  const flavors = [
    mockFlavor,
    { ...mockFlavor, id: 'second-theme', label: 'Second Theme' },
  ];

  it('should include header comment', () => {
    const css = generateCombinedCss(flavors, 'test-theme');

    expect(css).toContain('Turbo Themes');
    expect(css).toContain('do not edit');
  });

  it('should include :root with default theme', () => {
    const css = generateCombinedCss(flavors, 'test-theme');

    expect(css).toContain(':root {');
  });

  it('should include all theme selectors', () => {
    const css = generateCombinedCss(flavors, 'test-theme');

    expect(css).toContain('[data-theme="test-theme"]');
    expect(css).toContain('[data-theme="second-theme"]');
  });

  it('should throw if no flavors provided', () => {
    expect(() => generateCombinedCss([], 'test-theme')).toThrow('No flavors provided');
  });

  it('should use first flavor as default if specified default not found', () => {
    const css = generateCombinedCss(flavors, 'nonexistent');

    expect(css).toContain(':root {');
  });
});
