import { useState, useEffect } from 'react';

const THEMES = [
  { id: 'catppuccin-mocha', name: 'Catppuccin Mocha' },
  { id: 'catppuccin-latte', name: 'Catppuccin Latte' },
  { id: 'dracula', name: 'Dracula' },
  { id: 'github-dark', name: 'GitHub Dark' },
  { id: 'github-light', name: 'GitHub Light' },
];

function useTheme() {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('turbo-theme') || 'catppuccin-mocha';
  });

  useEffect(() => {
    const link = document.getElementById('theme-css') as HTMLLinkElement;
    if (link) {
      link.href = `/node_modules/turbo-themes/css/themes/turbo/${theme}.css`;
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('turbo-theme', theme);
  }, [theme]);

  return { theme, setTheme: setThemeState };
}

export default function App() {
  const { theme, setTheme } = useTheme();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--turbo-heading-h1)' }}>React + Turbo Themes</h1>

      <div className="card" style={{
        background: 'var(--turbo-bg-surface)',
        border: '1px solid var(--turbo-border-default)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        marginBottom: '1rem'
      }}>
        <h2>Theme Selector</h2>
        <select
          id="theme-selector"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          aria-label="Select theme"
          style={{
            padding: '0.5rem',
            borderRadius: '0.25rem',
            border: '1px solid var(--turbo-border-default)',
            background: 'var(--turbo-bg-surface)',
            color: 'var(--turbo-text-primary)'
          }}
        >
          {THEMES.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="card" style={{
        background: 'var(--turbo-bg-surface)',
        border: '1px solid var(--turbo-border-default)',
        borderRadius: '0.5rem',
        padding: '1.5rem'
      }}>
        <h2>Buttons</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-primary" style={{
            background: 'var(--turbo-brand-primary)',
            color: 'var(--turbo-text-inverse)',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer'
          }}>Primary</button>
          <button className="btn-success" style={{
            background: 'var(--turbo-state-success)',
            color: 'var(--turbo-text-inverse)',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer'
          }}>Success</button>
          <button className="btn-danger" style={{
            background: 'var(--turbo-state-danger)',
            color: 'var(--turbo-text-inverse)',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer'
          }}>Danger</button>
        </div>
      </div>

      <p style={{ marginTop: '1rem', color: 'var(--turbo-text-secondary)' }}>
        Current theme: <code>{theme}</code>
      </p>
    </div>
  );
}
