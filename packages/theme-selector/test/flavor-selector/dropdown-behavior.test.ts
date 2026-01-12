/**
 * Tests for wireFlavorSelector dropdown behavior.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  wireFlavorSelector,
  setupDocumentMocks,
  createMockElement,
  createMockDropdownContainer,
} from './test-setup.js';

describe('wireFlavorSelector - dropdown behavior', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
  });

  it('closes when clicking outside the dropdown', () => {
    mocks.mockDropdownContainer.contains.mockReturnValue(false);
    wireFlavorSelector(document, window);

    const docClick = (document.addEventListener as any).mock.calls.find(
      (c: any) => c[0] === 'click'
    )?.[1];
    if (docClick) {
      docClick({ target: {} } as any);
    }

    expect(mocks.mockDropdownContainer.classList.remove).toHaveBeenCalledWith('is-active');
  });

  it('does not close when clicking inside the dropdown', () => {
    const mockTarget = { nodeName: 'BUTTON' } as any;
    const mockDropdown = {
      ...mocks.mockElement,
      classList: {
        ...mocks.mockElement.classList,
        remove: vi.fn(),
      },
      contains: vi.fn(() => true),
    };
    const mockTrigger = {
      ...mocks.mockElement,
      closest: vi.fn(() => mockDropdown),
    };

    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-menu') return mocks.mockElement;
        if (id === 'theme-flavor-trigger') return mockTrigger;
        return null;
      }),
      writable: true,
    });

    wireFlavorSelector(document, window);
    mockDropdown.classList.remove.mockClear();

    const docClick = (document.addEventListener as any).mock.calls.find(
      (c: any) => c[0] === 'click'
    )?.[1];
    if (docClick) {
      docClick({ target: mockTarget } as any);
    }

    expect(mockDropdown.contains).toHaveBeenCalledWith(mockTarget);
    expect(mockDropdown.classList.remove).not.toHaveBeenCalledWith('is-active');
  });

  it('toggles dropdown on trigger click', () => {
    const mockDropdown = {
      ...mocks.mockElement,
      classList: {
        ...mocks.mockElement.classList,
        toggle: vi.fn(),
        contains: vi.fn(() => false),
      },
    };
    const mockTrigger = {
      ...mocks.mockElement,
      addEventListener: vi.fn(),
      classList: { toggle: vi.fn(), add: vi.fn(), remove: vi.fn() },
      setAttribute: vi.fn(),
      focus: vi.fn(),
      closest: vi.fn(() => mockDropdown),
    } as any;

    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-menu') return mocks.mockElement;
        if (id === 'theme-flavor-trigger') return mockTrigger;
        return null;
      }),
      writable: true,
    });

    wireFlavorSelector(document, window);

    const triggerClick = mockTrigger.addEventListener.mock.calls.find(
      (c) => c[0] === 'click'
    )?.[1];
    if (triggerClick) {
      triggerClick({ preventDefault: vi.fn() } as any);
    }

    expect(mockDropdown.classList.toggle).toHaveBeenCalledWith('is-active');
  });

  it('closes dropdown on Escape key', () => {
    const mockDropdown = createMockDropdownContainer();
    const mockTrigger = {
      ...createMockElement(mockDropdown),
      addEventListener: vi.fn(),
      focus: vi.fn(),
    };

    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-menu') return mocks.mockElement;
        if (id === 'theme-flavor-trigger') return mockTrigger;
        return null;
      }),
      writable: true,
    });

    wireFlavorSelector(document, window);

    const escapeHandler = (document.addEventListener as any).mock.calls.find(
      (c: any) => c[0] === 'keydown'
    )?.[1];
    if (escapeHandler) {
      escapeHandler({ key: 'Escape', preventDefault: vi.fn() } as any);
    }

    expect(mockDropdown.classList.remove).toHaveBeenCalledWith('is-active');
  });
});
