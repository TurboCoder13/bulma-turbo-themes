// SPDX-License-Identifier: MIT
/**
 * Tests for dropdown menu item keyboard navigation
 */
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { wireDropdownEventHandlers } from '../../../src/dropdown/events.js';
import {
  setupDropdownEventTest,
  cleanupDropdownEventTest,
  type DropdownEventTestContext,
} from './test-setup.js';

describe('wireDropdownEventHandlers - menu item keyboard navigation', () => {
  let ctx: DropdownEventTestContext;

  beforeEach(() => {
    ctx = setupDropdownEventTest();
  });

  afterEach(() => {
    cleanupDropdownEventTest(ctx);
  });

  it('focuses next item on ArrowDown', () => {
    wireDropdownEventHandlers(
      ctx.mockDocument,
      ctx.mockElements,
      ctx.mockState,
      ctx.mockStateManager,
      ctx.abortController
    );

    ctx.dispatchMenuItemKeydown(0, 'ArrowDown');

    expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(1);
  });

  it('wraps to first item on ArrowDown from last', () => {
    wireDropdownEventHandlers(
      ctx.mockDocument,
      ctx.mockElements,
      ctx.mockState,
      ctx.mockStateManager,
      ctx.abortController
    );

    ctx.dispatchMenuItemKeydown(2, 'ArrowDown');

    expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(0);
  });

  it('focuses previous item on ArrowUp', () => {
    wireDropdownEventHandlers(
      ctx.mockDocument,
      ctx.mockElements,
      ctx.mockState,
      ctx.mockStateManager,
      ctx.abortController
    );

    ctx.dispatchMenuItemKeydown(2, 'ArrowUp');

    expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(1);
  });

  it('wraps to last item on ArrowUp from first', () => {
    wireDropdownEventHandlers(
      ctx.mockDocument,
      ctx.mockElements,
      ctx.mockState,
      ctx.mockStateManager,
      ctx.abortController
    );

    ctx.dispatchMenuItemKeydown(0, 'ArrowUp');

    expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(2);
  });

  it('closes dropdown on Escape', () => {
    wireDropdownEventHandlers(
      ctx.mockDocument,
      ctx.mockElements,
      ctx.mockState,
      ctx.mockStateManager,
      ctx.abortController
    );

    ctx.dispatchMenuItemKeydown(0, 'Escape');

    expect(ctx.mockStateManager.closeDropdown).toHaveBeenCalled();
  });

  it('clicks item on Enter', () => {
    wireDropdownEventHandlers(
      ctx.mockDocument,
      ctx.mockElements,
      ctx.mockState,
      ctx.mockStateManager,
      ctx.abortController
    );
    const clickSpy = vi.spyOn(ctx.mockState.menuItems[0]!, 'click');

    ctx.dispatchMenuItemKeydown(0, 'Enter');

    expect(clickSpy).toHaveBeenCalled();
  });

  it('clicks item on Space', () => {
    wireDropdownEventHandlers(
      ctx.mockDocument,
      ctx.mockElements,
      ctx.mockState,
      ctx.mockStateManager,
      ctx.abortController
    );
    const clickSpy = vi.spyOn(ctx.mockState.menuItems[1]!, 'click');

    ctx.dispatchMenuItemKeydown(1, ' ');

    expect(clickSpy).toHaveBeenCalled();
  });

  it('focuses first item on Home', () => {
    wireDropdownEventHandlers(
      ctx.mockDocument,
      ctx.mockElements,
      ctx.mockState,
      ctx.mockStateManager,
      ctx.abortController
    );

    ctx.dispatchMenuItemKeydown(2, 'Home');

    expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(0);
  });

  it('focuses last item on End', () => {
    wireDropdownEventHandlers(
      ctx.mockDocument,
      ctx.mockElements,
      ctx.mockState,
      ctx.mockStateManager,
      ctx.abortController
    );

    ctx.dispatchMenuItemKeydown(0, 'End');

    expect(ctx.mockStateManager.focusMenuItem).toHaveBeenCalledWith(2);
  });

  it('ignores other keys', () => {
    wireDropdownEventHandlers(
      ctx.mockDocument,
      ctx.mockElements,
      ctx.mockState,
      ctx.mockStateManager,
      ctx.abortController
    );

    ctx.dispatchMenuItemKeydown(0, 'Tab');

    expect(ctx.mockStateManager.focusMenuItem).not.toHaveBeenCalled();
    expect(ctx.mockStateManager.closeDropdown).not.toHaveBeenCalled();
  });
});
