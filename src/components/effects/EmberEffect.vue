<template>
  <div class="ember-container" ref="emberContainer">
    <!-- Ember particles will be added here dynamically -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import gsap from 'gsap';

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
  }
});

const emit = defineEmits(['ember-start']);

const emberContainer = ref(null);
let animationTimeline = null;
let startTimer = null;

const createEmbers = () => {
  if (!props.targetElement || !emberContainer.value) return;
  
  console.log('createEmbers called at:', new Date().toISOString());
  console.log('targetElement:', props.targetElement);
  console.log('emberContainer:', emberContainer.value);
  
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
  
  // Create ember particles
  animationTimeline = gsap.timeline();
  
  for (let i = 0; i < props.particleCount; i++) {
    const ember = document.createElement('div');
    ember.className = 'ember-particle';
    
    // Random ember styling
    const size = 3 + Math.random() * 5;
    const color = props.colors[Math.floor(Math.random() * props.colors.length)];
    
    Object.assign(ember.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      borderRadius: '50%',
      boxShadow: `0 0 ${size * 2}px ${color}`,
      opacity: 0.8 + Math.random() * 0.2,
      // Position based on origin settings with some randomness
      left: `${props.originX - 10 + Math.random() * 20}%`,
      top: `${props.originY - 10 + Math.random() * 20}%`,
      pointerEvents: 'none'
    });
    
    container.appendChild(ember);
    
    // Animate each ember
    animationTimeline.to(ember, {
      y: -50 - Math.random() * 100,
      x: (Math.random() - 0.5) * 50,
      opacity: 0,
      duration: 0.5 + Math.random() * props.duration,
      ease: 'power1.out',
      delay: Math.random() * 0.5,
      onComplete: () => ember.remove()
    }, 0);
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
  console.log('EmberEffect component mounted at:', new Date().toISOString());
  
  // Skip the timeout completely if startDelay is 0
  if (props.startDelay <= 0) {
    console.log('Starting createEmbers immediately at:', new Date().toISOString());
    nextTick(() => {
      createEmbers();
    });
  } else {
    console.log(`Setting timeout for ${props.startDelay} seconds at:`, new Date().toISOString());
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
  console.log('targetElement changed at:', new Date().toISOString());
  
  if (newVal) {
    console.log('New targetElement:', newVal);
    
    // Kill previous animation if exists
    if (animationTimeline) {
      animationTimeline.kill();
    }
    
    console.log('Calling createEmbers from watcher at:', new Date().toISOString());
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
    console.log('EmberEffect activated at:', new Date().toISOString());
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
