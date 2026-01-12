// SPDX-License-Identifier: MIT
// Auto-generated from dist/tokens.json
// Do not edit manually - regenerate with: bun run generate:swift

import Foundation

/// Loads and provides access to theme definitions from bundled JSON.
public enum ThemeLoader {
    /// All available theme IDs.
    public static let themeIds: [String] = [
        "bulma-dark",
        "bulma-light",
        "catppuccin-frappe",
        "catppuccin-latte",
        "catppuccin-macchiato",
        "catppuccin-mocha",
        "dracula",
        "github-dark",
        "github-light"
    ]

    /// Cached loaded themes.
    private static var _themes: TurboThemes?

    /// Load all themes from bundled JSON resource.
    public static func loadThemes() throws -> TurboThemes {
        if let cached = _themes {
            return cached
        }

        guard let url = Bundle.module.url(forResource: "tokens", withExtension: "json") else {
            throw ThemeLoaderError.resourceNotFound
        }

        let data = try Data(contentsOf: url)
        let themes = try TurboThemes(data: data)
        _themes = themes
        return themes
    }

    /// Get a specific theme by ID.
    public static func getTheme(_ id: String) throws -> ThemeValue? {
        let themes = try loadThemes()
        return themes.themes[id]
    }

    /// Get all themes as a dictionary.
    public static func getAllThemes() throws -> [String: ThemeValue] {
        return try loadThemes().themes
    }
}

/// Errors that can occur when loading themes.
public enum ThemeLoaderError: Error, LocalizedError {
    case resourceNotFound

    public var errorDescription: String? {
        switch self {
        case .resourceNotFound:
            return "tokens.json resource not found in bundle"
        }
    }
}
