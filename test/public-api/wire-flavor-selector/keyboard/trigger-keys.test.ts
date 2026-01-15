/**
 * Tests for keyboard navigation on the dropdown trigger element.
 * Tests Enter, Space, Escape, and Arrow keys when interacting with the trigger.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { wireFlavorSelector } from '../../../../src/index.js';
import {
  setupDocumentMocks,
  setupKeyboardTriggerTest,
  createMockKeyEvent,
  extractEventHandler,
  extractDocumentEventHandler,
} from '../../../helpers/mocks.js';

describe('wireFlavorSelector trigger keyboard navigation', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
  });

  describe('toggle keys (Enter and Space)', () => {
    it.each([
      { key: 'Enter', description: 'Enter key' },
      { key: ' ', description: 'Space key' },
    ])('toggles dropdown with $description', async ({ key }) => {
      const { mockDropdown, mockTrigger } = setupKeyboardTriggerTest(mocks);
      const mockKeyEvent = createMockKeyEvent(key);

      await wireFlavorSelector(document, window);

      const keydownHandler = extractEventHandler(mockTrigger, 'keydown');

      if (keydownHandler) {
        keydownHandler(mockKeyEvent);
        expect(mockKeyEvent.preventDefault).toHaveBeenCalled();
        expect(mockDropdown.classList.toggle).toHaveBeenCalled();
      }
    });

    it('updates aria-expanded when toggling with Enter key', async () => {
      const { mockDropdown, mockTrigger } = setupKeyboardTriggerTest(mocks);

      await wireFlavorSelector(document, window);

      const keydownHandler = extractEventHandler(mockTrigger, 'keydown');

      if (keydownHandler) {
        // First call initializes aria-expanded to false
        expect(mockTrigger.setAttribute).toHaveBeenCalledWith('aria-expanded', 'false');

        mockTrigger.setAttribute.mockClear();
        mockDropdown.classList.contains.mockReturnValueOnce(false); // Initially closed
        keydownHandler(createMockKeyEvent('Enter'));

        expect(mockDropdown.classList.toggle).toHaveBeenCalled();
        expect(mockTrigger.setAttribute).toHaveBeenCalled();
      }
    });
  });

  describe('arrow keys on trigger', () => {
    it.each([
      { key: 'ArrowDown', description: 'ArrowDown' },
      { key: 'ArrowUp', description: 'ArrowUp' },
    ])('opens dropdown and adds is-active class with $description', async ({ key }) => {
      const { mockDropdown, mockTrigger } = setupKeyboardTriggerTest(mocks);
      const mockKeyEvent = createMockKeyEvent(key);

      await wireFlavorSelector(document, window);

      const keydownHandler = extractEventHandler(mockTrigger, 'keydown');

      if (keydownHandler) {
        keydownHandler(mockKeyEvent);
        expect(mockKeyEvent.preventDefault).toHaveBeenCalled();
        expect(mockDropdown.classList.add).toHaveBeenCalledWith('is-active');
        expect(mockTrigger.setAttribute).toHaveBeenCalledWith('aria-expanded', 'true');
      }
    });

    it('handles ArrowUp when dropdown is already open', async () => {
      const { mockDropdown, mockTrigger } = setupKeyboardTriggerTest(mocks, { dropdownOpen: true });

      await wireFlavorSelector(document, window);

      const keydownHandler = extractEventHandler(mockTrigger, 'keydown');

      if (keydownHandler) {
        // Test ArrowUp when dropdown is already open
        mockTrigger.setAttribute.mockClear();
        const mockKeyEvent = createMockKeyEvent('ArrowUp');
        keydownHandler(mockKeyEvent);
        expect(mockKeyEvent.preventDefault).toHaveBeenCalled();
      }
    });
  });

  describe('escape key', () => {
    it('closes dropdown and returns focus to trigger', async () => {
      const { mockDropdown, mockTrigger } = setupKeyboardTriggerTest(mocks, { dropdownOpen: true });

      await wireFlavorSelector(document, window);

      const docKeydownHandler = extractDocumentEventHandler('keydown');

      if (docKeydownHandler) {
        const escapeEvent = createMockKeyEvent('Escape');
        docKeydownHandler(escapeEvent);
        expect(mockDropdown.classList.remove).toHaveBeenCalledWith('is-active');
        expect(mockTrigger.setAttribute).toHaveBeenCalledWith('aria-expanded', 'false');
        expect(mockTrigger.focus).toHaveBeenCalled();
      }
    });
  });

  describe('non-special keys', () => {
    it.each([
      { key: 'a' },
      { key: 'Tab' },
      { key: 'Shift' },
      { key: '1' },
    ])('does not toggle dropdown with $key key', async ({ key }) => {
      const { mockDropdown, mockTrigger } = setupKeyboardTriggerTest(mocks);

      await wireFlavorSelector(document, window);

      const keydownHandler = extractEventHandler(mockTrigger, 'keydown');

      if (keydownHandler) {
        const mockKeyEvent = createMockKeyEvent(key);
        keydownHandler(mockKeyEvent);
        // Non-special keys don't trigger toggle
        expect(mockDropdown.classList.toggle).not.toHaveBeenCalled();
      }
    });
  });
});
