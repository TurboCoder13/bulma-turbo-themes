/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('auto init', () => {
  const originalConsole = global.console;
  const originalWindow = global.window as any;
  const originalDocument = global.document as any;

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
    } as any;
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
    // Dynamic import to trigger module top-level registration
    await import('../src/index.ts');
    const calls = (document.addEventListener as any).mock.calls;
    const domHandler = calls.find((c: any[]) => c[0] === 'DOMContentLoaded')?.[1];
    expect(domHandler).toBeTypeOf('function');
    // Execute the handler; it should log warnings but not throw
    domHandler();
    expect((global.console as any).warn).toHaveBeenCalled();
  });

  it('registers pagehide handler for cleanup when wireFlavorSelector returns cleanup', async () => {
    // This test verifies that the auto-init code path for pagehide handler exists
    // (coverage for lines 529-533). The actual execution depends on the runtime environment.
    // We test the code structure by importing and checking that the DOMContentLoaded handler
    // is registered, which contains the pagehide handler registration logic.

    // Clear module cache to ensure fresh import
    vi.resetModules();

    // Mock window and document
    const mockWindow = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      localStorage: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
      },
    };

    const mockConsole = {
      warn: vi.fn(),
      error: vi.fn(),
    };

    const mockAbortController = {
      abort: vi.fn(),
    };

    const mockDocument = {
      addEventListener: vi.fn(),
      getElementById: vi.fn((id) => {
        if (id === 'theme-flavor-items') {
          return {
            appendChild: vi.fn(),
            firstChild: null,
            removeChild: vi.fn(),
          };
        }
        if (id === 'theme-flavor-dd') {
          return {
            classList: {
              toggle: vi.fn(),
              contains: vi.fn(),
              remove: vi.fn(),
              add: vi.fn(),
            },
            contains: vi.fn(() => false),
            addEventListener: vi.fn(),
          };
        }
        if (id === 'theme-flavor-css') {
          return {
            href: '',
          };
        }
        return null;
      }),
      querySelector: vi.fn((selector) => {
        if (selector === '.theme-flavor-trigger') {
          return {
            addEventListener: vi.fn(),
            classList: { toggle: vi.fn(), contains: vi.fn() },
            setAttribute: vi.fn(),
            focus: vi.fn(),
          };
        }
        return null;
      }),
      querySelectorAll: vi.fn(() => []),
      createElement: vi.fn(() => ({
        addEventListener: vi.fn(),
        setAttribute: vi.fn(),
        removeAttribute: vi.fn(),
        getAttribute: vi.fn(),
        focus: vi.fn(),
        click: vi.fn(),
        appendChild: vi.fn(),
        href: '#',
        className: '',
        style: {},
        textContent: '',
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
          toggle: vi.fn(),
          contains: vi.fn(),
        },
      })),
      documentElement: {
        setAttribute: vi.fn(),
        getAttribute: vi.fn(() => 'catppuccin-mocha'),
        removeAttribute: vi.fn(),
      },
      location: { pathname: '/' },
    };

    Object.defineProperty(global, 'window', {
      value: mockWindow,
      configurable: true,
    });

    Object.defineProperty(global, 'document', {
      value: mockDocument,
      configurable: true,
    });

    // Mock AbortController
    const originalAbortController = global.AbortController;
    const MockAbortController = function () {
      return mockAbortController;
    };
    (global as any).AbortController = MockAbortController;

    global.console = { ...originalConsole, ...mockConsole } as any;

    // Import the module to trigger auto-init
    await import('../src/index.ts');

    // Find and execute DOMContentLoaded handler
    const domCalls = (mockDocument.addEventListener as any).mock.calls;
    const domHandler = domCalls.find((c: any[]) => c[0] === 'DOMContentLoaded')?.[1];

    // Verify DOMContentLoaded handler was registered
    expect(domHandler).toBeDefined();
    expect(domHandler).toBeTypeOf('function');

    // Execute the handler to trigger pagehide handler registration
    domHandler();

    // Verify pagehide handler was registered
    const pagehideCalls = (mockWindow.addEventListener as any).mock.calls;
    const pagehideHandler = pagehideCalls.find((c: any[]) => c[0] === 'pagehide');
    expect(pagehideHandler).toBeDefined();
    expect(pagehideHandler?.[0]).toBe('pagehide');
    expect(pagehideHandler?.[1]).toBeTypeOf('function');

    // Actually execute the pagehide handler to test lines 530-532
    const pagehideHandlerFn = pagehideHandler?.[1];
    expect(pagehideHandlerFn).toBeDefined();

    // Clear previous calls
    mockAbortController.abort.mockClear();
    mockWindow.removeEventListener.mockClear();

    // Execute the pagehide handler (coverage for lines 530-532)
    if (pagehideHandlerFn) {
      pagehideHandlerFn();

      // Verify cleanup() was called (coverage for line 530)
      expect(mockAbortController.abort).toHaveBeenCalled();

      // Verify removeEventListener was called (coverage for line 531)
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith('pagehide', pagehideHandlerFn);
    }

    // Restore AbortController
    (global as any).AbortController = originalAbortController;
  });
});
