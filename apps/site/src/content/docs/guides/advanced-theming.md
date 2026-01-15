---
title: Advanced Theming
description:
  Master advanced theming techniques including custom token creation, theme composition,
  and dynamic theming patterns.
category: guides
order: 4
prev: guides/custom-themes
next: guides/accessibility
---

## Overview

This guide covers advanced theming techniques for power users who want to extend Turbo
Themes beyond the built-in configurations. You'll learn how to create custom tokens,
compose themes, implement dynamic theming, and optimize for specific use cases.

## Custom Token Creation

### Understanding the Token Structure

Turbo Themes tokens follow a hierarchical structure:

```
Category → Semantic Purpose → State/Variant
```

For example:

- `turbo-text-primary` - Text category, primary semantic purpose
- `turbo-bg-surface-hover` - Background category, surface purpose, hover state

### Creating New Tokens

To create custom tokens that integrate with Turbo Themes:

```css
:root {
  /* Extend the token system with custom tokens */
  --turbo-custom-accent: #ff6b6b;
  --turbo-custom-accent-hover: #ff5252;
  --turbo-custom-gradient-start: var(--turbo-brand-primary);
  --turbo-custom-gradient-end: var(--turbo-brand-secondary);
}

/* Theme-aware custom tokens */
[data-theme='catppuccin-mocha'] {
  --turbo-custom-accent: #f5c2e7;
  --turbo-custom-accent-hover: #f5a2d7;
}

[data-theme='dracula'] {
  --turbo-custom-accent: #ff79c6;
  --turbo-custom-accent-hover: #ff92d0;
}
```

### Token Aliasing

Create semantic aliases for existing tokens:

```css
:root {
  /* Semantic aliases for specific use cases */
  --card-bg: var(--turbo-bg-surface);
  --card-border: var(--turbo-border-default);
  --card-shadow: var(--turbo-shadow-md);

  /* Component-specific tokens */
  --sidebar-width: 280px;
  --sidebar-bg: var(--turbo-bg-overlay);
  --sidebar-border: var(--turbo-border-subtle);
}
```

## Theme Composition

### Layered Themes

Combine multiple theme layers for complex designs:

```css
/* Base layer - core colors */
.theme-layer-base {
  --layer-bg: var(--turbo-bg-base);
  --layer-text: var(--turbo-text-primary);
}

/* Accent layer - brand customization */
.theme-layer-accent {
  --layer-accent: var(--turbo-brand-primary);
  --layer-accent-text: var(--turbo-text-inverse);
}

/* Surface layer - elevated content */
.theme-layer-surface {
  --layer-bg: var(--turbo-bg-surface);
  --layer-border: var(--turbo-border-default);
}
```

### Theme Inheritance

Create theme variants that inherit from a base:

```javascript
// themes/custom-theme.js
import { createTheme } from 'turbo-themes';

const baseTheme = {
  colors: {
    brand: {
      primary: '#7c3aed',
      secondary: '#a78bfa',
    },
  },
};

export const lightVariant = createTheme({
  ...baseTheme,
  mode: 'light',
  colors: {
    ...baseTheme.colors,
    background: {
      base: '#ffffff',
      surface: '#f8fafc',
    },
  },
});

export const darkVariant = createTheme({
  ...baseTheme,
  mode: 'dark',
  colors: {
    ...baseTheme.colors,
    background: {
      base: '#0f172a',
      surface: '#1e293b',
    },
  },
});
```

## Dynamic Theming

### Runtime Theme Switching

Implement smooth theme transitions:

```javascript
// Enable CSS transitions for theme changes
function enableThemeTransitions() {
  document.documentElement.style.setProperty(
    '--theme-transition',
    'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease'
  );
}

// Apply transition to all themed elements
document.querySelectorAll('*').forEach((el) => {
  el.style.transition = 'var(--theme-transition)';
});
```

### User Preference Detection

Respect system preferences while allowing overrides:

