<template>
  <div class="progressive-reveal overflow-visible">
    <section 
      ref="scrollSection"
      :id="sectionId"
      class="vertical-scroll-section"
    >
      <div class="sticky-container">
        <div class="header-container">
          <h2 class="text-3xl font-bold gradient-text">Our Journey</h2>
        </div>
        
        <div class="timeline-container" ref="timelineContainer">
          <!-- Timeline items -->
          <div class="timeline-item group hover-card-themed p-6 relative overflow-hidden"
            v-for="event in timelineEvents" :key="`event-${event.id}`">
            <div class="relative z-10">
              <div class="year">{{ event.year }}</div>
              <h3 class="text-md font-semibold gradient-text mb-3">{{ event.title }}</h3>
              <p class="theme-text--neutral">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { usePlaygroundScrollAnimation } from '@/composables/usePlaygroundScrollAnimation';

// Props and configuration
const sectionId = 'timelineSection';

// Sample data
const timelineEvents = ref([
  { 
    id: 1, 
    year: '2010', 
    title: 'Company Founded', 
    description: 'Our journey began with a small team and a big vision.' 
  },
  { 
    id: 2, 
    year: '2013', 
    title: 'First Major Client', 
    description: 'Landed our first enterprise client, marking a significant milestone.' 
  },
  { 
    id: 3, 
    year: '2015', 
    title: 'International Expansion', 
    description: 'Opened our first international office in London.' 
  },
  { 
    id: 4, 
    year: '2018', 
    title: 'Product Launch', 
    description: 'Launched our flagship product to critical acclaim.' 
  },
  { 
    id: 5, 
    year: '2020', 
    title: 'Remote Transformation', 
    description: 'Successfully transitioned to a fully remote workforce.' 
  },
  { 
    id: 6, 
    year: '2023', 
    title: 'Sustainability Initiative', 
    description: 'Committed to carbon neutrality across all operations.' 
  },
]);

// Refs for DOM elements
const scrollSection = ref<HTMLElement | null>(null);
const timelineContainer = ref<HTMLElement | null>(null);

// Reactive state for scroll animations
const state = reactive({
  scrollHeight: 0,
  progress: 0
});

// Handle scroll event
function handleScroll() {
  if (!scrollSection.value) return;
  
  // Calculate scroll progress
  const rect = scrollSection.value.getBoundingClientRect();
  const sectionHeight = rect.height;
  const viewportHeight = window.innerHeight;
  
  // Calculate how far we've scrolled into the section
  const scrollIntoSection = window.scrollY - (rect.top + window.scrollY - viewportHeight);
  const totalScrollDistance = sectionHeight;
  
  // Calculate progress (0 to 1)
  state.progress = Math.max(0, Math.min(1, scrollIntoSection / totalScrollDistance));
  
  // Apply transform based on scroll progress
  if (timelineContainer.value) {
    const transform = state.progress * state.scrollHeight;
    timelineContainer.value.style.transform = `translateY(-${transform}px)`;
  }
}

// Use the playground-specific scroll animation composable
const { setupScrollObservers, cleanupScrollObservers } = usePlaygroundScrollAnimation({
  onScroll: handleScroll,
  threshold: 0.1
});

// Lifecycle hooks
onMounted(() => {
  if (timelineContainer.value) {
    // Calculate the scrollable height (content height minus viewport height)
    state.scrollHeight = timelineContainer.value.scrollHeight - window.innerHeight + 200;
  }
  
  // Set up scroll observers
  setupScrollObservers(scrollSection.value);
  
  // Handle window resize
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // Clean up
  cleanupScrollObservers();
  window.removeEventListener('resize', handleResize);
});

// Handle window resize
function handleResize() {
  if (timelineContainer.value) {
    state.scrollHeight = timelineContainer.value.scrollHeight - window.innerHeight + 200;
  }
  handleScroll();
}
</script>

<style scoped>
.vertical-scroll-section {
  position: relative;
  height: 200vh; /* Tall section to allow scrolling */
  overflow: hidden;
}

.sticky-container {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.header-container {
  padding: 2rem;
  text-align: center;
}

.timeline-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 2rem;
  transition: transform 0.1s ease-out;
}

.timeline-item {
  min-height: 150px;
  border-radius: 8px;
  background-color: var(--theme-card-bg, #1a1a1a);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.year {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--theme-accent, #4a90e2);
  margin-bottom: 0.5rem;
}

.gradient-text {
  background: linear-gradient(90deg, #4a90e2, #63b3ed);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.theme-text--neutral {
  color: var(--theme-text-secondary, #a0aec0);
}

.hover-card-themed {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-card-themed:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}
</style>
