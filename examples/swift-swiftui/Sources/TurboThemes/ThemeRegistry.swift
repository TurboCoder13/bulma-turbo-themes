import SwiftUI

// MARK: - Shared Gruvbox Palettes

/// Shared foreground colors for all Gruvbox dark variants (only backgrounds differ).
private let gruvboxDarkPalette = (
    heading: Color(hex: "#b8bb26"),
    bodyPrimary: Color(hex: "#ebdbb2"),
    bodySecondary: Color(hex: "#d5c4a1"),
    brandPrimary: Color(hex: "#d79921"),
    stateSuccess: Color(hex: "#b8bb26"),
    stateDanger: Color(hex: "#fb4934"),
    stateWarning: Color(hex: "#fabd2f"),
    stateInfo: Color(hex: "#83a598")
)

/// Shared foreground colors for all Gruvbox light variants (only backgrounds differ).
private let gruvboxLightPalette = (
    heading: Color(hex: "#79740e"),
    bodyPrimary: Color(hex: "#3c3836"),
    bodySecondary: Color(hex: "#504945"),
    brandPrimary: Color(hex: "#b57614"),
    stateSuccess: Color(hex: "#79740e"),
    stateDanger: Color(hex: "#9d0006"),
    stateWarning: Color(hex: "#b57614"),
    stateInfo: Color(hex: "#076678")
)

/// Registry of all available themes with their palettes.
public enum ThemeRegistry {
    /// Default palette used as fallback (Catppuccin Mocha).
    public static let defaultPalette = ThemePalette(
        backgroundBase: Color(hex: "#1e1e2e"),
        backgroundSurface: Color(hex: "#313244"),
        heading: Color(hex: "#f5e0dc"),
        bodyPrimary: Color(hex: "#cdd6f4"),
        bodySecondary: Color(hex: "#bac2de"),
        brandPrimary: Color(hex: "#cba6f7"),
        stateSuccess: Color(hex: "#a6e3a1"),
        stateDanger: Color(hex: "#f38ba8"),
        stateWarning: Color(hex: "#f9e2af"),
        stateInfo: Color(hex: "#89dceb")
    )

