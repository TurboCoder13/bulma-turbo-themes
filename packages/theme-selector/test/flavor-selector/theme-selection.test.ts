/**
 * Tests for wireFlavorSelector theme selection.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { wireFlavorSelector, setupDocumentMocks } from './test-setup.js';

describe('wireFlavorSelector - theme selection', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
  });

  it('handles theme selection', async () => {
    const mockItem = {
      getAttribute: vi.fn(() => 'catppuccin-latte'),
      classList: { add: vi.fn(), remove: vi.fn() },
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
      click: vi.fn(),
    } as any;

    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => [mockItem]),
      writable: true,
    });

    wireFlavorSelector(document, window);

    const clickHandler = mockItem.addEventListener.mock.calls.find(
      (call) => call[0] === 'click'
    )?.[1];

    if (clickHandler) {
      await clickHandler({ preventDefault: vi.fn() });
      expect(mocks.mockLocalStorage.setItem).toHaveBeenCalledWith(
        'turbo-theme',
        'catppuccin-latte'
      );
    }
  });

  it('creates theme CSS link on theme selection', async () => {
    const mockHead = { appendChild: vi.fn() };
    let onloadHandler: (() => void) | null = null;
    const mockThemeLink = {
      id: '',
      rel: '',
      href: '',
      set onload(handler: () => void) {
        onloadHandler = handler;
      },
      triggerLoad: () => onloadHandler?.(),
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

    wireFlavorSelector(document, window);

    const clickHandler = mockItem.addEventListener.mock.calls.find(
      (call) => call[0] === 'click'
    )?.[1];

    if (clickHandler) {
      const clickPromise = clickHandler({ preventDefault: vi.fn() });
      mockThemeLink.triggerLoad();
      await clickPromise;

      expect(document.createElement).toHaveBeenCalledWith('link');
      expect(mockHead.appendChild).toHaveBeenCalledWith(mockThemeLink);
    }
  });
});
