import { useTheme } from './hooks/useTheme';
import { ThemeSelector } from './components/ThemeSelector';
import { Card } from './components/Card';
import '../../shared/demo-styles.css';

export default function App() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="title">React + Turbo Themes</h1>
          <p className="subtitle">Theme switching with React hooks and CSS custom properties.</p>
        </div>
        <ThemeSelector currentTheme={theme} themes={themes} onThemeChange={setTheme} />
      </header>

      <main className="main">
        <Card title="Buttons">
          <div className="buttons">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-success">Success</button>
            <button className="btn btn-danger">Danger</button>
          </div>
        </Card>

        <Card title="Content">
          <p>
            Body text using <code>var(--turbo-text-primary)</code>. Secondary copy uses{' '}
            <span className="muted">var(--turbo-text-muted)</span>.
          </p>
          <ul>
            <li>Lists inherit typography tokens.</li>
            <li>
              Background surfaces use <code>--turbo-bg-surface</code>.
            </li>
            <li>
              Borders use <code>--turbo-border-default</code>.
            </li>
          </ul>
        </Card>

        <Card title="Metrics">
          <div className="metrics">
            <div className="metric">
              <div className="metric-label">Active Users</div>
              <strong className="metric-value">1,248</strong>
            </div>
            <div className="metric">
              <div className="metric-label">Conversions</div>
              <strong className="metric-value">3.8%</strong>
            </div>
            <div className="metric">
              <div className="metric-label">Latency</div>
              <strong className="metric-value">123 ms</strong>
            </div>
          </div>
        </Card>

        <Card title="Color Swatches">
          <div className="swatches">
            <div className="swatch swatch-primary" title="Primary" />
            <div className="swatch swatch-success" title="Success" />
            <div className="swatch swatch-warning" title="Warning" />
            <div className="swatch swatch-danger" title="Danger" />
            <div className="swatch swatch-info" title="Info" />
          </div>
        </Card>
      </main>

      <footer className="footer">
        <p>
          Current theme: <code>{theme}</code>
        </p>
      </footer>
    </div>
  );
}
