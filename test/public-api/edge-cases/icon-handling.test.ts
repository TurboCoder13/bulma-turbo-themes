/**
 * Icon handling edge case tests.
 * Tests fallback text spans and color swatches for themes without icons.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { wireFlavorSelector } from '../../../src/index.js';
import {
  setupDocumentMocks,
  createMockElement,
  createMockImg,
  createMockSpan,
} from '../../helpers/mocks.js';

describe('icon handling edge cases', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;
  let mockElement: ReturnType<typeof createMockElement>;
  let mockImg: ReturnType<typeof createMockImg>;
  let mockSpan: ReturnType<typeof createMockSpan>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
    mockElement = mocks.mockElement;
    mockImg = mocks.mockImg;
    mockSpan = mocks.mockSpan;
  });

  it('displays fallback text spans in dropdown for themes without icons', async () => {
    Object.defineProperty(document.documentElement, 'getAttribute', {
      value: vi.fn(() => ''),
      writable: true,
    });

    const spanElement = {
      textContent: '',
      style: {},
      addEventListener: vi.fn(),
      appendChild: vi.fn(),
      className: '',
      setAttribute: vi.fn(),
    };

    const mockButton = {
      type: 'button',
      className: '',
      setAttribute: vi.fn(),
      appendChild: vi.fn(),
      addEventListener: vi.fn(),
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
        toggle: vi.fn(),
        contains: vi.fn(),
      },
    };

    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-menu') return mockElement;
        if (id === 'theme-flavor-trigger') return mockElement;
        return null;
      }),
      writable: true,
    });

    Object.defineProperty(document, 'createElement', {
      value: vi.fn((tag) => {
        if (tag === 'img') return mockImg;
        if (tag === 'span') return spanElement;
        if (tag === 'div') {
          return {
            className: '',
            style: { setProperty: vi.fn() },
            appendChild: vi.fn(),
            setAttribute: vi.fn(),
          };
        }
        if (tag === 'button') {
          return mockButton;
        }
        return mockElement;
      }),
      writable: true,
    });

    await wireFlavorSelector(document, window);

    // Verify appendChild was called (spans added as fallback)
    expect(mockElement.appendChild).toHaveBeenCalled();
  });

  it('wireFlavorSelector creates theme items with color swatches', async () => {
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-menu') return mockElement;
        if (id === 'theme-flavor-trigger') return mockElement;
        return null;
      }),
      writable: true,
    });

    const mockButton = {
      ...mockElement,
      type: '',
      appendChild: vi.fn(),
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
    };
    const createdDivs: any[] = [];
    const createdSpans: any[] = [];

    Object.defineProperty(document, 'createElement', {
      value: vi.fn((tag) => {
        if (tag === 'div') {
          const div = {
            className: '',
            style: {
              setProperty: vi.fn(),
            },
            appendChild: vi.fn(),
            setAttribute: vi.fn(),
          };
          createdDivs.push(div);
          return div;
        }
        if (tag === 'span') {
          const span = {
            textContent: '',
            className: '',
            innerHTML: '',
            setAttribute: vi.fn(),
            appendChild: vi.fn(),
          };
          createdSpans.push(span);
          return span;
        }
        if (tag === 'button') {
          return mockButton;
        }
        return mockElement;
      }),
      writable: true,
    });

    await wireFlavorSelector(document, window);

    // Verify divs were created for layout and groups
    expect(document.createElement).toHaveBeenCalledWith('div');
    // Verify buttons were created for theme items
    expect(document.createElement).toHaveBeenCalledWith('button');
    // Verify spans were created for titles and descriptions
    expect(document.createElement).toHaveBeenCalledWith('span');

    // Verify span properties for theme titles
    const nameSpans = createdSpans.filter((s) => s.className === 'theme-title');
    expect(nameSpans.length).toBeGreaterThan(0);
  });
});
