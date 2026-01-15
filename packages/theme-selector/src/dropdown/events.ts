// SPDX-License-Identifier: MIT
/**
 * Dropdown event handlers
 */

import type { DropdownElements, DropdownState, DropdownStateManager } from './state.js';

/**
 * Calculates the next index when navigating down through menu items.
 */
function getNextIndex(currentIndex: number, totalItems: number): number {
  return currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
}

/**
 * Calculates the previous index when navigating up through menu items.
 */
function getPrevIndex(currentIndex: number, totalItems: number): number {
  return currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
}

/**
 * Handles keyboard navigation on the trigger button.
 */
function handleTriggerKeydown(
  e: KeyboardEvent,
  dropdown: HTMLElement,
  state: DropdownState,
  stateManager: DropdownStateManager
): void {
  const { focusMenuItem, toggleDropdown, updateAriaExpanded } = stateManager;
  const totalItems = state.menuItems.length;

  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault();
      toggleDropdown(!dropdown.classList.contains('is-active'));
      break;

    case 'ArrowDown':
      e.preventDefault();
      if (!dropdown.classList.contains('is-active')) {
        dropdown.classList.add('is-active');
        updateAriaExpanded(true);
        focusMenuItem(0);
      } else {
        const nextIndex = state.currentIndex < 0 ? 0 : getNextIndex(state.currentIndex, totalItems);
        focusMenuItem(nextIndex);
      }
      break;

    case 'ArrowUp':
      e.preventDefault();
      if (!dropdown.classList.contains('is-active')) {
        dropdown.classList.add('is-active');
        updateAriaExpanded(true);
        focusMenuItem(totalItems - 1);
      } else {
        const startIndex = state.currentIndex < 0 ? totalItems - 1 : state.currentIndex;
        focusMenuItem(getPrevIndex(startIndex, totalItems));
      }
      break;
  }
}

/**
 * Handles keyboard navigation on menu items.
 */
function handleMenuItemKeydown(
  e: KeyboardEvent,
  index: number,
  item: HTMLElement,
  state: DropdownState,
  stateManager: DropdownStateManager
): void {
  const { focusMenuItem, closeDropdown } = stateManager;
  const totalItems = state.menuItems.length;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      focusMenuItem(getNextIndex(index, totalItems));
      break;

    case 'ArrowUp':
      e.preventDefault();
      focusMenuItem(getPrevIndex(index, totalItems));
      break;

    case 'Escape':
      e.preventDefault();
      closeDropdown();
      break;

    case 'Enter':
    case ' ':
      e.preventDefault();
      item.click();
      break;

    case 'Home':
      e.preventDefault();
      focusMenuItem(0);
      break;

    case 'End':
      e.preventDefault();
      focusMenuItem(totalItems - 1);
      break;
  }
}

/**
 * Wires up all event handlers for the dropdown.
 */
export function wireDropdownEventHandlers(
  documentObj: Document,
  elements: DropdownElements,
  state: DropdownState,
  stateManager: DropdownStateManager,
  abortController: AbortController
): void {
  const { trigger, dropdown } = elements;
  const { closeDropdown, toggleDropdown } = stateManager;
  const signal = abortController.signal;

  // Trigger click
  trigger.addEventListener(
    'click',
    (e) => {
      e.preventDefault();
      toggleDropdown();
    },
    { signal }
  );

  // Outside click
  documentObj.addEventListener(
    'click',
    (e: MouseEvent) => {
      if (!dropdown.contains(e.target as Node)) {
        closeDropdown({ restoreFocus: false });
      }
    },
    { signal }
  );

  // Escape key (document-level)
  documentObj.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dropdown.classList.contains('is-active')) {
        closeDropdown({ restoreFocus: true });
      }
    },
    { signal }
  );

  // Trigger keyboard navigation
  trigger.addEventListener(
    'keydown',
    (e: KeyboardEvent) => handleTriggerKeydown(e, dropdown, state, stateManager),
    { signal }
  );

  // Menu item keyboard navigation
  for (const [index, item] of state.menuItems.entries()) {
    item.addEventListener(
      'keydown',
      (e: KeyboardEvent) => handleMenuItemKeydown(e, index, item, state, stateManager),
      { signal }
    );
  }
}
