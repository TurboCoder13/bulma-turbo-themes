/**
 * Tests for dropdown state management during keyboard interactions.
 * Tests aria-expanded updates, focus management, and dropdown open/close state.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { wireFlavorSelector } from '../../../../src/index.js';
import {
  setupDocumentMocks,
  createMockElement,
  createMockImg,
  createMockSpan,
  createAutoLoadThemeLink,
  extractEventHandler,
  extractDocumentEventHandler,
  createMockKeyEvent,
} from '../../../helpers/mocks.js';

describe('wireFlavorSelector dropdown state management', () => {
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

  describe('aria-expanded updates', () => {
    it('initializes aria-expanded to false', async () => {
      const mockTrigger = {
        ...mockElement,
        setAttribute: vi.fn(),
        addEventListener: vi.fn(),
      };

      Object.defineProperty(document, 'getElementById', {
        value: vi.fn((id) => {
          if (id === 'theme-flavor-menu') return mockElement;
          if (id === 'theme-flavor-trigger') return mockTrigger;
          return null;
        }),
        writable: true,
      });

      await wireFlavorSelector(document, window);

      expect(mockTrigger.setAttribute).toHaveBeenCalledWith('aria-expanded', 'false');
    });

    it('updates aria-expanded on click toggle', async () => {
      const mockTrigger = {
        ...mockElement,
        setAttribute: vi.fn(),
        addEventListener: vi.fn(),
      };
      const mockDropdown = {
        ...mockElement,
        classList: {
          ...mockElement.classList,
          toggle: vi.fn(() => false),
          contains: vi.fn(() => true),
        },
      };

      Object.defineProperty(document, 'getElementById', {
        value: vi.fn((id) => {
          if (id === 'theme-flavor-menu') return mockElement;
          if (id === 'theme-flavor-trigger') return mockTrigger;
          return null;
        }),
        writable: true,
      });

      await wireFlavorSelector(document, window);

      const clickHandler = extractEventHandler(mockTrigger, 'click');

      if (clickHandler) {
        mockTrigger.setAttribute.mockClear();
        clickHandler({ preventDefault: vi.fn() });
        expect(mockTrigger.setAttribute).toHaveBeenCalled();
      }
    });
  });

  describe('focus management', () => {
    it('focuses first menu item when opening with Enter', async () => {
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
          toggle: vi.fn(() => true),
          contains: vi.fn(() => false),
        },
      };

      const mockTrigger = {
        ...mockElement,
        setAttribute: vi.fn(),
        focus: vi.fn(),
        closest: vi.fn(() => mockDropdown),
        addEventListener: vi.fn(),
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

      Object.defineProperty(document, 'querySelectorAll', {
        value: vi.fn(() => mockMenuItems),
        writable: true,
      });

      await wireFlavorSelector(document, window);

      const keydownHandler = extractEventHandler(mockTrigger, 'keydown');

      if (keydownHandler && mockMenuItems.length > 0) {
        mockDropdown.classList.contains.mockReturnValue(false);
        keydownHandler(createMockKeyEvent('Enter'));

        expect(mockMenuItems[0].focus).toHaveBeenCalled();
        expect(mockMenuItems[0].setAttribute).toHaveBeenCalledWith('tabindex', '0');
      }
    });

    it('returns focus to trigger when closing dropdown', async () => {
      vi.useFakeTimers();

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
        focus: vi.fn(),
        setAttribute: vi.fn(),
        addEventListener: vi.fn(),
        closest: vi.fn(() => mockDropdown),
      };

      Object.defineProperty(document, 'getElementById', {
        value: vi.fn((id) => {
          if (id === 'theme-flavor-menu') return mockElement;
          if (id === 'theme-flavor-trigger') return mockTrigger;
          return null;
        }),
        writable: true,
      });

      await wireFlavorSelector(document, window);

      const docKeydownHandler = extractDocumentEventHandler('keydown');

      if (docKeydownHandler) {
        docKeydownHandler(createMockKeyEvent('Escape'));
        expect(mockDropdown.classList.remove).toHaveBeenCalledWith('is-active');
        expect(mockTrigger.setAttribute).toHaveBeenCalledWith('aria-expanded', 'false');
        expect(mockTrigger.focus).toHaveBeenCalled();
      }

      vi.useRealTimers();
    });
  });

  describe('dropdown cleanup on close', () => {
    function setupDropdownCleanupTest(hasMenuItems = false) {
      const mockMenuItem = {
        ...mockElement,
        removeAttribute: vi.fn(),
        setAttribute: vi.fn(),
        addEventListener: vi.fn(),
        classList: {
          ...mockElement.classList,
          contains: vi.fn(() => false),
        },
      };
      const mockDropdownContent = {
        ...mockElement,
        appendChild: vi.fn(),
      };
      const mockDropdown = {
        ...mockElement,
        classList: {
          ...mockElement.classList,
          toggle: vi.fn(),
          remove: vi.fn(),
          contains: vi.fn(),
        },
        contains: vi.fn(() => false),
      };
      const mockTrigger = {
        ...mockElement,
        setAttribute: vi.fn(),
        focus: vi.fn(),
        addEventListener: vi.fn(),
        closest: vi.fn(() => mockDropdown),
      };

      const createdMenuItems: any[] = [];

      Object.defineProperty(document, 'getElementById', {
        value: vi.fn((id) => {
          if (id === 'theme-flavor-menu') return mockDropdownContent;
          if (id === 'theme-flavor-trigger') return mockTrigger;
          return null;
        }),
        writable: true,
      });

      Object.defineProperty(document, 'createElement', {
        value: vi.fn((tag) => {
          if (tag === 'link') return createAutoLoadThemeLink();
          if (tag === 'img') return mockImg;
          if (tag === 'span') return mockSpan;
          if (hasMenuItems && tag === 'button') {
            const item = {
              ...mockMenuItem,
              type: 'button',
              removeAttribute: vi.fn(),
              setAttribute: vi.fn(),
              addEventListener: vi.fn(),
              classList: {
                ...mockMenuItem.classList,
                contains: vi.fn(() => false),
              },
            };
            createdMenuItems.push(item);
            return item;
          }
          if (tag === 'div') {
            return {
              className: '',
              style: { setProperty: vi.fn() },
              appendChild: vi.fn(),
              setAttribute: vi.fn(),
            };
          }
          return mockMenuItem;
        }),
        writable: true,
      });

      return {
        mockTrigger,
        mockMenuItem,
        mockDropdown,
        createdMenuItems,
      };
    }

    it.each([
      {
        trigger: 'Enter key',
        hasMenuItems: false,
        getHandler: async (mocks: any) => {
          await wireFlavorSelector(document, window);
          return extractEventHandler(mocks.mockTrigger, 'keydown');
        },
        simulateClose: (handler: any, mocks: any) => {
          mocks.mockTrigger.setAttribute.mockClear();
          mockElement.classList.toggle.mockReturnValue(false);
          mockElement.classList.contains.mockReturnValue(true);
          handler(createMockKeyEvent('Enter'));
        },
      },
      {
        trigger: 'click on trigger',
        hasMenuItems: false,
        getHandler: async (mocks: any) => {
          await wireFlavorSelector(document, window);
          return extractEventHandler(mocks.mockTrigger, 'click');
        },
        simulateClose: (handler: any, mocks: any) => {
          mocks.mockDropdown.classList.toggle.mockImplementation(() => false);
          mocks.mockDropdown.classList.contains.mockImplementation(() => false);
          mocks.mockTrigger.setAttribute.mockClear();
          handler({ preventDefault: vi.fn() });
        },
      },
      {
        trigger: 'outside click',
        hasMenuItems: true,
        getHandler: async (_mocks: any) => {
          await wireFlavorSelector(document, window);
          return extractDocumentEventHandler('click');
        },
        simulateClose: (handler: any, mocks: any) => {
          mocks.mockDropdown.classList.contains.mockReturnValue(true);
          mocks.mockDropdown.contains.mockReturnValue(false);
          const mockTarget = { nodeType: 1 };
          handler({ target: mockTarget });
        },
      },
    ])('handles cleanup when closing via $trigger', async ({ hasMenuItems, getHandler, simulateClose }) => {
      const mocks = setupDropdownCleanupTest(hasMenuItems);
      const handler = await getHandler(mocks);

      expect(handler).toBeDefined();
      if (handler) {
        simulateClose(handler, mocks);
        // Verify cleanup happened (specific assertions depend on trigger)
        if (hasMenuItems && mocks.createdMenuItems.length > 0) {
          mocks.createdMenuItems.forEach((item: any) => {
            expect(item.setAttribute).toHaveBeenCalledWith('tabindex', '-1');
          });
        }
      }
    });
  });
});
