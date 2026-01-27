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
      '@lgtm-hq/turbo-themes-core': corePackagePath,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Silence Bootstrap 5's deprecation warnings from its internal SCSS files.
        // These warnings come from Bootstrap's use of legacy @import and global functions.
        // Bootstrap 6 will migrate to the modern module system.
        silenceDeprecations: [
          'import',
          'global-builtin',
          'color-functions',
          'legacy-js-api',
          'if-function',
        ],
      },
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
