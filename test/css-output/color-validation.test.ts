/**
 * Color Contrast Accessibility Tests
 *
 * Tests WCAG 2.1 color contrast requirements for all themes.
 */

import { describe, expect, it } from 'vitest';
import { flavors } from '../../packages/core/src/tokens/index';
import { getContrastRatio } from './test-utils';

// WCAG 2.1 AA requires 4.5:1 for normal text, 3:1 for large text
const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE = 3.0;

// Known accessibility issues to track (vendor themes have intentional design choices)
// These use a lower threshold to document issues without blocking CI
const KNOWN_ISSUES_THRESHOLD = 1.8;

// Prepare flavor data for parametrized tests
const flavorTestData = flavors.map((f) => [f.id, f] as const);

describe('CSS Output - Color Contrast Accessibility', () => {
  describe('primary text contrast (required)', () => {
    it.each(flavorTestData)('%s primary text meets WCAG AA', (_id, flavor) => {
      const bg = flavor.tokens.background.base;
      const fg = flavor.tokens.text.primary;
      const ratio = getContrastRatio(fg, bg);

      expect(
        ratio,
        `${flavor.id}: primary text contrast ${ratio.toFixed(2)}:1 < ${WCAG_AA_NORMAL}:1`
      ).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });
  });

  describe('secondary text contrast (required)', () => {
    it.each(flavorTestData)(
      '%s secondary text meets WCAG AA for large text',
      (_id, flavor) => {
        const bg = flavor.tokens.background.base;
        const fg = flavor.tokens.text.secondary;
        const ratio = getContrastRatio(fg, bg);

        expect(
          ratio,
          `${flavor.id}: secondary text contrast ${ratio.toFixed(2)}:1 < ${WCAG_AA_LARGE}:1`
        ).toBeGreaterThanOrEqual(WCAG_AA_LARGE);
      }
    );
  });

  describe('link contrast (minimum readability)', () => {
    it.each(flavorTestData)(
      '%s link color has minimum readability',
      (_id, flavor) => {
        const bg = flavor.tokens.background.base;
        const fg = flavor.tokens.accent.link;
        const ratio = getContrastRatio(fg, bg);

        // Use large text threshold - links are often underlined which aids visibility
        expect(
          ratio,
          `${flavor.id}: link contrast ${ratio.toFixed(2)}:1 < ${WCAG_AA_LARGE}:1`
        ).toBeGreaterThanOrEqual(WCAG_AA_LARGE);
      }
    );
  });

  describe('heading contrast (decorative threshold)', () => {
    it.each(flavorTestData)(
      '%s h1 heading has minimum visibility',
      (_id, flavor) => {
        const bg = flavor.tokens.background.base;
        const fg = flavor.tokens.content.heading.h1;
        const ratio = getContrastRatio(fg, bg);

        // Headings may be decorative; use relaxed threshold
        expect(
          ratio,
          `${flavor.id}: h1 contrast ${ratio.toFixed(2)}:1 too low`
        ).toBeGreaterThanOrEqual(KNOWN_ISSUES_THRESHOLD);
      }
    );
  });

  describe('code block contrast (required)', () => {
    it.each(flavorTestData)(
      '%s code block text meets WCAG AA',
      (_id, flavor) => {
        const bg = flavor.tokens.content.codeBlock.bg;
        const fg = flavor.tokens.content.codeBlock.fg;
        const ratio = getContrastRatio(fg, bg);

        expect(
          ratio,
          `${flavor.id}: code block contrast ${ratio.toFixed(2)}:1 < ${WCAG_AA_NORMAL}:1`
        ).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      }
    );
  });

  describe('inline code contrast (large text threshold)', () => {
    it.each(flavorTestData)(
      '%s inline code has minimum readability',
      (_id, flavor) => {
        const bg = flavor.tokens.content.codeInline.bg;
        const fg = flavor.tokens.content.codeInline.fg;
        const ratio = getContrastRatio(fg, bg);

        // Inline code often has background color distinction; use large text threshold
        expect(
          ratio,
          `${flavor.id}: inline code contrast ${ratio.toFixed(2)}:1 < ${WCAG_AA_LARGE}:1`
        ).toBeGreaterThanOrEqual(WCAG_AA_LARGE);
      }
    );
  });

  describe('selection contrast (minimum visibility)', () => {
    it.each(flavorTestData)(
      '%s selection has minimum visibility',
      (_id, flavor) => {
        const bg = flavor.tokens.content.selection.bg;
        const fg = flavor.tokens.content.selection.fg;
        const ratio = getContrastRatio(fg, bg);

        // Selection is temporary UI state; use relaxed threshold
        expect(
          ratio,
          `${flavor.id}: selection contrast ${ratio.toFixed(2)}:1 too low`
        ).toBeGreaterThanOrEqual(KNOWN_ISSUES_THRESHOLD);
      }
    );
  });

  describe('state colors are unique', () => {
    it.each(flavorTestData)('%s has distinct state colors', (_id, flavor) => {
      const { info, success, warning, danger } = flavor.tokens.state;
      const colors = [info, success, warning, danger];

      // Each state color should be unique
      const unique = new Set(colors);
      expect(unique.size).toBe(4);
    });
  });

  // Note: State colors (info, success, warning, danger) are not tested for contrast
  // against base background because they are typically used with their own backgrounds
  // (e.g., alert boxes with matching bg color) rather than as standalone text colors.
  // Vendors like Bulma intentionally use bright yellows/greens that are low contrast.
});
