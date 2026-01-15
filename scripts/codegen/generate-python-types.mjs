#!/usr/bin/env node
// SPDX-License-Identifier: MIT
/**
 * Python Type Generator
 *
 * Generates Python dataclasses from the JSON Schema.
 *
 * Output: python/src/turbo_themes/generated/types.py
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..', '..');

const INPUT_SCHEMA = join(ROOT_DIR, 'schema', 'turbo-themes-output.schema.json');
const OUTPUT_FILE = join(ROOT_DIR, 'python', 'src', 'turbo_themes', 'generated', 'types.py');

const BANNER = `# SPDX-License-Identifier: MIT
# AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
# Generated from: schema/turbo-themes-output.schema.json
# Generator: scripts/codegen/generate-python-types.mjs
# Run: bun run generate:types:python

"""Generated type definitions from JSON Schema.

This module provides dataclass definitions that match the JSON Schema
for turbo-themes output format.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional


`;

/**
 * Convert a property name from camelCase to snake_case.
 */
function toSnakeCase(name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

/**
 * Convert a JSON Schema type to Python type hint.
 */
function schemaToPythonType(schema, defs, optional = false) {
  if (!schema) return 'Any';

  // Handle $ref
  if (schema.$ref) {
    const refName = schema.$ref.replace('#/$defs/', '');
    const type = refName;
    return optional ? `Optional[${type}]` : type;
  }

  // Handle type
  switch (schema.type) {
    case 'string':
      return optional ? 'Optional[str]' : 'str';
    case 'number':
    case 'integer':
      if (schema.type === 'integer') {
        return optional ? 'Optional[int]' : 'int';
      }
      return optional ? 'Optional[float]' : 'float';
    case 'boolean':
      return optional ? 'Optional[bool]' : 'bool';
    case 'null':
      return 'None';
    case 'array':
      if (schema.items) {
        const itemType = schemaToPythonType(schema.items, defs);
        return optional ? `Optional[List[${itemType}]]` : `List[${itemType}]`;
      }
      return optional ? 'Optional[List[Any]]' : 'List[Any]';
    case 'object':
      if (schema.additionalProperties) {
        const valueType = schemaToPythonType(schema.additionalProperties, defs);
        return optional ? `Optional[Dict[str, ${valueType}]]` : `Dict[str, ${valueType}]`;
      }
      return optional ? 'Optional[Dict[str, Any]]' : 'Dict[str, Any]';
    default:
      return 'Any';
  }
}

/**
 * Generate a Python dataclass from a JSON Schema object definition.
 */
function generateDataclass(name, schema, defs) {
  const lines = [];
  lines.push('@dataclass');
  lines.push(`class ${name}:`);
  lines.push(`    """Generated dataclass for ${name}."""`);
  lines.push('');

  const properties = schema.properties || {};
  const required = new Set(schema.required || []);
  const fields = [];

  // Separate required and optional fields (required must come first in Python)
  const requiredFields = [];
  const optionalFields = [];

  for (const [propName, propSchema] of Object.entries(properties)) {
    const pyName = toSnakeCase(propName);
    const isRequired = required.has(propName);

    if (isRequired) {
      requiredFields.push({ propName, pyName, propSchema, isRequired: true });
    } else {
      optionalFields.push({ propName, pyName, propSchema, isRequired: false });
    }
  }

  // Generate required fields first
  for (const { propName, pyName, propSchema } of requiredFields) {
    const pyType = schemaToPythonType(propSchema, defs, false);
    lines.push(`    ${pyName}: ${pyType}`);
  }

  // Then optional fields with defaults
  for (const { propName, pyName, propSchema } of optionalFields) {
    const pyType = schemaToPythonType(propSchema, defs, true);
    lines.push(`    ${pyName}: ${pyType} = None`);
  }

  // If no fields, add pass
  if (requiredFields.length === 0 && optionalFields.length === 0) {
    lines.push('    pass');
  }

  lines.push('');

  // Add from_dict class method
  lines.push('    @classmethod');
  lines.push(`    def from_dict(cls, data: Dict[str, Any]) -> "${name}":`);
  lines.push(`        """Create ${name} from dictionary."""`);

  const fromDictArgs = [];
  for (const { propName, pyName, propSchema, isRequired } of [...requiredFields, ...optionalFields]) {
    if (propSchema.$ref) {
      const refName = propSchema.$ref.replace('#/$defs/', '');
      if (isRequired) {
        fromDictArgs.push(`            ${pyName}=${refName}.from_dict(data["${propName}"]),`);
      } else {
        fromDictArgs.push(`            ${pyName}=${refName}.from_dict(data["${propName}"]) if "${propName}" in data else None,`);
      }
    } else {
      if (isRequired) {
        fromDictArgs.push(`            ${pyName}=data["${propName}"],`);
      } else {
        fromDictArgs.push(`            ${pyName}=data.get("${propName}"),`);
      }
    }
  }

  if (fromDictArgs.length > 0) {
    lines.push('        return cls(');
    lines.push(...fromDictArgs);
    lines.push('        )');
  } else {
    lines.push('        return cls()');
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Generate Python types from the schema.
 */
function generateTypes(schema) {
  const lines = [BANNER];

  // Add Appearance enum
  lines.push('class Appearance(Enum):');
  lines.push('    """Theme appearance mode."""');
  lines.push('');
  lines.push('    LIGHT = "light"');
  lines.push('    DARK = "dark"');
  lines.push('');
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
    lines.push(generateDataclass(name, defSchema, defs));
  }

  // Then complex types
  for (const [name, defSchema] of complexTypes) {
    lines.push(generateDataclass(name, defSchema, defs));
  }

  // Generate root class
  if (schema.properties) {
    lines.push(generateDataclass('TurboThemesOutput', schema, defs));
  }

  return lines.join('\n');
}

async function main() {
  console.log('🐍 Generating Python types...');
  console.log(`   Input: ${INPUT_SCHEMA}`);
  console.log(`   Output: ${OUTPUT_FILE}`);

  // Read schema
  const schemaContent = readFileSync(INPUT_SCHEMA, 'utf-8');
  const schema = JSON.parse(schemaContent);

  // Generate types
  const pyContent = generateTypes(schema);

  // Ensure output directory exists
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });

  // Write output
  writeFileSync(OUTPUT_FILE, pyContent, 'utf-8');

  // Create __init__.py if it doesn't exist
  const initFile = join(dirname(OUTPUT_FILE), '__init__.py');
  try {
    readFileSync(initFile);
  } catch {
    writeFileSync(initFile, '"""Generated types package."""\n\nfrom .types import *\n', 'utf-8');
  }

  console.log(`   ✅ Generated ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error('Error generating Python types:', error);
  process.exit(1);
});
