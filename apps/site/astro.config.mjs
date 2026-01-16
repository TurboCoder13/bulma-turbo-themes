// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Base path configuration:
// - Local development and E2E tests: / (default)
// - Production (GitHub Pages): /turbo-themes/
// Set ASTRO_BASE=/turbo-themes/ for production builds (CI deploy workflow sets this)
const base = process.env.ASTRO_BASE || '/';

// https://astro.build/config
export default defineConfig({
  site: 'https://turbocoder13.github.io',
  base,
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      wrap: true,
    },
  },
  build: {
    format: 'directory',
  },
  vite: {
    build: {
      // Ensure assets are properly handled
      assetsInlineLimit: 0,
    },
  },
});
