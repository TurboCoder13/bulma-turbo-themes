// SPDX-License-Identifier: MIT
import XCTest
@testable import TurboThemes

final class ThemeLoaderTests: XCTestCase {

    // MARK: - Theme IDs

    func testThemeIdsNotEmpty() {
        XCTAssertFalse(ThemeLoader.themeIds.isEmpty)
    }

    func testThemeIdsContainsExpectedThemes() {
        XCTAssertTrue(ThemeLoader.themeIds.contains("catppuccin-mocha"))
        XCTAssertTrue(ThemeLoader.themeIds.contains("dracula"))
        XCTAssertTrue(ThemeLoader.themeIds.contains("github-dark"))
    }

    // MARK: - Load Themes

    func testLoadThemesSucceeds() throws {
        let themes = try ThemeLoader.loadThemes()
        XCTAssertFalse(themes.themes.isEmpty)
    }

    func testLoadThemesReturnsExpectedCount() throws {
        let themes = try ThemeLoader.loadThemes()
        XCTAssertEqual(themes.themes.count, ThemeLoader.themeIds.count)
    }

    func testLoadThemesIsCached() throws {
        let themes1 = try ThemeLoader.loadThemes()
        let themes2 = try ThemeLoader.loadThemes()
        XCTAssertEqual(themes1, themes2)
    }

    // MARK: - Get Theme

    func testGetThemeReturnsTheme() throws {
        let theme = try ThemeLoader.getTheme("catppuccin-mocha")
        XCTAssertNotNil(theme)
        XCTAssertEqual(theme?.id, "catppuccin-mocha")
    }

    func testGetThemeReturnsNilForUnknown() throws {
        let theme = try ThemeLoader.getTheme("unknown-theme")
        XCTAssertNil(theme)
    }

    // MARK: - Get All Themes

    func testGetAllThemesReturnsDict() throws {
        let themes = try ThemeLoader.getAllThemes()
        XCTAssertFalse(themes.isEmpty)
    }

    func testGetAllThemesContainsAllThemeIds() throws {
        let themes = try ThemeLoader.getAllThemes()
        for themeId in ThemeLoader.themeIds {
            XCTAssertNotNil(themes[themeId], "Missing theme: \(themeId)")
        }
    }
}
