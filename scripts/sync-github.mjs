#!/usr/bin/env node
/* SPDX-License-Identifier: MIT */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Path to @primer/primitives theme JSON files
const primitivesPath = path.join(
  projectRoot,
  "node_modules",
  "@primer",
  "primitives",
  "dist",
  "docs",
  "functional",
  "themes",
);

/**
 * Load a Primer theme JSON file
 * @param {string} themeName - Name of the theme file (e.g., 'light', 'dark')
 * @returns {Record<string, { value: string }>} Theme tokens
 */
function loadPrimerTheme(themeName) {
  const themePath = path.join(primitivesPath, `${themeName}.json`);
  if (!fs.existsSync(themePath)) {
    throw new Error(`Primer theme not found: ${themePath}`);
  }
  return JSON.parse(fs.readFileSync(themePath, "utf8"));
}

/**
 * Extract a color value from Primer tokens
 * @param {Record<string, { value: string }>} tokens - Primer tokens
 * @param {string} key - Token key
 * @returns {string | undefined} Hex color value
 */
function getColor(tokens, key) {
  return tokens[key]?.value;
}

/**
 * Build ThemeTokens from Primer primitives
 * @param {Record<string, { value: string }>} tokens - Primer tokens
 * @param {'light' | 'dark'} appearance - Theme appearance
 * @returns {import('../src/themes/types.js').ThemeTokens}
 */
function buildTokens(tokens, appearance) {
  const bgBase = getColor(tokens, "bgColor-default") ?? "#ffffff";
  const bgSurface = getColor(tokens, "bgColor-muted") ?? bgBase;
  const bgOverlay = getColor(tokens, "bgColor-inset") ?? bgSurface;
  const textPrimary = getColor(tokens, "fgColor-default") ?? "#1f2328";
  const textSecondary = getColor(tokens, "fgColor-muted") ?? textPrimary;
  const textInverse = getColor(tokens, "fgColor-onEmphasis") ?? "#ffffff";
  const brandPrimary = getColor(tokens, "bgColor-accent-emphasis") ?? "#0969da";
  const linkColor = getColor(tokens, "fgColor-link") ?? brandPrimary;
  const borderDefault = getColor(tokens, "borderColor-default") ?? "#d1d9e0";

  // State colors - used for colorful headings (GitHub's core palette)
  const infoColor = getColor(tokens, "fgColor-accent") ?? brandPrimary;
  const successColor = getColor(tokens, "fgColor-success") ?? "#1a7f37";
  const warningColor = getColor(tokens, "fgColor-attention") ?? "#9a6700";
  const dangerColor = getColor(tokens, "fgColor-danger") ?? "#d1242f";

  // Additional accent colors for headings - using GitHub's authentic palette
  const openColor = getColor(tokens, "fgColor-open") ?? successColor; // Green for open PRs/issues
  const closedColor = getColor(tokens, "fgColor-closed") ?? dangerColor; // Red for closed

  // Code colors
  const codeBg = getColor(tokens, "bgColor-muted") ?? bgSurface;

  return {
    background: { base: bgBase, surface: bgSurface, overlay: bgOverlay },
    text: { primary: textPrimary, secondary: textSecondary, inverse: textInverse },
    brand: { primary: brandPrimary },
    state: {
      info: infoColor,
      success: successColor,
      warning: warningColor,
      danger: dangerColor,
    },
    border: { default: borderDefault },
    accent: { link: linkColor },
    typography: {
      fonts: {
        // Mona Sans - GitHub's custom variable typeface
        // Hubot Sans for monospace (GitHub's companion mono font)
        sans: '"Mona Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        mono: '"Hubot Sans", ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, "Liberation Mono", monospace',
      },
      webFonts: [
        "https://github.githubassets.com/assets/mona-sans-webfont.woff2",
        "https://github.githubassets.com/assets/hubot-sans-webfont.woff2",
      ],
    },
    content: {
      heading: {
        // Colorful headings using GitHub's authentic accent palette
        // Only blues, greens, and oranges - no purples/pinks
        h1: successColor, // Green - primary importance (like merged PRs)
        h2: infoColor, // Blue - main accent color
        h3: brandPrimary, // Primary blue - secondary sections
        h4: warningColor, // Orange/Amber - attention/warning
        h5: openColor, // Green variant - minor sections
        h6: closedColor, // Red - smallest headings (like closed issues)
      },
      body: { primary: textPrimary, secondary: textSecondary },
      link: { default: linkColor },
      selection: {
        fg: textPrimary,
        bg: appearance === "light" ? "#b6e3ff" : "#264f78",
      },
      blockquote: {
        border: borderDefault,
        fg: textSecondary,
        bg: bgSurface,
      },
      codeInline: { fg: textPrimary, bg: codeBg },
      codeBlock: { fg: textPrimary, bg: codeBg },
      table: {
        border: borderDefault,
        stripe: bgSurface,
        theadBg: bgSurface,
      },
    },
  };
}

/**
 * Build the complete ThemePackage from Primer primitives
 * @returns {import('../src/themes/types.js').ThemePackage}
 */
function buildPackage() {
  const themes = [
    { name: "light", label: "GitHub Light", appearance: "light", icon: "/assets/img/github-logo-light.png" },
    { name: "dark", label: "GitHub Dark", appearance: "dark", icon: "/assets/img/github-logo-dark.png" },
  ];

  const flavors = themes.map(({ name, label, appearance, icon }) => {
    const tokens = loadPrimerTheme(name);
    return {
      id: `github-${name}`,
      label,
      vendor: "github",
      appearance,
      iconUrl: icon,
      tokens: buildTokens(tokens, appearance),
    };
  });

  return {
    id: "github",
    name: "GitHub (synced)",
    homepage: "https://primer.style/",
    flavors,
  };
}

// Generate properly formatted TypeScript content
function formatObject(obj, indent = 0) {
  const spaces = "  ".repeat(indent);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    const items = obj.map((item) => `${spaces}  ${formatObject(item, indent + 1)}`).join(",\n");
    return `[\n${items},\n${spaces}]`;
  } else if (obj && typeof obj === "object") {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "{}";
    const items = entries
      .map(([key, value]) => {
        const formattedValue = formatObject(value, indent + 1);
        return `${spaces}  ${key}: ${formattedValue}`;
      })
      .join(",\n");
    return `{\n${items},\n${spaces}}`;
  } else if (typeof obj === "string") {
    // Escape backslashes first, then quotes and control characters
    const escaped = obj
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
    return `'${escaped}'`;
  } else {
    return String(obj);
  }
}

const outPath = path.join(projectRoot, "src", "themes", "packs", "github.synced.ts");
const pkg = buildPackage();

const rawContent = `import type { ThemePackage } from '../types.js';

/**
 * GitHub themes - auto-synced from @primer/primitives
 * Based on GitHub's Primer design system colors
 * @see https://primer.style/foundations/color
 *
 * DO NOT EDIT MANUALLY - regenerate with: node scripts/sync-github.mjs
 */
export const githubSynced: ThemePackage = ${formatObject(pkg)} as const;
`;

// Write file first, then format with lintro
fs.writeFileSync(outPath, rawContent, "utf8");

// Format with lintro using repository configuration
try {
  execSync(`uv run lintro fmt "${outPath}"`, {
    cwd: projectRoot,
    stdio: "inherit",
  });
} catch {
  console.warn(`Warning: lintro fmt failed for ${outPath}, file written but may not be formatted`);
}

console.log(`Wrote ${outPath}`);
console.log(`Synced ${pkg.flavors.length} GitHub themes from @primer/primitives`);

