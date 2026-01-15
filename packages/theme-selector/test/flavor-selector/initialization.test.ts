/**
 * Tests for wireFlavorSelector initialization.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  wireFlavorSelector,
  setupDocumentMocks,
  createMockAbortController,
} from './test-setup.js';

describe('wireFlavorSelector - initialization', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
  });

  it('returns early when elements are missing', async () => {
    const { mockAbortController, MockAbortController } = createMockAbortController();
    const originalAbortController = global.AbortController;
    (global as any).AbortController = MockAbortController;

    try {
      Object.defineProperty(document, 'getElementById', {
        value: vi.fn((id) => {
          if (id === 'theme-flavor-items' || id === 'theme-flavor-trigger') {
            return null;
          }
          return null;
        }),
        writable: true,
      });

      const result = await wireFlavorSelector(document, window);
      expect(document.getElementById).toHaveBeenCalledWith('theme-flavor-menu');
      expect(document.getElementById).toHaveBeenCalledWith('theme-flavor-trigger');

      expect(result).toBeDefined();
      expect(result.cleanup).toBeDefined();
      expect(typeof result.cleanup).toBe('function');

      result.cleanup();
      expect(mockAbortController.abort).toHaveBeenCalled();
    } finally {
      (global as any).AbortController = originalAbortController;
    }
  });

  it('creates dropdown items for themes', () => {
    wireFlavorSelector(document, window);

    expect(document.createElement).toHaveBeenCalledWith('button');
    expect(document.createElement).toHaveBeenCalledWith('div');
    expect(document.createElement).toHaveBeenCalledWith('span');
  });

  it('sets up event listeners for theme selector', () => {
    wireFlavorSelector(document, window);

    expect(mocks.mockElement.addEventListener).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      expect.any(Object)
    );
    expect(mocks.mockElement.addEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
      expect.any(Object)
    );

    expect(
      (document.addEventListener as any).mock.calls.some((call: any[]) => call[0] === 'click')
    ).toBe(true);
    expect(
      (document.addEventListener as any).mock.calls.some((call: any[]) => call[0] === 'keydown')
    ).toBe(true);
  });
});
