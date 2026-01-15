---
title: Tailwind CSS
description: Integrate Turbo Themes with Tailwind CSS using the official preset.
category: integrations
order: 2
prev: integrations/index
next: integrations/bulma
---

# Tailwind CSS Integration

Use Turbo Themes with Tailwind CSS for utility-first theming.

## Installation

### 1. Install Packages

```bash
npm install turbo-themes tailwindcss
# or
bun add turbo-themes tailwindcss
```

### 2. Configure Tailwind

Use the Turbo Themes preset in your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  presets: [require('turbo-themes/adapters/tailwind/preset')],
};
```

### 3. Include Theme CSS

Add the theme CSS to your HTML:

```html
<link rel="stylesheet" href="node_modules/turbo-themes/css/turbo-core.css" />
<link
  rel="stylesheet"
  href="node_modules/turbo-themes/css/themes/turbo/catppuccin-mocha.css"
/>
```

## Available Classes

The preset adds these color utilities:

### Backgrounds

| Class              | Token                |
| ------------------ | -------------------- |
| `bg-turbo-base`    | `--turbo-bg-base`    |
| `bg-turbo-surface` | `--turbo-bg-surface` |
| `bg-turbo-overlay` | `--turbo-bg-overlay` |

### Text

| Class                  | Token                    |
| ---------------------- | ------------------------ |
| `text-turbo-primary`   | `--turbo-text-primary`   |
| `text-turbo-secondary` | `--turbo-text-secondary` |
| `text-turbo-inverse`   | `--turbo-text-inverse`   |

### Brand & State

| Class              | Token                   |
| ------------------ | ----------------------- |
| `bg-turbo-brand`   | `--turbo-brand-primary` |
| `bg-turbo-success` | `--turbo-state-success` |
| `bg-turbo-warning` | `--turbo-state-warning` |
| `bg-turbo-danger`  | `--turbo-state-danger`  |
| `bg-turbo-info`    | `--turbo-state-info`    |

### Borders

| Class                  | Token                    |
| ---------------------- | ------------------------ |
| `border-turbo-default` | `--turbo-border-default` |

## Usage Examples

### Card Component

```html
<div class="bg-turbo-surface border border-turbo-default rounded-lg p-4">
  <h2 class="text-turbo-primary font-semibold">Card Title</h2>
  <p class="text-turbo-secondary">Card description goes here.</p>
</div>
```

### Button

```html
<button class="bg-turbo-brand text-turbo-inverse px-4 py-2 rounded hover:opacity-90">
  Primary Button
</button>
```

### Alert

```html
<div class="bg-turbo-success text-turbo-inverse p-4 rounded">
  Success! Your changes have been saved.
</div>
```

## Theme Switching

Theme switching works automatically. When you change the theme CSS file, Tailwind
utilities update because they reference CSS variables:

```javascript
function setTheme(themeName) {
  const link = document.getElementById('theme-css');
  link.href = `/css/themes/turbo/${themeName}.css`;
}
```

No rebuild required - changes are instant.

## Custom Configuration

### Extending the Preset

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  presets: [require('turbo-themes/adapters/tailwind/preset')],
  theme: {
    extend: {
      // Add your own extensions
      spacing: {
        128: '32rem',
      },
    },
  },
};
```

### Manual Color Configuration

If you prefer not to use the preset, add colors manually:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'turbo-base': 'var(--turbo-bg-base)',
        'turbo-surface': 'var(--turbo-bg-surface)',
        'turbo-overlay': 'var(--turbo-bg-overlay)',
        'turbo-text': 'var(--turbo-text-primary)',
        'turbo-text-secondary': 'var(--turbo-text-secondary)',
        'turbo-text-inverse': 'var(--turbo-text-inverse)',
        'turbo-primary': 'var(--turbo-brand-primary)',
        'turbo-success': 'var(--turbo-state-success)',
        'turbo-warning': 'var(--turbo-state-warning)',
        'turbo-danger': 'var(--turbo-state-danger)',
        'turbo-info': 'var(--turbo-state-info)',
        'turbo-border': 'var(--turbo-border-default)',
      },
    },
  },
};
```

## With Tailwind CDN

For quick prototyping without a build step:

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          'turbo-base': 'var(--turbo-bg-base)',
          'turbo-surface': 'var(--turbo-bg-surface)',
          'turbo-text': 'var(--turbo-text-primary)',
          'turbo-primary': 'var(--turbo-brand-primary)',
          // ... add more as needed
        },
      },
    },
  };
</script>
```

## Next Steps

- Explore [Bulma integration](/docs/integrations/bulma/)
- Check the [CSS Variables Reference](/docs/api-reference/css-variables/)
- Learn about [theme switching](/docs/guides/theme-switching/)
