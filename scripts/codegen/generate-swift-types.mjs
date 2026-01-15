#!/usr/bin/env node
// SPDX-License-Identifier: MIT
/**
 * Swift Type Generator
 *
 * Generates Swift Codable structs from the JSON Schema.
 *
 * Output: swift/Sources/TurboThemes/Generated/Types.swift
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeSwiftIdentifier, isSwiftKeyword } from '../utils/validation.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..', '..');

const INPUT_SCHEMA = join(ROOT_DIR, 'schema', 'turbo-themes-output.schema.json');
const OUTPUT_FILE = join(ROOT_DIR, 'swift', 'Sources', 'TurboThemes', 'Generated', 'Types.swift');

const BANNER = `// SPDX-License-Identifier: MIT
// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// Generated from: schema/turbo-themes-output.schema.json
// Generator: scripts/codegen/generate-swift-types.mjs
// Run: bun run generate:types:swift

import Foundation

`;

/**
 * Convert a JSON Schema type to Swift type.
 */
function schemaToSwiftType(schema, defs, optional = false) {
  if (!schema) return 'Any';

  // Handle $ref
  if (schema.$ref) {
    const refName = schema.$ref.replace('#/$defs/', '');
    return optional ? `${refName}?` : refName;
  }

  // Handle type
  let baseType;
  switch (schema.type) {
    case 'string':
      baseType = 'String';
      break;
    case 'number':
      baseType = 'Double';
      break;
    case 'integer':
      baseType = 'Int';
      break;
    case 'boolean':
      baseType = 'Bool';
      break;
    case 'null':
      return 'Void?';
    case 'array':
      if (schema.items) {
        const itemType = schemaToSwiftType(schema.items, defs, false);
        baseType = `[${itemType}]`;
      } else {
        baseType = '[Any]';
      }
      break;
    case 'object':
      if (schema.additionalProperties) {
        const valueType = schemaToSwiftType(schema.additionalProperties, defs, false);
        baseType = `[String: ${valueType}]`;
      } else {
        baseType = '[String: Any]';
      }
      break;
    default:
      baseType = 'Any';
  }

  return optional ? `${baseType}?` : baseType;
}

/**
 * Generate a Swift struct from a JSON Schema object definition.
 */
function generateStruct(name, schema, defs) {
  const lines = [];
  lines.push(`/// Generated struct for ${name}`);
  lines.push(`public struct ${name}: Codable, Equatable, Sendable {`);

  const properties = schema.properties || {};
  const required = new Set(schema.required || []);

  // Generate properties
  for (const [propName, propSchema] of Object.entries(properties)) {
    const isRequired = required.has(propName);
    const swiftType = schemaToSwiftType(propSchema, defs, !isRequired);

    // Add doc comment if available
    if (propSchema.description) {
      lines.push(`    /// ${propSchema.description}`);
    }

    // Escape property name for Swift (handles keywords and invalid characters)
    const safePropName = escapeSwiftIdentifier(propName);
    lines.push(`    public let ${safePropName}: ${swiftType}`);
  }

  // Add CodingKeys enum if we need to map any property names
  // Needed when: property starts with $, or when property name requires escaping
  const needsCodingKeys = Object.keys(properties).some(
    (p) => p.startsWith('$') || escapeSwiftIdentifier(p) !== p
  );
  if (needsCodingKeys) {
    lines.push('');
    lines.push('    enum CodingKeys: String, CodingKey {');
    for (const propName of Object.keys(properties)) {
      const safeName = escapeSwiftIdentifier(propName);
      // If the name was transformed, we need an explicit mapping
      if (safeName !== propName || propName.startsWith('$')) {
        // Get the raw identifier (remove backticks if present)
        const rawName = safeName.replace(/^`|`$/g, '');
        // For enum case, wrap in backticks if it's a keyword
        const caseName = isSwiftKeyword(rawName) ? `\`${rawName}\`` : rawName;
        lines.push(`        case ${caseName} = "${propName}"`);
      } else {
        // Even non-transformed names might be keywords
        const caseName = isSwiftKeyword(propName) ? `\`${propName}\`` : propName;
        lines.push(`        case ${caseName}`);
      }
    }
    lines.push('    }');
  }

  lines.push('}');
  lines.push('');
  return lines.join('\n');
}

/**
 * Generate Swift types from the schema.
 */
function generateTypes(schema) {
  const lines = [BANNER];

  // Add Appearance enum
  lines.push('/// Theme appearance mode');
  lines.push('public enum GeneratedAppearance: String, Codable, Equatable, Sendable {');
  lines.push('    case light');
  lines.push('    case dark');
  lines.push('}');
  lines.push('');

  const defs = schema.$defs || {};

  // Track which definitions we've processed
  const processed = new Set();

  // Process definitions in dependency order
  // Simple types first, then complex ones
  const simpleTypes = [];
  const complexTypes = [];

  for (const [name, defSchema] of Object.entries(defs)) {
    if (defSchema.type === 'object') {
      // Check if this has any $ref dependencies
      const hasRefs = JSON.stringify(defSchema).includes('$ref');
      if (hasRefs) {
        complexTypes.push([name, defSchema]);
      } else {
        simpleTypes.push([name, defSchema]);
      }
    }
  }

  // Generate simple types first
  for (const [name, defSchema] of simpleTypes) {
    // Add "Generated" prefix to avoid conflicts with existing types
    lines.push(generateStruct(`Generated${name}`, defSchema, defs));
  }

  // Then complex types
  for (const [name, defSchema] of complexTypes) {
    lines.push(generateStruct(`Generated${name}`, defSchema, defs));
  }

  // Generate root struct
  if (schema.properties) {
    lines.push(generateStruct('GeneratedTurboThemesOutput', schema, defs));
  }

  return lines.join('\n');
}

async function main() {
  console.log('🍎 Generating Swift types...');
  console.log(`   Input: ${INPUT_SCHEMA}`);
  console.log(`   Output: ${OUTPUT_FILE}`);

  // Read schema
  const schemaContent = readFileSync(INPUT_SCHEMA, 'utf-8');
  const schema = JSON.parse(schemaContent);

  // Generate types
  const swiftContent = generateTypes(schema);

  // Ensure output directory exists
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });

  // Write output
  writeFileSync(OUTPUT_FILE, swiftContent, 'utf-8');

  console.log(`   ✅ Generated ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error('Error generating Swift types:', error);
  process.exit(1);
});
