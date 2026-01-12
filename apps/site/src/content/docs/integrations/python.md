---
title: Python
description: Use Turbo Themes in Python applications with the official package.
category: integrations
order: 5
prev: integrations/bootstrap
next: integrations/swiftui
---

# Python Integration

Use Turbo Themes design tokens in Python applications.

## Installation

```bash
pip install turbo-themes
```

Or with Poetry:

```bash
poetry add turbo-themes
```

## Basic Usage

```python
from turbo_themes import ThemeManager, list_theme_ids

# List all available themes
print(list_theme_ids())
# ['catppuccin-mocha', 'catppuccin-latte', 'dracula', ...]

# Create a theme manager
mgr = ThemeManager()

# Get all tokens for the default theme
tokens = mgr.tokens
print(tokens)
```

## ThemeManager API

### Initialization

```python
from turbo_themes import ThemeManager

# Use default theme (catppuccin-mocha)
mgr = ThemeManager()

# Use a specific theme
mgr = ThemeManager(theme_id='dracula')
```

### Getting Tokens

```python
# Get all tokens as a dictionary
tokens = mgr.tokens

# Access specific tokens
bg_base = tokens['background']['base']
text_primary = tokens['text']['primary']
brand_primary = tokens['brand']['primary']
```

### Switching Themes

```python
# Change the active theme
mgr.set_theme('catppuccin-latte')

# Get the current theme ID
current = mgr.current_theme
print(current)  # 'catppuccin-latte'
```

### Token Structure

```python
tokens = mgr.tokens

# Background colors
tokens['background']['base']      # Main background
tokens['background']['surface']   # Card/surface background
tokens['background']['overlay']   # Overlay background

# Text colors
tokens['text']['primary']         # Main text color
tokens['text']['secondary']       # Muted text
tokens['text']['inverse']         # Text on colored backgrounds

# Brand colors
tokens['brand']['primary']        # Primary accent

# State colors
tokens['state']['success']        # Success green
tokens['state']['warning']        # Warning yellow
tokens['state']['danger']         # Error red
tokens['state']['info']           # Info blue

# Border colors
tokens['border']['default']       # Default border

# Syntax highlighting (for code editors)
tokens['syntax']['comment']
tokens['syntax']['keyword']
tokens['syntax']['string']
tokens['syntax']['number']
tokens['syntax']['function']
tokens['syntax']['type']
```

## Use Cases

### GUI Applications (Tkinter)

```python
import tkinter as tk
from turbo_themes import ThemeManager

mgr = ThemeManager(theme_id='dracula')
tokens = mgr.tokens

root = tk.Tk()
root.title("Themed App")
root.configure(bg=tokens['background']['base'])

label = tk.Label(
    root,
    text="Hello, Turbo Themes!",
    bg=tokens['background']['surface'],
    fg=tokens['text']['primary'],
    padx=20,
    pady=10
)
label.pack(padx=20, pady=20)

button = tk.Button(
    root,
    text="Click Me",
    bg=tokens['brand']['primary'],
    fg=tokens['text']['inverse']
)
button.pack(pady=10)

root.mainloop()
```

### Web Applications (Flask)

```python
from flask import Flask, render_template_string
from turbo_themes import ThemeManager

app = Flask(__name__)
mgr = ThemeManager()

@app.route('/')
def home():
    tokens = mgr.tokens
    return render_template_string('''
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    background: {{ bg_base }};
                    color: {{ text_primary }};
                    font-family: system-ui, sans-serif;
                }
                .card {
                    background: {{ bg_surface }};
                    border: 1px solid {{ border }};
                    padding: 1rem;
                    border-radius: 0.5rem;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Flask + Turbo Themes</h1>
                <p>This page uses Python-generated theme tokens.</p>
            </div>
        </body>
        </html>
    ''',
    bg_base=tokens['background']['base'],
    bg_surface=tokens['background']['surface'],
    text_primary=tokens['text']['primary'],
    border=tokens['border']['default']
    )
```

### Data Visualization (Matplotlib)

```python
import matplotlib.pyplot as plt
from turbo_themes import ThemeManager

mgr = ThemeManager(theme_id='catppuccin-mocha')
tokens = mgr.tokens

# Set up the style
plt.rcParams['figure.facecolor'] = tokens['background']['base']
plt.rcParams['axes.facecolor'] = tokens['background']['surface']
plt.rcParams['axes.edgecolor'] = tokens['border']['default']
plt.rcParams['axes.labelcolor'] = tokens['text']['primary']
plt.rcParams['text.color'] = tokens['text']['primary']
plt.rcParams['xtick.color'] = tokens['text']['secondary']
plt.rcParams['ytick.color'] = tokens['text']['secondary']

# Create a plot
fig, ax = plt.subplots()
ax.plot([1, 2, 3, 4], [1, 4, 2, 3], color=tokens['brand']['primary'])
ax.set_title('Themed Plot')
plt.show()
```

### Generating CSS

```python
from turbo_themes import ThemeManager

mgr = ThemeManager(theme_id='dracula')
tokens = mgr.tokens

css = f'''
:root {{
    --bg-base: {tokens['background']['base']};
    --bg-surface: {tokens['background']['surface']};
    --text-primary: {tokens['text']['primary']};
    --brand-primary: {tokens['brand']['primary']};
}}
'''

with open('theme.css', 'w') as f:
    f.write(css)
```

## Development

If you're developing the monorepo and need to regenerate the Python package:

```bash
bun run build
node scripts/generate-python.mjs
```

## Type Hints

The package includes type hints for better IDE support:

```python
from turbo_themes import ThemeManager, ThemeId

def apply_theme(theme_id: ThemeId) -> None:
    mgr = ThemeManager(theme_id=theme_id)
    # ...
```

## Next Steps

- Explore [SwiftUI integration](/docs/integrations/swiftui/)
- Check the [API Reference](/docs/api-reference/)
- Learn about [design tokens](/docs/getting-started/concepts/)
