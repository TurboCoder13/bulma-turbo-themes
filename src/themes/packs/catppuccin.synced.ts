import type { ThemePackage } from "../types.js";

export const catppuccinSynced: ThemePackage = {
  id: "catppuccin",
  name: "Catppuccin (synced)",
  homepage: "https://catppuccin.com/palette/",
  flavors: [
    {
      id: "catppuccin-latte",
      label: "Catppuccin Latte",
      vendor: "catppuccin",
      appearance: "light",
      iconUrl: "/assets/img/catppuccin-latte.png",
      tokens: {
        background: {
          base: "#eff1f5",
          surface: "#e6e9ef",
          overlay: "#dce0e8",
        },
        text: {
          primary: "#4c4f69",
          secondary: "#6c6f85",
          inverse: "#eff1f5",
        },
        brand: {
          primary: "#1e66f5",
        },
        state: {
          info: "#04a5e5",
          success: "#40a02b",
          warning: "#df8e1d",
          danger: "#d20f39",
        },
        border: {
          default: "#9ca0b0",
        },
        accent: {
          link: "#1e66f5",
        },
        typography: {
          fonts: {
            sans: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
            mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
          webFonts: [
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
            "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap",
          ],
        },
        content: {
          heading: {
            h1: "#40a02b",
            h2: "#1e66f5",
            h3: "#209fb5",
            h4: "#df8e1d",
            h5: "#8839ef",
            h6: "#d20f39",
          },
          body: {
            primary: "#4c4f69",
            secondary: "#6c6f85",
          },
          link: {
            default: "#1e66f5",
          },
          selection: {
            fg: "#4c4f69",
            bg: "#8c8fa1",
          },
          blockquote: {
            border: "#8c8fa1",
            fg: "#4c4f69",
            bg: "#e6e9ef",
          },
          codeInline: {
            fg: "#4c4f69",
            bg: "#ccd0da",
          },
          codeBlock: {
            fg: "#4c4f69",
            bg: "#ccd0da",
          },
          table: {
            border: "#8c8fa1",
            stripe: "#ccd0da",
            theadBg: "#bcc0cc",
          },
        },
      },
    },
    {
      id: "catppuccin-frappe",
      label: "Catppuccin Frappé",
      vendor: "catppuccin",
      appearance: "dark",
      iconUrl: "/assets/img/catppuccin-mocha.png",
      tokens: {
        background: {
          base: "#303446",
          surface: "#292c3c",
          overlay: "#232634",
        },
        text: {
          primary: "#c6d0f5",
          secondary: "#a5adce",
          inverse: "#303446",
        },
        brand: {
          primary: "#8caaee",
        },
        state: {
          info: "#99d1db",
          success: "#a6d189",
          warning: "#e5c890",
          danger: "#e78284",
        },
        border: {
          default: "#737994",
        },
        accent: {
          link: "#8caaee",
        },
        typography: {
          fonts: {
            sans: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
            mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
          webFonts: [
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
            "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap",
          ],
        },
        content: {
          heading: {
            h1: "#a6d189",
            h2: "#8caaee",
            h3: "#85c1dc",
            h4: "#e5c890",
            h5: "#ca9ee6",
            h6: "#e78284",
          },
          body: {
            primary: "#c6d0f5",
            secondary: "#a5adce",
          },
          link: {
            default: "#8caaee",
          },
          selection: {
            fg: "#c6d0f5",
            bg: "#838ba7",
          },
          blockquote: {
            border: "#838ba7",
            fg: "#c6d0f5",
            bg: "#292c3c",
          },
          codeInline: {
            fg: "#c6d0f5",
            bg: "#414559",
          },
          codeBlock: {
            fg: "#c6d0f5",
            bg: "#414559",
          },
          table: {
            border: "#838ba7",
            stripe: "#414559",
            theadBg: "#51576d",
          },
        },
      },
    },
    {
      id: "catppuccin-macchiato",
      label: "Catppuccin Macchiato",
      vendor: "catppuccin",
      appearance: "dark",
      iconUrl: "/assets/img/catppuccin-mocha.png",
      tokens: {
        background: {
          base: "#24273a",
          surface: "#1e2030",
          overlay: "#181926",
        },
        text: {
          primary: "#cad3f5",
          secondary: "#a5adcb",
          inverse: "#24273a",
        },
        brand: {
          primary: "#8aadf4",
        },
        state: {
          info: "#91d7e3",
          success: "#a6da95",
          warning: "#eed49f",
          danger: "#ed8796",
        },
        border: {
          default: "#6e738d",
        },
        accent: {
          link: "#8aadf4",
        },
        typography: {
          fonts: {
            sans: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
            mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
          webFonts: [
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
            "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap",
          ],
        },
        content: {
          heading: {
            h1: "#a6da95",
            h2: "#8aadf4",
            h3: "#7dc4e4",
            h4: "#eed49f",
            h5: "#c6a0f6",
            h6: "#ed8796",
          },
          body: {
            primary: "#cad3f5",
            secondary: "#a5adcb",
          },
          link: {
            default: "#8aadf4",
          },
          selection: {
            fg: "#cad3f5",
            bg: "#8087a2",
          },
          blockquote: {
            border: "#8087a2",
            fg: "#cad3f5",
            bg: "#1e2030",
          },
          codeInline: {
            fg: "#cad3f5",
            bg: "#363a4f",
          },
          codeBlock: {
            fg: "#cad3f5",
            bg: "#363a4f",
          },
          table: {
            border: "#8087a2",
            stripe: "#363a4f",
            theadBg: "#494d64",
          },
        },
      },
    },
    {
      id: "catppuccin-mocha",
      label: "Catppuccin Mocha",
      vendor: "catppuccin",
      appearance: "dark",
      iconUrl: "/assets/img/catppuccin-mocha.png",
      tokens: {
        background: {
          base: "#1e1e2e",
          surface: "#181825",
          overlay: "#11111b",
        },
        text: {
          primary: "#cdd6f4",
          secondary: "#a6adc8",
          inverse: "#1e1e2e",
        },
        brand: {
          primary: "#89b4fa",
        },
        state: {
          info: "#89dceb",
          success: "#a6e3a1",
          warning: "#f9e2af",
          danger: "#f38ba8",
        },
        border: {
          default: "#6c7086",
        },
        accent: {
          link: "#89b4fa",
        },
        typography: {
          fonts: {
            sans: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
            mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
          webFonts: [
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
            "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap",
          ],
        },
        content: {
          heading: {
            h1: "#a6e3a1",
            h2: "#89b4fa",
            h3: "#74c7ec",
            h4: "#f9e2af",
            h5: "#cba6f7",
            h6: "#f38ba8",
          },
          body: {
            primary: "#cdd6f4",
            secondary: "#a6adc8",
          },
          link: {
            default: "#89b4fa",
          },
          selection: {
            fg: "#cdd6f4",
            bg: "#7f849c",
          },
          blockquote: {
            border: "#7f849c",
            fg: "#cdd6f4",
            bg: "#181825",
          },
          codeInline: {
            fg: "#cdd6f4",
            bg: "#313244",
          },
          codeBlock: {
            fg: "#cdd6f4",
            bg: "#313244",
          },
          table: {
            border: "#7f849c",
            stripe: "#313244",
            theadBg: "#45475a",
          },
        },
      },
    },
  ],
} as const;
