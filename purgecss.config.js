// SPDX-License-Identifier: MIT
export default {
  content: [
    './_layouts/**/*.html',
    './index.md',
    './components.md',
    './forms.md',
    './_es/**/*.md',
    './src/**/*.ts',
    './assets/js/**/*.js',
  ],

  // Safelist - classes that should never be purged
  safelist: {
    // Standard patterns - only keep specific classes we need
    standard: [
      /^theme-/, // All theme classes
      'is-active', // Used in dropdown
      'is-hoverable', // Used in navbar
      'is-spaced', // Used in navbar
      'is-rounded', // Used in buttons
      'is-small', // Used in buttons
      'is-hidden', // Used for theme select
      'has-addons', // Used in button groups
      'has-text-centered', // Used in footer
      'has-icons-left', // Used in controls
      'dropdown',
      'dropdown-trigger',
      'dropdown-menu',
      'dropdown-content',
      'dropdown-item',
      'is-right', // Dropdown alignment
      'is-theme', // Custom dropdown class
    ],

    // Deep patterns (including children)
    deep: [/^theme-/],

    // Greedy patterns
    greedy: [],
  },

  // CSS variables should be kept
  variables: true,

  // Keep keyframes
  keyframes: true,

  // Keep font-face
  fontFace: true,
};
