// SPDX-License-Identifier: MIT
// CSS Variable Mappings - Generated from config/token-mappings.json
// This file reads from the single source of truth configuration

import type {
  CSSVariableMapping,
  HSLVariableMapping,
  HSLColorMapping,
  ComponentTokenMapping,
} from './types.js';

// Import the centralized mapping configuration
// Note: Using require for JSON import compatibility
import mappingConfig from '../../../../../config/token-mappings.json' with { type: 'json' };

// Type definitions for the config structure
interface MappingConfigEntry {
  cssVar: string;
  tokenPath: string;
  fallback?: string;
}

interface ComponentConfigEntry {
  cssVar: string;
  componentPath: string;
  fallback: string;
}

interface HSLConfigEntry {
  hVar: string;
  sVar: string;
  lVar: string;
  tokenPath: string;
}

// Convert config entries to typed mappings
function toVariableMapping(entry: MappingConfigEntry): CSSVariableMapping {
  return {
    cssVar: entry.cssVar,
    tokenPath: entry.tokenPath,
    ...(entry.fallback ? { fallbackPath: entry.fallback } : {}),
  };
}

function toComponentMapping(entry: ComponentConfigEntry): ComponentTokenMapping {
  return {
    cssVar: entry.cssVar,
    componentPath: entry.componentPath,
    fallbackPath: entry.fallback,
  };
}

function toHSLMapping(entry: HSLConfigEntry): HSLVariableMapping {
  return {
    hVar: entry.hVar,
    sVar: entry.sVar,
    lVar: entry.lVar,
    tokenPath: entry.tokenPath,
  };
}

function toHSLColorMapping(entry: MappingConfigEntry): HSLColorMapping {
  return {
    cssVar: entry.cssVar,
    tokenPath: entry.tokenPath,
  };
}

// =============================================================================
// Bulma Framework Mappings
// =============================================================================

/** Bulma scheme variables */
export const BULMA_SCHEME_MAPPINGS: CSSVariableMapping[] =
  mappingConfig.bulma.schemeMappings.map(toVariableMapping);

/** Primary color HSL components */
export const PRIMARY_HSL_MAPPING: HSLVariableMapping =
  toHSLMapping(mappingConfig.bulma.primaryHsl);

/** State colors as HSL */
export const STATE_HSL_MAPPINGS: HSLColorMapping[] =
  mappingConfig.bulma.stateHslMappings.map(toHSLColorMapping);

// =============================================================================
// Theme Variable Mappings
// =============================================================================

/** Text variables */
export const TEXT_MAPPINGS: CSSVariableMapping[] =
  mappingConfig.theme.textMappings.map(toVariableMapping);

/** Heading variables */
export const HEADING_MAPPINGS: CSSVariableMapping[] =
  mappingConfig.theme.headingMappings.map(toVariableMapping);

/** Content element variables */
export const CONTENT_MAPPINGS: CSSVariableMapping[] =
  mappingConfig.theme.contentMappings.map(toVariableMapping);

/** Table variables */
export const TABLE_MAPPINGS: CSSVariableMapping[] =
  mappingConfig.theme.tableMappings.map(toVariableMapping);

/** Syntax highlighting variables */
export const SYNTAX_MAPPINGS: CSSVariableMapping[] =
  mappingConfig.theme.syntaxMappings.map(toVariableMapping);

/** Surface/background variables */
export const SURFACE_MAPPINGS: CSSVariableMapping[] =
  mappingConfig.theme.surfaceMappings.map(toVariableMapping);

// =============================================================================
// Component Token Mappings
// =============================================================================

/** Component token mappings (optional, with fallbacks) */
export const COMPONENT_MAPPINGS: ComponentTokenMapping[] =
  mappingConfig.components.map(toComponentMapping);

// =============================================================================
// Syntax Highlighting CSS Classes
// =============================================================================

/** Syntax highlighting CSS class mappings */
export const SYNTAX_CLASS_GROUPS = mappingConfig.syntaxClassGroups as {
  readonly comment: readonly string[];
  readonly keyword: readonly string[];
  readonly string: readonly string[];
  readonly number: readonly string[];
  readonly attr: readonly string[];
  readonly title: readonly string[];
};

// =============================================================================
// Core Mappings (for generator.ts and Python)
// =============================================================================

/** Core token mappings used by CSS generator */
export const CORE_MAPPINGS: CSSVariableMapping[] =
  mappingConfig.coreMappings.map(toVariableMapping);

/** CSS variable prefix */
export const CSS_VAR_PREFIX = mappingConfig.prefix;

/** Optional group configurations */
export const OPTIONAL_GROUPS = mappingConfig.optionalGroups;
