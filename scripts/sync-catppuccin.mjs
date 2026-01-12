#!/usr/bin/env node
import { execSync } from 'node:child_process';
/* SPDX-License-Identifier: MIT */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { flavors as catFlavors } from '@catppuccin/palette';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function catColor(name, flavor) {
  const entry = flavor.colorEntries.find(([n]) => n === name);
  return entry ? entry[1].hex : undefined;
}

function buildTokens(flavor) {
  // Map Catppuccin canonical keys to our token model heuristically
  // Using Latte defaults for light and Mocha/Frappe for dark as guidance
  const bgBase = catColor('base', flavor) ?? '#111111';
  const bgSurface = catColor('mantle', flavor) ?? bgBase;
  const bgOverlay = catColor('crust', flavor) ?? bgSurface;
  const textPrimary = catColor('text', flavor) ?? '#ffffff';
  const textSecondary = catColor('subtext0', flavor) ?? textPrimary;
  const brandPrimary = catColor('blue', flavor) ?? catColor('sapphire', flavor) ?? textPrimary;
  return {
    background: { base: bgBase, surface: bgSurface, overlay: bgOverlay },
    text: { primary: textPrimary, secondary: textSecondary, inverse: bgBase },
    brand: { primary: brandPrimary },
    state: {
      info: catColor('sky', flavor) ?? brandPrimary,
      success: catColor('green', flavor) ?? '#22c55e',
      warning: catColor('yellow', flavor) ?? '#facc15',
      danger: catColor('red', flavor) ?? '#ef4444',
    },
    border: { default: catColor('overlay0', flavor) ?? '#e5e7eb' },
    accent: { link: catColor('blue', flavor) ?? brandPrimary },
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
        // Map headings to distinctive accent hues similar to Dracula’s approach
        h1: catColor('green', flavor) ?? textPrimary,
        h2: catColor('blue', flavor) ?? textPrimary,
        h3: catColor('sapphire', flavor) ?? catColor('sky', flavor) ?? textPrimary,
        h4: catColor('yellow', flavor) ?? textPrimary,
        h5: catColor('mauve', flavor) ?? catColor('purple', flavor) ?? textPrimary,
        h6: catColor('red', flavor) ?? textPrimary,
      },
      body: { primary: textPrimary, secondary: textSecondary },
      link: { default: catColor('blue', flavor) ?? brandPrimary },
      selection: { fg: textPrimary, bg: catColor('overlay1', flavor) ?? bgSurface },
      blockquote: {
        border: catColor('overlay1', flavor) ?? textSecondary,
        fg: textPrimary,
        bg: bgSurface,
      },
      codeInline: { fg: textPrimary, bg: catColor('surface0', flavor) ?? bgSurface },
      codeBlock: { fg: textPrimary, bg: catColor('surface0', flavor) ?? bgSurface },
      table: {
        border: catColor('overlay1', flavor) ?? textSecondary,
        stripe: catColor('surface0', flavor) ?? bgSurface,
        theadBg: catColor('surface1', flavor) ?? bgSurface,
      },
    },
  };
}

function buildPackage() {
  const flavors = [];
  for (const [key, flavor] of Object.entries(catFlavors)) {
    const isDark = flavor.dark;
    const id = `catppuccin-${key.toLowerCase()}`;
    const iconMap = {
      latte: '/assets/img/catppuccin-latte.png',
      mocha: '/assets/img/catppuccin-mocha.png',
      frappe: '/assets/img/catppuccin-mocha.png',
      macchiato: '/assets/img/catppuccin-mocha.png',
    };
    flavors.push({
      id,
      label: `Catppuccin ${flavor.name}`,
      vendor: 'catppuccin',
      appearance: isDark ? 'dark' : 'light',
      iconUrl: iconMap[key.toLowerCase()] ?? undefined,
      tokens: buildTokens(flavor),
    });
  }
  return {
    id: 'catppuccin',
    name: 'Catppuccin (synced)',
    homepage: 'https://catppuccin.com/palette/',
    flavors,
  };
}

const outPath = path.join(projectRoot, 'packages', 'core', 'src', 'themes', 'packs', 'catppuccin.synced.ts');
const pkg = buildPackage();
// Generate properly formatted TypeScript content
function formatObject(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  if (Array.isArray(obj)) {
    const items = obj.map((item) => `${spaces}  ${formatObject(item, indent + 1)}`).join(',\n');
    return `[\n${items},\n${spaces}]`;
  } else if (obj && typeof obj === 'object') {
    const entries = Object.entries(obj);
    if (entries.length === 0) return '{}';
    const items = entries
      .map(([key, value]) => {
        const formattedValue = formatObject(value, indent + 1);
        return `${spaces}  ${key}: ${formattedValue}`;
      })
      .join(',\n');
    return `{\n${items},\n${spaces}}`;
  } else if (typeof obj === 'string') {
    // Escape backslashes first, then quotes and control characters
    const escaped = obj
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    return `'${escaped}'`;
  } else {
    return String(obj);
  }
}

const rawContent = `import type { ThemePackage } from '../types.js';

export const catppuccinSynced: ThemePackage = ${formatObject(pkg)} as const;
`;

// Write file first, then format with lintro
fs.writeFileSync(outPath, rawContent, 'utf8');

// Format with lintro using repository configuration
try {
  execSync(`uv run lintro fmt "${outPath}"`, {
    cwd: projectRoot,
    stdio: 'inherit',
  });
} catch {
  console.warn(`Warning: lintro fmt failed for ${outPath}, file written but may not be formatted`);
}

console.log(`Wrote ${outPath}`);
