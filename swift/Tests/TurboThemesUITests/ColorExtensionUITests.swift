// SPDX-License-Identifier: MIT
// SwiftUI Color extension UI tests

import XCTest
import SwiftUI
@testable import TurboThemes

/// Tests for the Color(hex:) extension used in SwiftUI views.
final class ColorExtensionUITests: XCTestCase {

    // MARK: - Basic Hex Parsing

    func testColorFromSixDigitHex() {
        let color = Color(hex: "#FF0000")
        // Red color should be parsed correctly
        XCTAssertNotEqual(color, Color.clear)
    }

    func testColorFromSixDigitHexWithoutHash() {
        let color = Color(hex: "00FF00")
        XCTAssertNotEqual(color, Color.clear)
    }

    func testColorFromEightDigitHex() {
        let color = Color(hex: "#FF000080")
        // Red color with 50% opacity
        XCTAssertNotEqual(color, Color.clear)
    }

    func testColorFromEightDigitHexWithoutHash() {
        let color = Color(hex: "0000FFFF")
        XCTAssertNotEqual(color, Color.clear)
    }

    // MARK: - Invalid Hex Handling

    func testInvalidHexReturnsClear() {
        let color = Color(hex: "not-a-color")
        XCTAssertEqual(color, Color.clear)
    }

    func testEmptyStringReturnsClear() {
        let color = Color(hex: "")
        XCTAssertEqual(color, Color.clear)
    }

    func testShortHexReturnsClear() {
        let color = Color(hex: "#FFF")
        XCTAssertEqual(color, Color.clear)
    }

    func testTooLongHexReturnsClear() {
        let color = Color(hex: "#FFFFFFFFFF")
        XCTAssertEqual(color, Color.clear)
    }

    // MARK: - Theme Token Colors

    func testThemeBackgroundColorCreation() {
        let manager = ThemeManager(defaultThemeId: "catppuccin-mocha")
        let theme = manager.currentTheme

        // Get background color from tokens
        if let bgHex = theme.tokens.background?.base?.stringValue {
            let bgColor = Color(hex: bgHex)
            XCTAssertNotEqual(bgColor, Color.clear, "Background color should be valid")
        }
    }

    func testThemeTextColorCreation() {
        let manager = ThemeManager(defaultThemeId: "catppuccin-mocha")
        let theme = manager.currentTheme

        // Get text color from tokens
        if let textHex = theme.tokens.text?.primary?.stringValue {
            let textColor = Color(hex: textHex)
            XCTAssertNotEqual(textColor, Color.clear, "Text color should be valid")
        }
    }

    func testAllThemeColorsAreValid() {
        let manager = ThemeManager()

        for theme in manager.orderedThemes {
            // Check that primary colors parse correctly
            if let bgHex = theme.tokens.background?.base?.stringValue {
                let color = Color(hex: bgHex)
                XCTAssertNotEqual(color, Color.clear, "Theme \(theme.id) has invalid background color")
            }

            if let textHex = theme.tokens.text?.primary?.stringValue {
                let color = Color(hex: textHex)
                XCTAssertNotEqual(color, Color.clear, "Theme \(theme.id) has invalid text color")
            }
        }
    }

    // MARK: - Color Consistency

    func testSameHexProducesSameColor() {
        let color1 = Color(hex: "#AABBCC")
        let color2 = Color(hex: "#AABBCC")
        // Colors should be identical
        XCTAssertEqual(color1, color2)
    }

    func testHashDoesNotAffectResult() {
        let colorWithHash = Color(hex: "#AABBCC")
        let colorWithoutHash = Color(hex: "AABBCC")
        XCTAssertEqual(colorWithHash, colorWithoutHash)
    }

    func testCaseInsensitive() {
        let lowerCase = Color(hex: "#aabbcc")
        let upperCase = Color(hex: "#AABBCC")
        let mixedCase = Color(hex: "#AaBbCc")
        XCTAssertEqual(lowerCase, upperCase)
        XCTAssertEqual(lowerCase, mixedCase)
    }
}
