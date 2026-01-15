// SPDX-License-Identifier: MIT
/**
 * Tests for dropdown menu population and native select wiring
 */
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import {
  populateDropdownMenu,
  wireNativeSelect,
  getDropdownElements,
  type DropdownContext,
} from '../../src/dropdown/ui.js';
import type { ThemeFlavor } from '../../src/theme-mapper.js';
import type { ThemeFamilyMeta } from '../../src/constants.js';
import { DOM_IDS } from '../../src/constants.js';

describe('populateDropdownMenu', () => {
  let mockContext: DropdownContext;
  let mockTheme: ThemeFlavor;
  let dropdownMenu: HTMLElement;
  const themeFamilies: Record<string, ThemeFamilyMeta> = {
    catppuccin: { name: 'Catppuccin', homepage: 'https://catppuccin.com' },
    github: { name: 'GitHub', homepage: 'https://github.com' },
  };

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

    dropdownMenu = document.createElement('div');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('creates groups for each family with themes', () => {
    const themes: ThemeFlavor[] = [
      mockTheme,
      { ...mockTheme, id: 'github-dark', name: 'Dark', family: 'github' },
    ];

    populateDropdownMenu(mockContext, dropdownMenu, themes, themeFamilies);

    expect(dropdownMenu.querySelectorAll('.theme-family-group').length).toBe(2);
  });

  it('skips families with no themes', () => {
    const themes: ThemeFlavor[] = [mockTheme]; // Only catppuccin

    populateDropdownMenu(mockContext, dropdownMenu, themes, themeFamilies);

    expect(dropdownMenu.querySelectorAll('.theme-family-group').length).toBe(1);
  });

  it('adds items to context menuItems', () => {
    const themes: ThemeFlavor[] = [
      mockTheme,
      { ...mockTheme, id: 'catppuccin-latte', name: 'Latte' },
    ];

    populateDropdownMenu(mockContext, dropdownMenu, themes, themeFamilies);

    expect(mockContext.menuItems.length).toBe(2);
  });

  it('skips families with undefined meta', () => {
    const themes: ThemeFlavor[] = [
      { ...mockTheme, family: 'unknown' },
    ];

    populateDropdownMenu(mockContext, dropdownMenu, themes, themeFamilies);

    expect(dropdownMenu.querySelectorAll('.theme-family-group').length).toBe(0);
  });

  it('increments animation delay for each group', () => {
    const themes: ThemeFlavor[] = [
      mockTheme,
      { ...mockTheme, id: 'github-dark', name: 'Dark', family: 'github' },
    ];

    populateDropdownMenu(mockContext, dropdownMenu, themes, themeFamilies);

    const groups = dropdownMenu.querySelectorAll('.theme-family-group');
    expect(groups[0]?.getAttribute('style')).toContain('--animation-delay: 0ms');
    expect(groups[1]?.getAttribute('style')).toContain('--animation-delay: 30ms');
  });
});

