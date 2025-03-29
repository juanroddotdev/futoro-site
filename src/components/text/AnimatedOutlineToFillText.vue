<template>
  <div 
    ref="containerRef" 
    :class="['animated-text-container', { 'initially-hidden': initiallyHidden }]"
  >
    <div class="text-wrapper">
      <!-- Outlined version (base layer) -->
      <span ref="outlineTextRef" class="outline-text">{{ text }}</span>
      
      <!-- Filled version with clip mask -->
      <!-- <span 
        ref="filledTextRef" 
        :class="['filled-text', { 'has-fill': currentFillPercentage > 0 }]"
        :style="{ clipPath: clipPathStyle }"
      >{{ text }}</span> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, computed, watch } from 'vue';
import gsap from 'gsap';
type Timeline = gsap.core.Timeline;
import { textAnimations, type TextAnimationType } from '@/animations/text/textAnimations';

// Add type definition for valid animations
type AnimationType = TextAnimationType;

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  fillPercentage: {
    type: Number,
    default: 50
  },
  animation: {
    type: String as () => AnimationType,
    default: 'fadeUp'
  },
  duration: {
    type: Number,
    default: 0.7
  },
  delay: {
    type: Number,
    default: 0
  },
  ease: {
    type: String,
    default: 'power2.out'
  },
  initiallyHidden: {
    type: Boolean,
    default: true
  },
  triggerOnVisible: {
    type: Boolean,
    default: true
  },
  animateFill: {
    type: Boolean,
    default: false
  },
  fillDuration: {
    type: Number,
    default: 1.0
  },
  spotlightEnabled: {
    type: Boolean,
    default: false
  },
  spotlightX: {
    type: Number,
    default: 50
  },
  spotlightY: {
    type: Number,
    default: 50
  }
});

const emit = defineEmits(['animation-complete']);

const containerRef = ref<HTMLElement | null>(null);
const outlineTextRef = ref<HTMLElement | null>(null);
const filledTextRef = ref<HTMLElement | null>(null);
const hasAnimated = ref(false);
const currentFillPercentage = ref(0); // Start with 0% fill
const calculatedFillPercentage = ref(props.fillPercentage);

// Compute the final fill percentage based on either the prop or calculated value
const targetFillPercentage = computed(() => {
  return props.spotlightEnabled ? calculatedFillPercentage.value : props.fillPercentage;
});

// Compute the clip path style based on the current fill percentage
const clipPathStyle = computed(() => {
  // This creates a clip path that shows only the right portion of the text
  return `inset(0 0 0 ${100 - currentFillPercentage.value}%)`;
});

// Calculate fill percentage based on distance from spotlight
const calculateFillPercentage = () => {
  if (!containerRef.value || !props.spotlightEnabled) return;
  
  const textRect = containerRef.value.getBoundingClientRect();
  const textCenter = {
    x: textRect.left + textRect.width / 2,
    y: textRect.top + textRect.height / 2
  };
  
  // Convert spotlight position from percentage to viewport coordinates
  const spotlightPos = {
    x: (window.innerWidth * props.spotlightX) / 100,
    y: (window.innerHeight * props.spotlightY) / 100
  };
  
  // Calculate distance from text center to spotlight center
  const distance = Math.sqrt(
    Math.pow(textCenter.x - spotlightPos.x, 2) + 
    Math.pow(textCenter.y - spotlightPos.y, 2)
  );
  
  // Normalize distance to viewport diagonal for percentage calculation
  const viewportDiagonal = Math.sqrt(
    Math.pow(window.innerWidth, 2) + 
    Math.pow(window.innerHeight, 2)
  );
  
  // Calculate fill percentage based on distance
  // The closer to spotlight center, the lower the fill percentage
  const maxDistance = viewportDiagonal / 2;
  let fillPercent = (distance / maxDistance) * 100;
  
  // Clamp between 0 and 100
  fillPercent = Math.max(0, Math.min(100, fillPercent));
  
  calculatedFillPercentage.value = fillPercent;
  
  // If animation has completed, update the current fill percentage directly
  if (hasAnimated.value && props.animateFill) {
    gsap.to(currentFillPercentage, {
      value: fillPercent,
      duration: 0.5,
      ease: 'power2.out'
    });
  }
};

