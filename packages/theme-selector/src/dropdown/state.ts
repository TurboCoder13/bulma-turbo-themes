// SPDX-License-Identifier: MIT
/**
 * Dropdown state management
 */

import { setItemActiveState, setTabindexBatch } from './helpers.js';

export interface DropdownElements {
  dropdownMenu: HTMLElement;
  trigger: HTMLButtonElement;
  dropdown: HTMLElement;
  selectEl: HTMLSelectElement | null;
}

export interface DropdownState {
  currentIndex: number;
  menuItems: HTMLElement[];
}

export interface DropdownStateManager {
  updateAriaExpanded: (expanded: boolean) => void;
  focusMenuItem: (index: number) => void;
  closeDropdown: (options?: { restoreFocus?: boolean }) => void;
  toggleDropdown: (focusFirst?: boolean) => void;
}

/**
 * Creates dropdown state management functions.
 */
export function createDropdownStateManager(
  elements: DropdownElements,
  state: DropdownState
): DropdownStateManager {
  const { trigger, dropdown } = elements;

  const updateAriaExpanded = (expanded: boolean): void => {
    trigger.setAttribute('aria-expanded', String(expanded));
  };

  const focusMenuItem = (index: number): void => {
    if (index < 0 || index >= state.menuItems.length) return;

    const item = state.menuItems[index]!;
    setTabindexBatch(state.menuItems, '-1');
    item.setAttribute('tabindex', '0');
    item.focus();
    state.currentIndex = index;
  };

  const closeDropdown = (options: { restoreFocus?: boolean } = {}): void => {
    const { restoreFocus = true } = options;
    dropdown.classList.remove('is-active');
    updateAriaExpanded(false);
    setTabindexBatch(state.menuItems, '-1');
    state.currentIndex = -1;
    if (restoreFocus) {
      trigger.focus();
    }
  };

  const toggleDropdown = (focusFirst = false): void => {
    const isActive = dropdown.classList.toggle('is-active');
    updateAriaExpanded(isActive);

    if (!isActive) {
      state.currentIndex = -1;
      setTabindexBatch(state.menuItems, '-1');
      for (const menuItem of state.menuItems) {
        const isActiveItem = menuItem.classList.contains('is-active');
        setItemActiveState(menuItem, isActiveItem);
      }
    } else if (focusFirst && state.menuItems.length > 0) {
      focusMenuItem(0);
    }
  };

  return { updateAriaExpanded, focusMenuItem, closeDropdown, toggleDropdown };
}