describe('wireNativeSelect', () => {
  let mockContext: DropdownContext;
  let selectEl: HTMLSelectElement;
  const themes: ThemeFlavor[] = [
    { id: 'theme-1', name: 'Theme 1', family: 'test', appearance: 'light', description: '' },
    { id: 'theme-2', name: 'Theme 2', family: 'test', appearance: 'dark', description: '' },
  ];

  beforeEach(() => {
    mockContext = {
      documentObj: document,
      windowObj: window,
      baseUrl: '/assets',
      currentThemeId: 'theme-1',
      selectEl: null,
      menuItems: [],
      closeDropdown: vi.fn(),
      onThemeSelect: vi.fn(),
    };

    selectEl = document.createElement('select');
    selectEl.disabled = true;
    // Add existing options to test clearing
    const existingOption = document.createElement('option');
    existingOption.value = 'old';
    selectEl.appendChild(existingOption);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('clears existing options', () => {
    wireNativeSelect(mockContext, selectEl, themes, 'theme-1');
    expect(selectEl.querySelector('option[value="old"]')).toBeNull();
  });

  it('adds options for each theme', () => {
    wireNativeSelect(mockContext, selectEl, themes, 'theme-1');
    expect(selectEl.options.length).toBe(2);
  });

  it('sets option values and text', () => {
    wireNativeSelect(mockContext, selectEl, themes, 'theme-1');
    const option = selectEl.options[0];
    expect(option?.value).toBe('theme-1');
    expect(option?.textContent).toBe('Theme 1');
  });

  it('selects current theme option', () => {
    mockContext.currentThemeId = 'theme-2';
    wireNativeSelect(mockContext, selectEl, themes, 'theme-1');
    expect(selectEl.options[1]?.selected).toBe(true);
  });

  it('enables select element', () => {
    wireNativeSelect(mockContext, selectEl, themes, 'theme-1');
    expect(selectEl.disabled).toBe(false);
  });

  it('calls onThemeSelect on change', () => {
    wireNativeSelect(mockContext, selectEl, themes, 'theme-1');
    selectEl.value = 'theme-2';
    selectEl.dispatchEvent(new Event('change'));

    expect(mockContext.onThemeSelect).toHaveBeenCalledWith('theme-2');
  });

  it('uses default theme when target value is empty', () => {
    wireNativeSelect(mockContext, selectEl, themes, 'theme-1');

    // Simulate change with empty value
    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: { value: '' } });
    selectEl.dispatchEvent(event);

    expect(mockContext.onThemeSelect).toHaveBeenCalledWith('theme-1');
  });

  it('uses default theme when target is null', () => {
    wireNativeSelect(mockContext, selectEl, themes, 'default-theme');

    // Simulate change with null target
    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: null });
    selectEl.dispatchEvent(event);

    expect(mockContext.onThemeSelect).toHaveBeenCalledWith('default-theme');
  });
});

describe('getDropdownElements', () => {
  beforeEach(() => {
    // Set up DOM structure
    const menu = document.createElement('div');
    menu.id = DOM_IDS.THEME_FLAVOR_MENU;

    const trigger = document.createElement('button');
    trigger.id = DOM_IDS.THEME_FLAVOR_TRIGGER;

    const dropdown = document.createElement('div');
    dropdown.classList.add('navbar-item', 'has-dropdown');
    dropdown.appendChild(trigger);

    const selectEl = document.createElement('select');
    selectEl.id = DOM_IDS.THEME_FLAVOR_SELECT;

    document.body.appendChild(menu);
    document.body.appendChild(dropdown);
    document.body.appendChild(selectEl);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns elements when all present', () => {
    const result = getDropdownElements(document);
    expect(result).not.toBeNull();
    expect(result!.dropdownMenu).toBeDefined();
    expect(result!.trigger).toBeDefined();
    expect(result!.dropdown).toBeDefined();
    expect(result!.selectEl).toBeDefined();
  });

  it('returns null when menu is missing', () => {
    document.getElementById(DOM_IDS.THEME_FLAVOR_MENU)?.remove();
    const result = getDropdownElements(document);
    expect(result).toBeNull();
  });

  it('returns null when trigger is missing', () => {
    document.getElementById(DOM_IDS.THEME_FLAVOR_TRIGGER)?.remove();
    const result = getDropdownElements(document);
    expect(result).toBeNull();
  });

  it('returns null when dropdown parent is missing', () => {
    const trigger = document.getElementById(DOM_IDS.THEME_FLAVOR_TRIGGER);
    // Move trigger outside dropdown
    document.body.appendChild(trigger!);
    const result = getDropdownElements(document);
    expect(result).toBeNull();
  });

  it('returns elements with selectEl as null when missing', () => {
    document.getElementById(DOM_IDS.THEME_FLAVOR_SELECT)?.remove();
    const result = getDropdownElements(document);
    expect(result).not.toBeNull();
    expect(result!.selectEl).toBeNull();
  });
});
