// SPDX-License-Identifier: MIT
/**
 * Shared test setup for dropdown event tests.
 * Provides consolidated mock setup to eliminate duplication across test files.
 */
import { vi, type Mock } from 'vitest';
import type { DropdownElements, DropdownState, DropdownStateManager } from '../../../src/dropdown/state.js';

/**
 * Context returned by setupDropdownEventTest for use in test assertions.
 */
export interface DropdownEventTestContext {
  /** Mock document object */
  mockDocument: Document;
  /** Mock dropdown elements */
  mockElements: DropdownElements;
  /** Mutable dropdown state */
  mockState: DropdownState;
  /** Mock state manager with spies */
  mockStateManager: DropdownStateManager;
  /** AbortController for cleanup */
  abortController: AbortController;
  /** Helper to dispatch keyboard event on trigger */
  dispatchTriggerKeydown: (key: string) => KeyboardEvent;
  /** Helper to dispatch keyboard event on menu item */
  dispatchMenuItemKeydown: (itemIndex: number, key: string) => KeyboardEvent;
  /** Helper to dispatch click on trigger */
  clickTrigger: () => MouseEvent;
}

/**
 * Options for configuring dropdown event test setup.
 */
export interface DropdownEventTestOptions {
  /** Number of menu items to create (default: 3) */
  menuItemCount?: number;
  /** Whether dropdown starts active/open (default: false) */
  startActive?: boolean;
  /** Initial currentIndex value (default: -1) */
  initialIndex?: number;
}

/**
 * Creates a consolidated test setup for dropdown event handlers.
 * Eliminates duplicated beforeEach setup across trigger-events.test.ts
 * and menu-keyboard.test.ts.
 *
 * @example
 * ```typescript
 * let ctx: DropdownEventTestContext;
 *
 * beforeEach(() => {
 *   ctx = setupDropdownEventTest();
 * });
 *
 * afterEach(() => {
 *   ctx.abortController.abort();
 *   document.body.innerHTML = '';
 *   vi.clearAllMocks();
 * });
 *
 * it('toggles dropdown on click', () => {
 *   wireDropdownEventHandlers(ctx.mockDocument, ctx.mockElements, ctx.mockState, ctx.mockStateManager, ctx.abortController);
 *   ctx.clickTrigger();
 *   expect(ctx.mockStateManager.toggleDropdown).toHaveBeenCalled();
 * });
 * ```
 */
export function setupDropdownEventTest(
  options: DropdownEventTestOptions = {}
): DropdownEventTestContext {
  const { menuItemCount = 3, startActive = false, initialIndex = -1 } = options;

  const mockDocument = document;

  // Create DOM elements
  const trigger = document.createElement('button');
  trigger.id = 'theme-flavor-trigger';

  const dropdownMenu = document.createElement('div');
  dropdownMenu.id = 'theme-flavor-menu';

  const dropdown = document.createElement('div');
  dropdown.classList.add('dropdown');
  if (startActive) {
    dropdown.classList.add('is-active');
  }
  dropdown.appendChild(trigger);
  dropdown.appendChild(dropdownMenu);
  document.body.appendChild(dropdown);

  // Create menu items
  const menuItems: HTMLElement[] = [];
  for (let i = 0; i < menuItemCount; i++) {
    const item = document.createElement('button');
    item.classList.add('theme-item');
    item.setAttribute('tabindex', '-1');
    item.setAttribute('data-theme-id', `theme-${i}`);
    dropdownMenu.appendChild(item);
    menuItems.push(item);
  }

  const mockElements: DropdownElements = {
    dropdownMenu,
    trigger,
    dropdown,
    selectEl: null,
  };

  const mockState: DropdownState = {
    currentIndex: initialIndex,
    menuItems,
  };

  // Create state manager with mock implementations
  const mockStateManager: DropdownStateManager = {
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
          (mockStateManager.focusMenuItem as Mock)(0);
        }
      }
    }),
    updateAriaExpanded: vi.fn(),
  };

  const abortController = new AbortController();

  // Helper functions
  const dispatchTriggerKeydown = (key: string): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
    });
    mockElements.trigger.dispatchEvent(event);
    return event;
  };

  const dispatchMenuItemKeydown = (itemIndex: number, key: string): KeyboardEvent => {
    const item = mockState.menuItems[itemIndex];
    if (!item) {
      throw new Error(`Menu item at index ${itemIndex} does not exist`);
    }
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
    });
    item.dispatchEvent(event);
    return event;
  };

  const clickTrigger = (): MouseEvent => {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    mockElements.trigger.dispatchEvent(event);
    return event;
  };

  return {
    mockDocument,
    mockElements,
    mockState,
    mockStateManager,
    abortController,
    dispatchTriggerKeydown,
    dispatchMenuItemKeydown,
    clickTrigger,
  };
}

/**
 * Standard cleanup function for dropdown event tests.
 * Call in afterEach to ensure proper cleanup.
 */
export function cleanupDropdownEventTest(ctx: DropdownEventTestContext): void {
  ctx.abortController.abort();
  document.body.innerHTML = '';
  vi.clearAllMocks();
}
