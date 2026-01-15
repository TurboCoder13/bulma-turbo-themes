/**
 * Shared mock utilities for test files.
 * Centralizes common mock setups to reduce duplication across test files.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';
import type { ThemeFlavor, ThemeTokens } from '../../packages/core/src/themes/types.js';

// ============================================================================
// Theme Token and Flavor Mocks (for CSS generation tests)
// ============================================================================

/**
 * Creates a minimal valid ThemeTokens object for testing.
 * Use overrides to customize specific token values.
 */
export function createMockTokens(overrides: Partial<ThemeTokens> = {}): ThemeTokens {
  return {
    background: {
      base: '#ffffff',
      surface: '#f5f5f5',
      overlay: '#e0e0e0',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      inverse: '#ffffff',
    },
    brand: {
      primary: '#3273dc',
    },
    state: {
      info: '#3e8ed0',
      success: '#48c78e',
      warning: '#ffe08a',
      danger: '#f14668',
    },
    border: {
      default: '#dbdbdb',
    },
    accent: {
      link: '#485fc7',
    },
    typography: {
      fonts: {
        sans: 'Inter, sans-serif',
        mono: 'JetBrains Mono, monospace',
      },
      webFonts: ['https://fonts.googleapis.com/css2?family=Inter'],
    },
    content: {
      heading: {
        h1: '#111111',
        h2: '#222222',
        h3: '#333333',
        h4: '#444444',
        h5: '#555555',
        h6: '#666666',
      },
      body: {
        primary: '#333333',
        secondary: '#666666',
      },
      link: {
        default: '#485fc7',
      },
      selection: {
        fg: '#ffffff',
        bg: '#3273dc',
      },
      blockquote: {
        border: '#dbdbdb',
        fg: '#666666',
        bg: '#f5f5f5',
      },
      codeInline: {
        fg: '#333333',
        bg: '#f5f5f5',
      },
      codeBlock: {
        fg: '#333333',
        bg: '#f5f5f5',
      },
      table: {
        border: '#dbdbdb',
        stripe: '#fafafa',
        theadBg: '#f0f0f0',
      },
    },
    ...overrides,
  };
}

/**
 * Creates a minimal valid ThemeFlavor for testing.
 * Use overrides to customize flavor properties or tokens.
 */
export function createMockFlavor(overrides: Partial<ThemeFlavor> = {}): ThemeFlavor {
  const { tokens: tokenOverrides, ...flavorOverrides } = overrides;
  return {
    id: 'test-theme',
    label: 'Test Theme',
    vendor: 'test',
    appearance: 'light',
    tokens: createMockTokens(tokenOverrides as Partial<ThemeTokens>),
    ...flavorOverrides,
  };
}

// ============================================================================
// Keyboard Test Setup Types and Helpers
// ============================================================================

export interface KeyboardTestMocks {
  mockDropdown: ReturnType<typeof createMockDropdown>;
  mockTrigger: ReturnType<typeof createMockTrigger>;
  mockElement: ReturnType<typeof createMockElement>;
  menuItems: any[];
  mockImg: ReturnType<typeof createMockImg>;
  mockSpan: ReturnType<typeof createMockSpan>;
}

/**
 * Consolidated setup for keyboard navigation tests.
 * Reduces the 30+ duplicated mock setups in keyboard.test.ts to a single call.
 *
 * @param baseMocks - Base mocks from setupDocumentMocks()
 * @param options - Configuration for dropdown state and menu items
 * @returns All mocks needed for keyboard tests
 */
export function setupKeyboardTriggerTest(
  baseMocks: ReturnType<typeof setupDocumentMocks>,
  options: {
    dropdownOpen?: boolean;
    menuItemCount?: number;
    toggleReturnValue?: boolean;
  } = {}
): KeyboardTestMocks {
  const { mockElement, mockImg, mockSpan } = baseMocks;
  const { dropdownOpen = false, menuItemCount = 0, toggleReturnValue } = options;

  // Create dropdown with configurable state
  const mockDropdown = {
    ...mockElement,
    classList: {
      ...mockElement.classList,
      toggle: vi.fn(() => toggleReturnValue ?? !dropdownOpen),
      contains: vi.fn(() => dropdownOpen),
      add: vi.fn(),
      remove: vi.fn(),
    },
    contains: vi.fn(() => false),
  };

  // Create trigger connected to dropdown
  const mockTrigger = {
    ...mockElement,
    setAttribute: vi.fn(),
    focus: vi.fn(),
    addEventListener: vi.fn(),
    closest: vi.fn(() => mockDropdown),
  };

  // Create menu items if needed
  const menuItems = createMockMenuItems(menuItemCount, mockElement);

  // Setup getElementById mock
  Object.defineProperty(document, 'getElementById', {
    value: vi.fn((id) => {
      if (id === 'theme-flavor-menu') return mockElement;
      if (id === 'theme-flavor-trigger') return mockTrigger;
      return null;
    }),
    writable: true,
  });

  // Setup querySelectorAll for menu items
  if (menuItemCount > 0) {
    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => menuItems),
      writable: true,
    });
  }

  return {
    mockDropdown,
    mockTrigger,
    mockElement,
    menuItems,
    mockImg,
    mockSpan,
  };
}

