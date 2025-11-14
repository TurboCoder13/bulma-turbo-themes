/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enhanceAccessibility } from '../src/index';

describe('enhanceAccessibility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('adds tabindex, role, and aria-label to code blocks when missing', () => {
    const preEl: any = {
      setAttribute: vi.fn(),
      hasAttribute: vi.fn((_attr: string) => {
        // Simulate all attributes missing initially
        return false;
      }),
    };
    const fakeDoc: any = {
      querySelectorAll: vi.fn(() => [preEl]),
    };

    enhanceAccessibility(fakeDoc as any);

    expect(fakeDoc.querySelectorAll).toHaveBeenCalledWith('.highlight > pre');
    expect(preEl.setAttribute).toHaveBeenCalledWith('tabindex', '0');
    expect(preEl.setAttribute).toHaveBeenCalledWith('role', 'region');
    expect(preEl.setAttribute).toHaveBeenCalledWith('aria-label', 'Code block');
  });

  it('does not overwrite existing attributes', () => {
    const preEl: any = {
      setAttribute: vi.fn(),
      hasAttribute: vi.fn((attr: string) => {
        // Simulate attributes already present
        return attr === 'tabindex' || attr === 'role' || attr === 'aria-label';
      }),
    };
    const fakeDoc: any = {
      querySelectorAll: vi.fn(() => [preEl]),
    };

    enhanceAccessibility(fakeDoc as any);

    // Since attributes are present, setAttribute should not be called
    expect(preEl.setAttribute).not.toHaveBeenCalled();
  });

  it('is safe when no pre blocks are present', () => {
    const fakeDoc: any = {
      querySelectorAll: vi.fn(() => []),
    };
    expect(() => enhanceAccessibility(fakeDoc as any)).not.toThrow();
    expect(fakeDoc.querySelectorAll).toHaveBeenCalledWith('.highlight > pre');
  });
});
