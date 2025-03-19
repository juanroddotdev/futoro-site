<template>
  <div 
    ref="containerRef" 
    :class="['animated-text-container', { 'initially-hidden': initiallyHidden }]"
  >
    <span v-if="firstPart" ref="firstPartRef" :class="{ 'theme-text--gradient': useGradient }">{{ firstPart }}</span>
    <span v-if="secondPart" ref="secondPartRef" :class="{ 'theme-text--gradient': useGradient }">{{ secondPart }}</span>
    <span v-if="suffix" ref="suffixRef" :class="{ 'theme-text--gradient': useGradient }">{{ suffix }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue';
import { textAnimations } from './textAnimations';
import gsap from 'gsap';

const props = defineProps({
  firstPart: {
    type: String,
    required: true
  },
  secondPart: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  useGradient: {
    type: Boolean,
    default: false
  },
  animation: {
    type: String,
    default: 'fade'
  },
  duration: {
    type: Number,
    default: 1
  },
  delay: {
    type: Number,
    default: 0
  },
  ease: {
    type: String,
    default: 'power2.out'
  },
  // Add a key prop to force re-render
  resetKey: {
    type: Number,
    default: 0
  },
  // New prop
  triggerOnVisible: {
    type: Boolean,
    default: true
  },
  // New prop
  restartOnVisible: {
    type: Boolean,
    default: true
  },
  // Add initiallyHidden prop
  initiallyHidden: {
    type: Boolean,
    default: false
  }
});

const containerRef = ref<HTMLElement | null>(null);
const firstPartRef = ref<HTMLElement | null>(null);
const secondPartRef = ref<HTMLElement | null>(null);
const suffixRef = ref<HTMLElement | null>(null);
const hasAnimated = ref(false);
let observer: IntersectionObserver | null = null;

const initAnimation = async () => {
  await nextTick();
  
  if (containerRef.value) {
    // Add animated class to make it visible if initially hidden
    if (props.initiallyHidden) {
      containerRef.value.classList.add('animated');
    }
    
    // Create an array of all elements that should be animated
    const elements = [
      firstPartRef.value,
      secondPartRef.value,
      suffixRef.value
    ].filter(Boolean) as HTMLElement[];
    
    // Store original text for each element
    elements.forEach(el => {
      if (el && !el.getAttribute('data-original-text')) {
        el.setAttribute('data-original-text', el.textContent || '');
      }
    });
    
    // Kill any existing animations
    elements.forEach(el => {
      if (el) gsap.killTweensOf(el);
    });
    
    // Apply animation with options
    textAnimations.applyAnimation(props.animation, elements, {
      duration: props.duration,
      delay: props.delay,
      ease: props.ease
    });
    
    hasAnimated.value = true;
  }
};

const setupObserver = () => {
  // Clean up any existing observer
  if (observer) {
    observer.disconnect();
  }
  
  // Create new observer
  observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    
    if (entry.isIntersecting) {
      // If element is visible
      if (!hasAnimated.value || props.restartOnVisible) {
        initAnimation();
        
        // If we don't want to restart, disconnect after first animation
        if (!props.restartOnVisible) {
          observer?.disconnect();
        }
      }
    } else {
      // Element is not visible, reset hasAnimated if restartOnVisible is true
      if (props.restartOnVisible) {
        hasAnimated.value = false;
      }
    }
  }, { threshold: 0.2 }); // Trigger when 20% visible
  
  if (containerRef.value) {
    observer.observe(containerRef.value);
  }
};

onMounted(() => {
  // Store original text content for reset purposes
  if (firstPartRef.value) {
    firstPartRef.value.setAttribute('data-original-text', props.firstPart);
  }
  if (secondPartRef.value) {
    secondPartRef.value.setAttribute('data-original-text', props.secondPart);
  }
  if (suffixRef.value) {
    suffixRef.value.setAttribute('data-original-text', props.suffix);
  }
  
  if (props.triggerOnVisible) {
    setupObserver();
  } else {
    // Trigger animation immediately
    initAnimation();
  }
});

// Clean up observer on component unmount
onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

// Watch for resetKey changes to restart animation
watch(() => props.resetKey, initAnimation);
</script>

<style scoped>
.animated-text-container {
  min-height: 100px;
  overflow: visible;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.initially-hidden {
  opacity: 0;
  visibility: hidden;
  
  &.animated {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.3s ease;
  }
}
</style>
