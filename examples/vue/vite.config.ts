import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { serveTurboThemesPlugin, copyTurboThemesPlugin } from '../shared/vite-plugins.js';

const turboThemesPath = resolve(__dirname, '../../packages/css/dist');
const corePackagePath = resolve(__dirname, '../../packages/core/dist');

export default defineConfig({
  // Use relative paths in production build so assets work when served from any subdirectory
  base: './',
  plugins: [
    vue(),
    serveTurboThemesPlugin(turboThemesPath),
    copyTurboThemesPlugin(turboThemesPath, resolve(__dirname, 'dist/turbo-themes')),
  ],
  resolve: {
    alias: {
      '@lgtm-hq/turbo-themes-core': corePackagePath,
    },
  },
  server: {
    port: 4176,
    fs: {
      allow: ['..', turboThemesPath, corePackagePath],
    },
  },
  build: {
    outDir: 'dist',
  },
});
