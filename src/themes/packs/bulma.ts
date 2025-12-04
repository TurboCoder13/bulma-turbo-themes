import type { ThemePackage } from '../types.js';

/**
 * Bulma default themes - Light and Dark variants
 * Based on Bulma's default color scheme with enhanced typography
 * @see https://bulma.io/documentation/customize/with-sass/
 *
 * Typography: Nunito Sans - A modern, friendly sans-serif that
 * complements Bulma's clean, European design aesthetic.
 * Monospace: JetBrains Mono for code blocks.
 */
export const bulmaThemes: ThemePackage = {
  id: 'bulma',
  name: 'Bulma',
  homepage: 'https://bulma.io/',
  flavors: [
    {
      id: 'bulma-light',
      label: 'Bulma Light',
      vendor: 'bulma',
      appearance: 'light',
      iconUrl: '/assets/img/bulma-logo.png',
      tokens: {
        background: {
          base: '#ffffff',
          surface: '#f5f5f5',
          overlay: '#eeeeee',
        },
        text: {
          primary: '#363636',
          secondary: '#4a4a4a',
          inverse: '#ffffff',
        },
        brand: {
          primary: '#00d1b2', // Bulma turquoise
        },
        state: {
          info: '#3e8ed0',
          success: '#48c78e',
          warning: '#ffe08a',
          danger: '#f14668',
        },
        border: {
          default: '#dbdbdb',
        },
        accent: {
          link: '#485fc7',
        },
        typography: {
          fonts: {
            sans: '"Nunito Sans", BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
            mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
          webFonts: [
            'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,700;1,6..12,400&display=swap',
            'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap',
          ],
        },
        content: {
          heading: {
            // Colorful headings using Bulma's vibrant palette
            h1: '#00d1b2', // Turquoise (primary brand)
            h2: '#485fc7', // Purple (link color)
            h3: '#3e8ed0', // Blue (info)
            h4: '#48c78e', // Green (success)
            h5: '#ffe08a', // Yellow (warning) - darkened for light bg
            h6: '#f14668', // Red (danger)
          },
          body: {
            primary: '#4a4a4a',
            secondary: '#7a7a7a',
          },
          link: {
            default: '#485fc7',
          },
          selection: {
            fg: '#363636',
            bg: '#b5d5ff',
          },
          blockquote: {
            border: '#dbdbdb',
            fg: '#4a4a4a',
            bg: '#f5f5f5',
          },
          codeInline: {
            fg: '#f14668',
            bg: '#f5f5f5',
          },
          codeBlock: {
            fg: '#363636',
            bg: '#f5f5f5',
          },
          table: {
            border: '#dbdbdb',
            stripe: '#fafafa',
            theadBg: '#f5f5f5',
          },
        },
      },
    },
    {
      id: 'bulma-dark',
      label: 'Bulma Dark',
      vendor: 'bulma',
      appearance: 'dark',
      iconUrl: '/assets/img/bulma-logo.png',
      tokens: {
        background: {
          base: '#141414',
          surface: '#1f1f1f',
          overlay: '#2b2b2b',
        },
        text: {
          primary: '#f5f5f5',
          secondary: '#dbdbdb',
          inverse: '#141414',
        },
        brand: {
          primary: '#00d1b2', // Bulma turquoise
        },
        state: {
          info: '#3e8ed0',
          success: '#48c78e',
          warning: '#ffe08a',
          danger: '#f14668',
        },
        border: {
          default: '#363636',
        },
        accent: {
          link: '#485fc7',
        },
        typography: {
          fonts: {
            sans: '"Nunito Sans", BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
            mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
          webFonts: [
            'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,700;1,6..12,400&display=swap',
            'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap',
          ],
        },
        content: {
          heading: {
            // Colorful headings using Bulma's vibrant palette (adjusted for dark bg)
            h1: '#00d1b2', // Turquoise (primary brand)
            h2: '#7289da', // Lighter purple for dark mode
            h3: '#5dade2', // Lighter blue for dark mode
            h4: '#58d68d', // Lighter green for dark mode
            h5: '#f7dc6f', // Yellow (good contrast on dark)
            h6: '#f1948a', // Lighter red for dark mode
          },
          body: {
            primary: '#dbdbdb',
            secondary: '#b5b5b5',
          },
          link: {
            default: '#485fc7',
          },
          selection: {
            fg: '#f5f5f5',
            bg: '#3273dc',
          },
          blockquote: {
            border: '#363636',
            fg: '#dbdbdb',
            bg: '#1f1f1f',
          },
          codeInline: {
            fg: '#f14668',
            bg: '#2b2b2b',
          },
          codeBlock: {
            fg: '#f5f5f5',
            bg: '#2b2b2b',
          },
          table: {
            border: '#363636',
            stripe: '#1f1f1f',
            theadBg: '#2b2b2b',
          },
        },
      },
    },
  ],
} as const;
