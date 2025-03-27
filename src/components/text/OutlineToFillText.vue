<template>
  <div ref="containerRef" class="animated-text-container">
    <div class="text-wrapper">
      <!-- Outlined version (base layer) -->
      <span ref="outlineTextRef" class="outline-text">{{ text }}</span>
      
      <!-- Filled version with clip mask -->
      <span 
        ref="filledTextRef" 
        class="filled-text"
        :style="{ clipPath: `inset(0 0 0 ${100 - fillPercentage}%)` }"
      >{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  fillPercentage: {
    type: Number,
    default: 50 // Default to 50% filled
  }
});

const containerRef = ref<HTMLElement | null>(null);
const outlineTextRef = ref<HTMLElement | null>(null);
const filledTextRef = ref<HTMLElement | null>(null);
</script>

<style scoped>
.animated-text-container {
  display: inline-block;
  position: relative;
}

.text-wrapper {
  position: relative;
  display: inline-block;
}

.outline-text, .filled-text {
  font-weight: bold;
  white-space: nowrap;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
