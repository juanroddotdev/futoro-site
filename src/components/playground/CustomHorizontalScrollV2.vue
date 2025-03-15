<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import { icons } from '@/utils/icons';
import { ScrollTracker } from '@/utils/scroll/core/ScrollTracker';
import { VisualizationPlugin } from '@/utils/scroll/plugins/VisualizationPlugin';
import { useElementTracker } from '@/composables/useElementTracker';
import ElementTracker from '@/components/ui/ElementTracker.vue';

// Refs for DOM elements
const sectionRef = ref<HTMLElement | null>(null);
const strugglesWrapRef = ref<HTMLElement | null>(null);
const solutionsWrapRef = ref<HTMLElement | null>(null);
const strugglesContainerRef = ref<HTMLElement | null>(null);

// State for scroll tracking
const scrollProgress = ref(0);
const isFixed = ref(false);
const scrollInfo = ref({
  startPosition: 0,
  endPosition: 0,
  totalWidth: 0,
  viewportWidth: 0,
  sectionHeight: 0
});

// Add a new ref for the direction
const isReversed = ref(false);

// Scroll tracker instance
let scrollTracker: ScrollTracker | null = null;
let visualPlugin: VisualizationPlugin | null = null;

// Toggle function to switch between directions
const toggleDirection = () => {
  isReversed.value = !isReversed.value;
  // Recalculate boundaries after direction change
  nextTick(() => {
    calculateScrollBoundaries();
  });
};

// Computed property for transform style of struggles row (REVERSED DIRECTION)
const strugglesTransformStyle = computed(() => {
  if (!strugglesWrapRef.value) return '';
  
  const totalWidth = scrollInfo.value.totalWidth;
  const viewportWidth = scrollInfo.value.viewportWidth;
  
  let translateX;
  
  if (isReversed.value) {
    // Reversed: Title card starts at right edge of viewport
    // Cards overflow to the left (off-screen)
    
    // Calculate how much space the title card needs on the right
    const titleWidth = titleCardWidth.value || 300;
    
    // Calculate the initial position that places title card at right edge
    // and all other cards to the left (negative direction)
    const initialOffset = viewportWidth - titleWidth;
    
    // As scroll progresses, move from left to right
    // Start with cards off-screen to the left, end with all cards visible
    const maxTranslation = totalWidth - viewportWidth;
    
    // Start with a position that places title at right edge, other cards off-screen left
    // As progress increases, move everything right to reveal cards
    translateX = initialOffset - (maxTranslation * (1 - scrollProgress.value));
  } else {
    // Normal: Start from right (0) and move left (negative)
    const maxTranslation = -(totalWidth - viewportWidth);
    translateX = scrollProgress.value * maxTranslation;
  }
  
  // Update visualization marker
  if (visualPlugin) {
    try {
      visualPlugin.updateMarker('struggles-row', scrollProgress.value, {
        label: 'Struggles',
        showProgress: true
      });
    } catch (e) {
      console.warn('Visualization plugin error:', e);
    }
  }
  
  return `translateX(${translateX}px)`;
});

// Computed property for transform style of solutions row (same direction)
const solutionsTransformStyle = computed(() => {
  if (!solutionsWrapRef.value) return '';
  const maxTranslation = -(scrollInfo.value.totalWidth - scrollInfo.value.viewportWidth);
  const translateX = scrollProgress.value * maxTranslation;
  
  // Update visualization marker for solutions row
  if (visualPlugin) {
    try {
      visualPlugin.updateMarker('solutions-row', scrollProgress.value, {
        label: 'Solutions',
        showProgress: true
      });
    } catch (e) {
      console.warn('Visualization plugin error:', e);
    }
  }
  
  return `translateX(${translateX}px)`;
});

