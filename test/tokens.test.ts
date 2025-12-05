import { describe, it, expect, vi } from 'vitest';
import {
  flavors,
  packages,
  themesById,
  getTheme,
  getTokens,
  getThemesByAppearance,
  getThemesByVendor,
  themeIds,
  vendors,
} from '../src/tokens/index';
import {
  flattenTokens,
  getColorPalette,
  palettes,
  createBaseStyles,
  createStateStyles,
  spacing,
  typography,
  borderRadius,
  shadows,
  getDefaultThemeForAppearance,
  DEFAULT_LIGHT_THEME,
  DEFAULT_DARK_THEME,
  useThemeColors,
  useThemeStyles,
  useThemeData,
  useThemeTokens,
  useTheme,
  useSystemAppearance,
  useAutoTheme,
  getThemeForAppearance,
  getAvailableThemesForAppearance,
} from '../src/tokens/react-native';
import { renderHook } from '@testing-library/react';

describe('tokens/index', () => {
  describe('flavors', () => {
    it('exports an array of theme flavors', () => {
      expect(Array.isArray(flavors)).toBe(true);
      expect(flavors.length).toBeGreaterThan(0);
    });

    it('each flavor has required properties', () => {
      flavors.forEach((flavor) => {
        expect(flavor).toHaveProperty('id');
        expect(flavor).toHaveProperty('label');
        expect(flavor).toHaveProperty('vendor');
        expect(flavor).toHaveProperty('appearance');
        expect(flavor).toHaveProperty('tokens');
        expect(['light', 'dark']).toContain(flavor.appearance);
      });
    });

    it('each flavor has complete tokens', () => {
      flavors.forEach((flavor) => {
        const { tokens } = flavor;
        expect(tokens).toHaveProperty('background');
        expect(tokens).toHaveProperty('text');
        expect(tokens).toHaveProperty('brand');
        expect(tokens).toHaveProperty('state');
        expect(tokens).toHaveProperty('border');
        expect(tokens).toHaveProperty('accent');
        expect(tokens).toHaveProperty('typography');
        expect(tokens).toHaveProperty('content');
      });
    });
  });

  describe('packages', () => {
    it('exports theme packages', () => {
      expect(packages).toHaveProperty('bulma');
      expect(packages).toHaveProperty('catppuccin');
      expect(packages).toHaveProperty('dracula');
      expect(packages).toHaveProperty('github');
    });

    it('each package has required properties', () => {
      Object.values(packages).forEach((pkg) => {
        expect(pkg).toHaveProperty('id');
        expect(pkg).toHaveProperty('name');
        expect(pkg).toHaveProperty('homepage');
        expect(pkg).toHaveProperty('flavors');
        expect(Array.isArray(pkg.flavors)).toBe(true);
      });
    });
  });

  describe('themesById', () => {
    it('indexes all themes by ID', () => {
      expect(Object.keys(themesById).length).toBe(flavors.length);
      flavors.forEach((flavor) => {
        expect(themesById[flavor.id]).toBe(flavor);
      });
    });
  });

  describe('getTheme', () => {
    it('returns a theme by ID', () => {
      const theme = getTheme('catppuccin-mocha');
      expect(theme).toBeDefined();
      expect(theme?.id).toBe('catppuccin-mocha');
    });

    it('returns undefined for unknown ID', () => {
      const theme = getTheme('nonexistent-theme');
      expect(theme).toBeUndefined();
    });
  });

  describe('getTokens', () => {
    it('returns tokens by theme ID', () => {
      const tokens = getTokens('catppuccin-mocha');
      expect(tokens).toBeDefined();
      expect(tokens?.background.base).toBe('#1e1e2e');
    });

    it('returns undefined for unknown ID', () => {
      const tokens = getTokens('nonexistent-theme');
      expect(tokens).toBeUndefined();
    });
  });

  describe('getThemesByAppearance', () => {
    it('filters themes by light appearance', () => {
      const lightThemes = getThemesByAppearance('light');
      expect(lightThemes.length).toBeGreaterThan(0);
      lightThemes.forEach((theme) => {
        expect(theme.appearance).toBe('light');
      });
    });

    it('filters themes by dark appearance', () => {
      const darkThemes = getThemesByAppearance('dark');
      expect(darkThemes.length).toBeGreaterThan(0);
      darkThemes.forEach((theme) => {
        expect(theme.appearance).toBe('dark');
      });
    });
  });

  describe('getThemesByVendor', () => {
    it('filters themes by vendor', () => {
      const catppuccinThemes = getThemesByVendor('catppuccin');
      expect(catppuccinThemes.length).toBeGreaterThan(0);
      catppuccinThemes.forEach((theme) => {
        expect(theme.vendor).toBe('catppuccin');
      });
    });

    it('returns empty array for unknown vendor', () => {
      const themes = getThemesByVendor('nonexistent-vendor');
      expect(themes).toEqual([]);
    });
  });

  describe('themeIds', () => {
    it('lists all theme IDs', () => {
      expect(Array.isArray(themeIds)).toBe(true);
      expect(themeIds.length).toBe(flavors.length);
      expect(themeIds).toContain('catppuccin-mocha');
    });
  });

  describe('vendors', () => {
    it('lists all unique vendors', () => {
      expect(Array.isArray(vendors)).toBe(true);
      expect(vendors).toContain('catppuccin');
      expect(vendors).toContain('github');
      // Should be unique
      expect(new Set(vendors).size).toBe(vendors.length);
    });
  });
});

