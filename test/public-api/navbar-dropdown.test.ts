/**
 * Tests for navbar reports dropdown and error handling.
 * Tests reports path highlighting and URL error handling.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initNavbar, initTheme, wireFlavorSelector } from '../../src/index.js';
import {
  setupDocumentMocks,
  createMockLink,
  setupThemeLinkAutoLoad,
} from '../helpers/mocks.js';

describe('initNavbar - reports dropdown', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();

    // Default querySelector mock
    Object.defineProperty(document, 'querySelector', {
      value: vi.fn(() => null),
      writable: true,
    });

    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => []),
      writable: true,
    });
  });

  it('highlights reports dropdown when on /coverage path', () => {
    Object.defineProperty(document, 'location', {
      value: { pathname: '/coverage' },
      writable: true,
    });

    const mockReportsLink = {
      classList: { add: vi.fn(), remove: vi.fn() },
    } as any;

    Object.defineProperty(document, 'querySelector', {
      value: vi.fn((selector) => {
        if (selector === '[data-testid="nav-reports"]') return mockReportsLink;
        return null;
      }),
      writable: true,
    });

    initNavbar(document);

    expect(mockReportsLink.classList.add).toHaveBeenCalledWith('is-active');
    expect(mockReportsLink.classList.remove).not.toHaveBeenCalled();
  });

  it('highlights reports dropdown when on /playwright path', () => {
    Object.defineProperty(document, 'location', {
      value: { pathname: '/playwright' },
      writable: true,
    });

    const mockReportsLink = {
      classList: { add: vi.fn(), remove: vi.fn() },
    } as any;

    Object.defineProperty(document, 'querySelector', {
      value: vi.fn((selector) => {
        if (selector === '[data-testid="nav-reports"]') return mockReportsLink;
        return null;
      }),
      writable: true,
    });

    initNavbar(document);

    expect(mockReportsLink.classList.add).toHaveBeenCalledWith('is-active');
    expect(mockReportsLink.classList.remove).not.toHaveBeenCalled();
  });

  it('highlights reports dropdown when on /lighthouse path', () => {
    Object.defineProperty(document, 'location', {
      value: { pathname: '/lighthouse' },
      writable: true,
    });

    const mockReportsLink = {
      classList: { add: vi.fn(), remove: vi.fn() },
    } as any;

    Object.defineProperty(document, 'querySelector', {
      value: vi.fn((selector) => {
        if (selector === '[data-testid="nav-reports"]') return mockReportsLink;
        return null;
      }),
      writable: true,
    });

    initNavbar(document);

    expect(mockReportsLink.classList.add).toHaveBeenCalledWith('is-active');
    expect(mockReportsLink.classList.remove).not.toHaveBeenCalled();
  });

  it('highlights reports dropdown when path starts with report path', () => {
    Object.defineProperty(document, 'location', {
      value: { pathname: '/coverage/something' },
      writable: true,
    });

    const mockReportsLink = {
      classList: { add: vi.fn(), remove: vi.fn() },
    } as any;

    Object.defineProperty(document, 'querySelector', {
      value: vi.fn((selector) => {
        if (selector === '[data-testid="nav-reports"]') return mockReportsLink;
        return null;
      }),
      writable: true,
    });

    initNavbar(document);

    expect(mockReportsLink.classList.add).toHaveBeenCalledWith('is-active');
    expect(mockReportsLink.classList.remove).not.toHaveBeenCalled();
  });

  it('removes active class from reports dropdown when not on report path', () => {
    Object.defineProperty(document, 'location', {
      value: { pathname: '/components' },
      writable: true,
    });

    const mockReportsLink = {
      classList: { add: vi.fn(), remove: vi.fn() },
    } as any;

    Object.defineProperty(document, 'querySelector', {
      value: vi.fn((selector) => {
        if (selector === '[data-testid="nav-reports"]') return mockReportsLink;
        return null;
      }),
      writable: true,
    });

    initNavbar(document);

    expect(mockReportsLink.classList.remove).toHaveBeenCalledWith('is-active');
    expect(mockReportsLink.classList.add).not.toHaveBeenCalled();
  });
});

describe('initNavbar - error handling', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;
  let mockLink: ReturnType<typeof createMockLink>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
    mockLink = mocks.mockLink;
  });

  it('handles icon URL constructor error in applyTheme', async () => {
    // Set up DOM elements
    const triggerIconEl: any = {
      firstChild: null,
      removeChild: vi.fn(),
      appendChild: vi.fn(),
    };
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-trigger-icon') return triggerIconEl;
        if (id === 'theme-flavor-css') return mockLink;
        return null;
      }),
      writable: true,
    });

    // Mock URL to throw when resolving icon path
    const OriginalURL = globalThis.URL as any;
    (globalThis as any).URL = vi.fn((input: any, base?: any) => {
      if (typeof input === 'string' && input.includes('assets/img')) {
        throw new Error('bad url');
      }
      return new OriginalURL(input, base);
    }) as any;

    mocks.mockLocalStorage.getItem.mockReturnValue('catppuccin-frappe');
    // Should not reject - await the Promise for proper async testing
    await expect(initTheme(document as any, window as any)).resolves.not.toThrow();

    // Restore URL
    (globalThis as any).URL = OriginalURL as any;
  });

  it('handles URL errors gracefully in wireFlavorSelector dropdown items', async () => {
    const mockElement = mocks.mockElement;

    // Mock URL to throw when resolving paths
    const OriginalURL = globalThis.URL as any;
    (globalThis as any).URL = vi.fn((input: any, base?: any) => {
      if (typeof input === 'string' && input.includes('assets/img')) {
        throw new Error('bad url');
      }
      return new OriginalURL(input, base);
    }) as any;

    // Ensure getElementById returns the necessary elements
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-menu') return mockElement;
        if (id === 'theme-flavor-trigger') return mockElement;
        return null;
      }),
      writable: true,
    });

    await wireFlavorSelector(document, window);

    // Should not throw and should create theme items (buttons instead of anchors)
    expect(document.createElement).toHaveBeenCalledWith('button');
    // Should also create div elements for containers and icons
    expect(document.createElement).toHaveBeenCalledWith('div');
    // Should create span elements for titles and descriptions
    expect(document.createElement).toHaveBeenCalledWith('span');

    // Restore URL
    (globalThis as any).URL = OriginalURL as any;
  });

  it('applyTheme uses text fallback for themes without icons', async () => {
    // Select catppuccin-latte theme
    mocks.mockLocalStorage.getItem.mockReturnValue('catppuccin-latte');
    // Ensure auto-load is set up
    setupThemeLinkAutoLoad();
    await initTheme(document as any, window as any);

    // Verify theme class is applied
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-catppuccin-latte');
  });
});
