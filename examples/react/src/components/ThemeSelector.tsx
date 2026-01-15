import type { ThemeId, ThemeOption } from '../hooks/useTheme';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  themes: ThemeOption[];
  onThemeChange: (theme: ThemeId) => void;
}

export function ThemeSelector({ currentTheme, themes, onThemeChange }: ThemeSelectorProps) {
  return (
    <label className="theme-selector-label">
      <span className="theme-selector-text">Theme</span>
      <select
        id="theme-selector"
        className="theme-selector"
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value as ThemeId)}
        aria-label="Select theme"
      >
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.label}
          </option>
        ))}
      </select>
    </label>
  );
}
