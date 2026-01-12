---
title: Bootstrap
description: Use Turbo Themes with Bootstrap CSS framework.
category: integrations
order: 4
prev: integrations/bulma
next: integrations/python
---

# Bootstrap Integration

Use Turbo Themes with Bootstrap by mapping tokens to Bootstrap's CSS variables.

## Setup

### 1. Include CSS Files

```html
<!-- Turbo Themes -->
<link rel="stylesheet" href="https://unpkg.com/turbo-themes/css/turbo-core.css" />
<link
  rel="stylesheet"
  href="https://unpkg.com/turbo-themes/css/themes/turbo/catppuccin-mocha.css"
/>

<!-- Bootstrap -->
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>

<!-- Custom adapter (add after Bootstrap) -->
<style>
  :root {
    /* Map Turbo tokens to Bootstrap variables */
    --bs-body-bg: var(--turbo-bg-base);
    --bs-body-color: var(--turbo-text-primary);
    --bs-primary: var(--turbo-brand-primary);
    --bs-secondary: var(--turbo-text-secondary);
    --bs-success: var(--turbo-state-success);
    --bs-warning: var(--turbo-state-warning);
    --bs-danger: var(--turbo-state-danger);
    --bs-info: var(--turbo-state-info);
    --bs-border-color: var(--turbo-border-default);

    /* Card styles */
    --bs-card-bg: var(--turbo-bg-surface);
    --bs-card-border-color: var(--turbo-border-default);
    --bs-card-cap-bg: var(--turbo-bg-overlay);

    /* Form styles */
    --bs-form-control-bg: var(--turbo-bg-surface);
    --bs-form-control-border-color: var(--turbo-border-default);

    /* Link color */
    --bs-link-color: var(--turbo-brand-primary);
  }
</style>
```

## Create a Custom Adapter File

For cleaner code, create a separate CSS file:

```css
/* turbo-bootstrap-adapter.css */
:root {
  /* Body */
  --bs-body-bg: var(--turbo-bg-base);
  --bs-body-color: var(--turbo-text-primary);

  /* Theme colors */
  --bs-primary: var(--turbo-brand-primary);
  --bs-primary-rgb: var(--turbo-brand-primary);
  --bs-secondary: var(--turbo-text-secondary);
  --bs-success: var(--turbo-state-success);
  --bs-warning: var(--turbo-state-warning);
  --bs-danger: var(--turbo-state-danger);
  --bs-info: var(--turbo-state-info);

  /* Borders */
  --bs-border-color: var(--turbo-border-default);

  /* Cards */
  --bs-card-bg: var(--turbo-bg-surface);
  --bs-card-border-color: var(--turbo-border-default);
  --bs-card-cap-bg: var(--turbo-bg-overlay);

  /* Forms */
  --bs-form-control-bg: var(--turbo-bg-surface);
  --bs-form-control-border-color: var(--turbo-border-default);

  /* Modals */
  --bs-modal-bg: var(--turbo-bg-surface);
  --bs-modal-border-color: var(--turbo-border-default);

  /* Dropdowns */
  --bs-dropdown-bg: var(--turbo-bg-surface);
  --bs-dropdown-border-color: var(--turbo-border-default);
  --bs-dropdown-link-color: var(--turbo-text-primary);
  --bs-dropdown-link-hover-bg: var(--turbo-bg-overlay);

  /* Tables */
  --bs-table-bg: transparent;
  --bs-table-border-color: var(--turbo-border-default);

  /* Links */
  --bs-link-color: var(--turbo-brand-primary);
  --bs-link-hover-color: var(--turbo-brand-primary);
}

/* Additional overrides for dark themes */
.btn-primary {
  --bs-btn-bg: var(--turbo-brand-primary);
  --bs-btn-border-color: var(--turbo-brand-primary);
  --bs-btn-color: var(--turbo-text-inverse);
}

.btn-success {
  --bs-btn-bg: var(--turbo-state-success);
  --bs-btn-border-color: var(--turbo-state-success);
  --bs-btn-color: var(--turbo-text-inverse);
}

.btn-danger {
  --bs-btn-bg: var(--turbo-state-danger);
  --bs-btn-border-color: var(--turbo-state-danger);
  --bs-btn-color: var(--turbo-text-inverse);
}

.btn-warning {
  --bs-btn-bg: var(--turbo-state-warning);
  --bs-btn-border-color: var(--turbo-state-warning);
  --bs-btn-color: var(--turbo-text-inverse);
}

.btn-info {
  --bs-btn-bg: var(--turbo-state-info);
  --bs-btn-border-color: var(--turbo-state-info);
  --bs-btn-color: var(--turbo-text-inverse);
}
```

## Usage Examples

Use standard Bootstrap classes:

### Buttons

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-info">Info</button>
```

### Cards

```html
<div class="card">
  <div class="card-header">Featured</div>
  <div class="card-body">
    <h5 class="card-title">Card Title</h5>
    <p class="card-text">Some example text.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
```

### Alerts

```html
<div class="alert alert-primary">Primary alert</div>
<div class="alert alert-success">Success alert</div>
<div class="alert alert-danger">Danger alert</div>
```

### Forms

```html
<form>
  <div class="mb-3">
    <label class="form-label">Email address</label>
    <input type="email" class="form-control" placeholder="name@example.com" />
  </div>
  <div class="mb-3">
    <label class="form-label">Password</label>
    <input type="password" class="form-control" />
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

## Theme Switching

```javascript
function setTheme(themeName) {
  const link = document.getElementById('theme-css');
  link.href = `/css/themes/turbo/${themeName}.css`;
  localStorage.setItem('turbo-theme', themeName);
}
```

## Using with Bootstrap Sass

If you're using Bootstrap's Sass source:

```scss
// Import Turbo variables first
@import 'turbo-themes/css/turbo-core.css';

// Override Bootstrap variables
$body-bg: var(--turbo-bg-base);
$body-color: var(--turbo-text-primary);
$primary: var(--turbo-brand-primary);
$success: var(--turbo-state-success);
$warning: var(--turbo-state-warning);
$danger: var(--turbo-state-danger);
$info: var(--turbo-state-info);

// Import Bootstrap
@import 'bootstrap/scss/bootstrap';
```

## Limitations

- Bootstrap's Sass compilation happens at build time, so some values can't be CSS
  variables
- For full dynamic theming, use the CSS variable approach shown above
- Some Bootstrap components may need additional CSS overrides

## Next Steps

- Explore [Python integration](/docs/integrations/python/)
- Learn about [theme switching](/docs/guides/theme-switching/)
- Check the [CSS Variables Reference](/docs/api-reference/css-variables/)
