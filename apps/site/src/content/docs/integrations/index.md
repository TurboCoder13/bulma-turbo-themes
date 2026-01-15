---
title: Framework Integrations
description: Use Turbo Themes with Tailwind CSS, Bulma, Bootstrap, or as pure CSS.
category: integrations
order: 1
prev: installation/jekyll
next: integrations/tailwind
---

# Framework Integrations

Turbo Themes works with any CSS framework. Choose your integration method based on your
project.

## Available Integrations

| Framework                                    | Integration Type | Complexity |
| -------------------------------------------- | ---------------- | ---------- |
| [Pure CSS](/docs/integrations/bulma/)        | Native tokens    | Simple     |
| [Tailwind CSS](/docs/integrations/tailwind/) | Custom preset    | Easy       |
| [Bulma](/docs/integrations/bulma/)           | CSS adapter      | Easy       |
| [Bootstrap](/docs/integrations/bootstrap/)   | CSS variables    | Moderate   |

## Platform Libraries

| Platform                               | Package        | Installation               |
| -------------------------------------- | -------------- | -------------------------- |
| [Python](/docs/integrations/python/)   | `turbo-themes` | `pip install turbo-themes` |
| [SwiftUI](/docs/integrations/swiftui/) | `TurboThemes`  | Swift Package              |

## How Integrations Work

### Pure CSS (No Framework)

The simplest approach - use CSS custom properties directly:

```css
.card {
  background: var(--turbo-bg-surface);
  color: var(--turbo-text-primary);
  border: 1px solid var(--turbo-border-default);
}
```

### Framework Adapters

Adapters map Turbo Themes tokens to framework-specific variables. For example, the Bulma
adapter sets:

```css
/* Bulma adapter (simplified) */
:root {
  --bulma-background: var(--turbo-bg-base);
  --bulma-text: var(--turbo-text-primary);
  --bulma-primary: var(--turbo-brand-primary);
}
```

This means Bulma components automatically use your theme colors.

### Tailwind Preset

The Tailwind preset extends your color palette:

```javascript
// tailwind.config.js
module.exports = {
  presets: [require('turbo-themes/adapters/tailwind/preset')],
};
```

Now you can use classes like `bg-turbo-surface` and `text-turbo-primary`.

## Choosing an Integration

### Use Pure CSS If

- You're building a simple site
- You want maximum control
- You don't need a UI component library

### Use Bulma If

- You want pre-built components
- You prefer a lightweight framework
- You like semantic class names

### Use Tailwind If

- You prefer utility-first CSS
- You're building custom components
- You want full design flexibility

### Use Bootstrap If

- You have an existing Bootstrap project
- You need Bootstrap's JavaScript components
- You want extensive documentation

## Next Steps

Choose your integration:

- [Tailwind CSS Integration](/docs/integrations/tailwind/)
- [Bulma Integration](/docs/integrations/bulma/)
- [Bootstrap Integration](/docs/integrations/bootstrap/)
- [Python Library](/docs/integrations/python/)
- [SwiftUI Package](/docs/integrations/swiftui/)
