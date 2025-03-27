<template>
  <div class="geometric-box-wrapper" :class="themeClass" :style="wrapperStyles">
    <svg 
      class="geometric-box-svg" 
      :viewBox="`0 0 ${viewBoxWidth} 120`" 
      xmlns="http://www.w3.org/2000/svg"
      :width="'100%'" 
      :height="'100%'"
      :class="{'flipped': isSent}"
    >
      <defs>
        <linearGradient id="themeGradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" :stop-color="gradientStartColor" />
          <stop offset="100%" :stop-color="gradientEndColor" />
        </linearGradient>
      </defs>
      
      <!-- Main rectangle with pointer -->
      <path 
        class="box-path" 
        :d="boxPath" 
        :fill="fillColor" 
        stroke="url(#themeGradient)" 
        stroke-width="2" 
        stroke-linejoin="miter"
      />
    </svg>
    
    <div class="geometric-box-content" :style="contentStyles">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick, onUnmounted, inject } from 'vue';

// Content measurement
const contentRef = ref(null);
const boxWrapper = ref(null);
const contentWidth = ref(0);
const contentHeight = ref(0);

// Theme injection
const { currentTheme } = inject('theme', { currentTheme: ref('theme-neon-horizon') });

// Theme class computation
const themeClass = computed(() => {
  return {
    [currentTheme.value]: true,
    [`gradient-theme-${props.gradientType}`]: props.gradientType !== 'normal'
  };
});

// Gradient colors based on theme
const gradientStartColor = computed(() => {
  const themeColors = {
    'theme-neon-horizon': '#88C0D0',
    'theme-digital-sunset': '#B48EAD',
    'theme-retro-wave': '#FF4081',
    'theme-pastel-future': '#A3BE8C'
  };
  return themeColors[currentTheme.value] || '#88C0D0';
});

const gradientEndColor = computed(() => {
  const themeColors = {
    'theme-neon-horizon': '#A3BE8C',
    'theme-digital-sunset': '#4C566A',
    'theme-retro-wave': '#1A1A1A',
    'theme-pastel-future': '#EBCB8B'
  };
  return themeColors[currentTheme.value] || '#A3BE8C';
});

// Fixed viewBox width
const viewBoxWidth = computed(() => 300);

// Box path with pointer
const boxPath = computed(() => {
  const width = viewBoxWidth.value;
  const pointerSize = 15;
  
  return props.isSent
    ? `M20,20 H${width - 20} V80 H${pointerSize + 20} L20,100 V20 Z` // Sent message (pointer on left)
    : `M20,20 H${width - 20} V100 L${width - 20 - pointerSize},80 H20 V20 Z`; // Received message (pointer on right)
});

// Props
const props = defineProps({
  fillColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.05)'
  },
  contentPadding: {
    type: String,
    default: '15px 20px'
  },
  scale: {
    type: Number,
    default: 1
  },
  isSent: {
    type: Boolean,
    default: false
  },
  gradientType: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'fire', 'cool'].includes(value)
  }
});

// Styles
const wrapperStyles = computed(() => ({
  transform: `scale(${props.scale})`,
  transformOrigin: 'center center'
}));

const contentStyles = computed(() => ({
  padding: props.contentPadding,
  position: 'relative',
  zIndex: 3,
  display: 'inline-block',
  boxSizing: 'border-box'
}));

// Content measurement
const measureContent = async () => {
  await nextTick();
  if (contentRef.value) {
    contentWidth.value = contentRef.value.offsetWidth;
    contentHeight.value = contentRef.value.offsetHeight;
  }
};

onMounted(() => {
  measureContent();
  
  if (contentRef.value) {
    const observer = new MutationObserver(measureContent);
    observer.observe(contentRef.value, { 
      childList: true, 
      subtree: true,
      characterData: true 
    });
    
    onUnmounted(() => {
      observer.disconnect();
    });
  }
});
</script>

<style scoped>
.geometric-box-wrapper {
  position: relative;
  display: inline-block;
  width: auto;
  height: auto;
}

.geometric-box-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.geometric-box-svg.flipped {
  transform: scaleX(-1);
}

.geometric-box-content {
  position: relative;
  z-index: 2;
  min-width: 50px;
}

.flipped ~ .geometric-box-content {
  transform: scaleX(-1);
}

.flipped ~ .geometric-box-content > * {
  transform: scaleX(-1);
}
</style>