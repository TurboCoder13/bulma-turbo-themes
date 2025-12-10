#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, rmSync } from "fs";
import { execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const siteExamplesDir = join(rootDir, "_site", "examples");

const copyDir = (from, to) => {
  cpSync(from, to, {
    recursive: true,
    force: true,
    filter: (src) => !src.includes("node_modules"),
  });
};

try {
  if (!existsSync(join(rootDir, "_site"))) {
    mkdirSync(join(rootDir, "_site"));
  }
  rmSync(siteExamplesDir, { recursive: true, force: true });
  mkdirSync(siteExamplesDir, { recursive: true });

  // html-vanilla (static)
  const htmlVanilla = join(rootDir, "examples", "html-vanilla");
  if (existsSync(htmlVanilla)) {
    copyDir(htmlVanilla, join(siteExamplesDir, "html-vanilla"));
  }

  // tailwind (static assets, prebuilt dist)
  const tailwind = join(rootDir, "examples", "tailwind");
  if (existsSync(tailwind)) {
    copyDir(tailwind, join(siteExamplesDir, "tailwind"));
  }

  // jekyll demo build
  const jekyllSource = join(rootDir, "examples", "jekyll");
  if (existsSync(jekyllSource)) {
    execSync(
      "bundle exec jekyll build --source examples/jekyll --destination _site/examples/jekyll --config examples/jekyll/_config.yml",
      {
        cwd: rootDir,
        stdio: "inherit",
      },
    );
  }

  console.log("Examples prepared under _site/examples");
} catch (error) {
  console.error("Failed to prepare examples:", error.message);
  process.exit(1);
}

