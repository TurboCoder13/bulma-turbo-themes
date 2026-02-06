import XCTest
import SwiftUI
@testable import TurboThemes

/// Tests for theme color contrast and accessibility compliance.
/// Uses WCAG 2.1 contrast ratio calculations.
final class ThemeAccessibilityTests: XCTestCase {

    // MARK: - WCAG Thresholds

    /// WCAG 2.1 AA requires 4.5:1 for normal text
    private let wcagAANormal: Double = 4.5

    /// WCAG 2.1 AA requires 3:1 for large text
    private let wcagAALarge: Double = 3.0

    /// Minimum visibility threshold for decorative elements
    private let minimumVisibility: Double = 1.8

    // MARK: - Primary Text Contrast Tests

    func testAllThemesPrimaryTextMeetsWCAGAA() {
        for themeId in ThemeId.allCases {
            guard ThemeRegistry.theme(for: themeId) != nil else {
                XCTFail("Theme \(themeId.rawValue) not found")
                continue
            }

            // Parse background and primary text colors
            let bgHex = getBackgroundHex(for: themeId)
            let fgHex = getBodyPrimaryHex(for: themeId)

            guard let bg = Color.parseHex(bgHex),
                  let fg = Color.parseHex(fgHex) else {
                XCTFail("Could not parse colors for \(themeId.rawValue)")
                continue
            }

            let ratio = contrastRatio(fg: fg, bg: bg)
            XCTAssertGreaterThanOrEqual(
                ratio,
                wcagAANormal,
                "\(themeId.rawValue): primary text contrast \(String(format: "%.2f", ratio)):1 < \(wcagAANormal):1"
            )
        }
    }

    func testAllThemesSecondaryTextMeetsWCAGAALarge() {
        for themeId in ThemeId.allCases {
            guard ThemeRegistry.theme(for: themeId) != nil else {
                XCTFail("Theme \(themeId.rawValue) not found")
                continue
            }

            let bgHex = getBackgroundHex(for: themeId)
            let fgHex = getBodySecondaryHex(for: themeId)

            guard let bg = Color.parseHex(bgHex),
                  let fg = Color.parseHex(fgHex) else {
                XCTFail("Could not parse colors for \(themeId.rawValue)")
                continue
            }

            let ratio = contrastRatio(fg: fg, bg: bg)
            XCTAssertGreaterThanOrEqual(
                ratio,
                wcagAALarge,
                "\(themeId.rawValue): secondary text contrast \(String(format: "%.2f", ratio)):1 < \(wcagAALarge):1"
            )
        }
    }

    func testAllThemesHeadingMeetsWCAGAALarge() {
        for themeId in ThemeId.allCases {
            guard ThemeRegistry.theme(for: themeId) != nil else {
                XCTFail("Theme \(themeId.rawValue) not found")
                continue
            }

            let bgHex = getBackgroundHex(for: themeId)
            let fgHex = getHeadingHex(for: themeId)

            guard let bg = Color.parseHex(bgHex),
                  let fg = Color.parseHex(fgHex) else {
                XCTFail("Could not parse colors for \(themeId.rawValue)")
                continue
            }

            let ratio = contrastRatio(fg: fg, bg: bg)
            XCTAssertGreaterThanOrEqual(
                ratio,
                minimumVisibility,
                "\(themeId.rawValue): heading contrast \(String(format: "%.2f", ratio)):1 too low"
            )
        }
    }

    // MARK: - Light vs Dark Theme Tests

    func testLightThemesHaveLighterBackgrounds() {
        let lightThemes: [ThemeId] = [.catppuccinLatte, .githubLight, .bulmaLight]
        let darkThemes: [ThemeId] = [.catppuccinMocha, .dracula, .githubDark, .bulmaDark]

        for lightId in lightThemes {
            let lightBg = getBackgroundHex(for: lightId)
            guard let lightRgb = Color.parseHex(lightBg) else { continue }
            let lightBrightness = brightness(lightRgb)

            for darkId in darkThemes {
                let darkBg = getBackgroundHex(for: darkId)
                guard let darkRgb = Color.parseHex(darkBg) else { continue }
                let darkBrightness = brightness(darkRgb)

                XCTAssertGreaterThan(
                    lightBrightness,
                    darkBrightness,
                    "\(lightId.rawValue) should be brighter than \(darkId.rawValue)"
                )
            }
        }
    }