/**
 * Creates a mock keyboard event for testing key handlers.
 */
export function createMockKeyEvent(key: string): { key: string; preventDefault: ReturnType<typeof vi.fn> } {
  return {
    key,
    preventDefault: vi.fn(),
  };
}

/**
 * Mock localStorage implementation
 */
export const createMockLocalStorage = () => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
});

/**
 * Mock classList implementation
 */
export const createMockClassList = () => ({
  add: vi.fn(),
  remove: vi.fn(),
  toggle: vi.fn(),
  contains: vi.fn(),
  forEach: vi.fn(),
});

/**
 * Mock dropdown container for closest() calls
 */
export const createMockDropdownContainer = () => ({
  classList: createMockClassList(),
  setAttribute: vi.fn(),
  getAttribute: vi.fn(),
  contains: vi.fn(() => false),
});

/**
 * Mock DOM element with common properties
 */
export const createMockElement = (
  dropdownContainer?: ReturnType<typeof createMockDropdownContainer>
) => {
  // Cache the default container to maintain reference equality
  const defaultContainer = dropdownContainer ?? createMockDropdownContainer();

  return {
    href: '',
    className: '',
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
    getAttribute: vi.fn(),
    focus: vi.fn(),
    appendChild: vi.fn(),
    addEventListener: vi.fn(),
    removeChild: vi.fn(),
    remove: vi.fn(),
    firstChild: null,
    classList: createMockClassList(),
    contains: vi.fn(),
    closest: vi.fn(() => defaultContainer),
    click: vi.fn(),
    id: '',
    rel: '',
    onload: vi.fn(),
    onerror: vi.fn(),
  };
};

/**
 * Mock image element
 */
export const createMockImg = () => ({
  src: '',
  alt: '',
  title: '',
});

/**
 * Mock span element
 */
export const createMockSpan = () => ({
  textContent: '',
  style: {} as Record<string, string>,
  appendChild: vi.fn(),
  className: '',
  setAttribute: vi.fn(),
});

/**
 * Mock link element for stylesheets
 */
export const createMockLink = () =>
  ({
    href: '',
    id: '',
    remove: vi.fn(),
  }) as { href: string; id: string; remove: ReturnType<typeof vi.fn> };

/**
 * Helper to create a theme link that auto-loads
 */
export const createAutoLoadThemeLink = () => {
  let onloadHandler: (() => void) | null = null;
  let onerrorHandler: (() => void) | null = null;

  const mockThemeLink = {
    id: '',
    rel: 'stylesheet',
    href: '',
    setAttribute: vi.fn(),
    remove: vi.fn(),
    set onload(handler: () => void) {
      onloadHandler = handler;
      // Trigger immediately in next tick to simulate successful loading
      setTimeout(() => {
        if (onloadHandler) {
          onloadHandler();
        }
      }, 0);
    },
    get onload() {
      return onloadHandler || (() => {});
    },
    set onerror(handler: () => void) {
      onerrorHandler = handler;
    },
    get onerror() {
      return onerrorHandler || (() => {});
    },
  };

  return mockThemeLink;
};

/**
 * Helper to setup theme link auto-load in createElement.
 * Returns a cleanup function to restore the original createElement.
 */
export const setupThemeLinkAutoLoad = (
  mockImg = createMockImg(),
  mockSpan = createMockSpan(),
  mockElement = createMockElement()
) => {
  const originalCreateElement = document.createElement.bind(document);

  const baseCreateElement = (tag: string) => {
    if (tag === 'img') return mockImg;
    if (tag === 'span') return mockSpan;
    return mockElement;
  };

  Object.defineProperty(document, 'createElement', {
    value: vi.fn((tag: string) => {
      if (tag === 'link') {
        return createAutoLoadThemeLink();
      }
      return baseCreateElement(tag);
    }),
    writable: true,
    configurable: true,
  });

  // Return cleanup function
  return () => {
    Object.defineProperty(document, 'createElement', {
      value: originalCreateElement,
      writable: true,
      configurable: true,
    });
  };
};

