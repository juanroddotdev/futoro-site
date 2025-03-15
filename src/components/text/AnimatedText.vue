<template>
  <div class="animated-text-container" ref="containerRef">
    <span v-if="firstPart" ref="firstPartRef" :class="{ 'theme-text--gradient': useGradient }">{{ firstPart }}</span>
    <span v-if="secondPart" ref="secondPartRef" :class="{ 'theme-text--gradient': useGradient }">{{ secondPart }}</span>
    <span v-if="suffix" ref="suffixRef" :class="{ 'theme-text--gradient': useGradient }">{{ suffix }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { textAnimations } from '@/animations/text/textAnimations';
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
  }
});

const containerRef = ref<HTMLElement | null>(null);
const firstPartRef = ref<HTMLElement | null>(null);
const secondPartRef = ref<HTMLElement | null>(null);
const suffixRef = ref<HTMLElement | null>(null);

const initAnimation = async () => {
  await nextTick();
  
  if (containerRef.value) {
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
  
  initAnimation();
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

span {
  display: inline-block;
  opacity: 0;
  line-height: 1.5;
  padding: 4px 0;
  overflow: visible;
  white-space: nowrap;
  font-size: 1.5rem;
}

.theme-text--gradient {
  background-size: 200% auto !important;
  animation: gradient-shift 3s ease infinite alternate !important;
  font-weight: bold !important;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
</style>