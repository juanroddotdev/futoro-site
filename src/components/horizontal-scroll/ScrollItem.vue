<script setup lang="ts">
import { ref, computed, inject } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'content',
    validator: (value: string) => ['title', 'content'].includes(value)
  }
});

// Get scroll state from parent container
const scrollState = inject('scrollState', ref({
  scrollY: 0,
  containerTop: 0,
  containerBottom: 0,
  containerHeight: 0,
  viewportHeight: 0,
  progress: 0
}));

// Item element ref
const itemRef = ref<HTMLElement | null>(null);

// Computed styles based on scroll progress
const itemStyle = computed(() => {
  // Apply different styles based on item type
  if (props.type === 'title') {
    return {
      opacity: 1,
      transform: 'none'
    };
  }
  
  // For content items, add some parallax or fade effects
  const progress = scrollState.value.progress;
  const opacity = Math.min(1, progress * 2);
  
  return {
    opacity: opacity.toString(),
    transform: `translateY(${(1 - progress) * 20}px)`
  };
});
</script>

<template>
  <div 
    ref="itemRef" 
    class="scroll-item"
    :class="[`type-${type}`]"
    :style="itemStyle"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.scroll-item {
  flex: 0 0 auto;
  padding: 20px;
  margin: 10px;
  min-width: 300px;
  max-width: 500px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.3s ease, opacity 0.3s ease;
  
  &.type-title {
    min-width: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &.type-content {
    position: relative;
    background-color: var(--theme-card-bg, rgba(255, 255, 255, 0.05));
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
}
</style>