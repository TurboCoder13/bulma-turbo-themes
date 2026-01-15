/**
 * BaseUrl path construction tests.
 * Tests that CSS paths are correctly constructed with baseUrl prefix.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initTheme, wireFlavorSelector } from '../../../src/index.js';
import {
  setupDocumentMocks,
  createBaseUrlTestSetup,
} from '../../helpers/mocks.js';

describe('baseUrl path construction', () => {
  let mocks: ReturnType<typeof setupDocumentMocks>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks = setupDocumentMocks();
  });

  it('correctly prepends non-empty baseUrl to CSS paths', async () => {
    const { mockThemeLink, mockLocalStorage } = createBaseUrlTestSetup(mocks, '/turbo-themes');
    mockLocalStorage.getItem.mockReturnValue('catppuccin-latte');

    await initTheme(document, window);

    // Verify theme link was created with correct href
    expect(mockThemeLink.href).toContain('/turbo-themes/packages/css/dist/themes/');
  });

  it('correctly creates theme selector elements in wireFlavorSelector', async () => {
    createBaseUrlTestSetup(mocks, '/turbo-themes');

    await wireFlavorSelector(document, window);

    // Verify createElement was called for div, button, and span elements
    expect(document.createElement).toHaveBeenCalledWith('div');
    expect(document.createElement).toHaveBeenCalledWith('button');
    expect(document.createElement).toHaveBeenCalledWith('span');
  });

  it('sets trigger icon src when theme has an icon', async () => {
    const triggerIconEl = {
      src: '',
      alt: '',
      title: '',
    } as any;

    mocks.mockLocalStorage.getItem.mockReturnValue('catppuccin-latte');

    const { mockHead, mockThemeLink } = createBaseUrlTestSetup(mocks, '');

    // Override getElementById to return our trigger icon
    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => {
        if (id === 'theme-flavor-trigger-icon') return triggerIconEl;
        if (id.startsWith('theme-') && id.endsWith('-css')) return null;
        return mocks.mockElement;
      }),
      writable: true,
    });

    await initTheme(document, window);

    // When theme has an icon, src and alt are set with appropriate values
    expect(triggerIconEl.src).toMatch(/catppuccin|latte|\.svg/i);
    expect(triggerIconEl.alt).toContain('Catppuccin');
  });
});
