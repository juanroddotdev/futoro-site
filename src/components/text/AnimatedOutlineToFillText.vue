<template>
  <div
    ref="containerRef"
    :class="[
      'animated-text-container',
      { 'initially-hidden': initiallyHidden },
    ]"
  >
    <div class="text-wrapper">
      <!-- Outlined version (base layer) -->
      <span ref="outlineTextRef" class="outline-text">{{ text }}</span>

      <!-- Filled version with clip mask -->
      <span
        ref="filledTextRef"
        class="filled-text"
        :style="{ clipPath: clipPathStyle }"
        >{{ text }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  nextTick,
  onUnmounted,
  computed,
  watch,
  type PropType,
} from "vue";
import gsap from "gsap";
import {
  textAnimations,
  type TextAnimationType,
} from "@/animations/text/textAnimations";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  fillPercentage: {
    type: Number,
    default: 0,
  },
  animation: {
    type: String as PropType<TextAnimationType>,
    default: "fadeUp",
  },
  duration: {
    type: Number,
    default: 0.7,
  },
  delay: {
    type: Number,
    default: 0,
  },
  ease: {
    type: String,
    default: "power2.out",
  },
  initiallyHidden: {
    type: Boolean,
    default: true,
  },
  triggerOnVisible: {
    type: Boolean,
    default: true,
  },
  animateFill: {
    type: Boolean,
    default: false,
  },
  fillDuration: {
    type: Number,
    default: 1.0,
  },
  fillDelay: {
    type: Number,
    default: 0,
  },
  triggerOnScroll: {
    type: Boolean,
    default: false
  },
  scrollStart: {
    type: String,
    default: 'top bottom'
  },
  scrollEnd: {
    type: String,
    default: 'bottom top'
  },
  scrub: {
    type: [Boolean, Number],
    default: false
  },
  fillScrollStart: {
    type: String,
    default: 'top center'
  },
  fillScrollEnd: {
    type: String,
    default: 'bottom center'
  },
  fluidFill: {
    type: Boolean,
    default: false
  },
  fluidFillDuration: {
    type: Number,
    default: 2.0
  },
});

const emit = defineEmits(["animation-complete"]);

const containerRef = ref<HTMLElement | null>(null);
const outlineTextRef = ref<HTMLElement | null>(null);
const filledTextRef = ref<HTMLElement | null>(null);
const hasAnimated = ref(false);
const currentFillPercentage = ref(0); // Start with 0% fill
const isFilled = ref(false);

// Compute the clip path style based on the current fill percentage
const clipPathStyle = computed(() => {
  const fill = `inset(0 0 0 ${100 - currentFillPercentage.value}%)`;
  const unfill = `inset(0  ${100 - currentFillPercentage.value}% 0 0)`;
  return !isFilled.value ? fill : unfill;
});

// Remove the old animateText function and replace with runAnimation
const runAnimation = () => {

  const elements = [outlineTextRef.value, filledTextRef.value].filter(
    (el) => el !== null
  ) as HTMLElement[];

  // Set initial state
  elements.forEach((el) => {
    gsap.set(el, { y: 100, opacity: 0 });
  });

  // Set initial fill state
  if (filledTextRef.value) {
    gsap.set(filledTextRef.value, {
      clipPath: "inset(0 0 0 100%)"
    });
  }

  // Create main timeline for fade-up
  const mainTimeline = gsap.timeline({
    scrollTrigger: props.triggerOnScroll ? {
      trigger: containerRef.value,
      start: props.scrollStart,
      end: props.scrollEnd,
      scrub: props.scrub,
      toggleActions: "play pause reverse pause",
      onEnter: () => {
      }
    } : null
  });

  // Add fade-up animation to main timeline
  mainTimeline.to(elements, {
    y: 0,
    opacity: 1,
    duration: props.duration || 1.2,
    ease: "power3.out",
    onStart: () =>{},
    onComplete: () => {} 
  }, 0); // Start at 0

  // Create fill timeline
  if (props.animateFill) {

    const fillTimeline = gsap.timeline({
      scrollTrigger: props.triggerOnScroll ? {
        trigger: containerRef.value,
        start: props.fillScrollStart,
        end: props.fillScrollEnd,
        scrub: props.scrub,
        toggleActions: "play pause reverse pause",
        onEnter: () => {
         
        },
        onUpdate: (self) => {
          
        }
      } : null
    });

    // Start fill animation during the fade-up
    fillTimeline.to(currentFillPercentage, {
      value: 100,
      duration: props.fillDuration,
      ease: "power2.inOut",
      delay: props.fillDelay,
      onComplete: () => {
        isFilled.value = !isFilled.value;
        currentFillPercentage.value = 100;
      },
    }, props.fillDelay); // Start at fillDelay seconds

    fillTimeline.to(currentFillPercentage, {
      value: 0,
      duration: props.fillDuration,
      ease: "power2.inOut"
    }, `>${props.fillDelay}`); // Start after previous fill animation

    // Add fluid fill if enabled
    if (props.fluidFill) {
      fillTimeline.to(currentFillPercentage, {
        value: 100,
        duration: props.fluidFillDuration || 2.0,
        ease: "power2.inOut"
      }, `>${props.fillDelay}`);

      fillTimeline.to(currentFillPercentage, {
        value: 0,
        duration: props.fluidFillDuration || 2.0,
        ease: "power2.inOut"
      }, `>${props.fillDelay}`);
    }
  }
};

// Modify onMounted to only set initial state
onMounted(() => {

  
  // Set initial state
  const elements = [outlineTextRef.value, filledTextRef.value].filter(
    (el) => el !== null
  ) as HTMLElement[];

  if (props.initiallyHidden) {
    elements.forEach((el) => {
      gsap.set(el, { y: 100, opacity: 0 });
    });
  }

  if (filledTextRef.value) {
    gsap.set(filledTextRef.value, {
      clipPath: "inset(0 0 0 100%)"
    });
  }

  // Only run animation setup if not scroll triggered
  if (!props.triggerOnScroll) {
    runAnimation();
  } else {
    // For scroll-triggered animations, just set up the scroll triggers
    gsap.delayedCall(0, runAnimation);
  }
});

// Remove onUnmounted since we don't need to clean up observer anymore
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

.outline-text,
.filled-text {
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
  -webkit-text-stroke: 2px var(--theme-primary, #88c0d0);
  color: transparent;
  paint-order: stroke fill;
  position: relative;
}

.filled-text {
  position: absolute;
  top: 0;
  left: 0;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  background-image: var(
    --theme-gradient-extended,
    linear-gradient(to right, #88c0d0, #81a1c1)
  );
}

/* For Firefox which doesn't support -webkit-text-stroke well */
@-moz-document url-prefix() {
  .outline-text {
    text-shadow: -2px -2px 0 var(--theme-primary, #88c0d0),
      2px -2px 0 var(--theme-primary, #88c0d0),
      -2px 2px 0 var(--theme-primary, #88c0d0),
      2px 2px 0 var(--theme-primary, #88c0d0);
  }
}
</style>

