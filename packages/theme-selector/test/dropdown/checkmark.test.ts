// SPDX-License-Identifier: MIT
/**
 * Tests for checkmark icon creation
 */
import { describe, expect, it } from 'vitest';
import { createCheckmarkIcon } from '../../src/dropdown/ui.js';

describe('createCheckmarkIcon', () => {
  it('creates an SVG element', () => {
    const svg = createCheckmarkIcon(document);
    expect(svg.tagName).toBe('svg');
  });

  it('sets correct dimensions', () => {
    const svg = createCheckmarkIcon(document);
    expect(svg.getAttribute('width')).toBe('16');
    expect(svg.getAttribute('height')).toBe('16');
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('sets correct stroke attributes', () => {
    const svg = createCheckmarkIcon(document);
    expect(svg.getAttribute('fill')).toBe('none');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.getAttribute('stroke-width')).toBe('3');
    expect(svg.getAttribute('stroke-linecap')).toBe('round');
    expect(svg.getAttribute('stroke-linejoin')).toBe('round');
  });

  it('contains a polyline element', () => {
    const svg = createCheckmarkIcon(document);
    const polyline = svg.querySelector('polyline');
    expect(polyline).not.toBeNull();
    expect(polyline?.getAttribute('points')).toBe('20 6 9 17 4 12');
  });
});
