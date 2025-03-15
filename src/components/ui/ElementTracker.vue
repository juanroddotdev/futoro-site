<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useElementTracker } from '@/composables/useElementTracker';

const props = defineProps<{
  targetSelector?: string;
  showMarker?: boolean;
  showInfo?: boolean;
  color?: string;
  position?: 'left' | 'right';
  offset?: number;
  verticalOffset?: number; // New prop for vertical positioning
}>();

const trackedElement = ref<HTMLElement | null>(null);
const { position } = useElementTracker(trackedElement, {
  throttleMs: 16, // More frequent updates for smoother tracking
  debug: false
});

const markerStyle = computed(() => {
  if (!position || !position.inView) {
    return { display: 'none' };
  }
  
  return {
    position: 'fixed',
    top: `${position.top}px`,
    left: `${position.left}px`,
    width: `${position.width}px`,
    height: `${position.height}px`,
    border: `2px solid ${props.color || '#ff5722'}`,
    backgroundColor: `${props.color || '#ff5722'}20`,
    zIndex: 9999,
    pointerEvents: 'none',
    transition: 'all 0.1s ease-out'
  };
});

const infoStyle = computed(() => {
  if (!position || !position.inView) {
    return { display: 'none' };
  }
  
  const positionSide = props.position || 'left';
  const offset = props.offset || 0;
  const verticalOffset = props.verticalOffset || 0;
  
  return {
    position: 'fixed',
    top: `${position.top - 30 + verticalOffset}px`, // Apply vertical offset
    [positionSide]: positionSide === 'left' 
      ? `${position.left + offset}px` 
      : `${window.innerWidth - position.right + offset}px`,
    backgroundColor: props.color || '#ff5722',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    zIndex: 10000,
    pointerEvents: 'none',
    transition: 'all 0.1s ease-out'
  };
});

const findElement = () => {
  if (props.targetSelector) {
    const el = document.querySelector(props.targetSelector) as HTMLElement;
    if (el) {
      trackedElement.value = el;
      console.log('ElementTracker: Found element', props.targetSelector);
    } else {
      console.warn('ElementTracker: Element not found', props.targetSelector);
    }
  }
};

onMounted(() => {
  // Try to find the element immediately
  findElement();
  
  // And also after a short delay to ensure DOM is ready
  setTimeout(findElement, 100);
});

// Watch for changes to the selector
watch(() => props.targetSelector, findElement);
</script>

<template>
  <div v-if="showMarker && position && position.inView" :style="markerStyle">
    <div v-if="showInfo" :style="infoStyle">
      {{ Math.round((position?.progress || 0) * 100) }}% | {{ Math.round(position?.top || 0) }}px
    </div>
  </div>
</template>