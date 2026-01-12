import { defineConfig } from 'vite';
import { resolve } from 'path';
import { serveTurboThemesPlugin, copyTurboThemesPlugin } from '../shared/vite-plugins.js';

const turboThemesPath = resolve(__dirname, '../../packages/css/dist');

export default defineConfig({
  // Use relative paths in production build so assets work when served from any subdirectory
  base: './',
  plugins: [
    serveTurboThemesPlugin(turboThemesPath),
    copyTurboThemesPlugin(turboThemesPath, resolve(__dirname, 'dist/turbo-themes')),
  ],
  server: {
    port: 4174,
    fs: {
      allow: ['..', turboThemesPath],
    },
  },
});
