---
title: Custom Themes
description: Create your own color schemes that work with Turbo Themes.
category: guides
order: 3
prev: guides/theme-switching
next: guides/advanced-theming
---

# Custom Themes

Learn how to create your own custom themes that integrate with the Turbo Themes system.

## Quick Customization

### Override Specific Tokens

The easiest way to customize is to override specific tokens after loading a base theme:

```html
<!-- Load base theme first -->
<link rel="stylesheet" href="/css/themes/turbo/catppuccin-mocha.css" />

<!-- Then your overrides -->
<style>
  :root {
    --turbo-brand-primary: #ff6b6b;
    --turbo-state-success: #51cf66;
  }
</style>
```

### Create a Custom CSS File

For reusable customizations, create a separate file:

```css
/* my-theme-overrides.css */
:root {
  /* Custom brand colors */
  --turbo-brand-primary: #ff6b6b;

  /* Custom fonts */
  --turbo-font-sans: 'Poppins', system-ui, sans-serif;
  --turbo-font-mono: 'Fira Code', monospace;
}
```

```html
<link rel="stylesheet" href="/css/themes/turbo/catppuccin-mocha.css" />
<link rel="stylesheet" href="/css/my-theme-overrides.css" />
```

## Creating a Full Custom Theme

### Step 1: Choose Your Palette

Start by defining your color palette. You need:

- 3 background shades (base, surface, overlay)
- 3 text colors (primary, secondary, inverse)
- 1 brand/accent color
- 4 state colors (success, warning, danger, info)
- 1 border color

### Step 2: Create the Theme File

```css
/* my-custom-theme.css */
:root {
  /* ======= BACKGROUNDS ======= */
  --turbo-bg-base: #0f0f0f;
  --turbo-bg-surface: #1a1a1a;
  --turbo-bg-overlay: #262626;

  /* ======= TEXT ======= */
  --turbo-text-primary: #e0e0e0;
  --turbo-text-secondary: #a0a0a0;
  --turbo-text-inverse: #0f0f0f;

  /* ======= BRAND ======= */
  --turbo-brand-primary: #6366f1;

  /* ======= STATE ======= */
  --turbo-state-success: #22c55e;
  --turbo-state-warning: #f59e0b;
  --turbo-state-danger: #ef4444;
  --turbo-state-info: #3b82f6;

  /* ======= BORDER ======= */
  --turbo-border-default: #333333;

  /* ======= SYNTAX HIGHLIGHTING ======= */
  --turbo-syntax-comment: #6b7280;
  --turbo-syntax-keyword: #c084fc;
  --turbo-syntax-string: #34d399;
  --turbo-syntax-number: #fb923c;
  --turbo-syntax-function: #60a5fa;
  --turbo-syntax-type: #fbbf24;
  --turbo-syntax-variable: #e0e0e0;
  --turbo-syntax-operator: #22d3ee;

  /* ======= ACCENTS ======= */
  --turbo-accent-link: #6366f1;
  --turbo-accent-link-hover: #818cf8;
}
```

### Step 3: Use Your Theme

```html
<link rel="stylesheet" href="/css/turbo-core.css" />
<link rel="stylesheet" href="/css/turbo-base.css" />
<link rel="stylesheet" href="/css/my-custom-theme.css" />
```

## Theme Design Guidelines

### Contrast Ratios

Ensure sufficient contrast for accessibility:

- Text on backgrounds: minimum 4.5:1 ratio
- Large text: minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio

Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
to verify.

### Background Hierarchy

Create clear visual hierarchy:

```css
:root {
  --turbo-bg-base: #1a1a2e; /* Darkest - page background */
  --turbo-bg-surface: #25253a; /* Middle - cards, panels */
  --turbo-bg-overlay: #32324a; /* Lightest - dropdowns, tooltips */
}
```

### State Color Semantics

Choose colors that match their semantic meaning:

- **Success**: Green tones convey positive outcomes
- **Warning**: Yellow/orange conveys caution
- **Danger**: Red conveys errors or destructive actions
- **Info**: Blue conveys neutral information

## Light Theme Example

```css
/* my-light-theme.css */
:root {
  /* Backgrounds (light to dark) */
  --turbo-bg-base: #ffffff;
  --turbo-bg-surface: #f8f9fa;
  --turbo-bg-overlay: #e9ecef;

  /* Text (dark on light) */
  --turbo-text-primary: #212529;
  --turbo-text-secondary: #6c757d;
  --turbo-text-inverse: #ffffff;

  /* Brand */
  --turbo-brand-primary: #0d6efd;

  /* State */
  --turbo-state-success: #198754;
  --turbo-state-warning: #ffc107;
  --turbo-state-danger: #dc3545;
  --turbo-state-info: #0dcaf0;

  /* Border */
  --turbo-border-default: #dee2e6;

  /* Syntax (darker colors for light backgrounds) */
  --turbo-syntax-comment: #6c757d;
  --turbo-syntax-keyword: #7c3aed;
  --turbo-syntax-string: #059669;
  --turbo-syntax-number: #ea580c;
  --turbo-syntax-function: #2563eb;
  --turbo-syntax-type: #ca8a04;
}
```

## Adding to Theme Switcher

Include your custom theme in the theme selector:

```javascript
const themes = [
  // Built-in themes
  { id: 'catppuccin-mocha', name: 'Catppuccin Mocha', family: 'catppuccin' },
  { id: 'dracula', name: 'Dracula', family: 'dracula' },
  // Your custom theme
  { id: 'my-custom', name: 'My Custom Theme', family: 'custom' },
];

function setTheme(themeId) {
  const isCustom = themeId === 'my-custom';
  const basePath = isCustom ? '/css/' : '/css/themes/turbo/';
  const fileName = isCustom ? 'my-custom-theme.css' : `${themeId}.css`;

  document.getElementById('theme-css').href = basePath + fileName;
  localStorage.setItem('turbo-theme', themeId);
}
```

## Exporting Your Theme

To share your theme, provide the CSS file and documentation:

```css
/**
 * My Custom Theme for Turbo Themes
 *
 * A custom dark theme with purple accents.
 *
 * Usage:
 *   <link rel="stylesheet" href="/css/turbo-core.css" />
 *   <link rel="stylesheet" href="/css/my-custom-theme.css" />
 *
 * Author: Your Name
 * License: MIT
 */
:root {
  /* ... token definitions ... */
}
```

## Testing Your Theme

1. **Check all token categories**: Ensure no tokens are missing
2. **Test contrast ratios**: Verify accessibility
3. **Test all components**: Buttons, cards, forms, alerts
4. **Test syntax highlighting**: Code blocks with various languages
5. **Test with framework adapters**: If using Bulma or Tailwind

## Next Steps

- Learn about [accessibility](/docs/guides/accessibility/)
- Check the [CSS Variables Reference](/docs/api-reference/css-variables/)
- Explore [theme definitions](/docs/api-reference/themes/) for inspiration
