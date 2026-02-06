/**
 * Tests for wireFlavorSelector error handling.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  wireFlavorSelector,
  setupDocumentMocks,
  createMockDropdownElement,
  createMockTriggerElement,
  createTrackedButton,
} from './test-setup.js';

describe('wireFlavorSelector - error handling', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
  });

  it('handles applyTheme error gracefully', async () => {
    const createdButtons: any[] = [];

    const mockHead = { appendChild: vi.fn() };
    let onerrorHandler: (() => void) | null = null;
    const mockThemeLink = {
      id: 'theme-catppuccin-mocha-css',
      rel: 'stylesheet',
      type: '',
      href: '',
      setAttribute: vi.fn(),
      remove: vi.fn(),
      set onload(_handler: () => void) {
        // Don't call - simulate load failure
      },
      set onerror(handler: () => void) {
        onerrorHandler = handler;
        setTimeout(() => onerrorHandler?.(), 0);
      },
      get onerror() {
        return onerrorHandler || (() => {});
      },
    };

    const mockDropdown = createMockDropdownElement(false);
    const mockTrigger = createMockTriggerElement(mocks, mockDropdown);

    Object.defineProperty(document, 'head', { value: mockHead, writable: true });
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-menu') return mockDropdown;
        if (id === 'theme-flavor-trigger') return mockTrigger;
        if (id === 'theme-catppuccin-mocha-css') return null;
        return null;
      }),
      writable: true,
    });

    Object.defineProperty(document, 'createElement', {
      value: vi.fn((tag) => {
        if (tag === 'link') return mockThemeLink;
        if (tag === 'button') {
          const btn = createTrackedButton(createdButtons, 'catppuccin-mocha');
          // Override getAttribute to always return catppuccin-mocha
          btn.getAttribute = vi.fn(() => 'catppuccin-mocha');
          return btn;
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
        return mocks.mockElement;
      }),
      writable: true,
    });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      wireFlavorSelector(document, window);

      expect(createdButtons.length).toBeGreaterThan(0);

      const firstButton = createdButtons[0];
      const clickHandler = firstButton.addEventListener.mock.calls.find(
        (call: any[]) => call[0] === 'click'
      )?.[1];

      expect(clickHandler).toBeDefined();

      const clickPromise = clickHandler({ preventDefault: vi.fn() });
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Theme CSS failed to load'),
        expect.anything()
      );

      try {
        await clickPromise;
      } catch {
        // Expected - promise rejects
      }
    } finally {
      consoleWarnSpy.mockRestore();
    }
  });
});
