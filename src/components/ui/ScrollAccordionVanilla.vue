<script setup lang="ts">
import { onMounted, ref, onUnmounted, reactive } from 'vue';
import {
  AccordionItem,
  ScrollState,
  Handlers,
  initAccordionScrollTracking,
  calculateScrollProgress,
  calculateAccordionProgress,
  animateAccordionText,
  animateAccordionMargin,
  trackLastAccordionProgress,
  trackAccordionCompletion,
  cleanup
} from '@/utils/scrollAccordion';

defineProps<{
  items: AccordionItem[];
}>();

// Refs for DOM elements
const accordionsRef = ref<HTMLElement | null>(null);
const placeholderRef = ref<HTMLElement | null>(null);

// Group related state in a reactive object
const scrollState = reactive<ScrollState>({
  startPosition: 0,
  endPosition: 0,
  progress: 0,
  scrollAccordionEl: null,
});

// Group observers and listeners
const handlers: Handlers = {
  observer: null,
  scrollListener: null,
  resizeListener: null,
};

// Handle scroll events
function handleScroll() {
  if (!scrollState.scrollAccordionEl || !accordionsRef.value) return;
  
  // Calculate scroll progress (0 to 1)
  scrollState.progress = calculateScrollProgress(scrollState);
  animateAccordions(scrollState.progress);
}

// Animate accordions based on scroll progress
function animateAccordions(progress: number) {
  if (!scrollState.scrollAccordionEl) return;
  
  const textElements = scrollState.scrollAccordionEl.querySelectorAll('.accordion .text') as NodeListOf<HTMLElement>;
  const accordionElements = scrollState.scrollAccordionEl.querySelectorAll('.accordion') as NodeListOf<HTMLElement>;
  const totalAccordions = accordionElements.length;
  
  // Animate each accordion
  textElements.forEach((text, index) => {
    const accordionProgress = calculateAccordionProgress(progress, index, totalAccordions);
    
    // Track completion of last accordion
    trackLastAccordionProgress(text, accordionProgress, index, totalAccordions, progress);
    
    // Apply animations
    animateAccordionText(text, accordionProgress);
    animateAccordionMargin(accordionElements[index], accordionProgress);
  });
  
  // Track overall animation completion
  trackAccordionCompletion(scrollState, progress);
}

// Lifecycle hooks
onMounted(() => {
  if (accordionsRef.value && placeholderRef.value) {
    initAccordionScrollTracking(
      accordionsRef.value,
      scrollState,
      handlers,
      handleScroll
    );
  }
});

onUnmounted(() => {
  cleanup(handlers);
});
</script>

<template>
  <div class="scroll-accordion">
    <div class="placeholder" ref="placeholderRef"></div>
    <div class="accordions" ref="accordionsRef">
      <div 
        v-for="item in items" 
        :key="item.id" 
        class="accordion"
      >
        <div class="title">
          {{ item.title }}
        </div>
        <div class="text">
          {{ item.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-accordion {
  width: 100%;
  /* Set both minimum and maximum height to 2000px */
  min-height: 2000px;
  max-height: 2000px;
  position: relative;
}

.placeholder {
  /* Invisible placeholder that maintains space in document flow */
  visibility: hidden;
}

.accordions {
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  max-width: fit-content;
  margin: 0 auto;
  margin-inline: auto;
  /* Add transform-origin to ensure smooth transitions */
  transform-origin: center top;
}

.accordion {
  margin-bottom: 40px;
  background: linear-gradient(200deg, rgb(29, 145, 252) 13.57%, rgb(90, 54, 192) 98.38%);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.title {
  font-weight: bold;
  padding: 1rem;
  color: white;
}

.text {
  padding: 1rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
}

/* Remove the marker styles */
/* :deep(.scroll-height-marker) {
  pointer-events: none;
} */
</style>