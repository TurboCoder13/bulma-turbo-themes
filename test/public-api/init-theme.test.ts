/**
 * Tests for initTheme function.
 * Tests theme initialization, localStorage usage, and default theme handling.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initTheme } from '../../src/index.js';
import {
  setupDocumentMocks,
  mockThemeLoading,
} from '../helpers/mocks.js';

describe('initTheme', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();

    Object.defineProperty(document.documentElement, 'getAttribute', {
      value: vi.fn(() => 'catppuccin-mocha'),
      writable: true,
    });
  });

  it('applies theme class', async () => {
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
    mocks.mockLocalStorage.getItem.mockReturnValue('unknown-theme-xyz');
    mockThemeLoading();
    await initTheme(document, window);
    // Should fall back to default theme
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-catppuccin-mocha');
  });
});