// Add this computed property to track the center item
const centerItemIndex = computed(() => {
  if (!strugglesWrapRef.value || !scrollInfo.value.viewportWidth) return -1;
  
  const items = Array.from(strugglesWrapRef.value.children);
  const centerX = scrollInfo.value.viewportWidth / 2;
  const scrollOffset = scrollProgress.value * (scrollInfo.value.totalWidth - scrollInfo.value.viewportWidth);
  
  // Find which item is closest to the center
  let closestIndex = -1;
  let closestDistance = Infinity;
  
  items.forEach((item, index) => {
    const rect = (item as HTMLElement).getBoundingClientRect();
    const itemCenterX = rect.left + rect.width / 2;
    const distance = Math.abs(itemCenterX - centerX);
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });
  
  return closestIndex;
});

// Computed property for playground view bottom
const playgroundViewBottom = computed(() => {
  const element = document.querySelector('.playground-view') as HTMLElement;
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  return rect.bottom;
});

const strugglesContainerBottom = computed(() => {
  // Get fresh reference each time for accurate position
  const element = document.querySelector('.row-container.struggles-container') as HTMLElement;
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  return rect.bottom;
});

// Add throttling for logging
let lastLogTime = 0;
const LOG_THROTTLE_MS = 100; // Log at most every 100ms

// Handle scroll event
const handleScroll = () => {
  if (!sectionRef.value || !strugglesWrapRef.value) return;
  
  const scrollY = window.scrollY;
  const { startPosition, endPosition } = scrollInfo.value;
  
  // Check if we're in the scroll range for this section
  if (scrollY >= startPosition && scrollY <= endPosition) {
    // Calculate progress (0 to 1)
    const progress = (scrollY - startPosition) / (endPosition - startPosition);
    scrollProgress.value = Math.max(0, Math.min(1, progress));
    
    // Set fixed position when in range
    isFixed.value = true;
    
    // Log progress (throttled)
    const now = Date.now();
    if (now - lastLogTime > LOG_THROTTLE_MS) {
      lastLogTime = now;
      console.log(`Scroll progress: ${(progress * 100).toFixed(1)}%`);
    }
  } else {
    // Set progress to 0 or 1 when outside range
    scrollProgress.value = scrollY < startPosition ? 0 : 1;
    
    // Remove fixed position when outside range
    isFixed.value = false;
  }
  
  // Check if we've reached the end of the section
  if (scrollY >= endPosition) {
    // Add class to indicate section is complete
    sectionRef.value?.classList.add('section-complete');
  } else {
    // Remove class when not at the end
    sectionRef.value?.classList.remove('section-complete');
  }
};

// Add a ref to track title card width
const titleCardWidth = ref(300); // Default width, will be updated

// Calculate scroll boundaries
const calculateScrollBoundaries = () => {
  if (!sectionRef.value || !strugglesWrapRef.value) return;
  
  // Get section position
  const sectionRect = sectionRef.value.getBoundingClientRect();
  const sectionTop = window.pageYOffset + sectionRect.top;
  const viewportHeight = window.innerHeight;
  
  // Calculate total width of the struggles row
  let totalWidth = 0;
  
  // Use the actual width of the struggles wrap
  if (strugglesWrapRef.value) {
    totalWidth = strugglesWrapRef.value.scrollWidth;
  }
  
  // Add extra space to ensure the last item is fully visible
  const lastItem = strugglesWrapRef.value.lastElementChild as HTMLElement;
  const lastItemWidth = lastItem ? lastItem.offsetWidth : 0;
  const extraSpace = window.innerWidth - lastItemWidth;
  
  // Measure title card width if it exists
  if (strugglesWrapRef.value) {
    const titleCard = strugglesWrapRef.value.querySelector('.title-card');
    if (titleCard) {
      titleCardWidth.value = titleCard.offsetWidth;
    }
  }
  
  // Calculate required height based on content width
  // This ensures the section is tall enough to scroll through all items
  const requiredHeight = Math.max(
    window.innerHeight * 2, // Minimum height (200vh)
    window.innerHeight + (totalWidth / window.innerWidth) * window.innerHeight
  );
  
  // Apply the calculated height to the section
  if (sectionRef.value) {
    sectionRef.value.style.height = `${requiredHeight}px`;
    
    // Set a CSS variable that parent containers can use
    document.documentElement.style.setProperty('--horizontal-struggles-height', `${requiredHeight}px`);
  }
  
  // Store scroll boundaries
  scrollInfo.value = {
    startPosition: sectionTop,
    endPosition: sectionTop + requiredHeight,
    totalWidth: totalWidth + extraSpace,
    viewportWidth: window.innerWidth,
    sectionHeight: requiredHeight
  };
  
  console.log('Scroll boundaries calculated:', scrollInfo.value);
  
  // Use ScrollTracker to track the section
  if (scrollTracker && sectionRef.value) {
    try {
      scrollTracker.trackElement(sectionRef.value, {
        updateCallback: (position) => {
          // Update progress based on ScrollTracker's calculation
          scrollProgress.value = position.progress;
        }
      });
    } catch (e) {
      console.warn('ScrollTracker error:', e);
      // Fallback to manual scroll handling
      window.addEventListener('scroll', handleScroll);
    }
  }
};

