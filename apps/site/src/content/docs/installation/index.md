---
title: Installation Overview
description:
  Choose the right installation method for your project - npm, CDN, or platform-specific
  packages.
category: installation
order: 1
prev: getting-started/concepts
next: installation/npm
---

# Installation Overview

Turbo Themes is available through multiple distribution channels. Choose the one that
best fits your project.

## Quick Comparison

| Method                                   | Best For                        | Setup Time |
| ---------------------------------------- | ------------------------------- | ---------- |
| [npm/Bun](/docs/installation/npm/)       | Modern JavaScript projects      | 2 min      |
| [CDN](/docs/installation/cdn/)           | Quick prototypes, no build step | 1 min      |
| [Jekyll Gem](/docs/installation/jekyll/) | Ruby/Jekyll sites               | 2 min      |
| [Python](/docs/integrations/python/)     | Python applications             | 2 min      |
| [Swift](/docs/integrations/swiftui/)     | iOS/macOS apps                  | 3 min      |

## What Gets Installed

Regardless of the installation method, you get access to:

- **Core CSS files** - Token definitions and base styles
- **9 theme files** - All color schemes
- **Framework adapters** - Bulma, Tailwind integrations
- **Syntax highlighting** - Code block theming

## File Structure

```
turbo-themes/
├── css/
│   ├── turbo-core.css       # CSS variable definitions
│   ├── turbo-base.css       # Base semantic styles (optional)
│   ├── turbo-syntax.css     # Syntax highlighting (optional)
│   ├── themes/
│   │   └── turbo/
│   │       ├── catppuccin-mocha.css
│   │       ├── catppuccin-macchiato.css
│   │       ├── catppuccin-frappe.css
│   │       ├── catppuccin-latte.css
│   │       ├── dracula.css
│   │       ├── github-dark.css
│   │       ├── github-light.css
│   │       ├── bulma-dark.css
│   │       └── bulma-light.css
│   └── adapters/
│       └── bulma.css        # Bulma framework adapter
```

## Minimum Requirements

### For Web Projects

- Any modern browser (Chrome, Firefox, Safari, Edge)
- CSS custom properties support (all browsers since 2017)

### For Development

- Node.js 18+ (for npm installation)
- Ruby 3.1+ (for Jekyll gem)
- Python 3.9+ (for Python package)
- Swift 5.9+ (for Swift package)

## Next Steps

Choose your installation method:

- **[npm/Bun Installation](/docs/installation/npm/)** - Recommended for most projects
- **[CDN Installation](/docs/installation/cdn/)** - No build step required
- **[Jekyll Gem Installation](/docs/installation/jekyll/)** - For Ruby/Jekyll sites
