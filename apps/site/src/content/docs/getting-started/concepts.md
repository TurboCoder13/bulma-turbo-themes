---
title: Core Concepts
description:
  Understand design tokens, theme structure, and how Turbo Themes works under the hood.
category: getting-started
order: 3
prev: getting-started/quick-start
next: installation/index
---

# Core Concepts

This guide explains the fundamental concepts behind Turbo Themes and how it works.

## Design Tokens

Design tokens are the foundation of Turbo Themes. They are CSS custom properties
(variables) that represent your design decisions as reusable values.

```css
/* Example design tokens */
:root {
  --turbo-bg-base: #1e1e2e;
  --turbo-text-primary: #cdd6f4;
  --turbo-brand-primary: #89b4fa;
}
```

### Why Use Design Tokens?

1. **Consistency** - Same color values everywhere
2. **Maintainability** - Change once, update everywhere
3. **Theming** - Swap values to change the entire look
4. **Semantic meaning** - Names describe purpose, not appearance

## Token Categories

Turbo Themes organizes tokens into semantic categories:

### Backgrounds (`--turbo-bg-*`)

| Token                | Purpose                          |
| -------------------- | -------------------------------- |
| `--turbo-bg-base`    | Main page background             |
| `--turbo-bg-surface` | Cards, modals, elevated surfaces |
| `--turbo-bg-overlay` | Overlays, dropdowns, tooltips    |

### Text (`--turbo-text-*`)

| Token                    | Purpose                     |
| ------------------------ | --------------------------- |
| `--turbo-text-primary`   | Main body text              |
| `--turbo-text-secondary` | Muted, less important text  |
| `--turbo-text-inverse`   | Text on colored backgrounds |

### Brand (`--turbo-brand-*`)

| Token                   | Purpose                    |
| ----------------------- | -------------------------- |
| `--turbo-brand-primary` | Primary accent color, CTAs |

### State (`--turbo-state-*`)

| Token                   | Purpose                         |
| ----------------------- | ------------------------------- |
| `--turbo-state-success` | Success messages, confirmations |
| `--turbo-state-warning` | Warnings, cautions              |
| `--turbo-state-danger`  | Errors, destructive actions     |
| `--turbo-state-info`    | Informational messages          |

### Border (`--turbo-border-*`)

| Token                    | Purpose               |
| ------------------------ | --------------------- |
| `--turbo-border-default` | Standard border color |

### Syntax (`--turbo-syntax-*`)

Tokens for code syntax highlighting:

| Token                     | Purpose           |
| ------------------------- | ----------------- |
| `--turbo-syntax-comment`  | Code comments     |
| `--turbo-syntax-keyword`  | Language keywords |
| `--turbo-syntax-string`   | String literals   |
| `--turbo-syntax-number`   | Numbers           |
| `--turbo-syntax-function` | Function names    |
| `--turbo-syntax-type`     | Type annotations  |

## Theme Structure

Each theme defines values for all tokens. When you load a different theme CSS file, all
the token values change, and your UI updates automatically.

```css
/* catppuccin-mocha.css */
:root {
  --turbo-bg-base: #1e1e2e;
  --turbo-text-primary: #cdd6f4;
  /* ... */
}

/* dracula.css */
:root {
  --turbo-bg-base: #282a36;
  --turbo-text-primary: #f8f8f2;
  /* ... */
}
```

## File Structure

The Turbo Themes package is organized as follows:

```
turbo-themes/
├── css/
│   ├── turbo-core.css      # Token variable definitions
│   ├── turbo-base.css      # Base semantic styles
│   ├── turbo-syntax.css    # Syntax highlighting
│   ├── themes/
│   │   └── turbo/
│   │       ├── catppuccin-mocha.css
│   │       ├── catppuccin-latte.css
│   │       ├── dracula.css
│   │       └── ...
│   └── adapters/
│       ├── bulma.css       # Bulma framework adapter
│       └── tailwind.css    # Tailwind preset
```

## How Theme Switching Works

Theme switching is simple because all your CSS uses the same token names:

1. Your CSS references tokens: `background: var(--turbo-bg-surface)`
2. The browser resolves the current value of `--turbo-bg-surface`
3. When you load a different theme file, the value changes
4. The browser automatically re-renders with the new value

This means:

- No JavaScript required for styling
- No re-rendering of components
- Instant theme changes
- Works with any framework

## Framework Adapters

Turbo Themes provides adapters that map tokens to framework-specific variables:

### Bulma Adapter

Maps Turbo tokens to Bulma's CSS variables so Bulma components use your theme colors
automatically.

### Tailwind Preset

Extends Tailwind's color palette with Turbo token references, enabling classes like
`bg-turbo-surface` and `text-turbo-primary`.

## Next Steps

Now that you understand the concepts:

- [Install Turbo Themes](/docs/installation/) in your project
- Explore [Framework Integrations](/docs/integrations/)
- Check the [CSS Variables Reference](/docs/api-reference/css-variables/)
