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

// Animation logic
const animateText = () => {
  if (hasAnimated.value) return;

  nextTick(() => {
    const elements = [outlineTextRef.value, filledTextRef.value].filter(
      (el) => el !== null
    ) as HTMLElement[];

    if (elements.length > 0) {
      // Kill any existing animations
      elements.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });

      // Create a timeline for the animation
      const tl = gsap.timeline({
        defaults: {
          ease: props.ease,
          duration: props.duration,
        },
        delay: props.delay,
        onComplete: () => {
          emit("animation-complete");
        },
      });

      // Handle different animation types
      if (props.animation === "fadeUp") {
        // Make sure both elements are set to the same initial state
        elements.forEach((el) => {
          gsap.set(el, { y: 100, opacity: 0 });
        });

        // If animateFill is true, set initial clip path to hide the fill completely
        if (props.animateFill && filledTextRef.value) {
          gsap.set(filledTextRef.value, {
            clipPath: "inset(0 0 0 100%)", // Start with no fill visible
          });
        }

        // Animate both elements together as a single unit
        tl.to(elements, {
          y: 0,
          opacity: 1,
          duration: props.duration || 1.2,
          ease: "power3.out",
        }, 0); // Start at 0

        // Start fill animation during the fade-up
        tl.to(currentFillPercentage, {
          value: 100,
          duration: props.fillDuration,
          ease: "power2.inOut",
          delay: props.fillDelay,
          onComplete: () => {
            isFilled.value = !isFilled.value;
            currentFillPercentage.value = 100;
          },
        }, props.fillDelay); // Start at fillDelay seconds

        tl.to(currentFillPercentage, {
          value: 0,
          duration: props.fillDuration,
          ease: "power2.inOut"
        }, `>${props.fillDelay}`); // Start after previous fill animation

        tl.to(currentFillPercentage, {
          value: 100,
          duration: props.fillDuration,
          ease: "power2.inOut",
          onComplete: () => {
            isFilled.value = !isFilled.value;
            currentFillPercentage.value = 100;
          },
        }, `>${props.fillDelay}`); // Start after previous fill animation
      } else if (typeof textAnimations[props.animation] === "function") {
        textAnimations[props.animation](tl, elements, {
          duration: props.duration,
          delay: props.delay,
          ease: props.ease,
        });
      }

      hasAnimated.value = true;
    }
  });
};

// Set up intersection observer for triggering animation when element is visible
const setupIntersectionObserver = () => {
  if (!containerRef.value) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasAnimated.value) {
        animateText();
        observer.disconnect();
      }
    },
    {
      threshold: 0.1,
    }
  );

  observer.observe(containerRef.value);

  return observer;
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  // Always set initial state for both elements regardless of initiallyHidden prop
  const elements = [outlineTextRef.value, filledTextRef.value].filter(
    (el) => el !== null
  ) as HTMLElement[];

  if (props.initiallyHidden) {
    // For fadeUp animation, set both y position and opacity
    if (props.animation === "fadeUp") {
      elements.forEach((el) => {
        gsap.set(el, { y: 100, opacity: 0 });
      });
    } else {
      // For other animations, just set opacity
      elements.forEach((el) => {
        gsap.set(el, { opacity: 0 });
      });
    }
  }

  // Set initial fill to 0% (completely hidden)
  if (filledTextRef.value) {
    gsap.set(filledTextRef.value, {
      clipPath: "inset(0 0 0 100%)", // Start with no fill visible
    });
  }

  if (props.triggerOnVisible) {
    observer = setupIntersectionObserver() || null;
  } else {
    animateText();
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
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
