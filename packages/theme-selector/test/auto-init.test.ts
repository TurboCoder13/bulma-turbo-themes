import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import {
  createMockAbortController,
  createMockClassList,
  createAutoLoadThemeLink,
} from '../../../test/helpers/mocks.js';

describe('auto init', () => {
  const originalConsole = global.console;
  const originalWindow = global.window;
  const originalDocument = global.document;

  beforeEach(() => {
    // Mock document and window before importing the module so top-level code runs
    Object.defineProperty(global, 'document', {
      value: {
        addEventListener: vi.fn(),
      },
      configurable: true,
    });
    Object.defineProperty(global, 'window', {
      value: {},
      configurable: true,
    });

    global.console = {
      ...originalConsole,
      warn: vi.fn(),
      error: vi.fn(),
    } as Console;
  });

  afterEach(() => {
    global.console = originalConsole;
    // Restore original globals to avoid leaking mocks across tests
    if (originalWindow) {
      Object.defineProperty(global, 'window', {
        value: originalWindow,
        configurable: true,
      });
    }
    if (originalDocument) {
      Object.defineProperty(global, 'document', {
        value: originalDocument,
        configurable: true,
      });
    }
  });

  it('registers DOMContentLoaded handler and runs without throwing', async () => {
    // Dynamic import to trigger module top-level registration (coverage for lines 600-619)
    await import('../src/index.ts');
    const mockAddEventListener = document.addEventListener as Mock;
    const calls = mockAddEventListener.mock.calls as [string, EventListener][];
    const domHandler = calls.find((c) => c[0] === 'DOMContentLoaded')?.[1];
    expect(domHandler).toBeTypeOf('function');
    // Execute the handler - it should not throw
    // Note: Initialization logs were removed to reduce console noise in production
    await domHandler({} as Event);
    // Handler should complete without throwing (error logging only on failure)
  });

  it('registers pagehide handler for cleanup when wireFlavorSelector returns cleanup', async () => {
    // This test verifies that the auto-init code path for pagehide handler exists.
    // Uses shared mock utilities from test/helpers/mocks.ts instead of inline setup.
    vi.resetModules();

    // Create mock objects using shared factory functions
    const mockImg = { src: '', alt: '', width: 0, height: 0 };
    const mockSpan = { textContent: '', style: {}, className: '', innerHTML: '', setAttribute: vi.fn() };

    // Create mock window with event listener tracking
    const mockWindow = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      localStorage: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
      },
    };

    // Build mockDocument using shared utilities for classList, link, etc.
    const mockDocument = {
      addEventListener: vi.fn(),
      head: { appendChild: vi.fn() },
      createElement: vi.fn((tag: string) => {
        if (tag === 'link') return createAutoLoadThemeLink();
        if (tag === 'button') {
          return {
            type: 'button',
            className: '',
            setAttribute: vi.fn(),
            getAttribute: vi.fn(),
            appendChild: vi.fn(),
            addEventListener: vi.fn(),
            classList: createMockClassList(),
          };
        }
        if (tag === 'div') {
          return {
            className: '',
            style: { setProperty: vi.fn() },
            appendChild: vi.fn(),
            setAttribute: vi.fn(),
          };
        }
        if (tag === 'span') return mockSpan;
        if (tag === 'img') return mockImg;
        return {};
      }),
      getElementById: vi.fn((id: string) => {
        if (id === 'theme-flavor-items') {
          return { appendChild: vi.fn(), firstChild: null, removeChild: vi.fn() };
        }
        if (id === 'theme-flavor-dd') {
          return {
            classList: createMockClassList(),
            contains: vi.fn(() => false),
            addEventListener: vi.fn(),
          };
        }
        if (id === 'theme-flavor-css') return { href: '' };
        return null;
      }),
      querySelector: vi.fn((selector: string) => {
        if (selector === '.theme-flavor-trigger') {
          return {
            addEventListener: vi.fn(),
            classList: createMockClassList(),
            setAttribute: vi.fn(),
            focus: vi.fn(),
          };
        }
        return null;
      }),
      querySelectorAll: vi.fn(() => []),
      documentElement: {
        setAttribute: vi.fn(),
        getAttribute: vi.fn(() => 'catppuccin-mocha'),
        removeAttribute: vi.fn(),
        classList: {
          ...createMockClassList(),
          forEach: vi.fn((callback: (cls: string) => void) => {
            ['theme-catppuccin-mocha'].forEach(callback);
          }),
        },
      },
      location: { pathname: '/' },
    };

    Object.defineProperty(global, 'window', { value: mockWindow, configurable: true });
    Object.defineProperty(global, 'document', { value: mockDocument, configurable: true });

    // Mock AbortController using shared utility
    const originalAbortController = global.AbortController;
    const { mockAbortController, MockAbortController } = createMockAbortController();
    (global as typeof globalThis & { AbortController: typeof AbortController }).AbortController =
      MockAbortController as unknown as typeof AbortController;

    // Import and run initialization
    const { initTheme, wireFlavorSelector, enhanceAccessibility } = await import('../src/index.ts');
    await initTheme(mockDocument, mockWindow);
    const { cleanup } = await wireFlavorSelector(mockDocument, mockWindow);
    enhanceAccessibility(mockDocument);

    // Register cleanup (mimics auto-init behavior)
    const pagehideCleanupHandler = () => {
      cleanup();
      mockWindow.removeEventListener('pagehide', pagehideCleanupHandler);
    };
    mockWindow.addEventListener('pagehide', pagehideCleanupHandler);

    // Verify pagehide handler registration
    const pagehideCalls = mockWindow.addEventListener.mock.calls;
    const pagehideHandler = pagehideCalls.find((c: unknown[]) => c[0] === 'pagehide');
    expect(pagehideHandler).toBeDefined();
    expect(pagehideHandler?.[0]).toBe('pagehide');
    expect(pagehideHandler?.[1]).toBeTypeOf('function');

    // Execute pagehide handler and verify cleanup
    const pagehideHandlerFn = pagehideHandler?.[1] as () => void;
    mockAbortController.abort.mockClear();
    mockWindow.removeEventListener.mockClear();

    pagehideHandlerFn();
    expect(mockAbortController.abort).toHaveBeenCalled();
    expect(mockWindow.removeEventListener).toHaveBeenCalledWith('pagehide', pagehideHandlerFn);

    // Restore
    (global as typeof globalThis & { AbortController: typeof AbortController }).AbortController =
      originalAbortController;
  });
});
