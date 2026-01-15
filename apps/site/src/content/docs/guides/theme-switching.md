---
title: Theme Switching
description: Implement dynamic theme switching with localStorage persistence.
category: guides
order: 2
prev: guides/index
next: guides/custom-themes
---

# Theme Switching

Learn how to implement theme switching that persists across page loads.

## Basic Implementation

### 1. Set Up HTML

Give your theme CSS link an ID:

```html
<head>
  <!-- Core styles -->
  <link rel="stylesheet" href="/css/turbo-core.css" />
  <link rel="stylesheet" href="/css/turbo-base.css" />

  <!-- Theme (with ID for JavaScript access) -->
  <link id="theme-css" rel="stylesheet" href="/css/themes/turbo/catppuccin-mocha.css" />
</head>
```

### 2. Create Theme Switcher

Add a simple function to change themes:

```javascript
function setTheme(themeName) {
  // Update CSS link
  const themeLink = document.getElementById('theme-css');
  themeLink.href = `/css/themes/turbo/${themeName}.css`;

  // Save to localStorage
  localStorage.setItem('turbo-theme', themeName);

  // Update data attribute (useful for CSS selectors)
  document.documentElement.setAttribute('data-theme', themeName);
}
```

### 3. Load Saved Theme

Apply the saved theme on page load:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('turbo-theme') || 'catppuccin-mocha';
  setTheme(savedTheme);
});
```

## Preventing FOUC

Flash of Unstyled Content (FOUC) happens when the page renders with the wrong theme
before JavaScript runs. Prevent it with a blocking script:

```html
<head>
  <!-- Theme CSS -->
  <link id="theme-css" rel="stylesheet" href="/css/themes/turbo/catppuccin-mocha.css" />

  <!-- Blocking script (runs before page renders) -->
  <script>
    (function () {
      var theme = localStorage.getItem('turbo-theme') || 'catppuccin-mocha';
      var validThemes = [
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

      // Validate theme
      if (validThemes.indexOf(theme) === -1) {
        theme = 'catppuccin-mocha';
      }

      // Apply immediately
      document.documentElement.setAttribute('data-theme', theme);
      var link = document.getElementById('theme-css');
      if (link) {
        link.href = '/css/themes/turbo/' + theme + '.css';
      }
    })();
  </script>
</head>
```

## Theme Selector UI

### Dropdown Selector

```html
<div class="theme-selector">
  <label for="theme-select">Theme:</label>
  <select id="theme-select" onchange="setTheme(this.value)">
    <optgroup label="Catppuccin">
      <option value="catppuccin-mocha">Mocha</option>
      <option value="catppuccin-macchiato">Macchiato</option>
      <option value="catppuccin-frappe">Frappé</option>
      <option value="catppuccin-latte">Latte</option>
    </optgroup>
    <optgroup label="Other">
      <option value="dracula">Dracula</option>
      <option value="github-dark">GitHub Dark</option>
      <option value="github-light">GitHub Light</option>
      <option value="bulma-dark">Bulma Dark</option>
      <option value="bulma-light">Bulma Light</option>
    </optgroup>
  </select>
</div>

<script>
  // Set initial value
  document.addEventListener('DOMContentLoaded', function () {
    var saved = localStorage.getItem('turbo-theme') || 'catppuccin-mocha';
    document.getElementById('theme-select').value = saved;
  });
</script>
```

### Button Grid

```html
<div class="theme-buttons">
  <button onclick="setTheme('catppuccin-mocha')" data-theme="catppuccin-mocha">
    Mocha
  </button>
  <button onclick="setTheme('catppuccin-latte')" data-theme="catppuccin-latte">
    Latte
  </button>
  <button onclick="setTheme('dracula')" data-theme="dracula">Dracula</button>
  <!-- ... more buttons ... -->
</div>

<style>
  .theme-buttons button {
    padding: 0.5rem 1rem;
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    background: var(--turbo-bg-surface);
    color: var(--turbo-text-primary);
  }

  .theme-buttons button[data-theme='catppuccin-mocha'] {
    border-color: #89b4fa;
  }

  .theme-buttons button.active {
    border-color: var(--turbo-brand-primary);
  }
</style>
```

### Light/Dark Toggle

For simple light/dark switching:

```html
<button id="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
  <span class="icon-sun">☀️</span>
  <span class="icon-moon">🌙</span>
</button>

<script>
  var darkTheme = 'catppuccin-mocha';
  var lightTheme = 'catppuccin-latte';

  function toggleTheme() {
    var current = localStorage.getItem('turbo-theme') || darkTheme;
    var newTheme = current === darkTheme ? lightTheme : darkTheme;
    setTheme(newTheme);
    updateToggleIcon(newTheme);
  }

  function updateToggleIcon(theme) {
    var toggle = document.getElementById('theme-toggle');
    var isDark = [
      'catppuccin-mocha',
      'catppuccin-macchiato',
      'catppuccin-frappe',
      'dracula',
      'github-dark',
      'bulma-dark',
    ].includes(theme);
    toggle.querySelector('.icon-sun').style.display = isDark ? 'none' : 'inline';
    toggle.querySelector('.icon-moon').style.display = isDark ? 'inline' : 'none';
  }
</script>
```

## System Preference Detection

Respect the user's system preference as a default:

```javascript
function getDefaultTheme() {
  // Check localStorage first
  var saved = localStorage.getItem('turbo-theme');
  if (saved) return saved;

  // Fall back to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'catppuccin-mocha';
  }
  return 'catppuccin-latte';
}

