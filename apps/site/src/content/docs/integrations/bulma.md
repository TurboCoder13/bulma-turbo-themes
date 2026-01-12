---
title: Bulma
description: Integrate Turbo Themes with Bulma CSS framework using the official adapter.
category: integrations
order: 3
prev: integrations/tailwind
next: integrations/bootstrap
---

# Bulma Integration

Use Turbo Themes with Bulma CSS for component-based theming.

## Installation

### 1. Install Packages

```bash
npm install turbo-themes bulma
# or
bun add turbo-themes bulma
```

### 2. Include CSS Files

Add the CSS files in this order:

```html
<!-- 1. Turbo Themes core and your chosen theme -->
<link rel="stylesheet" href="node_modules/turbo-themes/css/turbo-core.css" />
<link
  rel="stylesheet"
  href="node_modules/turbo-themes/css/themes/turbo/catppuccin-mocha.css"
/>

<!-- 2. Bulma adapter (maps Turbo tokens to Bulma variables) -->
<link rel="stylesheet" href="node_modules/turbo-themes/css/adapters/bulma.css" />

<!-- 3. Bulma CSS -->
<link rel="stylesheet" href="node_modules/bulma/css/bulma.min.css" />
```

**Order matters!** The adapter must come before Bulma so the CSS variables are defined.

## CDN Setup

```html
<!-- Turbo Themes -->
<link rel="stylesheet" href="https://unpkg.com/turbo-themes/css/turbo-core.css" />
<link
  rel="stylesheet"
  href="https://unpkg.com/turbo-themes/css/themes/turbo/catppuccin-mocha.css"
/>
<link rel="stylesheet" href="https://unpkg.com/turbo-themes/css/adapters/bulma.css" />

<!-- Bulma -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css"
/>
```

## How It Works

The Bulma adapter maps Turbo Themes tokens to Bulma's CSS variables:

```css
/* What the adapter does (simplified) */
:root {
  --bulma-background: var(--turbo-bg-base);
  --bulma-body-background-color: var(--turbo-bg-base);
  --bulma-text: var(--turbo-text-primary);
  --bulma-text-strong: var(--turbo-text-primary);
  --bulma-primary: var(--turbo-brand-primary);
  --bulma-link: var(--turbo-brand-primary);
  --bulma-info: var(--turbo-state-info);
  --bulma-success: var(--turbo-state-success);
  --bulma-warning: var(--turbo-state-warning);
  --bulma-danger: var(--turbo-state-danger);
  --bulma-border: var(--turbo-border-default);
  /* ... and more */
}
```

## Usage Examples

Use standard Bulma classes - they'll automatically use your theme colors.

### Buttons

```html
<button class="button is-primary">Primary</button>
<button class="button is-success">Success</button>
<button class="button is-warning">Warning</button>
<button class="button is-danger">Danger</button>
<button class="button is-info">Info</button>
```

### Cards

```html
<div class="card">
  <div class="card-content">
    <p class="title">Card Title</p>
    <p class="subtitle">Card subtitle</p>
    <p>
      Card content goes here. The background, text, and border colors all come from your
      Turbo theme.
    </p>
  </div>
  <footer class="card-footer">
    <a href="#" class="card-footer-item">Save</a>
    <a href="#" class="card-footer-item">Edit</a>
    <a href="#" class="card-footer-item">Delete</a>
  </footer>
</div>
```

### Notifications

```html
<div class="notification is-primary">Primary notification</div>
<div class="notification is-success">Success notification</div>
<div class="notification is-danger">Danger notification</div>
```

### Forms

```html
<div class="field">
  <label class="label">Name</label>
  <div class="control">
    <input class="input" type="text" placeholder="Enter your name" />
  </div>
</div>

<div class="field">
  <label class="label">Message</label>
  <div class="control">
    <textarea class="textarea" placeholder="Enter your message"></textarea>
  </div>
</div>

<div class="field">
  <div class="control">
    <button class="button is-primary">Submit</button>
  </div>
</div>
```

### Navbar

```html
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/">
      <strong>My App</strong>
    </a>
  </div>

  <div class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item" href="/docs">Docs</a>
      <a class="navbar-item" href="/about">About</a>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <a class="button is-primary">Sign up</a>
      </div>
    </div>
  </div>
</nav>
```

## Theme Switching

Switching themes updates all Bulma components automatically:

```javascript
function setTheme(themeName) {
  const link = document.getElementById('theme-css');
  link.href = `/css/themes/turbo/${themeName}.css`;
  localStorage.setItem('turbo-theme', themeName);
}

// Example usage
setTheme('dracula');
setTheme('catppuccin-latte');
```

## Customizing the Adapter

To override specific mappings, add CSS after the adapter:

```css
/* Override specific Bulma variables */
:root {
  --bulma-primary: #your-custom-color;
  --bulma-primary-dark: #your-darker-color;
  --bulma-primary-light: #your-lighter-color;
}
```

## Next Steps

- Explore [Bootstrap integration](/docs/integrations/bootstrap/)
- Learn about [theme switching](/docs/guides/theme-switching/)
- Check the [CSS Variables Reference](/docs/api-reference/css-variables/)
