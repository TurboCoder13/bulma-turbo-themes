---
title: Quick Start
description: Get Turbo Themes running in your project in under 5 minutes.
category: getting-started
order: 2
prev: getting-started/index
next: getting-started/concepts
---

# Quick Start

Get Turbo Themes running in your project in under 5 minutes.

> **Try it now**: Open an interactive example in StackBlitz:
> [HTML](https://stackblitz.com/github/lgtm-hq/turbo-themes/tree/main/examples/stackblitz/html-vanilla)
> |
> [React](https://stackblitz.com/github/lgtm-hq/turbo-themes/tree/main/examples/stackblitz/react)
> |
> [Vue](https://stackblitz.com/github/lgtm-hq/turbo-themes/tree/main/examples/stackblitz/vue)
> |
> [Tailwind](https://stackblitz.com/github/lgtm-hq/turbo-themes/tree/main/examples/stackblitz/tailwind)
> |
> [Bootstrap](https://stackblitz.com/github/lgtm-hq/turbo-themes/tree/main/examples/stackblitz/bootstrap)

## Step 1: Install

Choose your preferred installation method:

### npm / Bun

```bash
npm install turbo-themes
# or
bun add turbo-themes
```

### CDN

No installation needed - just add the links to your HTML:

```html
<link rel="stylesheet" href="https://unpkg.com/turbo-themes/css/turbo-core.css" />
<link rel="stylesheet" href="https://unpkg.com/turbo-themes/css/turbo-base.css" />
<link
  rel="stylesheet"
  href="https://unpkg.com/turbo-themes/css/themes/turbo/catppuccin-mocha.css"
/>
```

## Step 2: Add CSS Files

If you installed via npm, import the CSS files in your project:

```html
<!-- Core tokens and base styles -->
<link rel="stylesheet" href="node_modules/turbo-themes/css/turbo-core.css" />
<link rel="stylesheet" href="node_modules/turbo-themes/css/turbo-base.css" />

<!-- Choose a theme -->
<link
  rel="stylesheet"
  href="node_modules/turbo-themes/css/themes/turbo/catppuccin-mocha.css"
/>

<!-- Optional: Syntax highlighting for code blocks -->
<link rel="stylesheet" href="node_modules/turbo-themes/css/turbo-syntax.css" />
```

## Step 3: Use the Tokens

Now you can use Turbo Themes tokens in your CSS:

```css
.card {
  background: var(--turbo-bg-surface);
  color: var(--turbo-text-primary);
  border: 1px solid var(--turbo-border-default);
  border-radius: 0.5rem;
  padding: 1rem;
}

.button-primary {
  background: var(--turbo-brand-primary);
  color: var(--turbo-text-inverse);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.alert-success {
  background: var(--turbo-state-success);
  color: var(--turbo-text-inverse);
}
```

## Step 4: Switch Themes (Optional)

To enable theme switching, swap the theme CSS file dynamically:

```javascript
function setTheme(themeName) {
  const themeLink = document.getElementById('theme-css');
  themeLink.href = `/css/themes/turbo/${themeName}.css`;

  // Persist the choice
  localStorage.setItem('turbo-theme', themeName);
}

// Usage
setTheme('dracula');
setTheme('catppuccin-latte');
```

## All Done

That's it! You now have a fully themed application with:

- Consistent colors across all components
- Easy theme switching
- Support for both light and dark modes

## Next Steps

- Learn about [Core Concepts](/docs/getting-started/concepts/) to understand how design
  tokens work
- Explore [Framework Integrations](/docs/integrations/) to use Turbo Themes with
  Tailwind, Bulma, or Bootstrap
- Check out the [API Reference](/docs/api-reference/) for all available tokens
- Browse [complete examples](/examples/) for React, Vue, Bootstrap, and more
