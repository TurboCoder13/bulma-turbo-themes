import Foundation

/// A complete theme definition including its identifier, display label, and color palette.
public struct ThemeDefinition: Sendable {
    public let id: ThemeId
    public let label: String
    public let palette: ThemePalette

    public init(id: ThemeId, label: String, palette: ThemePalette) {
        self.id = id
        self.label = label
        self.palette = palette
    }
}
