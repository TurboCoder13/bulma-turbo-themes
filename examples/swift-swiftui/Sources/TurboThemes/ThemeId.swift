import Foundation

/// Identifiers for available themes in the Turbo Themes library.
public enum ThemeId: String, CaseIterable, Sendable {
    case catppuccinMocha = "catppuccin-mocha"
    case catppuccinLatte = "catppuccin-latte"
    case catppuccinFrappe = "catppuccin-frappe"
    case catppuccinMacchiato = "catppuccin-macchiato"
    case dracula = "dracula"
    case githubDark = "github-dark"
    case githubLight = "github-light"
    case bulmaLight = "bulma-light"
    case bulmaDark = "bulma-dark"
    case gruvboxDarkHard = "gruvbox-dark-hard"
    case gruvboxDark = "gruvbox-dark"
    case gruvboxDarkSoft = "gruvbox-dark-soft"
    case gruvboxLightHard = "gruvbox-light-hard"
    case gruvboxLight = "gruvbox-light"
    case gruvboxLightSoft = "gruvbox-light-soft"
    case nord = "nord"
    case solarizedDark = "solarized-dark"
    case solarizedLight = "solarized-light"
    case rosePine = "rose-pine"
    case rosePineMoon = "rose-pine-moon"
    case rosePineDawn = "rose-pine-dawn"
}
