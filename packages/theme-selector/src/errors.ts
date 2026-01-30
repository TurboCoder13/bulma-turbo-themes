// SPDX-License-Identifier: MIT
/**
 * Centralized error handling for Turbo Themes.
 *
 * Provides a consistent error logging strategy with standardized message
 * formatting, error levels, and optional context for debugging.
 */

/** Log prefix for all theme-related messages */
export const LOG_PREFIX = '[turbo-themes]';

/** Error severity levels */
export enum ErrorLevel {
  WARN = 'warn',
  ERROR = 'error',
}

/** Structured theme error with code, message, level, and optional context */
export interface ThemeError {
  code: string;
  message: string;
  level: ErrorLevel;
  context?: Record<string, unknown>;
}

/**
 * Factory functions for creating structured theme errors.
 * Each function returns a ThemeError with appropriate code, message, and level.
 */
export const ThemeErrors = {
  /** Invalid theme ID provided */
  INVALID_THEME_ID: (themeId: string): ThemeError => ({
    code: 'INVALID_THEME_ID',
    message: `Invalid theme ID "${themeId}" not saved to storage`,
    level: ErrorLevel.WARN,
    context: { themeId },
  }),

  /** No themes available in registry */
  NO_THEMES_AVAILABLE: (): ThemeError => ({
    code: 'NO_THEMES_AVAILABLE',
    message: 'No themes available',
    level: ErrorLevel.ERROR,
  }),

  /** Invalid theme icon path */
  INVALID_ICON_PATH: (themeId: string): ThemeError => ({
    code: 'INVALID_ICON_PATH',
    message: `Invalid theme icon path for ${themeId}`,
    level: ErrorLevel.WARN,
    context: { themeId },
  }),

  /** Theme initialization failed */
  INIT_FAILED: (error: unknown): ThemeError => ({
    code: 'INIT_FAILED',
    message: 'Theme switcher initialization failed',
    level: ErrorLevel.ERROR,
    context: { error: error instanceof Error ? error.message : String(error) },
  }),

  /** Protocol-relative URL rejected for security */
  PROTOCOL_REJECTED: (): ThemeError => ({
    code: 'PROTOCOL_REJECTED',
    message: 'Protocol-relative base URL rejected for security',
    level: ErrorLevel.WARN,
  }),

  /** Insecure HTTP URL rejected */
  INSECURE_HTTP_REJECTED: (): ThemeError => ({
    code: 'INSECURE_HTTP_REJECTED',
    message: 'Insecure HTTP base URL rejected',
    level: ErrorLevel.WARN,
  }),

  /** Cross-origin URL rejected */
  CROSS_ORIGIN_REJECTED: (origin: string): ThemeError => ({
    code: 'CROSS_ORIGIN_REJECTED',
    message: `Cross-origin base URL rejected: ${origin}`,
    level: ErrorLevel.WARN,
    context: { origin },
  }),

  /** Invalid CSS path for theme */
  INVALID_CSS_PATH: (themeId: string): ThemeError => ({
    code: 'INVALID_CSS_PATH',
    message: `Invalid theme CSS path for ${themeId}`,
    level: ErrorLevel.WARN,
    context: { themeId },
  }),

  /** CSS failed to load */
  CSS_LOAD_FAILED: (themeId: string, error: unknown): ThemeError => ({
    code: 'CSS_LOAD_FAILED',
    message: `Theme CSS failed to load for ${themeId}`,
    level: ErrorLevel.WARN,
    context: {
      themeId,
      error: error instanceof Error ? error.message : String(error),
    },
  }),

  /** Storage unavailable (private browsing or disabled) */
  STORAGE_UNAVAILABLE: (operation: string, error: unknown): ThemeError => ({
    code: 'STORAGE_UNAVAILABLE',
    message: `localStorage ${operation} failed - storage may be unavailable`,
    level: ErrorLevel.WARN,
    context: {
      operation,
      error: error instanceof Error ? error.message : String(error),
    },
  }),
};

/**
 * Log a theme error to the console with consistent formatting.
 *
 * @param themeError - The structured error to log
 */
export function logThemeError(themeError: ThemeError): void {
  const prefixedMessage = `${LOG_PREFIX} ${themeError.message}`;

  if (themeError.level === ErrorLevel.ERROR) {
    if (themeError.context) {
      // Safe: prefixedMessage is constructed from controlled internal strings
      // nosemgrep: unsafe-formatstring
      console.error(prefixedMessage, themeError.context);
    } else {
      console.error(prefixedMessage);
    }
  } else {
    if (themeError.context) {
      // Safe: prefixedMessage is constructed from controlled internal strings
      // nosemgrep: unsafe-formatstring
      console.warn(prefixedMessage, themeError.context);
    } else {
      console.warn(prefixedMessage);
    }
  }
}

/**
 * Convenience function to log a ThemeError.
 *
 * @param error - The ThemeError instance to log
 */
export function logError<T extends ThemeError>(error: T): void {
  logThemeError(error);
}
