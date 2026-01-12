import SwiftUI

/// A collection of color tokens representing a theme's color palette.
public struct ThemePalette: Sendable {
    public let backgroundBase: Color
    public let backgroundSurface: Color
    public let heading: Color
    public let bodyPrimary: Color
    public let bodySecondary: Color
    public let brandPrimary: Color
    public let stateSuccess: Color
    public let stateDanger: Color
    public let stateWarning: Color
    public let stateInfo: Color

    public init(
        backgroundBase: Color,
        backgroundSurface: Color,
        heading: Color,
        bodyPrimary: Color,
        bodySecondary: Color,
        brandPrimary: Color,
        stateSuccess: Color,
        stateDanger: Color,
        stateWarning: Color,
        stateInfo: Color
    ) {
        self.backgroundBase = backgroundBase
        self.backgroundSurface = backgroundSurface
        self.heading = heading
        self.bodyPrimary = bodyPrimary
        self.bodySecondary = bodySecondary
        self.brandPrimary = brandPrimary
        self.stateSuccess = stateSuccess
        self.stateDanger = stateDanger
        self.stateWarning = stateWarning
        self.stateInfo = stateInfo
    }
}
