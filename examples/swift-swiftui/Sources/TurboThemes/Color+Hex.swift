import SwiftUI

extension Color {
    /// Initialize a Color from a hex string (e.g., "#ff5500" or "ff5500").
    ///
    /// - Parameter hex: A 6-character hex color string, optionally prefixed with "#".
    /// - Note: Returns magenta for invalid hex strings to make debugging easier.
    public init(hex: String) {
        var hexString = hex
        if hexString.hasPrefix("#") {
            hexString.removeFirst()
        }

        // Validate hex string format and length
        guard hexString.count == 6,
              hexString.allSatisfy({ $0.isHexDigit }) else {
            // Fallback to magenta for invalid hex (easily visible for debugging)
            self.init(.sRGB, red: 1, green: 0, blue: 1, opacity: 1)
            return
        }

        var int: UInt64 = 0
        let scanner = Scanner(string: hexString)
        guard scanner.scanHexInt64(&int) else {
            self.init(.sRGB, red: 1, green: 0, blue: 1, opacity: 1)
            return
        }

        let r = Double((int >> 16) & 0xff) / 255
        let g = Double((int >> 8) & 0xff) / 255
        let b = Double(int & 0xff) / 255
        self.init(.sRGB, red: r, green: g, blue: b, opacity: 1)
    }

    /// Parse a hex string into RGB components.
    ///
    /// - Parameter hex: A 6-character hex color string, optionally prefixed with "#".
    /// - Returns: A tuple of (red, green, blue) values from 0-255, or nil if invalid.
    public static func parseHex(_ hex: String) -> (red: Int, green: Int, blue: Int)? {
        var hexString = hex
        if hexString.hasPrefix("#") {
            hexString.removeFirst()
        }

        guard hexString.count == 6,
              hexString.allSatisfy({ $0.isHexDigit }) else {
            return nil
        }

        var int: UInt64 = 0
        let scanner = Scanner(string: hexString)
        guard scanner.scanHexInt64(&int) else {
            return nil
        }

        return (
            red: Int((int >> 16) & 0xff),
            green: Int((int >> 8) & 0xff),
            blue: Int(int & 0xff)
        )
    }
}
