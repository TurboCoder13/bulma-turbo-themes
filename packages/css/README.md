# @turbo-themes/css

Pure CSS Custom Properties output for Turbo Themes. Framework-agnostic theming with
minimal footprint.

## Features

- **Pure CSS Custom Properties** - No framework dependencies
- **Tiny footprint** - ~2KB per theme, ~3KB base styles
- **Framework agnostic** - Works with any CSS framework or none
- **Semantic variables** - Consistent naming convention across all themes

## Installation

```bash
npm install @turbocoder13/turbo-themes-css
# or
bun add @turbocoder13/turbo-themes-css
```

## Quick Start

### Option 1: Combined Bundle (Simplest)

Include the combined CSS file that contains core variables and all themes:

```html
<link
  rel="stylesheet"
  href="node_modules/@turbocoder13/turbo-themes-css/dist/turbo.css"
/>
```

Then set the theme:

```html
<html data-theme="catppuccin-mocha"></html>
```

### Option 2: Individual Files (Optimized)

For better performance, load only what you need:

```html
<!-- Core variables (required) -->
<link
  rel="stylesheet"
  href="node_modules/@turbocoder13/turbo-themes-css/dist/turbo-core.css"
/>

<!-- Optional base semantic styles -->
<link
  rel="stylesheet"
  href="node_modules/@turbocoder13/turbo-themes-css/dist/turbo-base.css"
/>

<!-- Load theme on demand -->
<link
  rel="stylesheet"
  href="node_modules/@turbocoder13/turbo-themes-css/dist/themes/catppuccin-mocha.css"
/>
```

### Option 3: With a Bundler

```js
// Import core variables
import '@turbocoder13/turbo-themes-css/turbo-core.css';

// Import optional base styles
import '@turbocoder13/turbo-themes-css/turbo-base.css';

// Import specific theme(s)
import '@turbocoder13/turbo-themes-css/themes/catppuccin-mocha.css';
```

## Available Files

| File               | Size  | Description                                        |
| ------------------ | ----- | -------------------------------------------------- |
| `turbo.css`        | ~20KB | Combined bundle with all themes                    |
| `turbo-core.css`   | ~2KB  | Default CSS variables in `:root`                   |
| `turbo-base.css`   | ~4KB  | Optional semantic styles (typography, forms, etc.) |
| `turbo-syntax.css` | ~3KB  | Syntax highlighting styles for code blocks         |
| `themes/<id>.css`  | ~2KB  | Individual theme files                             |

## Available Themes

| Theme                | ID                     | Appearance |
| -------------------- | ---------------------- | ---------- |
| Catppuccin Mocha     | `catppuccin-mocha`     | Dark       |
| Catppuccin Macchiato | `catppuccin-macchiato` | Dark       |
| Catppuccin Frappe    | `catppuccin-frappe`    | Dark       |
| Catppuccin Latte     | `catppuccin-latte`     | Light      |
| Dracula              | `dracula`              | Dark       |
| GitHub Dark          | `github-dark`          | Dark       |
| GitHub Light         | `github-light`         | Light      |
| Bulma Dark           | `bulma-dark`           | Dark       |
| Bulma Light          | `bulma-light`          | Light      |

## CSS Variables Reference

### Background

```css
--turbo-bg-base      /* Main background color */
--turbo-bg-surface   /* Elevated surface (cards, modals) */
--turbo-bg-overlay   /* Overlay/overlay backgrounds */
```

### Text

```css
--turbo-text-primary    /* Primary text color */
--turbo-text-secondary  /* Secondary/muted text */
--turbo-text-inverse    /* Text on primary/brand backgrounds */
```

### Brand & State

```css
--turbo-brand-primary   /* Primary brand color */
--turbo-state-info      /* Info state */
--turbo-state-success   /* Success state */
--turbo-state-warning   /* Warning state */
--turbo-state-danger    /* Danger/error state */
```

### Typography

```css
--turbo-font-sans    /* Sans-serif font stack */
--turbo-font-mono    /* Monospace font stack */
```

### Content

```css
--turbo-heading-h1 through --turbo-heading-h6  /* Heading colors */
--turbo-body-primary, --turbo-body-secondary   /* Body text */
--turbo-accent-link                            /* Link color */
--turbo-selection-fg, --turbo-selection-bg     /* Text selection */
--turbo-code-inline-fg, --turbo-code-inline-bg /* Inline code */
--turbo-code-block-fg, --turbo-code-block-bg   /* Code blocks */
--turbo-blockquote-fg, --turbo-blockquote-bg, --turbo-blockquote-border
--turbo-table-border, --turbo-table-stripe, --turbo-table-thead-bg
```

### Border

```css
--turbo-border-default  /* Default border color */
```

### Syntax Highlighting

```css
--turbo-syntax-fg        /* Code foreground color */
--turbo-syntax-bg        /* Code background color */
--turbo-syntax-comment   /* Comments */
--turbo-syntax-keyword   /* Keywords (if, else, function, etc.) */
--turbo-syntax-string    /* Strings */
--turbo-syntax-number    /* Numbers */
--turbo-syntax-function  /* Function names */
--turbo-syntax-type      /* Classes and types */
--turbo-syntax-variable  /* Variables */
--turbo-syntax-operator  /* Operators */
--turbo-syntax-tag       /* HTML/XML tags */
--turbo-syntax-attribute /* Attributes */
--turbo-syntax-deleted   /* Diff deletions */
--turbo-syntax-inserted  /* Diff insertions */
```

## Syntax Highlighting

The `turbo-syntax.css` file provides syntax highlighting for code blocks. It's
compatible with popular highlighters:

- **Rouge** (Jekyll's default)
- **Prism.js**
- **highlight.js**

### Usage

```html
<!-- Include after your theme CSS -->
<link rel="stylesheet" href="turbo-syntax.css" />
```

The syntax highlighting automatically uses theme colors - no additional configuration
needed.

## Theme Switching

### JavaScript

```js
function setTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem('turbo-theme', themeId);
}

// On page load
const savedTheme = localStorage.getItem('turbo-theme') || 'catppuccin-mocha';
setTheme(savedTheme);
```

### Dynamic Loading

```js
async function loadTheme(themeId) {
  // Remove old theme
  document.getElementById('theme-css')?.remove();

  // Load new theme
  const link = document.createElement('link');
  link.id = 'theme-css';
  link.rel = 'stylesheet';
  link.href = `/path/to/themes/${themeId}.css`;
  document.head.appendChild(link);

  document.documentElement.setAttribute('data-theme', themeId);
}
```

## Using with Frameworks

### With Tailwind CSS

Use the `@turbo-themes/adapter-tailwind` package for seamless integration:

```js
// tailwind.config.js
module.exports = {
  presets: [require('@turbocoder13/turbo-themes/adapters/tailwind/preset')],
};
```

### With Bulma

Use the `@turbo-themes/adapter-bulma` package:

```css
@import '@turbocoder13/turbo-themes-css/turbo-core.css';
@import '@turbocoder13/turbo-themes/adapters/bulma.css';
@import 'bulma/css/bulma.css';
```

## Programmatic Usage

Generate CSS programmatically in Node.js/Bun:

```ts
import { generateThemeCss, generateCoreCss } from '@turbocoder13/turbo-themes-css';
import { getTheme } from '@turbocoder13/turbo-themes-core';

const theme = getTheme('catppuccin-mocha');
const css = generateThemeCss(theme);
console.log(css);
```

## License

MIT
