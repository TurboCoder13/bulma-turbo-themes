import { defineConfig } from 'vite';
import { resolve } from 'path';
import { serveTurboThemesPlugin, copyTurboThemesPlugin } from '../shared/vite-plugins.js';

const turboThemesPath = resolve(__dirname, '../../packages/css/dist');
const corePackagePath = resolve(__dirname, '../../packages/core/dist');

export default defineConfig({
  // Use relative paths in production build so assets work when served from any subdirectory
  base: './',
  resolve: {
    alias: {
      '@turbocoder13/turbo-themes-core': corePackagePath,
    },
  },
  server: {
    port: 4177,
    fs: {
      allow: ['..', turboThemesPath, corePackagePath],
    },
  },
  build: {
    outDir: 'dist',
  },
  plugins: [
    serveTurboThemesPlugin(turboThemesPath),
    copyTurboThemesPlugin(turboThemesPath, resolve(__dirname, 'dist/turbo-themes')),
  ],
});
