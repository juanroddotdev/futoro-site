<script setup lang="ts">
import { ref, computed, inject, onMounted, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  direction: {
    type: String,
    default: 'normal',
    validator: (value: string) => ['normal', 'reverse'].includes(value)
  },
  slideInReverse: {
    type: Boolean,
    default: false
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

const debug = inject('debug', false);

// Row element ref
const rowRef = ref<HTMLElement | null>(null);
const rowWidth = ref(0);
const viewportWidth = ref(0);

// Calculate the transform style based on scroll progress
const transformStyle = computed(() => {
  if (!rowRef.value) return '';
  
  const isReverse = props.direction === 'reverse';
  const maxTranslation = -(rowWidth.value - viewportWidth.value);
  
  // Calculate translation based on direction
  let translateX;
  if (isReverse) {
    translateX = (1 - scrollState.value.progress) * maxTranslation;
  } else {
    translateX = scrollState.value.progress * maxTranslation;
  }
  
  return `translateX(${translateX}px)`;
});

// Update row dimensions
const updateDimensions = () => {
  if (!rowRef.value) return;
  
  // Get the total width of all items
  rowWidth.value = rowRef.value.scrollWidth;
  viewportWidth.value = window.innerWidth;
};

// Watch for changes in the DOM that might affect dimensions
const observer = ref<ResizeObserver | null>(null);

onMounted(() => {
  updateDimensions();
  
  // Set up resize observer to track changes in row width
  observer.value = new ResizeObserver(updateDimensions);
  if (rowRef.value) {
    observer.value.observe(rowRef.value);
  }
  
  // Also update on window resize
  window.addEventListener('resize', updateDimensions);
});

// Clean up
watch(() => rowRef.value, (newRef, oldRef) => {
  if (observer.value) {
    if (oldRef) observer.value.unobserve(oldRef);
    if (newRef) observer.value.observe(newRef);
  }
});
</script>

<template>
  <div class="scroll-row" :class="{ 'reverse': direction === 'reverse' }">
    <h3 v-if="title" class="row-title">{{ title }}</h3>
    
    <div class="row-content">
      <div 
        ref="rowRef" 
        class="row-items"
        :style="{ transform: transformStyle }"
      >
        <slot></slot>
      </div>
    </div>
    
    <!-- Debug info -->
    <div v-if="debug" class="row-debug">
      <div>Row Width: {{ rowWidth }}px</div>
      <div>Viewport Width: {{ viewportWidth }}px</div>
      <div>Direction: {{ direction }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll-row {
  position: relative;
  margin-bottom: 40px;
  
  .row-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .row-content {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  
  .row-items {
    display: flex;
    flex-direction: row;
    will-change: transform;
    transition: transform 0.1s ease-out;
    
    // Reverse direction for the reverse row
    &.reverse {
      flex-direction: row-reverse;
    }
  }
  
  // Debug styles
  .row-debug {
    position: absolute;
    bottom: -30px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 10px;
    line-height: 1.2;
    display: flex;
    gap: 10px;
  }
}
</style>