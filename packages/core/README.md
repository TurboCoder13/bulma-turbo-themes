# @lgtm-hq/turbo-themes-core

Core design tokens and theme definitions for Turbo Themes.

## Overview

This package contains the canonical source of truth for all design tokens and theme
definitions. It is platform-agnostic and can be used by any platform (web, mobile,
desktop).

## Installation

This package is included with `@lgtm-hq/turbo-themes`. For internal use only.

## Exports

### Main Export

```typescript
import { flavors, getTheme, getTokens } from '@lgtm-hq/turbo-themes-core';
```

### Tokens Export

```typescript
import { flavors, themesById, getTheme } from '@lgtm-hq/turbo-themes-core/tokens';
```

### Themes Export

```typescript
import { flavors } from '@lgtm-hq/turbo-themes-core/themes';
```

## API

- `flavors` - Array of all available theme flavors
- `getTheme(id: string)` - Get a theme by ID
- `getTokens(id: string)` - Get theme tokens by ID
- `getThemesByAppearance(appearance: 'light' | 'dark')` - Get themes by appearance
- `getThemesByVendor(vendor: string)` - Get themes by vendor
- `themeIds` - Array of all theme IDs
- `vendors` - Array of all vendors

## Types

- `ThemeFlavor` - Complete theme definition
- `ThemeTokens` - Design token structure
- `ThemePackage` - Theme package metadata
