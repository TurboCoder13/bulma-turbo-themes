# @lgtm-hq/turbo-theme-selector

Theme selector UI component for Turbo Themes.

## Overview

This package provides the JavaScript/TypeScript implementation of the theme selector
component, including dropdown UI, theme application logic, accessibility enhancements,
and navbar integration.

## Installation

This package is included with `@lgtm-hq/turbo-themes`. For internal use only.

## Usage

```typescript
import {
  initTheme,
  wireFlavorSelector,
  initNavbar,
  enhanceAccessibility,
} from '@lgtm-hq/turbo-theme-selector';

// Initialize theme system
await initTheme(document, window);

// Wire up theme selector dropdown
const { cleanup } = wireFlavorSelector(document, window);

// Initialize navbar (if using Bulma navbar)
initNavbar(document);

// Enhance accessibility
enhanceAccessibility(document);
```

## API

- `initTheme(document: Document, window: Window)` - Initialize theme system
- `wireFlavorSelector(document: Document, window: Window)` - Wire up theme selector
  dropdown
- `initNavbar(document: Document)` - Initialize navbar functionality
- `enhanceAccessibility(document: Document)` - Add accessibility enhancements

## Types

- `ThemeMode` - Theme mode type
- `ThemeAppearance` - Light/dark appearance
- `ThemeFamily` - Theme family identifier
