import { describe, it, expect } from 'vitest';
import { statSync, existsSync } from 'fs';

// Size budgets in bytes (generous to allow growth, but catch major issues)
const SIZE_BUDGETS: Record<string, number> = {
  'packages/theme-selector/dist/index.js': 81_920, // 80KB (accounts for theme data growth)
  'packages/adapters/tailwind/dist/preset.js': 30_000, // 30KB
  'packages/adapters/tailwind/dist/colors.js': 20_000, // 20KB
  'packages/css/dist/index.js': 35_000, // 35KB (increased: component CSS vars now emitted for all themes)
  'packages/adapters/bulma/dist/index.js': 20_000, // 20KB
};

// CSS output size budgets
const CSS_SIZE_BUDGETS: Record<string, number> = {
  'packages/css/dist/turbo-themes-all.css': 112_640, // 110KB (all theme [data-theme] selectors)
};

describe('Bundle size budgets', () => {
  for (const [file, budget] of Object.entries(SIZE_BUDGETS)) {
    it(`${file} should exist and be under ${Math.round(budget / 1024)}KB`, () => {
      expect(existsSync(file), `Bundle file ${file} should exist after build`).toBe(true);

      const stats = statSync(file);
      expect(stats.size).toBeLessThan(budget);
    });
  }
});

describe('CSS size budgets', () => {
  for (const [file, budget] of Object.entries(CSS_SIZE_BUDGETS)) {
    it(`${file} should exist and be under ${Math.round(budget / 1024)}KB`, () => {
      expect(existsSync(file), `CSS file ${file} should exist after build`).toBe(true);

      const stats = statSync(file);
      expect(stats.size).toBeLessThan(budget);
    });
  }
});
