#!/usr/bin/env node
/* SPDX-License-Identifier: MIT */
import fs from "node:fs";
import path from "node:path";

const TARGET_DIR = "assets/css";
// Adjust baseline after first CI run output
const BASELINE_KB = 186.86;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(p) : p;
  });
}

if (!fs.existsSync(TARGET_DIR)) {
  console.log(`No ${TARGET_DIR} directory found; skipping CSS budget.`);
  process.exit(0);
}

const files = walk(TARGET_DIR).filter((p) => p.endsWith(".css"));
const totalBytes = files.reduce((sum, p) => sum + fs.statSync(p).size, 0);
const kilobytes = totalBytes / 1024;
const delta = kilobytes - BASELINE_KB;
const pct = BASELINE_KB ? (delta / BASELINE_KB) * 100 : 0;

const msg = `CSS size: ${kilobytes.toFixed(2)} kB (Δ ${delta >= 0 ? "+" : ""}${delta.toFixed(2)} kB, ${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%)`;
console.log(msg);

if (pct > 5) {
  console.log("::warning ::CSS size increased more than 5%");
}
