/* SPDX-License-Identifier: MIT */
// Generate per-flavor CSS files and a global overrides CSS file
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Resolve project root from this script location
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Import compiled modules from dist
const distDir = path.join(projectRoot, "dist");
const cssMod = await import(pathToFileURL(path.join(distDir, "themes/css.js")));
const registryMod = await import(
  pathToFileURL(path.join(distDir, "themes/registry.js"))
);

const { cssForFlavor, cssGlobalOverrides } = cssMod;
const { flavors } = registryMod;

const outDir = path.join(projectRoot, "assets", "css", "themes");
fs.mkdirSync(outDir, { recursive: true });

// Write global overrides
fs.writeFileSync(path.join(outDir, "global.css"), cssGlobalOverrides(), "utf8");

// Write one CSS file per flavor
for (const flavor of flavors) {
  const css = cssForFlavor(flavor);
  const outFile = path.join(outDir, `${flavor.id}.css`);
  fs.writeFileSync(outFile, css, "utf8");
}

console.log(`Wrote CSS to ${outDir}`);
