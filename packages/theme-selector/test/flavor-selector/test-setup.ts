/**
 * Shared test setup for flavor-selector tests.
 * Provides common imports, mock setup, and helper functions.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';
import {
  setupDocumentMocks,
  createMockElement,
  createMockDropdownContainer,
  createMockAbortController,
} from '../../../../test/helpers/mocks.js';

export {
  setupDocumentMocks,
  createMockElement,
  createMockDropdownContainer,
  createMockAbortController,
};

export { wireFlavorSelector } from '../../src/index.js';

/**
 * Creates a tracked button element for testing.
 * Returns button and tracks it in the provided array.
 */
export const createTrackedButton = (
  createdButtons: any[],
  themeIdOverride?: string
) => {
  let themeId = themeIdOverride ?? `theme-${createdButtons.length}`;
  const btn = {
    type: '',
    className: '',
    setAttribute: vi.fn((attr: string, value: string) => {
      if (attr === 'data-theme-id') {
        themeId = value;
      }
    }),
    getAttribute: vi.fn((attr: string) => {
      if (attr === 'data-theme-id') {
        return themeId;
      }
      return null;
    }),
    addEventListener: vi.fn(),
    appendChild: vi.fn(),
    focus: vi.fn(),
    click: vi.fn(),
    classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
  };
  createdButtons.push(btn);
  return btn;
};

/**
 * Creates a mock dropdown element with standard methods.
 */
export const createMockDropdownElement = (isActive = false) => ({
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    toggle: vi.fn(),
    contains: vi.fn(() => isActive),
  },
  appendChild: vi.fn(),
  setAttribute: vi.fn(),
  getAttribute: vi.fn(),
  contains: vi.fn(() => false),
});

/**
 * Creates a mock trigger element connected to a dropdown.
 */
export const createMockTriggerElement = (
  mocks: ReturnType<typeof setupDocumentMocks>,
  mockDropdown: ReturnType<typeof createMockDropdownElement>
) => ({
  ...mocks.mockElement,
  addEventListener: vi.fn(),
  closest: vi.fn(() => mockDropdown),
  focus: vi.fn(),
});

/**
 * Creates a standard createElement mock for tracking elements.
 */
export const createElementMock = (
  createdButtons: any[],
  mocks: ReturnType<typeof setupDocumentMocks>,
  options?: {
    themeIdOverride?: string;
    linkHandler?: (link: any) => void;
  }
) => {
  return vi.fn((tag: string) => {
    if (tag === 'button') {
      return createTrackedButton(createdButtons, options?.themeIdOverride);
    }
    if (tag === 'link') {
      let onloadHandler: (() => void) | null = null;
      const link = {
        id: '',
        rel: '',
        type: '',
        href: '',
        setAttribute: vi.fn(),
        set onload(handler: () => void) {
          onloadHandler = handler;
          setTimeout(() => onloadHandler?.(), 0);
        },
        get onload() {
          return onloadHandler;
        },
      };
      options?.linkHandler?.(link);
      return link;
    }
    if (tag === 'div') {
      return {
        className: '',
        style: { setProperty: vi.fn() },
        appendChild: vi.fn(),
        setAttribute: vi.fn(),
      };
    }
    if (tag === 'span') {
      return { textContent: '', className: '', appendChild: vi.fn(), setAttribute: vi.fn() };
    }
    if (tag === 'img') {
      return { src: '', alt: '', width: 0, height: 0 };
    }
    if (tag === 'option') {
      return { value: '', textContent: '', selected: false };
    }
    return mocks.mockElement;
  });
};

// ============================================================================
// Keyboard Navigation Test Factory
// ============================================================================

/**
 * Context returned by setupKeyboardNavTest for use in test assertions.
 */
export interface KeyboardNavTestContext {
  /** Array of created theme buttons */
  createdButtons: any[];
  /** Mock dropdown element */
  mockDropdown: ReturnType<typeof createMockDropdownElement>;
  /** Mock trigger element */
  mockTrigger: ReturnType<typeof createMockTriggerElement>;
  /** Base mocks from setupDocumentMocks */
  mocks: ReturnType<typeof setupDocumentMocks>;
  /**
   * Fire a keydown event on the trigger element.
   * Returns the event's preventDefault mock for assertions.
   */
  fireKeydown: (key: string) => { preventDefault: ReturnType<typeof vi.fn> };
  /**
   * Get the keydown handler registered on the trigger.
   * Returns undefined if no handler was registered.
   */
  getKeydownHandler: () => ((event: any) => void) | undefined;
}

/**
 * Options for configuring keyboard navigation test setup.
 */
export interface KeyboardNavTestOptions {
  /** Whether the dropdown starts in the active/open state */
  dropdownActive?: boolean;
  /** Override theme ID for created buttons */
  themeIdOverride?: string;
  /** Custom link handler callback */
  linkHandler?: (link: any) => void;
}

/**
 * Consolidated setup for keyboard navigation tests.
 *
 * Reduces duplicated mock setup across keyboard-nav.test.ts tests
 * to a single function call with a clean API.
 *
 * @example
 * ```typescript
 * it('handles ArrowDown key navigation', () => {
 *   const ctx = setupKeyboardNavTest();
 *   wireFlavorSelector(document, window);
 *
 *   const { preventDefault } = ctx.fireKeydown('ArrowDown');
 *   expect(preventDefault).toHaveBeenCalled();
 *   expect(ctx.createdButtons[0].focus).toHaveBeenCalled();
 * });
 * ```
 *
 * @param baseMocks - Optional pre-configured mocks from setupDocumentMocks
 * @param options - Configuration options for the test setup
 * @returns Context object with all mocks and helper functions
 */
export function setupKeyboardNavTest(
  baseMocks?: ReturnType<typeof setupDocumentMocks>,
  options: KeyboardNavTestOptions = {}
): KeyboardNavTestContext {
  const mocks = baseMocks ?? setupDocumentMocks();
  const createdButtons: any[] = [];
  const mockDropdown = createMockDropdownElement(options.dropdownActive ?? false);
  const mockTrigger = createMockTriggerElement(mocks, mockDropdown);

  // Setup getElementById mock
  Object.defineProperty(document, 'getElementById', {
    value: vi.fn((id) => {
      if (id === 'theme-flavor-menu') return mockDropdown;
      if (id === 'theme-flavor-trigger') return mockTrigger;
      return null;
    }),
    writable: true,
  });

  // Setup createElement mock
  Object.defineProperty(document, 'createElement', {
    value: createElementMock(createdButtons, mocks, {
      themeIdOverride: options.themeIdOverride,
      linkHandler: options.linkHandler,
    }),
    writable: true,
  });

  // Helper to get the keydown handler
  const getKeydownHandler = (): ((event: any) => void) | undefined => {
    return mockTrigger.addEventListener.mock.calls.find(
      (c: any[]) => c[0] === 'keydown'
    )?.[1] as ((event: any) => void) | undefined;
  };

  // Helper to fire keydown events
  const fireKeydown = (key: string): { preventDefault: ReturnType<typeof vi.fn> } => {
    const handler = getKeydownHandler();
    const preventDefault = vi.fn();
    if (handler) {
      handler({ key, preventDefault } as any);
    }
    return { preventDefault };
  };

  return {
    createdButtons,
    mockDropdown,
    mockTrigger,
    mocks,
    fireKeydown,
    getKeydownHandler,
  };
}
