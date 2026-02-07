import type { ThemePackage, ThemeTokens } from '../types.js';

/**
 * Gruvbox theme - retro groove palette with warm, earthy tones.
 * @see https://github.com/morhetz/gruvbox
 * @license MIT
 */
const TYPOGRAPHY = {
  fonts: {
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  webFonts: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap',
  ],
} as const;

const DARK_ACCENTS = {
  brand: '#d79921',
  info: '#83a598',
  success: '#b8bb26',
  warning: '#fabd2f',
  danger: '#fb4934',
  link: '#83a598',
  codeInline: '#fe8019',
  headings: {
    h1: '#b8bb26',
    h2: '#83a598',
    h3: '#8ec07c',
    h4: '#fabd2f',
    h5: '#d3869b',
    h6: '#fb4934',
  },
} as const;

const LIGHT_ACCENTS = {
  brand: '#b57614',
  info: '#076678',
  success: '#79740e',
  warning: '#b57614',
  danger: '#9d0006',
  link: '#076678',
  codeInline: '#af3a03',
  headings: {
    h1: '#79740e',
    h2: '#076678',
    h3: '#427b58',
    h4: '#b57614',
    h5: '#8f3f71',
    h6: '#9d0006',
  },
} as const;

type TokensInput = {
  appearance: 'light' | 'dark';
  background: {
    base: string;
    surface: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  border: string;
};

function hexToRgba(hex: string, alpha: number): string {
  if (!/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  const h = hex.slice(1);
  let r: number, g: number, b: number;
  if (h.length === 3) {
    r = parseInt(h.charAt(0) + h.charAt(0), 16);
    g = parseInt(h.charAt(1) + h.charAt(1), 16);
    b = parseInt(h.charAt(2) + h.charAt(2), 16);
  } else {
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildTokens({ appearance, background, text, border }: TokensInput): ThemeTokens {
  const accents = appearance === 'dark' ? DARK_ACCENTS : LIGHT_ACCENTS;
  return {
    background: {
      base: background.base,
      surface: background.surface,
      overlay: background.overlay,
    },
    text: {
      primary: text.primary,
      secondary: text.secondary,
      inverse: background.base,
    },
    brand: {
      primary: accents.brand,
    },
    state: {
      info: accents.info,
      success: accents.success,
      warning: accents.warning,
      danger: accents.danger,
    },
    border: {
      default: border,
    },
    accent: {
      link: accents.link,
    },
    typography: {
      fonts: {
        sans: TYPOGRAPHY.fonts.sans,
        mono: TYPOGRAPHY.fonts.mono,
      },
      webFonts: [...TYPOGRAPHY.webFonts],
    },
    content: {
      heading: {
        h1: accents.headings.h1,
        h2: accents.headings.h2,
        h3: accents.headings.h3,
        h4: accents.headings.h4,
        h5: accents.headings.h5,
        h6: accents.headings.h6,
      },
      body: {
        primary: text.primary,
        secondary: text.secondary,
      },
      link: {
        default: accents.link,
      },
      selection: {
        fg: text.primary,
        bg: background.overlay,
      },
      blockquote: {
        border,
        fg: text.secondary,
        bg: background.surface,
      },
      codeInline: {
        fg: accents.codeInline,
        bg: background.overlay,
      },
      codeBlock: {
        fg: text.primary,
        bg: background.surface,
      },
      table: {
        border,
        stripe: background.overlay,
        theadBg: background.surface,
      },
    },
    components:
      appearance === 'dark'
        ? {
            card: { bg: background.surface, border, headerBg: background.base, footerBg: background.surface },
            message: { bg: background.base, headerBg: background.surface, border, bodyFg: text.primary },
            panel: {
              bg: background.surface,
              headerBg: background.base,
              headerFg: text.primary,
              border,
              blockBg: background.base,
              blockHoverBg: background.surface,
              blockActiveBg: background.overlay,
            },
            box: { bg: background.surface, border },
            notification: { bg: background.base, border },
            modal: {
              bg: hexToRgba(background.base, 0.9),
              cardBg: background.surface,
              headerBg: background.base,
              footerBg: background.surface,
            },
            dropdown: { bg: background.surface, itemHoverBg: background.overlay, border },
            tabs: { border, linkBg: background.surface, linkActiveBg: background.base, linkHoverBg: background.overlay },
          }
        : {
            card: { bg: background.base, border, headerBg: background.surface, footerBg: background.surface },
            message: { bg: background.surface, headerBg: background.base, border, bodyFg: text.primary },
            panel: {
              bg: background.base,
              headerBg: background.surface,
              headerFg: text.primary,
              border,
              blockBg: background.surface,
              blockHoverBg: background.base,
              blockActiveBg: background.overlay,
            },
            box: { bg: background.base, border },
            notification: { bg: background.surface, border },
            modal: {
              bg: hexToRgba(text.primary, 0.86),
              cardBg: background.base,
              headerBg: background.surface,
              footerBg: background.surface,
            },
            dropdown: { bg: background.base, itemHoverBg: background.surface, border },
            tabs: { border, linkBg: background.surface, linkActiveBg: background.base, linkHoverBg: background.overlay },
          },
  };
}

const DARK_TEXT = {
  primary: '#ebdbb2',
  secondary: '#d5c4a1',
} as const;

const LIGHT_TEXT = {
  primary: '#3c3836',
  secondary: '#504945',
} as const;

const DARK_BORDER = '#665c54';
const LIGHT_BORDER = '#bdae93';

export const gruvboxThemes: ThemePackage = {
  id: 'gruvbox',
  name: 'Gruvbox',
  homepage: 'https://github.com/morhetz/gruvbox',
  license: {
    spdx: 'MIT',
    url: 'https://github.com/morhetz/gruvbox/blob/master/LICENSE',
    copyright: 'Pavel Pertsev',
  },
  source: {
    repository: 'https://github.com/morhetz/gruvbox',
  },
  flavors: [
    {
      id: 'gruvbox-dark-hard',
      label: 'Gruvbox Dark Hard',
      vendor: 'gruvbox',
      appearance: 'dark',
      iconUrl: '/assets/img/gruvbox-dark-hard.png',
      tokens: buildTokens({
        appearance: 'dark',
        background: {
          base: '#1d2021',
          surface: '#282828',
          overlay: '#3c3836',
        },
        text: DARK_TEXT,
        border: DARK_BORDER,
      }),
    },
    {
      id: 'gruvbox-dark',
      label: 'Gruvbox Dark',
      vendor: 'gruvbox',
      appearance: 'dark',
      iconUrl: '/assets/img/gruvbox-dark.png',
      tokens: buildTokens({
        appearance: 'dark',
        background: {
          base: '#282828',
          surface: '#3c3836',
          overlay: '#504945',
        },
        text: DARK_TEXT,
        border: DARK_BORDER,
      }),
    },
    {
      id: 'gruvbox-dark-soft',
      label: 'Gruvbox Dark Soft',
      vendor: 'gruvbox',
      appearance: 'dark',
      iconUrl: '/assets/img/gruvbox-dark-soft.png',
      tokens: buildTokens({
        appearance: 'dark',
        background: {
          base: '#32302f',
          surface: '#3c3836',
          overlay: '#504945',
        },
        text: DARK_TEXT,
        border: DARK_BORDER,
      }),
    },
    {
      id: 'gruvbox-light-hard',
      label: 'Gruvbox Light Hard',
      vendor: 'gruvbox',
      appearance: 'light',
      iconUrl: '/assets/img/gruvbox-light-hard.png',
      tokens: buildTokens({
        appearance: 'light',
        background: {
          base: '#f9f5d7',
          surface: '#fbf1c7',
          overlay: '#ebdbb2',
        },
        text: LIGHT_TEXT,
        border: LIGHT_BORDER,
      }),
    },
    {
      id: 'gruvbox-light',
      label: 'Gruvbox Light',
      vendor: 'gruvbox',
      appearance: 'light',
      iconUrl: '/assets/img/gruvbox-light.png',
      tokens: buildTokens({
        appearance: 'light',
        background: {
          base: '#fbf1c7',
          surface: '#ebdbb2',
          overlay: '#d5c4a1',
        },
        text: LIGHT_TEXT,
        border: LIGHT_BORDER,
      }),
    },
    {
      id: 'gruvbox-light-soft',
      label: 'Gruvbox Light Soft',
      vendor: 'gruvbox',
      appearance: 'light',
      iconUrl: '/assets/img/gruvbox-light-soft.png',
      tokens: (() => {
        const t = buildTokens({
          appearance: 'light',
          background: {
            base: '#f2e5bc',
            surface: '#ebdbb2',
            overlay: '#d5c4a1',
          },
          text: LIGHT_TEXT,
          border: LIGHT_BORDER,
        });
        return { ...t, state: { ...t.state, warningText: '#3c3836' } };
      })(),
    },
  ],
} as const;
