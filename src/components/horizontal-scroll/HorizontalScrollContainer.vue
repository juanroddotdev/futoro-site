<script setup lang="ts">
import { ref, provide, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  debug: {
    type: Boolean,
    default: false
  }
});

// Scroll state that will be provided to child components
const scrollState = ref({
  scrollY: 0,
  containerTop: 0,
  containerBottom: 0,
  containerHeight: 0,
  viewportHeight: 0,
  progress: 0
});

// Container ref
const containerRef = ref<HTMLElement | null>(null);

// Update scroll state
const updateScrollState = () => {
  if (!containerRef.value) return;
  
  const rect = containerRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  scrollState.value = {
    scrollY: window.scrollY,
    containerTop: rect.top + window.scrollY,
    containerBottom: rect.bottom + window.scrollY,
    containerHeight: rect.height,
    viewportHeight,
    progress: calculateScrollProgress(rect, viewportHeight)
  };
};

// Calculate scroll progress (0 to 1)
const calculateScrollProgress = (rect: DOMRect, viewportHeight: number) => {
  // Start when the top of the container is at the bottom of the viewport
  const start = rect.top - viewportHeight;
  // End when the bottom of the container is at the top of the viewport
  const end = rect.bottom;
  
  // Total scrollable distance
  const total = end - start;
  
  // Current scroll position relative to the container
  const current = -start;
  
  // Calculate progress (0 to 1)
  return Math.max(0, Math.min(1, current / total));
};

// Handle scroll event
const handleScroll = () => {
  window.requestAnimationFrame(updateScrollState);
};

// Handle resize event
const handleResize = () => {
  updateScrollState();
};

// Provide scroll state to child components
provide('scrollState', scrollState);
provide('debug', props.debug);

// Lifecycle hooks
onMounted(() => {
  updateScrollState();
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div ref="containerRef" class="horizontal-scroll-container">
    <slot></slot>
    
    <!-- Debug overlay -->
    <div v-if="debug" class="debug-overlay">
      <div class="debug-panel">
        <h4>Scroll Debug</h4>
        <div>Progress: {{ (scrollState.progress * 100).toFixed(1) }}%</div>
        <div>Container Top: {{ Math.round(scrollState.containerTop) }}px</div>
        <div>Container Bottom: {{ Math.round(scrollState.containerBottom) }}px</div>
        <div>Container Height: {{ Math.round(scrollState.containerHeight) }}px</div>
        <div>Viewport Height: {{ scrollState.viewportHeight }}px</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.horizontal-scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  
  // Debug styles
  .debug-overlay {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    pointer-events: none;
    
    .debug-panel {
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      line-height: 1.5;
      
      h4 {
        margin: 0 0 5px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>