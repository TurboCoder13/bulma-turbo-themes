/**
 * Keyboard navigation edge case tests.
 * Tests ArrowDown/ArrowUp when dropdown is opened via mouse (currentIndex < 0)
 * and Enter/Space toggle behavior.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { wireFlavorSelector } from '../../../src/index.js';
import {
  setupDocumentMocks,
  createKeyboardNavTestSetup,
  extractEventHandler,
} from '../../helpers/mocks.js';

describe('keyboard navigation when dropdown opened via mouse (currentIndex < 0)', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
  });

  it('ArrowDown when dropdown is open via mouse click focuses first item (lines 689-691)', async () => {
    // Setup: dropdown is already open (opened via mouse), currentIndex is -1
    // Note: wireFlavorSelector creates its own menu items dynamically,
    // so we track them via the menuItems array populated by setupCreateElementMock
    const { menuItems, mockTrigger } = createKeyboardNavTestSetup(mocks, {
      dropdownOpen: true,
      menuItemCount: 0, // Start with 0, items get created dynamically
    });

    await wireFlavorSelector(document, window);

    // Verify menu items were created dynamically
    expect(menuItems.length).toBeGreaterThan(0);

    const keydownHandler = extractEventHandler(mockTrigger, 'keydown');
    expect(keydownHandler).toBeDefined();

    // Press ArrowDown - should focus first item since currentIndex < 0
    const arrowDownEvent = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
    };
    keydownHandler!(arrowDownEvent);

    expect(arrowDownEvent.preventDefault).toHaveBeenCalled();
    // First dynamically created item should be focused
    expect(menuItems[0].focus).toHaveBeenCalled();
  });

  it('ArrowUp when dropdown is open via mouse click navigates from last item (lines 705-707)', async () => {
    // Setup: dropdown is already open (opened via mouse), currentIndex is -1
    const { mockTrigger } = createKeyboardNavTestSetup(mocks, {
      dropdownOpen: true,
      menuItemCount: 3,
    });

    await wireFlavorSelector(document, window);

    const keydownHandler = extractEventHandler(mockTrigger, 'keydown');
    expect(keydownHandler).toBeDefined();

    // Press ArrowUp - should navigate using startIndex = menuItems.length - 1
    const arrowUpEvent = {
      key: 'ArrowUp',
      preventDefault: vi.fn(),
    };
    keydownHandler!(arrowUpEvent);

    expect(arrowUpEvent.preventDefault).toHaveBeenCalled();
  });

  it('Enter/Space on trigger when dropdown is already open closes it (line 676)', async () => {
    // Setup: dropdown is already open
    const { mockDropdown, mockTrigger } = createKeyboardNavTestSetup(mocks, {
      dropdownOpen: true,
      menuItemCount: 0, // No menu items needed for this test
    });

    // Configure toggle to return false (closing)
    mockDropdown.classList.toggle = vi.fn(() => false);

    await wireFlavorSelector(document, window);

    const keydownHandler = extractEventHandler(mockTrigger, 'keydown');
    expect(keydownHandler).toBeDefined();

    // Press Enter when dropdown is already open - should close it
    const enterEvent = {
      key: 'Enter',
      preventDefault: vi.fn(),
    };
    keydownHandler!(enterEvent);

    expect(enterEvent.preventDefault).toHaveBeenCalled();
    expect(mockDropdown.classList.toggle).toHaveBeenCalled();
  });
});