    /// All registered themes indexed by ThemeId.
    public static let themes: [ThemeId: ThemeDefinition] = [
        .catppuccinMocha: ThemeDefinition(
            id: .catppuccinMocha,
            label: "Catppuccin Mocha",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#1e1e2e"),
                backgroundSurface: Color(hex: "#313244"),
                heading: Color(hex: "#f5e0dc"),
                bodyPrimary: Color(hex: "#cdd6f4"),
                bodySecondary: Color(hex: "#bac2de"),
                brandPrimary: Color(hex: "#cba6f7"),
                stateSuccess: Color(hex: "#a6e3a1"),
                stateDanger: Color(hex: "#f38ba8"),
                stateWarning: Color(hex: "#f9e2af"),
                stateInfo: Color(hex: "#89dceb")
            )
        ),
        .catppuccinLatte: ThemeDefinition(
            id: .catppuccinLatte,
            label: "Catppuccin Latte",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#eff1f5"),
                backgroundSurface: Color(hex: "#e6e9ef"),
                heading: Color(hex: "#4c4f69"),
                bodyPrimary: Color(hex: "#5c5f77"),
                bodySecondary: Color(hex: "#6c6f85"),
                brandPrimary: Color(hex: "#8839ef"),
                stateSuccess: Color(hex: "#40a02b"),
                stateDanger: Color(hex: "#d20f39"),
                stateWarning: Color(hex: "#df8e1d"),
                stateInfo: Color(hex: "#209fb5")
            )
        ),
        .catppuccinFrappe: ThemeDefinition(
            id: .catppuccinFrappe,
            label: "Catppuccin Frappé",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#303446"),
                backgroundSurface: Color(hex: "#414559"),
                heading: Color(hex: "#f2d5cf"),
                bodyPrimary: Color(hex: "#c6d0f5"),
                bodySecondary: Color(hex: "#b5bfe2"),
                brandPrimary: Color(hex: "#ca9ee6"),
                stateSuccess: Color(hex: "#a6d189"),
                stateDanger: Color(hex: "#e78284"),
                stateWarning: Color(hex: "#e5c890"),
                stateInfo: Color(hex: "#99d1db")
            )
        ),
        .catppuccinMacchiato: ThemeDefinition(
            id: .catppuccinMacchiato,
            label: "Catppuccin Macchiato",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#24273a"),
                backgroundSurface: Color(hex: "#363a4f"),
                heading: Color(hex: "#f4dbd6"),
                bodyPrimary: Color(hex: "#cad3f5"),
                bodySecondary: Color(hex: "#b8c0e0"),
                brandPrimary: Color(hex: "#c6a0f6"),
                stateSuccess: Color(hex: "#a6da95"),
                stateDanger: Color(hex: "#ed8796"),
                stateWarning: Color(hex: "#eed49f"),
                stateInfo: Color(hex: "#91d7e3")
            )
        ),
        .dracula: ThemeDefinition(
            id: .dracula,
            label: "Dracula",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#282a36"),
                backgroundSurface: Color(hex: "#303347"),
                heading: Color(hex: "#f8f8f2"),
                bodyPrimary: Color(hex: "#f8f8f2"),
                bodySecondary: Color(hex: "#c5c8d4"),
                brandPrimary: Color(hex: "#bd93f9"),
                stateSuccess: Color(hex: "#50fa7b"),
                stateDanger: Color(hex: "#ff5555"),
                stateWarning: Color(hex: "#f1fa8c"),
                stateInfo: Color(hex: "#8be9fd")
            )
        ),
        .githubDark: ThemeDefinition(
            id: .githubDark,
            label: "GitHub Dark",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#0d1117"),
                backgroundSurface: Color(hex: "#161b22"),
                heading: Color(hex: "#e6edf3"),
                bodyPrimary: Color(hex: "#c9d1d9"),
                bodySecondary: Color(hex: "#8b949e"),
                brandPrimary: Color(hex: "#2f81f7"),
                stateSuccess: Color(hex: "#3fb950"),
                stateDanger: Color(hex: "#f85149"),
                stateWarning: Color(hex: "#d29922"),
                stateInfo: Color(hex: "#2f81f7")
            )
        ),
        .githubLight: ThemeDefinition(
            id: .githubLight,
            label: "GitHub Light",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#ffffff"),
                backgroundSurface: Color(hex: "#f6f8fa"),
                heading: Color(hex: "#1f2328"),
                bodyPrimary: Color(hex: "#24292f"),
                bodySecondary: Color(hex: "#57606a"),
                brandPrimary: Color(hex: "#0969da"),
                stateSuccess: Color(hex: "#1f883d"),
                stateDanger: Color(hex: "#cf222e"),
                stateWarning: Color(hex: "#9a6700"),
                stateInfo: Color(hex: "#0969da")
            )
        ),
        .bulmaLight: ThemeDefinition(
            id: .bulmaLight,
            label: "Bulma Light",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#ffffff"),
                backgroundSurface: Color(hex: "#f5f5f5"),
                heading: Color(hex: "#242424"),
                bodyPrimary: Color(hex: "#363636"),
                bodySecondary: Color(hex: "#4a4a4a"),
                brandPrimary: Color(hex: "#00d1b2"),
                stateSuccess: Color(hex: "#22c55e"),
                stateDanger: Color(hex: "#ef4444"),
                stateWarning: Color(hex: "#f59e0b"),
                stateInfo: Color(hex: "#3b82f6")
            )
        ),
        .bulmaDark: ThemeDefinition(
            id: .bulmaDark,
            label: "Bulma Dark",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#1a1a2e"),
                backgroundSurface: Color(hex: "#252540"),
                heading: Color(hex: "#f5f5f5"),
                bodyPrimary: Color(hex: "#e5e7eb"),
                bodySecondary: Color(hex: "#cbd5e1"),
                brandPrimary: Color(hex: "#00d1b2"),
                stateSuccess: Color(hex: "#22c55e"),
                stateDanger: Color(hex: "#ef4444"),
                stateWarning: Color(hex: "#f59e0b"),
                stateInfo: Color(hex: "#3b82f6")
            )
        ),
        .gruvboxDarkHard: ThemeDefinition(
            id: .gruvboxDarkHard,
            label: "Gruvbox Dark Hard",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#1d2021"),
                backgroundSurface: Color(hex: "#282828"),
                heading: gruvboxDarkPalette.heading,
                bodyPrimary: gruvboxDarkPalette.bodyPrimary,
                bodySecondary: gruvboxDarkPalette.bodySecondary,
                brandPrimary: gruvboxDarkPalette.brandPrimary,
                stateSuccess: gruvboxDarkPalette.stateSuccess,
                stateDanger: gruvboxDarkPalette.stateDanger,
                stateWarning: gruvboxDarkPalette.stateWarning,
                stateInfo: gruvboxDarkPalette.stateInfo
            )
        ),
        .gruvboxDark: ThemeDefinition(
            id: .gruvboxDark,
            label: "Gruvbox Dark",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#282828"),
                backgroundSurface: Color(hex: "#3c3836"),
                heading: gruvboxDarkPalette.heading,
                bodyPrimary: gruvboxDarkPalette.bodyPrimary,
                bodySecondary: gruvboxDarkPalette.bodySecondary,
                brandPrimary: gruvboxDarkPalette.brandPrimary,
                stateSuccess: gruvboxDarkPalette.stateSuccess,
                stateDanger: gruvboxDarkPalette.stateDanger,
                stateWarning: gruvboxDarkPalette.stateWarning,
                stateInfo: gruvboxDarkPalette.stateInfo
            )
        ),
        .gruvboxDarkSoft: ThemeDefinition(
            id: .gruvboxDarkSoft,
            label: "Gruvbox Dark Soft",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#32302f"),
                backgroundSurface: Color(hex: "#3c3836"),
                heading: gruvboxDarkPalette.heading,
                bodyPrimary: gruvboxDarkPalette.bodyPrimary,
                bodySecondary: gruvboxDarkPalette.bodySecondary,
                brandPrimary: gruvboxDarkPalette.brandPrimary,
                stateSuccess: gruvboxDarkPalette.stateSuccess,
                stateDanger: gruvboxDarkPalette.stateDanger,
                stateWarning: gruvboxDarkPalette.stateWarning,
                stateInfo: gruvboxDarkPalette.stateInfo
            )
        ),
        .gruvboxLightHard: ThemeDefinition(
            id: .gruvboxLightHard,
            label: "Gruvbox Light Hard",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#f9f5d7"),
                backgroundSurface: Color(hex: "#fbf1c7"),
                heading: gruvboxLightPalette.heading,
                bodyPrimary: gruvboxLightPalette.bodyPrimary,
                bodySecondary: gruvboxLightPalette.bodySecondary,
                brandPrimary: gruvboxLightPalette.brandPrimary,
                stateSuccess: gruvboxLightPalette.stateSuccess,
                stateDanger: gruvboxLightPalette.stateDanger,
                stateWarning: gruvboxLightPalette.stateWarning,
                stateInfo: gruvboxLightPalette.stateInfo
            )
        ),
        .gruvboxLight: ThemeDefinition(
            id: .gruvboxLight,
            label: "Gruvbox Light",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#fbf1c7"),
                backgroundSurface: Color(hex: "#ebdbb2"),
                heading: gruvboxLightPalette.heading,
                bodyPrimary: gruvboxLightPalette.bodyPrimary,
                bodySecondary: gruvboxLightPalette.bodySecondary,
                brandPrimary: gruvboxLightPalette.brandPrimary,
                stateSuccess: gruvboxLightPalette.stateSuccess,
                stateDanger: gruvboxLightPalette.stateDanger,
                stateWarning: gruvboxLightPalette.stateWarning,
                stateInfo: gruvboxLightPalette.stateInfo
            )
        ),
        .gruvboxLightSoft: ThemeDefinition(
            id: .gruvboxLightSoft,
            label: "Gruvbox Light Soft",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#f2e5bc"),
                backgroundSurface: Color(hex: "#ebdbb2"),
                heading: gruvboxLightPalette.heading,
                bodyPrimary: gruvboxLightPalette.bodyPrimary,
                bodySecondary: gruvboxLightPalette.bodySecondary,
                brandPrimary: gruvboxLightPalette.brandPrimary,
                stateSuccess: gruvboxLightPalette.stateSuccess,
                stateDanger: gruvboxLightPalette.stateDanger,
                stateWarning: gruvboxLightPalette.stateWarning,
                stateInfo: gruvboxLightPalette.stateInfo
            )
        ),
        .nord: ThemeDefinition(
            id: .nord,
            label: "Nord",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#2e3440"),
                backgroundSurface: Color(hex: "#3b4252"),
                heading: Color(hex: "#88c0d0"),
                bodyPrimary: Color(hex: "#eceff4"),
                bodySecondary: Color(hex: "#d8dee9"),
                brandPrimary: Color(hex: "#88c0d0"),
                stateSuccess: Color(hex: "#a3be8c"),
                stateDanger: Color(hex: "#bf616a"),
                stateWarning: Color(hex: "#ebcb8b"),
                stateInfo: Color(hex: "#81a1c1")
            )
        ),
        .solarizedDark: ThemeDefinition(
            id: .solarizedDark,
            label: "Solarized Dark",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#002b36"),
                backgroundSurface: Color(hex: "#073642"),
                heading: Color(hex: "#268bd2"),
                bodyPrimary: Color(hex: "#839496"),
                bodySecondary: Color(hex: "#657b83"),
                brandPrimary: Color(hex: "#268bd2"),
                stateSuccess: Color(hex: "#859900"),
                stateDanger: Color(hex: "#dc322f"),
                stateWarning: Color(hex: "#b58900"),
                stateInfo: Color(hex: "#2aa198")
            )
        ),
        .solarizedLight: ThemeDefinition(
            id: .solarizedLight,
            label: "Solarized Light",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#fdf6e3"),
                backgroundSurface: Color(hex: "#eee8d5"),
                heading: Color(hex: "#268bd2"),
                bodyPrimary: Color(hex: "#657b83"),
                bodySecondary: Color(hex: "#839496"),
                brandPrimary: Color(hex: "#268bd2"),
                stateSuccess: Color(hex: "#859900"),
                stateDanger: Color(hex: "#dc322f"),
                stateWarning: Color(hex: "#b58900"),
                stateInfo: Color(hex: "#2aa198")
            )
        ),
        .rosePine: ThemeDefinition(
            id: .rosePine,
            label: "Rosé Pine",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#191724"),
                backgroundSurface: Color(hex: "#1f1d2e"),
                heading: Color(hex: "#e0def4"),
                bodyPrimary: Color(hex: "#e0def4"),
                bodySecondary: Color(hex: "#908caa"),
                brandPrimary: Color(hex: "#c4a7e7"),
                stateSuccess: Color(hex: "#31748f"),
                stateDanger: Color(hex: "#eb6f92"),
                stateWarning: Color(hex: "#f6c177"),
                stateInfo: Color(hex: "#9ccfd8")
            )
        ),
        .rosePineMoon: ThemeDefinition(
            id: .rosePineMoon,
            label: "Rosé Pine Moon",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#232136"),
                backgroundSurface: Color(hex: "#2a273f"),
                heading: Color(hex: "#e0def4"),
                bodyPrimary: Color(hex: "#e0def4"),
                bodySecondary: Color(hex: "#908caa"),
                brandPrimary: Color(hex: "#c4a7e7"),
                stateSuccess: Color(hex: "#3e8fb0"),
                stateDanger: Color(hex: "#eb6f92"),
                stateWarning: Color(hex: "#f6c177"),
                stateInfo: Color(hex: "#9ccfd8")
            )
        ),
        .rosePineDawn: ThemeDefinition(
            id: .rosePineDawn,
            label: "Rosé Pine Dawn",
            palette: ThemePalette(
                backgroundBase: Color(hex: "#faf4ed"),
                backgroundSurface: Color(hex: "#fffaf3"),
                heading: Color(hex: "#575279"),
                bodyPrimary: Color(hex: "#575279"),
                bodySecondary: Color(hex: "#797593"),
                brandPrimary: Color(hex: "#907aa9"),
                stateSuccess: Color(hex: "#56949f"),
                stateDanger: Color(hex: "#b4637a"),
                stateWarning: Color(hex: "#ea9d34"),
                stateInfo: Color(hex: "#d7827e")
            )
        ),
    ]

    /// Get a theme by its ID.
    ///
    /// - Parameter id: The theme identifier.
    /// - Returns: The theme definition, or nil if not found.
    public static func theme(for id: ThemeId) -> ThemeDefinition? {
        themes[id]
    }

    /// Get all available theme IDs.
    public static var allThemeIds: [ThemeId] {
        ThemeId.allCases
    }

    /// Get all registered themes.
    public static var allThemes: [ThemeDefinition] {
        ThemeId.allCases.compactMap { themes[$0] }
    }
}
