// SPDX-License-Identifier: MIT
// Types for Turbo Themes
//
// Provides typed access to theme tokens loaded from tokens.json.
// Replaces the complex quicktype-generated types with a simpler implementation.

import Foundation

// MARK: - Appearance

/// Theme appearance (light or dark).
public enum Appearance: String, Codable, Equatable, Sendable {
    case light
    case dark
}

// MARK: - JSONValue

/// A dynamic JSON value that can represent any JSON type.
/// Used for flexible access to nested token values.
@dynamicMemberLookup
public enum JSONValue: Codable, Equatable, Sendable {
    case string(String)
    case number(Double)
    case bool(Bool)
    case object([String: JSONValue])
    case array([JSONValue])
    case null

    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()

        if let string = try? container.decode(String.self) {
            self = .string(string)
        } else if let number = try? container.decode(Double.self) {
            self = .number(number)
        } else if let bool = try? container.decode(Bool.self) {
            self = .bool(bool)
        } else if let object = try? container.decode([String: JSONValue].self) {
            self = .object(object)
        } else if let array = try? container.decode([JSONValue].self) {
            self = .array(array)
        } else if container.decodeNil() {
            self = .null
        } else {
            throw DecodingError.dataCorrupted(
                DecodingError.Context(codingPath: decoder.codingPath, debugDescription: "Unknown JSON value")
            )
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .string(let value):
            try container.encode(value)
        case .number(let value):
            try container.encode(value)
        case .bool(let value):
            try container.encode(value)
        case .object(let value):
            try container.encode(value)
        case .array(let value):
            try container.encode(value)
        case .null:
            try container.encodeNil()
        }
    }

    /// Access nested values using dot notation: tokens.background.base
    public subscript(dynamicMember member: String) -> JSONValue? {
        guard case .object(let dict) = self else { return nil }
        return dict[member]
    }

    /// Access values by string key
    public subscript(key: String) -> JSONValue? {
        guard case .object(let dict) = self else { return nil }
        return dict[key]
    }

    /// Get the string value if this is a string
    public var stringValue: String? {
        guard case .string(let value) = self else { return nil }
        return value
    }

    /// Get the number value if this is a number
    public var numberValue: Double? {
        guard case .number(let value) = self else { return nil }
        return value
    }

    /// Get the bool value if this is a bool
    public var boolValue: Bool? {
        guard case .bool(let value) = self else { return nil }
        return value
    }
}

// MARK: - Tokens

/// Design tokens for a theme.
/// Provides access to nested token categories like background, text, state, etc.
@dynamicMemberLookup
public struct Tokens: Codable, Equatable, Sendable {
    private let _data: [String: JSONValue]

    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        _data = try container.decode([String: JSONValue].self)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(_data)
    }

    /// Access token categories using dot notation: tokens.background
    public subscript(dynamicMember member: String) -> JSONValue? {
        return _data[member]
    }

    /// Access token categories by string key
    public subscript(key: String) -> JSONValue? {
        return _data[key]
    }
}

// MARK: - ThemeValue

/// A single theme definition with metadata and tokens.
public struct ThemeValue: Codable, Equatable, Sendable {
    public let id: String
    public let label: String
    public let vendor: String
    public let appearance: Appearance
    public let tokens: Tokens
    public let description: String?
    public let iconUrl: String?

    public enum CodingKeys: String, CodingKey {
        case id, label, vendor, appearance, tokens
        case description = "$description"
        case iconUrl
    }

    public init(id: String, label: String, vendor: String, appearance: Appearance, tokens: Tokens, description: String? = nil, iconUrl: String? = nil) {
        self.id = id
        self.label = label
        self.vendor = vendor
        self.appearance = appearance
        self.tokens = tokens
        self.description = description
        self.iconUrl = iconUrl
    }
}

// MARK: - ByVendorValue

/// Vendor metadata.
public struct ByVendorValue: Codable, Equatable, Sendable {
    public let name: String
    public let homepage: String
    public let themes: [String]

    public init(name: String, homepage: String, themes: [String]) {
        self.name = name
        self.homepage = homepage
        self.themes = themes
    }
}

// MARK: - Meta

/// Metadata about the token collection.
public struct Meta: Codable, Equatable, Sendable {
    public let themeIds: [String]?
    public let vendors: [String]?
    public let totalThemes: Int?
    public let lightThemes: Int?
    public let darkThemes: Int?

    public init(themeIds: [String]? = nil, vendors: [String]? = nil, totalThemes: Int? = nil, lightThemes: Int? = nil, darkThemes: Int? = nil) {
        self.themeIds = themeIds
        self.vendors = vendors
        self.totalThemes = totalThemes
        self.lightThemes = lightThemes
        self.darkThemes = darkThemes
    }
}

// MARK: - TurboThemes

/// Root container for all themes and metadata.
public struct TurboThemes: Codable, Equatable, Sendable {
    public let themes: [String: ThemeValue]
    public let byVendor: [String: ByVendorValue]?
    public let meta: Meta?
    public let schema: String?
    public let version: String?
    public let description: String?
    public let generated: Date?

    public enum CodingKeys: String, CodingKey {
        case themes, byVendor, meta
        case schema = "$schema"
        case version = "$version"
        case description = "$description"
        case generated = "$generated"
    }

    public init(themes: [String: ThemeValue], byVendor: [String: ByVendorValue]? = nil, meta: Meta? = nil, schema: String? = nil, version: String? = nil, description: String? = nil, generated: Date? = nil) {
        self.themes = themes
        self.byVendor = byVendor
        self.meta = meta
        self.schema = schema
        self.version = version
        self.description = description
        self.generated = generated
    }
}

// MARK: - TurboThemes convenience initializers

public extension TurboThemes {
    /// Initialize from JSON data
    init(data: Data) throws {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        self = try decoder.decode(TurboThemes.self, from: data)
    }

    /// Initialize from JSON string
    init(_ json: String, using encoding: String.Encoding = .utf8) throws {
        guard let data = json.data(using: encoding) else {
            throw NSError(domain: "JSONDecoding", code: 0, userInfo: nil)
        }
        try self.init(data: data)
    }

    /// Initialize from URL
    init(fromURL url: URL) throws {
        try self.init(data: try Data(contentsOf: url))
    }

    /// Encode to JSON data
    func jsonData() throws -> Data {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        return try encoder.encode(self)
    }

    /// Encode to JSON string
    func jsonString(encoding: String.Encoding = .utf8) throws -> String? {
        return String(data: try self.jsonData(), encoding: encoding)
    }
}
