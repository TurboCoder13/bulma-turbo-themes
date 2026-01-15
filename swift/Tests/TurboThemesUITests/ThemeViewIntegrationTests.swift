// SPDX-License-Identifier: MIT
// SwiftUI view integration tests for TurboThemes

import XCTest
import SwiftUI
@testable import TurboThemes

/// Tests for SwiftUI view integration with TurboThemes.
/// These tests verify that theme colors can be used in SwiftUI views.
final class ThemeViewIntegrationTests: XCTestCase {

    // MARK: - Theme Manager Observable

    func testThemeManagerAsObservableObject() {
        let manager = ThemeManager()
        // ThemeManager should be usable as an ObservableObject in SwiftUI
        XCTAssertNotNil(manager.currentTheme)
    }

    func testThemeChangeTriggersUpdate() {
        let manager = ThemeManager(defaultThemeId: "catppuccin-mocha")
        let initialTheme = manager.currentTheme.id

        manager.setTheme("dracula")

        XCTAssertNotEqual(manager.currentTheme.id, initialTheme)
        XCTAssertEqual(manager.currentTheme.id, "dracula")
    }

    // MARK: - Token Access

    func testBackgroundTokensAccessible() {
        let manager = ThemeManager()
        let theme = manager.currentTheme

        XCTAssertNotNil(theme.tokens.background)
        XCTAssertNotNil(theme.tokens.background?.base)
    }

    func testTextTokensAccessible() {
        let manager = ThemeManager()
        let theme = manager.currentTheme

        XCTAssertNotNil(theme.tokens.text)
        XCTAssertNotNil(theme.tokens.text?.primary)
    }

    func testStateTokensAccessible() {
        let manager = ThemeManager()
        let theme = manager.currentTheme

        // State tokens should be available for UI states
        XCTAssertNotNil(theme.tokens.state)
    }

    func testBorderTokensAccessible() {
        let manager = ThemeManager()
        let theme = manager.currentTheme

        XCTAssertNotNil(theme.tokens.border)
    }

    // MARK: - Dark/Light Theme Colors

    func testDarkThemeHasDarkBackground() {
        let manager = ThemeManager(defaultThemeId: "catppuccin-mocha")
        XCTAssertEqual(manager.appearance, .dark)

        if let bgHex = manager.currentTheme.tokens.background?.base?.stringValue {
            // Dark themes should have dark backgrounds (lower hex values)
            let cleaned = bgHex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
            if let value = UInt64(cleaned, radix: 16) {
                let r = (value & 0xFF0000) >> 16
                let g = (value & 0x00FF00) >> 8
                let b = value & 0x0000FF
                let brightness = (r + g + b) / 3
                XCTAssertLessThan(brightness, 128, "Dark theme background should be dark")
            }
        }
    }

    func testLightThemeHasLightBackground() {
        let manager = ThemeManager(defaultThemeId: "catppuccin-latte")
        XCTAssertEqual(manager.appearance, .light)

        if let bgHex = manager.currentTheme.tokens.background?.base?.stringValue {
            // Light themes should have light backgrounds (higher hex values)
            let cleaned = bgHex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
            if let value = UInt64(cleaned, radix: 16) {
                let r = (value & 0xFF0000) >> 16
                let g = (value & 0x00FF00) >> 8
                let b = value & 0x0000FF
                let brightness = (r + g + b) / 3
                XCTAssertGreaterThan(brightness, 128, "Light theme background should be light")
            }
        }
    }

    // MARK: - Theme Switching for Views

    func testMultipleThemeSwitches() {
        let manager = ThemeManager(defaultThemeId: "catppuccin-mocha")
        var previousId = manager.currentTheme.id

        let themes = ["dracula", "github-dark", "catppuccin-latte", "github-light"]

        for themeId in themes {
            manager.setTheme(themeId)
            XCTAssertEqual(manager.currentTheme.id, themeId)
            XCTAssertNotEqual(manager.currentTheme.id, previousId)
            previousId = themeId
        }
    }

    func testAppearanceToggle() {
        let manager = ThemeManager(defaultThemeId: "catppuccin-mocha")
        XCTAssertEqual(manager.appearance, .dark)

        manager.toggleAppearance()
        XCTAssertEqual(manager.appearance, .light)

        manager.toggleAppearance()
        XCTAssertEqual(manager.appearance, .dark)
    }

    // MARK: - Vendor Filtering

    func testThemesByVendorForUI() {
        let manager = ThemeManager()

        let catppuccinThemes = manager.themes(byVendor: "catppuccin")
        XCTAssertFalse(catppuccinThemes.isEmpty)

        // All returned themes should have valid colors
        for theme in catppuccinThemes {
            XCTAssertNotNil(theme.tokens.background?.base?.stringValue)
        }
    }

    // MARK: - Ordered Themes for Pickers

    func testOrderedThemesForPicker() {
        let manager = ThemeManager()

        // orderedThemes should be suitable for UI pickers
        let themes = manager.orderedThemes
        XCTAssertFalse(themes.isEmpty)

        // Each theme should have a label for display
        for theme in themes {
            XCTAssertFalse(theme.label.isEmpty, "Theme \(theme.id) should have a label")
        }
    }

    func testAvailableThemesForMenu() {
        let manager = ThemeManager()

        // availableThemes provides all themes for menus (as dictionary)
        let themes = manager.availableThemes
        XCTAssertFalse(themes.isEmpty)

        // Each theme should have an ID for selection
        for (themeId, themeValue) in themes {
            XCTAssertFalse(themeId.isEmpty, "Theme key should not be empty")
            XCTAssertEqual(themeId, themeValue.id, "Theme key should match theme ID")
        }
    }
}
