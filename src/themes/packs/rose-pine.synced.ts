import type { ThemePackage } from '../types.js';

/**
 * Rosé Pine theme - All natural pine, faux fur and a bit of soho vibes
 * Auto-synced from @rose-pine/palette
 * @see https://rosepinetheme.com/
 * @license MIT
 *
 * DO NOT EDIT MANUALLY - regenerate with: node scripts/sync-rose-pine.mjs
 */
export const rosePineSynced: ThemePackage = {
  id: 'rose-pine',
  name: 'Rosé Pine (synced)',
  homepage: 'https://rosepinetheme.com/',
  license: {
    spdx: 'MIT',
    url: 'https://github.com/rose-pine/rose-pine-theme/blob/main/license',
    copyright: 'Rosé Pine',
  },
  source: {
    package: '@rose-pine/palette',
    version: '4.0.1',
    repository: 'https://github.com/rose-pine/palette',
  },
  flavors: [
    {
      id: 'rose-pine-dawn',
      label: 'Rosé Pine Dawn',
      vendor: 'rose-pine',
      appearance: 'light',
      iconUrl: '/assets/img/rose-pine-dawn.png',
      tokens: {
        background: {
          base: '#faf4ed',
          surface: '#fffaf3',
          overlay: '#f2e9e1',
        },
        text: {
          primary: '#575279',
          secondary: '#797593',
          inverse: '#faf4ed',
        },
        brand: {
          primary: '#907aa9',
        },
        state: {
          info: '#56949f',
          success: '#286983',
          warning: '#ea9d34',
          danger: '#b4637a',
          warningText: '#000000',
        },
        border: {
          default: '#dfdad9',
        },
        accent: {
          link: '#907aa9',
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
            h1: '#286983',
            h2: '#907aa9',
            h3: '#56949f',
            h4: '#ea9d34',
            h5: '#d7827e',
            h6: '#b4637a',
          },
          body: {
            primary: '#575279',
            secondary: '#797593',
          },
          link: {
            default: '#907aa9',
          },
          selection: {
            fg: '#575279',
            bg: '#cecacd',
          },
          blockquote: {
            border: '#cecacd',
            fg: '#575279',
            bg: '#fffaf3',
          },
          codeInline: {
            fg: '#575279',
            bg: '#f2e9e1',
          },
          codeBlock: {
            fg: '#575279',
            bg: '#f2e9e1',
          },
          table: {
            border: '#cecacd',
            stripe: '#f2e9e1',
            theadBg: '#dfdad9',
          },
        },
      },
    },
    {
      id: 'rose-pine',
      label: 'Rosé Pine',
      vendor: 'rose-pine',
      appearance: 'dark',
      iconUrl: '/assets/img/rose-pine.png',
      tokens: {
        background: {
          base: '#191724',
          surface: '#1f1d2e',
          overlay: '#26233a',
        },
        text: {
          primary: '#e0def4',
          secondary: '#908caa',
          inverse: '#191724',
        },
        brand: {
          primary: '#c4a7e7',
        },
        state: {
          info: '#9ccfd8',
          success: '#31748f',
          warning: '#f6c177',
          danger: '#eb6f92',
        },
        border: {
          default: '#403d52',
        },
        accent: {
          link: '#c4a7e7',
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
            h1: '#31748f',
            h2: '#c4a7e7',
            h3: '#9ccfd8',
            h4: '#f6c177',
            h5: '#ebbcba',
            h6: '#eb6f92',
          },
          body: {
            primary: '#e0def4',
            secondary: '#908caa',
          },
          link: {
            default: '#c4a7e7',
          },
          selection: {
            fg: '#e0def4',
            bg: '#524f67',
          },
          blockquote: {
            border: '#524f67',
            fg: '#e0def4',
            bg: '#1f1d2e',
          },
          codeInline: {
            fg: '#e0def4',
            bg: '#26233a',
          },
          codeBlock: {
            fg: '#e0def4',
            bg: '#26233a',
          },
          table: {
            border: '#524f67',
            stripe: '#26233a',
            theadBg: '#403d52',
          },
        },
      },
    },
    {
      id: 'rose-pine-moon',
      label: 'Rosé Pine Moon',
      vendor: 'rose-pine',
      appearance: 'dark',
      iconUrl: '/assets/img/rose-pine-moon.png',
      tokens: {
        background: {
          base: '#232136',
          surface: '#2a273f',
          overlay: '#393552',
        },
        text: {
          primary: '#e0def4',
          secondary: '#908caa',
          inverse: '#232136',
        },
        brand: {
          primary: '#c4a7e7',
        },
        state: {
          info: '#9ccfd8',
          success: '#3e8fb0',
          warning: '#f6c177',
          danger: '#eb6f92',
        },
        border: {
          default: '#44415a',
        },
        accent: {
          link: '#c4a7e7',
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
            h1: '#3e8fb0',
            h2: '#c4a7e7',
            h3: '#9ccfd8',
            h4: '#f6c177',
            h5: '#ea9a97',
            h6: '#eb6f92',
          },
          body: {
            primary: '#e0def4',
            secondary: '#908caa',
          },
          link: {
            default: '#c4a7e7',
          },
          selection: {
            fg: '#e0def4',
            bg: '#56526e',
          },
          blockquote: {
            border: '#56526e',
            fg: '#e0def4',
            bg: '#2a273f',
          },
          codeInline: {
            fg: '#e0def4',
            bg: '#393552',
          },
          codeBlock: {
            fg: '#e0def4',
            bg: '#393552',
          },
          table: {
            border: '#56526e',
            stripe: '#393552',
            theadBg: '#44415a',
          },
        },
      },
    },
  ],
} as const;
