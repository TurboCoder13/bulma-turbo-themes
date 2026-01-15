/**
 * Color utility functions for E2E tests.
 * Conversion utilities for different color formats.
 */

/**
 * Converts a color string (rgba/hsla/hex8) to an opaque version.
 * Falls back to the original color if conversion fails.
 *
 * @param color - Color string in rgba, hsla, or hex8 format
 * @returns Opaque color string
 */
export function toOpaqueColor(color: string): string {
  try {
    // Handle rgba colors: rgba(r, g, b, a) -> rgb(r, g, b)
    const rgbaMatch = color.match(
      /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)$/i
    );
    if (rgbaMatch) {
      return `rgb(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]})`;
    }

    // Handle hsla colors: hsla(h, s%, l%, a) -> hsl(h, s%, l%)
    const hslaMatch = color.match(
      /^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%(?:\s*,\s*[\d.]+)?\s*\)$/i
    );
    if (hslaMatch) {
      return `hsl(${hslaMatch[1]}, ${hslaMatch[2]}%, ${hslaMatch[3]}%)`;
    }

    // Handle 8-digit hex colors: #RRGGBBAA -> #RRGGBB
    const hex8Match = color.match(/^#([0-9a-f]{8})$/i);
    if (hex8Match) {
      return `#${hex8Match[1].slice(0, 6)}`;
    }

    // Handle 4-digit hex colors: #RGBA -> #RRGGBB
    const hex4Match = color.match(/^#([0-9a-f]{4})$/i);
    if (hex4Match) {
      const r = hex4Match[1][0];
      const g = hex4Match[1][1];
      const b = hex4Match[1][2];
      return `#${r}${r}${g}${g}${b}${b}`;
    }
  } catch {
    // Fall through to return original color
  }

  // Fallback: return original color if conversion fails
  return color;
}
