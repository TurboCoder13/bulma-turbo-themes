import type React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  ThemeProvider,
  useThemeContext,
  getThemesForAppearance,
  useAppearanceListener,
  createThemeCycler,
  DEFAULT_LIGHT_THEME,
  DEFAULT_DARK_THEME,
} from '../src/tokens/react-native';

describe('ThemeProvider', () => {
  describe('basic rendering', () => {
    it('provides theme context to children', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      expect(result.current.themeId).toBeDefined();
      expect(result.current.theme).toBeDefined();
      expect(result.current.colors).toBeDefined();
      expect(result.current.styles).toBeDefined();
      expect(result.current.setTheme).toBeInstanceOf(Function);
      expect(result.current.toggleAppearance).toBeInstanceOf(Function);
    });

    it('uses default dark theme when no initialTheme provided', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      expect(result.current.themeId).toBe(DEFAULT_DARK_THEME);
      expect(result.current.appearance).toBe('dark');
    });

    it('uses initialTheme when provided', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider initialTheme="github-light">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      expect(result.current.themeId).toBe('github-light');
      expect(result.current.appearance).toBe('light');
    });
  });

  describe('theme switching', () => {
    it('setTheme changes the current theme', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider initialTheme="catppuccin-mocha">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      act(() => {
        result.current.setTheme('catppuccin-latte');
      });

      expect(result.current.themeId).toBe('catppuccin-latte');
      expect(result.current.appearance).toBe('light');
    });

    it('toggleAppearance switches between light and dark', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider initialTheme="catppuccin-mocha">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      expect(result.current.appearance).toBe('dark');

      act(() => {
        result.current.toggleAppearance();
      });

      expect(result.current.appearance).toBe('light');

      act(() => {
        result.current.toggleAppearance();
      });

      expect(result.current.appearance).toBe('dark');
    });

    it('ignores setTheme with invalid theme ID', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider initialTheme="catppuccin-mocha">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      act(() => {
        result.current.setTheme('nonexistent-theme');
      });

      expect(result.current.themeId).toBe('catppuccin-mocha');
    });

    it('calls onThemeChange callback when theme changes', () => {
      const onThemeChange = vi.fn();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider initialTheme="catppuccin-mocha" onThemeChange={onThemeChange}>
          {children}
        </ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      act(() => {
        result.current.setTheme('catppuccin-latte');
      });

      expect(onThemeChange).toHaveBeenCalledWith('catppuccin-latte');
    });
  });

  describe('system appearance', () => {
    it('follows system appearance when followSystem is true', () => {
      const mockColorScheme = vi.fn(() => 'light' as const);
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider followSystem useColorScheme={mockColorScheme}>
          {children}
        </ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      expect(result.current.themeId).toBe(DEFAULT_LIGHT_THEME);
    });

    it('uses dark theme when system is dark', () => {
      const mockColorScheme = vi.fn(() => 'dark' as const);
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider followSystem useColorScheme={mockColorScheme}>
          {children}
        </ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      expect(result.current.themeId).toBe(DEFAULT_DARK_THEME);
    });

    it('respects custom light/dark theme mappings', () => {
      const mockColorScheme = vi.fn(() => 'light' as const);
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider
          followSystem
          useColorScheme={mockColorScheme}
          lightTheme="github-light"
          darkTheme="github-dark"
        >
          {children}
        </ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      expect(result.current.themeId).toBe('github-light');
    });

    it('initialTheme overrides followSystem', () => {
      const mockColorScheme = vi.fn(() => 'light' as const);
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider initialTheme="dracula" followSystem useColorScheme={mockColorScheme}>
          {children}
        </ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      expect(result.current.themeId).toBe('dracula');
    });
  });

  describe('colors and styles', () => {
    it('provides correct colors for theme', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider initialTheme="catppuccin-mocha">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      expect(result.current.colors.backgroundBase).toBe('#1e1e2e');
      expect(result.current.colors.textPrimary).toBe('#cdd6f4');
    });

    it('provides correct styles for theme', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider initialTheme="catppuccin-mocha">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      expect(result.current.styles.container.backgroundColor).toBe('#1e1e2e');
      expect(result.current.styles.text.color).toBe('#cdd6f4');
    });

    it('updates colors and styles when theme changes', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider initialTheme="catppuccin-mocha">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      const initialBg = result.current.colors.backgroundBase;

      act(() => {
        result.current.setTheme('catppuccin-latte');
      });

      expect(result.current.colors.backgroundBase).not.toBe(initialBg);
    });
  });

  describe('error handling', () => {
    it('throws error when useThemeContext is used outside provider', () => {
      expect(() => {
        renderHook(() => useThemeContext());
      }).toThrow('useThemeContext must be used within a ThemeProvider');
    });

    it('falls back to dark theme when invalid initialTheme provided', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider initialTheme="nonexistent-theme">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useThemeContext(), { wrapper });

      expect(result.current.themeId).toBe(DEFAULT_DARK_THEME);
    });
  });
});

describe('getThemesForAppearance', () => {
  it('returns light themes', () => {
    const lightThemes = getThemesForAppearance('light');
    expect(lightThemes.length).toBeGreaterThan(0);
    lightThemes.forEach((theme) => {
      expect(theme.appearance).toBe('light');
    });
  });

  it('returns dark themes', () => {
    const darkThemes = getThemesForAppearance('dark');
    expect(darkThemes.length).toBeGreaterThan(0);
    darkThemes.forEach((theme) => {
      expect(theme.appearance).toBe('dark');
    });
  });
});

describe('useAppearanceListener', () => {
  it('returns current appearance', () => {
    const mockColorScheme = vi.fn(() => 'dark' as const);
    const { result } = renderHook(() => useAppearanceListener(mockColorScheme));
    expect(result.current).toBe('dark');
  });

  it('calls callback when appearance changes', async () => {
    let currentScheme: 'light' | 'dark' = 'dark';
    const mockColorScheme = vi.fn(() => currentScheme);
    const onAppearanceChange = vi.fn();

    const { result, rerender } = renderHook(() =>
      useAppearanceListener(mockColorScheme, onAppearanceChange)
    );

    expect(result.current).toBe('dark');

    // Change the scheme
    currentScheme = 'light';
    rerender();

    await waitFor(() => {
      expect(onAppearanceChange).toHaveBeenCalledWith('light');
    });
  });
});

describe('createThemeCycler', () => {
  it('cycles through dark themes', () => {
    const setTheme = vi.fn();
    const cycler = createThemeCycler('catppuccin-mocha', setTheme);

    cycler();

    expect(setTheme).toHaveBeenCalled();
    const calledWith = setTheme.mock.calls[0]?.[0];
    expect(typeof calledWith).toBe('string');
  });

  it('wraps around to first theme', () => {
    const setTheme = vi.fn();

    // Get all dark themes and use the last one
    const darkThemes = getThemesForAppearance('dark');
    const lastTheme = darkThemes[darkThemes.length - 1];

    if (lastTheme) {
      const cycler = createThemeCycler(lastTheme.id, setTheme);
      cycler();

      expect(setTheme).toHaveBeenCalledWith(darkThemes[0]?.id);
    }
  });
});
