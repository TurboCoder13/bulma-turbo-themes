// SPDX-License-Identifier: MIT
/**
 * Shared Vite plugins for Turbo Themes examples.
 *
 * These plugins handle serving and copying turbo-themes CSS files
 * during development and production builds.
 */

import type { Plugin } from 'vite';
import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Serves turbo-themes CSS files from packages/css/dist during development.
 *
 * @param turboThemesPath - Absolute path to the turbo-themes dist directory
 * @returns Vite plugin
 */
export function serveTurboThemesPlugin(turboThemesPath: string): Plugin {
  return {
    name: 'serve-turbo-themes',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/turbo-themes/')) {
          const filePath = join(turboThemesPath, req.url.replace('/turbo-themes/', ''));
          if (existsSync(filePath)) {
            const content = readFileSync(filePath);
            res.setHeader('Content-Type', 'text/css');
            res.end(content);
            return;
          }
        }
        next();
      });
    },
  };
}

/**
 * Copies turbo-themes CSS files to dist during production build.
 *
 * @param turboThemesPath - Absolute path to the turbo-themes dist directory
 * @param destDir - Absolute path to the destination directory (e.g., dist/turbo-themes)
 * @returns Vite plugin
 */
export function copyTurboThemesPlugin(turboThemesPath: string, destDir: string): Plugin {
  return {
    name: 'copy-turbo-themes',
    closeBundle() {
      if (existsSync(turboThemesPath)) {
        mkdirSync(destDir, { recursive: true });

        // Copy core and base CSS
        const filesToCopy = ['turbo-core.css', 'turbo-base.css'];
        for (const file of filesToCopy) {
          const src = resolve(turboThemesPath, file);
          if (existsSync(src)) {
            cpSync(src, resolve(destDir, file));
          }
        }

        // Copy themes directory
        const themesDir = resolve(turboThemesPath, 'themes');
        if (existsSync(themesDir)) {
          cpSync(themesDir, resolve(destDir, 'themes'), { recursive: true });
        }
      }
    },
  };
}