describe('tokens/react-native/colors', () => {
  describe('flattenTokens', () => {
    it('flattens nested tokens to a flat palette', () => {
      const theme = getTheme('catppuccin-mocha');
      expect(theme).toBeDefined();
      const palette = flattenTokens(theme!.tokens);

      expect(palette.backgroundBase).toBe('#1e1e2e');
      expect(palette.textPrimary).toBe('#cdd6f4');
      expect(palette.brandPrimary).toBe('#89b4fa');
      expect(palette.stateSuccess).toBe('#a6e3a1');
    });
  });

  describe('getColorPalette', () => {
    it('returns flat palette for valid theme ID', () => {
      const palette = getColorPalette('catppuccin-mocha');
      expect(palette).toBeDefined();
      expect(palette?.backgroundBase).toBe('#1e1e2e');
    });

    it('returns undefined for invalid theme ID', () => {
      const palette = getColorPalette('nonexistent');
      expect(palette).toBeUndefined();
    });
  });

  describe('palettes', () => {
    it('contains pre-built palettes for all themes', () => {
      expect(Object.keys(palettes).length).toBe(flavors.length);
      flavors.forEach((flavor) => {
        expect(palettes[flavor.id]).toBeDefined();
      });
    });
  });
});

describe('tokens/react-native/styles', () => {
  describe('spacing', () => {
    it('exports spacing tokens', () => {
      expect(spacing.xs).toBe(4);
      expect(spacing.sm).toBe(8);
      expect(spacing.md).toBe(16);
      expect(spacing.lg).toBe(24);
      expect(spacing.xl).toBe(32);
      expect(spacing.xxl).toBe(48);
    });
  });

  describe('typography', () => {
    it('exports typography scale', () => {
      expect(typography.h1.fontSize).toBe(32);
      expect(typography.body.fontSize).toBe(16);
      expect(typography.caption.fontSize).toBe(12);
    });
  });

  describe('borderRadius', () => {
    it('exports border radius tokens', () => {
      expect(borderRadius.none).toBe(0);
      expect(borderRadius.md).toBe(8);
      expect(borderRadius.full).toBe(9999);
    });
  });

  describe('shadows', () => {
    it('exports shadow presets', () => {
      expect(shadows.none.elevation).toBe(0);
      expect(shadows.sm.elevation).toBe(2);
      expect(shadows.lg.elevation).toBe(8);
    });
  });

  describe('createBaseStyles', () => {
    it('creates base styles for valid theme', () => {
      const styles = createBaseStyles('catppuccin-mocha');
      expect(styles).toBeDefined();
      expect(styles?.container.backgroundColor).toBe('#1e1e2e');
      expect(styles?.text.color).toBe('#cdd6f4');
      expect(styles?.button.backgroundColor).toBe('#89b4fa');
    });

    it('returns undefined for invalid theme', () => {
      const styles = createBaseStyles('nonexistent');
      expect(styles).toBeUndefined();
    });

    it('extracts font family from tokens', () => {
      const styles = createBaseStyles('catppuccin-mocha');
      expect(styles?.text.fontFamily).toBe('Inter');
    });

    it('includes typography styles', () => {
      const styles = createBaseStyles('catppuccin-mocha');
      expect(styles?.h1.fontSize).toBe(32);
      expect(styles?.h1.fontWeight).toBe('bold');
      expect(styles?.caption.fontSize).toBe(12);
    });

    it('includes component styles', () => {
      const styles = createBaseStyles('catppuccin-mocha');
      expect(styles?.card.borderRadius).toBe(8);
      expect(styles?.badge.borderRadius).toBe(9999);
      expect(styles?.listItem.flexDirection).toBe('row');
    });
  });

  describe('createStateStyles', () => {
    it('creates state-specific styles', () => {
      const states = createStateStyles('catppuccin-mocha');
      expect(states).toBeDefined();
      expect(states?.successBg.backgroundColor).toBe('#a6e3a1');
      expect(states?.dangerText.color).toBeDefined();
    });

    it('returns undefined for invalid theme', () => {
      const states = createStateStyles('nonexistent');
      expect(states).toBeUndefined();
    });
  });
});

