---
title: API Reference
description:
  Complete reference for Turbo Themes tokens, CSS variables, and JavaScript API.
category: api-reference
order: 1
prev: integrations/swiftui
next: api-reference/css-variables
---

# API Reference

Complete reference documentation for Turbo Themes.

## Quick Links

| Reference                                             | Description                       |
| ----------------------------------------------------- | --------------------------------- |
| [CSS Variables](/docs/api-reference/css-variables/)   | All `--turbo-*` custom properties |
| [Design Tokens](/docs/api-reference/tokens/)          | Token structure and organization  |
| [Theme Definitions](/docs/api-reference/themes/)      | All 9 themes with their values    |
| [JavaScript API](/docs/api-reference/javascript-api/) | Theme switching functions         |

## Token Overview

Turbo Themes provides semantic design tokens organized into categories:

### Background Tokens

| Token   | CSS Variable         | Purpose                  |
| ------- | -------------------- | ------------------------ |
| Base    | `--turbo-bg-base`    | Main page background     |
| Surface | `--turbo-bg-surface` | Cards, elevated surfaces |
| Overlay | `--turbo-bg-overlay` | Modals, dropdowns        |

### Text Tokens

| Token     | CSS Variable             | Purpose                     |
| --------- | ------------------------ | --------------------------- |
| Primary   | `--turbo-text-primary`   | Main body text              |
| Secondary | `--turbo-text-secondary` | Muted text                  |
| Inverse   | `--turbo-text-inverse`   | Text on colored backgrounds |

### Brand Tokens

| Token   | CSS Variable            | Purpose              |
| ------- | ----------------------- | -------------------- |
| Primary | `--turbo-brand-primary` | Primary accent, CTAs |

### State Tokens

| Token   | CSS Variable            | Purpose          |
| ------- | ----------------------- | ---------------- |
| Success | `--turbo-state-success` | Success messages |
| Warning | `--turbo-state-warning` | Warning messages |
| Danger  | `--turbo-state-danger`  | Error messages   |
| Info    | `--turbo-state-info`    | Info messages    |

### Border Tokens

| Token   | CSS Variable             | Purpose          |
| ------- | ------------------------ | ---------------- |
| Default | `--turbo-border-default` | Standard borders |

### Syntax Tokens

For code syntax highlighting:

| Token    | CSS Variable              | Purpose           |
| -------- | ------------------------- | ----------------- |
| Comment  | `--turbo-syntax-comment`  | Code comments     |
| Keyword  | `--turbo-syntax-keyword`  | Language keywords |
| String   | `--turbo-syntax-string`   | String literals   |
| Number   | `--turbo-syntax-number`   | Numeric values    |
| Function | `--turbo-syntax-function` | Function names    |
| Type     | `--turbo-syntax-type`     | Type annotations  |

## Package Exports

### CSS Files

```
turbo-themes/
├── css/
│   ├── turbo-core.css        # Token definitions
│   ├── turbo-base.css        # Base styles
│   ├── turbo-syntax.css      # Syntax highlighting
│   ├── themes/turbo/         # Theme files
│   │   ├── catppuccin-mocha.css
│   │   ├── catppuccin-latte.css
│   │   └── ...
│   └── adapters/
│       └── bulma.css         # Bulma adapter
```

### JavaScript/TypeScript

```typescript
import { themeIds, type ThemeId } from 'turbo-themes';

// Array of all theme IDs
themeIds: string[]

// Theme ID type
type ThemeId = 'catppuccin-mocha' | 'catppuccin-latte' | ...
```

## Next Steps

- View the complete [CSS Variables Reference](/docs/api-reference/css-variables/)
- Explore [Theme Definitions](/docs/api-reference/themes/)
- Learn about the [JavaScript API](/docs/api-reference/javascript-api/)
