// SPDX-License-Identifier: MIT
/**
 * Tests for dropdown trigger events (click and keyboard)
 */
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { wireDropdownEventHandlers } from '../../../src/dropdown/events.js';
import {
  setupDropdownEventTest,
  cleanupDropdownEventTest,
  type DropdownEventTestContext,
} from './test-setup.js';

describe('wireDropdownEventHandlers - trigger events', () => {
  let ctx: DropdownEventTestContext;

  beforeEach(() => {
    ctx = setupDropdownEventTest();
  });

  afterEach(() => {
    cleanupDropdownEventTest(ctx);
  });

  describe('trigger click', () => {
    it('toggles dropdown on click', () => {
      wireDropdownEventHandlers(
        ctx.mockDocument,
        ctx.mockElements,
        ctx.mockState,
        ctx.mockStateManager,
        ctx.abortController
      );

      ctx.clickTrigger();

      expect(ctx.mockStateManager.toggleDropdown).toHaveBeenCalled();
    });

    it('prevents default on click', () => {
      wireDropdownEventHandlers(
        ctx.mockDocument,
        ctx.mockElements,
        ctx.mockState,
        ctx.mockStateManager,
        ctx.abortController
      );

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      ctx.mockElements.trigger.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('trigger keyboard navigation', () => {
    it('toggles dropdown on Enter', () => {
      wireDropdownEventHandlers(
        ctx.mockDocument,
        ctx.mockElements,
        ctx.mockState,
        ctx.mockStateManager,
        ctx.abortController
      );

      ctx.dispatchTriggerKeydown('Enter');

      expect(ctx.mockStateManager.toggleDropdown).toHaveBeenCalledWith(true);
    });

    it('toggles dropdown on Space', () => {
      wireDropdownEventHandlers(
        ctx.mockDocument,
        ctx.mockElements,
        ctx.mockState,
        ctx.mockStateManager,
        ctx.abortController
      );

      ctx.dispatchTriggerKeydown(' ');

      expect(ctx.mockStateManager.toggleDropdown).toHaveBeenCalledWith(true);
    });

    it('toggles dropdown closed on Enter when already open', () => {
      wireDropdownEventHandlers(
        ctx.mockDocument,
        ctx.mockElements,
        ctx.mockState,
        ctx.mockStateManager,
        ctx.abortController
      );
      ctx.mockElements.dropdown.classList.add('is-active');

      ctx.dispatchTriggerKeydown('Enter');

      expect(ctx.mockStateManager.toggleDropdown).toHaveBeenCalledWith(false);
    });

    describe('ArrowDown', () => {
      it('opens dropdown and focuses first item when closed', () => {
        wireDropdownEventHandlers(
          ctx.mockDocument,
          ctx.mockElements,
          ctx.mockState,
          ctx.mockStateManager,
          ctx.abortController
        );

        ctx.dispatchTriggerKeydown('ArrowDown');

        expect(ctx.mockElements.dropdown.classList.contains('is-active')).toBe(true);
        expect(ctx.mockStateManager.updateAriaExpanded).toHaveBeenCalledWith(true);
        expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(0);
      });

      it('focuses first item when open and currentIndex < 0', () => {
        wireDropdownEventHandlers(
          ctx.mockDocument,
          ctx.mockElements,
          ctx.mockState,
          ctx.mockStateManager,
          ctx.abortController
        );
        ctx.mockElements.dropdown.classList.add('is-active');
        ctx.mockState.currentIndex = -1;

        ctx.dispatchTriggerKeydown('ArrowDown');

        expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(0);
      });

      it('focuses next item when open and has current index', () => {
        wireDropdownEventHandlers(
          ctx.mockDocument,
          ctx.mockElements,
          ctx.mockState,
          ctx.mockStateManager,
          ctx.abortController
        );
        ctx.mockElements.dropdown.classList.add('is-active');
        ctx.mockState.currentIndex = 0;

        ctx.dispatchTriggerKeydown('ArrowDown');

        expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(1);
      });

      it('wraps to first item when at last item', () => {
        wireDropdownEventHandlers(
          ctx.mockDocument,
          ctx.mockElements,
          ctx.mockState,
          ctx.mockStateManager,
          ctx.abortController
        );
        ctx.mockElements.dropdown.classList.add('is-active');
        ctx.mockState.currentIndex = 2; // Last item

        ctx.dispatchTriggerKeydown('ArrowDown');

        expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(0);
      });
    });

    describe('ArrowUp', () => {
      it('opens dropdown and focuses last item when closed', () => {
        wireDropdownEventHandlers(
          ctx.mockDocument,
          ctx.mockElements,
          ctx.mockState,
          ctx.mockStateManager,
          ctx.abortController
        );

        ctx.dispatchTriggerKeydown('ArrowUp');

        expect(ctx.mockElements.dropdown.classList.contains('is-active')).toBe(true);
        expect(ctx.mockStateManager.updateAriaExpanded).toHaveBeenCalledWith(true);
        expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(2); // Last item
      });

      it('focuses last item when open and currentIndex < 0', () => {
        wireDropdownEventHandlers(
          ctx.mockDocument,
          ctx.mockElements,
          ctx.mockState,
          ctx.mockStateManager,
          ctx.abortController
        );
        ctx.mockElements.dropdown.classList.add('is-active');
        ctx.mockState.currentIndex = -1;

        ctx.dispatchTriggerKeydown('ArrowUp');

        // When currentIndex < 0, startIndex becomes menuItems.length - 1 = 2
        // prevIndex = startIndex > 0 ? startIndex - 1 : menuItems.length - 1 = 2 - 1 = 1
        expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(1);
      });

      it('focuses previous item when open and has current index', () => {
        wireDropdownEventHandlers(
          ctx.mockDocument,
          ctx.mockElements,
          ctx.mockState,
          ctx.mockStateManager,
          ctx.abortController
        );
        ctx.mockElements.dropdown.classList.add('is-active');
        ctx.mockState.currentIndex = 2;

        ctx.dispatchTriggerKeydown('ArrowUp');

        expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(1);
      });

      it('wraps to last item when at first item', () => {
        wireDropdownEventHandlers(
          ctx.mockDocument,
          ctx.mockElements,
          ctx.mockState,
          ctx.mockStateManager,
          ctx.abortController
        );
        ctx.mockElements.dropdown.classList.add('is-active');
        ctx.mockState.currentIndex = 0;

        ctx.dispatchTriggerKeydown('ArrowUp');

        expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(2); // Last item
      });
    });

    it('ignores other keys', () => {
      wireDropdownEventHandlers(
        ctx.mockDocument,
        ctx.mockElements,
        ctx.mockState,
        ctx.mockStateManager,
        ctx.abortController
      );

      ctx.dispatchTriggerKeydown('Tab');

      expect(ctx.mockStateManager.toggleDropdown).not.toHaveBeenCalled();
      expect(ctx.mockStateManager.focusMenuItem).not.toHaveBeenCalled();
    });
  });
});
