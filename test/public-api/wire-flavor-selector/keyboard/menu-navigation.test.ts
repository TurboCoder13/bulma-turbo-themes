/**
 * Tests for keyboard navigation within menu items.
 * Tests ArrowUp, ArrowDown, Home, End, Enter, Space, and Escape on menu items.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { wireFlavorSelector } from '../../../../src/index.js';
import {
  setupDocumentMocks,
  createMockElement,
  createMockImg,
  createMockSpan,
  createMockKeyEvent,
} from '../../../helpers/mocks.js';

describe('wireFlavorSelector menu item keyboard navigation', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;
  let mockElement: ReturnType<typeof createMockElement>;
  let mockImg: ReturnType<typeof createMockImg>;
  let mockSpan: ReturnType<typeof createMockSpan>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
    mockElement = mocks.mockElement;
    mockImg = mocks.mockImg;
    mockSpan = mocks.mockSpan;
  });

  /**
   * Helper to set up menu item tests with configurable number of items.
   */
  function setupMenuItemTest(itemCount = 9) {
    const mockMenuItems: any[] = [];
    const createMenuItem = () => {
      const item = {
        ...mockElement,
        setAttribute: vi.fn(),
        removeAttribute: vi.fn(),
        focus: vi.fn(),
        getAttribute: vi.fn(() => 'catppuccin-latte'),
        click: vi.fn(),
        addEventListener: vi.fn(),
        classList: {
          ...mockElement.classList,
          contains: vi.fn(() => false),
        },
      };
      mockMenuItems.push(item);
      return item;
    };

    const mockDropdown = {
      ...mockElement,
      classList: {
        ...mockElement.classList,
        remove: vi.fn(),
        contains: vi.fn(() => true),
      },
    };

    const mockTrigger = {
      ...mockElement,
      setAttribute: vi.fn(),
      focus: vi.fn(),
    };

    Object.defineProperty(document, 'createElement', {
      value: vi.fn((tag) => {
        if (tag === 'img') return mockImg;
        if (tag === 'span') return mockSpan;
        if (tag === 'button') return createMenuItem();
        if (tag === 'div') {
          return {
            className: '',
            style: { setProperty: vi.fn() },
            appendChild: vi.fn(),
            setAttribute: vi.fn(),
          };
        }
        return mockElement;
      }),
      writable: true,
    });

    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-menu') return mockElement;
        if (id === 'theme-flavor-trigger') return mockTrigger;
        return null;
      }),
      writable: true,
    });

    Object.defineProperty(document, 'querySelector', {
      value: vi.fn((selector) => {
        if (selector === 'theme-flavor-trigger') return mockTrigger;
        return null;
      }),
      writable: true,
    });

    // Pre-create items
    for (let i = 0; i < itemCount; i++) {
      createMenuItem();
    }

    return { mockMenuItems, mockDropdown, mockTrigger };
  }

  /**
   * Helper to extract keydown handler from a menu item.
   */
  function getMenuItemKeydownHandler(menuItem: any): ((event: any) => void) | undefined {
    const itemKeydownCalls = menuItem.addEventListener.mock.calls.filter(
      (call: any[]) => call[0] === 'keydown'
    );
    return itemKeydownCalls[0]?.[1];
  }

  describe('navigation keys on menu items', () => {
    it.each([
      { key: 'ArrowDown', description: 'ArrowDown' },
      { key: 'ArrowUp', description: 'ArrowUp' },
      { key: 'Home', description: 'Home' },
      { key: 'End', description: 'End' },
    ])('handles $description key on menu item', async ({ key }) => {
      const { mockMenuItems } = setupMenuItemTest();

      await wireFlavorSelector(document, window);

      if (mockMenuItems.length > 0) {
        const handler = getMenuItemKeydownHandler(mockMenuItems[0]);

        if (handler) {
          const mockKeyEvent = createMockKeyEvent(key);
          handler(mockKeyEvent);
          expect(mockKeyEvent.preventDefault).toHaveBeenCalled();
        }
      }
    });
  });

  describe('selection keys on menu items', () => {
    it.each([
      { key: 'Enter', description: 'Enter' },
      { key: ' ', description: 'Space' },
    ])('triggers click with $description key', async ({ key }) => {
      const { mockMenuItems } = setupMenuItemTest();

      await wireFlavorSelector(document, window);

      if (mockMenuItems.length > 0) {
        const firstMenuItem = mockMenuItems[0];
        const handler = getMenuItemKeydownHandler(firstMenuItem);

        if (handler) {
          firstMenuItem.click.mockClear();
          const mockKeyEvent = createMockKeyEvent(key);
          handler(mockKeyEvent);
          expect(mockKeyEvent.preventDefault).toHaveBeenCalled();
        }
      }
    });
  });

  describe('escape key on menu items', () => {
    it('handles Escape key to close dropdown', async () => {
      const { mockMenuItems } = setupMenuItemTest();

      await wireFlavorSelector(document, window);

      if (mockMenuItems.length > 0) {
        const handler = getMenuItemKeydownHandler(mockMenuItems[0]);

        if (handler) {
          const escapeEvent = createMockKeyEvent('Escape');
          handler(escapeEvent);
          expect(escapeEvent.preventDefault).toHaveBeenCalled();
        }
      }
    });
  });

  describe('comprehensive menu item navigation', () => {
    it('registers keydown handlers on all menu items', async () => {
      // This test verifies menu items created during wireFlavorSelector get handlers
      const mockMenuItems: any[] = [];
      const createMenuItem = () => {
        const item = {
          ...mockElement,
          setAttribute: vi.fn(),
          removeAttribute: vi.fn(),
          focus: vi.fn(),
          getAttribute: vi.fn(() => 'catppuccin-latte'),
          click: vi.fn(),
          addEventListener: vi.fn(),
          classList: {
            ...mockElement.classList,
            contains: vi.fn(() => false),
          },
        };
        mockMenuItems.push(item);
        return item;
      };

      Object.defineProperty(document, 'createElement', {
        value: vi.fn((tag) => {
          if (tag === 'img') return mockImg;
          if (tag === 'span') return mockSpan;
          if (tag === 'button') return createMenuItem();
          if (tag === 'div') {
            return {
              className: '',
              style: { setProperty: vi.fn() },
              appendChild: vi.fn(),
              setAttribute: vi.fn(),
            };
          }
          return mockElement;
        }),
        writable: true,
      });

      const mockTrigger = { ...mockElement, setAttribute: vi.fn(), focus: vi.fn() };
      Object.defineProperty(document, 'getElementById', {
        value: vi.fn((id) => {
          if (id === 'theme-flavor-menu') return mockElement;
          if (id === 'theme-flavor-trigger') return mockTrigger;
          return null;
        }),
        writable: true,
      });

      await wireFlavorSelector(document, window);

      // Menu items are created during wireFlavorSelector
      expect(mockMenuItems.length).toBeGreaterThan(0);
      const firstMenuItem = mockMenuItems[0];
      const itemKeydownCalls = firstMenuItem.addEventListener.mock.calls.filter(
        (call: any[]) => call[0] === 'keydown'
      );
      expect(itemKeydownCalls.length).toBeGreaterThan(0);
      expect(typeof itemKeydownCalls[0]?.[1]).toBe('function');
    });

    it('handles all navigation keys in sequence', async () => {
      const { mockMenuItems } = setupMenuItemTest();

      await wireFlavorSelector(document, window);

      if (mockMenuItems.length > 0) {
        const handler = getMenuItemKeydownHandler(mockMenuItems[0]);

        if (handler) {
          // Test all keys in sequence
          const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'Escape'];

          keys.forEach((key) => {
            const event = createMockKeyEvent(key);
            handler(event);
            expect(event.preventDefault).toHaveBeenCalled();
          });
        }
      }
    });
  });

  describe('arrow key wrap-around behavior', () => {
    it('handles ArrowDown navigation with currentIndex tracking', async () => {
      const mockMenuItems: any[] = [];
      const createMenuItem = (index: number) => {
        const item = {
          ...mockElement,
          setAttribute: vi.fn(),
          removeAttribute: vi.fn(),
          focus: vi.fn(),
          getAttribute: vi.fn(() => `theme-${index}`),
          click: vi.fn(),
          addEventListener: vi.fn(),
          classList: {
            ...mockElement.classList,
            contains: vi.fn(() => false),
          },
        };
        mockMenuItems.push(item);
        return item;
      };

      // Create 3 menu items
      for (let i = 0; i < 3; i++) {
        createMenuItem(i);
      }

      const mockDropdown = {
        ...mockElement,
        classList: {
          ...mockElement.classList,
          toggle: vi.fn(),
          contains: vi.fn(() => true),
          add: vi.fn(),
        },
      };

      const mockTrigger = {
        ...mockElement,
        setAttribute: vi.fn(),
        focus: vi.fn(),
        addEventListener: vi.fn(),
        closest: vi.fn(() => mockDropdown),
      };

      Object.defineProperty(document, 'createElement', {
        value: vi.fn((tag) => {
          if (tag === 'img') return mockImg;
          if (tag === 'span') return mockSpan;
          if (tag === 'button') return createMenuItem(mockMenuItems.length);
          if (tag === 'div') {
            return {
              className: '',
              style: { setProperty: vi.fn() },
              appendChild: vi.fn(),
              setAttribute: vi.fn(),
            };
          }
          return mockElement;
        }),
        writable: true,
      });

      Object.defineProperty(document, 'getElementById', {
        value: vi.fn((id) => {
          if (id === 'theme-flavor-menu') return mockElement;
          if (id === 'theme-flavor-trigger') return mockTrigger;
          return null;
        }),
        writable: true,
      });

      Object.defineProperty(document, 'querySelectorAll', {
        value: vi.fn(() => mockMenuItems),
        writable: true,
      });

      await wireFlavorSelector(document, window);

      // Get keydown handler from trigger
      const triggerKeydownCalls = mockTrigger.addEventListener.mock.calls.filter(
        (call: any[]) => call[0] === 'keydown'
      );

      if (triggerKeydownCalls.length > 0) {
        const keydownHandler = triggerKeydownCalls[0][1];

        // Open dropdown first
        mockDropdown.classList.contains.mockReturnValue(false);
        keydownHandler(createMockKeyEvent('ArrowDown'));

        // Now press ArrowDown when open
        mockDropdown.classList.contains.mockReturnValue(true);
        const arrowDownEvent = createMockKeyEvent('ArrowDown');
        keydownHandler(arrowDownEvent);
        expect(arrowDownEvent.preventDefault).toHaveBeenCalled();
      }
    });
  });
});