// Listen for system preference changes
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', function (e) {
    // Only apply if user hasn't set a preference
    if (!localStorage.getItem('turbo-theme')) {
      setTheme(e.matches ? 'catppuccin-mocha' : 'catppuccin-latte');
    }
  });
```

## Complete Example

```html
<!DOCTYPE html>
<html lang="en" data-theme="catppuccin-mocha">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Theme Switching Example</title>

    <link rel="stylesheet" href="/css/turbo-core.css" />
    <link rel="stylesheet" href="/css/turbo-base.css" />
    <link
      id="theme-css"
      rel="stylesheet"
      href="/css/themes/turbo/catppuccin-mocha.css"
    />

    <!-- Prevent FOUC -->
    <script>
      (function () {
        var theme = localStorage.getItem('turbo-theme');
        if (!theme && window.matchMedia('(prefers-color-scheme: light)').matches) {
          theme = 'catppuccin-latte';
        }
        theme = theme || 'catppuccin-mocha';
        document.documentElement.setAttribute('data-theme', theme);
        document.getElementById('theme-css').href =
          '/css/themes/turbo/' + theme + '.css';
      })();
    </script>

    <style>
      body {
        background: var(--turbo-bg-base);
        color: var(--turbo-text-primary);
        font-family: system-ui, sans-serif;
        padding: 2rem;
      }

      .theme-select {
        padding: 0.5rem;
        background: var(--turbo-bg-surface);
        color: var(--turbo-text-primary);
        border: 1px solid var(--turbo-border-default);
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <h1>Theme Switching Demo</h1>

    <label for="theme">Choose theme:</label>
    <select id="theme" class="theme-select" onchange="setTheme(this.value)">
      <option value="catppuccin-mocha">Catppuccin Mocha</option>
      <option value="catppuccin-latte">Catppuccin Latte</option>
      <option value="dracula">Dracula</option>
      <option value="github-dark">GitHub Dark</option>
      <option value="github-light">GitHub Light</option>
    </select>

    <script>
      function setTheme(theme) {
        document.getElementById('theme-css').href =
          '/css/themes/turbo/' + theme + '.css';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('turbo-theme', theme);
      }

      // Set initial select value
      var saved = localStorage.getItem('turbo-theme') || 'catppuccin-mocha';
      document.getElementById('theme').value = saved;
    </script>
  </body>
</html>
```

## Next Steps

- Learn to [create custom themes](/docs/guides/custom-themes/)
- Ensure [accessibility](/docs/guides/accessibility/) in your themed UI
- Check the [JavaScript API reference](/docs/api-reference/javascript-api/)
