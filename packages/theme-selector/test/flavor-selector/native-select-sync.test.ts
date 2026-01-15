/**
 * Tests for wireFlavorSelector native select synchronization.
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

describe('wireFlavorSelector - native select synchronization', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
  });

  it('keeps native select in sync with dropdown clicks', async () => {
    const createdButtons: any[] = [];

    const mockSelect = {
      value: '',
      firstChild: null,
      removeChild: vi.fn(),
      addEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      appendChild: vi.fn(),
      disabled: true,
    } as any;

    const mockDropdown = createMockDropdownElement(false);
    const mockTrigger = createMockTriggerElement(mocks, mockDropdown);

    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-menu') return mockDropdown;
        if (id === 'theme-flavor-trigger') return mockTrigger;
        if (id === 'theme-flavor-select') return mockSelect;
        return null;
      }),
      writable: true,
    });

    Object.defineProperty(document, 'createElement', {
      value: vi.fn((tag: string) => {
        if (tag === 'button') {
          return createTrackedButton(createdButtons);
        }
        if (tag === 'link') {
          let onloadHandler: (() => void) | null = null;
          return {
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
        }
        if (tag === 'option') {
          return { value: '', textContent: '', selected: false };
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

    wireFlavorSelector(document, window);

    expect(document.getElementById).toHaveBeenCalledWith('theme-flavor-select');
    expect(createdButtons.length).toBeGreaterThan(0);

    const firstButton = createdButtons[0];
    const clickHandler = firstButton.addEventListener.mock.calls.find(
      (call: any[]) => call[0] === 'click'
    )?.[1];

    expect(clickHandler).toBeDefined();

    const expectedThemeId = firstButton.getAttribute('data-theme-id');
    expect(expectedThemeId).toBeTruthy();

    await clickHandler({ preventDefault: vi.fn() });

    expect(mockSelect.value).toBe(expectedThemeId);
    expect(mockSelect.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'change' })
    );
  });
});
