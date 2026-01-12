/**
 * Tests for navbar highlighting functionality.
 * Tests path matching, active state handling, and edge cases.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initNavbar } from '../../src/index.js';
import { setupDocumentMocks } from '../helpers/mocks.js';

describe('initNavbar - path highlighting', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();

    // Mock location.pathname
    Object.defineProperty(document, 'location', {
      value: { pathname: '/components/' },
      writable: true,
    });

    // Default querySelector mock (can be overridden in individual tests)
    Object.defineProperty(document, 'querySelector', {
      value: vi.fn(() => null),
      writable: true,
    });
  });

  it('highlights navbar item matching current path', () => {
    const mockNavbarItem = {
      href: 'http://localhost/components/',
      classList: { add: vi.fn(), remove: vi.fn() },
      setAttribute: vi.fn(),
    } as any;

    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => [mockNavbarItem]),
      writable: true,
    });

    initNavbar(document);

    expect(mockNavbarItem.classList.add).toHaveBeenCalledWith('is-active');
    expect(mockNavbarItem.setAttribute).toHaveBeenCalledWith('aria-current', 'page');
    expect(mockNavbarItem.classList.remove).not.toHaveBeenCalled();
  });

  it('removes active class from non-matching navbar items', () => {
    const mockNavbarItem = {
      href: 'http://localhost/forms/',
      classList: { add: vi.fn(), remove: vi.fn() },
      removeAttribute: vi.fn(),
    } as any;

    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => [mockNavbarItem]),
      writable: true,
    });

    initNavbar(document);

    expect(mockNavbarItem.classList.remove).toHaveBeenCalledWith('is-active');
    expect(mockNavbarItem.classList.add).not.toHaveBeenCalled();
    expect(mockNavbarItem.removeAttribute).toHaveBeenCalledWith('aria-current');
  });

  it('handles trailing slashes correctly', () => {
    Object.defineProperty(document, 'location', {
      value: { pathname: '/components' },
      writable: true,
    });

    const mockNavbarItem = {
      href: 'http://localhost/components/',
      classList: { add: vi.fn(), remove: vi.fn() },
      setAttribute: vi.fn(),
    } as any;

    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => [mockNavbarItem]),
      writable: true,
    });

    initNavbar(document);

    expect(mockNavbarItem.classList.add).toHaveBeenCalledWith('is-active');
    expect(mockNavbarItem.setAttribute).toHaveBeenCalledWith('aria-current', 'page');
  });

  it('handles root path correctly', () => {
    Object.defineProperty(document, 'location', {
      value: { pathname: '/' },
      writable: true,
    });

    const mockNavbarItem = {
      href: 'http://localhost/',
      classList: { add: vi.fn(), remove: vi.fn() },
      setAttribute: vi.fn(),
    } as any;

    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => [mockNavbarItem]),
      writable: true,
    });

    initNavbar(document);

    expect(mockNavbarItem.classList.add).toHaveBeenCalledWith('is-active');
    expect(mockNavbarItem.setAttribute).toHaveBeenCalledWith('aria-current', 'page');
  });

  it('handles invalid URLs gracefully', () => {
    const mockNavbarItem = {
      href: 'invalid-url',
      classList: { add: vi.fn(), remove: vi.fn() },
    } as any;

    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => [mockNavbarItem]),
      writable: true,
    });

    // Should not throw
    expect(() => initNavbar(document)).not.toThrow();
    expect(mockNavbarItem.classList.add).not.toHaveBeenCalled();
    expect(mockNavbarItem.classList.remove).not.toHaveBeenCalled();
  });

  it('handles navbar items without href', () => {
    const mockNavbarItem = {
      classList: { add: vi.fn(), remove: vi.fn() },
    } as any;

    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => [mockNavbarItem]),
      writable: true,
    });

    initNavbar(document);

    expect(mockNavbarItem.classList.add).not.toHaveBeenCalled();
    expect(mockNavbarItem.classList.remove).not.toHaveBeenCalled();
  });

  it('sets aria-current attribute on matching navbar item', () => {
    Object.defineProperty(document, 'location', {
      value: { pathname: '/components/' },
      writable: true,
    });

    const mockNavbarItem = {
      href: 'http://localhost/components/',
      classList: { add: vi.fn(), remove: vi.fn() },
      setAttribute: vi.fn(),
    } as any;

    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => [mockNavbarItem]),
      writable: true,
    });

    initNavbar(document);

    expect(mockNavbarItem.classList.add).toHaveBeenCalledWith('is-active');
    expect(mockNavbarItem.setAttribute).toHaveBeenCalledWith('aria-current', 'page');
  });
});
