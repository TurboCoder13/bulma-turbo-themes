// SPDX-License-Identifier: MIT
// Type definitions for theme packages

export interface ThemeTokens {
  background: {
    base: string;
    surface: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    inverse: string;
  };
  brand: {
    primary: string;
  };
  state: {
    info: string;
    success: string;
    warning: string;
    danger: string;
  };
  border: {
    default: string;
  };
  accent: {
    link: string;
  };
  typography: {
    fonts: {
      sans: string;
      mono: string;
    };
    webFonts: string[];
  };
  content: {
    heading: {
      h1: string;
      h2: string;
      h3: string;
      h4: string;
      h5: string;
      h6: string;
    };
    body: {
      primary: string;
      secondary: string;
    };
    link: {
      default: string;
    };
    selection: {
      fg: string;
      bg: string;
    };
    blockquote: {
      border: string;
      fg: string;
      bg: string;
    };
    codeInline: {
      fg: string;
      bg: string;
    };
    codeBlock: {
      fg: string;
      bg: string;
    };
    table: {
      border: string;
      stripe: string;
      theadBg: string;
    };
  };
}

export interface ThemeFlavor {
  id: string;
  label: string;
  vendor: string;
  appearance: "light" | "dark";
  iconUrl?: string;
  tokens: ThemeTokens;
}

export interface ThemePackage {
  id: string;
  name: string;
  homepage: string;
  flavors: ThemeFlavor[];
}
