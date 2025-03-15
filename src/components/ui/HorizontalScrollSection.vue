<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

// Component props
const props = defineProps({
  // Direction of scroll: 'normal' (right to left) or 'reverse' (left to right)
  initialDirection: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'reverse'].includes(value)
  },
  // Items to display in the scroll
  items: {
    type: Array,
    default: () => []
  },
  // Title for the section
  sectionTitle: {
    type: String,
    default: 'Horizontal Scroll Section'
  },
  // Title for the title card
  titleCardText: {
    type: String,
    default: 'Title Card'
  },
  // Start first item in the middle of viewport (for normal direction)
  startInMiddle: {
    type: Boolean,
    default: false
  },
  // Start title card in the middle of viewport (for reverse direction)
  startReverseInMiddle: {
    type: Boolean,
    default: false
  }
});

// Refs for DOM elements
const sectionRef = ref(null);
const containerRef = ref(null);
const scrollWrapRef = ref(null);

// State variables
const isReversed = ref(props.initialDirection === 'reverse');
const isFixed = ref(false);
const scrollProgress = ref(0);
const titleCardWidth = ref(300);

// Scroll information
const scrollInfo = ref({
  startPosition: 0,
  endPosition: 0,
  totalWidth: 0,
  viewportWidth: 0,
  sectionHeight: 0
});

// Toggle direction between normal and reverse
const toggleDirection = () => {
  isReversed.value = !isReversed.value;
};

// Calculate transform style based on scroll progress
const transformStyle = computed(() => {
  if (!scrollWrapRef.value) return '';
  
  const totalWidth = scrollInfo.value.totalWidth;
  const viewportWidth = scrollInfo.value.viewportWidth;
  
  let translateX;
  
  if (isReversed.value) {
    // Reversed: Title card should be in the middle or at right edge
    // Find the title card element (it's the last child in reversed mode)
    const titleCardElement = scrollWrapRef.value.querySelector('.title-card');
    const titleWidth = titleCardElement ? titleCardElement.offsetWidth : 300;
    
    if (props.startReverseInMiddle) {
      // Position the title card in the middle when section first appears
      if (scrollProgress.value === 0) {
        // Simple centering of the title card
        translateX = (viewportWidth / 2) - (titleWidth / 2);
      } else {
        // As scroll progresses, move from centered position to final position
        const maxTranslation = totalWidth - viewportWidth;
        const initialOffset = (viewportWidth / 2) - (titleWidth / 2);
        translateX = initialOffset - (maxTranslation * scrollProgress.value);
      }
    } else {
      // Original behavior: title card at right edge
      const initialOffset = viewportWidth - titleWidth;
      const maxTranslation = totalWidth - viewportWidth;
      translateX = initialOffset - (maxTranslation * (1 - scrollProgress.value));
    }
  } else {
    // Normal direction logic remains unchanged
    const maxTranslation = -(totalWidth - viewportWidth);
    
    if (props.startInMiddle && scrollProgress.value === 0) {
      const firstItemWidth = scrollWrapRef.value.firstElementChild ? 
        scrollWrapRef.value.firstElementChild.offsetWidth : 300;
      translateX = (viewportWidth / 2) - (firstItemWidth / 2);
    } else {
      translateX = scrollProgress.value * maxTranslation;
    }
  }
  console.log('isReversed.value:', isReversed.value)
  console.log('translateX:', translateX)
  
  return `translateX(${translateX}px)`;
});

// Handle scroll event
const handleScroll = () => {
  if (!sectionRef.value || !scrollWrapRef.value) return;
  
  const scrollY = window.scrollY;
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
  
  // Check if we've reached the end of the section
  if (scrollY >= endPosition) {
    // Add class to indicate section is complete
    sectionRef.value?.classList.add('section-complete');
  } else {
    // Remove class when not at the end
    sectionRef.value?.classList.remove('section-complete');
  }
};

