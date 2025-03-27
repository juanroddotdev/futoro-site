<template>
  <div class="thought-bubble-wrapper" :class="themeClass" :style="wrapperStyles" ref="bubbleWrapper">
    <!-- Background bubble (lower opacity) -->
    <svg 
      v-if="showBackgroundBubble"
      class="thought-bubble-svg background-bubble" 
      :viewBox="`0 0 ${dynamicViewBoxWidth} 200`" 
      xmlns="http://www.w3.org/2000/svg"
      :width="'100%'" 
      :height="'100%'"
      :style="[backgroundSvgStyles, { transform: isSent ? `${backgroundSvgStyles.transform} scaleX(-1)` : backgroundSvgStyles.transform }]"
    >
      <defs>
        <linearGradient id="bgThemeGradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" :stop-color="gradientStartColor" />
          <stop offset="50%" :stop-color="gradientMidColor" />
          <stop offset="100%" :stop-color="gradientEndColor" />
        </linearGradient>
      </defs>
      
      <path 
        class="bubble-path background-path" 
        :d="dynamicBubblePath" 
        :fill="fillColor" 
        stroke="url(#bgThemeGradient)" 
        stroke-width="8" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        :filter="hasFilter ? 'url(#wavy-edge)' : ''"
      />
      
      <!-- Bubble circles with theme gradient stroke -->
      <circle class="bubble-circle" cx="35" cy="140" r="8" :fill="fillColor" stroke="url(#bgThemeGradient)" stroke-width="6" />
      <circle class="bubble-circle" cx="20" cy="155" r="5" :fill="fillColor" stroke="url(#bgThemeGradient)" stroke-width="4" />
      <circle class="bubble-circle" cx="10" cy="165" r="3" :fill="fillColor" stroke="url(#bgThemeGradient)" stroke-width="2.5" />
      
      <!-- Remove the inner border path -->
    </svg>
    
    <!-- Foreground bubble (main) -->
    <svg 
      class="thought-bubble-svg" 
      :viewBox="`0 0 ${dynamicViewBoxWidth} 200`" 
      xmlns="http://www.w3.org/2000/svg"
      :width="'100%'" 
      :height="'100%'"
      :style="svgStyles"
      :class="{'flipped': isSent}"
    >
      <defs>
        <!-- Theme-specific gradient definitions -->
        <linearGradient id="themeGradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" :stop-color="gradientStartColor" />
          <stop offset="50%" :stop-color="gradientMidColor" />
          <stop offset="100%" :stop-color="gradientEndColor" />
        </linearGradient>
        
        <filter id="wavy-edge" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      
      <path 
        class="bubble-path" 
        :d="dynamicBubblePath" 
        :fill="fillColor" 
        stroke="url(#themeGradient)" 
        stroke-width="8" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        :filter="hasFilter ? 'url(#wavy-edge)' : ''"
      />
      
      <!-- Bubble circles with theme gradient stroke -->
      <circle class="bubble-circle" cx="35" cy="140" r="8" :fill="fillColor" stroke="url(#themeGradient)" stroke-width="6" />
      <circle class="bubble-circle" cx="20" cy="155" r="5" :fill="fillColor" stroke="url(#themeGradient)" stroke-width="4" />
      <circle class="bubble-circle" cx="10" cy="165" r="3" :fill="fillColor" stroke="url(#themeGradient)" stroke-width="2.5" />
      
      <!-- Remove the inner border path -->
    </svg>
    
    <!-- Add a content-container div to help with centering -->
    <div class="thought-bubble-content" :style="contentStyles" ref="contentRef">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick, onUnmounted, inject } from 'vue';

// Add refs for measuring content
const contentRef = ref(null);
const bubbleWrapper = ref(null);
const contentWidth = ref(0);
const contentHeight = ref(0);

// Get current theme from useTheme composable or inject
const { currentTheme } = inject('theme', { currentTheme: ref('theme-neon-horizon') });

// Compute theme class for gradient styling
const themeClass = computed(() => {
  // Return the current theme and gradient type classes
  return {
    [currentTheme.value]: true,
    [`gradient-theme-${props.gradientType}`]: props.gradientType !== 'normal'
  };
});

// Add these computed properties to define gradient colors based on theme
const gradientStartColor = computed(() => {
  const themeColors = {
    'theme-neon-horizon': '#88C0D0',
    'theme-digital-sunset': '#B48EAD',
    'theme-retro-wave': '#FF4081',
    'theme-pastel-future': '#A3BE8C'
  };
  
  // Default to a color if theme not found
  return themeColors[currentTheme.value] || '#88C0D0';
});

const gradientMidColor = computed(() => {
  const themeColors = {
    'theme-neon-horizon': '#A3BE8C',
    'theme-digital-sunset': '#4C566A',
    'theme-retro-wave': '#1A1A1A',
    'theme-pastel-future': '#EBCB8B'
  };
  
  return themeColors[currentTheme.value] || '#A3BE8C';
});

const gradientEndColor = computed(() => {
  const themeColors = {
    'theme-neon-horizon': '#88C0D0',
    'theme-digital-sunset': '#B48EAD',
    'theme-retro-wave': '#FF4081',
    'theme-pastel-future': '#A3BE8C'
  };
  
  return themeColors[currentTheme.value] || '#88C0D0';
});

