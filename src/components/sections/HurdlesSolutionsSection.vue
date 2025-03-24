<template>
  <div class="progressive-reveal overflow-visible" ref="sectionContainerRef"> <!-- Added ref here -->
    <!-- <PhoneSection
      :messages="getInitialConversation()" 
      sectionId="vision"
      :showTypingFor="[0, 1]"
      :tilt-x="8"
      :tilt-y="-20"
      position="right"
    /> -->
    <FlexibleContentWithPhone
      phonePosition="left"
      :messages="getHurdlesIntroduction()"
      :showTypingFor="[0, 1]"
      :tilt-x="8"
      :tilt-y="20"
      sectionId="hurdles"
      layout="content-right"
      :animation="{
        contentFirst: true, // Content appears first
        duration: 0.7, // Animation duration
        phoneDelay: 1
      }"
      :initiallyHidden="true" 
      ref="flexibleContentRef"
    >
      <template #headline>
        <WebsiteSolutionsHeader />
      </template>
    </FlexibleContentWithPhone>
    <!-- <WebsiteSolutionsHeader /> -->
    <!-- <PhoneSection
      :messages="getHurdlesIntroduction()" 
      sectionId="hurdles"
      :showTypingFor="[0, 1]"
      :tilt-x="8"
      :tilt-y="20"
      position="left"
    /> -->

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
import { onMounted, onUnmounted, computed, ref, reactive } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import { useScrollAnimation } from '@/composables/useScrollAnimation';
import gsap from 'gsap';
import WebsiteSolutionsHeader from '@/components/sections/WebsiteSolutionsHeader.vue';
import ScrollableCardsSection from '@/components/sections/ScrollableCardsSection.vue';
import PhoneSection from '@/components/PhoneSection.vue';
import FlexibleContentWithPhone from '@/components/sections/FlexibleContentWithPhone.vue';
import {
  getVisionToRealitySteps,
  getCommonFrustrationsSteps,
  getPersonalApproachSteps,
  getCollaborationProcessSteps,
  getInitialConversation,
  getHurdlesIntroduction,
  getTransitionToSolutions,
  getFinalConversation
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

// Add timestamp utility function
const getTimestamp = () => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
  return `[${time}]`;
};

// Track page load time
const pageLoadTime = performance.now();
console.log(`${getTimestamp()} 📄 Page load started (t=0ms)`);

// Refs for intersection observer
const mainSectionRef = ref(null);
const sectionContainerRef = ref(null);
const flexibleContentRef = ref<ComponentPublicInstance<{}, { startAnimations: () => void }>>();
const sectionVisible = ref(false);

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
  const mountTime = performance.now() - pageLoadTime;
  console.log(`${getTimestamp()} 🔄 Component mounted (t=${mountTime.toFixed(0)}ms)`);
  
  // Set up intersection observer for the main section
  if (sectionContainerRef.value) {
    console.log(`${getTimestamp()} 🔍 Setting up intersection observer for HurdlesSolutionsSection`);
    
    // Check if element is already in viewport on page load
    const rect = sectionContainerRef.value.getBoundingClientRect();
    const isInitiallyVisible = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    
    console.log(`${getTimestamp()} 📏 Initial visibility check: ${isInitiallyVisible} (t=${(performance.now() - pageLoadTime).toFixed(0)}ms)`);
    
    // If already visible on page load, trigger animations immediately
    if (isInitiallyVisible && !sectionVisible.value) {
      sectionVisible.value = true;
      console.log(`${getTimestamp()} 🔍 HurdlesSolutionsSection is initially visible in viewport (t=${(performance.now() - pageLoadTime).toFixed(0)}ms)`);
      
      // Trigger animations for all components
      if (flexibleContentRef.value) {
        console.log(`${getTimestamp()} 📱 Starting phone animations immediately (t=${(performance.now() - pageLoadTime).toFixed(0)}ms)`);
        flexibleContentRef.value.startAnimations();
      } else {
        console.error(`${getTimestamp()} ❌ flexibleContentRef is not available (t=${(performance.now() - pageLoadTime).toFixed(0)}ms)`);
      }
    }
    
    // Set up observer for scrolling into view later
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      const observerTime = performance.now() - pageLoadTime;
      
      console.log(`${getTimestamp()} 👁️ Intersection detected (t=${observerTime.toFixed(0)}ms), isIntersecting: ${entry.isIntersecting}`);
      
      if (entry.isIntersecting && !sectionVisible.value) {
        sectionVisible.value = true;
        console.log(`${getTimestamp()} 🔍 HurdlesSolutionsSection is now visible in viewport (t=${observerTime.toFixed(0)}ms)`);
        
        // Trigger animations for all components
        if (flexibleContentRef.value) {
          console.log(`${getTimestamp()} 📱 Starting phone animations with delay: ${
            flexibleContentRef.value.$props?.animation?.phoneDelay || 'default'} (t=${observerTime.toFixed(0)}ms)`);
          flexibleContentRef.value.startAnimations();
        } else {
          console.error(`${getTimestamp()} ❌ flexibleContentRef is not available (t=${observerTime.toFixed(0)}ms)`);
        }
        
        // Remove the observer once triggered
        observer.disconnect();
        console.log(`${getTimestamp()} 👁️ Intersection observer disconnected (t=${observerTime.toFixed(0)}ms)`);
      }
    }, {
      threshold: 0.1 // Trigger when 10% of the element is visible
    });
    
    observer.observe(sectionContainerRef.value);
    console.log(`${getTimestamp()} 👀 Now observing section container (t=${(performance.now() - pageLoadTime).toFixed(0)}ms)`);
  } else {
    console.error(`${getTimestamp()} ❌ sectionContainerRef is not available (t=${(performance.now() - pageLoadTime).toFixed(0)}ms)`);
  }
  
  // Test GSAP
  const testEl = document.createElement('div');
  testEl.textContent = 'Test';
  document.body.appendChild(testEl);
  gsap.to(testEl, {
    x: 100,
    duration: 1,
    onComplete: () => {
      console.log('GSAP test animation complete');
      testEl.remove();
    }
  });
  
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
  window.addEventListener('scroll', handleScroll);
  
  // Initial calculation
  handleScroll();
  
  // Handle window resize
  window.addEventListener('resize', handleResize);
});

// Recalculate on window resize
function handleResize() {
  if (state.elements.hurdlesContainer) {
    state.hurdlesScrollWidth = getScrollableWidth(state.elements.hurdlesContainer);
  }
  
  if (state.elements.solutionsContainer) {
    state.solutionsScrollWidth = getScrollableWidth(state.elements.solutionsContainer);
  }
  
  // Update transforms
  handleScroll();
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
