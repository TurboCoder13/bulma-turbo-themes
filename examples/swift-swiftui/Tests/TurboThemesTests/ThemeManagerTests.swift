import XCTest
@testable import TurboThemes

@MainActor
final class ThemeManagerTests: XCTestCase {

    // MARK: - Initialization Tests

    func testDefaultInitialization() {
        let manager = ThemeManager()
        XCTAssertEqual(manager.currentThemeId, .catppuccinMocha)
    }

    func testInitializationWithCustomDefault() {
        let manager = ThemeManager(defaultTheme: .dracula)
        XCTAssertEqual(manager.currentThemeId, .dracula)
    }

    func testInitializationWithEachTheme() {
        for themeId in ThemeId.allCases {
            let manager = ThemeManager(defaultTheme: themeId)
            XCTAssertEqual(manager.currentThemeId, themeId)
        }
    }

    // MARK: - Theme Property Tests

    func testThemePropertyReturnsCorrectDefinition() {
        let manager = ThemeManager(defaultTheme: .githubDark)
        XCTAssertEqual(manager.theme.id, .githubDark)
        XCTAssertEqual(manager.theme.label, "GitHub Dark")
    }

    func testPalettePropertyReturnsThemePalette() {
        let manager = ThemeManager(defaultTheme: .catppuccinLatte)
        let palette = manager.palette
        XCTAssertNotNil(palette)
        // Palette should match the theme's palette
        XCTAssertNotNil(palette.backgroundBase)
    }

    // MARK: - setTheme Tests

    func testSetTheme() {
        let manager = ThemeManager()
        XCTAssertEqual(manager.currentThemeId, .catppuccinMocha)

        manager.setTheme(.dracula)
        XCTAssertEqual(manager.currentThemeId, .dracula)

        manager.setTheme(.githubLight)
        XCTAssertEqual(manager.currentThemeId, .githubLight)
    }

    func testSetThemeToAllThemes() {
        let manager = ThemeManager()
        for themeId in ThemeId.allCases {
            manager.setTheme(themeId)
            XCTAssertEqual(manager.currentThemeId, themeId)
            XCTAssertEqual(manager.theme.id, themeId)
        }
    }

    // MARK: - cycleTheme Tests

    func testCycleThemeReturnsNextTheme() {
        let manager = ThemeManager(defaultTheme: .catppuccinMocha)
        let allThemes = ThemeId.allCases

        // Find current index
        guard let currentIndex = allThemes.firstIndex(of: .catppuccinMocha) else {
            XCTFail("Could not find catppuccinMocha in allCases")
            return
        }

        let expectedNextIndex = (currentIndex + 1) % allThemes.count
        let expectedNextTheme = allThemes[expectedNextIndex]

        let nextTheme = manager.cycleTheme()
        XCTAssertEqual(nextTheme, expectedNextTheme)
        XCTAssertEqual(manager.currentThemeId, expectedNextTheme)
    }

    func testCycleThemeWrapsAround() {
        let manager = ThemeManager()
        let allThemes = ThemeId.allCases

        // Cycle through all themes and one more to verify wrap-around
        for i in 0..<(allThemes.count + 1) {
            let expectedIndex = i % allThemes.count
            XCTAssertEqual(manager.currentThemeId, allThemes[expectedIndex])
            manager.cycleTheme()
        }
    }

    func testCycleThemeThroughAllThemes() {
        let manager = ThemeManager(defaultTheme: ThemeId.allCases.first!)
        var visitedThemes: Set<ThemeId> = [manager.currentThemeId]

        // Cycle through all themes
        for _ in 1..<ThemeId.allCases.count {
            manager.cycleTheme()
            visitedThemes.insert(manager.currentThemeId)
        }

        // Should have visited all themes
        XCTAssertEqual(visitedThemes.count, ThemeId.allCases.count)
    }

    // MARK: - availableThemes Tests

    func testAvailableThemesReturnsAllThemes() {
        let manager = ThemeManager()
        let availableThemes = manager.availableThemes

        XCTAssertEqual(availableThemes.count, ThemeId.allCases.count)

        // Verify each theme is present
        let availableIds = Set(availableThemes.map { $0.id })
        for themeId in ThemeId.allCases {
            XCTAssertTrue(availableIds.contains(themeId))
        }
    }
}
