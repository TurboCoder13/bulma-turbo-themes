---
title: Browser Support
description:
  Browser compatibility guide for Turbo Themes, including supported browsers, known
  limitations, and workarounds for specific environments.
category: guides
order: 7
prev: guides/accessibility
next: api-reference/index
---

## Overview

Turbo Themes is designed to work across all modern browsers. This guide covers supported
browsers, known limitations, and workarounds for specific environments.

## Supported Browsers

Turbo Themes fully supports the following browsers:

| Browser          | Version | Support Level |
| ---------------- | ------- | ------------- |
| Chrome           | 90+     | Full          |
| Firefox          | 90+     | Full          |
| Edge             | 90+     | Full          |
| Safari           | 15+     | Partial       |
| Safari iOS       | 15+     | Partial       |
| Chrome Android   | 90+     | Full          |
| Samsung Internet | 15+     | Full          |

### CSS Custom Properties

All browsers listed above support CSS Custom Properties (CSS Variables), which Turbo
Themes relies on for theming.

## Safari / WebKit Limitations

Safari and WebKit-based browsers have some known limitations with Turbo Themes. These
are primarily related to timing and CSS loading behavior.

### Known Issues

#### CSS Loading Timing

Safari handles stylesheet loading differently than Chromium-based browsers. Theme CSS
files may take slightly longer to apply after being loaded.

**Workaround:** Add a small delay after theme switch operations:

```javascript
async function switchThemeWithDelay(themeName) {
  await applyTheme(themeName);

  // Give Safari extra time to apply styles
  if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
```

#### Theme Persistence on Reload

Safari may occasionally show a brief flash of the default theme before applying the
saved theme preference.

**Workaround:** Use an inline blocking script in your `<head>`:

```html
<head>
  <script>
    // Apply saved theme immediately to prevent FOUC
    (function () {
      try {
        const saved = localStorage.getItem('turbo-theme');
        if (saved) {
          document.documentElement.setAttribute('data-theme', saved);
        }
      } catch (e) {}
    })();
  </script>
</head>
```

#### Network Interception

Safari's handling of network interception differs from other browsers, which may affect
offline theme caching with service workers.

**Workaround:** Pre-cache themes during service worker installation:

```javascript
// sw.js
const THEME_FILES = [
  '/css/themes/catppuccin-mocha.css',
  '/css/themes/catppuccin-latte.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('themes-v1').then((cache) => cache.addAll(THEME_FILES)));
});
```

### Testing Considerations

When running E2E tests with Playwright on WebKit:

- Some tests may require additional wait times for CSS to fully load
- Network interception tests may behave differently
- Accessibility testing with axe-core may have timing issues

If you're using Playwright for testing, consider:

```typescript
// Increase timeouts for WebKit
test.setTimeout(browserName === 'webkit' ? 60000 : 30000);

// Add explicit waits for stylesheet loading
await page.waitForLoadState('networkidle');
```

## Mobile Browser Considerations

### iOS Safari

- CSS Custom Properties are fully supported
- Same timing considerations as desktop Safari apply
- Touch events work correctly with theme selectors

### Android Chrome

- Full support for all Turbo Themes features
- Consistent behavior with desktop Chrome

## Private Browsing Mode

In private/incognito browsing mode, `localStorage` may not be available. Turbo Themes
handles this gracefully:

```javascript
// Theme preference won't persist in private mode
// but theming still works within the session
try {
  localStorage.setItem('turbo-theme', theme);
} catch {
  // Silent failure in private browsing
  console.info('Theme preference cannot be saved in private browsing mode');
}
```

## Feature Detection

Check for required features before using Turbo Themes:

```javascript
function checkBrowserSupport() {
  const features = {
    cssVariables: window.CSS && CSS.supports('color', 'var(--test)'),
    localStorage: (function () {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    })(),
    mutationObserver: 'MutationObserver' in window,
  };

  return {
    supported: features.cssVariables,
    canPersist: features.localStorage,
    canObserve: features.mutationObserver,
  };
}

const support = checkBrowserSupport();
if (!support.supported) {
  console.warn('Browser does not support CSS Custom Properties');
}
```

## Polyfills

CSS Custom Properties cannot be polyfilled effectively. If you need to support browsers
that don't support CSS Variables:

1. Provide a fallback static stylesheet
2. Use server-side theme detection
3. Consider a JavaScript-based styling solution

```html
<!-- Fallback for very old browsers -->
<noscript>
  <link rel="stylesheet" href="/css/fallback-theme.css" />
</noscript>
```

## Performance by Browser

| Browser | Theme Switch Time | CSS Parse Time | Notes             |
| ------- | ----------------- | -------------- | ----------------- |
| Chrome  | ~10ms             | ~5ms           | Fastest overall   |
| Firefox | ~15ms             | ~8ms           | Consistent        |
| Safari  | ~25ms             | ~12ms          | Slightly slower   |
| Edge    | ~12ms             | ~6ms           | Similar to Chrome |

These are approximate values for a typical theme file (~2KB). Actual performance varies
based on device and complexity.

## Reporting Issues

If you encounter browser-specific issues:

1. Check the [GitHub Issues](https://github.com/TurboCoder13/turbo-themes/issues) for
   known problems
2. Include browser name and version in bug reports
3. Provide a minimal reproduction if possible

## Next Steps

- Review the [Performance Guide](/docs/guides/performance/) for optimization tips
- Check the [Accessibility Guide](/docs/guides/accessibility/) for a11y best practices
- Explore [Theme Switching](/docs/guides/theme-switching/) patterns
