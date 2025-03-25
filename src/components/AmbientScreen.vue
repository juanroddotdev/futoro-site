<template>
  <div class="ambient-screen" :style="backgroundStyle">
    <div class="ambient-time">{{ time }}</div>
    <div class="ambient-date">{{ date }}</div>
    <div class="ambient-notifications" :data-paused="!enablePullEffect">
      <LoadingDots 
        :dots="5" 
        :dotSize="8" 
        :dotSpacing="8"
        :dotColor="theme.accentColor || 'rgba(255, 255, 255, 0.8)'" 
        :duration="0.8" 
        :paused="!enablePullEffect" 
        animationStyle="pulse"
        :dotsDisabled="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import LoadingDots from './LoadingDots.vue';

/**
 * AmbientScreen Component
 * 
 * This component renders a lock screen-like interface showing:
 * 1. Current time in large format
 * 2. Current date in a smaller format
 * 3. Loading dots animation that indicates pull-to-unlock functionality
 * 
 * The component supports:
 * - Custom theming via gradient colors
 * - Pull-to-unlock visual effects
 * - Emitting events when pull threshold is reached
 * 
 * It's designed to be used within a phone UI container and
 * works in conjunction with pull gesture detection systems.
 */

interface Props {
  time: string;                 // Current time string (HH:MM format)
  date: string;                 // Current date string (Day, Month Date format)
  paused?: boolean;             // Whether animations should be paused
  enablePullEffect?: boolean;   // Whether pull-to-unlock effect is enabled
  theme?: {                     // Theme configuration for visual appearance
    baseColor?: string;         // Base gradient color
    endColor?: string;          // End gradient color
    accentColor?: string;       // Accent color for UI elements and effects
  };
}

const props = withDefaults(defineProps<Props>(), {
  paused: false,
  enablePullEffect: true,
  theme: () => ({
    baseColor: '#1a1f2c',       // Dark blue base color
    endColor: '#2E3440',        // Slightly lighter blue end color
    accentColor: 'rgba(255, 255, 255, 0.8)' // Semi-transparent white accent
  })
});

/**
 * Event emitter for component events
 * - pull-threshold-reached: Emitted when the pull gesture reaches the threshold
 *   that should trigger an unlock action
 */
const emit = defineEmits(['pull-threshold-reached']);

/**
 * handlePullThresholdReached - Handles the pull threshold reached event
 * 
 * This method is called when the pull gesture detection system determines
 * that the user has pulled far enough to trigger an unlock action.
 * It logs the event and emits the 'pull-threshold-reached' event to parent components.
 */
const handlePullThresholdReached = () => {
  console.log('[AmbientScreen] 🔔 Pull threshold reached, emitting event');
  emit('pull-threshold-reached');
};

/**
 * Expose methods to parent components
 * This allows parent components to call methods on this component instance
 */
defineExpose({
  handlePullThresholdReached
});

/**
 * backgroundStyle - Computed property for background gradient
 * 
 * Creates a CSS linear gradient using the theme colors.
 * This provides a smooth color transition for the ambient screen background.
 */
const backgroundStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.theme.baseColor} 0%, ${props.theme.endColor} 100%)`
}));

/**
 * Watch for changes to enablePullEffect prop
 * 
 * When the enablePullEffect prop changes, this watcher updates the
 * data-paused attribute on the ambient-notifications element to
 * control whether the loading dots animation should be active.
 */
watch(() => props.enablePullEffect, (newValue) => {
  // Update the animation state when enablePullEffect changes
  const dotsElement = document.querySelector('.ambient-notifications');
  if (dotsElement) {
    dotsElement.setAttribute('data-paused', String(!newValue));
  }
}, { immediate: true });

/**
 * Watch for changes to theme prop
 * 
 * When the theme prop changes, this watcher updates the background
 * gradient to reflect the new theme colors.
 */
watch(() => props.theme, (newValue) => {
  // Update the background when theme changes
  const ambientScreen = document.querySelector('.ambient-screen');
  if (ambientScreen && ambientScreen instanceof HTMLElement) {
    ambientScreen.style.background = `linear-gradient(135deg, ${newValue.baseColor} 0%, ${newValue.endColor} 100%)`;
  }
}, { deep: true });
</script>

<style lang="scss" scoped>
.ambient-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(135deg, v-bind('props.theme.baseColor') 0%, v-bind('props.theme.endColor') 100%);
  color: white;
  padding: 20px;
  text-align: center;

  .ambient-time {
    font-size: 3.5rem;
    font-weight: 300;
    margin-bottom: 0.5rem;
  }

  .ambient-date {
    font-size: 1rem;
    opacity: 0.8;
    margin-bottom: 2rem;
  }

  .ambient-notifications {
    display: flex;
    justify-content: center;
    min-height: 20px;
  }
}

.ambient-notifications[data-paused="true"] {
  /* Add styles for paused state if needed */
  opacity: 0.7;
}
</style>
