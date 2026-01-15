---
title: Introduction
description:
  Get started with Turbo Themes - platform-agnostic design tokens that work with any CSS
  framework.
category: getting-started
order: 1
next: getting-started/quick-start
---

# Introduction to Turbo Themes

Turbo Themes provides platform-agnostic design tokens that work with any CSS framework.
It's a comprehensive theming solution that gives you beautiful, consistent color schemes
across your entire application.

## What are Design Tokens?

Design tokens are CSS custom properties (variables) that define your theme's colors,
typography, spacing, and other design values. Turbo Themes provides a consistent set of
tokens that adapt to different color schemes.

## Why Turbo Themes?

With Turbo Themes, you get:

- **9 beautiful themes** including Catppuccin, Dracula, GitHub, and Bulma variants
- **Framework adapters** for Pure CSS, Bulma, and Tailwind CSS
- **Semantic tokens** for backgrounds, text, borders, and state colors
- **Syntax highlighting** support for code blocks
- **Multi-platform support** - available as npm package, Ruby gem, Python package, and
  Swift package

## Available Themes

### Dark Themes

| Theme                | Description                           |
| -------------------- | ------------------------------------- |
| Catppuccin Mocha     | Warm, cozy dark theme                 |
| Catppuccin Macchiato | Balanced dark theme                   |
| Catppuccin Frappé    | Softer dark theme                     |
| Dracula              | Classic dark theme with vivid accents |
| GitHub Dark          | GitHub's dark mode colors             |
| Bulma Dark           | Bulma-inspired dark theme             |

### Light Themes

| Theme            | Description                |
| ---------------- | -------------------------- |
| Catppuccin Latte | Warm, creamy light theme   |
| GitHub Light     | GitHub's light mode colors |
| Bulma Light      | Bulma-inspired light theme |

## Quick Example

Here's how simple it is to use Turbo Themes:

```html
<!-- Include the core CSS and a theme -->
<link rel="stylesheet" href="https://unpkg.com/turbo-themes/css/turbo-core.css" />
<link rel="stylesheet" href="https://unpkg.com/turbo-themes/css/turbo-base.css" />
<link
  rel="stylesheet"
  href="https://unpkg.com/turbo-themes/css/themes/turbo/catppuccin-mocha.css"
/>
```

```css
/* Use the tokens in your CSS */
.my-card {
  background: var(--turbo-bg-surface);
  color: var(--turbo-text-primary);
  border: 1px solid var(--turbo-border-default);
}
```

## Next Steps

Ready to get started? Head to the [Quick Start](/docs/getting-started/quick-start/)
guide to set up Turbo Themes in your project in under 5 minutes.
