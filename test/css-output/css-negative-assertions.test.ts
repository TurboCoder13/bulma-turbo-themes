/**
 * CSS Negative Assertions Tests
 *
 * Tests that verify CSS files do NOT contain certain patterns.
 * Uses describe.each() for parametrized testing across theme files.
 */

import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { themeIds } from '../../packages/core/src/tokens/index';
import { turboCoreFile, turboThemesDir, readFile, fileExists } from './test-utils';

// Patterns that should never appear in CSS output
const FORBIDDEN_PATTERNS = [
  { pattern: ': undefined', description: 'undefined values' },
  { pattern: ': null', description: 'null values' },
  { pattern: ': NaN', description: 'NaN values' },
  { pattern: '[object Object]', description: 'serialized objects' },
  { pattern: 'TODO', description: 'TODO comments' },
  { pattern: 'FIXME', description: 'FIXME comments' },
  { pattern: ';;', description: 'double semicolons' },
  { pattern: ': ;', description: 'empty values' },
  { pattern: '--turbo-internal-', description: 'internal variables' },
  { pattern: '--turbo-debug-', description: 'debug variables' },
  { pattern: '--turbo-private-', description: 'private variables' },
  { pattern: '--turbo-test-', description: 'test variables' },
  { pattern: 'console.', description: 'console statements' },
  { pattern: 'debugger', description: 'debugger statements' },
  { pattern: '<script', description: 'script tags' },
  { pattern: 'javascript:', description: 'javascript protocol' },
  { pattern: 'expression(', description: 'CSS expressions' },
  { pattern: 'behavior:', description: 'IE behavior property' },
  { pattern: 'backgroud', description: 'typo for background' },
  { pattern: 'colr', description: 'typo for color' },
  { pattern: 'widht', description: 'typo for width' },
  { pattern: 'heigth', description: 'typo for height' },
] as const;

// Patterns that should not appear in variable names
const FORBIDDEN_VAR_PATTERNS = [
  { pattern: /--turbo-[\w-]*undefined/, description: 'undefined in var name' },
  { pattern: /--turbo-[\w-]*null/, description: 'null in var name' },
  { pattern: /--turbo-[\w-]*\d{10,}/, description: 'timestamp in var name' },
  { pattern: /--turbo-[\w-]*temp/, description: 'temp in var name' },
  { pattern: /--turbo-[\w-]*tmp/, description: 'tmp in var name' },
] as const;

describe('CSS Output - Negative Assertions', () => {
  describe('turbo-core.css', () => {
    const css = fileExists(turboCoreFile) ? readFile(turboCoreFile) : '';

    it('file exists', () => {
      expect(fileExists(turboCoreFile)).toBe(true);
    });

    describe.each(FORBIDDEN_PATTERNS)('forbidden: $description', ({ pattern }) => {
      it(`should NOT contain "${pattern}"`, () => {
        expect(css).not.toContain(pattern);
      });
    });

    describe.each(FORBIDDEN_VAR_PATTERNS)('variable names: $description', ({ pattern }) => {
      it('should NOT match pattern', () => {
        expect(css).not.toMatch(pattern);
      });
    });

    it('should NOT have unclosed brackets', () => {
      const openBraces = (css.match(/{/g) || []).length;
      const closeBraces = (css.match(/}/g) || []).length;
      expect(openBraces).toBe(closeBraces);
    });

    it('should NOT have unclosed var() calls', () => {
      const unclosed = css.match(/var\([^)]*$/gm) || [];
      expect(unclosed).toHaveLength(0);
    });

    it('should contain :root selector', () => {
      expect(css).toContain(':root');
    });
  });

  describe.each(themeIds.map((id) => ({ themeId: id })))(
    'Theme: $themeId',
    ({ themeId }) => {
      const themePath = path.join(turboThemesDir, `${themeId}.css`);
      const css = fileExists(themePath) ? readFile(themePath) : '';

      it('file exists', () => {
        expect(fileExists(themePath)).toBe(true);
      });

      describe.each(FORBIDDEN_PATTERNS)('forbidden: $description', ({ pattern }) => {
        it(`should NOT contain "${pattern}"`, () => {
          expect(css).not.toContain(pattern);
        });
      });

      it('should NOT have malformed hex colors', () => {
        const hexColors = css.match(/#[0-9a-fA-F]+/g) || [];
        const validLengths = [3, 4, 6, 8];

        for (const hex of hexColors) {
          const length = hex.length - 1;
          expect(
            validLengths.includes(length),
            `Invalid hex: ${hex}`
          ).toBe(true);
        }
      });

      it('should NOT have empty selectors', () => {
        const empty = css.match(/\{[\s]*\}/g) || [];
        expect(empty).toHaveLength(0);
      });

      it('should NOT have duplicate variable definitions', () => {
        const defs = [...css.matchAll(/--([\w-]+):\s*[^;]+;/g)];
        const counts = new Map<string, number>();

        for (const match of defs) {
          counts.set(match[1], (counts.get(match[1]) || 0) + 1);
        }

        for (const [varName, count] of counts) {
          expect(count, `--${varName} defined ${count}x`).toBe(1);
        }
      });

      it('should contain data-theme selector', () => {
        expect(css).toContain(`[data-theme="${themeId}"]`);
      });

      it('should have valid color values', () => {
        const colorPattern = /^(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))$/;
        const colorVarNames = ['bg', 'text', 'color', 'border', 'state', 'brand'];
        const varAssignments = [...css.matchAll(/--([\w-]+):\s*([^;]+);/g)];

        for (const [, varName, value] of varAssignments) {
          if (varName.includes('font')) continue;

          const isColorVar = colorVarNames.some((n) => varName.includes(n));
          if (isColorVar) {
            expect(
              colorPattern.test(value.trim()),
              `--${varName}: ${value}`
            ).toBe(true);
          }
        }
      });
    }
  );
});
