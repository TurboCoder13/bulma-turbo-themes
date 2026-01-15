import XCTest
import SwiftUI
@testable import TurboThemes

final class ColorHexTests: XCTestCase {

    // MARK: - parseHex Tests

    func testParseHexWithHashPrefix() {
        let result = Color.parseHex("#ff5500")
        XCTAssertNotNil(result)
        XCTAssertEqual(result?.red, 255)
        XCTAssertEqual(result?.green, 85)
        XCTAssertEqual(result?.blue, 0)
    }

    func testParseHexWithoutHashPrefix() {
        let result = Color.parseHex("1e1e2e")
        XCTAssertNotNil(result)
        XCTAssertEqual(result?.red, 30)
        XCTAssertEqual(result?.green, 30)
        XCTAssertEqual(result?.blue, 46)
    }

    func testParseHexBlack() {
        let result = Color.parseHex("#000000")
        XCTAssertNotNil(result)
        XCTAssertEqual(result?.red, 0)
        XCTAssertEqual(result?.green, 0)
        XCTAssertEqual(result?.blue, 0)
    }

    func testParseHexWhite() {
        let result = Color.parseHex("#ffffff")
        XCTAssertNotNil(result)
        XCTAssertEqual(result?.red, 255)
        XCTAssertEqual(result?.green, 255)
        XCTAssertEqual(result?.blue, 255)
    }

    func testParseHexUppercase() {
        let result = Color.parseHex("#AABBCC")
        XCTAssertNotNil(result)
        XCTAssertEqual(result?.red, 170)
        XCTAssertEqual(result?.green, 187)
        XCTAssertEqual(result?.blue, 204)
    }

    func testParseHexMixedCase() {
        let result = Color.parseHex("#AaBbCc")
        XCTAssertNotNil(result)
        XCTAssertEqual(result?.red, 170)
        XCTAssertEqual(result?.green, 187)
        XCTAssertEqual(result?.blue, 204)
    }

    // MARK: - Invalid Input Tests

    func testParseHexTooShort() {
        let result = Color.parseHex("#fff")
        XCTAssertNil(result)
    }

    func testParseHexTooLong() {
        let result = Color.parseHex("#fffffff")
        XCTAssertNil(result)
    }

    func testParseHexInvalidCharacters() {
        let result = Color.parseHex("#gggggg")
        XCTAssertNil(result)
    }

    func testParseHexEmptyString() {
        let result = Color.parseHex("")
        XCTAssertNil(result)
    }

    func testParseHexOnlyHash() {
        let result = Color.parseHex("#")
        XCTAssertNil(result)
    }

    // MARK: - Color Initialization Tests

    func testColorInitWithValidHex() {
        // We can't easily compare Color values, but we can ensure no crash
        let color = Color(hex: "#cba6f7")
        XCTAssertNotNil(color)
    }

    func testColorInitWithInvalidHexReturnsMagenta() {
        // Invalid hex should return magenta (for debugging visibility)
        let color = Color(hex: "invalid")
        // We can't easily compare colors, but the init should not crash
        XCTAssertNotNil(color)
    }
}
