// SPDX-License-Identifier: MIT
import XCTest
@testable import TurboThemes

final class ThemeManagerTests: XCTestCase {

    // MARK: - Initialization

    func testInitWithDefaultTheme() {
        let manager = ThemeManager()
        XCTAssertEqual(manager.currentTheme.id, "catppuccin-mocha")
    }

    func testInitWithCustomTheme() {
        let manager = ThemeManager(defaultThemeId: "dracula")
        XCTAssertEqual(manager.currentTheme.id, "dracula")
    }

    func testInitWithInvalidThemeFallsBack() {
        let manager = ThemeManager(defaultThemeId: "nonexistent")
        // Should fall back to first available theme
        XCTAssertFalse(manager.currentTheme.id.isEmpty)
    }

    // MARK: - Available Themes

    func testAvailableThemesNotEmpty() {
        let manager = ThemeManager()
        XCTAssertFalse(manager.availableThemes.isEmpty)
    }

    func testOrderedThemesNotEmpty() {
        let manager = ThemeManager()
        XCTAssertFalse(manager.orderedThemes.isEmpty)
    }

    func testOrderedThemesMatchesAvailableThemes() {
        let manager = ThemeManager()
        XCTAssertEqual(manager.orderedThemes.count, manager.availableThemes.count)
    }

    // MARK: - Set Theme

    func testSetThemeChangesCurrentTheme() {
        let manager = ThemeManager(defaultThemeId: "catppuccin-mocha")
        manager.setTheme("dracula")
        XCTAssertEqual(manager.currentTheme.id, "dracula")
    }

    func testSetThemeWithInvalidIdDoesNothing() {
        let manager = ThemeManager(defaultThemeId: "catppuccin-mocha")
        manager.setTheme("nonexistent")
        XCTAssertEqual(manager.currentTheme.id, "catppuccin-mocha")
    }

    // MARK: - Appearance

    func testAppearanceReflectsCurrentTheme() {
        let manager = ThemeManager(defaultThemeId: "catppuccin-mocha")
        XCTAssertEqual(manager.appearance, .dark)

        manager.setTheme("catppuccin-latte")
        XCTAssertEqual(manager.appearance, .light)
    }

    // MARK: - Toggle Appearance

    func testToggleAppearanceFromDarkToLight() {
        let manager = ThemeManager(defaultThemeId: "catppuccin-mocha")
        XCTAssertEqual(manager.appearance, .dark)

        manager.toggleAppearance()
        XCTAssertEqual(manager.appearance, .light)
    }

    func testToggleAppearanceFromLightToDark() {
        let manager = ThemeManager(defaultThemeId: "catppuccin-latte")
        XCTAssertEqual(manager.appearance, .light)

        manager.toggleAppearance()
        XCTAssertEqual(manager.appearance, .dark)
    }

    func testToggleAppearanceWithPreferredThemes() {
        let manager = ThemeManager(defaultThemeId: "catppuccin-mocha")
        manager.toggleAppearance(light: "github-light", dark: "github-dark")
        XCTAssertEqual(manager.currentTheme.id, "github-light")

        manager.toggleAppearance(light: "github-light", dark: "github-dark")
        XCTAssertEqual(manager.currentTheme.id, "github-dark")
    }

    // MARK: - Filter by Appearance

    func testThemesByAppearanceDark() {
        let manager = ThemeManager()
        let darkThemes = manager.themes(byAppearance: .dark)
        XCTAssertFalse(darkThemes.isEmpty)
        XCTAssertTrue(darkThemes.allSatisfy { $0.appearance == .dark })
    }

    func testThemesByAppearanceLight() {
        let manager = ThemeManager()
        let lightThemes = manager.themes(byAppearance: .light)
        XCTAssertFalse(lightThemes.isEmpty)
        XCTAssertTrue(lightThemes.allSatisfy { $0.appearance == .light })
    }

    // MARK: - Filter by Vendor

    func testThemesByVendor() {
        let manager = ThemeManager()
        let catppuccinThemes = manager.themes(byVendor: "catppuccin")
        XCTAssertFalse(catppuccinThemes.isEmpty)
        XCTAssertTrue(catppuccinThemes.allSatisfy { $0.vendor == "catppuccin" })
    }

    func testThemesByUnknownVendor() {
        let manager = ThemeManager()
        let themes = manager.themes(byVendor: "nonexistent")
        XCTAssertTrue(themes.isEmpty)
    }
}
