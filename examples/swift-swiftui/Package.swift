// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "TurboThemes",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        // Library product for external consumption
        .library(
            name: "TurboThemes",
            targets: ["TurboThemes"]
        ),
        // Showcase app for development/preview
        .executable(
            name: "ThemeShowcaseApp",
            targets: ["ThemeShowcaseApp"]
        )
    ],
    targets: [
        // Core library with theme tokens and management
        .target(
            name: "TurboThemes",
            path: "Sources/TurboThemes"
        ),
        // Showcase app demonstrating the library
        .executableTarget(
            name: "ThemeShowcaseApp",
            dependencies: ["TurboThemes"],
            path: "Sources/ThemeShowcase"
        ),
        // Unit tests for the library
        .testTarget(
            name: "TurboThemesTests",
            dependencies: ["TurboThemes"],
            path: "Tests/TurboThemesTests"
        )
    ]
)
