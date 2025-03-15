<script setup>
import { ref, computed, onMounted, onBeforeUnmount, provide } from 'vue';

// Component props
const props = defineProps({
  // Height of the scroll section (can be auto or fixed)
  height: {
    type: String,
    default: 'auto'
  },
  // Debug mode to show scroll indicators
  debug: {
    type: Boolean,
    default: false
  }
});

// Refs for DOM elements
const containerRef = ref(null);
const contentRef = ref(null);

// Scroll state
const scrollState = ref({
  progress: 0,
  isActive: false,
  startPosition: 0,
  endPosition: 0,
  viewportWidth: 0,
  contentWidth: 0
});

// Provide scroll state to child components
provide('scrollState', scrollState);

// Calculate scroll boundaries
const calculateScrollBoundaries = () => {
  if (!containerRef.value || !contentRef.value) return;
  
  // Get container position
  const containerRect = containerRef.value.getBoundingClientRect();
  const containerTop = window.pageYOffset + containerRect.top;
  
  // Calculate content width
  const contentWidth = contentRef.value.scrollWidth;
  
  // Calculate required height based on content width
  const viewportWidth = window.innerWidth;
  const requiredHeight = Math.max(
    window.innerHeight * 2, // Minimum height (200vh)
    window.innerHeight + (contentWidth / viewportWidth) * window.innerHeight
  );
  
  // Apply the calculated height to the container if set to auto
  if (props.height === 'auto' && containerRef.value) {
    containerRef.value.style.height = `${requiredHeight}px`;
  }
  
  // Update scroll state
  scrollState.value = {
    ...scrollState.value,
    startPosition: containerTop,
    endPosition: containerTop + requiredHeight,
    viewportWidth: viewportWidth,
    contentWidth: contentWidth
  };
};

// Handle scroll event
const handleScroll = () => {
  if (!containerRef.value) return;
  
  const scrollY = window.scrollY;
  const { startPosition, endPosition } = scrollState.value;
  
  // Check if we're in the scroll range for this section
  if (scrollY >= startPosition && scrollY <= endPosition) {
    // Calculate progress (0 to 1)
    const progress = (scrollY - startPosition) / (endPosition - startPosition);
    scrollState.value.progress = Math.max(0, Math.min(1, progress));
    scrollState.value.isActive = true;
  } else {
    // Set progress to 0 or 1 when outside range
    scrollState.value.progress = scrollY < startPosition ? 0 : 1;
    scrollState.value.isActive = false;
  }
};

// Initialize on component mount
onMounted(() => {
  // Calculate boundaries after DOM is ready
  setTimeout(() => {
    calculateScrollBoundaries();
    
    // Initial scroll check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculateScrollBoundaries);
  }, 100);
});

// Clean up event listeners
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.addEventListener('resize', calculateScrollBoundaries);
});
</script>

<template>
  <section 
    ref="containerRef" 
    class="horizontal-scroll-container"
  >
    <div 
      class="scroll-content-wrapper"
      :class="{ 'is-active': scrollState.isActive }"
    >
      <div ref="contentRef" class="scroll-content">
        <slot></slot>
      </div>
    </div>
    
    <!-- Debug overlay if enabled -->
    <div v-if="debug" class="debug-overlay">
      <div class="debug-info">
        <div>Progress: {{ Math.round(scrollState.progress * 100) }}%</div>
        <div>Active: {{ scrollState.isActive ? 'Yes' : 'No' }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.horizontal-scroll-container {
  position: relative;
  min-height: 200vh;
  overflow-x: hidden;
  z-index: 1;
}

.scroll-content-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.scroll-content-wrapper.is-active {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

.scroll-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.debug-overlay {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 4px;
  z-index: 1000;
  font-family: monospace;
}
</style>