/**
 * Convenience helper that sets up theme loading mocks.
 *
 * Returns an object with:
 * - `link`: The mock theme link element with auto-load behavior
 * - `cleanup`: Function to call in afterEach to restore original behavior
 *
 * @example
 * ```ts
 * const { link, cleanup } = mockThemeLoading();
 * afterEach(() => cleanup());
 * ```
 */
export const mockThemeLoading = (): { link: HTMLLinkElement; cleanup: () => void } => {
  const cleanup = setupThemeLinkAutoLoad();
  const link = createAutoLoadThemeLink();
  return { link, cleanup };
};

// ============================================================================
// Document Mock Setup Functions (SOLID - Single Responsibility)
// ============================================================================

/**
 * Setup localStorage mock on window
 */
export const setupLocalStorageMock = (mockLocalStorage = createMockLocalStorage()) => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
  return mockLocalStorage;
};

/**
 * Setup document.head mock
 */
export const setupDocumentHeadMock = () => {
  const mockHead = { appendChild: vi.fn() };
  Object.defineProperty(document, 'head', {
    value: mockHead,
    writable: true,
  });
  return mockHead;
};

/**
 * Setup document.body mock
 */
export const setupDocumentBodyMock = () => {
  const mockBody = {
    appendChild: vi.fn(),
    contains: vi.fn(() => false),
  };
  Object.defineProperty(document, 'body', {
    value: mockBody,
    writable: true,
    configurable: true,
  });
  return mockBody;
};

/**
 * Setup document.documentElement mock
 */
export const setupDocumentElementMock = (defaultTheme = 'catppuccin-mocha') => {
  const mockDocumentElement = {
    className: '',
    classList: createMockClassList(),
    getAttribute: vi.fn(() => defaultTheme),
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
  };
  Object.defineProperty(document, 'documentElement', {
    value: mockDocumentElement,
    writable: true,
  });
  return mockDocumentElement;
};

/**
 * Setup DOM query mocks (getElementById, querySelectorAll, addEventListener)
 */
export const setupDomQueryMocks = (
  mockElement: ReturnType<typeof createMockElement>,
  mockLink: ReturnType<typeof createMockLink>
) => {
  Object.defineProperty(document, 'getElementById', {
    value: vi.fn((id: string) => {
      if (
        id === 'theme-flavor-items' ||
        id === 'theme-flavor-trigger-icon' ||
        id === 'theme-flavor-trigger' ||
        id === 'theme-flavor-menu'
      ) {
        return mockElement;
      }
      if (id === 'theme-flavor-css') {
        return mockLink;
      }
      return null;
    }),
    writable: true,
  });

  Object.defineProperty(document, 'querySelectorAll', {
    value: vi.fn(() => []),
    writable: true,
  });

  Object.defineProperty(document, 'addEventListener', {
    value: vi.fn(),
    writable: true,
  });
};

/**
 * Setup console mocks (warn, error)
 */
export const setupConsoleMocks = () => {
  global.console = {
    ...console,
    warn: vi.fn(),
    error: vi.fn(),
  };
};

/**
 * Setup common document mocks for testing.
 * Composes smaller mock setup functions for full document mocking.
 */
export const setupDocumentMocks = (
  options: {
    mockLocalStorage?: ReturnType<typeof createMockLocalStorage>;
    mockElement?: ReturnType<typeof createMockElement>;
    mockLink?: ReturnType<typeof createMockLink>;
    mockDropdownContainer?: ReturnType<typeof createMockDropdownContainer>;
    defaultTheme?: string;
  } = {}
) => {
  // Create mock instances
  const mockLocalStorage = options.mockLocalStorage ?? createMockLocalStorage();
  const mockDropdownContainer = options.mockDropdownContainer ?? createMockDropdownContainer();
  const mockElement = options.mockElement ?? createMockElement(mockDropdownContainer);
  const mockLink = options.mockLink ?? createMockLink();
  const mockImg = createMockImg();
  const mockSpan = createMockSpan();

  // Setup individual mocks using focused helper functions
  setupDocumentHeadMock();
  setupDocumentBodyMock();
  setupDocumentElementMock(options.defaultTheme);
  setupDomQueryMocks(mockElement, mockLink);
  setupLocalStorageMock(mockLocalStorage);
  setupThemeLinkAutoLoad(mockImg, mockSpan, mockElement);
  setupConsoleMocks();

  return { mockLocalStorage, mockElement, mockLink, mockDropdownContainer, mockImg, mockSpan };
};

