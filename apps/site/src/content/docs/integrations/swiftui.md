---
title: SwiftUI
description: Use Turbo Themes in iOS and macOS applications with the Swift package.
category: integrations
order: 6
prev: integrations/python
next: api-reference/index
---

# SwiftUI Integration

Use Turbo Themes design tokens in iOS and macOS applications.

## Installation

### Swift Package Manager

Add Turbo Themes to your project via Xcode:

1. Open your project in Xcode
2. Go to **File → Add Package Dependencies**
3. Enter the repository URL: `https://github.com/lgtm-hq/turbo-themes`
4. Select the version and click **Add Package**

Or add it to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/lgtm-hq/turbo-themes", from: "1.0.0")
]
```

## Basic Usage

```swift
import SwiftUI
import TurboThemes

struct ContentView: View {
    @StateObject private var themeManager = ThemeManager()

    var body: some View {
        VStack {
            Text("Hello, Turbo Themes!")
                .foregroundColor(themeManager.textPrimary)

            Button("Primary Action") {
                // action
            }
            .padding()
            .background(themeManager.brandPrimary)
            .foregroundColor(themeManager.textInverse)
            .cornerRadius(8)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(themeManager.bgBase)
    }
}
```

## ThemeManager

### Initialization

```swift
import TurboThemes

// Use default theme
let manager = ThemeManager()

// Use a specific theme
let manager = ThemeManager(themeId: .dracula)
```

### Available Themes

```swift
enum ThemeId: String, CaseIterable {
    case catppuccinMocha = "catppuccin-mocha"
    case catppuccinMacchiato = "catppuccin-macchiato"
    case catppuccinFrappe = "catppuccin-frappe"
    case catppuccinLatte = "catppuccin-latte"
    case dracula = "dracula"
    case githubDark = "github-dark"
    case githubLight = "github-light"
    case bulmaDark = "bulma-dark"
    case bulmaLight = "bulma-light"
}
```

### Switching Themes

```swift
struct ThemeSwitcher: View {
    @ObservedObject var themeManager: ThemeManager

    var body: some View {
        Picker("Theme", selection: $themeManager.currentTheme) {
            ForEach(ThemeId.allCases, id: \.self) { theme in
                Text(theme.displayName).tag(theme)
            }
        }
    }
}
```

## Color Properties

The `ThemeManager` provides all tokens as SwiftUI `Color` values:

### Backgrounds

```swift
themeManager.bgBase       // Main background
themeManager.bgSurface    // Card/surface background
themeManager.bgOverlay    // Overlay background
```

### Text

```swift
themeManager.textPrimary    // Main text color
themeManager.textSecondary  // Muted text
themeManager.textInverse    // Text on colored backgrounds
```

### Brand

```swift
themeManager.brandPrimary   // Primary accent color
```

### State Colors

```swift
themeManager.stateSuccess   // Success green
themeManager.stateWarning   // Warning yellow
themeManager.stateDanger    // Error red
themeManager.stateInfo      // Info blue
```

### Border

```swift
themeManager.borderDefault  // Default border color
```

## Building Components

### Card Component

```swift
struct ThemedCard<Content: View>: View {
    @EnvironmentObject var theme: ThemeManager
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading) {
            content
        }
        .padding()
        .background(theme.bgSurface)
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(theme.borderDefault, lineWidth: 1)
        )
        .cornerRadius(8)
    }
}

// Usage
ThemedCard {
    Text("Card Title")
        .font(.headline)
        .foregroundColor(theme.textPrimary)
    Text("Card content goes here")
        .foregroundColor(theme.textSecondary)
}
```

### Button Styles

```swift
struct PrimaryButtonStyle: ButtonStyle {
    @EnvironmentObject var theme: ThemeManager

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(theme.brandPrimary)
            .foregroundColor(theme.textInverse)
            .cornerRadius(6)
            .opacity(configuration.isPressed ? 0.8 : 1.0)
    }
}

struct DangerButtonStyle: ButtonStyle {
    @EnvironmentObject var theme: ThemeManager

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(theme.stateDanger)
            .foregroundColor(theme.textInverse)
            .cornerRadius(6)
            .opacity(configuration.isPressed ? 0.8 : 1.0)
    }
}

// Usage
Button("Save") { }
    .buttonStyle(PrimaryButtonStyle())

Button("Delete") { }
    .buttonStyle(DangerButtonStyle())
```

### Alert Component

```swift
struct ThemedAlert: View {
    @EnvironmentObject var theme: ThemeManager

    enum AlertType {
        case success, warning, danger, info
    }

    let type: AlertType
    let message: String

    var backgroundColor: Color {
        switch type {
        case .success: return theme.stateSuccess
        case .warning: return theme.stateWarning
        case .danger: return theme.stateDanger
        case .info: return theme.stateInfo
        }
    }

    var body: some View {
        Text(message)
            .padding()
            .frame(maxWidth: .infinity)
            .background(backgroundColor)
            .foregroundColor(theme.textInverse)
            .cornerRadius(8)
    }
}
```

## Environment Object Setup

Set up the theme manager at the app level:

```swift
@main
struct MyApp: App {
    @StateObject private var themeManager = ThemeManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(themeManager)
        }
    }
}
```

Then access it anywhere in your views:

```swift
struct MyView: View {
    @EnvironmentObject var theme: ThemeManager

    var body: some View {
        Text("Themed text")
            .foregroundColor(theme.textPrimary)
    }
}
```

## Persisting Theme Selection

```swift
class ThemeManager: ObservableObject {
    @Published var currentTheme: ThemeId {
        didSet {
            UserDefaults.standard.set(currentTheme.rawValue, forKey: "turbo-theme")
        }
    }

    init() {
        if let saved = UserDefaults.standard.string(forKey: "turbo-theme"),
           let theme = ThemeId(rawValue: saved) {
            self.currentTheme = theme
        } else {
            self.currentTheme = .catppuccinMocha
        }
    }
}
```

## Requirements

- iOS 15.0+
- macOS 12.0+
- Swift 5.9+

## Next Steps

- Check the [API Reference](/docs/api-reference/)
- Learn about [design tokens](/docs/getting-started/concepts/)
- Explore other [framework integrations](/docs/integrations/)
