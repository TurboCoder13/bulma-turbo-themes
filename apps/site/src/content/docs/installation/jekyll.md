---
title: Jekyll Gem Installation
description: Install Turbo Themes as a Ruby gem for Jekyll sites.
category: installation
order: 4
prev: installation/cdn
next: integrations/index
---

# Jekyll Gem Installation

Install Turbo Themes as a Ruby gem for seamless integration with Jekyll sites.

## Installation

### 1. Add to Gemfile

```ruby
# Gemfile
gem "turbo-themes"
```

### 2. Install the Gem

```bash
bundle install
```

### 3. Configure Jekyll

Add to your `_config.yml`:

```yaml
# _config.yml
theme: turbo-themes

# Or if using remote_theme:
# remote_theme: lgtm-hq/turbo-themes
```

## Manual Setup

If you prefer to include files manually instead of using the gem as a theme:

### 1. Copy CSS Files

Copy the CSS files from the gem to your Jekyll `assets/css/` directory:

```bash
# Find gem location
bundle show turbo-themes

# Copy files to your project
cp -r $(bundle show turbo-themes)/assets/css/* assets/css/
```

### 2. Include in Layout

In your `_layouts/default.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ page.title }}</title>

    <!-- Turbo Themes -->
    <link rel="stylesheet" href="{{ '/assets/css/turbo-core.css' | relative_url }}" />
    <link rel="stylesheet" href="{{ '/assets/css/turbo-base.css' | relative_url }}" />
    <link
      id="theme-css"
      rel="stylesheet"
      href="{{ '/assets/css/themes/turbo/catppuccin-mocha.css' | relative_url }}"
    />
  </head>
  <body>
    {{ content }}
  </body>
</html>
```

## Theme Switching with Liquid

Create a theme switcher component:

```html
<!-- _includes/theme-switcher.html -->
<div class="theme-switcher">
  <label for="theme-select">Theme:</label>
  <select id="theme-select" onchange="setTheme(this.value)">
    <option value="catppuccin-mocha">Catppuccin Mocha</option>
    <option value="catppuccin-latte">Catppuccin Latte</option>
    <option value="dracula">Dracula</option>
    <option value="github-dark">GitHub Dark</option>
    <option value="github-light">GitHub Light</option>
  </select>
</div>

<script>
  function setTheme(theme) {
    document.getElementById('theme-css').href =
      '{{ "/assets/css/themes/turbo/" | relative_url }}' + theme + '.css';
    localStorage.setItem('turbo-theme', theme);
  }

  // Load saved theme
  document.addEventListener('DOMContentLoaded', function () {
    var saved = localStorage.getItem('turbo-theme');
    if (saved) {
      setTheme(saved);
      document.getElementById('theme-select').value = saved;
    }
  });
</script>
```

Then include it in your layout:

```liquid
{% include theme-switcher.html %}
```

## Using with Jekyll Sass

If you're using Jekyll's Sass pipeline, you can reference the tokens in your SCSS:

```scss
// assets/css/main.scss
---
---

@import "turbo-core";

.my-component {
  background: var(--turbo-bg-surface);
  color: var(--turbo-text-primary);
}
```

## Preventing Flash of Unstyled Content (FOUC)

Add a blocking script in your `<head>` to apply the saved theme before render:

```html
<script>
  (function () {
    var theme = localStorage.getItem('turbo-theme') || 'catppuccin-mocha';
    var link = document.getElementById('theme-css');
    if (link) {
      link.href = '{{ "/assets/css/themes/turbo/" | relative_url }}' + theme + '.css';
    }
  })();
</script>
```

## Requirements

- Ruby 3.1 or higher
- Jekyll 3.5 - 4.x
- Bundler 2.0+

## Troubleshooting

### Gem not found

Make sure you've run `bundle install` and the gem is in your Gemfile.

### CSS not loading

Check that the paths in your layout match your Jekyll configuration. Use `relative_url`
filter for GitHub Pages compatibility.

### Theme not persisting

Ensure localStorage is available and not blocked by browser settings.

## Next Steps

- Learn about [framework integrations](/docs/integrations/)
- Check the [CSS Variables Reference](/docs/api-reference/css-variables/)
- Explore [theme switching options](/docs/guides/theme-switching/)
