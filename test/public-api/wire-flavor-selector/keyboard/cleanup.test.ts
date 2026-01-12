/**
 * Tests for cleanup functionality in keyboard navigation.
 * Tests AbortController cleanup and resource release.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { wireFlavorSelector } from '../../../../src/index.js';
import { setupDocumentMocks } from '../../../helpers/mocks.js';

describe('wireFlavorSelector cleanup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDocumentMocks();
  });

  describe('cleanup function', () => {
    it('returns a cleanup function', async () => {
      const result = await wireFlavorSelector(document, window);

      expect(result).toBeDefined();
      expect(result.cleanup).toBeDefined();
      expect(typeof result.cleanup).toBe('function');
    });

    it('calls abortController.abort when cleanup is invoked', async () => {
      const originalAbortController = global.AbortController;
      const mockAbortController = {
        abort: vi.fn(),
        signal: {
          aborted: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        },
      };
      const MockAbortController = function (this: any) {
        Object.assign(this, mockAbortController);
      };
      (global as any).AbortController = MockAbortController;

      try {
        const result = await wireFlavorSelector(document, window);

        expect(result.cleanup).toBeDefined();
        result.cleanup();
        expect(mockAbortController.abort).toHaveBeenCalled();
      } finally {
        (global as any).AbortController = originalAbortController;
      }
    });

    it('can be called multiple times without error', async () => {
      const result = await wireFlavorSelector(document, window);

      expect(() => {
        result.cleanup();
        result.cleanup();
        result.cleanup();
      }).not.toThrow();
    });
  });

  describe('event listener cleanup', () => {
    it('removes event listeners on cleanup', async () => {
      const originalAbortController = global.AbortController;
      let signalAborted = false;
      const abortListeners: (() => void)[] = [];

      const mockSignal = {
        get aborted() {
          return signalAborted;
        },
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === 'abort') {
            abortListeners.push(handler);
          }
        }),
        removeEventListener: vi.fn(),
      };

      const mockAbortController = {
        abort: vi.fn(() => {
          signalAborted = true;
          abortListeners.forEach((handler) => handler());
        }),
        signal: mockSignal,
      };

      const MockAbortController = function (this: any) {
        Object.assign(this, mockAbortController);
      };
      (global as any).AbortController = MockAbortController;

      try {
        const result = await wireFlavorSelector(document, window);
        result.cleanup();

        expect(mockAbortController.abort).toHaveBeenCalled();
      } finally {
        (global as any).AbortController = originalAbortController;
      }
    });
  });
});
