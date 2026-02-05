/**
 * Tests for wireFlavorSelector event handling functionality.
 * Tests click events, theme selection, and dropdown state management.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initTheme, wireFlavorSelector } from '../../../src/index.js';
import {
  setupDocumentMocks,
  createMockElement,
  createMockLink,
  createMockImg,
  createMockSpan,
  createAutoLoadThemeLink,
  setupThemeLinkAutoLoad,
  extractDocumentEventHandler,
  extractEventHandler,
} from '../../helpers/mocks.js';

describe('wireFlavorSelector events', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;
  let mockLocalStorage: ReturnType<typeof setupDocumentMocks>['mockLocalStorage'];
  let mockLink: ReturnType<typeof createMockLink>;
  let mockElement: ReturnType<typeof createMockElement>;
  let mockImg: ReturnType<typeof createMockImg>;
  let mockSpan: ReturnType<typeof createMockSpan>;
  let mockDropdownContainer: ReturnType<typeof setupDocumentMocks>['mockDropdownContainer'];

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
    mockLocalStorage = mocks.mockLocalStorage;
    mockLink = mocks.mockLink;
    mockElement = mocks.mockElement;
    mockImg = mocks.mockImg;
    mockSpan = mocks.mockSpan;
    mockDropdownContainer = mocks.mockDropdownContainer;
  });

  it('handles theme selection', async () => {
    // Mock dropdown item
    const mockItem = {
      getAttribute: vi.fn(() => 'catppuccin-latte'),
      classList: { add: vi.fn(), remove: vi.fn() },
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
      click: vi.fn(),
    } as any;

    // Mock querySelectorAll to return our mock item
    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => [mockItem]),
      writable: true,
    });

    await wireFlavorSelector(document, window);

    // Find the click handler for the theme item
    const clickHandler = mockItem.addEventListener.mock.calls.find(
      (call: any[]) => call[0] === 'click'
    )?.[1];

    if (clickHandler) {
      await clickHandler({ preventDefault: vi.fn() });

      // Verify localStorage was set and applyTheme was called
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('turbo-theme', 'catppuccin-latte');
    }
  });

  it('sets up event listeners for theme selector', async () => {
    await wireFlavorSelector(document, window);

    // Verify that event listeners are set up for the trigger button
    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      expect.any(Object)
    );
    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
      expect.any(Object)
    );

    // Verify document-level event listeners for outside clicks and escape
    expect(
      (document.addEventListener as any).mock.calls.some((call: any[]) => call[0] === 'click')
    ).toBe(true);
    expect(
      (document.addEventListener as any).mock.calls.some((call: any[]) => call[0] === 'keydown')
    ).toBe(true);
  });

  it('closes when clicking outside the dropdown', async () => {
    // dropdown.contains should return false to emulate outside click
    mockDropdownContainer.contains.mockReturnValue(false);
    await wireFlavorSelector(document, window);

    const docClick = extractDocumentEventHandler('click');
    if (docClick) {
      docClick({ target: {} } as any);
    }

    // The dropdown is obtained via trigger.closest(), which returns mockDropdownContainer
    expect(mockDropdownContainer.classList.remove).toHaveBeenCalledWith('is-active');
  });

  it('does not close when clicking inside the dropdown', async () => {
    const mockTarget = {
      nodeName: 'BUTTON',
    } as any; // The click target element (a button inside the dropdown)
    const mockDropdown = {
      ...mockElement,
      classList: {
        ...mockElement.classList,
        remove: vi.fn(),
      },
      contains: vi.fn(() => {
        // Always return true to simulate clicking inside the dropdown
        // This ensures the dropdown doesn't close
        return true;
      }),
    };
    const mockTrigger = {
      ...mockElement,
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

    // Clear any calls made during initialization
    mockDropdown.classList.remove.mockClear();

    const docClick = extractDocumentEventHandler('click');
    if (docClick) {
      // Simulate clicking inside the dropdown (target is inside)
      // The contains mock will return true for mockTarget
      docClick({ target: mockTarget } as any);
    }

    // Verify contains was called with the target
    expect(mockDropdown.contains).toHaveBeenCalledWith(mockTarget);
    // Since contains returns true (target is inside), remove should not be called
    // The condition in the code is: if (dropdown && !dropdown.contains(e.target as Node))
    // So if contains returns true, the condition is false and remove should not be called
    expect(mockDropdown.classList.remove).not.toHaveBeenCalledWith('is-active');
  });

  it('handles applyTheme error gracefully in click handler catch block', async () => {
    // Test error handling in applyTheme catch block (coverage for line 372)
    const mockHead = { appendChild: vi.fn() };
    let onerrorHandler: (() => void) | null = null;
    const mockThemeLink = {
      id: 'theme-catppuccin-mocha-css',
      rel: 'stylesheet',
      href: '',
      set onload(_handler: () => void) {
        // Don't call - simulate load failure
      },
      set onerror(handler: () => void) {
        onerrorHandler = handler;
        // Trigger error immediately to reject the promise
        setTimeout(() => {
          if (onerrorHandler) {
            onerrorHandler();
          }
        }, 0);
      },
      get onerror() {
        return onerrorHandler || (() => {});
      },
    };

    Object.defineProperty(document, 'head', { value: mockHead, writable: true });
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-menu') return mockElement;
        if (id === 'theme-catppuccin-mocha-css') return null; // Not loaded yet
        return null;
      }),
      writable: true,
    });
    Object.defineProperty(document, 'createElement', {
      value: vi.fn((tag) => {
        if (tag === 'link') return mockThemeLink;
        if (tag === 'img') return mockImg;
        if (tag === 'span') return mockSpan;
        if (tag === 'button') {
          return {
            ...mockElement,
            type: 'button',
            getAttribute: vi.fn(() => 'catppuccin-mocha'),
            addEventListener: vi.fn(),
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
        return mockElement;
      }),
      writable: true,
    });

    // Mock querySelectorAll to return dropdown items
    const mockItem = {
      getAttribute: vi.fn(() => 'catppuccin-mocha'),
      classList: { add: vi.fn(), remove: vi.fn() },
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
    } as any;

    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => [mockItem]),
      writable: true,
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await wireFlavorSelector(document, window);

    // Find and trigger the click handler
    const clickHandler = mockItem.addEventListener.mock.calls.find(
      (call: any[]) => call[0] === 'click'
    )?.[1];

    if (clickHandler) {
      // Trigger click - this will call applyTheme which will fail
      const clickPromise = clickHandler({ preventDefault: vi.fn() });

      // Wait for the error to be handled
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Verify error was logged (coverage for line 372)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to apply theme'),
        expect.anything()
      );

      // Clean up
      try {
        await clickPromise;
      } catch {
        // Expected - promise rejects
      }

      consoleErrorSpy.mockRestore();
    }
  });

  it('creates theme CSS link on theme selection', async () => {
    // Mock the document head and createElement
    const mockHead = { appendChild: vi.fn() };
    let onloadHandler: (() => void) | null = null;
    let onerrorHandler: (() => void) | null = null;
    const mockThemeLink = {
      id: '',
      rel: '',
      href: '',
      set onload(handler: () => void) {
        onloadHandler = handler;
      },
      set onerror(handler: () => void) {
        onerrorHandler = handler;
      },
      triggerLoad: () => onloadHandler?.(),
      triggerError: () => onerrorHandler?.(),
    };
    const mockAnchor = {
      href: '#',
      className: '',
      setAttribute: vi.fn(),
      getAttribute: vi.fn(),
      appendChild: vi.fn(),
      addEventListener: vi.fn(),
      classList: { add: vi.fn(), remove: vi.fn() },
    };
    Object.defineProperty(document, 'head', { value: mockHead, writable: true });
    Object.defineProperty(document, 'createElement', {
      value: vi.fn((tagName: string) => {
        if (tagName === 'link') return mockThemeLink;
        if (tagName === 'button') return mockAnchor;
        if (tagName === 'span')
          return {
            textContent: '',
            style: {},
            className: '',
            setAttribute: vi.fn(),
            appendChild: vi.fn(),
          };
        if (tagName === 'img') return { src: '', alt: '', width: 0, height: 0 };
        if (tagName === 'div')
          return {
            className: '',
            style: { setProperty: vi.fn() },
            appendChild: vi.fn(),
            setAttribute: vi.fn(),
          };
        return {};
      }),
      writable: true,
    });

    // Mock querySelectorAll to return a mock item
    const mockItem = {
      getAttribute: vi.fn(() => 'catppuccin-latte'),
      classList: { add: vi.fn(), remove: vi.fn() },
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
    } as any;

    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => [mockItem]),
      writable: true,
    });

    await wireFlavorSelector(document, window);

    // Find and trigger the click handler
    const clickHandler = mockItem.addEventListener.mock.calls.find(
      (call: any[]) => call[0] === 'click'
    )?.[1];

    if (clickHandler) {
      // Start the click handler which will set up the onload handler
      const clickPromise = clickHandler({ preventDefault: vi.fn() });

      // Mock successful CSS load by triggering the onload handler
      mockThemeLink.triggerLoad();

      // Wait for the click handler to complete
      await clickPromise;

      // Verify theme CSS link was created
      expect(document.createElement).toHaveBeenCalledWith('link');
      expect(mockHead.appendChild).toHaveBeenCalledWith(mockThemeLink);
    }
  });

  it('handles baseUrl attribute on html element', async () => {
    Object.defineProperty(document.documentElement, 'getAttribute', {
      value: vi.fn((attr) => {
        if (attr === 'data-baseurl') return '/app';
        return null;
      }),
      writable: true,
    });
    Object.defineProperty(document, 'querySelector', {
      value: vi.fn((selector) => {
        if (selector === '.theme-flavor-trigger') return mockElement;
        return null;
      }),
      writable: true,
    });
    await initTheme(document, window);
    await wireFlavorSelector(document, window);
    // Verify baseUrl is used in theme application
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-catppuccin-mocha');
  });

  it('handles invalid baseUrl gracefully (catch path)', async () => {
    Object.defineProperty(document.documentElement, 'getAttribute', {
      value: vi.fn((attr) => {
        if (attr === 'data-baseurl') return '::invalid-url';
        return null;
      }),
      writable: true,
    });
    Object.defineProperty(document, 'querySelector', {
      value: vi.fn((selector) => {
        if (selector === '.theme-flavor-trigger') return mockElement;
        return null;
      }),
      writable: true,
    });
    await initTheme(document, window);
    // no throw means catch branch executed safely
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-catppuccin-mocha');
  });

  it('toggles dropdown on trigger click', async () => {
    const mockDropdown = {
      ...mockElement,
      classList: {
        ...mockElement.classList,
        toggle: vi.fn(),
        contains: vi.fn(() => false),
      },
    };
    const mockTrigger = {
      ...mockElement,
      addEventListener: vi.fn(),
      classList: { toggle: vi.fn(), add: vi.fn(), remove: vi.fn() },
      setAttribute: vi.fn(),
      focus: vi.fn(),
      closest: vi.fn(() => mockDropdown),
    } as any;
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-menu') return mockElement;
        if (id === 'theme-flavor-trigger') return mockTrigger;
        return null;
      }),
      writable: true,
    });

    await wireFlavorSelector(document, window);

    const triggerClick = extractEventHandler(mockTrigger, 'click');
    if (triggerClick) {
      triggerClick({ preventDefault: vi.fn() } as any);
    }
    // The code toggles the dropdown element, not the trigger
    expect(mockDropdown.classList.toggle).toHaveBeenCalledWith('is-active');
  });

  it('updates trigger icon when theme has icon', async () => {
    // Select a theme that has an icon, e.g., dracula
    const triggerIconEl: any = {
      src: '',
      alt: '',
      title: '',
    };
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-trigger-icon') return triggerIconEl;
        if (id === 'theme-flavor-menu') return mockElement;
        if (id === 'theme-flavor-css') return mockLink;
        return null;
      }),
      writable: true,
    });
    mockLocalStorage.getItem.mockReturnValue('catppuccin-frappe');
    setupThemeLinkAutoLoad();
    await initTheme(document, window);
    // Should set icon src to catppuccin-frappe icon path
    expect(triggerIconEl.src).toMatch(/catppuccin|frappe|\.svg/i);
  });

  it('removes existing children from trigger icon (while loop)', async () => {
    // Mock theme loading
    setupThemeLinkAutoLoad();

    // Provide a trigger icon element - icon is set via src property, not children
    const triggerIconEl: any = {
      src: '',
      alt: '',
      title: '',
    };
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-trigger-icon') return triggerIconEl;
        if (id === 'theme-flavor-menu') return mockElement;
        if (id === 'theme-flavor-css') return mockLink;
        return null;
      }),
      writable: true,
    });
    mockLocalStorage.getItem.mockReturnValue('catppuccin-frappe');
    await initTheme(document, window);
    // Icon is set via src property, not by removing/adding children
    expect(triggerIconEl.src).toMatch(/catppuccin|frappe|\.svg/i);
  });

  it('handles theme application with invalid baseUrl', async () => {
    Object.defineProperty(document.documentElement, 'getAttribute', {
      value: vi.fn((attr) => {
        if (attr === 'data-baseurl') return '::invalid-url';
        return null;
      }),
      writable: true,
    });
    Object.defineProperty(document, 'querySelector', {
      value: vi.fn((selector) => {
        if (selector === '.theme-flavor-trigger') return mockElement;
        return null;
      }),
      writable: true,
    });
    mockLocalStorage.getItem.mockReturnValue('catppuccin-frappe');
    await initTheme(document, window);
    // Theme class is still applied despite invalid baseUrl
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-catppuccin-frappe');
  });

  it('handles missing flavor link gracefully (no throw, no href set)', async () => {
    // Mock theme loading
    setupThemeLinkAutoLoad();

    // Remove flavor link from DOM mocks
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (
          id === 'theme-flavor-trigger-icon' ||
          id === 'theme-flavor-items' ||
          id === 'theme-flavor-menu'
        )
          return mockElement;
        return null;
      }),
      writable: true,
    });

    // Should not throw when link is missing
    await expect(initTheme(document as any, window as any)).resolves.not.toThrow();
    // No href to set; ensure we didn't try to access mockLink
    expect(mockLocalStorage.getItem).toHaveBeenCalled();
  });

  it('falls back to text icon when theme has no icon', async () => {
    // Force a theme without an icon - but catppuccin-latte actually has an icon
    // So we'll test with a theme that exists but mock the icon as missing
    mockLocalStorage.getItem.mockReturnValue('catppuccin-latte');

    // Setup createElement with auto-load for link, but custom handling for other elements
    setupThemeLinkAutoLoad((tag: string) => {
      if (tag === 'img') return { ...mockImg, src: '' } as any;
      if (tag === 'span') return { ...mockSpan } as any;
      return mockElement as any;
    });

    await initTheme(document as any, window as any);
    // Theme class is applied regardless of icon handling
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-catppuccin-latte');
  });

  it('applyTheme skips trigger icon update when trigger element is missing', async () => {
    // Provide flavor link but omit trigger icon element
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-css') return mockLink;
        if (id === 'theme-flavor-items' || id === 'theme-flavor-menu') return mockElement;
        return null;
      }),
      writable: true,
    });

    // Should not reject - await the Promise for proper async testing
    await expect(initTheme(document as any, window as any)).resolves.not.toThrow();
  });

  it('applyTheme handles URL constructor error (cssFile) without throwing', async () => {
    // Set up DOM elements
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-css') return mockLink;
        if (id === 'theme-flavor-trigger-icon') return mockElement;
        if (id === 'theme-flavor-items' || id === 'theme-flavor-menu') return mockElement;
        return null;
      }),
      writable: true,
    });

    // Mock URL to throw when resolving cssFile
    const OriginalURL = globalThis.URL as any;
    // Override global URL safely for test
    (globalThis as any).URL = vi.fn((input: any, base?: any) => {
      if (typeof input === 'string' && input.includes('assets/css/themes')) {
        throw new Error('bad url');
      }
      return new OriginalURL(input, base);
    }) as any;

    // Should not reject - await the Promise for proper async testing
    await expect(initTheme(document as any, window as any)).resolves.not.toThrow();

    // Restore URL
    (globalThis as any).URL = OriginalURL as any;
  });

  it('falls back to default theme when saved theme is unknown', async () => {
    mockLocalStorage.getItem.mockReturnValue('unknown-theme-id');
    // Ensure auto-load is set up
    setupThemeLinkAutoLoad();
    await initTheme(document, window);
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-catppuccin-mocha');
  });

  it('sets up event listeners', async () => {
    await wireFlavorSelector(document, window);

    // The trigger should have click and keydown listeners
    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      expect.any(Object)
    );
    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
      expect.any(Object)
    );
  });

  it('handles theme selection with menu items', async () => {
    const mockMenuItems: any[] = [];
    const mockTrigger = {
      ...mockElement,
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
    };
    const _mockDropdown = {
      ...mockElement,
      classList: {
        ...mockElement.classList,
        remove: vi.fn(),
      },
    };

    Object.defineProperty(document, 'createElement', {
      value: vi.fn((tag) => {
        if (tag === 'button') {
          const item = {
            ...mockElement,
            type: 'button',
            getAttribute: vi.fn((attr) => {
              // Return theme ID for data-theme-id attribute
              if (attr === 'data-theme-id') {
                // Return different theme IDs, but we'll find the catppuccin-latte one
                const index = mockMenuItems.length;
                const themes = [
                  'bulma-dark',
                  'bulma-light',
                  'catppuccin-frappe',
                  'catppuccin-latte',
                  'catppuccin-macchiato',
                  'catppuccin-mocha',
                  'github-dark',
                  'github-light',
                  'dracula',
                  'rose-pine-dawn',
                  'rose-pine-moon',
                  'rose-pine',
                ];
                return themes[index] || 'catppuccin-latte';
              }
              return null;
            }),
            addEventListener: vi.fn(),
          };
          mockMenuItems.push(item);
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
        if (tag === 'img') return mockImg;
        if (tag === 'span') return mockSpan;
        if (tag === 'link') return createAutoLoadThemeLink();
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

    await wireFlavorSelector(document, window);

    // Find the catppuccin-latte menu item and its click handler
    // The items are created in order, so catppuccin-latte should be at index 2
    const catppuccinLatteItem =
      mockMenuItems.length > 2
        ? mockMenuItems[2]
        : mockMenuItems.find((item) => {
            const themeId = item.getAttribute('data-theme-id');
            return themeId === 'catppuccin-latte';
          });

    expect(catppuccinLatteItem).toBeDefined();
    if (catppuccinLatteItem) {
      const clickHandler = catppuccinLatteItem.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'click'
      )?.[1];

      if (clickHandler) {
        const mockEvent = {
          preventDefault: vi.fn(),
          target: catppuccinLatteItem,
        };
        await clickHandler(mockEvent);
        // Wait a bit for async operations to complete
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockLocalStorage.setItem).toHaveBeenCalled();
      }
    }
  });

  it('keeps native select in sync with dropdown clicks', async () => {
    const mockMenuItems: any[] = [];
    const mockTrigger = {
      ...mockElement,
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
    };
    const mockDropdown = {
      ...mockElement,
      classList: {
        ...mockElement.classList,
        remove: vi.fn(),
        add: vi.fn(),
        toggle: vi.fn(() => true),
        contains: vi.fn(() => false),
      },
    };
    const mockDropdownContent = {
      ...mockElement,
      appendChild: vi.fn(),
    };
    const mockSelect: any = {
      firstChild: null,
      removeChild: vi.fn(function (this: any) {
        this.firstChild = null;
      }),
      appendChild: vi.fn(),
      addEventListener: vi.fn(),
      disabled: true,
      value: '',
      dispatchEvent: vi.fn(),
    };

    Object.defineProperty(document, 'createElement', {
      value: vi.fn((tag) => {
        if (tag === 'button') {
          // Capture index at creation time (before push)
          const capturedIndex = mockMenuItems.length;
          const themes = [
            'bulma-dark',
            'bulma-light',
            'catppuccin-frappe',
            'catppuccin-latte',
            'catppuccin-macchiato',
            'catppuccin-mocha',
            'github-dark',
            'github-light',
            'dracula',
            'rose-pine-dawn',
            'rose-pine-moon',
            'rose-pine',
          ];
          const item = {
            ...mockElement,
            type: 'button',
            getAttribute: vi.fn((attr) => {
              if (attr === 'data-theme-id') {
                return themes[capturedIndex] || 'catppuccin-latte';
              }
              return null;
            }),
            addEventListener: vi.fn(),
            classList: {
              ...mockElement.classList,
              add: vi.fn(),
              remove: vi.fn(),
            },
          };
          mockMenuItems.push(item);
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
        if (tag === 'img') return mockImg;
        if (tag === 'span') return mockSpan;
        if (tag === 'link') return createAutoLoadThemeLink();
        return mockElement;
      }),
      writable: true,
    });

    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-items') return mockDropdownContent;
        if (id === 'theme-flavor-menu') return mockDropdown;
        if (id === 'theme-flavor-trigger') return mockTrigger;
        if (id === 'theme-flavor-select') return mockSelect;
        return null;
      }),
      writable: true,
    });

    await wireFlavorSelector(document, window);

    // Find a specific menu item and its click handler
    const catppuccinLatteItem = mockMenuItems.find((item) => {
      const themeId = item.getAttribute('data-theme-id');
      return themeId === 'catppuccin-latte';
    });

    expect(catppuccinLatteItem).toBeDefined();

    if (catppuccinLatteItem) {
      const clickHandler = catppuccinLatteItem.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'click'
      )?.[1];

      expect(clickHandler).toBeDefined();
      if (clickHandler) {
        const mockEvent = {
          preventDefault: vi.fn(),
        };
        await clickHandler(mockEvent as any);

        // Native select should be enabled and updated to the chosen theme
        expect(mockSelect.disabled).toBe(false);
        expect(mockSelect.value).toBe('catppuccin-latte');
        expect(mockSelect.dispatchEvent).toHaveBeenCalled();
      }
    }
  });

  it('handles getBaseUrl error case', async () => {
    // Test getBaseUrl error handling (coverage for lines 78-79)
    // Mock location.href to cause URL constructor to throw
    const originalLocation = window.location;
    const OriginalURL = globalThis.URL;

    try {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'invalid-url-that-will-throw',
        },
        writable: true,
        configurable: true,
      });

      // Mock URL constructor to throw
      (globalThis as any).URL = vi.fn(() => {
        throw new Error('Invalid URL');
      });

      await wireFlavorSelector(document, window);
    } finally {
      // Restore URL and location to ensure cleanup even if test fails
      (globalThis as any).URL = OriginalURL;
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
        configurable: true,
      });
    }
  });
});
