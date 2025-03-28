<template>
  <div class="spotlight-provider">
    <!-- Optional debug controls -->
    <div v-if="debug" class="spotlight-controls">
      <label>
        X: {{ spotlightX }}%
        <input type="range" v-model.number="spotlightX" min="0" max="100" step="1">
      </label>
      <label>
        Y: {{ spotlightY }}%
        <input type="range" v-model.number="spotlightY" min="0" max="100" step="1">
      </label>
      <label>
        <input type="checkbox" v-model="followMouse"> Follow Mouse
      </label>
    </div>
    
    <!-- Indicator circle (optional) -->
    <div v-if="showIndicator" class="spotlight-indicator" :style="{
      left: `${spotlightX}%`,
      top: `${spotlightY}%`
    }"></div>
    
    <!-- Content -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import { useSpotlight } from '@/composables/useSpotlight';

const props = defineProps({
  debug: {
    type: Boolean,
    default: false
  },
  showIndicator: {
    type: Boolean,
    default: false
  }
});

const { spotlightX, spotlightY, followMouse, calculateFillPercentage } = useSpotlight();

// Provide spotlight values to all child components
provide('spotlight', {
  spotlightX,
  spotlightY,
  followMouse,
  calculateFillPercentage
});
</script>

<style scoped>
.spotlight-provider {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.spotlight-controls {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spotlight-indicator {
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 999;
}
</style>