---
title: Design Tokens
description: Understanding the Turbo Themes token structure and organization.
category: api-reference
order: 3
prev: api-reference/css-variables
next: api-reference/themes
---

# Design Tokens

Turbo Themes uses a structured design token system that provides consistency across all
themes and platforms.

## Token Structure

Tokens are organized in a hierarchical structure:

```json
{
  "meta": {
    "themeIds": ["catppuccin-mocha", "dracula", ...],
    "vendors": ["catppuccin", "dracula", "github", "bulma"],
    "totalThemes": 9,
    "lightThemes": 3,
    "darkThemes": 6
  },
  "themes": {
    "catppuccin-mocha": {
      "id": "catppuccin-mocha",
      "label": "Catppuccin Mocha",
      "vendor": "catppuccin",
      "appearance": "dark",
      "tokens": {
        "background": { ... },
        "text": { ... },
        "brand": { ... },
        "state": { ... },
        "border": { ... },
        "syntax": { ... }
      }
    }
  }
}
```

## Token Categories

### Background Tokens

```json
{
  "background": {
    "base": "#1e1e2e",
    "surface": "#313244",
    "overlay": "#45475a"
  }
}
```

| Token     | Purpose              | Usage                         |
| --------- | -------------------- | ----------------------------- |
| `base`    | Main page background | `body`, `html`                |
| `surface` | Elevated surfaces    | Cards, modals, panels         |
| `overlay` | Floating elements    | Dropdowns, tooltips, popovers |

### Text Tokens

```json
{
  "text": {
    "primary": "#cdd6f4",
    "secondary": "#a6adc8",
    "inverse": "#1e1e2e"
  }
}
```

| Token       | Purpose                     | Usage                            |
| ----------- | --------------------------- | -------------------------------- |
| `primary`   | Main content text           | Body text, headings              |
| `secondary` | De-emphasized text          | Captions, metadata, placeholders |
| `inverse`   | Text on colored backgrounds | Button text, badges              |

### Brand Tokens

```json
{
  "brand": {
    "primary": "#89b4fa"
  }
}
```

| Token     | Purpose              | Usage                   |
| --------- | -------------------- | ----------------------- |
| `primary` | Primary accent color | CTAs, links, highlights |

### State Tokens

```json
{
  "state": {
    "success": "#a6e3a1",
    "warning": "#f9e2af",
    "danger": "#f38ba8",
    "info": "#89dceb"
  }
}
```

| Token     | Purpose             | Usage                         |
| --------- | ------------------- | ----------------------------- |
| `success` | Positive feedback   | Success alerts, confirmations |
| `warning` | Cautionary feedback | Warnings, pending states      |
| `danger`  | Negative feedback   | Errors, destructive actions   |
| `info`    | Neutral information | Tips, hints, info alerts      |

### Border Tokens

```json
{
  "border": {
    "default": "#45475a"
  }
}
```

| Token     | Purpose         | Usage                   |
| --------- | --------------- | ----------------------- |
| `default` | Standard border | Inputs, cards, dividers |

### Syntax Tokens

```json
{
  "syntax": {
    "comment": "#6c7086",
    "keyword": "#cba6f7",
    "string": "#a6e3a1",
    "number": "#fab387",
    "function": "#89b4fa",
    "type": "#f9e2af",
    "variable": "#cdd6f4",
    "operator": "#89dceb"
  }
}
```

## Theme Metadata

Each theme includes metadata:

```json
{
  "id": "catppuccin-mocha",
  "label": "Catppuccin Mocha",
  "vendor": "catppuccin",
  "appearance": "dark"
}
```

| Field        | Description                                       |
| ------------ | ------------------------------------------------- |
| `id`         | Unique identifier (used in filenames, storage)    |
| `label`      | Human-readable display name                       |
| `vendor`     | Theme family (catppuccin, dracula, github, bulma) |
| `appearance` | Light or dark mode indicator                      |

## Using Tokens Programmatically

### JavaScript/TypeScript

```typescript
import tokens from 'turbo-themes/tokens.json';

// Access theme data
const mocha = tokens.themes['catppuccin-mocha'];
console.log(mocha.tokens.background.base); // "#1e1e2e"

// List all themes
const themeIds = tokens.meta.themeIds;

// Filter dark themes
const darkThemes = Object.values(tokens.themes).filter((t) => t.appearance === 'dark');
```

### Python

```python
from turbo_themes import ThemeManager

mgr = ThemeManager(theme_id='catppuccin-mocha')
tokens = mgr.tokens

print(tokens['background']['base'])  # "#1e1e2e"
```

### Swift

```swift
import TurboThemes

let manager = ThemeManager(themeId: .catppuccinMocha)
let bgBase = manager.bgBase  // Color value
```

## Token Naming Convention

Tokens follow a consistent naming pattern:

```
--turbo-{category}-{token}
```

Examples:

- `--turbo-bg-base` → Background, base
- `--turbo-text-primary` → Text, primary
- `--turbo-state-success` → State, success
- `--turbo-syntax-keyword` → Syntax, keyword

## Extending Tokens

To add custom tokens that follow the same pattern:

```css
:root {
  /* Custom tokens following Turbo naming */
  --turbo-bg-highlight: rgba(137, 180, 250, 0.1);
  --turbo-text-accent: var(--turbo-brand-primary);

  /* Custom spacing tokens */
  --turbo-space-xs: 0.25rem;
  --turbo-space-sm: 0.5rem;
  --turbo-space-md: 1rem;
  --turbo-space-lg: 2rem;
}
```

## Next Steps

- View all [Theme Definitions](/docs/api-reference/themes/)
- Check the [CSS Variables Reference](/docs/api-reference/css-variables/)
- Learn about [creating custom themes](/docs/guides/custom-themes/)
