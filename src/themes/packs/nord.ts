import type { ThemePackage } from '../types.js';

/**
 * Nord theme - Arctic, north-bluish color palette
 * @see https://www.nordtheme.com/docs/colors-and-palettes
 * @license Apache-2.0 AND CC-BY-SA-4.0
 */
export const nordThemes: ThemePackage = {
  id: 'nord',
  name: 'Nord',
  homepage: 'https://www.nordtheme.com/',
  license: {
    spdx: 'Apache-2.0 AND CC-BY-SA-4.0',
    url: 'https://github.com/nordtheme/nord/blob/develop/LICENSE.md',
    copyright: 'Arctic Ice Studio and Sven Greb',
  },
  source: {
    package: 'nord',
    version: '0.2.1',
    repository: 'https://github.com/nordtheme/nord',
  },
  flavors: [
    {
      id: 'nord',
      label: 'Nord',
      vendor: 'nord',
      appearance: 'dark',
      iconUrl: '/assets/img/nord.png',
      tokens: {
        background: {
          base: '#2e3440',
          surface: '#3b4252',
          overlay: '#434c5e',
        },
        text: {
          primary: '#eceff4',
          secondary: '#d8dee9',
          inverse: '#2e3440',
        },
        brand: {
          primary: '#88c0d0',
        },
        state: {
          info: '#5e81ac',
          success: '#a3be8c',
          warning: '#ebcb8b',
          danger: '#bf616a',
        },
        border: {
          default: '#4c566a',
        },
        accent: {
          link: '#88c0d0',
        },
        typography: {
          fonts: {
            sans: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
            mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
          webFonts: [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap',
          ],
        },
        content: {
          heading: {
            h1: '#8fbcbb',
            h2: '#88c0d0',
            h3: '#81a1c1',
            h4: '#ebcb8b',
            h5: '#d08770',
            h6: '#b48ead',
          },
          body: {
            primary: '#eceff4',
            secondary: '#d8dee9',
          },
          link: {
            default: '#88c0d0',
          },
          selection: {
            fg: '#eceff4',
            bg: '#4c566a',
          },
          blockquote: {
            border: '#4c566a',
            fg: '#d8dee9',
            bg: '#3b4252',
          },
          codeInline: {
            fg: '#eceff4',
            bg: '#434c5e',
          },
          codeBlock: {
            fg: '#eceff4',
            bg: '#434c5e',
          },
          table: {
            border: '#4c566a',
            stripe: '#434c5e',
            theadBg: '#3b4252',
          },
        },
      },
    },
  ],
} as const;