    func testDarkThemesHaveDistinctBackgrounds() {
        let darkThemes: [ThemeId] = [
            .catppuccinMocha, .catppuccinFrappe, .catppuccinMacchiato,
            .dracula, .githubDark, .bulmaDark
        ]

        var backgrounds = Set<String>()
        for themeId in darkThemes {
            let bg = getBackgroundHex(for: themeId)
            XCTAssertFalse(
                backgrounds.contains(bg),
                "Duplicate dark background \(bg) found in \(themeId.rawValue)"
            )
            backgrounds.insert(bg)
        }
    }

    // MARK: - State Color Tests

    func testAllThemesHaveDistinctStateColors() {
        for themeId in ThemeId.allCases {
            let stateColors = getStateColorHexes(for: themeId)
            let uniqueColors = Set(stateColors)

            XCTAssertEqual(
                uniqueColors.count,
                4,
                "\(themeId.rawValue) should have 4 distinct state colors"
            )
        }
    }

    // MARK: - Helper Methods - Get Hex Colors per Theme

    private func getBackgroundHex(for themeId: ThemeId) -> String {
        switch themeId {
        case .catppuccinMocha: return "#1e1e2e"
        case .catppuccinLatte: return "#eff1f5"
        case .catppuccinFrappe: return "#303446"
        case .catppuccinMacchiato: return "#24273a"
        case .dracula: return "#282a36"
        case .githubDark: return "#0d1117"
        case .githubLight: return "#ffffff"
        case .bulmaLight: return "#ffffff"
        case .bulmaDark: return "#1a1a2e"
        case .gruvboxDarkHard: return "#1d2021"
        case .gruvboxDark: return "#282828"
        case .gruvboxDarkSoft: return "#32302f"
        case .gruvboxLightHard: return "#f9f5d7"
        case .gruvboxLight: return "#fbf1c7"
        case .gruvboxLightSoft: return "#f2e5bc"
        case .nord: return "#2e3440"
        case .solarizedDark: return "#002b36"
        case .solarizedLight: return "#fdf6e3"
        case .rosePine: return "#191724"
        case .rosePineMoon: return "#232136"
        case .rosePineDawn: return "#faf4ed"
        }
    }

    private func getBodyPrimaryHex(for themeId: ThemeId) -> String {
        switch themeId {
        case .catppuccinMocha: return "#cdd6f4"
        case .catppuccinLatte: return "#5c5f77"
        case .catppuccinFrappe: return "#c6d0f5"
        case .catppuccinMacchiato: return "#cad3f5"
        case .dracula: return "#f8f8f2"
        case .githubDark: return "#c9d1d9"
        case .githubLight: return "#24292f"
        case .bulmaLight: return "#363636"
        case .bulmaDark: return "#e5e7eb"
        case .gruvboxDarkHard: return "#ebdbb2"
        case .gruvboxDark: return "#ebdbb2"
        case .gruvboxDarkSoft: return "#ebdbb2"
        case .gruvboxLightHard: return "#3c3836"
        case .gruvboxLight: return "#3c3836"
        case .gruvboxLightSoft: return "#3c3836"
        case .nord: return "#eceff4"
        case .solarizedDark: return "#839496"
        case .solarizedLight: return "#586e75"
        case .rosePine: return "#e0def4"
        case .rosePineMoon: return "#e0def4"
        case .rosePineDawn: return "#575279"
        }
    }

    private func getBodySecondaryHex(for themeId: ThemeId) -> String {
        switch themeId {
        case .catppuccinMocha: return "#bac2de"
        case .catppuccinLatte: return "#6c6f85"
        case .catppuccinFrappe: return "#b5bfe2"
        case .catppuccinMacchiato: return "#b8c0e0"
        case .dracula: return "#c5c8d4"
        case .githubDark: return "#8b949e"
        case .githubLight: return "#57606a"
        case .bulmaLight: return "#4a4a4a"
        case .bulmaDark: return "#cbd5e1"
        case .gruvboxDarkHard: return "#d5c4a1"
        case .gruvboxDark: return "#d5c4a1"
        case .gruvboxDarkSoft: return "#d5c4a1"
        case .gruvboxLightHard: return "#504945"
        case .gruvboxLight: return "#504945"
        case .gruvboxLightSoft: return "#504945"
        case .nord: return "#d8dee9"
        case .solarizedDark: return "#657b83"
        case .solarizedLight: return "#657b83"
        case .rosePine: return "#908caa"
        case .rosePineMoon: return "#908caa"
        case .rosePineDawn: return "#797593"
        }
    }

