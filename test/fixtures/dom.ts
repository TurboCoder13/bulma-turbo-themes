/**
 * DOM element fixtures and factories for tests.
 *
 * Provides standard DOM element structures for testing
 * without depending on jsdom or browser APIs.
 */
import { vi } from 'vitest';

/**
 * Mock classList implementation
 */
export interface MockClassList {
  add: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  toggle: ReturnType<typeof vi.fn>;
  contains: ReturnType<typeof vi.fn>;
  forEach: ReturnType<typeof vi.fn>;
}

export const createMockClassList = (): MockClassList => ({
  add: vi.fn(),
  remove: vi.fn(),
  toggle: vi.fn(),
  contains: vi.fn(),
  forEach: vi.fn(),
});

/**
 * Mock dropdown container for closest() calls
 */
export interface MockDropdownContainer {
  classList: MockClassList;
  setAttribute: ReturnType<typeof vi.fn>;
  getAttribute: ReturnType<typeof vi.fn>;
  contains: ReturnType<typeof vi.fn>;
}

export const createMockDropdownContainer = (): MockDropdownContainer => ({
  classList: createMockClassList(),
  setAttribute: vi.fn(),
  getAttribute: vi.fn(),
  contains: vi.fn(() => false),
});

/**
 * Mock DOM element with common properties
 */
export interface MockElement {
  href: string;
  className: string;
  setAttribute: ReturnType<typeof vi.fn>;
  removeAttribute: ReturnType<typeof vi.fn>;
  getAttribute: ReturnType<typeof vi.fn>;
  focus: ReturnType<typeof vi.fn>;
  appendChild: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeChild: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  firstChild: null | unknown;
  classList: MockClassList;
  contains: ReturnType<typeof vi.fn>;
  closest: ReturnType<typeof vi.fn>;
  click: ReturnType<typeof vi.fn>;
  id: string;
  rel: string;
  onload: ReturnType<typeof vi.fn>;
  onerror: ReturnType<typeof vi.fn>;
}

export const createMockElement = (
  dropdownContainer?: MockDropdownContainer
): MockElement => {
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
export interface MockImg {
  src: string;
  alt: string;
  title: string;
}

export const createMockImg = (): MockImg => ({
  src: '',
  alt: '',
  title: '',
});

/**
 * Mock span element
 */
export interface MockSpan {
  textContent: string;
  style: Record<string, string>;
  appendChild: ReturnType<typeof vi.fn>;
  className: string;
  setAttribute: ReturnType<typeof vi.fn>;
}

export const createMockSpan = (): MockSpan => ({
  textContent: '',
  style: {},
  appendChild: vi.fn(),
  className: '',
  setAttribute: vi.fn(),
});

/**
 * Mock link element for stylesheets
 */
export interface MockLink {
  href: string;
  id: string;
  remove: ReturnType<typeof vi.fn>;
}

export const createMockLink = (): MockLink => ({
  href: '',
  id: '',
  remove: vi.fn(),
});

/**
 * Mock localStorage implementation
 */
export interface MockLocalStorage {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
}

export const createMockLocalStorage = (): MockLocalStorage => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
});

/**
 * Mock navbar item for navigation tests
 */
export interface MockNavbarItem {
  href: string;
  classList: { add: ReturnType<typeof vi.fn>; remove: ReturnType<typeof vi.fn> };
  removeAttribute: ReturnType<typeof vi.fn>;
  setAttribute: ReturnType<typeof vi.fn>;
}

export const createMockNavbarItem = (
  options: {
    href?: string;
    classList?: { add: ReturnType<typeof vi.fn>; remove: ReturnType<typeof vi.fn> };
  } = {}
): MockNavbarItem => ({
  href: options.href ?? 'http://localhost/components/',
  classList: options.classList ?? { add: vi.fn(), remove: vi.fn() },
  removeAttribute: vi.fn(),
  setAttribute: vi.fn(),
});

/**
 * Mock head element
 */
export interface MockHead {
  appendChild: ReturnType<typeof vi.fn>;
}

export const createMockHead = (): MockHead => ({
  appendChild: vi.fn(),
});

/**
 * Mock body element
 */
export interface MockBody {
  appendChild: ReturnType<typeof vi.fn>;
  contains: ReturnType<typeof vi.fn>;
}

export const createMockBody = (): MockBody => ({
  appendChild: vi.fn(),
  contains: vi.fn(() => false),
});

/**
 * Mock documentElement
 */
export interface MockDocumentElement {
  className: string;
  classList: MockClassList;
  getAttribute: ReturnType<typeof vi.fn>;
  setAttribute: ReturnType<typeof vi.fn>;
  removeAttribute: ReturnType<typeof vi.fn>;
}

export const createMockDocumentElement = (
  defaultTheme = 'catppuccin-mocha'
): MockDocumentElement => ({
  className: '',
  classList: createMockClassList(),
  getAttribute: vi.fn(() => defaultTheme),
  setAttribute: vi.fn(),
  removeAttribute: vi.fn(),
});

/**
 * Creates mock menu items for keyboard navigation tests.
 * Each item has focus, click, getAttribute, and classList methods.
 *
 * @param count - Number of menu items to create
 * @returns Array of mock menu items
 */
export const createMockMenuItems = (count: number): MockElement[] => {
  const items: MockElement[] = [];
  for (let i = 0; i < count; i++) {
    const item = createMockElement();
    item.getAttribute = vi.fn(() => `theme-${i}`);
    items.push(item);
  }
  return items;
};

/**
 * Mock keyboard event for testing key handlers
 */
export interface MockKeyboardEvent {
  key: string;
  preventDefault: ReturnType<typeof vi.fn>;
}

export const createMockKeyEvent = (key: string): MockKeyboardEvent => ({
  key,
  preventDefault: vi.fn(),
});

/**
 * Mock AbortController for testing
 */
export interface MockAbortSignal {
  aborted: boolean;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  dispatchEvent: ReturnType<typeof vi.fn>;
  onabort: (() => void) | null;
  reason: unknown;
  throwIfAborted: ReturnType<typeof vi.fn>;
}

export interface MockAbortControllerResult {
  mockAbortController: {
    signal: MockAbortSignal;
    abort: ReturnType<typeof vi.fn>;
  };
  MockAbortController: new () => MockAbortControllerResult['mockAbortController'];
  mockSignal: MockAbortSignal;
}

export const createMockAbortController = (): MockAbortControllerResult => {
  const mockSignal: MockAbortSignal = {
    aborted: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onabort: null,
    reason: undefined,
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
  } as unknown as new () => typeof mockAbortController;

  return { mockAbortController, MockAbortController, mockSignal };
};
