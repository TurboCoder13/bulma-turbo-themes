#!/usr/bin/env node

import { execSync } from 'child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const siteExamplesDir = join(rootDir, 'apps', 'site', 'dist', 'examples');

const copyDir = (from, to) => {
  cpSync(from, to, {
    recursive: true,
    force: true,
    filter: (src) => !src.includes('node_modules'),
  });
};

/**
 * Copy only the dist folder of a built example
 */
const copyBuiltExample = (exampleName) => {
  const distDir = join(rootDir, 'examples', exampleName, 'dist');
  const targetDir = join(siteExamplesDir, exampleName);

  if (existsSync(distDir)) {
    console.log(`Copying built ${exampleName} example...`);
    mkdirSync(targetDir, { recursive: true });
    cpSync(distDir, targetDir, { recursive: true });
    return true;
  }
  return false;
};

/**
 * Check if the turbo-themes gem is available to bundler
 */
function isGemAvailable() {
  try {
    execSync('bundle exec ruby -e "require \'turbo-themes\'"', {
      cwd: rootDir,
      stdio: 'pipe',
    });
    return true;
  } catch {
    return false;
  }
}

try {
  const siteDistDir = join(rootDir, 'apps', 'site', 'dist');
  if (!existsSync(siteDistDir)) {
    mkdirSync(siteDistDir, { recursive: true });
  }

  // Preserve the Astro-generated index.html before clearing examples directory
  const examplesIndexPath = join(siteExamplesDir, 'index.html');
  let examplesIndexContent = null;
  if (existsSync(examplesIndexPath)) {
    const { readFileSync } = await import('fs');
    examplesIndexContent = readFileSync(examplesIndexPath, 'utf8');
  }

  rmSync(siteExamplesDir, { recursive: true, force: true });
  mkdirSync(siteExamplesDir, { recursive: true });

  // Restore the Astro-generated index.html
  if (examplesIndexContent) {
    const { writeFileSync } = await import('fs');
    writeFileSync(examplesIndexPath, examplesIndexContent);
    console.log('Restored examples/index.html from Astro build');
  }

  // html-vanilla (static - copy entire directory and CSS files)
  const htmlVanilla = join(rootDir, 'examples', 'html-vanilla');
  if (existsSync(htmlVanilla)) {
    console.log('Copying html-vanilla example...');
    const htmlVanillaTarget = join(siteExamplesDir, 'html-vanilla');
    copyDir(htmlVanilla, htmlVanillaTarget);

    // Copy turbo-themes CSS to html-vanilla example
    const cssSrc = join(rootDir, 'packages', 'css', 'dist');
    const cssDest = join(htmlVanillaTarget, 'turbo-themes');
    if (existsSync(cssSrc)) {
      mkdirSync(cssDest, { recursive: true });
      // Copy core and base CSS
      for (const file of ['turbo-core.css', 'turbo-base.css']) {
        const src = join(cssSrc, file);
        if (existsSync(src)) {
          cpSync(src, join(cssDest, file));
        }
      }
      // Copy themes directory
      const themesDir = join(cssSrc, 'themes');
      if (existsSync(themesDir)) {
        cpSync(themesDir, join(cssDest, 'themes'), { recursive: true });
      }
    }

    // Update index.html paths from ../../packages/css/dist to ./turbo-themes
    const indexPath = join(htmlVanillaTarget, 'index.html');
    if (existsSync(indexPath)) {
      const { readFileSync, writeFileSync } = await import('fs');
      let html = readFileSync(indexPath, 'utf8');
      html = html.replace(/\.\.\/\.\.\/packages\/css\/dist\//g, './turbo-themes/');
      writeFileSync(indexPath, html);
    }
  }

  // tailwind (built with Vite - copy dist)
  if (!copyBuiltExample('tailwind')) {
    // Fallback: copy entire directory if not built
    const tailwind = join(rootDir, 'examples', 'tailwind');
    if (existsSync(tailwind)) {
      console.log('Copying tailwind example (source)...');
      copyDir(tailwind, join(siteExamplesDir, 'tailwind'));
    }
  }

  // react (built with Vite - copy dist)
  if (!copyBuiltExample('react')) {
    console.log('⚠️  React example not built. Run "bun run examples:build" first.');
  }

  // vue (built with Vite - copy dist)
  if (!copyBuiltExample('vue')) {
    console.log('⚠️  Vue example not built. Run "bun run examples:build" first.');
  }

  // bootstrap (built with Vite - copy dist)
  if (!copyBuiltExample('bootstrap')) {
    console.log('⚠️  Bootstrap example not built. Run "bun run examples:build" first.');
  }

  // jekyll demo build
  const jekyllSource = join(rootDir, 'examples', 'jekyll');
  const jekyllTarget = join(siteExamplesDir, 'jekyll');
  if (existsSync(jekyllSource)) {
    console.log('Building Jekyll example...');

    // Check if Jekyll is available
    let jekyllAvailable = false;
    try {
      execSync('which jekyll || which bundle', { stdio: 'pipe' });
      jekyllAvailable = true;
    } catch {
      jekyllAvailable = false;
    }

    if (!jekyllAvailable) {
      console.log('⚠️  Jekyll not available. Skipping Jekyll example build.');
      console.log('   Run "gem install jekyll bundler" to enable Jekyll builds locally.');
    } else {
      // Build Jekyll (uses local _layouts now, doesn't need gem)
      try {
        execSync(
          'bundle exec jekyll build --source examples/jekyll --destination apps/site/dist/examples/jekyll --config examples/jekyll/_config.yml',
          {
            cwd: rootDir,
            stdio: 'inherit',
          }
        );
      } catch (e) {
        // If bundle exec fails, try plain jekyll
        console.log('bundle exec failed, trying plain jekyll...');
        try {
          execSync(
            'jekyll build --source examples/jekyll --destination apps/site/dist/examples/jekyll --config examples/jekyll/_config.yml',
            {
              cwd: rootDir,
              stdio: 'inherit',
            }
          );
        } catch (e2) {
          console.log('⚠️  Jekyll build failed. Skipping Jekyll example.');
        }
      }
    }

    // Copy turbo-themes CSS to Jekyll example's assets (if Jekyll was built)
    const cssSrc = join(rootDir, 'packages', 'css', 'dist');
    const cssDest = join(jekyllTarget, 'assets', 'css');
    if (existsSync(cssSrc) && existsSync(jekyllTarget)) {
      console.log('Copying CSS to Jekyll assets...');
      mkdirSync(cssDest, { recursive: true });
      // Copy core and base CSS
      for (const file of ['turbo-core.css', 'turbo-base.css']) {
        const src = join(cssSrc, file);
        if (existsSync(src)) {
          cpSync(src, join(cssDest, file));
        }
      }
      // Copy themes directory
      const themesDir = join(cssSrc, 'themes');
      if (existsSync(themesDir)) {
        cpSync(themesDir, join(cssDest, 'themes'), { recursive: true });
      }
    }
  }

  console.log('Examples prepared under apps/site/dist/examples');
} catch (error) {
  console.error('Failed to prepare examples:', error.message);
  process.exit(1);
}
