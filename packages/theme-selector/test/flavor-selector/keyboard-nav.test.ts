/**
 * Tests for wireFlavorSelector keyboard navigation.
 *
 * Uses the setupKeyboardNavTest factory for consolidated mock setup.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  wireFlavorSelector,
  setupKeyboardNavTest,
  type KeyboardNavTestContext,
} from './test-setup.js';

describe('wireFlavorSelector - keyboard navigation', () => {
  let ctx: KeyboardNavTestContext;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles ArrowDown key navigation', async () => {
    ctx = setupKeyboardNavTest();
    await wireFlavorSelector(document, window);

    expect(ctx.createdButtons.length).toBeGreaterThan(0);

    const { preventDefault } = ctx.fireKeydown('ArrowDown');

    expect(preventDefault).toHaveBeenCalled();
    expect(ctx.createdButtons[0].focus).toHaveBeenCalled();
  });

  it('handles ArrowUp key navigation', async () => {
    ctx = setupKeyboardNavTest();
    await wireFlavorSelector(document, window);

    expect(ctx.createdButtons.length).toBeGreaterThan(0);

    const { preventDefault } = ctx.fireKeydown('ArrowUp');

    expect(preventDefault).toHaveBeenCalled();
    // ArrowUp from start wraps to last item
    expect(ctx.createdButtons[ctx.createdButtons.length - 1].focus).toHaveBeenCalled();
  });

  it('handles Enter key to select theme', async () => {
    ctx = setupKeyboardNavTest(undefined, {
      dropdownActive: true,
      themeIdOverride: 'catppuccin-latte',
    });
    await wireFlavorSelector(document, window);

    expect(ctx.createdButtons.length).toBeGreaterThan(0);

    // First navigate to an item
    ctx.fireKeydown('ArrowDown');
    expect(ctx.createdButtons[0].focus).toHaveBeenCalled();

    // Then press Enter - it should toggle the dropdown
    const { preventDefault } = ctx.fireKeydown('Enter');

    expect(preventDefault).toHaveBeenCalled();
    expect(ctx.mockDropdown.classList.toggle).toHaveBeenCalledWith('is-active');
  });

  it('wraps navigation from last to first item on ArrowDown', async () => {
    ctx = setupKeyboardNavTest();
    await wireFlavorSelector(document, window);

    const buttonCount = ctx.createdButtons.length;
    expect(buttonCount).toBeGreaterThan(0);

    // Navigate past the last item
    for (let i = 0; i <= buttonCount; i++) {
      ctx.fireKeydown('ArrowDown');
    }

    // Should wrap to first item
    expect(ctx.createdButtons[0].focus).toHaveBeenCalled();
  });

  it('wraps navigation from first to last item on ArrowUp', async () => {
    ctx = setupKeyboardNavTest();
    await wireFlavorSelector(document, window);

    expect(ctx.createdButtons.length).toBeGreaterThan(0);

    // First ArrowUp should go to last item (wrapping)
    ctx.fireKeydown('ArrowUp');

    expect(ctx.createdButtons[ctx.createdButtons.length - 1].focus).toHaveBeenCalled();
  });
});
