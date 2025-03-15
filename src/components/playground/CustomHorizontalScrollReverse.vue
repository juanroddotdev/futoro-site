
<script setup lang="ts">
// Add console logs to check data
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import { icons } from '@/utils/icons';
import { ScrollTracker } from '@/utils/scroll/core/ScrollTracker';
import { VisualizationPlugin } from '@/utils/scroll/plugins/VisualizationPlugin';
import ElementTracker from '@/components/ui/ElementTracker.vue';

// Log data to verify it exists
console.log('Solutions data:', solutions);

// Scroll tracker instance
let scrollTracker: ScrollTracker | null = null;
let visualPlugin: VisualizationPlugin | null = null;

// Refs for DOM elements
const sectionRef = ref<HTMLElement | null>(null);
const solutionsWrapRef = ref<HTMLElement | null>(null);
const solutionsContainerRef = ref<HTMLElement | null>(null);
const playgroundViewRef = ref<HTMLElement | null>(null);
const isFixed = ref(false);
const scrollProgress = ref(0);
const scrollInfo = ref({
  startPosition: 0,
  endPosition: 0,
  totalWidth: 0,
  viewportWidth: 0,
  sectionHeight: 0
});

// For debugging
const playgroundViewBottom = ref(0);
const solutionsContainerBottom = ref(0);

// Computed property for transform style of solutions row (REVERSED DIRECTION)
const solutionsTransformStyle = computed(() => {
  if (!solutionsWrapRef.value) return '';
  
  // Calculate the total width of the row
  const totalWidth = scrollInfo.value.totalWidth;
  const viewportWidth = scrollInfo.value.viewportWidth;
  
  // Calculate the maximum translation needed
  // We want the right edge to align with the middle of the viewport
  // So we need to translate it by (totalWidth - viewportWidth/2)
  const maxTranslation = totalWidth - (viewportWidth / 2);
  
  // Start from right (0) and move left (negative) as progress increases
  const translateX = (1 - scrollProgress.value) * maxTranslation;
  
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
  if (!solutionsWrapRef.value || !scrollInfo.value.viewportWidth) return -1;
  
  const items = Array.from(solutionsWrapRef.value.children);
  const centerX = scrollInfo.value.viewportWidth / 2;
  // Adjust for reversed direction
  const scrollOffset = (1 - scrollProgress.value) * (scrollInfo.value.totalWidth - scrollInfo.value.viewportWidth);
  
  // Find which item is closest to the center
  let closestIndex = -1;
  let closestDistance = Infinity;
  
  return closestIndex;
});

// Function to calculate scroll boundaries
const calculateScrollBoundaries = () => {
  if (!sectionRef.value || !solutionsWrapRef.value) return;
  
  // Get section dimensions and position
  const sectionRect = sectionRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  // Calculate total width of all items
  const totalWidth = Array.from(solutionsWrapRef.value.children)
    .reduce((width, child) => width + (child as HTMLElement).offsetWidth, 0);
  
  // Add gap between items (20px per item except the last one)
  const gapWidth = (solutionsWrapRef.value.children.length - 1) * 20;
  
  // Update scroll info
  scrollInfo.value = {
    startPosition: window.pageYOffset + sectionRect.top,
    endPosition: window.pageYOffset + sectionRect.bottom - viewportHeight,
    totalWidth: totalWidth + gapWidth,
    viewportWidth: window.innerWidth,
    sectionHeight: sectionRect.height
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

// Handle scroll events manually if needed
const handleScroll = () => {
  if (!sectionRef.value) return;
  
  const scrollY = window.pageYOffset;
  const { startPosition, endPosition } = scrollInfo.value;
  
  // Check if we're in the scroll range for this section
  if (scrollY >= startPosition && scrollY <= endPosition) {
    // Calculate progress (0 to 1)
    const progress = (scrollY - startPosition) / (endPosition - startPosition);
    scrollProgress.value = Math.max(0, Math.min(1, progress));
    
    // Set fixed position when in range
    isFixed.value = true;
  } else {
    // Set progress to 0 or 1 when outside range
    scrollProgress.value = scrollY < startPosition ? 0 : 1;
    
    // Remove fixed position when outside range
    isFixed.value = false;
  }
};

// Watch for center item changes
watch(centerItemIndex, (newIndex, oldIndex) => {
  if (newIndex === -1 || newIndex === oldIndex) return;
  console.log('Center item changed:', newIndex);
});

// Initialize on component mount
onMounted(() => {
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
  
  // Calculate initial scroll boundaries
  calculateScrollBoundaries();
  
  // Add resize listener
  window.addEventListener('resize', calculateScrollBoundaries);
});

// Clean up event listeners and tracker
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', calculateScrollBoundaries);
  
  // Remove scroll lock if it exists
  document.body.classList.remove('scroll-locked');
  
  // Remove the CSS variable
  document.documentElement.style.removeProperty('--horizontal-solutions-height');
  
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
  <section ref="sectionRef" class="horizontal-solutions reverse">
    <div class="container">
      <h2 class="section-title">Common Hurdles & Clear Solutions (Reverse)</h2>
      
      <!-- Solutions row with overflow -->
      <div ref="solutionsContainerRef" class="solutions-row-container">
        <div ref="solutionsWrapRef" class="solutions-row" :style="solutionsTransformStyle">
          <!-- Solution cards first (to the left of title card) -->
          <div 
            v-for="(solution, index) in solutions.slice(0, 4)" 
            :key="solution.id"
            class="card solution-card"
          >
            <h3 class="card-title">{{ solution.title }}</h3>
            <p class="card-description">{{ solution.description }}</p>
          </div>
          
          <!-- Title card last (on the right) -->
          <div class="card title-card">
            <h3 class="heading">Clear Solutions</h3>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.horizontal-solutions {
  padding: 40px 0;
  min-height: 100vh;
  overflow-x: hidden; /* Hide horizontal scrollbar for the section */
}

.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  position: relative;
}

.section-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 24px;
}

.solutions-row-container {
  position: relative;
  width: 100%;
  overflow: visible; /* Allow content to overflow */
  display: flex;
  justify-content: flex-start; /* Changed from flex-end to flex-start */
}

.solutions-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  flex-wrap: nowrap; /* Prevent wrapping */
  width: max-content; /* Allow row to be as wide as needed */
  padding-right: 20px; /* Add some padding on the right */
  /* Initial position: right edge at the middle of viewport */
  transform: translateX(0);
}

.card {
  flex: 0 0 300px; /* Fixed width, no grow/shrink */
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 20px;
  min-height: 200px;
}

.title-card {
  background: rgba(100,100,255,0.2);
}

.solution-card {
  background: rgba(100,255,100,0.1);
}

.heading {
  font-size: 24px;
  margin-bottom: 10px;
}

.card-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.card-description {
  font-size: 14px;
}
</style>