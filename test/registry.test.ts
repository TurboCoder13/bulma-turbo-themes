import { describe, it, expect } from 'vitest';
import { flavors } from '../src/themes/registry';

describe('registry', () => {
  it('exports flavors array', () => {
    expect(Array.isArray(flavors)).toBe(true);
    expect(flavors.length).toBeGreaterThan(0);
  });

  it('exported flavors have required properties', () => {
    flavors.forEach((flavor) => {
      expect(flavor).toHaveProperty('id');
      expect(flavor).toHaveProperty('label');
      expect(flavor).toHaveProperty('vendor');
      expect(flavor).toHaveProperty('appearance');
      expect(flavor).toHaveProperty('tokens');
    });
  });
});
