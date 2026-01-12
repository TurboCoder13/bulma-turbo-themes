// SPDX-License-Identifier: MIT
/**
 * Tests for dropdown state management
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDropdownStateManager, type DropdownElements, type DropdownState } from '../src/dropdown/state.js';

describe('dropdown/state', () => {
  let mockElements: DropdownElements;
  let mockState: DropdownState;
  let stateManager: ReturnType<typeof createDropdownStateManager>;

  beforeEach(() => {
    const trigger = document.createElement('button');
    trigger.id = 'theme-flavor-trigger';
    const dropdownMenu = document.createElement('div');
    dropdownMenu.id = 'theme-flavor-menu';
    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');

    mockElements = {
      dropdownMenu,
      trigger,
      dropdown,
      selectEl: null,
    };

    const item1 = document.createElement('button');
    item1.classList.add('theme-item');
    const item2 = document.createElement('button');
    item2.classList.add('theme-item');

    mockState = {
      currentIndex: -1,
      menuItems: [item1, item2],
    };

    stateManager = createDropdownStateManager(mockElements, mockState);
  });

  describe('createDropdownStateManager', () => {
    it('opens dropdown', () => {
      stateManager.toggleDropdown();

      expect(mockElements.dropdown.classList.contains('is-active')).toBe(true);
      expect(mockElements.trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('closes dropdown', () => {
      mockElements.dropdown.classList.add('is-active');
      stateManager.closeDropdown();

      expect(mockElements.dropdown.classList.contains('is-active')).toBe(false);
      expect(mockElements.trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('toggles dropdown', () => {
      expect(mockElements.dropdown.classList.contains('is-active')).toBe(false);

      stateManager.toggleDropdown();
      expect(mockElements.dropdown.classList.contains('is-active')).toBe(true);

      stateManager.toggleDropdown();
      expect(mockElements.dropdown.classList.contains('is-active')).toBe(false);
    });

    it('updates aria-expanded', () => {
      stateManager.updateAriaExpanded(true);
      expect(mockElements.trigger.getAttribute('aria-expanded')).toBe('true');

      stateManager.updateAriaExpanded(false);
      expect(mockElements.trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('focuses item by index', () => {
      const focusSpy = vi.spyOn(mockState.menuItems[0]!, 'focus');

      stateManager.focusMenuItem(0);

      expect(focusSpy).toHaveBeenCalled();
      expect(mockState.currentIndex).toBe(0);
      expect(mockState.menuItems[0]!.getAttribute('tabindex')).toBe('0');
      expect(mockState.menuItems[1]!.getAttribute('tabindex')).toBe('-1');
    });

    it('does not focus invalid index', () => {
      const focusSpy1 = vi.spyOn(mockState.menuItems[0]!, 'focus');
      const focusSpy2 = vi.spyOn(mockState.menuItems[1]!, 'focus');

      stateManager.focusMenuItem(-1);
      stateManager.focusMenuItem(10);

      expect(focusSpy1).not.toHaveBeenCalled();
      expect(focusSpy2).not.toHaveBeenCalled();
    });

    it('restores focus to trigger when closing', () => {
      const focusSpy = vi.spyOn(mockElements.trigger, 'focus');

      stateManager.closeDropdown({ restoreFocus: true });

      expect(focusSpy).toHaveBeenCalled();
    });

    it('does not restore focus when restoreFocus is false', () => {
      const focusSpy = vi.spyOn(mockElements.trigger, 'focus');

      stateManager.closeDropdown({ restoreFocus: false });

      expect(focusSpy).not.toHaveBeenCalled();
    });

    it('focuses first item when toggling open with focusFirst', () => {
      const focusSpy = vi.spyOn(mockState.menuItems[0]!, 'focus');

      stateManager.toggleDropdown(true);

      expect(focusSpy).toHaveBeenCalled();
      expect(mockState.currentIndex).toBe(0);
    });

    it('resets tabindex when closing', () => {
      stateManager.focusMenuItem(0);
      expect(mockState.menuItems[0]!.getAttribute('tabindex')).toBe('0');

      stateManager.closeDropdown();
      expect(mockState.menuItems[0]!.getAttribute('tabindex')).toBe('-1');
      expect(mockState.menuItems[1]!.getAttribute('tabindex')).toBe('-1');
    });

    it('resets currentIndex when closing', () => {
      stateManager.focusMenuItem(1);
      expect(mockState.currentIndex).toBe(1);

      stateManager.closeDropdown();
      expect(mockState.currentIndex).toBe(-1);
    });
  });
});
