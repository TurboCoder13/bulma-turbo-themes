/**
 * Consolidated export verification tests.
 * Tests that all public API exports are correctly defined and typed.
 */
import { describe, expect, it } from 'vitest';
import { flavors } from '../src/themes/registry.js';

describe('package exports', () => {
  describe('main entry point', () => {
    it('exports all public API functions', async () => {
      const api = await import('../src/index.js');
      expect(api.flavors).toBeDefined();
      expect(api.getTheme).toBeDefined();
      expect(api.getTokens).toBeDefined();
      expect(api.packages).toBeDefined();
    });

    it('exports flavors as an array', async () => {
      const api = await import('../src/index.js');
      expect(Array.isArray(api.flavors)).toBe(true);
      expect(api.flavors.length).toBeGreaterThan(0);
    });
  });

  describe('themes/registry', () => {
    it('exports flavors array', async () => {
      const registry = await import('../src/themes/registry.js');
      expect(registry.flavors).toBeDefined();
      expect(Array.isArray(registry.flavors)).toBe(true);
      expect(registry.flavors.length).toBeGreaterThan(0);
    });
  });

  describe('flavor structure', () => {
    it.each(flavors.map((f) => [f.id, f] as const))(
      'flavor %s has required properties',
      (_id, flavor) => {
        expect(flavor).toHaveProperty('id');
        expect(flavor).toHaveProperty('label');
        expect(flavor).toHaveProperty('vendor');
        expect(flavor).toHaveProperty('appearance');
        expect(flavor).toHaveProperty('tokens');
      }
    );
  });
});
