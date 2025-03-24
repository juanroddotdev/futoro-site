<template>
  <div class="progressive-reveal overflow-visible" ref="sectionContainerRef">
    <FlexibleContentWithPhone
      phonePosition="left"
      :messages="getHurdlesIntroduction()"
      :showTypingFor="[0, 1]"
      :tilt-x="8"
      :tilt-y="20"
      sectionId="hurdles"
      layout="content-right"
      :animation="{
        contentFirst: true,
        duration: 0.7,
        phoneDelay: 1
      }"
      :initiallyHidden="true" 
      ref="flexibleContentRef"
    >
      <template #headline>
        <WebsiteSolutionsHeader />
      </template>
      
    </FlexibleContentWithPhone>

    <!-- Hurdles Section -->
    <ScrollableCardsSection
      sectionId="hurdlesSection"
      containerId="hurdlesContainer"
      title="Common Hurdles"
      :items="struggles"
      sectionClass="hurdles-section"
      cardClass="struggle-card"
      headerContainerClass="header-container--hurdles"
      titleAnimation="slideInRight"
      :reverseLayout="false"
    />
    <PhoneSection
      :messages="getTransitionToSolutions()" 
      sectionId="solutions"
      :showTypingFor="[0, 1]"
      :tilt-x="8"
      :tilt-y="-20"
      position="center"
    />

    <!-- Solutions Section -->
    <ScrollableCardsSection
      sectionId="solutionsSection"
      containerId="solutionsContainer"
      title="Clear Solutions"
      :items="reversedSolutions"
      sectionClass="solutions-section"
      cardClass="solution-card"
      headerContainerClass="header-container--solutions"
      titleAnimation="slideInLeft"
      :reverseLayout="true"
    />
    <PhoneSection
      :messages="getFinalConversation()" 
      sectionId="final"
      :showTypingFor="[0, 1]" 
      :tilt-x="8"
      :tilt-y="20"
      position="center"
    />
    
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, reactive, watch, nextTick } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import { useScrollAnimation } from '@/composables/useScrollAnimation';
import { useScrollDebugger } from '@/composables/useScrollDebugger';
import gsap from 'gsap';
import WebsiteSolutionsHeader from '@/components/sections/WebsiteSolutionsHeader.vue';
import ScrollableCardsSection from '@/components/sections/ScrollableCardsSection.vue';
import PhoneSection from '@/components/PhoneSection.vue';
import FlexibleContentWithPhone from '@/components/sections/FlexibleContentWithPhone.vue';
import {
  getInitialConversation,
  getHurdlesIntroduction,
  getTransitionToSolutions,
  getFinalConversation
} from '@/data/chatSections';
import ScrollDebugger from '@/utils/scroll/debug/ScrollDebugger';


// Define the handleResize function
function handleResize() {
  // Recalculate dimensions on window resize
  nextTick(() => {
    initializeElements();
  });
  
}

// Register components we want to track
onMounted(() => {
  
  // Initialize elements after a short delay to ensure DOM is updated
  nextTick(() => {
    initializeElements();
  });
});

// Computed property to reverse the solutions array
const reversedSolutions = computed(() => [...solutions].reverse());

// Reactive state for scroll animations
const state = reactive({
  hurdlesScrollWidth: 0,
  solutionsScrollWidth: 0,
  elements: {
    hurdlesSection: null as HTMLElement | null,
    solutionsSection: null as HTMLElement | null,
    hurdlesContainer: null as HTMLElement | null,
    solutionsContainer: null as HTMLElement | null
  }
});

// Refs for intersection observer
const flexibleContentRef = ref<ComponentPublicInstance<{}, { 
  startAnimations: () => void,
  animation?: { phoneDelay?: number | string },
  initiallyHidden?: boolean
}>>();

// Extract scroll animation logic to a composable
const { setupScrollObservers, cleanupScrollObservers } = useScrollAnimation({
  onScroll: handleScroll,
  threshold: 0.1
});


// Calculate scrollable width for a container
function getScrollableWidth(container: HTMLElement): number {
  return container.scrollWidth - window.innerWidth + 100; // Adding padding
}

// Handle scroll events for both sections
function handleScroll() {
  handleHurdlesScroll();
  handleSolutionsScroll();
}

// Handle hurdles section scroll
function handleHurdlesScroll() {
  const { hurdlesSection, hurdlesContainer } = state.elements;
  
  if (!document.body.classList.contains('hurdles-active') || !hurdlesSection || !hurdlesContainer) return;
  
  const hurdlesRect = hurdlesSection.getBoundingClientRect();
  const hurdlesProgress = Math.min(1, Math.max(0,
    -hurdlesRect.top / (hurdlesSection.offsetHeight - window.innerHeight)
  ));

  // Apply transform to hurdles container (right to left)
  const hurdlesTransform = hurdlesProgress * state.hurdlesScrollWidth;
  hurdlesContainer.style.transform = `translateX(-${hurdlesTransform}px)`;
  

}

// Handle solutions section scroll
function handleSolutionsScroll() {
  const { solutionsSection, solutionsContainer } = state.elements;
  
  if (!document.body.classList.contains('solutions-active') || !solutionsSection || !solutionsContainer) return;
  
  const solutionsRect = solutionsSection.getBoundingClientRect();
  const solutionsProgress = Math.min(1, Math.max(0,
    -solutionsRect.top / (solutionsSection.offsetHeight - window.innerHeight)
  ));

  // Apply transform to solutions container (reversed direction)
  const solutionsTransform = (1 - solutionsProgress) * state.solutionsScrollWidth;
  solutionsContainer.style.transform = `translateX(-${solutionsTransform}px)`;
  
 
}

function initializeElements() {
  
  // Get elements
  state.elements.hurdlesSection = document.getElementById('hurdlesSection');
  state.elements.solutionsSection = document.getElementById('solutionsSection');
  state.elements.hurdlesContainer = document.getElementById('hurdlesContainer');
  state.elements.solutionsContainer = document.getElementById('solutionsContainer');

  // Calculate scrollable widths
  if (state.elements.hurdlesContainer) {
    state.hurdlesScrollWidth = getScrollableWidth(state.elements.hurdlesContainer);
  
  }
  if (state.elements.solutionsContainer) {
    state.solutionsScrollWidth = getScrollableWidth(state.elements.solutionsContainer);

  } 
  // Set up observers and scroll handler
  if (state.elements.hurdlesSection && state.elements.solutionsSection) {
    setupScrollObservers(state.elements.hurdlesSection, state.elements.solutionsSection);
    window.addEventListener('scroll', handleScroll);
    
    // Initial calculation
    handleScroll();
  } 
}

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
  cleanupScrollObservers();
});

</script>

<style lang="scss" scoped>
.section-container {
  border: 2px solid red; /* Visible border to help with debugging */
  min-height: 100vh; /* Ensure it's tall enough to trigger properly */
  opacity: 1; /* The container itself is visible */
}
</style>
