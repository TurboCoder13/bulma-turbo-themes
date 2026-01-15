/**
 * Tests for initTheme function.
 * Tests theme initialization, localStorage integration, and CSS loading.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initTheme } from '../src/index';
import {
  setupDocumentMocks,
  mockThemeLoading,
  setupThemeLinkAutoLoad,
  createMockLink,
} from '../../../test/helpers/mocks.js';

describe('initTheme', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
  });

  it('applies theme class to documentElement', async () => {
    document.documentElement.className = '';
    mockThemeLoading();
    await initTheme(document, window);
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-catppuccin-mocha');
  });

  it('uses saved theme from localStorage', async () => {
    mocks.mockLocalStorage.getItem.mockReturnValue('catppuccin-frappe');
    mockThemeLoading();
    await initTheme(document, window);
    expect(mocks.mockLocalStorage.getItem).toHaveBeenCalledWith('turbo-theme');
  });

  it('uses default theme when localStorage is empty', async () => {
    mocks.mockLocalStorage.getItem.mockReturnValue(null);
    mockThemeLoading();
    await initTheme(document, window);
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-catppuccin-mocha');
  });

  it('falls back to default theme when saved theme is unknown', async () => {
    mocks.mockLocalStorage.getItem.mockReturnValue('unknown-theme');
    mockThemeLoading();
    await initTheme(document, window);
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-catppuccin-mocha');
  });

  it('handles baseUrl attribute on html element', async () => {
    Object.defineProperty(document.documentElement, 'getAttribute', {
      value: vi.fn((attr: string) => {
        if (attr === 'data-base-url') return '/my-base/';
        if (attr === 'data-theme') return 'catppuccin-mocha';
        return null;
      }),
      writable: true,
    });

    mockThemeLoading();
    await initTheme(document, window);
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-catppuccin-mocha');
  });

  it('handles invalid baseUrl gracefully (catch path)', async () => {
    Object.defineProperty(document.documentElement, 'getAttribute', {
      value: vi.fn((attr: string) => {
        if (attr === 'data-base-url') return ':::invalid:::';
        if (attr === 'data-theme') return 'catppuccin-mocha';
        return null;
      }),
      writable: true,
    });

    mockThemeLoading();
    await expect(initTheme(document, window)).resolves.not.toThrow();
  });

  it('handles theme application with invalid baseUrl', async () => {
    Object.defineProperty(document.documentElement, 'getAttribute', {
      value: vi.fn((attr: string) => {
        if (attr === 'data-base-url') return ':::invalid:::';
        if (attr === 'data-theme') return 'catppuccin-mocha';
        return null;
      }),
      writable: true,
    });

    mockThemeLoading();
    await expect(initTheme(document, window)).resolves.not.toThrow();
  });

  it('handles missing flavor link gracefully (no throw, no href set)', async () => {
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-css') return null;
        if (id === 'theme-flavor-trigger-icon') return null;
        return null;
      }),
      writable: true,
    });

    mockThemeLoading();
    await expect(initTheme(document, window)).resolves.not.toThrow();
  });

  it('falls back to text icon when theme has no icon', async () => {
    const triggerIconEl: any = {
      firstChild: null,
      removeChild: vi.fn(),
      appendChild: vi.fn(),
    };
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-trigger-icon') return triggerIconEl;
        if (id === 'theme-flavor-css') return mocks.mockLink;
        return null;
      }),
      writable: true,
    });

    mocks.mockLocalStorage.getItem.mockReturnValue('catppuccin-latte');
    setupThemeLinkAutoLoad();
    await initTheme(document, window);

    expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-catppuccin-latte');
  });

  it('skips trigger icon update when trigger element is missing', async () => {
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-trigger-icon') return null;
        if (id === 'theme-flavor-css') return mocks.mockLink;
        return null;
      }),
      writable: true,
    });

    mockThemeLoading();
    await expect(initTheme(document, window)).resolves.not.toThrow();
  });

  it('handles URL constructor error (cssFile) without throwing', async () => {
    const OriginalURL = globalThis.URL as any;
    (globalThis as any).URL = vi.fn((input: any, base?: any) => {
      if (typeof input === 'string' && input.includes('assets/css/themes')) {
        throw new Error('bad url');
      }
      return new OriginalURL(input, base);
    }) as any;

    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-css') return mocks.mockLink;
        if (id === 'theme-flavor-trigger-icon') return null;
        return null;
      }),
      writable: true,
    });

    mockThemeLoading();
    await expect(initTheme(document, window)).resolves.not.toThrow();

    (globalThis as any).URL = OriginalURL;
  });

  it('handles icon URL constructor error in applyTheme', async () => {
    const triggerIconEl: any = {
      firstChild: null,
      removeChild: vi.fn(),
      appendChild: vi.fn(),
    };
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-trigger-icon') return triggerIconEl;
        if (id === 'theme-flavor-css') return mocks.mockLink;
        return null;
      }),
      writable: true,
    });

    const OriginalURL = globalThis.URL as any;
    (globalThis as any).URL = vi.fn((input: any, base?: any) => {
      if (typeof input === 'string' && input.includes('assets/img')) {
        throw new Error('bad url');
      }
      return new OriginalURL(input, base);
    }) as any;

    mocks.mockLocalStorage.getItem.mockReturnValue('catppuccin-frappe');
    await expect(initTheme(document as any, window as any)).resolves.not.toThrow();

    (globalThis as any).URL = OriginalURL;
  });

  it('uses text fallback for themes without icons', async () => {
    mocks.mockLocalStorage.getItem.mockReturnValue('catppuccin-latte');
    setupThemeLinkAutoLoad();
    await initTheme(document as any, window as any);

    expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-catppuccin-latte');
  });
});
