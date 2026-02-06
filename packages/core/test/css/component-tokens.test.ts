import { describe, expect, it } from 'vitest';
import { cssForFlavor } from '../../src/themes/css.js';
import type { ThemeTokens } from '../../src/themes/types.js';
import { createMockFlavor, createMockTokens } from '../../../../test/helpers/mocks.js';

// Component test cases for parametrized testing
const componentTestCases = [
  {
    name: 'card',
    tokens: {
      bg: '#ffffff',
      border: '#cccccc',
      headerBg: '#f0f0f0',
      footerBg: '#f5f5f5',
    },
    expectedVars: [
      '--theme-card-bg:',
      '--theme-card-border:',
      '--theme-card-header-bg:',
      '--theme-card-footer-bg:',
    ],
    expectedComment: '/* Card component tokens */',
  },
  {
    name: 'message',
    tokens: {
      bg: '#f0f8ff',
      headerBg: '#e0f0ff',
      border: '#b0d4ff',
      bodyFg: '#333333',
    },
    expectedVars: [
      '--theme-message-bg:',
      '--theme-message-header-bg:',
      '--theme-message-border:',
      '--theme-message-body-fg:',
    ],
    expectedComment: '/* Message component tokens */',
  },
  {
    name: 'panel',
    tokens: {
      bg: '#ffffff',
      headerBg: '#f5f5f5',
      headerFg: '#333333',
      border: '#dbdbdb',
      blockBg: '#fafafa',
      blockHoverBg: '#f0f0f0',
      blockActiveBg: '#e8e8e8',
    },
    expectedVars: [
      '--theme-panel-bg:',
      '--theme-panel-header-bg:',
      '--theme-panel-header-fg:',
      '--theme-panel-border:',
      '--theme-panel-block-bg:',
      '--theme-panel-block-hover-bg:',
      '--theme-panel-block-active-bg:',
    ],
    expectedComment: '/* Panel component tokens */',
  },
  {
    name: 'dropdown',
    tokens: {
      bg: '#ffffff',
      itemHoverBg: '#f5f5f5',
      border: '#dbdbdb',
    },
    expectedVars: [
      '--theme-dropdown-bg:',
      '--theme-dropdown-item-hover-bg:',
      '--theme-dropdown-border:',
    ],
    expectedComment: '/* Dropdown component tokens */',
  },
  {
    name: 'tabs',
    tokens: {
      border: '#dbdbdb',
      linkBg: '#f5f5f5',
      linkActiveBg: '#ffffff',
      linkHoverBg: '#e8e8e8',
    },
    expectedVars: [
      '--theme-tabs-border:',
      '--theme-tabs-link-bg:',
      '--theme-tabs-link-active-bg:',
      '--theme-tabs-link-hover-bg:',
    ],
    expectedComment: '/* Tabs component tokens */',
  },
];

describe('cssForFlavor - component tokens', () => {
  // Parametrized test for component variable generation
  it.each(componentTestCases)(
    'generates $name component variables',
    ({ name, tokens, expectedVars, expectedComment }) => {
      const mockTokens = createMockTokens();
      mockTokens.components = { [name]: tokens };
      const flavor = createMockFlavor({ tokens: mockTokens });
      const css = cssForFlavor(flavor);

      // Check all expected CSS variables are present
      for (const cssVar of expectedVars) {
        expect(css).toContain(cssVar);
      }

      // Check component comment is present
      expect(css).toContain(expectedComment);
    }
  );

  describe('modal component', () => {
    it('generates modal variables with default fallback for bg', () => {
      const tokens = createMockTokens();
      tokens.components = {
        modal: {
          cardBg: '#ffffff',
          headerBg: '#f5f5f5',
          footerBg: '#f5f5f5',
        },
      };
      const flavor = createMockFlavor({ tokens });
      const css = cssForFlavor(flavor);
      expect(css).toContain('--theme-modal-bg:');
      expect(css).toContain('rgba(10, 10, 10, 0.86)');
      expect(css).toContain('--theme-modal-card-bg:');
      expect(css).toContain('--theme-modal-header-bg:');
      expect(css).toContain('--theme-modal-footer-bg:');
    });

    it('uses custom modal.bg when defined', () => {
      const tokens = createMockTokens();
      tokens.components = {
        modal: {
          bg: 'rgba(0, 0, 0, 0.5)',
          cardBg: '#ffffff',
          headerBg: '#f5f5f5',
          footerBg: '#f5f5f5',
        },
      };
      const flavor = createMockFlavor({ tokens });
      const css = cssForFlavor(flavor);
      expect(css).toContain('--theme-modal-bg: rgba(0, 0, 0, 0.5)');
    });
  });

  describe('box and notification components', () => {
    it('generates box and notification variables', () => {
      const tokens = createMockTokens();
      tokens.components = {
        box: {
          bg: '#ffffff',
          border: '#dbdbdb',
        },
        notification: {
          bg: '#f5f5f5',
          border: '#cccccc',
        },
      };
      const flavor = createMockFlavor({ tokens });
      const css = cssForFlavor(flavor);
      expect(css).toContain('--theme-box-bg:');
      expect(css).toContain('--theme-box-border:');
      expect(css).toContain('--theme-notification-bg:');
      expect(css).toContain('--theme-notification-border:');
    });
  });

  describe('fallback values', () => {
    it('uses fallback values when component property is not defined', () => {
      const tokens = createMockTokens();
      tokens.components = {
        card: {
          bg: '#ffffff',
        },
      };
      const flavor = createMockFlavor({ tokens });
      const css = cssForFlavor(flavor);
      expect(css).toContain('--theme-card-border:');
      expect(css).toMatch(/--theme-card-border:\s*#dbdbdb/);
    });

    it('emits all component variables when components is undefined', () => {
      const tokens = createMockTokens();
      // Explicitly ensure no components section
      delete (tokens as Partial<ThemeTokens>).components;
      const flavor = createMockFlavor({ tokens });
      const css = cssForFlavor(flavor);

      // All component CSS variables should still be emitted with fallback values
      expect(css).toContain('--theme-card-bg:');
      expect(css).toContain('--theme-card-border:');
      expect(css).toContain('--theme-message-bg:');
      expect(css).toContain('--theme-panel-bg:');
      expect(css).toContain('--theme-box-bg:');
      expect(css).toContain('--theme-notification-bg:');
      expect(css).toContain('--theme-modal-bg:');
      expect(css).toContain('--theme-dropdown-bg:');
      expect(css).toContain('--theme-tabs-border:');

      // Verify fallback values from base tokens are used
      expect(css).toMatch(/--theme-card-bg:\s*#f5f5f5/); // background.surface
      expect(css).toMatch(/--theme-card-border:\s*#dbdbdb/); // border.default
      expect(css).toMatch(/--theme-modal-bg:\s*rgba\(10, 10, 10, 0\.86\)/); // hardcoded default
    });
  });
});
