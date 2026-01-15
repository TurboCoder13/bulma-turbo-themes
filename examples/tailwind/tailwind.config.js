/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        // Base theme colors (use CSS custom properties)
        background: 'var(--turbo-bg-base)',
        surface: 'var(--turbo-bg-surface)',
        'surface-alt': 'var(--turbo-bg-overlay)',
        foreground: 'var(--turbo-text-primary)',
        muted: 'var(--turbo-text-secondary)',
        inverse: 'var(--turbo-text-inverse)',
        // Brand colors
        primary: 'var(--turbo-brand-primary)',
        // State colors
        success: 'var(--turbo-state-success)',
        warning: 'var(--turbo-state-warning)',
        danger: 'var(--turbo-state-danger)',
        info: 'var(--turbo-state-info)',
        // Border colors
        default: 'var(--turbo-border-default)',
        strong: 'var(--turbo-border-strong)',
      },
      borderColor: {
        default: 'var(--turbo-border-default)',
        strong: 'var(--turbo-border-strong)',
      },
      fontFamily: {
        sans: 'var(--turbo-font-sans)',
        mono: 'var(--turbo-font-mono)',
      },
    },
  },
  plugins: [],
};
