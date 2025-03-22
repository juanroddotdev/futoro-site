<template>
  <div class="progressive-reveal overflow-visible">
    <section 
      ref="scrollSection"
      :id="sectionId"
      class="horizontal-scroll-section"
    >
      <div class="sticky-container">
        <div class="header-container">
          <h2 class="text-3xl font-bold gradient-text">What We Offer</h2>
        </div>
        
        <div class="services-container" ref="servicesContainer">
          <!-- Service cards -->
          <div class="service-card group hover-card-themed p-6 relative overflow-hidden"
            v-for="service in services" :key="`service-${service.id}`">
            <div class="relative z-10">
              <div class="icon">{{ service.icon }}</div>
              <h3 class="text-xl font-semibold gradient-text mb-3">{{ service.title }}</h3>
              <p class="theme-text--neutral">{{ service.description }}</p>
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
const sectionId = 'servicesSection';

// Sample data
const services = ref([
  { 
    id: 1, 
    icon: '💻', 
    title: 'Web Development', 
    description: 'Modern, responsive websites built with the latest technologies.' 
  },
  { 
    id: 2, 
    icon: '📱', 
    title: 'Mobile Apps', 
    description: 'Native and cross-platform mobile applications for iOS and Android.' 
  },
  { 
    id: 3, 
    icon: '🎨', 
    title: 'UI/UX Design', 
    description: 'User-centered design that delights your audience.' 
  },
  { 
    id: 4, 
    icon: '📊', 
    title: 'Digital Marketing', 
    description: 'Strategic campaigns that drive results.' 
  },
  { 
    id: 5, 
    icon: '☁️', 
    title: 'Cloud Services', 
    description: 'Scalable cloud solutions for your business needs.' 
  },
  { 
    id: 6, 
    icon: '🔒', 
    title: 'Cybersecurity', 
    description: 'Protect your digital assets with our security solutions.' 
  },
]);

// Refs for DOM elements
const scrollSection = ref<HTMLElement | null>(null);
const servicesContainer = ref<HTMLElement | null>(null);

// Reactive state for scroll animations
const state = reactive({
  scrollWidth: 0,
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
  if (servicesContainer.value) {
    const transform = state.progress * state.scrollWidth;
    servicesContainer.value.style.transform = `translateX(-${transform}px)`;
  }
}

// Use the playground-specific scroll animation composable
const { setupScrollObservers, cleanupScrollObservers } = usePlaygroundScrollAnimation({
  onScroll: handleScroll,
  threshold: 0.1
});

// Lifecycle hooks
onMounted(() => {
  if (servicesContainer.value) {
    // Calculate the scrollable width (content width minus viewport width)
    state.scrollWidth = servicesContainer.value.scrollWidth - window.innerWidth + 100;
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
  if (servicesContainer.value) {
    state.scrollWidth = servicesContainer.value.scrollWidth - window.innerWidth + 100;
  }
  handleScroll();
}
</script>

<style scoped>
.horizontal-scroll-section {
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

.services-container {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  padding: 2rem;
  transition: transform 0.1s ease-out;
}

.service-card {
  min-width: 300px;
  max-width: 300px;
  height: 250px;
  border-radius: 8px;
  background-color: var(--theme-card-bg, #1a1a1a);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.icon {
  font-size: 2rem;
  margin-bottom: 1rem;
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