/**
 * Mock AbortController for testing
 */
export const createMockAbortController = () => {
  const mockSignal = {
    aborted: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onabort: null as (() => void) | null,
    reason: undefined as unknown,
    throwIfAborted: vi.fn(),
  };

  const mockAbortController = {
    signal: mockSignal,
    abort: vi.fn(() => {
      mockSignal.aborted = true;
    }),
  };

  const MockAbortController = function (this: typeof mockAbortController) {
    Object.assign(this, mockAbortController);
  };

  return { mockAbortController, MockAbortController, mockSignal };
};

/**
 * Mock navbar item
 */
export const createMockNavbarItem = (
  options: {
    href?: string;
    classList?: { add: ReturnType<typeof vi.fn>; remove: ReturnType<typeof vi.fn> };
  } = {}
) => ({
  href: options.href ?? 'http://localhost/components/',
  classList: options.classList ?? { add: vi.fn(), remove: vi.fn() },
  removeAttribute: vi.fn(),
  setAttribute: vi.fn(),
});

/**
 * Extract an event handler from a mock element's addEventListener calls.
 * Useful for testing event handling without triggering real events.
 *
 * @param mockElement - Element with mocked addEventListener
 * @param eventType - Event type to find (e.g., 'click', 'keydown')
 * @returns The event handler function, or undefined if not found
 */
export const extractEventHandler = (
  mockElement: { addEventListener: ReturnType<typeof vi.fn> },
  eventType: string
): ((event: any) => void) | undefined => {
  const calls = mockElement.addEventListener.mock.calls;
  const match = calls.find((call: any[]) => call[0] === eventType);
  return match?.[1] as ((event: any) => void) | undefined;
};

/**
 * Extract an event handler from document.addEventListener calls.
 *
 * @param eventType - Event type to find (e.g., 'click', 'keydown')
 * @returns The event handler function, or undefined if not found
 */
export const extractDocumentEventHandler = (
  eventType: string
): ((event: any) => void) | undefined => {
  const docAddEventListener = document.addEventListener as ReturnType<typeof vi.fn>;
  const calls = docAddEventListener.mock.calls;
  const match = calls.find((call: any[]) => call[0] === eventType);
  return match?.[1] as ((event: any) => void) | undefined;
};

// ============================================================================
// Edge Case Test Helpers
// ============================================================================

/**
 * Creates mock menu items for keyboard navigation tests.
 * Each item has focus, click, getAttribute, and classList methods.
 */
export const createMockMenuItems = (count: number, baseMockElement: ReturnType<typeof createMockElement>) => {
  const items: any[] = [];
  for (let i = 0; i < count; i++) {
    const item = {
      ...baseMockElement,
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
      focus: vi.fn(),
      getAttribute: vi.fn(() => `theme-${i}`),
      click: vi.fn(),
      addEventListener: vi.fn(),
      classList: {
        ...baseMockElement.classList,
        contains: vi.fn(() => false),
      },
    };
    items.push(item);
  }
  return items;
};

/**
 * Creates a mock dropdown that's either open or closed.
 */
export const createMockDropdown = (
  baseMockElement: ReturnType<typeof createMockElement>,
  options: { isOpen?: boolean } = {}
) => ({
  ...baseMockElement,
  classList: {
    ...baseMockElement.classList,
    toggle: vi.fn(),
    contains: vi.fn(() => options.isOpen ?? false),
    add: vi.fn(),
    remove: vi.fn(),
  },
});

/**
 * Creates a mock trigger element for dropdown tests.
 */
export const createMockTrigger = (
  baseMockElement: ReturnType<typeof createMockElement>,
  mockDropdown: ReturnType<typeof createMockDropdown>
) => ({
  ...baseMockElement,
  setAttribute: vi.fn(),
  focus: vi.fn(),
  addEventListener: vi.fn(),
  closest: vi.fn(() => mockDropdown),
});

/**
 * Sets up document.createElement mock for keyboard navigation tests.
 * Returns a function that creates elements based on tag name.
 */
