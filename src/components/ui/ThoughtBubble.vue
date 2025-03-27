<template>
  <div class="thought-bubble-wrapper" :style="wrapperStyles" ref="bubbleWrapper">
    <!-- Background bubble (lower opacity) -->
    <svg 
      v-if="showBackgroundBubble"
      class="thought-bubble-svg background-bubble" 
      :viewBox="`0 0 ${dynamicViewBoxWidth} 200`" 
      xmlns="http://www.w3.org/2000/svg"
      :width="'100%'" 
      :height="'100%'"
      :style="backgroundSvgStyles"
    >
      <path 
        class="bubble-path background-path" 
        :d="dynamicBubblePath" 
        :fill="fillColor" 
        :stroke="strokeColor" 
        stroke-width="6" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        :filter="hasFilter ? 'url(#wavy-edge)' : ''"
      />
      
      <circle class="bubble-circle" cx="35" cy="140" r="8" :fill="fillColor" :stroke="strokeColor" stroke-width="2" />
      <circle class="bubble-circle" cx="20" cy="155" r="5" :fill="fillColor" :stroke="strokeColor" stroke-width="2" />
      <circle class="bubble-circle" cx="10" cy="165" r="3" :fill="fillColor" :stroke="strokeColor" stroke-width="1.5" />
    </svg>
    
    <!-- Foreground bubble (main) -->
    <svg 
      class="thought-bubble-svg" 
      :viewBox="`0 0 ${dynamicViewBoxWidth} 200`" 
      xmlns="http://www.w3.org/2000/svg"
      :width="'100%'" 
      :height="'100%'"
      :style="svgStyles"
    >
      <path 
        class="bubble-path" 
        :d="dynamicBubblePath" 
        :fill="fillColor" 
        :stroke="strokeColor" 
        stroke-width="6" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        :filter="hasFilter ? 'url(#wavy-edge)' : ''"
      />
      
      <circle class="bubble-circle" cx="35" cy="140" r="8" :fill="fillColor" :stroke="strokeColor" stroke-width="2" />
      <circle class="bubble-circle" cx="20" cy="155" r="5" :fill="fillColor" :stroke="strokeColor" stroke-width="2" />
      <circle class="bubble-circle" cx="10" cy="165" r="3" :fill="fillColor" :stroke="strokeColor" stroke-width="1.5" />
      
      <defs>
        <filter id="wavy-edge" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
    
    <div class="thought-bubble-content" :style="contentStyles" ref="contentRef">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick, onUnmounted } from 'vue';

// Add refs for measuring content
const contentRef = ref(null);
const bubbleWrapper = ref(null);
const contentWidth = ref(0);
const contentHeight = ref(0);

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
  const rightX = width - 70; // Right side X coordinate
  const midX = width / 2;    // Middle X coordinate
  
  // Make the bubble wider by adjusting control points
  const path = `M30,100 C30,55 65,20 110,20 C155,20 ${midX + 150},20 ${rightX},100 C${rightX},145 ${midX + 150},180 110,180 C95,180 80,175 70,165 L40,185 L50,155 C35,140 30,120 30,100 Z`;
  return path;
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
  zIndex: 3
}));

</script>

<style scoped>


</style>
