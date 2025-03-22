<template>
  <section class="reveal-section" :id="sectionId">
    <div class="sticky-container">
      <div class="header-container" :class="`header-container--${headerPosition}`">
        <slot name="header">
          <!-- Default header if none provided -->
          <h2 class="section-title gradient-text">{{ title }}</h2>
        </slot>
      </div>
      <div 
        class="content-container" 
        :class="{ 'horizontal': scrollMode === 'horizontal', 'vertical': scrollMode === 'vertical' }"
        :id="`${sectionId}Container`"
      >
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from 'vue';
import { useScrollAnimation } from '@/composables/useScrollAnimation';

interface Props {
  sectionId: string;
  title?: string;
  scrollMode?: 'horizontal' | 'vertical';
  scrollDirection?: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';
  headerPosition?: 'left' | 'right' | 'center' | 'top' | 'bottom';
  activeClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  scrollMode: 'horizontal',
  scrollDirection: 'right-to-left',
  headerPosition: 'center',
  activeClass: ''
});

// Reactive state for scroll animations
const state = reactive({
  scrollWidth: 0,
  scrollHeight: 0,
  elements: {
    section: null as HTMLElement | null,
    container: null as HTMLElement | null
  }
});

// Calculate scrollable dimensions for a container
function getScrollableDimensions(container: HTMLElement) {
  return {
    width: container.scrollWidth - window.innerWidth + 100, // Adding padding
    height: container.scrollHeight - window.innerHeight + 100 // Adding padding
  };
}

// Handle scroll events
function handleScroll() {
  const { section, container } = state.elements;
  
  const activeClass = props.activeClass || `${props.sectionId}-active`;
  if (!document.body.classList.contains(activeClass) || !section || !container) return;
  
  const rect = section.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0,
    -rect.top / (section.offsetHeight - window.innerHeight)
  ));

  // Apply transform based on scroll mode and direction
  if (props.scrollMode === 'horizontal') {
    if (props.scrollDirection === 'right-to-left') {
      // Right to left (default)
      const transform = progress * state.scrollWidth;
      container.style.transform = `translateX(-${transform}px)`;
    } else {
      // Left to right
      const transform = (1 - progress) * state.scrollWidth;
      container.style.transform = `translateX(-${transform}px)`;
    }
  } else if (props.scrollMode === 'vertical') {
    if (props.scrollDirection === 'top-to-bottom') {
      // Top to bottom
      const transform = progress * state.scrollHeight;
      container.style.transform = `translateY(-${transform}px)`;
    } else {
      // Bottom to top
      const transform = (1 - progress) * state.scrollHeight;
      container.style.transform = `translateY(-${transform}px)`;
    }
  }
}

// Extract scroll animation logic to a composable
const { setupScrollObservers, cleanupScrollObservers } = useScrollAnimation({
  onScroll: handleScroll,
  threshold: 0.1
});

onMounted(() => {
  // Get elements
  state.elements.section = document.getElementById(props.sectionId);
  state.elements.container = document.getElementById(`${props.sectionId}Container`);

  // Calculate scrollable dimensions
  if (state.elements.container) {
    const dimensions = getScrollableDimensions(state.elements.container);
    state.scrollWidth = dimensions.width;
    state.scrollHeight = dimensions.height;
    
    // Recalculate on window resize
    window.addEventListener('resize', () => {
      if (state.elements.container) {
        const dimensions = getScrollableDimensions(state.elements.container);
        state.scrollWidth = dimensions.width;
        state.scrollHeight = dimensions.height;
      }
    });
  }

  // Set up observers and scroll handler
  setupScrollObservers(state.elements.section);
  
  // Add a manual scroll handler to ensure animations work
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  cleanupScrollObservers();
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', () => {});
});
</script>

<style scoped>
.reveal-section {
  position: relative;
  height: 300vh; /* Tall enough for scrolling */
  overflow: hidden; /* Prevent scrollbars */
  z-index: 1; /* Ensure proper stacking */
}

.sticky-container {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.header-container {
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.header-container--left {
  text-align: left;
}

.header-container--right {
  text-align: right;
}

.header-container--top {
  align-self: flex-start;
}

.header-container--bottom {
  align-self: flex-end;
}

/* Horizontal scroll container */
.content-container.horizontal {
  display: flex;
  flex-wrap: nowrap;
  gap: 2rem;
  padding: 0 2rem;
  width: max-content;
  transition: transform 0.1s ease-out;
}

/* Vertical scroll container */
.content-container.vertical {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 2rem;
  padding: 2rem 0;
  height: max-content;
  transition: transform 0.1s ease-out;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
}
</style>