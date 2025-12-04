// SPDX-License-Identifier: MIT
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { cwd } from 'process';
import postcssConfig from './postcss.config.js';

export default defineConfig(({ mode }) => {
  const themeEntry = process.env.THEME_ENTRY || 'src/scss/main.scss';
  const themeOutput = process.env.THEME_OUTPUT || 'assets/css/themes/themes.css';

  return {
    mode: mode || 'production',
    build: {
      // Generate CSS-only build for themes
      rollupOptions: {
        input: resolve(cwd(), themeEntry),
        output: {
          // Output CSS file to specified location
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return themeOutput;
            }
            return assetInfo.name || '[name][extname]';
          },
        },
      },
      outDir: '.',
      emptyOutDir: false,
      cssCodeSplit: false,
      write: true,
      minify: 'esbuild',
      cssMinify: 'lightningcss',
    },
    css: {
      postcss: postcssConfig,
      // Use PostCSS for purging and minification (lightningcss transformer bypasses PostCSS)
      preprocessorOptions: {
        scss: {
          // Silence deprecation warnings
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
  };
});
