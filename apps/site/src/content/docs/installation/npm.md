---
title: npm / Bun Installation
description: Install Turbo Themes via npm or Bun for JavaScript and TypeScript projects.
category: installation
order: 2
prev: installation/index
next: installation/cdn
---

# npm / Bun Installation

The recommended way to install Turbo Themes for JavaScript and TypeScript projects.

## Installation

```bash
# npm
npm install turbo-themes

# Bun
bun add turbo-themes

# pnpm
pnpm add turbo-themes

# Yarn
yarn add turbo-themes
```

## Basic Setup

### 1. Import CSS Files

Add the CSS files to your HTML or import them in your bundler:

```html
<!-- In your HTML -->
<link rel="stylesheet" href="node_modules/turbo-themes/css/turbo-core.css" />
<link rel="stylesheet" href="node_modules/turbo-themes/css/turbo-base.css" />
<link
  rel="stylesheet"
  href="node_modules/turbo-themes/css/themes/turbo/catppuccin-mocha.css"
/>
```

Or with a bundler like Vite or webpack:

```javascript
// In your JavaScript entry point
import 'turbo-themes/css/turbo-core.css';
import 'turbo-themes/css/turbo-base.css';
import 'turbo-themes/css/themes/turbo/catppuccin-mocha.css';
```

### 2. Use the Tokens

Now use the CSS custom properties in your styles:

```css
.my-component {
  background: var(--turbo-bg-surface);
  color: var(--turbo-text-primary);
  border: 1px solid var(--turbo-border-default);
}
```

## Optional: Syntax Highlighting

For code blocks with theme-aware syntax highlighting:

```html
<link rel="stylesheet" href="node_modules/turbo-themes/css/turbo-syntax.css" />
```

## Theme Switching

To enable runtime theme switching:

```javascript
function setTheme(themeName) {
  // Update the theme CSS
  const themeLink = document.getElementById('theme-css');
  themeLink.href = `node_modules/turbo-themes/css/themes/turbo/${themeName}.css`;

  // Persist the choice
  localStorage.setItem('turbo-theme', themeName);
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('turbo-theme') || 'catppuccin-mocha';
  setTheme(saved);
});
```

Make sure your theme link has an ID:

```html
<link
  id="theme-css"
  rel="stylesheet"
  href="node_modules/turbo-themes/css/themes/turbo/catppuccin-mocha.css"
/>
```

## TypeScript Support

Turbo Themes includes TypeScript definitions for the theme registry:

```typescript
import { themeIds, type ThemeId } from 'turbo-themes';

// All available theme IDs
console.log(themeIds);
// ['catppuccin-mocha', 'catppuccin-latte', 'dracula', ...]

// Type-safe theme selection
function setTheme(theme: ThemeId) {
  // ...
}
```

## Using with Build Tools

### Vite

CSS imports work out of the box with Vite.

### webpack

Ensure you have `css-loader` and `style-loader` configured:

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

### PostCSS

Turbo Themes CSS is standard CSS custom properties - no PostCSS processing required.

## Next Steps

- Learn about [CDN installation](/docs/installation/cdn/) for no-build-step usage
- Explore [framework integrations](/docs/integrations/) for Tailwind, Bulma, and more
- Check the [CSS Variables Reference](/docs/api-reference/css-variables/)
