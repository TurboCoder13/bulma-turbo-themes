# Turbo Themes Bootstrap Adapter

SCSS-only adapter for integrating Turbo Themes with Bootstrap 5.

## Installation

This adapter is included with `@lgtm-hq/turbo-themes`. No separate installation needed.

## Usage

### Variables

Import the variables file to map Turbo Theme tokens to Bootstrap SCSS variables:

```scss
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~@lgtm-hq/turbo-themes/adapters/bootstrap/variables';
@import '~bootstrap/scss/bootstrap';
```

### Utilities

Import the utilities file for additional Bootstrap utility classes based on Turbo
Themes:

```scss
@import '~@lgtm-hq/turbo-themes/adapters/bootstrap/utilities';
```

## Note

This adapter is SCSS-only and does not include TypeScript code. It provides SCSS
variables and utilities that map Turbo Theme design tokens to Bootstrap's theming
system.
