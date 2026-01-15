# Turbo Themes - Vue Example

A Vue 3 + TypeScript example demonstrating theme switching with Turbo Themes.

## Features

- Vue 3 with Composition API
- Custom `useTheme` composable for theme management
- Theme persistence in localStorage
- FOUC (Flash of Unstyled Content) prevention
- CSS custom properties for styling

## Quick Start

```bash
cd examples/vue
bun install
bun run dev
```

Open [http://localhost:4176](http://localhost:4176) in your browser.

## Project Structure

```
vue/
├── src/
│   ├── components/
│   │   ├── Card.vue           # Reusable card component
│   │   └── ThemeSelector.vue  # Theme dropdown selector
│   ├── composables/
│   │   └── useTheme.ts        # Theme management composable
│   ├── App.vue                # Main application
│   └── main.ts                # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Usage

### Using the Theme Composable

```vue
<script setup lang="ts">
import { useTheme } from './composables/useTheme';

const { theme, setTheme, themes } = useTheme();
</script>

<template>
  <select :value="theme" @change="setTheme($event.target.value)">
    <option v-for="t in themes" :key="t.id" :value="t.id">
      {{ t.label }}
    </option>
  </select>
</template>
```

### Using CSS Variables

```css
.my-component {
  background: var(--turbo-bg-surface);
  color: var(--turbo-text-primary);
  border: 1px solid var(--turbo-border-default);
}

.my-button {
  background: var(--turbo-brand-primary);
  color: var(--turbo-text-inverse);
}
```

## Build

```bash
bun run build
```

Output will be in the `dist/` directory.