// Compute dynamic viewBox width based on content
const dynamicViewBoxWidth = computed(() => {
  // Get the actual rendered width if available
  const actualWidth = bubbleWrapper.value?.offsetWidth || 0;
  
  // Use the greater of content width or actual width for calculation
  const baseWidth = Math.max(contentWidth.value, actualWidth);
  
  // Increase the scaling factor to make the difference more noticeable
  // Base width plus additional width based on content
  const width = Math.max(400, 300 + baseWidth * 0.8);
 
  return width;
});

// Compute dynamic bubble path based on content dimensions
const dynamicBubblePath = computed(() => {
  const width = dynamicViewBoxWidth.value;
  const rightX = width - 30;
  const midX = width / 2;
  
  // Modified path to create a more symmetrical bubble
  return `M30,100 C30,55 65,20 110,20 C155,20 ${midX + 150},20 ${rightX},100 C${rightX},145 ${midX + 150},180 110,180 C65,180 30,145 30,100 Z`;
});

// Add a watch to update the bubble when content changes
watch(contentWidth, (newWidth, oldWidth) => {
  if (newWidth !== oldWidth) {
  }
});

// Measure content dimensions when mounted and when content changes
onMounted(() => {
  measureContent();
});

// Watch for slot content changes
const measureContent = async () => {
  await nextTick();
  if (contentRef.value) {
    const oldWidth = contentWidth.value;
    contentWidth.value = contentRef.value.offsetWidth;
    contentHeight.value = contentRef.value.offsetHeight;
   
    // Add the new log call
  } else {
    console.warn('Content ref is not available for measurement');
  }
};

// Use MutationObserver to detect content changes
onMounted(() => {
  if (contentRef.value) {
    const observer = new MutationObserver(measureContent);
    observer.observe(contentRef.value, { 
      childList: true, 
      subtree: true,
      characterData: true 
    });
    
    // Clean up observer on unmount
    onUnmounted(() => {
      observer.disconnect();
    });
  }
});

const props = defineProps({
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  fillColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.9)'
  },
  strokeColor: {
    type: String,
    default: '#333'
  },
  contentPadding: {
    type: String,
    default: '20px 30px 20px 20px'
  },
  hasFilter: {
    type: Boolean,
    default: true
  },
  scale: {
    type: Number,
    default: 1
  },
  rotate: {
    type: Number,
    default: 0
  },
  adaptToContent: {
    type: Boolean,
    default: false
  },
  showBackgroundBubble: {
    type: Boolean,
    default: false
  },
  backgroundOpacity: {
    type: Number,
    default: 0.4
  },
  backgroundOffsetX: {
    type: Number,
    default: 10
  },
  backgroundOffsetY: {
    type: Number,
    default: 10
  },
  backgroundRotate: {
    type: Number,
    default: -5
  },
  isSent: {
    type: Boolean,
    default: false
  },
  gradientType: {
    type: String,
    default: 'normal', // Options: 'normal', 'fire', 'cool'
    validator: (value) => ['normal', 'fire', 'cool'].includes(value)
  }
});

const wrapperStyles = computed(() => ({
  transform: `scale(${props.scale}) rotate(${props.rotate}deg)`,
  transformOrigin: 'center center'
}));

const svgWidth = computed(() => {
  // If width is 'auto' and we have content width, use that plus padding
  if (props.width === 'auto' && contentWidth.value > 0) {
    return `${contentWidth.value + 80}px`;
  }
  // Otherwise use the provided width or default to 100%
  return typeof props.width === 'number' ? `${props.width}px` : props.width || '100%';
});

const backgroundSvgStyles = computed(() => {
  const style = {
    position: 'absolute',
    top: `${props.backgroundOffsetY}px`,
    left: `${props.backgroundOffsetX}px`,
    opacity: props.backgroundOpacity,
    transform: `rotate(${props.backgroundRotate}deg)`,
    zIndex: 1
  };
  
  style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
  
  return style;
});

const svgStyles = computed(() => {
  const style = {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2
  };
  
  style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
  
  return style;
});

const contentStyles = computed(() => ({
  padding: props.contentPadding,
  position: 'relative',
  zIndex: 3,
  display: 'inline-block', // Use inline-block to maintain content-based sizing
  boxSizing: 'border-box',
  textAlign: 'center' // Center text
}));

// Add this computed property to create the inner border path
const innerBorderPath = computed(() => {
  const width = dynamicViewBoxWidth.value;
  const rightX = width - 60; // Inset from outer bubble
  const midX = width / 2;
  
  // Create a symmetrical inner border
  return `M60,100 C60,70 85,50 110,50 C135,50 ${midX + 100},50 ${rightX},100 C${rightX},130 ${midX + 100},150 110,150 C85,150 60,130 60,100 Z`;
});

</script>

<style scoped>
/* Add this to your existing styles */
.thought-bubble-svg.flipped {
  transform: scaleX(-1);
}

/* Flip the content back so text isn't mirrored */
.flipped ~ .thought-bubble-content {
  transform: scaleX(-1);
}

/* Ensure the content inside the bubble isn't flipped */
.flipped ~ .thought-bubble-content > * {
  transform: scaleX(-1);
}
</style>
