# bulma-turbo-themes

Modern, accessible theme packs and a drop-in theme selector for Bulma 1.x.

[![Node.js](https://img.shields.io/badge/node.js-22-green)](https://nodejs.org/)
[![Coverage](https://codecov.io/gh/TurboCoder13/bulma-turbo-themes/branch/main/graph/badge.svg)](https://codecov.io/gh/TurboCoder13/bulma-turbo-themes)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Tests](https://img.shields.io/github/actions/workflow/status/TurboCoder13/bulma-turbo-themes/quality-ci-main.yml?label=tests&branch=main&logo=githubactions&logoColor=white)](https://github.com/TurboCoder13/bulma-turbo-themes/actions/workflows/quality-ci-main.yml?query=branch%3Amain)
[![CI](https://img.shields.io/github/actions/workflow/status/TurboCoder13/bulma-turbo-themes/quality-ci-main.yml?label=ci&branch=main&logo=githubactions&logoColor=white)](https://github.com/TurboCoder13/bulma-turbo-themes/actions/workflows/quality-ci-main.yml?query=branch%3Amain)
[![Lighthouse](https://img.shields.io/github/actions/workflow/status/TurboCoder13/bulma-turbo-themes/reporting-lighthouse-ci.yml?label=lighthouse&branch=main)](https://github.com/TurboCoder13/bulma-turbo-themes/actions/workflows/reporting-lighthouse-ci.yml?query=branch%3Amain)

[![CodeQL](https://github.com/TurboCoder13/bulma-turbo-themes/actions/workflows/security-codeql.yml/badge.svg?branch=main)](https://github.com/TurboCoder13/bulma-turbo-themes/actions/workflows/security-codeql.yml?query=branch%3Amain)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/TurboCoder13/bulma-turbo-themes/badge)](https://scorecard.dev/viewer/?uri=github.com/TurboCoder13/bulma-turbo-themes)
[![SBOM](https://img.shields.io/badge/SBOM-enabled-brightgreen)](SECURITY.md)
[![Download SBOM](https://img.shields.io/badge/SBOM-download_latest-blue?logo=github)](https://github.com/TurboCoder13/bulma-turbo-themes/actions/workflows/security-sbom.yml)

[![npm](https://img.shields.io/npm/v/%40turbocoder13%2Fbulma-turbo-themes)](https://www.npmjs.com/package/@turbocoder13/bulma-turbo-themes)

## Features

- Catppuccin, Dracula, GitHub (light/dark) flavor packs
- Accessible theme selector with keyboard and screen reader support
- Inline or link-based CSS delivery; CSP-friendly
- Tested with coverage, Lighthouse CI, and stylelint

## Quick start

1. Install and include CSS links

```html
<link id="theme-global-css" rel="stylesheet" href="/assets/css/themes/global.css" />
<link id="theme-flavor-css" rel="stylesheet" href="#" />
```

1. Add selector markup and initialize

```html
<div class="dropdown is-right is-theme" id="theme-flavor-dd">
  <div class="dropdown-trigger">
    <button id="theme-flavor-trigger" aria-haspopup="true">
      <span id="theme-flavor-trigger-icon"></span>
      <span id="theme-flavor-trigger-label"></span>
    </button>
  </div>
  <div class="dropdown-menu" id="theme-flavor-menu" role="menu">
    <div class="dropdown-content" id="theme-flavor-items"></div>
  </div>
  <div class="select is-hidden"><select id="theme-flavor-select"></select></div>
  <span id="theme-flavor-icon"></span>
</div>
```

```ts
import { initTheme, wireFlavorSelector } from "@turbocoder13/bulma-turbo-themes";

document.addEventListener("DOMContentLoaded", () => {
  initTheme(document, window, { styleMode: "auto" });
  wireFlavorSelector(document, window);
});
```

## Documentation

- Code of Conduct: see `CODE_OF_CONDUCT.md`
- Contributing Guide: see `CONTRIBUTING.md`
- Security Policy: see `SECURITY.md`
- Release process: see `RELEASE.md`
- Workflows & Actions: see `.github/workflows/README.md` and `.github/actions/README.md`
- Scripts: see `scripts/README.md`

## Governance

See `GOVERNANCE.md` and `MAINTAINERS.md`.

## License

MIT © Turbo Coder
