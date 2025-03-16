<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { ScrollTracker } from '@/utils/scroll/core/ScrollTracker';
import { VisualizationPlugin } from '@/utils/scroll/plugins/VisualizationPlugin';

// Add a debug ref
const debug = ref(true);
const sectionTop = ref(0);
const sectionHeight = ref(0);
const viewportHeight = ref(window.innerHeight);

// Add tracker refs
let tracker = null;
let visualPlugin = null;

// Define props
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  titleCardText: {
    type: String,
    default: 'Section Title'
  },
  initialDirection: {
    type: String,
    default: 'normal' // 'normal' or 'reverse'
  },
  startInMiddle: {
    type: Boolean,
    default: false
  }
});

// Refs for DOM elements
const sectionRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const animWrapRef = ref<HTMLElement | null>(null);
const isInView = ref(false);
const progress = ref(0);
const isSticky = ref(false);

// Computed styles
const transformStyle = computed(() => {
  if (!animWrapRef.value) return '';
  
  const direction = props.initialDirection === 'reverse' ? 1 : -1;
  
  // Calculate the total scrollable width
  const containerWidth = window.innerWidth;
  const totalWidth = animWrapRef.value.scrollWidth;
  const scrollableWidth = totalWidth - containerWidth;
  
  // Apply a more controlled transform with constraints
  // Add a small offset to ensure first items are visible at start
  const initialOffset = props.initialDirection === 'reverse' ? 0 : 100;
  const transformX = (progress.value * direction * scrollableWidth) + initialOffset;
  
  return `translateX(${transformX}px)`;
});

// Add a new method to ensure items are visible
const ensureItemsVisible = () => {
  if (!animWrapRef.value) return;
  
  // Get all items
  const items = animWrapRef.value.querySelectorAll('.item');
  if (!items.length) return;
  
  // Make sure first item is visible at start
  if (progress.value < 0.1) {
    const firstItem = items[0];
    firstItem.classList.add('visible');
  } else {
    // Calculate which items should be visible based on progress
    const visibleIndex = Math.floor(progress.value * (items.length - 1));
    
    items.forEach((item, index) => {
      // Make current item and adjacent items visible
      if (Math.abs(index - visibleIndex) <= 1) {
        item.classList.add('visible');
      } else {
        item.classList.remove('visible');
      }
    });
  }
};

// Scroll handling
let observer: IntersectionObserver | null = null;
let scrollListener: (() => void) | null = null;

onMounted(() => {
  if (!sectionRef.value || !containerRef.value || !animWrapRef.value) return;
  
  // Initialize visualization plugin for debugging
  visualPlugin = new VisualizationPlugin({
    showMarkers: true,
    markerPosition: 'right',
    showScrollPosition: true,
    showElementBoundaries: true
  });

  tracker = new ScrollTracker({
    plugins: [visualPlugin],
    debug: true
  });

  // Track the section element
  tracker.trackElement(sectionRef.value, {
    updateCallback: (position) => {
      console.log('Section position:', position);
    }
  });

  // Expose toggle function to window for console access
  window.toggleScrollVisualization = (show) => {
    visualPlugin.setVisible(show);
  };
  
  // Set initial position if startInMiddle is true
  if (props.startInMiddle && animWrapRef.value) {
    progress.value = 0.5;
  }
  
  // Create intersection observer to detect when section is in view
  observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    isInView.value = entry.isIntersecting;
    
    // Add a class to the body when the section is in view
    if (entry.isIntersecting) {
      document.body.classList.add('horizontal-scroll-active');
    } else {
      document.body.classList.remove('horizontal-scroll-active');
    }
  }, { 
    threshold: [0.1, 0.5, 0.9], // Multiple thresholds for better tracking
    rootMargin: "-10% 0px" // Adjust when the observer triggers
  });
  
  observer.observe(sectionRef.value);
  
  // Add scroll listener for horizontal movement
  scrollListener = () => {
    if (!sectionRef.value) return;
    
    const rect = sectionRef.value.getBoundingClientRect();
    sectionTop.value = rect.top;
    sectionHeight.value = sectionRef.value.offsetHeight;
    viewportHeight.value = window.innerHeight;
    
    // Log detailed scroll information
    console.log({
      sectionTop: sectionTop.value,
      sectionHeight: sectionHeight.value,
      viewportHeight: viewportHeight.value,
      isSticky: sectionTop.value <= 0 && sectionTop.value > -(sectionHeight.value - viewportHeight.value),
      scrollY: window.scrollY,
      progress: progress.value
    });
    
    // Calculate if the container should be sticky
    // The container should be sticky when it's at the top of the viewport
    // and until the bottom of the section reaches the bottom of the viewport
    isSticky.value = sectionTop.value <= 0 && sectionTop.value > -(sectionHeight.value - viewportHeight.value);
    
    // Calculate progress based on how far we've scrolled through the sticky section
    if (isSticky.value) {
      // Calculate progress based on scroll position within the sticky section
      // This maps the scroll position to a 0-1 range
      const totalScrollDistance = sectionHeight.value - viewportHeight.value;
      const scrolledDistance = Math.abs(sectionTop.value);
      progress.value = Math.min(1, Math.max(0, scrolledDistance / totalScrollDistance));
      
      // Ensure items are visible based on current progress
      ensureItemsVisible();
    }
  };
  
  // Initialize with correct visibility
  ensureItemsVisible();
  
  // Add scroll listener
  window.addEventListener('scroll', scrollListener);
  scrollListener(); // Call once to set initial state
});

