// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://turbocoder13.github.io',
  base: '/turbo-themes/',
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
