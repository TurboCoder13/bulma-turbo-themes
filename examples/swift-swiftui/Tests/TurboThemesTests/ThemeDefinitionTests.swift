import XCTest
import SwiftUI
@testable import TurboThemes

final class ThemeDefinitionTests: XCTestCase {

    // MARK: - Initialization Tests

    func testThemeDefinitionInitialization() {
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

        let definition = ThemeDefinition(
            id: .catppuccinMocha,
            label: "Test Theme",
            palette: palette
        )

        XCTAssertEqual(definition.id, .catppuccinMocha)
        XCTAssertEqual(definition.label, "Test Theme")
        XCTAssertNotNil(definition.palette)
    }

    func testThemeDefinitionPreservesAllProperties() {
        let palette = ThemeRegistry.defaultPalette
        let definition = ThemeDefinition(
            id: .dracula,
            label: "Custom Label",
            palette: palette
        )

        // Verify each property is preserved correctly
        XCTAssertEqual(definition.id.rawValue, "dracula")
        XCTAssertEqual(definition.label, "Custom Label")
        XCTAssertNotNil(definition.palette.backgroundBase)
        XCTAssertNotNil(definition.palette.brandPrimary)
    }

    // MARK: - All Themes Have Valid Definitions Tests

    func testAllRegisteredThemesHaveCorrectIds() {
        for themeId in ThemeId.allCases {
            let theme = ThemeRegistry.theme(for: themeId)
            XCTAssertNotNil(theme, "Theme \(themeId.rawValue) should exist")
            XCTAssertEqual(theme?.id, themeId, "Theme ID should match")
        }
    }

    func testAllRegisteredThemesHaveNonEmptyLabels() {
        for theme in ThemeRegistry.allThemes {
            XCTAssertFalse(theme.label.isEmpty, "Theme \(theme.id.rawValue) should have non-empty label")
            XCTAssertGreaterThan(theme.label.count, 2, "Theme label should be descriptive")
        }
    }

    func testAllRegisteredThemesHaveValidPalettes() {
        for theme in ThemeRegistry.allThemes {
            let palette = theme.palette
            // All palette colors should be accessible
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

    // MARK: - Sendable Conformance Tests

    func testThemeDefinitionIsSendable() {
        // Verify Sendable conformance by passing across isolation boundaries
        let palette = ThemeRegistry.defaultPalette
        let definition = ThemeDefinition(
            id: .githubLight,
            label: "Test Sendable",
            palette: palette
        )

        // This compiles only if ThemeDefinition is Sendable
        let _: Sendable = definition
        XCTAssertEqual(definition.id, .githubLight)
    }

    // MARK: - Theme Label Consistency Tests

    func testCatppuccinThemeLabelsContainCatppuccin() {
        let catppuccinThemes: [ThemeId] = [
            .catppuccinMocha,
            .catppuccinLatte,
            .catppuccinFrappe,
            .catppuccinMacchiato
        ]

        for themeId in catppuccinThemes {
            let theme = ThemeRegistry.theme(for: themeId)
            XCTAssertNotNil(theme)
            XCTAssertTrue(
                theme!.label.contains("Catppuccin"),
                "Theme \(themeId.rawValue) label should contain 'Catppuccin'"
            )
        }
    }

    func testGitHubThemeLabelsContainGitHub() {
        let githubThemes: [ThemeId] = [.githubDark, .githubLight]

        for themeId in githubThemes {
            let theme = ThemeRegistry.theme(for: themeId)
            XCTAssertNotNil(theme)
            XCTAssertTrue(
                theme!.label.contains("GitHub"),
                "Theme \(themeId.rawValue) label should contain 'GitHub'"
            )
        }
    }

    func testBulmaThemeLabelsContainBulma() {
        let bulmaThemes: [ThemeId] = [.bulmaLight, .bulmaDark]

        for themeId in bulmaThemes {
            let theme = ThemeRegistry.theme(for: themeId)
            XCTAssertNotNil(theme)
            XCTAssertTrue(
                theme!.label.contains("Bulma"),
                "Theme \(themeId.rawValue) label should contain 'Bulma'"
            )
        }
    }

    func testDraculaThemeLabelContainsDracula() {
        let theme = ThemeRegistry.theme(for: .dracula)
        XCTAssertNotNil(theme)
        XCTAssertTrue(theme!.label.contains("Dracula"))
    }

    // MARK: - Theme ID to Raw Value Mapping Tests

    func testThemeIdRawValuesAreKebabCase() {
        for themeId in ThemeId.allCases {
            let rawValue = themeId.rawValue
            // Kebab-case should not contain uppercase letters
            XCTAssertEqual(rawValue, rawValue.lowercased(), "Theme ID raw value should be lowercase")
            // Should not contain underscores (use hyphens)
            XCTAssertFalse(rawValue.contains("_"), "Theme ID raw value should use hyphens, not underscores")
        }
    }

    func testThemeIdRawValuesMatchExpected() {
        let expectedRawValues: [ThemeId: String] = [
            .catppuccinMocha: "catppuccin-mocha",
            .catppuccinLatte: "catppuccin-latte",
            .catppuccinFrappe: "catppuccin-frappe",
            .catppuccinMacchiato: "catppuccin-macchiato",
            .dracula: "dracula",
            .githubDark: "github-dark",
            .githubLight: "github-light",
            .bulmaLight: "bulma-light",
            .bulmaDark: "bulma-dark",
        ]

        for (themeId, expectedRaw) in expectedRawValues {
            XCTAssertEqual(themeId.rawValue, expectedRaw)
        }
    }
}