onBeforeUnmount(() => {
  // Clean up
  if (observer) {
    observer.disconnect();
  }
  
  if (scrollListener) {
    window.removeEventListener('scroll', scrollListener);
  }
  
  // Clean up tracker
  if (tracker) {
    tracker.destroy();
  }
  
  // Remove body class
  document.body.classList.remove('horizontal-scroll-active');
});
</script>

<template>
  <!-- Add debug overlay -->
  <div v-if="debug" class="debug-overlay">
    <div>Section Top: {{ sectionTop }}px</div>
    <div>Progress: {{ progress.toFixed(2) }}</div>
    <div>Is Sticky: {{ isSticky }}</div>
    <div>Is In View: {{ isInView }}</div>
    <div>Section Height: {{ sectionHeight }}px</div>
    <div>Viewport Height: {{ viewportHeight }}px</div>
    <button @click="debug = false">Hide Debug</button>
  </div>
  
  <section ref="sectionRef" class="horizontal-scroll-section" :class="{ 'reverse': initialDirection === 'reverse' }">
    <div 
      ref="containerRef" 
      class="container" 
      :class="{ 
        'is-in-view': isInView,
        'is-sticky': isSticky 
      }"
    >
      <div class="row">
        <div 
          ref="animWrapRef" 
          class="animation-wrap"
          :class="{ 'to-left': initialDirection === 'reverse', 'to-right': initialDirection === 'normal' }"
          :style="{ transform: transformStyle }"
        >
          <!-- Title card -->
          <div class="item title-card">
            <slot name="titleCard">
              <h3 class="heading-responsive">{{ titleCardText }}</h3>
            </slot>
          </div>
          
          <!-- Content cards -->
          <slot name="items"></slot>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// Add debug overlay styles
.debug-overlay {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 4px;
  z-index: 9999;
  font-family: monospace;
  font-size: 12px;
  
  div {
    margin-bottom: 5px;
  }
  
  button {
    background: #333;
    border: 1px solid #555;
    color: white;
    padding: 2px 5px;
    border-radius: 3px;
    cursor: pointer;
    
    &:hover {
      background: #444;
    }
  }
}

.horizontal-scroll-section {
  position: relative;
  min-height: 400vh; // Increase this to give more scroll room
  overflow-x: hidden;
  z-index: 1;
  
  .container {
    position: sticky;
    top: 0; // Stick to the top of the viewport
    height: 100vh;
    width: 100%;
    overflow: hidden;
    
    // Add these properties to ensure stickiness works properly
    display: block;
    z-index: 10;
    
    &.is-in-view {
      z-index: 10;
    }
    
    &.is-sticky {
      // Additional styles when the container is in sticky state
      background-color: var(--theme-background, #ffffff);
    }
  }
  
  .row {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 2rem; // Add padding to prevent items from touching edges
  }
  
  .animation-wrap {
    display: flex;
    align-items: center;
    gap: 2rem; // Add gap between items
    padding: 0 10%; // Add padding to ensure items are visible at start/end
    
    // Ensure the animation wrap is wide enough
    min-width: max-content;
    
    // Smooth out the animation
    transition: transform 0.1s ease-out;
    
    &.to-left {
      // Adjust initial position for reverse direction
      transform: translateX(0);
    }
    
    &.to-right {
      // Adjust initial position for normal direction
      transform: translateX(0);
    }
  }
  
  .item {
    flex: 0 0 auto;
    min-width: 300px; // Set minimum width for items
    max-width: 80vw; // Prevent items from being too wide
    opacity: 0.7; // Slightly dim non-focused items
    transition: opacity 0.3s ease;
    
    &.visible, &:hover {
      opacity: 1; // Full opacity for visible/hovered items
    }
    
    &.title-card {
      // Make title card stand out
      min-width: 350px;
      font-weight: bold;
      opacity: 1;
    }
  }
}
</style>