// SPDX-License-Identifier: MIT
import XCTest
@testable import TurboThemes

final class TypesTests: XCTestCase {

    // MARK: - Appearance

    func testAppearanceLightValue() {
        XCTAssertEqual(Appearance.light.rawValue, "light")
    }

    func testAppearanceDarkValue() {
        XCTAssertEqual(Appearance.dark.rawValue, "dark")
    }

    func testAppearanceDecodable() throws {
        let json = "\"dark\""
        let data = json.data(using: .utf8)!
        let appearance = try JSONDecoder().decode(Appearance.self, from: data)
        XCTAssertEqual(appearance, .dark)
    }

    // MARK: - JSONValue

    func testJSONValueString() {
        let value = JSONValue.string("hello")
        XCTAssertEqual(value.stringValue, "hello")
    }

    func testJSONValueNumber() {
        let value = JSONValue.number(42.5)
        XCTAssertEqual(value.numberValue, 42.5)
    }

    func testJSONValueBool() {
        let value = JSONValue.bool(true)
        XCTAssertEqual(value.boolValue, true)
    }

    func testJSONValueObjectSubscript() {
        let inner = JSONValue.string("value")
        let value = JSONValue.object(["key": inner])
        XCTAssertEqual(value["key"]?.stringValue, "value")
    }

    func testJSONValueDynamicMemberLookup() {
        let inner = JSONValue.string("value")
        let value = JSONValue.object(["key": inner])
        XCTAssertEqual(value.key?.stringValue, "value")
    }

    func testJSONValueDecodable() throws {
        let json = """
        {
            "string": "hello",
            "number": 42,
            "bool": true,
            "nested": {
                "inner": "value"
            }
        }
        """
        let data = json.data(using: .utf8)!
        let value = try JSONDecoder().decode(JSONValue.self, from: data)

        if case .object(let dict) = value {
            XCTAssertEqual(dict["string"]?.stringValue, "hello")
            XCTAssertEqual(dict["number"]?.numberValue, 42)
            XCTAssertEqual(dict["bool"]?.boolValue, true)
        } else {
            XCTFail("Expected object")
        }
    }

    // MARK: - Tokens

    func testTokensDecodable() throws {
        let json = """
        {
            "background": {
                "base": "#000000"
            },
            "text": {
                "primary": "#ffffff"
            }
        }
        """
        let data = json.data(using: .utf8)!
        let tokens = try JSONDecoder().decode(Tokens.self, from: data)

        XCTAssertEqual(tokens.background?.base?.stringValue, "#000000")
        XCTAssertEqual(tokens.text?.primary?.stringValue, "#ffffff")
    }

    // MARK: - ThemeValue

    func testThemeValueDecodable() throws {
        let json = """
        {
            "id": "test-theme",
            "label": "Test Theme",
            "vendor": "test",
            "appearance": "dark",
            "tokens": {
                "background": {
                    "base": "#000000"
                }
            }
        }
        """
        let data = json.data(using: .utf8)!
        let theme = try JSONDecoder().decode(ThemeValue.self, from: data)

        XCTAssertEqual(theme.id, "test-theme")
        XCTAssertEqual(theme.label, "Test Theme")
        XCTAssertEqual(theme.vendor, "test")
        XCTAssertEqual(theme.appearance, .dark)
    }

    func testThemeValueWithOptionalFields() throws {
        let json = """
        {
            "id": "test",
            "label": "Test",
            "vendor": "test",
            "appearance": "light",
            "tokens": {},
            "$description": "A test theme",
            "iconUrl": "https://example.com/icon.png"
        }
        """
        let data = json.data(using: .utf8)!
        let theme = try JSONDecoder().decode(ThemeValue.self, from: data)

        XCTAssertEqual(theme.description, "A test theme")
        XCTAssertEqual(theme.iconUrl, "https://example.com/icon.png")
    }

    // MARK: - ByVendorValue

    func testByVendorValueDecodable() throws {
        let json = """
        {
            "name": "Test Vendor",
            "homepage": "https://example.com",
            "themes": ["theme-1", "theme-2"]
        }
        """
        let data = json.data(using: .utf8)!
        let vendor = try JSONDecoder().decode(ByVendorValue.self, from: data)

        XCTAssertEqual(vendor.name, "Test Vendor")
        XCTAssertEqual(vendor.homepage, "https://example.com")
        XCTAssertEqual(vendor.themes, ["theme-1", "theme-2"])
    }

    // MARK: - Meta

    func testMetaDecodable() throws {
        let json = """
        {
            "themeIds": ["theme-1", "theme-2"],
            "vendors": ["vendor-1"],
            "totalThemes": 2,
            "lightThemes": 1,
            "darkThemes": 1
        }
        """
        let data = json.data(using: .utf8)!
        let meta = try JSONDecoder().decode(Meta.self, from: data)

        XCTAssertEqual(meta.themeIds, ["theme-1", "theme-2"])
        XCTAssertEqual(meta.totalThemes, 2)
    }

    // MARK: - TurboThemes

    func testTurboThemesDecodable() throws {
        let json = """
        {
            "themes": {
                "test-theme": {
                    "id": "test-theme",
                    "label": "Test Theme",
                    "vendor": "test",
                    "appearance": "dark",
                    "tokens": {}
                }
            }
        }
        """
        let data = json.data(using: .utf8)!
        let themes = try TurboThemes(data: data)

        XCTAssertEqual(themes.themes.count, 1)
        XCTAssertEqual(themes.themes["test-theme"]?.id, "test-theme")
    }

    func testTurboThemesFromString() throws {
        let json = """
        {
            "themes": {
                "test": {
                    "id": "test",
                    "label": "Test",
                    "vendor": "test",
                    "appearance": "light",
                    "tokens": {}
                }
            }
        }
        """
        let themes = try TurboThemes(json)
        XCTAssertEqual(themes.themes.count, 1)
    }

    func testTurboThemesJsonData() throws {
        let theme = ThemeValue(
            id: "test",
            label: "Test",
            vendor: "test",
            appearance: .dark,
            tokens: try JSONDecoder().decode(Tokens.self, from: "{}".data(using: .utf8)!)
        )
        let turboThemes = TurboThemes(themes: ["test": theme])

        let data = try turboThemes.jsonData()
        XCTAssertFalse(data.isEmpty)

        let decoded = try TurboThemes(data: data)
        XCTAssertEqual(decoded.themes.count, 1)
    }

    func testTurboThemesJsonString() throws {
        let theme = ThemeValue(
            id: "test",
            label: "Test",
            vendor: "test",
            appearance: .light,
            tokens: try JSONDecoder().decode(Tokens.self, from: "{}".data(using: .utf8)!)
        )
        let turboThemes = TurboThemes(themes: ["test": theme])

        let jsonString = try turboThemes.jsonString()
        XCTAssertNotNil(jsonString)
        XCTAssertTrue(jsonString!.contains("test"))
    }
}
