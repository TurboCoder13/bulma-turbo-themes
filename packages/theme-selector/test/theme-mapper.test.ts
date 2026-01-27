// SPDX-License-Identifier: MIT
/**
 * Tests for theme mapper
 */
import { describe, expect, it } from 'vitest';
import { mapFlavorToUI } from '../src/theme-mapper.js';
import type { ThemeFlavor as CanonicalThemeFlavor } from '@lgtm-hq/turbo-themes-core';

describe('theme-mapper', () => {
  const createMockFlavor = (overrides: Partial<CanonicalThemeFlavor>): CanonicalThemeFlavor => {
    return {
      id: 'test-theme',
      label: 'Test Theme',
      vendor: 'bulma',
      appearance: 'light',
      tokens: {
        background: {
          base: '#ffffff',
          surface: '#f5f5f5',
          overlay: '#eeeeee',
        },
        text: {
          primary: '#363636',
          secondary: '#4a4a4a',
          inverse: '#ffffff',
        },
        brand: {
          primary: '#00d1b2',
        },
        state: {
          info: '#3e8ed0',
          success: '#48c78e',
          warning: '#ffe08a',
          danger: '#f14668',
        },
        border: {
          default: '#dbdbdb',
        },
        accent: {
          link: '#485fc7',
        },
        typography: {
          fonts: {
            sans: 'Arial, sans-serif',
            mono: 'Courier, monospace',
          },
          webFonts: [],
        },
        content: {
          heading: {
            h1: '#00d1b2',
            h2: '#485fc7',
            h3: '#3e8ed0',
            h4: '#48c78e',
            h5: '#ffe08a',
            h6: '#f14668',
          },
          body: {
            primary: '#363636',
            secondary: '#4a4a4a',
          },
          link: {
            default: '#485fc7',
          },
          selection: {
            fg: '#363636',
            bg: '#b5d5ff',
          },
          blockquote: {
            border: '#dbdbdb',
            fg: '#4a4a4a',
            bg: '#f5f5f5',
          },
          codeInline: {
            fg: '#f14668',
            bg: '#f5f5f5',
          },
          codeBlock: {
            fg: '#363636',
            bg: '#f5f5f5',
          },
          table: {
            border: '#dbdbdb',
            stripe: '#fafafa',
            theadBg: '#f0f0f0',
          },
        },
      },
      ...overrides,
    };
  };

  describe('mapFlavorToUI', () => {
    it('maps canonical flavor to UI format', () => {
      const canonical = createMockFlavor({});
      const ui = mapFlavorToUI(canonical);

      expect(ui.id).toBe('test-theme');
      expect(ui.name).toBe('Test Theme');
      expect(ui.vendor).toBe('bulma');
      expect(ui.appearance).toBe('light');
      expect(ui.cssFile).toBe('packages/css/dist/themes/test-theme.css');
      expect(ui.family).toBe('bulma');
    });

    it('sets correct family from vendor', () => {
      expect(mapFlavorToUI(createMockFlavor({ vendor: 'bulma' })).family).toBe('bulma');
      expect(mapFlavorToUI(createMockFlavor({ vendor: 'catppuccin' })).family).toBe('catppuccin');
      expect(mapFlavorToUI(createMockFlavor({ vendor: 'github' })).family).toBe('github');
      expect(mapFlavorToUI(createMockFlavor({ vendor: 'dracula' })).family).toBe('dracula');
      expect(mapFlavorToUI(createMockFlavor({ vendor: 'unknown' })).family).toBe('bulma'); // fallback
    });

    it('generates description from id', () => {
      const latte = mapFlavorToUI(createMockFlavor({ id: 'catppuccin-latte', label: 'Latte' }));
      expect(latte.description).toContain('Light, soft Catppuccin');

      const mocha = mapFlavorToUI(createMockFlavor({ id: 'catppuccin-mocha', label: 'Mocha' }));
      expect(mocha.description).toContain('Cozy, high-contrast');

      const unknown = mapFlavorToUI(createMockFlavor({ id: 'unknown-theme', label: 'Unknown' }));
      expect(unknown.description).toBe('Unknown theme');
    });

    it('resolves icon path for vendor', () => {
      const bulma = mapFlavorToUI(createMockFlavor({ vendor: 'bulma' }));
      expect(bulma.icon).toBe('assets/img/turbo-themes-logo.png');

      const catppuccinLight = mapFlavorToUI(
        createMockFlavor({ vendor: 'catppuccin', appearance: 'light' })
      );
      expect(catppuccinLight.icon).toBe('assets/img/catppuccin-logo-latte.png');

      const catppuccinDark = mapFlavorToUI(
        createMockFlavor({ vendor: 'catppuccin', appearance: 'dark' })
      );
      expect(catppuccinDark.icon).toBe('assets/img/catppuccin-logo-macchiato.png');

      const githubLight = mapFlavorToUI(
        createMockFlavor({ vendor: 'github', appearance: 'light' })
      );
      expect(githubLight.icon).toBe('assets/img/github-logo-light.png');

      const githubDark = mapFlavorToUI(
        createMockFlavor({ vendor: 'github', appearance: 'dark' })
      );
      expect(githubDark.icon).toBe('assets/img/github-logo-dark.png');

      const dracula = mapFlavorToUI(createMockFlavor({ vendor: 'dracula' }));
      expect(dracula.icon).toBe('assets/img/dracula-logo.png');
    });

    it('extracts preview colors from tokens', () => {
      const ui = mapFlavorToUI(createMockFlavor({}));

      expect(ui.colors.bg).toBe('#ffffff');
      expect(ui.colors.surface).toBe('#f5f5f5');
      expect(ui.colors.accent).toBe('#00d1b2');
      expect(ui.colors.text).toBe('#363636');
    });

    it('handles undefined icon for unknown vendor', () => {
      const ui = mapFlavorToUI(createMockFlavor({ vendor: 'unknown-vendor' }));
      expect(ui.icon).toBeUndefined();
    });
  });
});
