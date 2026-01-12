#!/usr/bin/env node
/* SPDX-License-Identifier: MIT */
import fs from 'node:fs';
import path from 'node:path';

const summaryPath = 'coverage/coverage-summary.json';
if (!fs.existsSync(summaryPath)) {
  console.error('coverage-summary.json not found; skipping badge generation');
  process.exit(0);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const totals = summary.total || {};
const metrics = [
  ['lines', totals.lines?.pct],
  ['branches', totals.branches?.pct],
  ['functions', totals.functions?.pct],
  ['statements', totals.statements?.pct],
].filter(([, v]) => typeof v === 'number');

const outDir = 'assets/static/badges';
fs.mkdirSync(outDir, { recursive: true });

function svg(label, value) {
  const percent = Math.round(value);
  const text = `${percent}%`;
  const width = 90;
  const height = 20;
  const leftWidth = 60;
  const rightWidth = 30;
  const color =
    value >= 90 ? '#4c1' : value >= 80 ? '#97CA00' : value >= 70 ? '#dfb317' : '#e05d44';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img" aria-label="${label}: ${text}">
<linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
<mask id="m"><rect width="${width}" height="${height}" rx="3" fill="#fff"/></mask>
<g mask="url(#m)">
  <rect width="${leftWidth}" height="${height}" fill="#555"/>
  <rect x="${leftWidth}" width="${rightWidth}" height="${height}" fill="${color}"/>
  <rect width="${width}" height="${height}" fill="url(#s)"/>
</g>
<g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
  <text x="${leftWidth / 2}" y="14">${label}</text>
  <text x="${leftWidth + rightWidth / 2}" y="14">${text}</text>
</g>
</svg>`;
}

for (const [name, value] of metrics) {
  const file = path.join(outDir, `coverage-${name}.svg`);
  fs.writeFileSync(file, svg(name, value));
  console.log(`wrote ${file}`);
}
