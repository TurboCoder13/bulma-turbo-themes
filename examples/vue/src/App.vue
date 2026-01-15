<script setup lang="ts">
import { useTheme } from './composables/useTheme';
import ThemeSelector from './components/ThemeSelector.vue';
import Card from './components/Card.vue';

const { theme, setTheme, themes } = useTheme();
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <h1 class="title">Vue + Turbo Themes</h1>
        <p class="subtitle">
          Theme switching with Vue 3 Composition API and CSS custom properties.
        </p>
      </div>
      <ThemeSelector :current-theme="theme" :themes="themes" @theme-change="setTheme" />
    </header>

    <main class="main">
      <Card title="Buttons">
        <div class="buttons">
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-success">Success</button>
          <button class="btn btn-danger">Danger</button>
        </div>
      </Card>

      <Card title="Content">
        <p>
          Body text using <code>var(--turbo-text-primary)</code>. Secondary copy uses
          <span class="muted">var(--turbo-text-muted)</span>.
        </p>
        <ul>
          <li>Lists inherit typography tokens.</li>
          <li>Background surfaces use <code>--turbo-bg-surface</code>.</li>
          <li>Borders use <code>--turbo-border-default</code>.</li>
        </ul>
      </Card>

      <Card title="Metrics">
        <div class="metrics">
          <div class="metric">
            <div class="metric-label">Active Users</div>
            <strong class="metric-value">1,248</strong>
          </div>
          <div class="metric">
            <div class="metric-label">Conversions</div>
            <strong class="metric-value">3.8%</strong>
          </div>
          <div class="metric">
            <div class="metric-label">Latency</div>
            <strong class="metric-value">123 ms</strong>
          </div>
        </div>
      </Card>

      <Card title="Color Swatches">
        <div class="swatches">
          <div class="swatch swatch-primary" title="Primary" />
          <div class="swatch swatch-success" title="Success" />
          <div class="swatch swatch-warning" title="Warning" />
          <div class="swatch swatch-danger" title="Danger" />
          <div class="swatch swatch-info" title="Info" />
        </div>
      </Card>
    </main>

    <footer class="footer">
      <p>
        Current theme: <code>{{ theme }}</code>
      </p>
    </footer>
  </div>
</template>

<!-- Global styles imported from shared/demo-styles.css in main.ts -->
