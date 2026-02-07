// SPDX-License-Identifier: MIT
/**
 * Tests for theme loader utilities
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  resolveAssetPath,
  getBaseUrl,
  loadCSSWithTimeout,
  applyThemeClass,
  loadThemeCSS,
} from '../src/theme-loader.js';
import { CSS_LINK_ID } from '../src/constants.js';

describe('theme-loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://example.com',
        pathname: '/',
      },
      writable: true,
    });
  });

  describe('resolveAssetPath', () => {
    it('resolves relative path with baseUrl', () => {
      const path = resolveAssetPath('assets/css/themes.css', '/base');
      expect(path).toBe('/base/assets/css/themes.css');
    });

    it('handles empty baseUrl', () => {
      const path = resolveAssetPath('assets/css/themes.css', '');
      expect(path).toBe('/assets/css/themes.css');
    });

    it('handles baseUrl without trailing slash', () => {
      const path = resolveAssetPath('assets/css/themes.css', '/base');
      expect(path).toBe('/base/assets/css/themes.css');
    });

    it('handles baseUrl with trailing slash', () => {
      const path = resolveAssetPath('assets/css/themes.css', '/base/');
      // URL constructor normalizes double slashes, so /base// becomes /base/
      expect(path).toBe('/base/assets/css/themes.css');
    });
  });

  describe('getBaseUrl', () => {
    it('extracts baseurl from data attribute', () => {
      document.documentElement.setAttribute('data-baseurl', '/my-site');
      const baseUrl = getBaseUrl(document);
      expect(baseUrl).toBe('/my-site');
    });

    it('returns empty string for invalid URL', () => {
      document.documentElement.setAttribute('data-baseurl', 'http://evil.com');
      const baseUrl = getBaseUrl(document);
      expect(baseUrl).toBe('');
    });

    it('returns empty string when attribute missing', () => {
      document.documentElement.removeAttribute('data-baseurl');
      const baseUrl = getBaseUrl(document);
      expect(baseUrl).toBe('');
    });

    it('handles relative path correctly', () => {
      document.documentElement.setAttribute('data-baseurl', '/subdir');
      const baseUrl = getBaseUrl(document);
      expect(baseUrl).toBe('/subdir');
    });
  });

  describe('loadCSSWithTimeout', () => {
    it('resolves when CSS loads', async () => {
      const link = document.createElement('link');
      const promise = loadCSSWithTimeout(link, 'test-theme', 1000);

      // Simulate successful load
      setTimeout(() => {
        link.onload?.(new Event('load'));
      }, 10);

      await expect(promise).resolves.toBeUndefined();
    });

    it('rejects on timeout', async () => {
      const link = document.createElement('link');
      const promise = loadCSSWithTimeout(link, 'test-theme', 50);

      await expect(promise).rejects.toThrow('Theme test-theme load timeout');
    });

    it('rejects on error', async () => {
      const link = document.createElement('link');
      const promise = loadCSSWithTimeout(link, 'test-theme', 1000);

      // Simulate error
      setTimeout(() => {
        link.onerror?.(new Event('error'));
      }, 10);

      await expect(promise).rejects.toThrow('Failed to load theme test-theme');
    });
  });

  describe('applyThemeClass', () => {
    beforeEach(() => {
      document.documentElement.className = '';
    });

    it('removes existing theme classes', () => {
      document.documentElement.classList.add('theme-old-theme');
      document.documentElement.classList.add('other-class');

      applyThemeClass(document, 'new-theme');

      expect(document.documentElement.classList.contains('theme-old-theme')).toBe(false);
      expect(document.documentElement.classList.contains('other-class')).toBe(true);
      expect(document.documentElement.classList.contains('theme-new-theme')).toBe(true);
    });

    it('adds new theme class', () => {
      applyThemeClass(document, 'catppuccin-mocha');

      expect(document.documentElement.classList.contains('theme-catppuccin-mocha')).toBe(true);
    });

    it('handles multiple existing theme classes', () => {
      document.documentElement.classList.add('theme-theme1');
      document.documentElement.classList.add('theme-theme2');

      applyThemeClass(document, 'theme3');

      expect(document.documentElement.classList.contains('theme-theme1')).toBe(false);
      expect(document.documentElement.classList.contains('theme-theme2')).toBe(false);
      expect(document.documentElement.classList.contains('theme-theme3')).toBe(true);
    });
  });

  describe('loadThemeCSS', () => {
    beforeEach(() => {
      document.head.innerHTML = '';
    });

    it('creates and appends link element when not present', async () => {
      const theme = {
        id: 'test-theme',
        cssFile: 'assets/css/themes/test-theme.css',
      };

      const promise = loadThemeCSS(document, theme, '');

      const link = document.getElementById('theme-test-theme-css') as HTMLLinkElement;
      expect(link).toBeTruthy();
      expect(link.rel).toBe('stylesheet');
      expect(link.getAttribute('data-theme-id')).toBe('test-theme');

      // Simulate load
      setTimeout(() => {
        link.onload?.(new Event('load'));
      }, 10);

      await promise;
    });

    it('does not create duplicate link if already present', async () => {
      const theme = {
        id: 'test-theme',
        cssFile: 'assets/css/themes/test-theme.css',
      };

      // Create existing link
      const existingLink = document.createElement('link');
      existingLink.id = 'theme-test-theme-css';
      document.head.appendChild(existingLink);

      await loadThemeCSS(document, theme, '');

      const links = document.querySelectorAll('#theme-test-theme-css');
      expect(links.length).toBe(1);
    });

    it('adopts blocking script link element instead of creating duplicate', async () => {
      // Simulate blocking script's link element
      const blockingLink = document.createElement('link');
      blockingLink.id = CSS_LINK_ID;
      blockingLink.rel = 'stylesheet';
      blockingLink.href = '/assets/css/themes/turbo/dracula.css';
      document.head.appendChild(blockingLink);

      const theme = {
        id: 'dracula',
        cssFile: 'assets/css/themes/dracula.css',
      };

      await loadThemeCSS(document, theme, '');

      // Should adopt the blocking link (renamed to runtime convention)
      expect(document.getElementById('theme-dracula-css')).toBe(blockingLink);
      expect(blockingLink.getAttribute('data-theme-id')).toBe('dracula');
      // Original blocking link id should no longer exist
      expect(document.getElementById(CSS_LINK_ID)).toBeNull();
      // Should not have created a second link
      expect(document.querySelectorAll('link[rel="stylesheet"]').length).toBe(1);
    });

    it('cleans up old theme CSS links', async () => {
      const oldLink = document.createElement('link');
      oldLink.id = 'theme-old-theme-css';
      document.head.appendChild(oldLink);

      const theme = {
        id: 'new-theme',
        cssFile: 'assets/css/themes/new-theme.css',
      };

      const promise = loadThemeCSS(document, theme, '');

      const link = document.getElementById('theme-new-theme-css') as HTMLLinkElement;
      setTimeout(() => {
        link.onload?.(new Event('load'));
      }, 10);

      await promise;

      expect(document.getElementById('theme-old-theme-css')).toBeNull();
    });
  });
});
