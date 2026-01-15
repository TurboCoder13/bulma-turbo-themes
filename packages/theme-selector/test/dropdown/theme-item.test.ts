// SPDX-License-Identifier: MIT
/**
 * Tests for theme item element creation
 */
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { createThemeItemElement, type DropdownContext } from '../../src/dropdown/ui.js';
import type { ThemeFlavor } from '../../src/theme-mapper.js';
import type { ThemeFamilyMeta } from '../../src/constants.js';

describe('createThemeItemElement', () => {
  let mockContext: DropdownContext;
  let mockTheme: ThemeFlavor;
  let mockFamilyMeta: ThemeFamilyMeta;

  beforeEach(() => {
    mockContext = {
      documentObj: document,
      windowObj: window,
      baseUrl: '/assets',
      currentThemeId: 'catppuccin-mocha',
      selectEl: null,
      menuItems: [],
      closeDropdown: vi.fn(),
      onThemeSelect: vi.fn(),
    };

    mockTheme = {
      id: 'catppuccin-mocha',
      name: 'Mocha',
      family: 'catppuccin',
      appearance: 'dark',
      description: 'A dark theme',
      icon: 'icons/mocha.svg',
    };

    mockFamilyMeta = {
      name: 'Catppuccin',
      homepage: 'https://catppuccin.com',
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('creates a button element', () => {
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    expect(item.tagName).toBe('BUTTON');
    expect(item.type).toBe('button');
  });

  it('sets correct class names', () => {
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    expect(item.classList.contains('dropdown-item')).toBe(true);
    expect(item.classList.contains('theme-item')).toBe(true);
  });

  it('sets correct data attributes', () => {
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    expect(item.getAttribute('data-theme-id')).toBe('catppuccin-mocha');
    expect(item.getAttribute('data-appearance')).toBe('dark');
  });

  it('sets correct ARIA attributes', () => {
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    expect(item.getAttribute('role')).toBe('menuitemradio');
    expect(item.getAttribute('aria-label')).toContain('Catppuccin');
    expect(item.getAttribute('aria-label')).toContain('Mocha');
    expect(item.getAttribute('aria-label')).toContain('dark');
    expect(item.getAttribute('tabindex')).toBe('-1');
  });

  it('sets active state for current theme', () => {
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    expect(item.classList.contains('is-active')).toBe(true);
    expect(item.getAttribute('aria-checked')).toBe('true');
  });

  it('sets inactive state for non-current theme', () => {
    mockContext.currentThemeId = 'other-theme';
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    expect(item.classList.contains('is-active')).toBe(false);
    expect(item.getAttribute('aria-checked')).toBe('false');
  });

  it('creates icon with baseUrl', () => {
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    const icon = item.querySelector('img.theme-icon') as HTMLImageElement;
    expect(icon).not.toBeNull();
    expect(icon.src).toContain('/assets/icons/mocha.svg');
    expect(icon.alt).toBe('Catppuccin Mocha');
  });

  it('creates icon without baseUrl', () => {
    mockContext.baseUrl = '';
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    const icon = item.querySelector('img.theme-icon') as HTMLImageElement;
    expect(icon.src).toContain('icons/mocha.svg');
  });

  it('handles theme without icon', () => {
    mockTheme.icon = undefined;
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    const icon = item.querySelector('img.theme-icon');
    // When theme has no icon, the img element should not be created
    expect(icon).toBeNull();
  });

  it('creates title element', () => {
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    const title = item.querySelector('.theme-title');
    expect(title).not.toBeNull();
    expect(title?.textContent).toBe('Catppuccin · Mocha');
  });

  it('creates description element', () => {
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    const desc = item.querySelector('.theme-description');
    expect(desc).not.toBeNull();
    expect(desc?.textContent).toBe('A dark theme');
  });

  it('creates checkmark element', () => {
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    const check = item.querySelector('.theme-check');
    expect(check).not.toBeNull();
    expect(check?.querySelector('svg')).not.toBeNull();
  });

  it('handles click event', () => {
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    item.click();

    expect(mockContext.onThemeSelect).toHaveBeenCalledWith('catppuccin-mocha');
    expect(mockContext.closeDropdown).toHaveBeenCalledWith({ restoreFocus: true });
  });

  it('updates selectEl on click when present', () => {
    const selectEl = document.createElement('select');
    const option = document.createElement('option');
    option.value = 'catppuccin-mocha';
    selectEl.appendChild(option);
    mockContext.selectEl = selectEl;

    const changeHandler = vi.fn();
    selectEl.addEventListener('change', changeHandler);

    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);
    item.click();

    expect(selectEl.value).toBe('catppuccin-mocha');
    expect(changeHandler).toHaveBeenCalled();
  });

  it('does not crash when selectEl is null on click', () => {
    mockContext.selectEl = null;
    const item = createThemeItemElement(mockContext, mockTheme, mockFamilyMeta);

    expect(() => item.click()).not.toThrow();
    expect(mockContext.onThemeSelect).toHaveBeenCalled();
  });
});