```javascript
class ThemeManager {
  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.userPreference = localStorage.getItem('turbo-theme');
  }

  getEffectiveTheme() {
    // User preference takes priority
    if (this.userPreference) {
      return this.userPreference;
    }

    // Fall back to system preference
    return this.mediaQuery.matches ? 'catppuccin-mocha' : 'catppuccin-latte';
  }

  watchSystemPreference(callback) {
    this.mediaQuery.addEventListener('change', (e) => {
      if (!this.userPreference) {
        callback(e.matches ? 'catppuccin-mocha' : 'catppuccin-latte');
      }
    });
  }
}
```

### Theme Scheduling

Implement time-based theme switching:

```javascript
function scheduleTheme() {
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 18;

  const theme = isDaytime ? 'github-light' : 'github-dark';
  document.documentElement.setAttribute('data-theme', theme);
}

// Check every hour
setInterval(scheduleTheme, 3600000);
scheduleTheme();
```

## Advanced CSS Techniques

### Container Queries with Themes

Use container queries for responsive themed components:

```css
.card-container {
  container-type: inline-size;
}

.card {
  background: var(--turbo-bg-surface);
  padding: 1rem;
}

@container (min-width: 400px) {
  .card {
    padding: 1.5rem;
    background: var(--turbo-bg-overlay);
  }
}
```

### CSS Layers for Theme Overrides

Use CSS layers to manage specificity:

```css
@layer turbo-base, turbo-theme, turbo-overrides;

@layer turbo-base {
  .button {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
  }
}

@layer turbo-theme {
  .button {
    background: var(--turbo-brand-primary);
    color: var(--turbo-text-inverse);
  }
}

@layer turbo-overrides {
  .button.custom {
    background: var(--turbo-custom-accent);
  }
}
```

### Color Manipulation

Create derived colors using CSS functions:

```css
:root {
  /* Lighten/darken using color-mix */
  --turbo-brand-light: color-mix(in srgb, var(--turbo-brand-primary) 70%, white);

  --turbo-brand-dark: color-mix(in srgb, var(--turbo-brand-primary) 70%, black);

  /* Semi-transparent variants */
  --turbo-brand-alpha-50: color-mix(
    in srgb,
    var(--turbo-brand-primary) 50%,
    transparent
  );
}
```

## Theme Testing

### Visual Regression Testing

Set up visual tests for theme consistency:

```javascript
// playwright.config.js
export default {
  projects: [
    {
      name: 'catppuccin-mocha',
      use: {
        colorScheme: 'dark',
        storageState: { theme: 'catppuccin-mocha' },
      },
    },
    {
      name: 'github-light',
      use: {
        colorScheme: 'light',
        storageState: { theme: 'github-light' },
      },
    },
  ],
};
```

### Contrast Validation

Programmatically validate color contrast:

```javascript
function validateContrast(foreground, background, minRatio = 4.5) {
  const getLuminance = (color) => {
    const rgb = parseColor(color);
    const [r, g, b] = rgb.map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return ratio >= minRatio;
}
```

## Best Practices

### Token Naming Conventions

Follow these conventions for maintainability:

1. **Use semantic names** - `--turbo-text-error` not `--turbo-red-500`
2. **Include state suffixes** - `hover`, `active`, `disabled`, `focus`
3. **Group by purpose** - All background tokens start with `bg-`
4. **Document relationships** - Comment which tokens work together

### Performance Considerations

- Minimize CSS custom property lookups in animations
- Use `will-change` sparingly for themed transitions
- Preload theme stylesheets for faster switching
- Consider using CSS containment for themed sections

### Accessibility Reminders

- Always test with high contrast mode
- Ensure focus indicators are visible in all themes
- Maintain minimum 4.5:1 contrast for body text
- Test with color blindness simulators

## Next Steps

- Review the [Accessibility Guide](/docs/guides/accessibility/) for WCAG compliance
- Explore the [CSS Variables Reference](/docs/api-reference/css-variables/) for all
  available tokens
- Check out [Custom Themes](/docs/guides/custom-themes/) for creating your own themes
