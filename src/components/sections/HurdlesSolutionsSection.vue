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
        <AnimatedText 
      class="text-3xl font-bold text-center gradient-text mb-40" 
      firstPart="Website Solutions"
      animation="fadeUp" 
      :useGradient="true" 
      :duration="3" 
      :initiallyHidden="true" 
    />
        <!-- <WebsiteSolutionsHeader ref="fromFrustrationRef" /> -->
      </template>
      <template #subheadline>
        <AnimatedText 
        ref="splitTextRef"
        class="text-3xl font-bold text-center gradient-text" 
        firstPart="From Frustration"
        animation="slideInRight" 
        :useGradient="true" 
        :delay="3" 
        :duration="3"
        :initiallyHidden="true"
        :wordEffects="true"
        :wordTargets="['Frustration']"
        :wordEffectTypes="['highlight']"
        :wordEffectStyles="[
          { 
            gradientClass: 'gradient-theme-fire',
            iterations: 3,
            customStyles: {
              transform: 'scale(1.05)',
              display: 'inline-block',
              position: 'relative',
              transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }
          }
        ]"
        :wordEffectDuration="2"
        :wordEffectDelay=".3"
      />
       <!-- Add ember effect for "Frustration" word -->
       <EmberEffect 
        :targetElement="frustrationElement" 
        effectType="ember"
        :particleCount="20"
        :duration="2.5"
        :colors="['#ff4500', '#ff7800', '#ffaa33', '#ffcc00']"
        :relativeToParent="true"
        :startDelay="emberDelay"
        :active="frustrationElement !== null"
        @ember-start="handleEmberStart"
      />
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
    <FlexibleContentWithPhone
      phonePosition="right"
      :messages="getTransitionToSolutions()"
      :showTypingFor="[0, 1]"
      :tilt-x="8"
      :tilt-y="-20"
      sectionId="solutions"
      layout="content-left"
      :animation="{
        contentFirst: true,
        duration: 0.7,
        phoneDelay: 1
      }"
      :initiallyHidden="true" 
      ref="flexibleContentRef"
    >
      <template #subheadline>
        <AnimatedText 
        ref="toFantasticRef"
        class="text-3xl font-bold text-center gradient-text" 
        firstPart="To Fantastic" 
        animation="slideInLeft" 
        :useGradient="true" 
        :delay="3" 
        :duration="3"
        :initiallyHidden="true"
        :wordEffects="true"
        :wordTargets="['Fantastic']"
        :wordEffectTypes="['highlight']"
        :wordEffectStyles="[
          { 
            gradientClass: 'gradient-theme-cool',
            iterations: 3,
            customStyles: {
              transform: 'scale(1.05)',
              display: 'inline-block',
              position: 'relative',
              transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }
          }
        ]"
        :wordEffectDuration="2"
        :wordEffectDelay=".3"
      />
      </template>
      
    </FlexibleContentWithPhone>

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
    <!-- <PhoneSection
      :messages="getFinalConversation()" 
      sectionId="final"
      :showTypingFor="[0, 1]" 
      :tilt-x="8"
      :tilt-y="20"
      position="center"
    /> -->
    
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, reactive, watch, nextTick } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import { useScrollAnimation } from '@/composables/useScrollAnimation';
import WebsiteSolutionsHeader from '@/components/sections/WebsiteSolutionsHeader.vue';
import ScrollableCardsSection from '@/components/sections/ScrollableCardsSection.vue';
import FlexibleContentWithPhone from '@/components/sections/FlexibleContentWithPhone.vue';
import EmberEffect from '@/components/effects/EmberEffect.vue';
import {
  getInitialConversation,
  getHurdlesIntroduction,
  getTransitionToSolutions,
  getFinalConversation
} from '@/data/chatSections';
import { getTimestampForLog, formatElapsedTime } from '@/utils/timestamp';

const frustrationElement = ref<HTMLElement | null>(null);
// Computed value for ember delay
const emberDelay = ref(0.5);
const emberStartTime = ref<number | null>(null);
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


const handleEmberStart = () => {
  emberStartTime.value = Date.now();
  console.log('Ember effect started at:', getTimestampForLog());
};

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
