# Turbo Themes - React Example

A React + TypeScript example demonstrating theme switching with Turbo Themes.

## Features

- React 18 with TypeScript
- Custom `useTheme` hook for theme management
- Theme persistence in localStorage
- FOUC (Flash of Unstyled Content) prevention
- CSS custom properties for styling

## Quick Start

```bash
cd examples/react
bun install
bun run dev
```

Open [http://localhost:4175](http://localhost:4175) in your browser.

## Project Structure

```
react/
├── src/
│   ├── components/
│   │   ├── Card.tsx          # Reusable card component
│   │   └── ThemeSelector.tsx # Theme dropdown selector
│   ├── hooks/
│   │   └── useTheme.ts       # Theme management hook
│   ├── App.tsx               # Main application
│   ├── App.css               # Application styles
│   └── main.tsx              # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Usage

### Using the Theme Hook

```tsx
import { useTheme } from './hooks/useTheme';

function MyComponent() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      {themes.map((t) => (
        <option key={t.id} value={t.id}>
          {t.label}
        </option>
      ))}
    </select>
  );
}
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
