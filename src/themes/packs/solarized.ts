import type { ThemePackage } from '../types.js';

/**
 * Solarized theme - precision color palette for light and dark modes.
 * @see https://ethanschoonover.com/solarized/
 * @license MIT
 */
export const solarizedThemes: ThemePackage = {
  id: 'solarized',
  name: 'Solarized',
  homepage: 'https://ethanschoonover.com/solarized/',
  license: {
    spdx: 'MIT',
    url: 'https://github.com/altercation/solarized/blob/master/LICENSE',
    copyright: 'Ethan Schoonover',
  },
  source: {
    repository: 'https://github.com/altercation/solarized',
  },
  flavors: [
    {
      id: 'solarized-dark',
      label: 'Solarized Dark',
      vendor: 'solarized',
      appearance: 'dark',
      iconUrl: '/assets/img/solarized-dark.png',
      tokens: {
        background: {
          base: '#002b36',
          surface: '#073642',
          overlay: '#586e75',
        },
        text: {
          primary: '#839496',
          secondary: '#657b83',
          inverse: '#002b36',
        },
        brand: {
          primary: '#268bd2',
        },
        state: {
          info: '#2aa198',
          success: '#859900',
          warning: '#b58900',
          danger: '#dc322f',
        },
        border: {
          default: '#586e75',
        },
        accent: {
          link: '#268bd2',
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
            h1: '#268bd2',
            h2: '#2aa198',
            h3: '#859900',
            h4: '#b58900',
            h5: '#cb4b16',
            h6: '#d33682',
          },
          body: {
            primary: '#839496',
            secondary: '#657b83',
          },
          link: {
            default: '#268bd2',
          },
          selection: {
            fg: '#fdf6e3',
            bg: '#586e75',
          },
          blockquote: {
            border: '#657b83',
            fg: '#839496',
            bg: '#073642',
          },
          codeInline: {
            fg: '#2aa198',
            bg: '#073642',
          },
          codeBlock: {
            fg: '#93a1a1',
            bg: '#073642',
          },
          table: {
            border: '#586e75',
            stripe: '#073642',
            theadBg: '#586e75',
          },
        },
        components: {
          card: {
            bg: '#073642',
            border: '#586e75',
            headerBg: '#002b36',
            footerBg: '#073642',
          },
          message: {
            bg: '#002b36',
            headerBg: '#073642',
            border: '#586e75',
            bodyFg: '#839496',
          },
          panel: {
            bg: '#073642',
            headerBg: '#002b36',
            headerFg: '#93a1a1',
            border: '#586e75',
            blockBg: '#002b36',
            blockHoverBg: '#073642',
            blockActiveBg: '#586e75',
          },
          box: {
            bg: '#073642',
            border: '#586e75',
          },
          notification: {
            bg: '#002b36',
            border: '#586e75',
          },
          modal: {
            bg: 'rgba(0, 43, 54, 0.9)',
            cardBg: '#073642',
            headerBg: '#002b36',
            footerBg: '#073642',
          },
          dropdown: {
            bg: '#073642',
            itemHoverBg: '#586e75',
            border: '#586e75',
          },
          tabs: {
            border: '#586e75',
            linkBg: '#073642',
            linkActiveBg: '#002b36',
            linkHoverBg: '#586e75',
          },
        },
      },
    },
    {
      id: 'solarized-light',
      label: 'Solarized Light',
      vendor: 'solarized',
      appearance: 'light',
      iconUrl: '/assets/img/solarized-light.png',
      tokens: {
        background: {
          base: '#fdf6e3',
          surface: '#eee8d5',
          overlay: '#93a1a1',
        },
        text: {
          primary: '#586e75',
          secondary: '#657b83',
          inverse: '#fdf6e3',
        },
        brand: {
          primary: '#268bd2',
        },
        state: {
          info: '#2aa198',
          success: '#859900',
          warning: '#b58900',
          danger: '#dc322f',
          infoText: '#002b36',
          successText: '#002b36',
          warningText: '#002b36',
        },
        border: {
          default: '#93a1a1',
        },
        accent: {
          link: '#268bd2',
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
            h1: '#268bd2',
            h2: '#2aa198',
            h3: '#859900',
            h4: '#b58900',
            h5: '#cb4b16',
            h6: '#d33682',
          },
          body: {
            primary: '#586e75',
            secondary: '#657b83',
          },
          link: {
            default: '#268bd2',
          },
          selection: {
            fg: '#002b36',
            bg: '#93a1a1',
          },
          blockquote: {
            border: '#93a1a1',
            fg: '#657b83',
            bg: '#eee8d5',
          },
          codeInline: {
            fg: '#6c71c4',
            bg: '#eee8d5',
          },
          codeBlock: {
            fg: '#073642',
            bg: '#eee8d5',
          },
          table: {
            border: '#93a1a1',
            stripe: '#eee8d5',
            theadBg: '#eee8d5',
          },
        },
        components: {
          card: {
            bg: '#fdf6e3',
            border: '#93a1a1',
            headerBg: '#eee8d5',
            footerBg: '#eee8d5',
          },
          message: {
            bg: '#eee8d5',
            headerBg: '#fdf6e3',
            border: '#93a1a1',
            bodyFg: '#586e75',
          },
          panel: {
            bg: '#fdf6e3',
            headerBg: '#eee8d5',
            headerFg: '#073642',
            border: '#93a1a1',
            blockBg: '#eee8d5',
            blockHoverBg: '#fdf6e3',
            blockActiveBg: '#93a1a1',
          },
          box: {
            bg: '#fdf6e3',
            border: '#93a1a1',
          },
          notification: {
            bg: '#eee8d5',
            border: '#93a1a1',
          },
          modal: {
            bg: 'rgba(0, 43, 54, 0.86)',
            cardBg: '#fdf6e3',
            headerBg: '#eee8d5',
            footerBg: '#eee8d5',
          },
          dropdown: {
            bg: '#fdf6e3',
            itemHoverBg: '#eee8d5',
            border: '#93a1a1',
          },
          tabs: {
            border: '#93a1a1',
            linkBg: '#eee8d5',
            linkActiveBg: '#fdf6e3',
            linkHoverBg: '#93a1a1',
          },
        },
      },
    },
  ],
} as const;
