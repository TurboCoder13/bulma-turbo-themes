# StackBlitz Templates

Optimized, minimal examples designed for fast loading in StackBlitz.

## Available Templates

| Template                        | Description                  | Try It                                                                                                                   |
| ------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [html-vanilla](./html-vanilla/) | Zero-dependency vanilla JS   | [Open in StackBlitz](https://stackblitz.com/github/TurboCoder13/turbo-themes/tree/main/examples/stackblitz/html-vanilla) |
| [react](./react/)               | React 18 + TypeScript + Vite | [Open in StackBlitz](https://stackblitz.com/github/TurboCoder13/turbo-themes/tree/main/examples/stackblitz/react)        |
| [vue](./vue/)                   | Vue 3 + TypeScript + Vite    | [Open in StackBlitz](https://stackblitz.com/github/TurboCoder13/turbo-themes/tree/main/examples/stackblitz/vue)          |
| [tailwind](./tailwind/)         | Tailwind CSS + Vite          | [Open in StackBlitz](https://stackblitz.com/github/TurboCoder13/turbo-themes/tree/main/examples/stackblitz/tailwind)     |
| [bootstrap](./bootstrap/)       | Bootstrap 5 + SCSS + Vite    | [Open in StackBlitz](https://stackblitz.com/github/TurboCoder13/turbo-themes/tree/main/examples/stackblitz/bootstrap)    |

## Purpose

These templates are:

- **Minimal**: Only essential files for quick StackBlitz loading
- **Self-contained**: Use CDN or npm package directly
- **Interactive**: Fully functional theme switching demos

For more complete examples with tests and additional features, see the
[main examples directory](../).

## Differences from Main Examples

| Feature       | StackBlitz Templates | Main Examples         |
| ------------- | -------------------- | --------------------- |
| File count    | Minimal (3-7 files)  | Complete (10+ files)  |
| Tests         | None                 | Full Playwright tests |
| Documentation | Inline comments      | Separate README       |
| Dependencies  | Latest from npm      | Pinned versions       |
| Build config  | Simplified           | Production-ready      |

## Usage

1. Click "Open in StackBlitz" link above
2. Wait for dependencies to install
3. Use the theme selector to switch themes
4. Explore the code to see how it works

## Local Development

```bash
cd examples/stackblitz/react  # or any template
npm install
npm run dev
```
