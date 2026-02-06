import type { ThemePackage } from '../types.js';

/**
 * Tokyo Night theme
 * Based on the official Tokyo Night VS Code theme palette
 * @see https://github.com/enkia/tokyo-night-vscode-theme
 * @license MIT
 */
export const tokyoNightThemes: ThemePackage = {
  id: 'tokyo-night',
  name: 'Tokyo Night',
  homepage: 'https://github.com/enkia/tokyo-night-vscode-theme',
  license: {
    spdx: 'MIT',
    url: 'https://github.com/enkia/tokyo-night-vscode-theme/blob/master/LICENSE.txt',
    copyright: 'enkia',
  },
  source: {
    repository: 'https://github.com/enkia/tokyo-night-vscode-theme',
  },
  flavors: [
    {
      id: 'tokyo-night-dark',
      label: 'Night',
      vendor: 'tokyo-night',
      appearance: 'dark',
      iconUrl: '/assets/img/tokyo-night.png',
      tokens: {
        background: {
          base: '#1a1b26',
          surface: '#24283b',
          overlay: '#28344a',
        },
        text: {
          primary: '#c0caf5',
          secondary: '#a9b1d6',
          inverse: '#1a1b26',
        },
        brand: {
          primary: '#7aa2f7',
        },
        state: {
          info: '#7dcfff',
          success: '#9ece6a',
          warning: '#e0af68',
          danger: '#f7768e',
        },
        border: {
          default: '#565f89',
        },
        accent: {
          link: '#7aa2f7',
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
            h1: '#7aa2f7',
            h2: '#bb9af7',
            h3: '#7dcfff',
            h4: '#e0af68',
            h5: '#ff9e64',
            h6: '#f7768e',
          },
          body: {
            primary: '#c0caf5',
            secondary: '#a9b1d6',
          },
          link: {
            default: '#7aa2f7',
          },
          selection: {
            fg: '#c0caf5',
            bg: '#28344a',
          },
          blockquote: {
            border: '#565f89',
            fg: '#a9b1d6',
            bg: '#24283b',
          },
          codeInline: {
            fg: '#c0caf5',
            bg: '#28344a',
          },
          codeBlock: {
            fg: '#c0caf5',
            bg: '#28344a',
          },
          table: {
            border: '#565f89',
            stripe: '#24283b',
            theadBg: '#28344a',
          },
        },
      },
    },
    {
      id: 'tokyo-night-storm',
      label: 'Storm',
      vendor: 'tokyo-night',
      appearance: 'dark',
      iconUrl: '/assets/img/tokyo-night.png',
      tokens: {
        background: {
          base: '#24283b',
          surface: '#28344a',
          overlay: '#565f89',
        },
        text: {
          primary: '#c0caf5',
          secondary: '#a9b1d6',
          inverse: '#24283b',
        },
        brand: {
          primary: '#7aa2f7',
        },
        state: {
          info: '#7dcfff',
          success: '#9ece6a',
          warning: '#e0af68',
          danger: '#f7768e',
        },
        border: {
          default: '#565f89',
        },
        accent: {
          link: '#7aa2f7',
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
            h1: '#7aa2f7',
            h2: '#bb9af7',
            h3: '#7dcfff',
            h4: '#e0af68',
            h5: '#ff9e64',
            h6: '#f7768e',
          },
          body: {
            primary: '#c0caf5',
            secondary: '#a9b1d6',
          },
          link: {
            default: '#7aa2f7',
          },
          selection: {
            fg: '#c0caf5',
            bg: '#28344a',
          },
          blockquote: {
            border: '#565f89',
            fg: '#a9b1d6',
            bg: '#28344a',
          },
          codeInline: {
            fg: '#c0caf5',
            bg: '#28344a',
          },
          codeBlock: {
            fg: '#c0caf5',
            bg: '#28344a',
          },
          table: {
            border: '#565f89',
            stripe: '#28344a',
            theadBg: '#28344a',
          },
        },
      },
    },
    {
      id: 'tokyo-night-light',
      label: 'Light',
      vendor: 'tokyo-night',
      appearance: 'light',
      iconUrl: '/assets/img/tokyo-night.png',
      tokens: {
        background: {
          base: '#e6e7ed',
          surface: '#d5d6dc',
          overlay: '#c8d3f5',
        },
        text: {
          primary: '#343b58',
          secondary: '#40434f',
          inverse: '#e6e7ed',
        },
        brand: {
          primary: '#2e7de9',
        },
        state: {
          info: '#0089a5',
          success: '#2f866c',
          warning: '#8c6c3e',
          danger: '#d81159',
        },
        border: {
          default: '#b0b4ca',
        },
        accent: {
          link: '#2e7de9',
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
            h1: '#2e7de9',
            h2: '#7847bd',
            h3: '#0089a5',
            h4: '#8c6c3e',
            h5: '#f1784b',
            h6: '#d81159',
          },
          body: {
            primary: '#343b58',
            secondary: '#40434f',
          },
          link: {
            default: '#2e7de9',
          },
          selection: {
            fg: '#343b58',
            bg: '#c8d3f5',
          },
          blockquote: {
            border: '#b0b4ca',
            fg: '#40434f',
            bg: '#e6e7ed',
          },
          codeInline: {
            fg: '#343b58',
            bg: '#c8d3f5',
          },
          codeBlock: {
            fg: '#343b58',
            bg: '#c8d3f5',
          },
          table: {
            border: '#b0b4ca',
            stripe: '#e6e7ed',
            theadBg: '#c8d3f5',
          },
        },
      },
    },
  ],
} as const;
