/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--turbo-bg-base)',
        surface: 'var(--turbo-bg-surface)',
        foreground: 'var(--turbo-text-primary)',
        primary: 'var(--turbo-brand-primary)',
        success: 'var(--turbo-state-success)',
        warning: 'var(--turbo-state-warning)',
        danger: 'var(--turbo-state-danger)',
        inverse: 'var(--turbo-text-inverse)',
        secondary: 'var(--turbo-text-secondary)',
      },
      borderColor: {
        default: 'var(--turbo-border-default)',
      },
    },
  },
  plugins: [],
};
