<template>
  <div class="playground-container">
    <header class="playground-header">
      <h1 class="text-3xl font-bold">Component Playground</h1>
      <div class="component-selector">
        <label for="component-select">Select Component:</label>
        <select 
          id="component-select" 
          v-model="selectedComponent"
          class="select-input"
        >
          <option value="vertical-scroll">Vertical Scroll Example</option>
          <option value="horizontal-scroll">Horizontal Scroll Example</option>
          <!-- Add more components as needed -->
        </select>
      </div>
    </header>

    <main class="playground-content">
      <!-- Dynamic component rendering based on selection -->
      <component :is="componentToRender"></component>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import VerticalScrollExample from '@/examples/VerticalScrollExample.vue';
import HorizontalScrollExample from '@/examples/HorizontalScrollExample.vue';

// Track selected component
const selectedComponent = ref('vertical-scroll');

// Dynamically determine which component to render
const componentToRender = computed(() => {
  switch (selectedComponent.value) {
    case 'vertical-scroll':
      return VerticalScrollExample;
    case 'horizontal-scroll':
      return HorizontalScrollExample;
    default:
      return VerticalScrollExample;
  }
});
</script>

<style scoped>
.playground-container {
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--theme-background, #121212);
  color: var(--theme-text, #ffffff);
}

.playground-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--theme-border, #333333);
}

.component-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.select-input {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: var(--theme-card-bg, #1a1a1a);
  color: var(--theme-text, #ffffff);
  border: 1px solid var(--theme-border, #333333);
}

.playground-content {
  position: relative;
  width: 100%;
}
</style>
