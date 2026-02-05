#!/usr/bin/env node
import { execSync } from 'node:child_process';
/* SPDX-License-Identifier: MIT */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { variants } from '@rose-pine/palette';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function rpColor(name, variant) {
  const color = variant.colors[name];
  if (!color) return undefined;
  // Normalize hex string - strip leading '#' if present before adding one
  const hex = color.hex.replace(/^#/, '');
  return `#${hex}`;
}

function buildTokens(variant) {
  // Map Rosé Pine canonical keys to our token model
  const bgBase = rpColor('base', variant) ?? '#111111';
  const bgSurface = rpColor('surface', variant) ?? bgBase;
  const bgOverlay = rpColor('overlay', variant) ?? bgSurface;
  const textPrimary = rpColor('text', variant) ?? '#ffffff';
  const textSecondary = rpColor('subtle', variant) ?? textPrimary;
  const brandPrimary = rpColor('iris', variant) ?? textPrimary;

  return {
    background: { base: bgBase, surface: bgSurface, overlay: bgOverlay },
    text: { primary: textPrimary, secondary: textSecondary, inverse: bgBase },
    brand: { primary: brandPrimary },
    state: {
      info: rpColor('foam', variant) ?? brandPrimary,
      success: rpColor('pine', variant) ?? '#22c55e',
      warning: rpColor('gold', variant) ?? '#facc15',
      danger: rpColor('love', variant) ?? '#ef4444',
    },
    border: { default: rpColor('highlightMed', variant) ?? '#e5e7eb' },
    accent: { link: rpColor('iris', variant) ?? brandPrimary },
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
        // Map headings to distinctive accent hues: h1=pine, h2=iris, h3=foam, h4=gold, h5=rose, h6=love
        h1: rpColor('pine', variant) ?? textPrimary,
        h2: rpColor('iris', variant) ?? textPrimary,
        h3: rpColor('foam', variant) ?? textPrimary,
        h4: rpColor('gold', variant) ?? textPrimary,
        h5: rpColor('rose', variant) ?? textPrimary,
        h6: rpColor('love', variant) ?? textPrimary,
      },
      body: { primary: textPrimary, secondary: textSecondary },
      link: { default: rpColor('iris', variant) ?? brandPrimary },
      selection: { fg: textPrimary, bg: rpColor('highlightHigh', variant) ?? bgSurface },
      blockquote: {
        border: rpColor('highlightHigh', variant) ?? textSecondary,
        fg: textPrimary,
        bg: bgSurface,
      },
      codeInline: { fg: textPrimary, bg: rpColor('overlay', variant) ?? bgSurface },
      codeBlock: { fg: textPrimary, bg: rpColor('overlay', variant) ?? bgSurface },
      table: {
        border: rpColor('highlightHigh', variant) ?? textSecondary,
        stripe: rpColor('overlay', variant) ?? bgSurface,
        theadBg: rpColor('highlightMed', variant) ?? bgSurface,
      },
    },
  };
}

function buildPackage() {
  const flavors = [];
  const iconMap = {
    main: '/assets/img/rose-pine.png',
    moon: '/assets/img/rose-pine-moon.png',
    dawn: '/assets/img/rose-pine-dawn.png',
  };
  // Sort variant keys for deterministic output
  const sortedKeys = Object.keys(variants).sort();
  for (const key of sortedKeys) {
    const variant = variants[key];
    // dawn is light, main and moon are dark
    const isDark = key !== 'dawn';
    const id = variant.id; // e.g., 'rose-pine', 'rose-pine-moon', 'rose-pine-dawn'
    flavors.push({
      id,
      label: variant.name,
      vendor: 'rose-pine',
      appearance: isDark ? 'dark' : 'light',
      iconUrl: iconMap[key] ?? undefined,
      tokens: buildTokens(variant),
    });
  }
  return {
    id: 'rose-pine',
    name: 'Rosé Pine (synced)',
    homepage: 'https://rosepinetheme.com/',
    flavors,
  };
}

const outPath = path.join(projectRoot, 'src', 'themes', 'packs', 'rose-pine.synced.ts');

// Ensure output directory exists
fs.mkdirSync(path.dirname(outPath), { recursive: true });

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

export const rosePineSynced: ThemePackage = ${formatObject(pkg)} as const;
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