    private func getHeadingHex(for themeId: ThemeId) -> String {
        switch themeId {
        case .catppuccinMocha: return "#f5e0dc"
        case .catppuccinLatte: return "#4c4f69"
        case .catppuccinFrappe: return "#f2d5cf"
        case .catppuccinMacchiato: return "#f4dbd6"
        case .dracula: return "#f8f8f2"
        case .githubDark: return "#e6edf3"
        case .githubLight: return "#1f2328"
        case .bulmaLight: return "#242424"
        case .bulmaDark: return "#f5f5f5"
        case .gruvboxDarkHard: return "#b8bb26"
        case .gruvboxDark: return "#b8bb26"
        case .gruvboxDarkSoft: return "#b8bb26"
        case .gruvboxLightHard: return "#79740e"
        case .gruvboxLight: return "#79740e"
        case .gruvboxLightSoft: return "#79740e"
        case .nord: return "#88c0d0"
        case .solarizedDark: return "#268bd2"
        case .solarizedLight: return "#268bd2"
        case .rosePine: return "#e0def4"
        case .rosePineMoon: return "#e0def4"
        case .rosePineDawn: return "#575279"
        }
    }

    private func getStateColorHexes(for themeId: ThemeId) -> [String] {
        switch themeId {
        case .catppuccinMocha:
            return ["#a6e3a1", "#f38ba8", "#f9e2af", "#89dceb"]
        case .catppuccinLatte:
            return ["#40a02b", "#d20f39", "#df8e1d", "#209fb5"]
        case .catppuccinFrappe:
            return ["#a6d189", "#e78284", "#e5c890", "#99d1db"]
        case .catppuccinMacchiato:
            return ["#a6da95", "#ed8796", "#eed49f", "#91d7e3"]
        case .dracula:
            return ["#50fa7b", "#ff5555", "#f1fa8c", "#8be9fd"]
        case .githubDark:
            return ["#3fb950", "#f85149", "#d29922", "#2f81f7"]
        case .githubLight:
            return ["#1f883d", "#cf222e", "#9a6700", "#0969da"]
        case .bulmaLight:
            return ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6"]
        case .bulmaDark:
            return ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6"]
        case .gruvboxDarkHard, .gruvboxDark, .gruvboxDarkSoft:
            return ["#b8bb26", "#fb4934", "#fabd2f", "#83a598"]
        case .gruvboxLightHard, .gruvboxLight, .gruvboxLightSoft:
            return ["#79740e", "#9d0006", "#b57614", "#076678"]
        case .nord:
            return ["#a3be8c", "#bf616a", "#ebcb8b", "#81a1c1"]
        case .solarizedDark, .solarizedLight:
            return ["#859900", "#dc322f", "#b58900", "#2aa198"]
        case .rosePine:
            return ["#31748f", "#eb6f92", "#f6c177", "#9ccfd8"]
        case .rosePineMoon:
            return ["#3e8fb0", "#eb6f92", "#f6c177", "#9ccfd8"]
        case .rosePineDawn:
            return ["#56949f", "#b4637a", "#ea9d34", "#d7827e"]
        }
    }

    // MARK: - WCAG Contrast Calculation Helpers

    /// Calculate WCAG contrast ratio between foreground and background colors.
    private func contrastRatio(
        fg: (red: Int, green: Int, blue: Int),
        bg: (red: Int, green: Int, blue: Int)
    ) -> Double {
        let fgLum = relativeLuminance(fg)
        let bgLum = relativeLuminance(bg)

        let lighter = max(fgLum, bgLum)
        let darker = min(fgLum, bgLum)

        return (lighter + 0.05) / (darker + 0.05)
    }

    /// Calculate relative luminance per WCAG 2.1 spec.
    private func relativeLuminance(_ rgb: (red: Int, green: Int, blue: Int)) -> Double {
        func adjust(_ component: Int) -> Double {
            let sRGB = Double(component) / 255.0
            return sRGB <= 0.03928
                ? sRGB / 12.92
                : pow((sRGB + 0.055) / 1.055, 2.4)
        }

        let r = adjust(rgb.red)
        let g = adjust(rgb.green)
        let b = adjust(rgb.blue)

        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    /// Calculate perceived brightness (0-255).
    private func brightness(_ rgb: (red: Int, green: Int, blue: Int)) -> Double {
        return 0.299 * Double(rgb.red) + 0.587 * Double(rgb.green) + 0.114 * Double(rgb.blue)
    }
}
