<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Component props
const props = defineProps({
  // Element to track
  target: {
    type: Object,
    default: null
  },
  // Offset from top and bottom
  offset: {
    type: Object,
    default: () => ({ top: 0, bottom: 0 })
  },
  // Throttle in milliseconds
  throttle: {
    type: Number,
    default: 16 // ~60fps
  }
});

// Emit events
const emit = defineEmits(['update', 'enter', 'exit']);

// Track position
const position = ref({
  progress: 0,
  isVisible: false,
  top: 0,
  bottom: 0,
  height: 0
});

// Throttle function
const throttled = (fn, delay) => {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  };
};

// Update position
const updatePosition = () => {
  if (!props.target) return;
  
  const rect = props.target.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  // Calculate visibility
  const topVisible = rect.top + props.offset.top < windowHeight && rect.top > -rect.height;
  const bottomVisible = rect.bottom + props.offset.bottom > 0 && rect.bottom < windowHeight * 2;
  const isVisible = topVisible && bottomVisible;
  
  // Calculate progress (0 when element enters viewport, 1 when it exits)
  let progress = 0;
  
  if (rect.top <= 0) {
    // Element is at or has passed the top of viewport
    progress = Math.min(1, Math.abs(rect.top) / (rect.height - windowHeight));
  }
  
  // Update position
  position.value = {
    progress,
    isVisible,
    top: rect.top,
    bottom: rect.bottom,
    height: rect.height
  };
  
  // Emit update event
  emit('update', position.value);
  
  // Emit enter/exit events
  if (isVisible && !position.value.isVisible) {
    emit('enter', position.value);
  } else if (!isVisible && position.value.isVisible) {
    emit('exit', position.value);
  }
};

// Throttled update function
const throttledUpdate = throttled(updatePosition, props.throttle);

// Initialize on component mount
onMounted(() => {
  // Initial update
  updatePosition();
  
  // Add scroll event listener
  window.addEventListener('scroll', throttledUpdate);
  window.addEventListener('resize', throttledUpdate);
});

// Clean up event listeners
onBeforeUnmount(() => {
  window.removeEventListener('scroll', throttledUpdate);
  window.removeEventListener('resize', throttledUpdate);
});
</script>

<template>
  <!-- This component doesn't render anything -->
</template>