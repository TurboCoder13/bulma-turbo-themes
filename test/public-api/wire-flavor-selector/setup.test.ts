/**
 * Tests for wireFlavorSelector setup and initialization.
 * Tests basic setup, element creation, and early return conditions.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initTheme, wireFlavorSelector, initNavbar } from '../../../src/index.js';
import { setupDocumentMocks, createMockElement } from '../../helpers/mocks.js';

describe('wireFlavorSelector setup', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;
  let mockElement: ReturnType<typeof createMockElement>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
    mockElement = mocks.mockElement;
  });

  it('exports initTheme, wireFlavorSelector, and initNavbar', () => {
    expect(typeof initTheme).toBe('function');
    expect(typeof wireFlavorSelector).toBe('function');
    expect(typeof initNavbar).toBe('function');
  });

  it('returns early when elements are missing', async () => {
    // Mock getElementById to return null for required elements
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn(() => null),
      writable: true,
    });

    // Should return early without throwing
    const result = await wireFlavorSelector(document, window);

    // Verify it returns the result object with cleanup function
    expect(result).toBeDefined();
    expect(result.cleanup).toBeDefined();
    expect(typeof result.cleanup).toBe('function');

    // Calling cleanup should not throw
    expect(() => result.cleanup()).not.toThrow();
  });

  it('creates dropdown items for themes', async () => {
    await wireFlavorSelector(document, window);

    // Should create elements for each theme
    expect(document.createElement).toHaveBeenCalledWith('button');
    expect(document.createElement).toHaveBeenCalledWith('div'); // For swatches and containers
    expect(document.createElement).toHaveBeenCalledWith('span'); // For names and badges
  });

  it('returns cleanup function that can be called multiple times', async () => {
    const result = await wireFlavorSelector(document, window);

    expect(result).toBeDefined();
    expect(result.cleanup).toBeDefined();

    // Should not throw when called multiple times
    expect(() => {
      result.cleanup();
      result.cleanup();
    }).not.toThrow();
  });

  it('handles partial element availability', async () => {
    // Test when only trigger is missing
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-trigger') return null;
        if (id === 'theme-flavor-menu') return mockElement;
        return null;
      }),
      writable: true,
    });

    const result = await wireFlavorSelector(document, window);
    expect(result).toBeDefined();
    expect(() => result.cleanup()).not.toThrow();
  });

  it('handles missing menu element', async () => {
    // Test when only menu is missing
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-trigger') return mockElement;
        if (id === 'theme-flavor-menu') return null;
        return null;
      }),
      writable: true,
    });

    const result = await wireFlavorSelector(document, window);
    expect(result).toBeDefined();
    expect(() => result.cleanup()).not.toThrow();
  });
});
