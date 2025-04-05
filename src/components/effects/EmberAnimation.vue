<template>
  <div class="ember-container" ref="emberContainer">
    <!-- Ember particles will be added here dynamically -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import gsap from 'gsap';
import { effectTypes } from './particleEffects.js';

const props = defineProps({
  targetElement: {
    type: Object,
    required: false,
    default: null
  },
  particleCount: {
    type: Number,
    default: 15
  },
  duration: {
    type: Number,
    default: 2
  },
  colors: {
    type: Array,
    default: () => ['#ff4500', '#ff7800', '#ffaa33', '#ffcc00']
  },
  // Add offset props to adjust position
  offsetX: {
    type: Number,
    default: 0
  },
  offsetY: {
    type: Number,
    default: 0
  },
  // Control where embers originate from (0-100%)
  originX: {
    type: Number,
    default: 50 // center by default
  },
  originY: {
    type: Number,
    default: 0  // top by default
  },
  // New prop to position relative to parent
  relativeToParent: {
    type: Boolean,
    default: false
  },
  // New prop to delay the start of the effect
  startDelay: {
    type: Number,
    default: 0
  },
  // New prop to control when the effect is active
  active: {
    type: Boolean,
    default: true
  },
  // Add effect type prop to choose which particle effect to use
  effectType: {
    type: String,
    default: 'ember',
    validator: (value) => Object.keys(effectTypes).includes(value)
  }
});

const emit = defineEmits(['ember-start']);

const emberContainer = ref(null);
let animationTimeline = null;
let startTimer = null;

const createEmbers = () => {
  if (!props.targetElement || !emberContainer.value) return;
  
  // Get current timestamp for timing comparison
  const startTime = Date.now();
  const startTimeISO = new Date().toISOString();
  
  // Emit that ember effect is starting
  emit('ember-start');
  
  const container = emberContainer.value;
  
  // Position the ember container
  if (props.relativeToParent) {
    // Position relative to parent - much simpler positioning
    container.style.position = 'absolute';
    container.style.inset = '0'; // Cover the entire parent
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-1'; // Place behind the content
  } else {
    // Original absolute positioning relative to viewport
    const targetRect = props.targetElement.getBoundingClientRect();
    container.style.position = 'absolute';
    container.style.left = `${targetRect.left + props.offsetX}px`;
    container.style.top = `${targetRect.top + props.offsetY}px`;
    container.style.width = `${targetRect.width}px`;
    container.style.height = `${targetRect.height}px`;
    container.style.pointerEvents = 'none';
    container.style.zIndex = '100';
  }
  
  // Clear any existing embers
  container.innerHTML = '';
  
  // Create ember particles using the imported functions
  animationTimeline = gsap.timeline();
  
  // Get the appropriate effect creator and animator
  const effectCreator = effectTypes[props.effectType].create;
  const effectAnimator = effectTypes[props.effectType].animate;
  
  // Create the particle effect
  for (let i = 0; i < props.particleCount; i++) {
    const particleProps = {
      colors: props.colors,
      originX: props.originX,
      originY: props.originY,
      duration: props.duration
    };
    
    // Create the particle using the imported function
    const particle = effectCreator(container, particleProps);
    
    // Animate the particle using the imported function
    effectAnimator(particle, animationTimeline, particleProps);
  }
};

// Update position on window resize
const updatePosition = () => {
  if (!props.relativeToParent && props.targetElement && emberContainer.value) {
    const targetRect = props.targetElement.getBoundingClientRect();
    const container = emberContainer.value;
    container.style.left = `${targetRect.left + props.offsetX}px`;
    container.style.top = `${targetRect.top + props.offsetY}px`;
    container.style.width = `${targetRect.width}px`;
    container.style.height = `${targetRect.height}px`;
  }
};

// Add resize listener
let resizeObserver = null;

onMounted(() => {
  // Skip the timeout completely if startDelay is 0
  if (props.startDelay <= 0) {
    nextTick(() => {
      createEmbers();
    });
  } else {
    startTimer = setTimeout(() => {
      createEmbers();
    }, props.startDelay * 1000);
  }
  
  // Add resize observer to update position when window resizes
  if (!props.relativeToParent) {
    resizeObserver = new ResizeObserver(updatePosition);
    if (props.targetElement) {
      resizeObserver.observe(props.targetElement);
    }
    window.addEventListener('scroll', updatePosition, { passive: true });
  }
});

// Watch for changes to targetElement and recreate embers
watch(() => props.targetElement, (newVal) => {
  if (newVal) {
    // Kill previous animation if exists
    if (animationTimeline) {
      animationTimeline.kill();
    }
    
    createEmbers();
    
    // Update resize observer
    if (resizeObserver && !props.relativeToParent) {
      resizeObserver.disconnect();
      resizeObserver.observe(newVal);
    }
  }
}, { immediate: true });

// Watch for changes to the active prop
watch(() => props.active, (newVal) => {
  if (newVal && props.targetElement) {
    // Kill previous animation if exists
    if (animationTimeline) {
      animationTimeline.kill();
    }
    createEmbers();
  }
}, { immediate: true });

onBeforeUnmount(() => {
  if (animationTimeline) {
    animationTimeline.kill();
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (startTimer) {
    clearTimeout(startTimer);
  }
  window.removeEventListener('scroll', updatePosition);
});
</script>

<style scoped>
.ember-container {
  overflow: visible;
}
</style>
