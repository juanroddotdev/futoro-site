<template>
  <div 
    class="sticky-section-wrapper" 
    :style="{ 
      height: wrapperHeight,
      minHeight: minHeight
    }"
  >
    <section 
      ref="stickySection" 
      class="sticky-section" 
      :class="[
        `sticky-section--${position}`,
        { 'sticky-section--debug': debug }
      ]"
      :style="{ 
        top: `${offset}px`,
        zIndex
      }"
    >
      <slot></slot>
    </section>
    
    <!-- Debug overlay if enabled -->
    <div v-if="debug" class="sticky-section-debug">
      <div>Wrapper Height: {{ wrapperHeight }}</div>
      <div>Sticky Offset: {{ offset }}px</div>
      <div>Z-Index: {{ zIndex }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Define props with defaults and types
const props = withDefaults(defineProps<{
  // Height configuration
  height?: string | number;
  minHeight?: string;
  dynamicHeight?: boolean;
  
  // Positioning
  position?: 'top' | 'center' | 'bottom';
  offset?: number;
  zIndex?: number;
  
  // Debug mode
  debug?: boolean;
  isUnlocked?: boolean;
  ambientMode?: boolean;
  enablePullEffect?: boolean;
  ambientTheme?: {
    baseColor?: string;
    endColor?: string;
    accentColor?: string;
  };
  unlockAnimationType?: 'wave' | 'ripple';
}>(), {
  height: '200vh',
  minHeight: '100vh',
  dynamicHeight: false,
  position: 'top',
  offset: 0,
  zIndex: 2,
  debug: false,
  isUnlocked: false,
  ambientMode: false,
  enablePullEffect: true,
  ambientTheme: () => ({
    baseColor: '#1a1f2c',
    endColor: '#2E3440',
    accentColor: 'rgba(245, 245, 245, 0.3)'
  }),
  unlockAnimationType: 'wave'
});

// Add emits for ambient screen events
const emit = defineEmits(['pull-threshold-reached', 'unlock']);

// Add event handlers
const onPullThresholdReached = () => {
  emit('pull-threshold-reached');
};

const onUnlock = () => {
  emit('unlock');
};

// Reference to the sticky section element
const stickySection = ref<HTMLElement | null>(null);

// Computed wrapper height
const wrapperHeight = computed(() => {
  if (typeof props.height === 'number') {
    return `${props.height}px`;
  }
  return props.height;
});

// Dynamic height calculation if enabled
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (props.dynamicHeight && stickySection.value) {
    // Create a ResizeObserver to dynamically adjust height
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const sectionHeight = entry.contentRect.height;
        // Add extra space to ensure enough scrolling room
        const extraSpace = window.innerHeight * 1.5;
        stickySection.value!.parentElement!.style.height = `${sectionHeight + extraSpace}px`;
      }
    });
    
    // Start observing the sticky section
    resizeObserver.observe(stickySection.value);
  }
});

onUnmounted(() => {
  // Clean up the observer when component is destroyed
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style lang="scss">
.sticky-section-wrapper {
  position: relative;
  width: 100%;
  overflow: visible;
}

.sticky-section {
  position: sticky;
  width: 100%;
  min-height: 100vh;
  
  // Position variants
  &--top {
    top: 0;
  }
  
  &--center {
    top: 50%;
    transform: translateY(-50%);
  }
  
  &--bottom {
    bottom: 0;
  }
  
  // Debug styling
  &--debug {
    border: 2px dashed rgba(255, 0, 0, 0.5);
  }
}

// Debug overlay
.sticky-section-debug {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 9999;
  pointer-events: none;
  
  div {
    margin-bottom: 5px;
  }
}
</style>