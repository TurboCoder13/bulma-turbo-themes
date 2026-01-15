/**
 * Tests for initNavbar function.
 * Tests navbar highlighting, path matching, and reports dropdown handling.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initNavbar } from '../src/index';
import { setupDocumentMocks } from '../../../test/helpers/mocks.js';

describe('initNavbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDocumentMocks();

    // Mock location.pathname
    Object.defineProperty(document, 'location', {
      value: { pathname: '/components/' },
      writable: true,
    });

    // Default querySelector mock (for reports dropdown)
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
      removeAttribute: vi.fn(),
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
      removeAttribute: vi.fn(),
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
      removeAttribute: vi.fn(),
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

  it('sets aria-current on matching navbar item', () => {
    Object.defineProperty(document, 'location', {
      value: { pathname: '/components/' },
      writable: true,
    });

    const mockNavbarItem = {
      href: 'http://localhost/components/',
      classList: { add: vi.fn(), remove: vi.fn() },
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
    } as any;

    Object.defineProperty(document, 'querySelectorAll', {
      value: vi.fn(() => [mockNavbarItem]),
      writable: true,
    });

    initNavbar(document);

    expect(mockNavbarItem.classList.add).toHaveBeenCalledWith('is-active');
    expect(mockNavbarItem.setAttribute).toHaveBeenCalledWith('aria-current', 'page');
  });

  describe('reports dropdown highlighting', () => {
    const reportPaths = ['/coverage', '/playwright', '/lighthouse'];

    reportPaths.forEach((path) => {
      it(`highlights reports dropdown when on ${path} path`, () => {
        Object.defineProperty(document, 'location', {
          value: { pathname: path },
          writable: true,
        });

        const mockReportsLink = {
          classList: { add: vi.fn(), remove: vi.fn() },
        } as any;

        Object.defineProperty(document, 'querySelectorAll', {
          value: vi.fn(() => []),
          writable: true,
        });

        Object.defineProperty(document, 'querySelector', {
          value: vi.fn((selector) => {
            if (selector === '[data-testid="nav-reports"]') return mockReportsLink;
            return null;
          }),
          writable: true,
        });

        initNavbar(document);

        expect(mockReportsLink.classList.add).toHaveBeenCalledWith('is-active');
        expect(mockReportsLink.classList.remove).not.toHaveBeenCalled();
      });
    });

    it('highlights reports dropdown when path starts with report path', () => {
      Object.defineProperty(document, 'location', {
        value: { pathname: '/coverage/something' },
        writable: true,
      });

      const mockReportsLink = {
        classList: { add: vi.fn(), remove: vi.fn() },
      } as any;

      Object.defineProperty(document, 'querySelectorAll', {
        value: vi.fn(() => []),
        writable: true,
      });

      Object.defineProperty(document, 'querySelector', {
        value: vi.fn((selector) => {
          if (selector === '[data-testid="nav-reports"]') return mockReportsLink;
          return null;
        }),
        writable: true,
      });

      initNavbar(document);

      expect(mockReportsLink.classList.add).toHaveBeenCalledWith('is-active');
      expect(mockReportsLink.classList.remove).not.toHaveBeenCalled();
    });

    it('removes active class from reports dropdown when not on report path', () => {
      Object.defineProperty(document, 'location', {
        value: { pathname: '/components' },
        writable: true,
      });

      const mockReportsLink = {
        classList: { add: vi.fn(), remove: vi.fn() },
      } as any;

      Object.defineProperty(document, 'querySelectorAll', {
        value: vi.fn(() => []),
        writable: true,
      });

      Object.defineProperty(document, 'querySelector', {
        value: vi.fn((selector) => {
          if (selector === '[data-testid="nav-reports"]') return mockReportsLink;
          return null;
        }),
        writable: true,
      });

      initNavbar(document);

      expect(mockReportsLink.classList.remove).toHaveBeenCalledWith('is-active');
      expect(mockReportsLink.classList.add).not.toHaveBeenCalled();
    });
  });
});
