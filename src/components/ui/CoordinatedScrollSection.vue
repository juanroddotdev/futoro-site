<script setup>
import { computed, inject } from 'vue';

const props = defineProps({
  index: {
    type: Number,
    required: true
  }
});

// Inject values from parent
const { 
  sectionProgress, 
  activeSection,
  sectionExitProgress,
  sectionEntryProgress,
  sectionTransitionPoint
} = inject('coordinatedScroll');

// Compute section-specific values
const progress = computed(() => sectionProgress.value[props.index] || 0);
const isActive = computed(() => activeSection.value === props.index);
const isPrevious = computed(() => activeSection.value === props.index + 1);
const isNext = computed(() => activeSection.value === props.index - 1);

// Calculate if this section should be pinned
const isPinned = computed(() => {
  if (!isActive.value) return false;
  return progress.value < sectionTransitionPoint.value;
});

// Calculate transform for section movement
const sectionTransform = computed(() => {
  if (isActive.value) {
    // Active section moves up when transitioning out
    if (progress.value > sectionTransitionPoint.value) {
      const translateY = -100 * sectionExitProgress.value;
      return `translateY(${translateY}%)`;
    }
    return 'translateY(0)';
  } else if (isNext.value) {
    // Next section comes up from below
    const translateY = 100 - (100 * sectionEntryProgress.value);
    return `translateY(${translateY}%)`;
  } else if (isPrevious.value) {
    // Previous section is above
    return 'translateY(-100%)';
  } else {
    // Other sections are hidden
    return 'translateY(100%)';
  }
});

// Calculate opacity for smooth transitions
const sectionOpacity = computed(() => {
  if (isActive.value) {
    return 1;
  } else if (isNext.value) {
    return Math.min(1, sectionEntryProgress.value * 2);
  } else {
    return 0;
  }
});
</script>

<template>
  <div 
    class="coordinated-section"
    :class="{ 
      'section-active': isActive,
      'section-pinned': isPinned,
      'section-transitioning': progress > sectionTransitionPoint || isNext
    }"
    :style="{
      transform: sectionTransform,
      opacity: sectionOpacity,
      zIndex: isActive ? 2 : 1
    }"
  >
    <slot 
      :progress="progress" 
      :is-active="isActive"
      :is-pinned="isPinned"
    ></slot>
  </div>
</template>

<style lang="scss" scoped>
.coordinated-section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  transition: opacity 0.3s ease;
  will-change: transform, opacity;
}

.section-pinned {
  position: fixed;
  top: 0;
}
</style>