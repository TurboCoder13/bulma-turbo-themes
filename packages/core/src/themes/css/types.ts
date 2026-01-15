// SPDX-License-Identifier: MIT
// Types for Data-Driven CSS Generation

export type TokenPath = string;
export type CSSVariableName = string;

export interface CSSVariableMapping {
  cssVar: CSSVariableName;
  tokenPath: TokenPath;
  fallbackPath?: TokenPath;
}

export interface HSLVariableMapping {
  hVar: CSSVariableName;
  sVar: CSSVariableName;
  lVar: CSSVariableName;
  tokenPath: TokenPath;
}

export interface HSLColorMapping {
  cssVar: CSSVariableName;
  tokenPath: TokenPath;
}

export interface ComponentTokenMapping {
  cssVar: CSSVariableName;
  componentPath: string;
  fallbackPath: string;
}
