import SwiftUI
import Combine

/// Observable theme manager for SwiftUI applications.
///
/// Use this class to manage the current theme and observe theme changes.
///
/// ```swift
/// @StateObject private var themeManager = ThemeManager()
///
/// var body: some View {
///     Text("Hello")
///         .foregroundColor(themeManager.theme.palette.bodyPrimary)
/// }
/// ```
@MainActor
public final class ThemeManager: ObservableObject {
    /// The currently selected theme ID.
    @Published public var currentThemeId: ThemeId

    /// Initialize the theme manager with an optional default theme.
    ///
    /// - Parameter defaultTheme: The initial theme to use. Defaults to `.catppuccinMocha`.
    public init(defaultTheme: ThemeId = .catppuccinMocha) {
        self.currentThemeId = defaultTheme
    }

    /// The current theme definition.
    public var theme: ThemeDefinition {
        ThemeRegistry.themes[currentThemeId] ?? ThemeDefinition(
            id: .catppuccinMocha,
            label: "Catppuccin Mocha",
            palette: ThemeRegistry.defaultPalette
        )
    }

    /// The current theme's color palette.
    public var palette: ThemePalette {
        theme.palette
    }

    /// Set the current theme.
    ///
    /// - Parameter id: The theme identifier to switch to.
    public func setTheme(_ id: ThemeId) {
        currentThemeId = id
    }

    /// Cycle to the next theme in the list.
    ///
    /// - Returns: The new theme ID after cycling.
    @discardableResult
    public func cycleTheme() -> ThemeId {
        let allThemes = ThemeId.allCases
        guard let currentIndex = allThemes.firstIndex(of: currentThemeId) else {
            currentThemeId = allThemes.first ?? .catppuccinMocha
            return currentThemeId
        }

        let nextIndex = (currentIndex + 1) % allThemes.count
        currentThemeId = allThemes[nextIndex]
        return currentThemeId
    }

    /// Get all available themes.
    public var availableThemes: [ThemeDefinition] {
        ThemeRegistry.allThemes
    }
}
