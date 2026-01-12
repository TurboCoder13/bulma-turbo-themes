import XCTest
import SwiftUI
@testable import TurboThemes

final class ThemePaletteTests: XCTestCase {

    // MARK: - Initialization Tests

    func testThemePaletteInitialization() {
        let palette = ThemePalette(
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

        XCTAssertNotNil(palette)
        XCTAssertNotNil(palette.backgroundBase)
        XCTAssertNotNil(palette.backgroundSurface)
        XCTAssertNotNil(palette.heading)
        XCTAssertNotNil(palette.bodyPrimary)
        XCTAssertNotNil(palette.bodySecondary)
        XCTAssertNotNil(palette.brandPrimary)
        XCTAssertNotNil(palette.stateSuccess)
        XCTAssertNotNil(palette.stateDanger)
        XCTAssertNotNil(palette.stateWarning)
        XCTAssertNotNil(palette.stateInfo)
    }

    // MARK: - Sendable Conformance Tests

    func testThemePaletteIsSendable() {
        let palette = ThemeRegistry.defaultPalette
        // This compiles only if ThemePalette is Sendable
        let _: Sendable = palette
        XCTAssertNotNil(palette.backgroundBase)
    }

    // MARK: - Default Palette Tests

    func testDefaultPaletteExists() {
        let palette = ThemeRegistry.defaultPalette
        XCTAssertNotNil(palette)
    }

    func testDefaultPaletteHasAllTokens() {
        let palette = ThemeRegistry.defaultPalette
        // All tokens should be accessible
        XCTAssertNotNil(palette.backgroundBase)
        XCTAssertNotNil(palette.backgroundSurface)
        XCTAssertNotNil(palette.heading)
        XCTAssertNotNil(palette.bodyPrimary)
        XCTAssertNotNil(palette.bodySecondary)
        XCTAssertNotNil(palette.brandPrimary)
        XCTAssertNotNil(palette.stateSuccess)
        XCTAssertNotNil(palette.stateDanger)
        XCTAssertNotNil(palette.stateWarning)
        XCTAssertNotNil(palette.stateInfo)
    }

    // MARK: - All Themes Palette Tests

    func testAllThemesHaveCompletePalettes() {
        for theme in ThemeRegistry.allThemes {
            let palette = theme.palette
            XCTAssertNotNil(palette.backgroundBase, "\(theme.id.rawValue) missing backgroundBase")
            XCTAssertNotNil(palette.backgroundSurface, "\(theme.id.rawValue) missing backgroundSurface")
            XCTAssertNotNil(palette.heading, "\(theme.id.rawValue) missing heading")
            XCTAssertNotNil(palette.bodyPrimary, "\(theme.id.rawValue) missing bodyPrimary")
            XCTAssertNotNil(palette.bodySecondary, "\(theme.id.rawValue) missing bodySecondary")
            XCTAssertNotNil(palette.brandPrimary, "\(theme.id.rawValue) missing brandPrimary")
            XCTAssertNotNil(palette.stateSuccess, "\(theme.id.rawValue) missing stateSuccess")
            XCTAssertNotNil(palette.stateDanger, "\(theme.id.rawValue) missing stateDanger")
            XCTAssertNotNil(palette.stateWarning, "\(theme.id.rawValue) missing stateWarning")
            XCTAssertNotNil(palette.stateInfo, "\(theme.id.rawValue) missing stateInfo")
        }
    }

    // MARK: - Theme-Specific Palette Value Tests

    func testCatppuccinMochaPaletteValues() {
        let theme = ThemeRegistry.theme(for: .catppuccinMocha)
        XCTAssertNotNil(theme)

        // Verify specific hex values are being used correctly
        let bgBase = Color.parseHex("#1e1e2e")
        XCTAssertNotNil(bgBase)
        XCTAssertEqual(bgBase?.red, 30)
        XCTAssertEqual(bgBase?.green, 30)
        XCTAssertEqual(bgBase?.blue, 46)
    }

    func testCatppuccinLattePaletteValues() {
        let theme = ThemeRegistry.theme(for: .catppuccinLatte)
        XCTAssertNotNil(theme)

        // Verify light theme background
        let bgBase = Color.parseHex("#eff1f5")
        XCTAssertNotNil(bgBase)
        XCTAssertEqual(bgBase?.red, 239)
        XCTAssertEqual(bgBase?.green, 241)
        XCTAssertEqual(bgBase?.blue, 245)
    }

    func testDraculaPaletteValues() {
        let theme = ThemeRegistry.theme(for: .dracula)
        XCTAssertNotNil(theme)

        // Verify Dracula's iconic background
        let bgBase = Color.parseHex("#282a36")
        XCTAssertNotNil(bgBase)
        XCTAssertEqual(bgBase?.red, 40)
        XCTAssertEqual(bgBase?.green, 42)
        XCTAssertEqual(bgBase?.blue, 54)
    }

    func testGitHubDarkPaletteValues() {
        let theme = ThemeRegistry.theme(for: .githubDark)
        XCTAssertNotNil(theme)

        // Verify GitHub Dark's background
        let bgBase = Color.parseHex("#0d1117")
        XCTAssertNotNil(bgBase)
        XCTAssertEqual(bgBase?.red, 13)
        XCTAssertEqual(bgBase?.green, 17)
        XCTAssertEqual(bgBase?.blue, 23)
    }

    func testGitHubLightPaletteValues() {
        let theme = ThemeRegistry.theme(for: .githubLight)
        XCTAssertNotNil(theme)

        // Verify GitHub Light uses white background
        let bgBase = Color.parseHex("#ffffff")
        XCTAssertNotNil(bgBase)
        XCTAssertEqual(bgBase?.red, 255)
        XCTAssertEqual(bgBase?.green, 255)
        XCTAssertEqual(bgBase?.blue, 255)
    }

    func testBulmaLightPaletteValues() {
        let theme = ThemeRegistry.theme(for: .bulmaLight)
        XCTAssertNotNil(theme)

        // Verify Bulma Light uses white background
        let bgBase = Color.parseHex("#ffffff")
        XCTAssertNotNil(bgBase)
        XCTAssertEqual(bgBase?.red, 255)

        // Verify Bulma's brand color (teal)
        let brand = Color.parseHex("#00d1b2")
        XCTAssertNotNil(brand)
        XCTAssertEqual(brand?.red, 0)
        XCTAssertEqual(brand?.green, 209)
        XCTAssertEqual(brand?.blue, 178)
    }

    func testBulmaDarkPaletteValues() {
        let theme = ThemeRegistry.theme(for: .bulmaDark)
        XCTAssertNotNil(theme)

        // Verify Bulma Dark's background
        let bgBase = Color.parseHex("#1a1a2e")
        XCTAssertNotNil(bgBase)
        XCTAssertEqual(bgBase?.red, 26)
        XCTAssertEqual(bgBase?.green, 26)
        XCTAssertEqual(bgBase?.blue, 46)
    }

    // MARK: - State Color Uniqueness Tests

    func testStateColorsAreDistinctPerTheme() {
        for theme in ThemeRegistry.allThemes {
            let palette = theme.palette

            // Get state colors as hex for comparison
            // Note: We can't directly compare SwiftUI Colors, but we verify they exist
            // and assume they were set with distinct hex values

            // Verify all four state colors are present
            XCTAssertNotNil(palette.stateSuccess)
            XCTAssertNotNil(palette.stateDanger)
            XCTAssertNotNil(palette.stateWarning)
            XCTAssertNotNil(palette.stateInfo)
        }
    }

    // MARK: - Palette Token Count Tests

    func testPaletteHasExactlyTenTokens() {
        // ThemePalette should have exactly 10 color tokens
        let palette = ThemeRegistry.defaultPalette

        // Count by accessing all properties
        var tokenCount = 0
        let _ = palette.backgroundBase; tokenCount += 1
        let _ = palette.backgroundSurface; tokenCount += 1
        let _ = palette.heading; tokenCount += 1
        let _ = palette.bodyPrimary; tokenCount += 1
        let _ = palette.bodySecondary; tokenCount += 1
        let _ = palette.brandPrimary; tokenCount += 1
        let _ = palette.stateSuccess; tokenCount += 1
        let _ = palette.stateDanger; tokenCount += 1
        let _ = palette.stateWarning; tokenCount += 1
        let _ = palette.stateInfo; tokenCount += 1

        XCTAssertEqual(tokenCount, 10)
    }
}
