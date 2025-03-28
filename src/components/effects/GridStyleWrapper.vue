<template>
  <div class="grid-style-wrapper" :class="{ 'effect-enabled': enabled, 'debug-mode': debug }">
    <!-- Original content rendered normally -->
    <div class="solid-content" :style="inverseMaskStyle">
      <slot></slot>
    </div>
    
    <!-- Wireframe version with inverse mask -->
    <div class="wireframe-content" :style="maskStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  enabled?: boolean;
  spotlightX?: number;
  spotlightY?: number;
  debug?: boolean;
}>(), {
  enabled: true,
  spotlightX: 20,
  spotlightY: 20,
  debug: false
});

// Match the same spotlight gradient pattern as PaperGridBackground
const maskStyle = computed(() => ({
  maskImage: `radial-gradient(
    circle at ${props.spotlightX}% ${props.spotlightY}%, 
    black 0%,
    rgba(0, 0, 0, 0.8) 20%,
    transparent 50%
  )`,
  WebkitMaskImage: `radial-gradient(
    circle at ${props.spotlightX}% ${props.spotlightY}%, 
    black 0%,
    rgba(0, 0, 0, 0.8) 20%,
    transparent 50%
  )`
}));

// Inverse mask for normal content
const inverseMaskStyle = computed(() => ({
  maskImage: `radial-gradient(
    circle at ${props.spotlightX}% ${props.spotlightY}%, 
    transparent 0%,
    rgba(0, 0, 0, 0.2) 20%,
    black 50%
  )`,
  WebkitMaskImage: `radial-gradient(
    circle at ${props.spotlightX}% ${props.spotlightY}%, 
    transparent 0%,
    rgba(0, 0, 0, 0.2) 20%,
    black 50%
  )`
}));
</script>

<style scoped>
.grid-style-wrapper {
  position: relative;
  width: 100%;
  height: auto;
}

.solid-content, .wireframe-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* When effect is disabled, don't show wireframe version */
.grid-style-wrapper:not(.effect-enabled) .wireframe-content {
  display: none;
}

.grid-style-wrapper:not(.effect-enabled) .solid-content {
  position: relative;
  mask-image: none !important;
  -webkit-mask-image: none !important;
}

/* Apply basic wireframe styling without borders */
.wireframe-content :deep(div),
.wireframe-content :deep(section),
.wireframe-content :deep(article),
.wireframe-content :deep(aside),
.wireframe-content :deep(header),
.wireframe-content :deep(footer),
.wireframe-content :deep(main),
.wireframe-content :deep(p),
.wireframe-content :deep(h1),
.wireframe-content :deep(h2),
.wireframe-content :deep(h3),
.wireframe-content :deep(h4),
.wireframe-content :deep(h5),
.wireframe-content :deep(h6),
.wireframe-content :deep(span),
.wireframe-content :deep(ul),
.wireframe-content :deep(ol),
.wireframe-content :deep(li) {
  background-color: transparent !important;
  color: #333 !important;
  border: none !important;
  box-shadow: none !important;
  text-shadow: none !important;
}

/* No borders on any elements */
.wireframe-content :deep(button),
.wireframe-content :deep(a),
.wireframe-content :deep(div),
.wireframe-content :deep(input),
.wireframe-content :deep(textarea),
.wireframe-content :deep(select),
.wireframe-content :deep(nav),
.wireframe-content :deep(form) {
  background-color: transparent !important;
  color: #333 !important;
  border: none !important;
  box-shadow: none !important;
}

.wireframe-content :deep(img) {
  opacity: 0.5;
}

/* Debug mode styles */
.debug-mode .solid-content {
  border: 2px solid blue;
}

.debug-mode .wireframe-content {
  border: 2px solid red;
}
</style>
