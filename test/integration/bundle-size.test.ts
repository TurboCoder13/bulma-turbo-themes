import { describe, it, expect } from 'vitest';
import { statSync, existsSync } from 'fs';

// Size budgets in bytes (generous to allow growth, but catch major issues)
const SIZE_BUDGETS: Record<string, number> = {
  'packages/theme-selector/dist/index.js': 50_000, // 50KB
  'packages/adapters/tailwind/dist/preset.js': 30_000, // 30KB
  'packages/adapters/tailwind/dist/colors.js': 20_000, // 20KB
  'packages/css/dist/index.js': 30_000, // 30KB
  'packages/adapters/bulma/dist/index.js': 20_000, // 20KB
};

describe('Bundle size budgets', () => {
  for (const [file, budget] of Object.entries(SIZE_BUDGETS)) {
    it(`${file} should be under ${Math.round(budget / 1024)}KB`, () => {
      if (!existsSync(file)) {
        // Skip if file doesn't exist yet (e.g., during initial setup)
        return;
      }
      const stats = statSync(file);
      expect(stats.size).toBeLessThan(budget);
    });
  }
});
