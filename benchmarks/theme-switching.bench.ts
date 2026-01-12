// SPDX-License-Identifier: MIT
/**
 * Performance benchmarks for theme switching operations.
 *
 * Run with: bunx vitest bench benchmarks/
 */

import { bench, describe, beforeAll } from 'vitest';
import { flavors } from '@turbocoder13/turbo-themes-core';

// Mock DOM for benchmarking
let mockDocument: Document;
let mockDocumentElement: HTMLElement;

beforeAll(() => {
  // Setup minimal DOM structure for benchmarking
  mockDocumentElement = {
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false,
    },
    getAttribute: () => null,
    setAttribute: () => {},
  } as unknown as HTMLElement;

  mockDocument = {
    documentElement: mockDocumentElement,
    getElementById: () => null,
    querySelectorAll: () => [],
    head: { appendChild: () => {} },
    createElement: () => ({
      setAttribute: () => {},
      id: '',
      rel: '',
      type: '',
      href: '',
    }),
  } as unknown as Document;
});

describe('Theme Switching Benchmarks', () => {
  describe('Theme Class Operations', () => {
    bench('apply theme class (direct classList manipulation)', () => {
      const themeId = 'catppuccin-mocha';

      // Simulate removing old theme classes
      const classList = Array.from(['theme-old-theme']);
      classList.forEach((cls) => {
        if (cls.startsWith('theme-')) {
          mockDocumentElement.classList.remove(cls);
        }
      });

      // Add new theme class
      mockDocumentElement.classList.add(`theme-${themeId}`);
    });

    bench('lookup theme by ID', () => {
      const themeId = 'catppuccin-mocha';
      flavors.find((f) => f.id === themeId);
    });

    bench('lookup theme by ID (Set)', () => {
      const themeId = 'catppuccin-mocha';
      const themeIds = new Set(flavors.map((f) => f.id));
      themeIds.has(themeId);
    });
  });

  describe('Theme Registry Operations', () => {
    bench('map all flavors to UI representation', () => {
      flavors.map((f) => ({
        id: f.id,
        name: f.label,
        family: f.vendor,
        appearance: f.appearance,
        icon: f.icon,
        cssFile: f.cssFile,
      }));
    });

    bench('filter dark themes', () => {
      flavors.filter((f) => f.appearance === 'dark');
    });

    bench('filter light themes', () => {
      flavors.filter((f) => f.appearance === 'light');
    });

    bench('group flavors by vendor', () => {
      const byVendor: Record<string, typeof flavors> = {};
      for (const flavor of flavors) {
        if (!byVendor[flavor.vendor]) {
          byVendor[flavor.vendor] = [];
        }
        byVendor[flavor.vendor].push(flavor);
      }
    });
  });

  describe('Storage Operations', () => {
    const mockStorage = new Map<string, string>();

    bench('localStorage getItem', () => {
      mockStorage.get('turbo-theme');
    });

    bench('localStorage setItem', () => {
      mockStorage.set('turbo-theme', 'catppuccin-mocha');
    });

    bench('validate theme ID against Set', () => {
      const validIds = new Set(flavors.map((f) => f.id));
      const themeId = 'catppuccin-mocha';
      validIds.has(themeId);
    });
  });
});
