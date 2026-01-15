// SPDX-License-Identifier: MIT
/**
 * Dropdown helper functions
 */

/**
 * Sets the active state (is-active class and aria-checked) on a theme item element.
 */
export function setItemActiveState(item: Element, isActive: boolean): void {
  if (isActive) {
    item.classList.add('is-active');
  } else {
    item.classList.remove('is-active');
  }
  item.setAttribute('aria-checked', String(isActive));
}

/**
 * Sets tabindex attribute on all items in a collection.
 */
export function setTabindexBatch(items: HTMLElement[], value: string): void {
  for (const item of items) {
    item.setAttribute('tabindex', value);
  }
}
