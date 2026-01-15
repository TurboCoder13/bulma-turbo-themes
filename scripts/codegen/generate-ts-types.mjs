#!/usr/bin/env node
// SPDX-License-Identifier: MIT
/**
 * TypeScript Type Generator
 *
 * Generates TypeScript interfaces from the JSON Schema using json-schema-to-typescript.
 *
 * Output: packages/core/src/themes/generated-types.ts
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..', '..');

const INPUT_SCHEMA = join(ROOT_DIR, 'schema', 'turbo-themes-output.schema.json');
const OUTPUT_FILE = join(ROOT_DIR, 'packages', 'core', 'src', 'themes', 'generated-types.ts');

const BANNER = `// SPDX-License-Identifier: MIT
// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// Generated from: schema/turbo-themes-output.schema.json
// Generator: scripts/codegen/generate-ts-types.mjs
// Run: bun run generate:types:ts

`;

/**
 * Convert a JSON Schema type definition to TypeScript interface.
 */
function schemaToInterface(name, schema, defs) {
  const lines = [];
  lines.push(`export interface ${name} {`);

  const properties = schema.properties || {};
  const required = new Set(schema.required || []);

  for (const [propName, propSchema] of Object.entries(properties)) {
    const isRequired = required.has(propName);
    const tsType = schemaTypeToTs(propSchema, defs);
    const optionalMark = isRequired ? '' : '?';
    lines.push(`  ${propName}${optionalMark}: ${tsType};`);
  }

  // Handle additionalProperties
  if (schema.additionalProperties) {
    const valueType = schemaTypeToTs(schema.additionalProperties, defs);
    lines.push(`  [key: string]: ${valueType};`);
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Convert a JSON Schema type to TypeScript type.
 */
function schemaTypeToTs(schema, defs) {
  if (!schema) return 'unknown';

  // Handle $ref
  if (schema.$ref) {
    const refName = schema.$ref.replace('#/$defs/', '');
    return refName;
  }

  // Handle type
  switch (schema.type) {
    case 'string':
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'null':
      return 'null';
    case 'array':
      if (schema.items) {
        return `${schemaTypeToTs(schema.items, defs)}[]`;
      }
      return 'unknown[]';
    case 'object':
      if (schema.additionalProperties) {
        const valueType = schemaTypeToTs(schema.additionalProperties, defs);
        return `Record<string, ${valueType}>`;
      }
      return 'Record<string, unknown>';
    default:
      return 'unknown';
  }
}

/**
 * Generate TypeScript types from the schema.
 */
function generateTypes(schema) {
  const lines = [BANNER];

  // Add type guard comment
  lines.push('/* eslint-disable @typescript-eslint/no-empty-object-type */');
  lines.push('');

  const defs = schema.$defs || {};

  // Generate interfaces for all definitions
  for (const [name, defSchema] of Object.entries(defs)) {
    if (defSchema.type === 'object') {
      lines.push(schemaToInterface(name, defSchema, defs));
      lines.push('');
    } else if (defSchema.type === 'string' && defSchema.enum) {
      // Generate union type for enums
      const values = defSchema.enum.map((v) => `'${v}'`).join(' | ');
      lines.push(`export type ${name} = ${values};`);
      lines.push('');
    }
  }

  // Generate root interface
  if (schema.properties) {
    lines.push(schemaToInterface('TurboThemesOutput', schema, defs));
    lines.push('');
  }

  // Add Appearance type if not defined
  if (!defs.Appearance) {
    lines.push("export type Appearance = 'light' | 'dark';");
    lines.push('');
  }

  // Add re-exports for convenience
  lines.push('// Re-export main types');
  lines.push('export type { ThemeTokens } from "./types.js";');
  lines.push('');

  return lines.join('\n');
}

async function main() {
  console.log('📝 Generating TypeScript types...');
  console.log(`   Input: ${INPUT_SCHEMA}`);
  console.log(`   Output: ${OUTPUT_FILE}`);

  // Read schema
  const schemaContent = readFileSync(INPUT_SCHEMA, 'utf-8');
  const schema = JSON.parse(schemaContent);

  // Generate types
  const tsContent = generateTypes(schema);

  // Ensure output directory exists
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });

  // Write output
  writeFileSync(OUTPUT_FILE, tsContent, 'utf-8');

  console.log(`   ✅ Generated ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error('Error generating TypeScript types:', error);
  process.exit(1);
});
