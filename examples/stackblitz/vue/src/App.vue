<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const THEMES = [
  { id: 'catppuccin-mocha', name: 'Catppuccin Mocha' },
  { id: 'catppuccin-macchiato', name: 'Catppuccin Macchiato' },
  { id: 'catppuccin-frappe', name: 'Catppuccin Frappe' },
  { id: 'catppuccin-latte', name: 'Catppuccin Latte' },
  { id: 'dracula', name: 'Dracula' },
  { id: 'gruvbox-dark-hard', name: 'Gruvbox Dark Hard' },
  { id: 'gruvbox-dark', name: 'Gruvbox Dark' },
  { id: 'gruvbox-dark-soft', name: 'Gruvbox Dark Soft' },
  { id: 'gruvbox-light-hard', name: 'Gruvbox Light Hard' },
  { id: 'gruvbox-light', name: 'Gruvbox Light' },
  { id: 'gruvbox-light-soft', name: 'Gruvbox Light Soft' },
  { id: 'github-dark', name: 'GitHub Dark' },
  { id: 'github-light', name: 'GitHub Light' },
  { id: 'bulma-dark', name: 'Bulma Dark' },
  { id: 'bulma-light', name: 'Bulma Light' },
  { id: 'nord', name: 'Nord' },
  { id: 'solarized-dark', name: 'Solarized Dark' },
  { id: 'solarized-light', name: 'Solarized Light' },
  { id: 'rose-pine', name: 'Rosé Pine' },
  { id: 'rose-pine-moon', name: 'Rosé Pine Moon' },
  { id: 'rose-pine-dawn', name: 'Rosé Pine Dawn' },
] as const;

const VALID_THEME_IDS = THEMES.map((t) => t.id);
const DEFAULT_THEME = 'catppuccin-mocha';

function isValidTheme(themeId: string): themeId is (typeof THEMES)[number]['id'] {
  return VALID_THEME_IDS.includes(themeId as (typeof THEMES)[number]['id']);
}

const theme = ref<string>(DEFAULT_THEME);

function applyTheme(themeId: string) {
  // Validate theme before using in URL to prevent XSS
  if (!isValidTheme(themeId)) return;

  const link = document.getElementById('theme-css') as HTMLLinkElement;
  if (link) {
    link.href = `/node_modules/turbo-themes/css/themes/turbo/${themeId}.css`;
  }
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem('turbo-theme', themeId);
}

onMounted(() => {
  const saved = localStorage.getItem('turbo-theme');
  if (saved) {
    theme.value = saved;
  }
  applyTheme(theme.value);
});

watch(theme, (newTheme) => {
  applyTheme(newTheme);
});
</script>

<template>
  <div class="container">
    <h1>Vue + Turbo Themes</h1>

    <div class="card">
      <h2>Theme Selector</h2>
      <select id="theme-selector" v-model="theme" aria-label="Select theme">
        <option v-for="t in THEMES" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
    </div>

    <div class="card">
      <h2>Buttons</h2>
      <div class="buttons">
        <button class="btn btn-primary">Primary</button>
        <button class="btn btn-success">Success</button>
        <button class="btn btn-danger">Danger</button>
      </div>
    </div>

    <p class="footer">
      Current theme: <code>{{ theme }}</code>
    </p>
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: var(--turbo-heading-h1);
}

.card {
  background: var(--turbo-bg-surface);
  border: 1px solid var(--turbo-border-default);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

select {
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--turbo-border-default);
  background: var(--turbo-bg-surface);
  color: var(--turbo-text-primary);
}

.buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background: var(--turbo-brand-primary);
  color: var(--turbo-text-inverse);
}

.btn-success {
  background: var(--turbo-state-success);
  color: var(--turbo-text-inverse);
}

.btn-danger {
  background: var(--turbo-state-danger);
  color: var(--turbo-text-inverse);
}

.footer {
  margin-top: 1rem;
  color: var(--turbo-text-secondary);
}
</style>