export const setupCreateElementMock = (
  mockImg: ReturnType<typeof createMockImg>,
  mockSpan: ReturnType<typeof createMockSpan>,
  baseMockElement: ReturnType<typeof createMockElement>,
  menuItems: any[]
) => {
  Object.defineProperty(document, 'createElement', {
    value: vi.fn((tag) => {
      if (tag === 'img') return mockImg;
      if (tag === 'span') return mockSpan;
      if (tag === 'button') {
        // Return next menu item or create a new one
        const newItem = {
          ...baseMockElement,
          setAttribute: vi.fn(),
          removeAttribute: vi.fn(),
          focus: vi.fn(),
          getAttribute: vi.fn(() => `theme-${menuItems.length}`),
          click: vi.fn(),
          addEventListener: vi.fn(),
          classList: {
            ...baseMockElement.classList,
            contains: vi.fn(() => false),
          },
        };
        menuItems.push(newItem);
        return newItem;
      }
      if (tag === 'div') {
        return {
          className: '',
          style: { setProperty: vi.fn() },
          appendChild: vi.fn(),
          setAttribute: vi.fn(),
        };
      }
      return baseMockElement;
    }),
    writable: true,
  });
};

/**
 * Sets up document.getElementById mock for keyboard navigation tests.
 */
export const setupGetElementByIdMock = (
  baseMockElement: ReturnType<typeof createMockElement>,
  mockTrigger: ReturnType<typeof createMockTrigger>
) => {
  Object.defineProperty(document, 'getElementById', {
    value: vi.fn((id) => {
      if (id === 'theme-flavor-menu') return baseMockElement;
      if (id === 'theme-flavor-trigger') return mockTrigger;
      return null;
    }),
    writable: true,
  });
};

/**
 * Sets up document.querySelectorAll mock to return menu items.
 */
export const setupQuerySelectorAllMock = (menuItems: any[]) => {
  Object.defineProperty(document, 'querySelectorAll', {
    value: vi.fn(() => menuItems),
    writable: true,
  });
};

/**
 * Complete setup for keyboard navigation edge case tests.
 * Consolidates all the duplicated mock setup from edge-cases.test.ts.
 *
 * @param options - Configuration options
 * @returns All created mocks for assertions
 */
export const createKeyboardNavTestSetup = (
  baseMocks: ReturnType<typeof setupDocumentMocks>,
  options: {
    dropdownOpen?: boolean;
    menuItemCount?: number;
  } = {}
) => {
  const { mockElement, mockImg, mockSpan } = baseMocks;
  const menuItemCount = options.menuItemCount ?? 3;

  // Create menu items
  const menuItems = createMockMenuItems(menuItemCount, mockElement);

  // Create dropdown (open or closed based on options)
  const mockDropdown = createMockDropdown(mockElement, { isOpen: options.dropdownOpen });

  // Create trigger connected to dropdown
  const mockTrigger = createMockTrigger(mockElement, mockDropdown);

  // Setup all document mocks
  setupCreateElementMock(mockImg, mockSpan, mockElement, menuItems);
  setupGetElementByIdMock(mockElement, mockTrigger);
  setupQuerySelectorAllMock(menuItems);

  return {
    menuItems,
    mockDropdown,
    mockTrigger,
  };
};

/**
 * Sets up mocks for baseUrl path construction tests.
 */
export const createBaseUrlTestSetup = (
  baseMocks: ReturnType<typeof setupDocumentMocks>,
  baseUrl: string
) => {
  const { mockElement, mockImg, mockSpan, mockLocalStorage } = baseMocks;
  const mockThemeLink = createAutoLoadThemeLink();
  const mockHead = { appendChild: vi.fn() };

  Object.defineProperty(document.documentElement, 'getAttribute', {
    value: vi.fn((attr) => {
      if (attr === 'data-baseurl') return baseUrl;
      return null;
    }),
    writable: true,
  });

  Object.defineProperty(document, 'head', { value: mockHead, writable: true });

  Object.defineProperty(document, 'getElementById', {
    value: vi.fn((id) => {
      if (id.startsWith('theme-') && id.endsWith('-css')) return null;
      if (id === 'theme-flavor-trigger-icon') return mockElement;
      if (id === 'theme-flavor-menu') return mockElement;
      if (id === 'theme-flavor-trigger') return mockElement;
      return mockElement;
    }),
    writable: true,
  });

  Object.defineProperty(document, 'createElement', {
    value: vi.fn((tag) => {
      if (tag === 'link') return mockThemeLink;
      if (tag === 'img') return mockImg;
      if (tag === 'span') return mockSpan;
      if (tag === 'div') return { ...mockElement, style: { setProperty: vi.fn() } };
      return mockElement;
    }),
    writable: true,
  });

  return {
    mockThemeLink,
    mockHead,
    mockLocalStorage,
    mockElement,
  };
};
