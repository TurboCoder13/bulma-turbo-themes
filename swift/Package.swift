// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "TurboThemes",
    platforms: [
        .iOS(.v17), .macOS(.v14), .tvOS(.v17), .watchOS(.v10)
    ],
    products: [
        .library(name: "TurboThemes", targets: ["TurboThemes"]),
    ],
    targets: [
        .target(
            name: "TurboThemes",
            path: "Sources/TurboThemes",
            resources: [
                .process("Resources")
            ]
        ),
        .testTarget(
            name: "TurboThemesTests",
            dependencies: ["TurboThemes"],
            path: "Tests/TurboThemesTests"
        ),
        .testTarget(
            name: "TurboThemesUITests",
            dependencies: ["TurboThemes"],
            path: "Tests/TurboThemesUITests"
        ),
    ]
)
