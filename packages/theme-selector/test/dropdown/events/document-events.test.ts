// SPDX-License-Identifier: MIT
/**
 * Tests for dropdown document-level events (outside click, escape, abort)
 */
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { wireDropdownEventHandlers } from '../../../src/dropdown/events.js';
import type { DropdownElements, DropdownState, DropdownStateManager } from '../../../src/dropdown/state.js';

describe('wireDropdownEventHandlers - document events', () => {
  let mockDocument: Document;
  let mockElements: DropdownElements;
  let mockState: DropdownState;
  let mockStateManager: DropdownStateManager;
  let abortController: AbortController;

  beforeEach(() => {
    mockDocument = document;

    const trigger = document.createElement('button');
    trigger.id = 'theme-flavor-trigger';
    const dropdownMenu = document.createElement('div');
    dropdownMenu.id = 'theme-flavor-menu';
    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');
    dropdown.appendChild(trigger);
    dropdown.appendChild(dropdownMenu);
    document.body.appendChild(dropdown);

    mockElements = {
      dropdownMenu,
      trigger,
      dropdown,
      selectEl: null,
    };

    const item1 = document.createElement('button');
    item1.classList.add('theme-item');
    item1.setAttribute('tabindex', '-1');
    const item2 = document.createElement('button');
    item2.classList.add('theme-item');
    item2.setAttribute('tabindex', '-1');
    const item3 = document.createElement('button');
    item3.classList.add('theme-item');
    item3.setAttribute('tabindex', '-1');

    dropdownMenu.appendChild(item1);
    dropdownMenu.appendChild(item2);
    dropdownMenu.appendChild(item3);

    mockState = {
      currentIndex: -1,
      menuItems: [item1, item2, item3],
    };

    mockStateManager = {
      focusMenuItem: vi.fn((index: number) => {
        mockState.currentIndex = index;
      }),
      closeDropdown: vi.fn(),
      toggleDropdown: vi.fn((focusFirst?: boolean) => {
        if (mockElements.dropdown.classList.contains('is-active')) {
          mockElements.dropdown.classList.remove('is-active');
        } else {
          mockElements.dropdown.classList.add('is-active');
          if (focusFirst) {
            mockStateManager.focusMenuItem(0);
          }
        }
      }),
      updateAriaExpanded: vi.fn(),
    };

    abortController = new AbortController();
  });

  afterEach(() => {
    abortController.abort();
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('outside click', () => {
    it('closes dropdown when clicking outside', () => {
      wireDropdownEventHandlers(mockDocument, mockElements, mockState, mockStateManager, abortController);
      mockElements.dropdown.classList.add('is-active');

      // Create element outside dropdown
      const outsideEl = document.createElement('div');
      document.body.appendChild(outsideEl);

      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideEl });
      mockDocument.dispatchEvent(event);

      expect(mockStateManager.closeDropdown).toHaveBeenCalledWith({ restoreFocus: false });
    });

    it('does not close dropdown when clicking inside', () => {
      wireDropdownEventHandlers(mockDocument, mockElements, mockState, mockStateManager, abortController);
      mockElements.dropdown.classList.add('is-active');

      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: mockElements.trigger });
      mockDocument.dispatchEvent(event);

      expect(mockStateManager.closeDropdown).not.toHaveBeenCalled();
    });
  });

  describe('escape key', () => {
    it('closes dropdown on Escape when active', () => {
      wireDropdownEventHandlers(mockDocument, mockElements, mockState, mockStateManager, abortController);
      mockElements.dropdown.classList.add('is-active');

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      mockDocument.dispatchEvent(event);

      expect(mockStateManager.closeDropdown).toHaveBeenCalledWith({ restoreFocus: true });
    });

    it('does not close dropdown on Escape when not active', () => {
      wireDropdownEventHandlers(mockDocument, mockElements, mockState, mockStateManager, abortController);

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      mockDocument.dispatchEvent(event);

      expect(mockStateManager.closeDropdown).not.toHaveBeenCalled();
    });

    it('ignores other keys', () => {
      wireDropdownEventHandlers(mockDocument, mockElements, mockState, mockStateManager, abortController);
      mockElements.dropdown.classList.add('is-active');

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      mockDocument.dispatchEvent(event);

      expect(mockStateManager.closeDropdown).not.toHaveBeenCalled();
    });
  });

  describe('abort signal', () => {
    it('removes event listeners when aborted', () => {
      wireDropdownEventHandlers(mockDocument, mockElements, mockState, mockStateManager, abortController);

      abortController.abort();

      // After abort, events should not trigger handlers
      mockElements.trigger.click();
      expect(mockStateManager.toggleDropdown).not.toHaveBeenCalled();
    });
  });
});
