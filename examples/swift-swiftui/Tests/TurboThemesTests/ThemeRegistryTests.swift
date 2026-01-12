import XCTest
@testable import TurboThemes

final class ThemeRegistryTests: XCTestCase {

    // MARK: - Theme Count Tests

    func testAllThemeIdsMatchesCaseIterable() {
        XCTAssertEqual(ThemeRegistry.allThemeIds.count, ThemeId.allCases.count)
    }

    func testAllThemesAreRegistered() {
        // Every ThemeId should have a corresponding theme in the registry
        for themeId in ThemeId.allCases {
            XCTAssertNotNil(
                ThemeRegistry.themes[themeId],
                "Theme \(themeId.rawValue) is not registered"
            )
        }
    }

    func testExpectedThemeCount() {
        // We expect 9 themes based on the ThemeId enum
        XCTAssertEqual(ThemeId.allCases.count, 9)
        XCTAssertEqual(ThemeRegistry.allThemes.count, 9)
    }

    // MARK: - Theme Lookup Tests

    func testThemeForValidId() {
        let theme = ThemeRegistry.theme(for: .catppuccinMocha)
        XCTAssertNotNil(theme)
        XCTAssertEqual(theme?.id, .catppuccinMocha)
        XCTAssertEqual(theme?.label, "Catppuccin Mocha")
    }

    func testThemeLookupForAllIds() {
        for themeId in ThemeId.allCases {
            let theme = ThemeRegistry.theme(for: themeId)
            XCTAssertNotNil(theme, "Failed to lookup theme for \(themeId.rawValue)")
            XCTAssertEqual(theme?.id, themeId)
        }
    }

    // MARK: - Theme Label Tests

    func testThemeLabelsAreNotEmpty() {
        for theme in ThemeRegistry.allThemes {
            XCTAssertFalse(theme.label.isEmpty, "Theme \(theme.id.rawValue) has empty label")
        }
    }

    func testExpectedThemeLabels() {
        let expectedLabels: [ThemeId: String] = [
            .catppuccinMocha: "Catppuccin Mocha",
            .catppuccinLatte: "Catppuccin Latte",
            .catppuccinFrappe: "Catppuccin Frappé",
            .catppuccinMacchiato: "Catppuccin Macchiato",
            .dracula: "Dracula",
            .githubDark: "GitHub Dark",
            .githubLight: "GitHub Light",
            .bulmaLight: "Bulma Light",
            .bulmaDark: "Bulma Dark",
        ]

        for (themeId, expectedLabel) in expectedLabels {
            let theme = ThemeRegistry.theme(for: themeId)
            XCTAssertEqual(theme?.label, expectedLabel, "Label mismatch for \(themeId.rawValue)")
        }
    }

    // MARK: - Theme ID Raw Value Tests

    func testThemeIdRawValues() {
        XCTAssertEqual(ThemeId.catppuccinMocha.rawValue, "catppuccin-mocha")
        XCTAssertEqual(ThemeId.catppuccinLatte.rawValue, "catppuccin-latte")
        XCTAssertEqual(ThemeId.dracula.rawValue, "dracula")
        XCTAssertEqual(ThemeId.githubDark.rawValue, "github-dark")
        XCTAssertEqual(ThemeId.githubLight.rawValue, "github-light")
        XCTAssertEqual(ThemeId.bulmaLight.rawValue, "bulma-light")
        XCTAssertEqual(ThemeId.bulmaDark.rawValue, "bulma-dark")
    }

    // MARK: - Default Palette Tests

    func testDefaultPaletteExists() {
        let palette = ThemeRegistry.defaultPalette
        XCTAssertNotNil(palette)
    }

    // MARK: - Palette Token Tests

    func testAllThemesHaveValidPalettes() {
        for theme in ThemeRegistry.allThemes {
            // Each theme should have all required palette tokens
            // We can't easily compare Colors, but we verify they exist
            let palette = theme.palette
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
    }
}
