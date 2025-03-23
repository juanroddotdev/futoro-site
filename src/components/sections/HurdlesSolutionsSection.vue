<template>
  <div class="progressive-reveal overflow-visible">
    <!-- First ClientConversationSection before the header -->

    <PhoneConversationPushUp 
      :messages="convertStepsToMessages(getVisionToRealitySteps())" 
      section-id="vision"
      :show-typing-for="[0, 1]" />

    <!-- Use the extracted component -->
    <FrustrationToFantasticHeader />

    <!-- Second ClientConversationSection after the header -->
    <!-- <ClientConversationSection 
      conversationType="frustration" 
      sectionTitle="Common Frustrations"
      sectionId="frustration-intro"
      tiltDirection="right"
      sectionHeight="150vh"
    /> -->

    <!-- Hurdles Section -->
    <section class="reveal-section hurdles-section" id="hurdlesSection">
      <div class="sticky-container">
        <div class="header-container header-container--hurdles">
          <AnimatedText class="section-title gradient-text" firstPart="Common Hurdles" animation="slideInRight"
            :useGradient="true" :duration="3" :initiallyHidden="true" />

        </div>
        <div class="cards-container" id="hurdlesContainer">
          <div class="card title-card">
            <!-- placeholder card -->
          </div>
          <div class="card struggle-card group hover-card-themed p-6 relative overflow-hidden"
            v-for="struggle in struggles" :key="`hurdle-${struggle.id}`">
            <div class="relative z-10">
              <h3 class="text-md font-semibold gradient-text mb-3">{{ struggle.title }}</h3>
              <p class="theme-text--neutral">{{ struggle.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Third ClientConversationSection after hurdles section -->
    <!-- <ClientConversationSection 
      conversationType="approach" 
      sectionTitle="A Personal Approach"
      sectionId="approach-intro"
      tiltDirection="left"
      sectionHeight="150vh"
    /> -->

    <!-- Solutions Section -->
    <section class="reveal-section solutions-section" id="solutionsSection">
      <div class="sticky-container">
        <div class="header-container header-container--solutions">
          <AnimatedText class="section-title gradient-text" firstPart="Clear Solutions" animation="slideInLeft"
            :useGradient="true" :duration="3" :initiallyHidden="true" />
          <!-- <h2 class="section-title gradient-text">Clear Solutions</h2> -->
        </div>
        <div class="cards-container" id="solutionsContainer">
          <div class="card solution-card group hover-card-themed p-6 relative overflow-hidden"
            v-for="solution in reversedSolutions" :key="`solution-${solution.id}`">
            <div class="relative z-10">
              <h3 class="text-md font-semibold gradient-text mb-3">{{ solution.title }}</h3>
              <p class="theme-text--neutral">{{ solution.description }}</p>
            </div>
          </div>
          <!-- Title card moved to the beginning -->
          <div class="card title-card">
            <!-- placeholder card -->
          </div>
        </div>
      </div>
    </section>

    <!-- Fourth ClientConversationSection after solutions section -->
    <!-- <ClientConversationSection 
      conversationType="process" 
      sectionTitle="Our Collaboration Process"
      sectionId="process-intro"
      tiltDirection="right"
      sectionHeight="150vh"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, reactive } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import { useScrollAnimation } from '@/composables/useScrollAnimation';
import FrustrationToFantasticHeader from '@/components/sections/FrustrationToFantasticHeader.vue';
import PhoneConversationPushUp from '@/components/PhoneConversationPushUp.vue';
import {
  convertStepsToMessages,
  getVisionToRealitySteps,
  getCommonFrustrationsSteps,
  getPersonalApproachSteps,
  getCollaborationProcessSteps
} from '@/data/chatSections';


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

onMounted(() => {
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
  setupScrollObservers(state.elements.hurdlesSection, state.elements.solutionsSection);

  // Add a manual scroll handler to ensure animations work
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  cleanupScrollObservers();
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.keyword {
  display: inline-block;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  transition: background-image 0.5s ease;
}

.word-effect {
  position: relative;
  /* Add this to make positioning work */
}
</style>
