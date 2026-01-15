---
title: Performance Optimization
description:
  Optimize Turbo Themes for production with best practices for loading, caching, and
  runtime performance.
category: guides
order: 5
prev: guides/advanced-theming
next: guides/accessibility
---

## Overview

Turbo Themes is designed with performance in mind, but there are additional
optimizations you can apply for production deployments. This guide covers loading
strategies, caching, bundle optimization, and runtime performance.

## Loading Strategies

### Critical CSS Inlining

Inline critical theme variables to prevent Flash of Unstyled Content (FOUC):

```html
<head>
  <!-- Inline critical theme variables -->
  <style>
    :root {
      --turbo-bg-base: #1e1e2e;
      --turbo-text-primary: #cdd6f4;
      --turbo-brand-primary: #89b4fa;
    }
  </style>

  <!-- Load full theme asynchronously -->
  <link rel="preload" href="/css/themes/catppuccin-mocha.css" as="style" />
  <link rel="stylesheet" href="/css/themes/catppuccin-mocha.css" />
</head>
```

### Preloading Theme Assets

Preload the user's preferred theme:

```javascript
// In your head or early in the document
const savedTheme = localStorage.getItem('turbo-theme') || 'catppuccin-mocha';
const link = document.createElement('link');
link.rel = 'preload';
link.as = 'style';
link.href = `/css/themes/${savedTheme}.css`;
document.head.appendChild(link);
```

### Lazy Loading Secondary Themes

Only load themes when needed:

```javascript
async function loadTheme(themeName) {
  // Check if already loaded
  if (document.querySelector(`link[data-theme="${themeName}"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `/css/themes/${themeName}.css`;
  link.dataset.theme = themeName;

  return new Promise((resolve, reject) => {
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

// Usage
document.querySelector('#theme-selector').addEventListener('change', async (e) => {
  await loadTheme(e.target.value);
  document.documentElement.setAttribute('data-theme', e.target.value);
});
```

## Bundle Optimization

### Tree Shaking

Import only what you need:

```javascript
// Instead of importing everything
// import { themes, tokens, utils } from 'turbo-themes';

// Import specific modules
import { getTheme } from 'turbo-themes/themes';
import { applyTheme } from 'turbo-themes/utils';
```

### CSS Purging

Configure your build tool to remove unused CSS:

```javascript
// postcss.config.js with PurgeCSS
module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
      safelist: [
        /^turbo-/, // Keep all Turbo Themes classes
        /^\[data-theme/, // Keep theme attribute selectors
        /^--turbo-/, // Keep CSS custom properties
      ],
    }),
  ],
};
```

### Minification

Ensure CSS is properly minified:

```javascript
// vite.config.js
export default {
  css: {
    postcss: {
      plugins: [
        require('cssnano')({
          preset: [
            'default',
            {
              // Preserve custom properties
              cssDeclarationSorter: false,
              reduceIdents: false,
            },
          ],
        }),
      ],
    },
  },
};
```

## Caching Strategies

### Browser Caching

Set appropriate cache headers for theme files:

```nginx
# nginx.conf
location /css/themes/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Service Worker Caching

Cache themes for offline access:

```javascript
// sw.js
const THEME_CACHE = 'turbo-themes-v1';
const THEME_FILES = [
  '/css/turbo-core.css',
  '/css/themes/catppuccin-mocha.css',
  '/css/themes/catppuccin-latte.css',
  '/css/themes/dracula.css',
  '/css/themes/github-dark.css',
  '/css/themes/github-light.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(THEME_CACHE).then((cache) => cache.addAll(THEME_FILES)));
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/css/themes/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
```

### Local Storage Optimization

Efficiently store theme preferences:

```javascript
// Store only the theme name, not the entire theme object
const ThemeStorage = {
  key: 'turbo-theme',

  get() {
    try {
      return localStorage.getItem(this.key);
    } catch {
      return null;
    }
  },

  set(theme) {
    try {
      localStorage.setItem(this.key, theme);
    } catch {
      // localStorage might be full or disabled
      console.warn('Could not save theme preference');
    }
  },
};
```

## Runtime Performance

### Avoiding Layout Thrashing

Batch DOM updates when switching themes:

```javascript
function switchTheme(newTheme) {
  // Read phase - gather all measurements first
  const scrollPosition = window.scrollY;

  // Write phase - make all changes together
  requestAnimationFrame(() => {
    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeLink(newTheme);

    // Restore scroll position if layout shifted
    window.scrollTo(0, scrollPosition);
  });
}
```

### Debouncing Theme Changes

Prevent rapid theme switching from impacting performance:

```javascript
let themeTimeout;

function debouncedThemeSwitch(theme) {
  clearTimeout(themeTimeout);
  themeTimeout = setTimeout(() => {
    applyTheme(theme);
  }, 150);
}
```

### CSS Containment

Use CSS containment for themed sections:

```css
.themed-section {
  contain: layout style paint;
}

.theme-preview {
  contain: strict;
}
```

### Reducing Paint Operations

Minimize repaints during theme transitions:

```css
/* Use transform instead of changing colors directly for previews */
.theme-preview-card {
  will-change: transform;
  transition: transform 0.2s ease;
}

.theme-preview-card:hover {
  transform: scale(1.02);
}

/* Only transition necessary properties */
.themed-element {
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  /* Avoid transitioning all properties */
}
```

## Measuring Performance

### Core Web Vitals

Monitor theme impact on Core Web Vitals:

```javascript
// Measure Largest Contentful Paint
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP:', entry.startTime);
  }
}).observe({ entryTypes: ['largest-contentful-paint'] });

// Measure Cumulative Layout Shift during theme switch
let clsScore = 0;
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      clsScore += entry.value;
    }
  }
}).observe({ entryTypes: ['layout-shift'] });
```

### Theme Load Time

Track how long themes take to load:

```javascript
async function measureThemeLoad(themeName) {
  const start = performance.now();

  await loadTheme(themeName);

  const duration = performance.now() - start;
  console.log(`Theme ${themeName} loaded in ${duration.toFixed(2)}ms`);

  // Send to analytics
  analytics.track('theme_load', {
    theme: themeName,
    duration,
  });
}
```

## Production Checklist

Before deploying to production, verify:

- [ ] **CSS is minified** - Check file sizes are optimized
- [ ] **Cache headers configured** - Theme files have long cache times
- [ ] **Critical CSS inlined** - No FOUC on initial load
- [ ] **Unused CSS removed** - PurgeCSS or similar is configured
- [ ] **Service worker caching** - Themes available offline
- [ ] **Theme preloading** - User's preferred theme loads first
- [ ] **Lazy loading** - Secondary themes load on demand
- [ ] **No layout shift** - CLS score is acceptable during theme switch
- [ ] **Performance monitoring** - Core Web Vitals are tracked

## File Size Reference

Turbo Themes is optimized for minimal file size:

| File                | Size (minified) | Size (gzipped) |
| ------------------- | --------------- | -------------- |
| turbo-core.css      | ~2 KB           | ~0.8 KB        |
| Individual theme    | ~2-3 KB         | ~0.7-1 KB      |
| All themes combined | ~25 KB          | ~5 KB          |

## Next Steps

- Review the [Accessibility Guide](/docs/guides/accessibility/) for a11y best practices
- Learn about [Theme Switching](/docs/guides/theme-switching/) patterns
- Explore [Advanced Theming](/docs/guides/advanced-theming/) techniques