// Calculate scroll boundaries
const calculateScrollBoundaries = () => {
  if (!sectionRef.value || !scrollWrapRef.value) return;
  
  // Get section position
  const sectionRect = sectionRef.value.getBoundingClientRect();
  const sectionTop = window.pageYOffset + sectionRect.top;
  const viewportHeight = window.innerHeight;
  
  // Calculate total width of the scroll wrap
  let totalWidth = scrollWrapRef.value.scrollWidth;
  
  // Add extra space to ensure the last item is fully visible
  const lastItem = scrollWrapRef.value.lastElementChild;
  const lastItemWidth = lastItem ? lastItem.offsetWidth : 0;
  const extraSpace = window.innerWidth - lastItemWidth;
  
  // Measure title card width if it exists
  const titleCard = scrollWrapRef.value.querySelector('.title-card');
  if (titleCard) {
    titleCardWidth.value = titleCard.offsetWidth;
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
    document.documentElement.style.setProperty('--horizontal-scroll-height', `${requiredHeight}px`);
  }
  
  // Store scroll boundaries
  scrollInfo.value = {
    startPosition: sectionTop,
    endPosition: sectionTop + requiredHeight,
    totalWidth: totalWidth + extraSpace,
    viewportWidth: window.innerWidth,
    sectionHeight: requiredHeight
  };
};

// Initialize on component mount
onMounted(() => {
  // Calculate boundaries after DOM is ready
  setTimeout(() => {
    calculateScrollBoundaries();
    
    // Initial scroll check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculateScrollBoundaries);
  }, 100);
});

// Clean up event listeners
onBeforeUnmount(() => {
  // Remove scroll event listener
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', calculateScrollBoundaries);
  
  // Remove the CSS variable
  document.documentElement.style.removeProperty('--horizontal-scroll-height');
});
</script>

<template>
  <section ref="sectionRef" class="horizontal-scroll" :class="{ 'reverse': isReversed }">
    <div class="container">
      <!-- Optional direction toggle button -->
      <button 
        v-if="$slots.toggleButton"
        @click="toggleDirection" 
        class="direction-toggle"
      >
        <slot name="toggleButton">
          {{ isReversed ? 'Switch to Normal' : 'Switch to Reversed' }}
        </slot>
      </button>
      
      <div 
        ref="containerRef" 
        class="row-container"
        :class="{ 'is-fixed': isFixed }"
      >
        <!-- <h2 v-if="sectionTitle" class="section-title">{{ sectionTitle }}</h2> -->
        
        <div class="rows-wrapper">
          <div class="row">
            <div 
              class="animation-wrap"
              :class="[
                isReversed ? 'to-left' : 'to-right', 
                { 
                  'start-in-middle': props.startInMiddle && !isReversed,
                  'start-reverse-in-middle': props.startReverseInMiddle && isReversed
                }
              ]"
              ref="scrollWrapRef"
              :style="{ transform: transformStyle }"
            >
              <!-- Normal order (title first) -->
              <template v-if="!isReversed">
                <!-- Title card -->
                <div class="item title-card">
                  <slot name="titleCard">
                    <h3 class="heading">{{ titleCardText }}</h3>
                  </slot>
                </div>
                
                <!-- Item cards -->
                <slot name="items">
                  <div 
                    v-for="(item, index) in items" 
                    :key="index"
                    class="item content-card"
                  >
                    <h3 v-if="item.title" class="card-title">{{ item.title }}</h3>
                    <p v-if="item.description" class="card-description">{{ item.description }}</p>
                  </div>
                </slot>
              </template>
              
              <!-- Reversed order (title card on right, items to the left) -->
              <template v-else>
                <!-- Title card first in DOM for proper centering -->
                <div class="item title-card">
                  <slot name="titleCard">
                    <h3 class="heading">{{ titleCardText }}</h3>
                  </slot>
                </div>
                
                <!-- Item cards after title card -->
                <slot name="items-reversed">
                  <div 
                    v-for="(item, index) in items" 
                    :key="index"
                    class="item content-card"
                  >
                    <h3 v-if="item.title" class="card-title">{{ item.title }}</h3>
                    <p v-if="item.description" class="card-description">{{ item.description }}</p>
                  </div>
                </slot>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/* Remove all styles and use the imported SCSS file instead */
</style>