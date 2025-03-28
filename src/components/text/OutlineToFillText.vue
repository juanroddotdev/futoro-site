<template>
  <div ref="containerRef" class="animated-text-container" :style="containerStyle">
    <div class="text-wrapper" :style="wrapperStyle">
      <!-- Outlined version (base layer) -->
      <span ref="outlineTextRef" class="outline-text">{{ text }}</span>
      
      <!-- Filled version with clip mask -->
      <span 
        ref="filledTextRef" 
        class="filled-text"
        :style="{ clipPath: `inset(0 0 0 ${100 - computedFillPercentage}%)` }"
      >{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  fillPercentage: {
    type: Number,
    default: 50 // Default to 50% filled
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
  },
  width: {
    type: [String, Number],
    default: 'auto'
  },
  textAlign: {
    type: String,
    default: 'left',
    validator: (value: string) => ['left', 'center', 'right', 'justify'].includes(value)
  }
});

const containerRef = ref<HTMLElement | null>(null);
const outlineTextRef = ref<HTMLElement | null>(null);
const filledTextRef = ref<HTMLElement | null>(null);
const calculatedFillPercentage = ref(props.fillPercentage);

// Compute the final fill percentage based on either the prop or calculated value
const computedFillPercentage = computed(() => {
  return props.spotlightEnabled ? calculatedFillPercentage.value : props.fillPercentage;
});

// Container style with width support
const containerStyle = computed(() => {
  const styles: Record<string, string> = {};
  
  if (props.width !== 'auto') {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
  }
  
  return styles;
});

// Wrapper style with text alignment
const wrapperStyle = computed(() => {
  const style: Record<string, string> = {
    textAlign: props.textAlign,
  };
  
  if (props.width !== 'auto') {
    style.width = '100%';
    style.display = 'block'; // Change to block when width is specified
  }
  
  return style;
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
  
  // Use a responsive approach for normalization
  // Use the text element size as a factor in the calculation
  const textSize = Math.max(textRect.width, textRect.height);
  const viewportSize = Math.min(window.innerWidth, window.innerHeight);
  
  // Blend text size and viewport size for better responsiveness
  const referenceSize = (textSize * 0.7) + (viewportSize * 0.3);
  const normalizedDistance = distance / referenceSize;
  
  // Apply a non-linear curve with responsive scaling
  const scaleFactor = Math.max(1, Math.min(2, window.innerWidth / 1000));
  let fillPercent = 100 * (1 - Math.pow(Math.min(normalizedDistance * scaleFactor, 1), 2));
  
  // Clamp between 0 and 100
  fillPercent = Math.max(0, Math.min(100, fillPercent));
  
  calculatedFillPercentage.value = fillPercent;
};

// Watch for changes in spotlight position
watch(() => [props.spotlightX, props.spotlightY], () => {
  if (props.spotlightEnabled) {
    calculateFillPercentage();
  }
});

// Set up event listeners for window resize and scroll
onMounted(() => {
  if (props.spotlightEnabled) {
    calculateFillPercentage();
    window.addEventListener('resize', calculateFillPercentage);
    window.addEventListener('scroll', calculateFillPercentage);
  }
});

onUnmounted(() => {
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

.text-wrapper {
  position: relative;
  display: inline-block;
  width: 100%; /* Make it take full width of its container */
  max-width: 100%; /* Ensure it doesn't exceed parent width */
  overflow: hidden; /* Prevent content from breaking out */
}

.outline-text, .filled-text {
  font-weight: bold;
  white-space: normal; /* Allow text to wrap */
  word-wrap: break-word; /* Break long words if needed */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width: 100%; /* Ensure text doesn't exceed container width */
}

.outline-text {
  /* Strong outline styling */
  -webkit-text-stroke: 2px var(--theme-primary, #88C0D0);
  color: transparent;
  paint-order: stroke fill;
}

.filled-text {
  position: absolute;
  top: 0;
  left: 0;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
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