describe('tokens/react-native/ThemeProvider', () => {
  describe('constants', () => {
    it('exports default themes', () => {
      expect(DEFAULT_LIGHT_THEME).toBe('catppuccin-latte');
      expect(DEFAULT_DARK_THEME).toBe('catppuccin-mocha');
    });
  });

  describe('getDefaultThemeForAppearance', () => {
    it('returns light theme for light appearance', () => {
      const theme = getDefaultThemeForAppearance('light');
      expect(theme).toBe('catppuccin-latte');
    });

    it('returns dark theme for dark appearance', () => {
      const theme = getDefaultThemeForAppearance('dark');
      expect(theme).toBe('catppuccin-mocha');
    });

    it('allows custom theme overrides', () => {
      const theme = getDefaultThemeForAppearance(
        'dark',
        'github-light',
        'github-dark'
      );
      expect(theme).toBe('github-dark');
    });
  });
});

describe('tokens/react-native/useTheme hooks', () => {
  describe('useThemeColors', () => {
    it('returns colors for a valid theme', () => {
      const { result } = renderHook(() => useThemeColors('catppuccin-mocha'));
      expect(result.current.backgroundBase).toBe('#1e1e2e');
      expect(result.current.textPrimary).toBe('#cdd6f4');
    });

    it('falls back to default theme for invalid theme', () => {
      const { result } = renderHook(() => useThemeColors('nonexistent'));
      expect(result.current.backgroundBase).toBe('#1e1e2e');
    });
  });

  describe('useThemeStyles', () => {
    it('returns styles for a valid theme', () => {
      const { result } = renderHook(() => useThemeStyles('catppuccin-mocha'));
      expect(result.current.container.backgroundColor).toBe('#1e1e2e');
    });

    it('falls back to default theme for invalid theme', () => {
      const { result } = renderHook(() => useThemeStyles('nonexistent'));
      expect(result.current.container.backgroundColor).toBe('#1e1e2e');
    });
  });

  describe('useThemeData', () => {
    it('returns theme data for a valid theme', () => {
      const { result } = renderHook(() => useThemeData('catppuccin-mocha'));
      expect(result.current.id).toBe('catppuccin-mocha');
      expect(result.current.appearance).toBe('dark');
    });

    it('falls back to default theme for invalid theme', () => {
      const { result } = renderHook(() => useThemeData('nonexistent'));
      expect(result.current.id).toBe('catppuccin-mocha');
    });
  });

  describe('useThemeTokens', () => {
    it('returns tokens for a valid theme', () => {
      const { result } = renderHook(() => useThemeTokens('catppuccin-mocha'));
      expect(result.current.background.base).toBe('#1e1e2e');
    });
  });

  describe('useTheme', () => {
    it('returns combined theme data', () => {
      const { result } = renderHook(() => useTheme('catppuccin-mocha'));
      expect(result.current.theme.id).toBe('catppuccin-mocha');
      expect(result.current.colors.backgroundBase).toBe('#1e1e2e');
      expect(result.current.styles.container.backgroundColor).toBe('#1e1e2e');
      expect(result.current.tokens.background.base).toBe('#1e1e2e');
    });
  });
});

