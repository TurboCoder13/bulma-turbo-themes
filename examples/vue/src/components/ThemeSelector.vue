<script setup lang="ts">
import type { ThemeId, ThemeOption } from '../composables/useTheme';

defineProps<{
  currentTheme: ThemeId;
  themes: ThemeOption[];
}>();

const emit = defineEmits<{
  themeChange: [theme: ThemeId];
}>();

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('themeChange', target.value as ThemeId);
}
</script>

<template>
  <label class="theme-selector-label">
    <span class="theme-selector-text">Theme</span>
    <select
      id="theme-selector"
      class="theme-selector"
      :value="currentTheme"
      aria-label="Select theme"
      @change="handleChange"
    >
      <option v-for="theme in themes" :key="theme.id" :value="theme.id">
        {{ theme.label }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.theme-selector-label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.theme-selector-text {
  font-size: 0.875rem;
  color: var(--turbo-text-muted);
}

.theme-selector {
  padding: 0.5rem;
  background: var(--turbo-bg-overlay);
  color: var(--turbo-text-primary);
  border: 1px solid var(--turbo-border-default);
  border-radius: 0.375rem;
  font: inherit;
  cursor: pointer;
}

.theme-selector:focus {
  outline: 2px solid var(--turbo-brand-primary);
  outline-offset: 2px;
}
</style>
