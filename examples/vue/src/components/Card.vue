<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <section class="card">
    <h2 class="card-title">{{ title }}</h2>
    <div class="card-content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.card {
  background: var(--turbo-bg-surface);
  border: 1px solid var(--turbo-border-default);
  border-radius: 0.625rem;
  padding: 1rem;
  box-shadow: 0 4px 20px color-mix(in srgb, var(--turbo-shadow-200) 60%, transparent);
}

.card-title {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  color: var(--turbo-text-primary);
}

.card-content {
  color: var(--turbo-text-primary);
}
</style>
