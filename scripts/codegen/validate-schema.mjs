#!/usr/bin/env node
/**
 * Validate all theme JSON files against the turbo-themes schema
 */

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

const schemaPath = join(projectRoot, 'schema', 'turbo-themes.schema.json');
const themesDir = join(projectRoot, 'schema', 'tokens', 'themes');
const sharedTokensPath = join(projectRoot, 'schema', 'tokens', '_shared.tokens.json');

// Load schema
const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

// Create AJV instance with JSON Schema 2020-12 support
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

// Add the full schema first so all $refs can be resolved
ajv.addSchema(schema, 'turbo-themes.schema.json');

// Create schema wrappers that reference the definitions
const themeFileSchema = {
  $ref: 'turbo-themes.schema.json#/$defs/ThemeFile',
};
const sharedTokensSchema = {
  $ref: 'turbo-themes.schema.json#/$defs/SharedTokensFile',
};

// Compile validators
const validateThemeFile = ajv.compile(themeFileSchema);
const validateSharedTokensFile = ajv.compile(sharedTokensSchema);

let hasErrors = false;

/**
 * Validate a single file
 */
function validateFile(filePath, validator, fileType) {
  const fileName = basename(filePath);
  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    const valid = validator(data);

    if (valid) {
      console.log(`  ✓ ${fileName}`);
      return true;
    } else {
      console.log(`  ✗ ${fileName}`);
      for (const error of validator.errors) {
        console.log(`    - ${error.instancePath || '/'}: ${error.message}`);
      }
      return false;
    }
  } catch (e) {
    console.log(`  ✗ ${fileName}`);
    console.log(`    - Parse error: ${e.message}`);
    return false;
  }
}

console.log('Validating turbo-themes schema files...\n');

// Validate shared tokens
console.log('Shared tokens:');
if (!validateFile(sharedTokensPath, validateSharedTokensFile, 'SharedTokensFile')) {
  hasErrors = true;
}

// Validate theme files
console.log('\nTheme files:');
const themeFiles = readdirSync(themesDir).filter(f => f.endsWith('.tokens.json'));

for (const file of themeFiles) {
  const filePath = join(themesDir, file);
  if (!validateFile(filePath, validateThemeFile, 'ThemeFile')) {
    hasErrors = true;
  }
}

console.log();

if (hasErrors) {
  console.log('❌ Validation failed with errors');
  process.exit(1);
} else {
  console.log(`✅ All ${themeFiles.length + 1} files validated successfully`);
}
