<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
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
const playgroundViewRef = ref<HTMLElement | null>(null);
const strugglesContainerRef = ref<HTMLElement | null>(null);
const isFixed = ref(false);
const scrollProgress = ref(0);
const scrollInfo = ref({
  startPosition: 0,
  endPosition: 0,
  totalWidth: 0,
  viewportWidth: 0,
  sectionHeight: 0
});

// Scroll tracker instance
let scrollTracker: ScrollTracker | null = null;
let visualPlugin: VisualizationPlugin | null = null;

// Computed property for transform style of struggles row
const strugglesTransformStyle = computed(() => {
  if (!strugglesWrapRef.value) return '';
  const maxTranslation = -(scrollInfo.value.totalWidth - scrollInfo.value.viewportWidth);
  const translateX = scrollProgress.value * maxTranslation;
  
  // Update visualization marker for struggles row
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
    const itemRect = (item as HTMLElement).getBoundingClientRect();
    const itemCenterX = itemRect.left + itemRect.width / 2;
    const distance = Math.abs(itemCenterX - centerX);
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });
  
  return closestIndex;
});

// Add computed properties for element positions
const playgroundViewBottom = computed(() => {
  // Get fresh reference each time for accurate position
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
    // Set fixed position when in range
    if (!isFixed.value) {
      isFixed.value = true;
      
      // When switching to fixed, ensure the parent container maintains its height
      if (sectionRef.value && strugglesContainerRef.value) {
        const containerHeight = strugglesContainerRef.value.offsetHeight;
        // Add a spacer div with the same height as the container
        if (!document.getElementById('struggles-spacer')) {
          const spacer = document.createElement('div');
          spacer.id = 'struggles-spacer';
          spacer.style.height = `${containerHeight}px`;
          spacer.style.width = '100%';
          spacer.style.display = 'block';
          strugglesContainerRef.value.parentNode?.insertBefore(spacer, strugglesContainerRef.value);
        }
      }
    }
    
    // Calculate horizontal scroll progress (0 to 1)
    const verticalScrollRange = endPosition - startPosition;
    const verticalProgress = (scrollY - startPosition) / verticalScrollRange;
    scrollProgress.value = Math.max(0, Math.min(1, verticalProgress));
    
  } else if (scrollY < startPosition) {
    // Before the section
    isFixed.value = false;
    // Remove spacer if it exists
    const spacer = document.getElementById('struggles-spacer');
    if (spacer) spacer.remove();
    scrollProgress.value = 0;
  } else {
    // After the section
    isFixed.value = false;
    // Remove spacer if it exists
    const spacer = document.getElementById('struggles-spacer');
    if (spacer) spacer.remove();
    scrollProgress.value = 1;
  }
};

// Update the calculateScrollBoundaries function to set a CSS variable for the section height
const calculateScrollBoundaries = () => {
  if (!sectionRef.value || !strugglesWrapRef.value) return;
  
  const sectionRect = sectionRef.value.getBoundingClientRect();
  const sectionTop = window.scrollY + sectionRect.top;
  
  // Calculate total width of all items in struggles row
  const totalWidth = Array.from(strugglesWrapRef.value.children).reduce((width, child) => {
    return width + (child as HTMLElement).offsetWidth;
  }, 0);
  
  // Add extra space to ensure the last item is fully visible
  const lastItem = strugglesWrapRef.value.lastElementChild as HTMLElement;
  const lastItemWidth = lastItem ? lastItem.offsetWidth : 0;
  const extraSpace = window.innerWidth - lastItemWidth;
  
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
    
    // Apply the same for solutions row if it exists
    if (solutionsWrapRef.value && newIndex < solutionsWrapRef.value.children.length) {
      const solutionCenterItem = solutionsWrapRef.value.children[newIndex] as HTMLElement;
      
      // Remove active class from all items
      Array.from(solutionsWrapRef.value.children).forEach(item => {
        item.classList.remove('active-center');
      });
      
      // Add active class to center item
      solutionCenterItem.classList.add('active-center');
    }
  }
});

// Initialize on component mount
onMounted(() => {
  try {
    // Initialize ScrollTracker
    scrollTracker = new ScrollTracker();
    
    // Add visualization plugin if needed
    visualPlugin = new VisualizationPlugin();
    if (scrollTracker && visualPlugin) {
      scrollTracker.registerPlugin(visualPlugin);
    }
    
    // Get references to elements
    playgroundViewRef.value = document.querySelector('.playground-view') as HTMLElement;
    
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

// Clean up event listeners and tracker
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', calculateScrollBoundaries);
  
  // Remove scroll lock if it exists
  document.body.classList.remove('scroll-locked');
  
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
  <section ref="sectionRef" class="horizontal-struggles">
    <div class="container">
      <!-- Struggles row (top) -->
      <div 
        ref="strugglesContainerRef" 
        class="row-container struggles-container"
        :class="{ 'is-fixed': isFixed }"
      >
        <h2 class="section-title">Common Hurdles & Clear Solutions</h2>
        
        <div class="rows-wrapper">
          <!-- Struggles row -->
          <div class="row">
            <div 
              class="animation-wrap to-right"
              ref="strugglesWrapRef"
              :style="{ transform: strugglesTransformStyle }"
            >
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
            </div>
          </div>
          
          <!-- Solutions row (bottom) -->
          <!-- <div class="row">
            <div 
              class="animation-wrap to-right"
              ref="solutionsWrapRef"
              :style="{ transform: solutionsTransformStyle }"
            >
              <div class="item title-card">
                <h3 class="heading-responsive gradient-text">Clear Solutions</h3>
              </div>
              
              <div 
                v-for="(solution, index) in solutions" 
                :key="solution.id"
                class="item solution-card hover-card group"
              >
                <span 
                  class="absolute right-0 bottom-0 w-32 h-32 flex items-center justify-center transform translate-x-6 translate-y-6 theme-text--secondary icon-imprint"
                  v-html="icons.solution[Object.keys(icons.solution)[index % Object.keys(icons.solution).length]]"
                ></span>
                <div class="relative z-10">
                  <h3 class="text-md font-semibold gradient-text mb-3">
                    {{ solution.title }}
                  </h3>
                  <p class="theme-text--neutral">{{ solution.description }}</p>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    
    <!-- Debug info -->
    <div class="debug-info" v-if="isFixed">
      <div>Progress: {{ (scrollProgress * 100).toFixed(1) }}%</div>
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