// Remove the watch for centerItemIndex
watch(centerItemIndex, (newIndex, oldIndex) => {
  if (newIndex === -1 || newIndex === oldIndex) return;
  
  // Apply animation to the center item
  if (strugglesWrapRef.value && newIndex < strugglesWrapRef.value.children.length) {
    const centerItem = strugglesWrapRef.value.children[newIndex] as HTMLElement;
    
    // Remove active class from all items
    Array.from(strugglesWrapRef.value.children).forEach(item => {
      item.classList.remove('active-center');
    });
    
    // Add active class to center item
    centerItem.classList.add('active-center');
    
    console.log('Center item changed to:', newIndex);
  }
});

// Initialize on component mount
onMounted(() => {
  try {
    console.log('Component mounted');
    
    // Create ScrollTracker instance
    scrollTracker = new ScrollTracker({
      throttleMs: 100,
      debug: true
    });
    
    // Add visualization plugin for debugging
    visualPlugin = new VisualizationPlugin({
      showMarkers: true,
      markerPosition: 'right'
    });
    
    if (scrollTracker && visualPlugin) {
      scrollTracker.registerPlugin(visualPlugin);
    }
    
    // Calculate boundaries after DOM is ready
    setTimeout(() => {
      calculateScrollBoundaries();
      
      // Get reference to struggles container after DOM is ready
      strugglesContainerRef.value = document.querySelector('.row-container.struggles-container') as HTMLElement;
      
      // Initial scroll check
      handleScroll();
      
      // Add scroll event listener
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', calculateScrollBoundaries);
      
      console.log('Scroll event listeners attached');
    }, 100);
  } catch (e) {
    console.error('Error in mounted hook:', e);
    // Fallback to basic scroll handling
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculateScrollBoundaries);
  }
});

// Clean up event listeners
onBeforeUnmount(() => {
  console.log('Component unmounting');
  
  // Remove scroll event listener
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', calculateScrollBoundaries);
  
  // Remove the CSS variable
  document.documentElement.style.removeProperty('--horizontal-struggles-height');
  
  // Clean up scroll tracker
  if (scrollTracker) {
    try {
      scrollTracker.destroy();
    } catch (e) {
      console.warn('Error destroying ScrollTracker:', e);
    }
    scrollTracker = null;
  }
});
</script>

