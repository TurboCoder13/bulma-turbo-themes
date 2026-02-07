import type { ThemePackage } from '../types.js';

/**
 * GitHub themes - auto-synced from @primer/primitives
 * Based on GitHub's Primer design system colors
 * @see https://primer.style/foundations/color
 * @license MIT
 *
 * DO NOT EDIT MANUALLY - regenerate with: node scripts/sync-github.mjs
 */
export const githubSynced: ThemePackage = {
  id: 'github',
  name: 'GitHub (synced)',
  homepage: 'https://primer.style/',
  license: {
    spdx: 'MIT',
    url: 'https://github.com/primer/primitives/blob/main/LICENSE',
    copyright: 'GitHub Inc.',
  },
  source: {
    package: '@primer/primitives',
    version: '11.3.2',
    repository: 'https://github.com/primer/primitives',
  },
  flavors: [
    {
      id: 'github-light',
      label: 'GitHub Light',
      vendor: 'github',
      appearance: 'light',
      iconUrl: '/assets/img/github-logo-light.png',
      tokens: {
        background: {
          base: '#ffffff',
          surface: '#f6f8fa',
          overlay: '#f6f8fa',
        },
        text: {
          primary: '#1f2328',
          secondary: '#59636e',
          inverse: '#ffffff',
        },
        brand: {
          primary: '#0969da',
        },
        state: {
          info: '#0969da',
          success: '#1a7f37',
          warning: '#9a6700',
          danger: '#d1242f',
        },
        border: {
          default: '#d1d9e0',
        },
        accent: {
          link: '#0969da',
        },
        typography: {
          fonts: {
            sans: '"Mona Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
            mono: '"Hubot Sans", ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, "Liberation Mono", monospace',
          },
          webFonts: [
            'https://github.githubassets.com/assets/mona-sans-webfont.woff2',
            'https://github.githubassets.com/assets/hubot-sans-webfont.woff2',
          ],
        },
        content: {
          heading: {
            h1: '#1a7f37',
            h2: '#0969da',
            h3: '#0969da',
            h4: '#9a6700',
            h5: '#1a7f37',
            h6: '#d1242f',
          },
          body: {
            primary: '#1f2328',
            secondary: '#59636e',
          },
          link: {
            default: '#0969da',
          },
          selection: {
            fg: '#1f2328',
            bg: '#b6e3ff',
          },
          blockquote: {
            border: '#d1d9e0',
            fg: '#59636e',
            bg: '#f6f8fa',
          },
          codeInline: {
            fg: '#1f2328',
            bg: '#f6f8fa',
          },
          codeBlock: {
            fg: '#1f2328',
            bg: '#f6f8fa',
          },
          table: {
            border: '#d1d9e0',
            stripe: '#f6f8fa',
            theadBg: '#f6f8fa',
          },
        },
      },
    },
    {
      id: 'github-dark',
      label: 'GitHub Dark',
      vendor: 'github',
      appearance: 'dark',
      iconUrl: '/assets/img/github-logo-dark.png',
      tokens: {
        background: {
          base: '#0d1117',
          surface: '#151b23',
          overlay: '#010409',
        },
        text: {
          primary: '#f0f6fc',
          secondary: '#9198a1',
          inverse: '#ffffff',
        },
        brand: {
          primary: '#1f6feb',
        },
        state: {
          info: '#4493f8',
          success: '#3fb950',
          warning: '#d29922',
          danger: '#f85149',
          successText: '#000000',
          warningText: '#000000',
        },
        border: {
          default: '#3d444d',
        },
        accent: {
          link: '#4493f8',
        },
        typography: {
          fonts: {
            sans: '"Mona Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
            mono: '"Hubot Sans", ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, "Liberation Mono", monospace',
          },
          webFonts: [
            'https://github.githubassets.com/assets/mona-sans-webfont.woff2',
            'https://github.githubassets.com/assets/hubot-sans-webfont.woff2',
          ],
        },
        content: {
          heading: {
            h1: '#3fb950',
            h2: '#4493f8',
            h3: '#1f6feb',
            h4: '#d29922',
            h5: '#3fb950',
            h6: '#f85149',
          },
          body: {
            primary: '#f0f6fc',
            secondary: '#9198a1',
          },
          link: {
            default: '#4493f8',
          },
          selection: {
            fg: '#f0f6fc',
            bg: '#264f78',
          },
          blockquote: {
            border: '#3d444d',
            fg: '#9198a1',
            bg: '#151b23',
          },
          codeInline: {
            fg: '#f0f6fc',
            bg: '#151b23',
          },
          codeBlock: {
            fg: '#f0f6fc',
            bg: '#151b23',
          },
          table: {
            border: '#3d444d',
            stripe: '#151b23',
            theadBg: '#151b23',
          },
        },
      },
    },
  ],
} as const;
