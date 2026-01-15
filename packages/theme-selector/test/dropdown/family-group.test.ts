// SPDX-License-Identifier: MIT
/**
 * Tests for family group creation
 */
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { createFamilyGroup, type DropdownContext } from '../../src/dropdown/ui.js';
import type { ThemeFlavor } from '../../src/theme-mapper.js';
import type { ThemeFamilyMeta } from '../../src/constants.js';

describe('createFamilyGroup', () => {
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

  it('returns null for empty themes array', () => {
    const result = createFamilyGroup(mockContext, 'catppuccin', [], mockFamilyMeta, 0);
    expect(result).toBeNull();
  });

  it('creates group container with correct class', () => {
    const result = createFamilyGroup(mockContext, 'catppuccin', [mockTheme], mockFamilyMeta, 0);
    expect(result).not.toBeNull();
    expect(result!.group.classList.contains('theme-family-group')).toBe(true);
  });

  it('sets correct ARIA attributes on group', () => {
    const result = createFamilyGroup(mockContext, 'catppuccin', [mockTheme], mockFamilyMeta, 0);
    expect(result!.group.getAttribute('role')).toBe('group');
    expect(result!.group.getAttribute('aria-labelledby')).toBe('theme-family-catppuccin');
  });

  it('sets animation delay CSS variable', () => {
    const result = createFamilyGroup(mockContext, 'catppuccin', [mockTheme], mockFamilyMeta, 100);
    expect(result!.group.style.getPropertyValue('--animation-delay')).toBe('100ms');
  });

  it('creates family header', () => {
    const result = createFamilyGroup(mockContext, 'catppuccin', [mockTheme], mockFamilyMeta, 0);
    const header = result!.group.querySelector('.theme-family-header');
    expect(header).not.toBeNull();
    expect(header?.id).toBe('theme-family-catppuccin');
  });

  it('creates family name title', () => {
    const result = createFamilyGroup(mockContext, 'catppuccin', [mockTheme], mockFamilyMeta, 0);
    const name = result!.group.querySelector('.theme-family-name');
    expect(name).not.toBeNull();
    expect(name?.textContent).toBe('Catppuccin');
  });

  it('creates themes container', () => {
    const result = createFamilyGroup(mockContext, 'catppuccin', [mockTheme], mockFamilyMeta, 0);
    const container = result!.group.querySelector('.theme-family-items');
    expect(container).not.toBeNull();
  });

  it('creates theme items for each theme', () => {
    const theme2: ThemeFlavor = { ...mockTheme, id: 'catppuccin-latte', name: 'Latte', appearance: 'light' };
    const result = createFamilyGroup(mockContext, 'catppuccin', [mockTheme, theme2], mockFamilyMeta, 0);

    expect(result!.items.length).toBe(2);
    expect(result!.group.querySelectorAll('.theme-item').length).toBe(2);
  });

  it('returns items array', () => {
    const result = createFamilyGroup(mockContext, 'catppuccin', [mockTheme], mockFamilyMeta, 0);
    expect(result!.items.length).toBe(1);
    expect(result!.items[0]?.getAttribute('data-theme-id')).toBe('catppuccin-mocha');
  });

  it('handles element without style.setProperty', () => {
    // Create a mock that doesn't have setProperty
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName === 'div') {
        Object.defineProperty(el, 'style', {
          value: { setProperty: undefined },
          configurable: true,
        });
      }
      return el;
    });

    const result = createFamilyGroup(mockContext, 'catppuccin', [mockTheme], mockFamilyMeta, 100);
    expect(result).not.toBeNull();

    vi.restoreAllMocks();
  });
});
