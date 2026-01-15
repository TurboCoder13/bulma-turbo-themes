import SwiftUI
import TurboThemes

private struct MetricCard: View {
    let title: String
    let value: String
    let palette: ThemePalette

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.headline)
                .foregroundColor(palette.heading)
            Text(value)
                .font(.title2.bold())
                .foregroundColor(palette.bodyPrimary)
            Text("Metric pulled from theme colors.")
                .font(.subheadline)
                .foregroundColor(palette.bodySecondary)
        }
        .padding()
        .background(palette.backgroundSurface)
        .cornerRadius(12)
    }
}

struct ComponentsView: View {
    @StateObject private var themeManager = ThemeManager()

    var palette: ThemePalette { themeManager.theme.palette }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("SwiftUI Preview")
                            .font(.largeTitle.bold())
                            .foregroundColor(palette.heading)
                        Text("Switch themes to see palette-driven UI updates.")
                            .foregroundColor(palette.bodySecondary)
                    }
                    Spacer()
                    Picker("Theme", selection: $themeManager.currentThemeId) {
                        ForEach(ThemeId.allCases, id: \.self) { id in
                            Text(ThemeRegistry.themes[id]?.label ?? id.rawValue)
                                .tag(id)
                        }
                    }
                    .pickerStyle(.menu)
                }

                VStack(alignment: .leading, spacing: 12) {
                    Text("Typography")
                        .font(.title2.bold())
                        .foregroundColor(palette.heading)
                    Text("Heading 1").font(.largeTitle).foregroundColor(palette.heading)
                    Text("Body text using palette tokens.")
                        .foregroundColor(palette.bodyPrimary)
                    Text("Secondary text muted for hierarchy.")
                        .foregroundColor(palette.bodySecondary)
                }
                .padding()
                .background(palette.backgroundSurface)
                .cornerRadius(12)

                VStack(alignment: .leading, spacing: 12) {
                    Text("Buttons")
                        .font(.title2.bold())
                        .foregroundColor(palette.heading)
                    HStack(spacing: 12) {
                        button(label: "Primary", color: palette.brandPrimary)
                        button(label: "Success", color: palette.stateSuccess)
                        button(label: "Danger", color: palette.stateDanger)
                    }
                }
                .padding()
                .background(palette.backgroundSurface)
                .cornerRadius(12)

                VStack(alignment: .leading, spacing: 12) {
                    Text("Metrics")
                        .font(.title2.bold())
                        .foregroundColor(palette.heading)
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 12), count: 2), spacing: 12) {
                        MetricCard(title: "Active Users", value: "1,248", palette: palette)
                        MetricCard(title: "Conversions", value: "3.8%", palette: palette)
                        MetricCard(title: "Latency", value: "123 ms", palette: palette)
                        MetricCard(title: "Errors", value: "0.12%", palette: palette)
                    }
                }
                .padding()
                .background(palette.backgroundSurface)
                .cornerRadius(12)
            }
            .padding()
        }
        .background(palette.backgroundBase.ignoresSafeArea())
    }

    private func button(label: String, color: Color) -> some View {
        Text(label)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(color)
            .foregroundColor(.white)
            .cornerRadius(8)
    }
}

#Preview {
    ComponentsView()
}
