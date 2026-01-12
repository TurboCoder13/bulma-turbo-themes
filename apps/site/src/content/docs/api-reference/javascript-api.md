---
title: JavaScript API
description: JavaScript and TypeScript API reference for Turbo Themes.
category: api-reference
order: 5
prev: api-reference/themes
next: guides/index
---

# JavaScript API

Reference for the Turbo Themes JavaScript and TypeScript exports.

## Installation

```bash
npm install turbo-themes
```

## Exports

### Theme IDs

```typescript
import { themeIds } from 'turbo-themes';

console.log(themeIds);
// [
//   'catppuccin-mocha',
//   'catppuccin-macchiato',
//   'catppuccin-frappe',
//   'catppuccin-latte',
//   'dracula',
//   'github-dark',
//   'github-light',
//   'bulma-dark',
//   'bulma-light'
// ]
```

### ThemeId Type

```typescript
import type { ThemeId } from 'turbo-themes';

// Type is a union of all valid theme IDs
type ThemeId =
  | 'catppuccin-mocha'
  | 'catppuccin-macchiato'
  | 'catppuccin-frappe'
  | 'catppuccin-latte'
  | 'dracula'
  | 'github-dark'
  | 'github-light'
  | 'bulma-dark'
  | 'bulma-light';

// Use for type-safe theme selection
function setTheme(theme: ThemeId) {
  // TypeScript will error if invalid theme passed
}
```

### Token Data

```typescript
import tokens from 'turbo-themes/tokens.json';

// Access metadata
tokens.meta.themeIds; // string[]
tokens.meta.vendors; // string[]
tokens.meta.totalThemes; // number
tokens.meta.lightThemes; // number
tokens.meta.darkThemes; // number

// Access theme data
const mocha = tokens.themes['catppuccin-mocha'];
mocha.id; // 'catppuccin-mocha'
mocha.label; // 'Catppuccin Mocha'
mocha.vendor; // 'catppuccin'
mocha.appearance; // 'dark'
mocha.tokens; // Token values
```

## Theme Switching Implementation

### Basic Implementation

```typescript
import { themeIds, type ThemeId } from 'turbo-themes';

const STORAGE_KEY = 'turbo-theme';
const DEFAULT_THEME: ThemeId = 'catppuccin-mocha';

function getStoredTheme(): ThemeId {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && themeIds.includes(stored as ThemeId)) {
    return stored as ThemeId;
  }
  return DEFAULT_THEME;
}

function setTheme(themeId: ThemeId): void {
  // Update CSS
  const link = document.getElementById('theme-css') as HTMLLinkElement;
  if (link) {
    link.href = `/css/themes/turbo/${themeId}.css`;
  }

  // Update data attribute
  document.documentElement.setAttribute('data-theme', themeId);

  // Persist
  localStorage.setItem(STORAGE_KEY, themeId);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  setTheme(getStoredTheme());
});
```

### With React

```tsx
import { useState, useEffect, createContext, useContext } from 'react';
import { themeIds, type ThemeId } from 'turbo-themes';

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  themes: readonly ThemeId[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('catppuccin-mocha');

  useEffect(() => {
    const stored = localStorage.getItem('turbo-theme') as ThemeId;
    if (stored && themeIds.includes(stored)) {
      setThemeState(stored);
    }
  }, []);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    localStorage.setItem('turbo-theme', newTheme);

    const link = document.getElementById('theme-css') as HTMLLinkElement;
    if (link) {
      link.href = `/css/themes/turbo/${newTheme}.css`;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: themeIds }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### With Vue

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { themeIds, type ThemeId } from 'turbo-themes';

const currentTheme = ref<ThemeId>('catppuccin-mocha');

function setTheme(theme: ThemeId) {
  currentTheme.value = theme;
  localStorage.setItem('turbo-theme', theme);

  const link = document.getElementById('theme-css') as HTMLLinkElement;
  if (link) {
    link.href = `/css/themes/turbo/${theme}.css`;
  }
}

onMounted(() => {
  const stored = localStorage.getItem('turbo-theme') as ThemeId;
  if (stored && themeIds.includes(stored)) {
    currentTheme.value = stored;
  }
});
</script>

<template>
  <select :value="currentTheme" @change="setTheme($event.target.value)">
    <option v-for="theme in themeIds" :key="theme" :value="theme">
      {{ theme }}
    </option>
  </select>
</template>
```

### With Svelte

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { themeIds, type ThemeId } from 'turbo-themes';

  let currentTheme: ThemeId = 'catppuccin-mocha';

  function setTheme(theme: ThemeId) {
    currentTheme = theme;
    localStorage.setItem('turbo-theme', theme);

    const link = document.getElementById('theme-css') as HTMLLinkElement;
    if (link) {
      link.href = `/css/themes/turbo/${theme}.css`;
    }
  }

  onMount(() => {
    const stored = localStorage.getItem('turbo-theme') as ThemeId;
    if (stored && themeIds.includes(stored)) {
      currentTheme = stored;
    }
  });
</script>

<select bind:value={currentTheme} on:change={() => setTheme(currentTheme)}>
  {#each themeIds as theme}
    <option value={theme}>{theme}</option>
  {/each}
</select>
```

## Preventing Flash of Unstyled Content (FOUC)

Add this blocking script in your `<head>`:

```html
<script>
  (function () {
    const STORAGE_KEY = 'turbo-theme';
    const DEFAULT = 'catppuccin-mocha';
    const VALID = [
      'catppuccin-mocha',
      'catppuccin-macchiato',
      'catppuccin-frappe',
      'catppuccin-latte',
      'dracula',
      'github-dark',
      'github-light',
      'bulma-dark',
      'bulma-light',
    ];

    let theme = localStorage.getItem(STORAGE_KEY) || DEFAULT;
    if (!VALID.includes(theme)) theme = DEFAULT;

    document.documentElement.setAttribute('data-theme', theme);

    const link = document.getElementById('theme-css');
    if (link && theme !== DEFAULT) {
      link.href = '/css/themes/turbo/' + theme + '.css';
    }
  })();
</script>
```

## Utility Functions

### Check if Theme is Dark

```typescript
import tokens from 'turbo-themes/tokens.json';
import type { ThemeId } from 'turbo-themes';

function isDarkTheme(themeId: ThemeId): boolean {
  return tokens.themes[themeId].appearance === 'dark';
}
```

### Get Theme by Vendor

```typescript
import tokens from 'turbo-themes/tokens.json';

function getThemesByVendor(vendor: string) {
  return Object.values(tokens.themes).filter((theme) => theme.vendor === vendor);
}

// Get all Catppuccin themes
const catppuccinThemes = getThemesByVendor('catppuccin');
```

### Get Light/Dark Themes

```typescript
import tokens from 'turbo-themes/tokens.json';

const darkThemes = Object.values(tokens.themes)
  .filter((t) => t.appearance === 'dark')
  .map((t) => t.id);

const lightThemes = Object.values(tokens.themes)
  .filter((t) => t.appearance === 'light')
  .map((t) => t.id);
```

## Next Steps

- Explore [theme switching guide](/docs/guides/theme-switching/)
- Learn about [custom themes](/docs/guides/custom-themes/)
- Check [framework integrations](/docs/integrations/)
