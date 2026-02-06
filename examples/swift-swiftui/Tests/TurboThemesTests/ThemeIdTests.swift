import XCTest
@testable import TurboThemes

final class ThemeIdTests: XCTestCase {

    // MARK: - CaseIterable Conformance Tests

    func testThemeIdIsCaseIterable() {
        let allCases = ThemeId.allCases
        XCTAssertFalse(allCases.isEmpty)
    }

    func testThemeIdCaseCount() {
        XCTAssertEqual(ThemeId.allCases.count, 21)
    }

    func testAllCasesContainsExpectedThemes() {
        let allCases = Set(ThemeId.allCases)

        XCTAssertTrue(allCases.contains(.catppuccinMocha))
        XCTAssertTrue(allCases.contains(.catppuccinLatte))
        XCTAssertTrue(allCases.contains(.catppuccinFrappe))
        XCTAssertTrue(allCases.contains(.catppuccinMacchiato))
        XCTAssertTrue(allCases.contains(.dracula))
        XCTAssertTrue(allCases.contains(.githubDark))
        XCTAssertTrue(allCases.contains(.githubLight))
        XCTAssertTrue(allCases.contains(.bulmaLight))
        XCTAssertTrue(allCases.contains(.bulmaDark))
        XCTAssertTrue(allCases.contains(.gruvboxDarkHard))
        XCTAssertTrue(allCases.contains(.gruvboxDark))
        XCTAssertTrue(allCases.contains(.gruvboxDarkSoft))
        XCTAssertTrue(allCases.contains(.gruvboxLightHard))
        XCTAssertTrue(allCases.contains(.gruvboxLight))
        XCTAssertTrue(allCases.contains(.gruvboxLightSoft))
        XCTAssertTrue(allCases.contains(.nord))
        XCTAssertTrue(allCases.contains(.solarizedDark))
        XCTAssertTrue(allCases.contains(.solarizedLight))
        XCTAssertTrue(allCases.contains(.rosePine))
        XCTAssertTrue(allCases.contains(.rosePineMoon))
        XCTAssertTrue(allCases.contains(.rosePineDawn))
    }

    // MARK: - RawValue Tests

    func testThemeIdRawValueRoundtrip() {
        for themeId in ThemeId.allCases {
            let rawValue = themeId.rawValue
            let reconstructed = ThemeId(rawValue: rawValue)
            XCTAssertEqual(reconstructed, themeId)
        }
    }

    func testThemeIdInvalidRawValueReturnsNil() {
        XCTAssertNil(ThemeId(rawValue: "invalid-theme"))
        XCTAssertNil(ThemeId(rawValue: ""))
        XCTAssertNil(ThemeId(rawValue: "DRACULA"))
        XCTAssertNil(ThemeId(rawValue: "catppuccin_mocha"))
    }

    func testThemeIdRawValuesAreUnique() {
        var rawValues = Set<String>()
        for themeId in ThemeId.allCases {
            let rawValue = themeId.rawValue
            XCTAssertFalse(rawValues.contains(rawValue), "Duplicate raw value: \(rawValue)")
            rawValues.insert(rawValue)
        }
    }

    // MARK: - Sendable Conformance Tests

    func testThemeIdIsSendable() {
        let themeId: ThemeId = .dracula
        // This compiles only if ThemeId is Sendable
        let _: Sendable = themeId
        XCTAssertEqual(themeId.rawValue, "dracula")
    }

    // MARK: - Hashable Conformance Tests

    func testThemeIdIsHashable() {
        var themeSet = Set<ThemeId>()
        themeSet.insert(.dracula)
        themeSet.insert(.githubDark)
        themeSet.insert(.dracula) // Duplicate

        XCTAssertEqual(themeSet.count, 2)
        XCTAssertTrue(themeSet.contains(.dracula))
        XCTAssertTrue(themeSet.contains(.githubDark))
    }

    func testThemeIdCanBeUsedAsDictionaryKey() {
        var themeDict: [ThemeId: String] = [:]
        themeDict[.dracula] = "Dark vampire theme"
        themeDict[.githubLight] = "Light GitHub theme"

        XCTAssertEqual(themeDict[.dracula], "Dark vampire theme")
        XCTAssertEqual(themeDict[.githubLight], "Light GitHub theme")
        XCTAssertNil(themeDict[.bulmaDark])
    }

    // MARK: - Equatable Conformance Tests

    func testThemeIdEquality() {
        let theme1: ThemeId = .catppuccinMocha
        let theme2: ThemeId = .catppuccinMocha
        let theme3: ThemeId = .dracula

        XCTAssertEqual(theme1, theme2)
        XCTAssertNotEqual(theme1, theme3)
    }

    // MARK: - String Description Tests

    func testThemeIdDescriptionIsCaseName() {
        // String(describing:) returns the case name, not the rawValue
        let description = String(describing: ThemeId.catppuccinMocha)
        XCTAssertEqual(description, "catppuccinMocha")

        let draculaDesc = String(describing: ThemeId.dracula)
        XCTAssertEqual(draculaDesc, "dracula")
    }

    // MARK: - Catppuccin Flavor Grouping Tests

    func testCatppuccinFlavorsAreGrouped() {
        let catppuccinThemes = ThemeId.allCases.filter {
            $0.rawValue.hasPrefix("catppuccin-")
        }

        XCTAssertEqual(catppuccinThemes.count, 4)
        XCTAssertTrue(catppuccinThemes.contains(.catppuccinMocha))
        XCTAssertTrue(catppuccinThemes.contains(.catppuccinLatte))
        XCTAssertTrue(catppuccinThemes.contains(.catppuccinFrappe))
        XCTAssertTrue(catppuccinThemes.contains(.catppuccinMacchiato))
    }

    // MARK: - GitHub Theme Grouping Tests

    func testGitHubThemesAreGrouped() {
        let githubThemes = ThemeId.allCases.filter {
            $0.rawValue.hasPrefix("github-")
        }

        XCTAssertEqual(githubThemes.count, 2)
        XCTAssertTrue(githubThemes.contains(.githubDark))
        XCTAssertTrue(githubThemes.contains(.githubLight))
    }

    // MARK: - Bulma Theme Grouping Tests

    func testBulmaThemesAreGrouped() {
        let bulmaThemes = ThemeId.allCases.filter {
            $0.rawValue.hasPrefix("bulma-")
        }

        XCTAssertEqual(bulmaThemes.count, 2)
        XCTAssertTrue(bulmaThemes.contains(.bulmaLight))
        XCTAssertTrue(bulmaThemes.contains(.bulmaDark))
    }

    // MARK: - Order Stability Tests

    func testAllCasesOrderIsStable() {
        let firstCall = ThemeId.allCases
        let secondCall = ThemeId.allCases

        XCTAssertEqual(firstCall.count, secondCall.count)
        for (first, second) in zip(firstCall, secondCall) {
            XCTAssertEqual(first, second)
        }
    }

    // MARK: - Index Tests

    func testFirstIndexReturnsCorrectValue() {
        let allCases = ThemeId.allCases
        guard let index = allCases.firstIndex(of: .dracula) else {
            XCTFail("dracula should be in allCases")
            return
        }
        XCTAssertEqual(allCases[index], .dracula)
    }
}
