// SPDX-License-Identifier: MIT
/**
 * Optional token CSS generation tests.
 * Tests for optional token handling (spacing, elevation, components, etc.)
 */
import { describe, it, expect } from 'vitest';
import type { ThemeTokens } from '@lgtm-hq/turbo-themes-core';
import { generateCssVarsFromTokens } from '../../src/generator.js';
import { CSS_GENERATOR_MOCK_TOKENS } from '../../../../test/fixtures/tokens.js';

// Use shared fixture for consistent test tokens
const baseMockTokens = CSS_GENERATOR_MOCK_TOKENS;

describe('generateCssVarsFromTokens - optional spacing tokens', () => {
  it('should include spacing tokens when provided', () => {
    const tokensWithSpacing: ThemeTokens = {
      ...baseMockTokens,
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
});

describe('generateCssVarsFromTokens - optional elevation tokens', () => {
  it('should include elevation tokens when provided', () => {
    const tokensWithElevation: ThemeTokens = {
      ...baseMockTokens,
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
});

describe('generateCssVarsFromTokens - optional animation tokens', () => {
  it('should include animation tokens when provided', () => {
    const tokensWithAnimation: ThemeTokens = {
      ...baseMockTokens,
      animation: {
        durationFast: '100ms',
        durationNormal: '200ms',
        durationSlow: '300ms',
        easingDefault: 'ease-out',
        easingEmphasized: 'ease-in-out',
      },
    };
    const lines = generateCssVarsFromTokens(tokensWithAnimation);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-animation-duration-fast: 100ms');
    expect(joined).toContain('--turbo-animation-duration-normal: 200ms');
    expect(joined).toContain('--turbo-animation-duration-slow: 300ms');
    expect(joined).toContain('--turbo-animation-easing-default: ease-out');
    expect(joined).toContain('--turbo-animation-easing-emphasized: ease-in-out');
  });
});

describe('generateCssVarsFromTokens - optional opacity tokens', () => {
  it('should include opacity tokens when provided', () => {
    const tokensWithOpacity: ThemeTokens = {
      ...baseMockTokens,
      opacity: {
        disabled: 0.5,
        hover: 0.8,
        pressed: 0.6,
      },
    };
    const lines = generateCssVarsFromTokens(tokensWithOpacity);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-opacity-disabled: 0.5');
    expect(joined).toContain('--turbo-opacity-hover: 0.8');
    expect(joined).toContain('--turbo-opacity-pressed: 0.6');
  });

  it('should handle opacity value of 0', () => {
    const tokensWithZeroOpacity: ThemeTokens = {
      ...baseMockTokens,
      opacity: {
        disabled: 0,
        hover: 0.8,
        pressed: 0.6,
      },
    };
    const lines = generateCssVarsFromTokens(tokensWithZeroOpacity);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-opacity-disabled: 0');
  });
});

describe('generateCssVarsFromTokens - optional component tokens', () => {
  it('should include component tokens when provided', () => {
    const tokensWithComponents: ThemeTokens = {
      ...baseMockTokens,
      components: {
        card: {
          bg: '#282a36',
          border: '#44475a',
          headerBg: '#383a4a',
          footerBg: '#282a36',
        },
        message: {
          bg: '#282a36',
          headerBg: '#383a4a',
          border: '#44475a',
          bodyFg: '#f8f8f2',
        },
        panel: {
          bg: '#282a36',
          headerBg: '#383a4a',
          headerFg: '#f8f8f2',
          border: '#44475a',
          blockBg: '#282a36',
          blockHoverBg: '#383a4a',
          blockActiveBg: '#44475a',
        },
        box: {
          bg: '#282a36',
          border: '#44475a',
        },
        notification: {
          bg: '#282a36',
          border: '#44475a',
        },
        modal: {
          bg: '#1e1e2e',
          cardBg: '#313244',
          headerBg: '#383a4a',
          footerBg: '#282a36',
        },
        dropdown: {
          bg: '#1e1e2e',
          border: '#45475a',
          itemHoverBg: '#313244',
        },
        tabs: {
          border: '#44475a',
          linkBg: '#282a36',
          linkActiveBg: '#1e1e2e',
          linkHoverBg: '#383a4a',
        },
      },
    };
    const lines = generateCssVarsFromTokens(tokensWithComponents);
    const joined = lines.join('\n');

    expect(joined).toContain('--turbo-card-bg: #282a36');
    expect(joined).toContain('--turbo-card-border: #44475a');
    expect(joined).toContain('--turbo-card-header-bg: #383a4a');
    expect(joined).toContain('--turbo-card-footer-bg: #282a36');
    expect(joined).toContain('--turbo-message-bg: #282a36');
    expect(joined).toContain('--turbo-message-header-bg: #383a4a');
    expect(joined).toContain('--turbo-message-border: #44475a');
    expect(joined).toContain('--turbo-message-body-fg: #f8f8f2');
    expect(joined).toContain('--turbo-panel-bg: #282a36');
    expect(joined).toContain('--turbo-panel-header-bg: #383a4a');
    expect(joined).toContain('--turbo-panel-header-fg: #f8f8f2');
    expect(joined).toContain('--turbo-panel-border: #44475a');
    expect(joined).toContain('--turbo-panel-block-bg: #282a36');
    expect(joined).toContain('--turbo-panel-block-hover-bg: #383a4a');
    expect(joined).toContain('--turbo-panel-block-active-bg: #44475a');
    expect(joined).toContain('--turbo-box-bg: #282a36');
    expect(joined).toContain('--turbo-box-border: #44475a');
    expect(joined).toContain('--turbo-notification-bg: #282a36');
    expect(joined).toContain('--turbo-notification-border: #44475a');
    expect(joined).toContain('--turbo-modal-bg: #1e1e2e');
    expect(joined).toContain('--turbo-modal-card-bg: #313244');
    expect(joined).toContain('--turbo-modal-header-bg: #383a4a');
    expect(joined).toContain('--turbo-modal-footer-bg: #282a36');
    expect(joined).toContain('--turbo-dropdown-bg: #1e1e2e');
    expect(joined).toContain('--turbo-dropdown-border: #45475a');
    expect(joined).toContain('--turbo-dropdown-item-hover: #313244');
    expect(joined).toContain('--turbo-tabs-border: #44475a');
    expect(joined).toContain('--turbo-tabs-link-bg: #282a36');
    expect(joined).toContain('--turbo-tabs-link-active-bg: #1e1e2e');
    expect(joined).toContain('--turbo-tabs-link-hover-bg: #383a4a');
  });

  it('should use fallbacks for missing component properties', () => {
    const tokensWithPartialComponents: ThemeTokens = {
      ...baseMockTokens,
      components: {
        card: { bg: '#282a36' },
        modal: {},
        dropdown: { bg: '#1e1e2e' },
      },
    };
    const lines = generateCssVarsFromTokens(tokensWithPartialComponents);
    const joined = lines.join('\n');

    // Explicit value used when provided
    expect(joined).toContain('--turbo-card-bg: #282a36');
    // Fallback to base tokens when component property is missing
    expect(joined).toContain(`--turbo-card-border: ${baseMockTokens.border.default}`);
    expect(joined).toContain(`--turbo-card-header-bg: ${baseMockTokens.background.overlay}`);
    // Missing component groups fall back entirely
    expect(joined).toContain(`--turbo-message-bg: ${baseMockTokens.background.surface}`);
    expect(joined).toContain(`--turbo-panel-bg: ${baseMockTokens.background.surface}`);
    expect(joined).toContain(`--turbo-tabs-border: ${baseMockTokens.border.default}`);
    // Modal with empty object falls back
    expect(joined).toContain('--turbo-modal-bg: rgba(10, 10, 10, 0.86)');
    expect(joined).toContain(`--turbo-modal-card-bg: ${baseMockTokens.background.surface}`);
  });

  it('should emit component tokens with fallbacks when components is undefined', () => {
    const tokensWithoutComponents: ThemeTokens = {
      ...baseMockTokens,
    };
    delete (tokensWithoutComponents as Partial<ThemeTokens>).components;
    const lines = generateCssVarsFromTokens(tokensWithoutComponents);
    const joined = lines.join('\n');

    // All component CSS variables should be emitted with fallback values
    expect(joined).toContain('--turbo-card-bg:');
    expect(joined).toContain('--turbo-card-border:');
    expect(joined).toContain('--turbo-message-bg:');
    expect(joined).toContain('--turbo-panel-bg:');
    expect(joined).toContain('--turbo-box-bg:');
    expect(joined).toContain('--turbo-notification-bg:');
    expect(joined).toContain('--turbo-modal-bg:');
    expect(joined).toContain('--turbo-dropdown-bg:');
    expect(joined).toContain('--turbo-tabs-border:');

    // Verify fallbacks use base token values
    expect(joined).toContain(`--turbo-card-bg: ${baseMockTokens.background.surface}`);
    expect(joined).toContain(`--turbo-card-border: ${baseMockTokens.border.default}`);
    expect(joined).toContain('--turbo-modal-bg: rgba(10, 10, 10, 0.86)');
  });
});

describe('generateCssVarsFromTokens - missing optional tokens', () => {
  it('should handle tokens without optional accent', () => {
    const tokensWithoutAccent: ThemeTokens = {
      ...baseMockTokens,
      accent: undefined as unknown as typeof baseMockTokens.accent,
    };
    const lines = generateCssVarsFromTokens(tokensWithoutAccent);
    const joined = lines.join('\n');

    expect(joined).not.toContain('--turbo-accent-link');
  });

  it('should handle tokens without optional typography', () => {
    const tokensWithoutTypography: ThemeTokens = {
      ...baseMockTokens,
      typography: undefined as unknown as typeof baseMockTokens.typography,
    };
    const lines = generateCssVarsFromTokens(tokensWithoutTypography);
    const joined = lines.join('\n');

    expect(joined).not.toContain('--turbo-font-sans');
    expect(joined).not.toContain('--turbo-font-mono');
  });

  it('should handle tokens without optional content', () => {
    const tokensWithoutContent: ThemeTokens = {
      ...baseMockTokens,
      content: undefined as unknown as typeof baseMockTokens.content,
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
});

describe('generateCssVarsFromTokens - table token fallbacks', () => {
  it('should handle table tokens with fallbacks for optional cellBg and headerFg', () => {
    const tokensWithMinimalTable: ThemeTokens = {
      ...baseMockTokens,
      content: {
        ...baseMockTokens.content,
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