// Animation logic
const animateText = () => {
  if (hasAnimated.value) return;
  
  nextTick(() => {
    const elements = [outlineTextRef.value, filledTextRef.value].filter(el => el !== null) as HTMLElement[];
    
    if (elements.length > 0) {
      // Kill any existing animations
      elements.forEach(el => {
        if (el) gsap.killTweensOf(el);
      });
      
      // Create a timeline for the animation
      const tl = gsap.timeline({
        defaults: {
          ease: props.ease,
          duration: props.duration
        },
        delay: props.delay,
        onComplete: () => {
          emit('animation-complete');
          // After animation completes, if spotlight is enabled, calculate fill percentage
          if (props.spotlightEnabled) {
            calculateFillPercentage();
          }
        }
      });
      
      // Handle different animation types
      if (props.animation === 'fadeUp') {
        // Make sure both elements are set to the same initial state
        elements.forEach(el => {
          gsap.set(el, { y: 30, opacity: 0 });
        });
        
        // If animateFill is true, set initial clip path to hide the fill completely
        if (props.animateFill && filledTextRef.value) {
          gsap.set(filledTextRef.value, { 
            clipPath: 'inset(0 0 0 100%)' // Start with no fill visible
          });
        }
        
        // Animate both elements together as a single unit
        tl.to(elements, { 
          y: 0, 
          opacity: 1, 
          duration: props.duration,
          ease: props.ease
        });
        
        // If animateFill is true, animate the fill width at the same time as the fadeUp
        if (props.animateFill && filledTextRef.value) {
          // Animate the clip path to reveal the fill up to fillPercentage (from right to left)
          // Start at the same time as the fadeUp animation
          tl.to(currentFillPercentage, {
            value: targetFillPercentage.value, // Use computed target fill percentage
            duration: props.fillDuration,
            ease: 'power2.inOut'
          }, "<"); // "<" means "start at the same time as the previous animation"
        }
      } else if (typeof textAnimations[props.animation] === 'function') {
        // Remove incorrect type assertion
        textAnimations[props.animation](tl, elements, {
          duration: props.duration,
          delay: props.delay,
          ease: props.ease
        });
      }
      
      hasAnimated.value = true;
    }
  });
};

// Watch for changes in spotlight position
watch(() => [props.spotlightX, props.spotlightY], () => {
  if (props.spotlightEnabled && hasAnimated.value) {
    calculateFillPercentage();
  }
});

// Set up intersection observer for triggering animation when element is visible
const setupIntersectionObserver = () => {
  if (!containerRef.value) return;
  
  const observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !hasAnimated.value) {
      animateText();
      observer.disconnect();
    }
  }, {
    threshold: 0.1
  });
  
  observer.observe(containerRef.value);
  
  return observer;
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  // Always set initial state for both elements regardless of initiallyHidden prop
  const elements = [outlineTextRef.value, filledTextRef.value].filter(el => el !== null) as HTMLElement[];
  
  // Set initial states
  if (filledTextRef.value) {
    gsap.set(filledTextRef.value, { 
      opacity: 0,
      clipPath: 'inset(0 0 0 100%)' // Start with no fill visible
    });
  }

  if (outlineTextRef.value) {
    gsap.set(outlineTextRef.value, { 
      opacity: 1 // Ensure outline is visible
    });
  }
  
  if (props.triggerOnVisible) {
    const newObserver = setupIntersectionObserver();
    if (newObserver) observer = newObserver;
  } else {
    animateText();
  }
  
  // Set up event listeners for window resize and scroll if spotlight is enabled
  if (props.spotlightEnabled) {
    window.addEventListener('resize', calculateFillPercentage);
    window.addEventListener('scroll', calculateFillPercentage);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  
  // Clean up event listeners
  if (props.spotlightEnabled) {
    window.removeEventListener('resize', calculateFillPercentage);
    window.removeEventListener('scroll', calculateFillPercentage);
  }
});
</script>

<style scoped>
.animated-text-container {
  display: inline-block;
  position: relative;
}

.initially-hidden {
  opacity: 1; /* Container remains visible, but children are hidden via JS */
}

.text-wrapper {
  position: relative;
  display: inline-block;
  /* Ensure the wrapper doesn't interfere with animations */
  will-change: transform;
}

.outline-text, .filled-text {
  font-weight: bold;
  white-space: nowrap;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Ensure both elements can be animated independently */
  display: block;
  will-change: transform, opacity;
}

.outline-text {
  /* Strong outline styling */
  -webkit-text-stroke: 2px var(--theme-primary, #88C0D0);
  color: transparent;
  paint-order: stroke fill;
  position: relative;
  opacity: 1; /* Ensure outline is visible */
}

.filled-text {
  position: absolute;
  top: 0;
  left: 0;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  opacity: 0;
}

.filled-text.has-fill {
  opacity: 1;
  background-image: var(--theme-gradient-extended, linear-gradient(to right, #88C0D0, #81A1C1));
}

/* For Firefox which doesn't support -webkit-text-stroke well */
@-moz-document url-prefix() {
  .outline-text {
    text-shadow: 
      -2px -2px 0 var(--theme-primary, #88C0D0),
      2px -2px 0 var(--theme-primary, #88C0D0),
      -2px 2px 0 var(--theme-primary, #88C0D0),
      2px 2px 0 var(--theme-primary, #88C0D0);
  }
}
</style>
