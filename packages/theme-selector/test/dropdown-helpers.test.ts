// SPDX-License-Identifier: MIT
/**
 * Tests for dropdown helpers
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { setItemActiveState, setTabindexBatch } from '../src/dropdown/helpers.js';

describe('dropdown/helpers', () => {
  let mockElement: Element;

  beforeEach(() => {
    mockElement = document.createElement('button');
    mockElement.classList.add('theme-item');
  });

  describe('setTabindexBatch', () => {
    it('sets tabindex on all items in collection', () => {
      const items = [
        document.createElement('button'),
        document.createElement('button'),
        document.createElement('button'),
      ] as HTMLElement[];

      setTabindexBatch(items, '-1');

      for (const item of items) {
        expect(item.getAttribute('tabindex')).toBe('-1');
      }
    });

    it('handles empty collection', () => {
      expect(() => setTabindexBatch([], '-1')).not.toThrow();
    });

    it.each(['-1', '0', '1'])('sets tabindex to %s', (value) => {
      const items = [document.createElement('button')] as HTMLElement[];
      setTabindexBatch(items, value);
      expect(items[0]?.getAttribute('tabindex')).toBe(value);
    });
  });

  describe('setItemActiveState', () => {
    it.each([
      { active: true, expectedClass: true, expectedAria: 'true' },
      { active: false, expectedClass: false, expectedAria: 'false' },
    ])(
      'sets is-active class to $expectedClass and aria-checked to $expectedAria when active=$active',
      ({ active, expectedClass, expectedAria }) => {
        if (!active) {
          mockElement.classList.add('is-active');
        }
        setItemActiveState(mockElement, active);

        expect(mockElement.classList.contains('is-active')).toBe(expectedClass);
        expect(mockElement.getAttribute('aria-checked')).toBe(expectedAria);
      }
    );

    it('handles sequential state transitions', () => {
      const states = [true, false, true, false];
      for (const active of states) {
        setItemActiveState(mockElement, active);
        expect(mockElement.classList.contains('is-active')).toBe(active);
        expect(mockElement.getAttribute('aria-checked')).toBe(String(active));
      }
    });
  });
});
