<template>
  <div class="progressive-reveal overflow-visible"> <!-- Ensure overflow is visible -->

    <div class="py-20">
      <AnimatedText class="text-3xl font-bold text-center gradient-text my-10" firstPart="Website Solutions"
      animation="fadeUp" :useGradient="true" :duration="3" :initiallyHidden="true" />
      <div class="relative">
        <AnimatedText 
          ref="splitTextRef"
          class="text-3xl font-bold text-center gradient-text" 
          firstPart="From Frustration"
          secondPart="To Fantastic" 
          animation="split" 
          :useGradient="true" 
          :delay="3" 
          :duration="3"
          :initiallyHidden="true"
          :wordEffects="true"
          :wordTargets="['Frustration', 'Fantastic']"
          :wordEffectTypes="['highlight', 'highlight']"
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
            },
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
          @animation-start="handleAnimationStart"
          @word-effect-start="handleWordEffectStart"
          @word-effect-complete="handleWordEffectComplete"
        />
        
        <!-- Add ember effect for "Frustration" word -->
        <EmberEffect 
          :targetElement="frustrationElement" 
          effectType="rain"
          :particleCount="20"
          :duration="2.5"
          :colors="['#ff4500', '#ff7800', '#ffaa33', '#ffcc00']"
          :relativeToParent="true"
          :startDelay="emberDelay"
          :active="frustrationElement !== null"
          @ember-start="handleEmberStart"
        />
        <!-- Add ember effect that's always running but initially invisible -->
  
      </div>
    </div>
    <!-- Hurdles Section -->
    <section class="reveal-section hurdles-section" id="hurdlesSection">
      <div class="sticky-container">
        <div class="header-container header-container--hurdles">
          <AnimatedText 
            class="section-title gradient-text"
            firstPart="Common Hurdles"  
            animation="slideInRight"
            :useGradient="true" :duration="3" :initiallyHidden="true"
          />
          
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

    <!-- Solutions Section -->
    <section class="reveal-section solutions-section" id="solutionsSection">
      <div class="sticky-container">
        <div class="header-container header-container--solutions">
          <AnimatedText 
            class="section-title gradient-text"
            firstPart="Clear Solutions"  
            animation="slideInLeft"
            :useGradient="true" :duration="3" :initiallyHidden="true"
          />
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, reactive, nextTick } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import { useScrollAnimation } from '@/composables/useScrollAnimation';
import gsap from 'gsap';
import EmberEffect from '@/components/effects/EmberEffect.vue';

const documentBody = ref(document.body);

// Computed property to reverse the solutions array
const reversedSolutions = computed(() => [...solutions].reverse());

// Reference to the split text component
const splitTextRef = ref<{ $el: HTMLElement } | null>(null);
const frustrationElement = ref<HTMLElement | null>(null);

// Add a flag to track if animation has started
const animationStarted = ref(false);

// Add debug refs to track timing
const animationStartTime = ref<number | null>(null);
const wordEffectStartTime = ref<number | null>(null);
const emberStartTime = ref<number | null>(null);

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

// Handle word effect complete event
const handleWordEffectComplete = () => {
  nextTick(() => {
    // Find the "Frustration" word element after effects are applied
    const wordElements = document.querySelectorAll('.word-effect');
    wordElements.forEach(el => {
      if (el.textContent === 'Frustration') {
        frustrationElement.value = el as HTMLElement;
      }
    });
  });
};

// Add a new handler for animation start
const handleAnimationStart = () => {
  animationStarted.value = true;
  animationStartTime.value = Date.now();
  console.log('Animation started at:', new Date().toISOString());
  
  // Find the "Frustration" word element immediately
  nextTick(() => {
    const firstPartElement = splitTextRef.value?.$el.querySelector('.first-part');
    if (firstPartElement) {
      const wordElements = firstPartElement.querySelectorAll('span');
      wordElements.forEach(el => {
        if (el.textContent === 'Frustration') {
          frustrationElement.value = el as HTMLElement;
        }
      });
    }
  });
};

// Add a handler for word effect start
const handleWordEffectStart = () => {
  wordEffectStartTime.value = Date.now();
  console.log('Word effect started at:', new Date().toISOString());
  console.log('Time between animation and word effect:', 
    (wordEffectStartTime.value - (animationStartTime.value || 0)) / 1000, 'seconds');
    
  // Find the "Frustration" word element immediately when word effect starts
  nextTick(() => {
    const firstPartElement = splitTextRef.value?.$el.querySelector('.first-part');
    if (firstPartElement) {
      // Try to find the word-effect element first
      let wordElements = firstPartElement.querySelectorAll('.word-effect');
      
      // If no word-effect elements yet, look for any span containing "Frustration"
      if (wordElements.length === 0) {
        wordElements = firstPartElement.querySelectorAll('span');
      }
      
      wordElements.forEach(el => {
        if (el.textContent === 'Frustration') {
          console.log('Found frustration element at:', new Date().toISOString());
          frustrationElement.value = el as HTMLElement;
          console.log('Set frustrationElement.value at:', new Date().toISOString());
        }
      });
    }
  });
};

// Add a handler for ember effect start
const handleEmberStart = () => {
  emberStartTime.value = Date.now();
  console.log('Ember effect started at:', new Date().toISOString());
  
  if (animationStartTime.value) {
    console.log('Time between animation and ember start:', 
      (emberStartTime.value - animationStartTime.value) / 1000, 'seconds');
  }
  
  if (wordEffectStartTime.value) {
    console.log('Time between word effect and ember start:', 
      (emberStartTime.value - wordEffectStartTime.value) / 1000, 'seconds');
  }
};

// Update the emberDelay computed property to use a fixed value that matches the word effect
const emberDelay = computed(() => {
  // Small delay after word effect for visual separation
  return 0.1;
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

.keyword-frustration {
  /* Default style before animation */
}

.keyword-fantastic {
  /* Default style before animation */
}

.word-effect {
  position: relative; /* Add this to make positioning work */
}
</style>
