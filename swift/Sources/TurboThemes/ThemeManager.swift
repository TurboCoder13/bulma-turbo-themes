// SPDX-License-Identifier: MIT
import SwiftUI

/// Manages the current theme state and provides theme switching functionality.
@Observable
public final class ThemeManager {
    /// The currently active theme.
    public private(set) var currentTheme: ThemeValue

    /// The appearance (light/dark) of the current theme.
    public var appearance: Appearance { currentTheme.appearance }

    /// All available themes.
    public let availableThemes: [String: ThemeValue]

    /// Ordered list of available themes.
    public let orderedThemes: [ThemeValue]

    /// Initialize with a default theme ID.
    /// - Parameter defaultThemeId: Theme ID to use initially (default: "catppuccin-mocha")
    public init(defaultThemeId: String = "catppuccin-mocha") {
        do {
            let themes = try ThemeLoader.getAllThemes()
            self.availableThemes = themes
            self.orderedThemes = ThemeLoader.themeIds.compactMap { themes[$0] }
            self.currentTheme = themes[defaultThemeId] ?? orderedThemes.first!
        } catch {
            fatalError("Failed to load themes: \(error)")
        }
    }

    /// Set the current theme by ID.
    /// - Parameter id: Theme ID to activate
    public func setTheme(_ id: String) {
        if let theme = availableThemes[id] {
            currentTheme = theme
        }
    }

    /// Toggle between light and dark themes.
    /// - Parameters:
    ///   - lightId: Optional preferred light theme ID
    ///   - darkId: Optional preferred dark theme ID
    public func toggleAppearance(light lightId: String? = nil, dark darkId: String? = nil) {
        switch currentTheme.appearance {
        case .light:
            if let darkId = darkId ?? orderedThemes.first(where: { $0.appearance == .dark })?.id {
                setTheme(darkId)
            }
        case .dark:
            if let lightId = lightId ?? orderedThemes.first(where: { $0.appearance == .light })?.id {
                setTheme(lightId)
            }
        }
    }

    /// Get all themes matching an appearance.
    /// - Parameter appearance: The appearance to filter by
    /// - Returns: Array of themes matching the appearance
    public func themes(byAppearance appearance: Appearance) -> [ThemeValue] {
        orderedThemes.filter { $0.appearance == appearance }
    }

    /// Get all themes from a specific vendor.
    /// - Parameter vendor: The vendor name to filter by
    /// - Returns: Array of themes from the vendor
    public func themes(byVendor vendor: String) -> [ThemeValue] {
        orderedThemes.filter { $0.vendor == vendor }
    }
}
