# 0005. CSS-Only Theme Switching to Eliminate FOUC

Date: 2026-02-06

## Status

Accepted

## Context

The current theme-switching mechanism uses dynamic `<link>` swapping with a blocking
inline script. When a user revisits a page with a non-default theme saved in
localStorage, the script swaps the stylesheet `href`, triggering a network request.
Until the new CSS loads, the page renders with the default theme's variables — a visible
Flash of Unstyled Content (FOUC).

[ADR-0004](0004-csp-unsafe-inline-for-theme-blocking-script.md) documented the need for
`'unsafe-inline'` in CSP to support the blocking script. That script currently
manipulates URLs read from localStorage, which is a CSP concern.

### Requirements

- Eliminate FOUC when returning users have a non-default theme
- Maintain support for individual theme CSS files (opt-in granularity)
- Keep the blocking script as minimal as possible
- Reduce CSP surface area where possible

### Alternatives Considered

1. **Status quo (link swapping)**: Works but causes FOUC on cache misses
2. **Combined bundle (`turbo.css`)**: Already exists at ~76KB/8.7KB gzipped, but couples
   `:root` defaults with theme overrides — consumers cannot use it alongside
   `turbo-core.css` without duplicate declarations
3. **JavaScript preload hints**: Reduces but does not eliminate FOUC
4. **Service Worker interception**: Complex, requires registration lifecycle management

### Investigation Findings

- **Size**: ~78 KB raw / ~8 KB gzipped for all 24 themes (just `[data-theme]` selectors)
- **Parse time**: <5ms on modern browsers, well within the 16ms frame budget
- **Caching**: A single cacheable file vs. cache-miss on each theme switch
- **Browser support**: Attribute selectors since IE7; CSS custom properties since 2016
  (Chrome 49, Firefox 31, Safari 9.1)
- **CSP improvement**: The blocking script no longer manipulates URLs from localStorage
  — it only sets a `data-theme` attribute

## Decision

Ship a new additive output file, `turbo-themes-all.css`, containing only `[data-theme]`
selectors for every registered theme. No `:root` block is included.

### Usage

```html
<!-- Load core defaults, base styles, and all theme selectors -->
<link rel="stylesheet" href="turbo-core.css" />
<link rel="stylesheet" href="turbo-base.css" />
<link rel="stylesheet" href="turbo-themes-all.css" />

<!-- Blocking script: validate against whitelist, no URL manipulation -->
<script>
  try {
    var t = localStorage.getItem('turbo-theme');
    var w = document.documentElement.getAttribute('data-theme-whitelist');
    if (t && w && (' ' + w + ' ').indexOf(' ' + t + ' ') > -1)
      document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
</script>
```

Theme switching at runtime only changes the `data-theme` attribute — no stylesheet
swapping, no network requests.

### Key Implementation Details

- New `generateThemesOnlyCss()` function in `packages/css/src/generator.ts`
- Build script writes `dist/turbo-themes-all.css`
- Package export: `"./turbo-themes-all.css": "./dist/turbo-themes-all.css"`
- Bundle size budget: 110KB (allows for theme growth)
- Individual theme files remain available for consumers who prefer granular loading

## Consequences

### Positive

- Users never see FOUC — themes apply instantly on page load
- Single cacheable file eliminates per-theme cache misses
- Blocking script is simpler (no URL construction from localStorage)
- Reduces CSP surface area: script no longer manipulates `href` from user-controlled
  storage
- Additive change — existing individual theme files are unaffected

### Negative

- Slightly larger initial CSS payload (~78 KB raw, ~8 KB gzipped) compared to loading a
  single theme file (~3 KB)
- All themes are parsed even though only one is active (parse cost is <5ms, well within
  frame budget)

### Neutral

- The combined `turbo.css` bundle continues to exist for consumers who want a single
  all-in-one file with `:root` defaults
- Decision should be revisited if theme count grows significantly (50+ themes) and
  gzipped size exceeds ~20KB

## References

- [ADR-0004: CSP 'unsafe-inline' for Theme Blocking Script](0004-csp-unsafe-inline-for-theme-blocking-script.md)
- [FOUC (Flash of Unstyled Content)](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)
- GitHub Issue: #276
- Example: `examples/html-vanilla-css-only/index.html`
