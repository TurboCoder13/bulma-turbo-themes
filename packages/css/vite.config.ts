import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: [
      // More specific alias first
      {
        find: '@lgtm-hq/turbo-themes-core/css/mappings',
        replacement: resolve(__dirname, '../core/dist/themes/css/mappings.js'),
      },
      {
        find: '@lgtm-hq/turbo-themes-core',
        replacement: resolve(__dirname, '../core/dist/index.js'),
      },
    ],
  },
  plugins: [dts({ rollupTypes: true })],
});