describe('tokens/react-native/useSystemAppearance', () => {
  describe('useSystemAppearance', () => {
    it('returns dark as fallback when no hook provided', () => {
      const { result } = renderHook(() => useSystemAppearance());
      expect(result.current).toBe('dark');
    });

    it('returns light when hook returns light', () => {
      const mockColorScheme = vi.fn(() => 'light' as const);
      const { result } = renderHook(() => useSystemAppearance(mockColorScheme));
      expect(result.current).toBe('light');
    });

    it('returns dark when hook returns dark', () => {
      const mockColorScheme = vi.fn(() => 'dark' as const);
      const { result } = renderHook(() => useSystemAppearance(mockColorScheme));
      expect(result.current).toBe('dark');
    });

    it('uses fallback when hook returns null', () => {
      const mockColorScheme = vi.fn(() => null);
      const { result } = renderHook(() =>
        useSystemAppearance(mockColorScheme, 'light')
      );
      expect(result.current).toBe('light');
    });

    it('uses fallback when hook returns undefined', () => {
      const mockColorScheme = vi.fn(() => undefined);
      const { result } = renderHook(() =>
        useSystemAppearance(mockColorScheme, 'dark')
      );
      expect(result.current).toBe('dark');
    });
  });

  describe('getThemeForAppearance', () => {
    it('returns default themes', () => {
      expect(getThemeForAppearance('light')).toBe('catppuccin-latte');
      expect(getThemeForAppearance('dark')).toBe('catppuccin-mocha');
    });

    it('allows custom theme options', () => {
      expect(
        getThemeForAppearance('light', {
          light: 'github-light',
          dark: 'github-dark',
        })
      ).toBe('github-light');
    });

    it('allows custom dark theme option', () => {
      expect(
        getThemeForAppearance('dark', {
          dark: 'dracula',
        })
      ).toBe('dracula');
    });
  });

  describe('getAvailableThemesForAppearance', () => {
    it('returns all dark themes', () => {
      const darkThemes = getAvailableThemesForAppearance('dark');
      expect(darkThemes).toContain('catppuccin-mocha');
      expect(darkThemes.every((id) => getTheme(id)?.appearance === 'dark')).toBe(
        true
      );
    });

    it('returns all light themes', () => {
      const lightThemes = getAvailableThemesForAppearance('light');
      expect(lightThemes).toContain('catppuccin-latte');
      expect(
        lightThemes.every((id) => getTheme(id)?.appearance === 'light')
      ).toBe(true);
    });
  });

  describe('useAutoTheme', () => {
    it('returns dark theme when system is dark', () => {
      const mockColorScheme = vi.fn(() => 'dark' as const);
      const { result } = renderHook(() => useAutoTheme(mockColorScheme));
      expect(result.current).toBe('catppuccin-mocha');
    });

    it('returns light theme when system is light', () => {
      const mockColorScheme = vi.fn(() => 'light' as const);
      const { result } = renderHook(() => useAutoTheme(mockColorScheme));
      expect(result.current).toBe('catppuccin-latte');
    });

    it('uses custom theme options', () => {
      const mockColorScheme = vi.fn(() => 'dark' as const);
      const { result } = renderHook(() =>
        useAutoTheme(mockColorScheme, {
          light: 'github-light',
          dark: 'github-dark',
        })
      );
      expect(result.current).toBe('github-dark');
    });

    it('falls back to dark theme when hook returns null', () => {
      const mockColorScheme = vi.fn(() => null);
      const { result } = renderHook(() => useAutoTheme(mockColorScheme));
      expect(result.current).toBe('catppuccin-mocha');
    });
  });
});
