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
  element: null,
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
  
  console.log('Scroll state updated:', {
    progress: scrollState.progress,
    startPosition: scrollState.startPosition,
    endPosition: scrollState.endPosition,
    currentScroll: window.scrollY
  });
  
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
        class="accordion hover-card-themed"
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
</style>