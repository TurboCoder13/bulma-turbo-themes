// SPDX-License-Identifier: MIT
import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Vite configuration for building the theme-selector JavaScript library.
 *
 * Builds an IIFE bundle for browser usage, with both development and production modes:
 * - Development: Non-minified with source maps (theme-selector.js)
 * - Production: Minified without source maps (theme-selector.min.js)
 *
 * @example
 * bun run build:js:dev   # Development build
 * bun run build:js:prod  # Production build
 */
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    build: {
      lib: {
        entry: resolve(import.meta.dirname, 'assets/js/theme-selector.ts'),
        name: 'TurboThemeSelector',
        formats: ['iife'],
        fileName: () => (isProduction ? 'theme-selector.min.js' : 'theme-selector.js'),
      },
      outDir: 'assets/js',
      emptyOutDir: false,
      minify: isProduction ? 'esbuild' : false,
      sourcemap: !isProduction,
      target: 'es2020',
    },
    resolve: {
      alias: {
        '@lgtm-hq/turbo-themes-core': resolve(
          import.meta.dirname,
          'packages/core/dist/index.js'
        ),
        '@lgtm-hq/turbo-theme-selector': resolve(
          import.meta.dirname,
          'packages/theme-selector/dist/index.js'
        ),
      },
    },
  };
});
