import { defineConfig } from 'vite';

export default defineConfig({
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
});
