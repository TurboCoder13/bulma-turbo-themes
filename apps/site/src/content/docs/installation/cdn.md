---
title: CDN Installation
description: Use Turbo Themes directly from a CDN with no build step required.
category: installation
order: 3
prev: installation/npm
next: installation/jekyll
---

# CDN Installation

Use Turbo Themes directly from a CDN - no installation or build step required.

## Quick Start

Add these links to your HTML `<head>`:

```html
<!-- Core tokens and base styles -->
<link rel="stylesheet" href="https://unpkg.com/turbo-themes/css/turbo-core.css" />
<link rel="stylesheet" href="https://unpkg.com/turbo-themes/css/turbo-base.css" />

<!-- Choose a theme -->
<link
  rel="stylesheet"
  href="https://unpkg.com/turbo-themes/css/themes/turbo/catppuccin-mocha.css"
/>

<!-- Optional: Syntax highlighting -->
<link rel="stylesheet" href="https://unpkg.com/turbo-themes/css/turbo-syntax.css" />
```

## CDN Providers

### unpkg (Recommended)

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/turbo-themes@latest/css/turbo-core.css"
/>
```

### jsDelivr

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/turbo-themes@latest/css/turbo-core.css"
/>
```

## Pinning Versions

For production, pin to a specific version to avoid unexpected changes:

```html
<!-- Pin to specific version -->
<link rel="stylesheet" href="https://unpkg.com/turbo-themes@1.0.0/css/turbo-core.css" />
```

## Available Files

### Core Files

| File                | URL                     | Size |
| ------------------- | ----------------------- | ---- |
| Core tokens         | `/css/turbo-core.css`   | ~2KB |
| Base styles         | `/css/turbo-base.css`   | ~1KB |
| Syntax highlighting | `/css/turbo-syntax.css` | ~1KB |

### Theme Files

| Theme                | URL                                          |
| -------------------- | -------------------------------------------- |
| Catppuccin Mocha     | `/css/themes/turbo/catppuccin-mocha.css`     |
| Catppuccin Macchiato | `/css/themes/turbo/catppuccin-macchiato.css` |
| Catppuccin Frappé    | `/css/themes/turbo/catppuccin-frappe.css`    |
| Catppuccin Latte     | `/css/themes/turbo/catppuccin-latte.css`     |
| Dracula              | `/css/themes/turbo/dracula.css`              |
| GitHub Dark          | `/css/themes/turbo/github-dark.css`          |
| GitHub Light         | `/css/themes/turbo/github-light.css`         |
| Bulma Dark           | `/css/themes/turbo/bulma-dark.css`           |
| Bulma Light          | `/css/themes/turbo/bulma-light.css`          |

### Adapters

| Adapter | URL                       |
| ------- | ------------------------- |
| Bulma   | `/css/adapters/bulma.css` |

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Turbo Themed Site</title>

    <!-- Turbo Themes -->
    <link rel="stylesheet" href="https://unpkg.com/turbo-themes/css/turbo-core.css" />
    <link rel="stylesheet" href="https://unpkg.com/turbo-themes/css/turbo-base.css" />
    <link
      id="theme-css"
      rel="stylesheet"
      href="https://unpkg.com/turbo-themes/css/themes/turbo/catppuccin-mocha.css"
    />

    <style>
      body {
        background: var(--turbo-bg-base);
        color: var(--turbo-text-primary);
        font-family: system-ui, sans-serif;
        padding: 2rem;
      }

      .card {
        background: var(--turbo-bg-surface);
        border: 1px solid var(--turbo-border-default);
        border-radius: 0.5rem;
        padding: 1.5rem;
        max-width: 400px;
      }

      .btn {
        background: var(--turbo-brand-primary);
        color: var(--turbo-text-inverse);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Hello Turbo Themes!</h1>
      <p>This page uses design tokens from the CDN.</p>
      <button class="btn" onclick="toggleTheme()">Toggle Theme</button>
    </div>

    <script>
      const themes = ['catppuccin-mocha', 'catppuccin-latte', 'dracula'];
      let currentIndex = 0;

      function toggleTheme() {
        currentIndex = (currentIndex + 1) % themes.length;
        const theme = themes[currentIndex];
        document.getElementById('theme-css').href =
          `https://unpkg.com/turbo-themes/css/themes/turbo/${theme}.css`;
      }
    </script>
  </body>
</html>
```

## Performance Tips

1. **Preconnect** to the CDN for faster loading:

   ```html
   <link rel="preconnect" href="https://unpkg.com" />
   ```

2. **Preload** the theme CSS:

   ```html
   <link
     rel="preload"
     as="style"
     href="https://unpkg.com/turbo-themes/css/themes/turbo/catppuccin-mocha.css"
   />
   ```

3. **Cache** - CDN files are cached, but consider self-hosting for best performance in
   production.

## Next Steps

- Explore [npm installation](/docs/installation/npm/) for production projects
- Learn about [theme switching](/docs/guides/theme-switching/)
- Check the [API Reference](/docs/api-reference/)