<template>
  <section ref="sectionRef" class="horizontal-struggles" :class="{ 'reverse': isReversed }">
    <div class="container">
      <!-- Direction toggle button -->
      <button 
        @click="toggleDirection" 
        class="direction-toggle fixed top-32 right-4 z-[101] bg-primary text-white px-4 py-2 rounded-md shadow-md"
      >
        {{ isReversed ? 'Switch to Normal' : 'Switch to Reversed' }}
      </button>
      
      <div 
        ref="strugglesContainerRef" 
        class="row-container struggles-container"
        :class="{ 'is-fixed': isFixed }"
      >
        <h2 class="section-title">Common Hurdles & Clear Solutions V2</h2>
        
        <div class="rows-wrapper">
          <!-- Struggles row -->
          <div class="row">
            <div 
              class="animation-wrap"
              :class="isReversed ? 'to-left' : 'to-right'"
              ref="strugglesWrapRef"
              :style="{ transform: strugglesTransformStyle }"
            >
              <!-- Normal order (title first) -->
              <template v-if="!isReversed">
                <!-- Title card -->
                <div class="item title-card">
                  <h3 class="heading-responsive gradient-text">Common Hurdles</h3>
                </div>
                
                <!-- Struggle cards -->
                <div 
                  v-for="(struggle, index) in struggles" 
                  :key="struggle.id"
                  class="item struggle-card hover-card group"
                >
                  <span 
                    class="absolute right-0 bottom-0 w-32 h-32 flex items-center justify-center transform translate-x-6 translate-y-6 theme-text--secondary icon-imprint"
                    v-html="icons.struggle[Object.keys(icons.struggle)[index % Object.keys(icons.struggle).length]]"
                  ></span>
                  <div class="relative z-10">
                    <h3 class="text-md font-semibold gradient-text mb-3">
                      {{ struggle.title }}
                    </h3>
                    <p class="theme-text--neutral">{{ struggle.description }}</p>
                  </div>
                </div>
              </template>
              
              <!-- Reversed order (title card on right, struggles to the left) -->
              <template v-else>
                <!-- Struggle cards first in DOM (to the left of title) -->
                <div 
                  v-for="(struggle, index) in struggles" 
                  :key="struggle.id"
                  class="item struggle-card hover-card group"
                >
                  <span 
                    class="absolute right-0 bottom-0 w-32 h-32 flex items-center justify-center transform translate-x-6 translate-y-6 theme-text--secondary icon-imprint"
                    v-html="icons.struggle[Object.keys(icons.struggle)[index % Object.keys(icons.struggle).length]]"
                  ></span>
                  <div class="relative z-10">
                    <h3 class="text-md font-semibold gradient-text mb-3">
                      {{ struggle.title }}
                    </h3>
                    <p class="theme-text--neutral">{{ struggle.description }}</p>
                  </div>
                </div>
                
                <!-- Title card last in DOM (rightmost) -->
                <div class="item title-card">
                  <h3 class="heading-responsive gradient-text">Common Hurdles</h3>
                </div>
              </template>
            </div>
          </div>
          
          <!-- Solutions row (commented out) -->
          <!-- ... -->
        </div>
      </div>
    </div>
    
    <!-- Debug info -->
    <div class="debug-info" v-if="isFixed">
      <div>Progress: {{ (scrollProgress * 100).toFixed(1) }}%</div>
      <div>Direction: {{ isReversed ? 'Reversed' : 'Normal' }}</div>
      <div>Playground view bottom: {{ playgroundViewBottom }}</div>
      <div>Struggles container bottom: {{ strugglesContainerBottom }}</div>
      <div>Difference: {{ playgroundViewBottom - strugglesContainerBottom }}</div>
    </div>
    
    <!-- Element trackers -->
    <ElementTracker 
      targetSelector=".playground-view" 
      :showMarker="true" 
      :showInfo="true" 
      color="#42b883"
      position="right"
      :offset="10"
    />
    
    <ElementTracker 
      targetSelector=".row-container.struggles-container" 
      :showMarker="true" 
      :showInfo="true" 
      color="#ff5722"
      position="left"
      :offset="10"
    />
  </section>
</template>

<style>
/* Remove all styles and use the imported SCSS file instead */
</style>