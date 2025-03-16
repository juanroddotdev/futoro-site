<template>
  <div class="progressive-reveal">
    <!-- Hurdles Section -->
    <section class="reveal-section hurdles-section" ref="hurdlesSection">
      <div class="sticky-container">
        <h2 class="section-title">Common Hurdles</h2>
        <div class="cards-container" ref="hurdlesContainer">
          <div class="card" v-for="i in 5" :key="`hurdle-${i}`">
            <h3>Hurdle {{ i }}</h3>
            <p>This is a common problem that users face when working with this technology.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Solutions Section -->
    <section class="reveal-section solutions-section" ref="solutionsSection">
      <div class="sticky-container">
        <h2 class="section-title">Clear Solutions</h2>
        <div class="cards-container" ref="solutionsContainer">
          <div class="card" v-for="i in 5" :key="`solution-${i}`">
            <h3>Solution {{ i }}</h3>
            <p>Here's how our product solves this problem efficiently and elegantly.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Refs for DOM elements
const hurdlesSection = ref(null);
const solutionsSection = ref(null);
const hurdlesContainer = ref(null);
const solutionsContainer = ref(null);

// Store ScrollTrigger instances for cleanup
const scrollTriggers = [];

onMounted(() => {
  // Set initial state
  gsap.set(hurdlesContainer.value, { x: 0 });
  gsap.set(solutionsContainer.value, { x: '-100%' });
  
  // Calculate total scrollable width for each container
  const getScrollableWidth = (container) => {
    return container.scrollWidth - window.innerWidth + 100; // Adding padding
  };
  
  // Create ScrollTrigger for Hurdles section
  const hurdlesTrigger = ScrollTrigger.create({
    trigger: hurdlesSection.value,
    start: 'top top',
    end: 'bottom top',
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      // Calculate the horizontal scroll position based on vertical scroll progress
      const scrollWidth = getScrollableWidth(hurdlesContainer.value);
      const x = -self.progress * scrollWidth;
      gsap.set(hurdlesContainer.value, { x });
    }
  });
  
  // Create ScrollTrigger for Solutions section
  const solutionsTrigger = ScrollTrigger.create({
    trigger: solutionsSection.value,
    start: 'top top',
    end: 'bottom top',
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      // Calculate the horizontal scroll position based on vertical scroll progress
      // For solutions, we go from left to right (start offscreen left)
      const scrollWidth = getScrollableWidth(solutionsContainer.value);
      const x = -(1 - self.progress) * scrollWidth;
      gsap.set(solutionsContainer.value, { x });
    }
  });
  
  // Store for cleanup
  scrollTriggers.push(hurdlesTrigger, solutionsTrigger);
  
  // Add some entrance animations
  gsap.from('.hurdles-section .card', {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.5,
    scrollTrigger: {
      trigger: hurdlesSection.value,
      start: 'top center',
      toggleActions: 'play none none reverse'
    }
  });
  
  gsap.from('.solutions-section .card', {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.5,
    scrollTrigger: {
      trigger: solutionsSection.value,
      start: 'top center',
      toggleActions: 'play none none reverse'
    }
  });
});

onUnmounted(() => {
  // Clean up all ScrollTrigger instances
  scrollTriggers.forEach(trigger => trigger.kill());
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
</script>

<style lang="scss" scoped>
.progressive-reveal {
  position: relative;
  
  .reveal-section {
    position: relative;
    height: 200vh; // Tall enough for scrolling
    
    .sticky-container {
      position: sticky;
      top: 0;
      height: 100vh;
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 2rem;
    }
    
    .section-title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .cards-container {
      display: flex;
      gap: 2rem;
      padding: 0 2rem;
      will-change: transform;
      
      .card {
        flex: 0 0 auto;
        width: 300px;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        
        &:hover {
          transform: translateY(-5px);
        }
        
        h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        
        p {
          font-size: 1rem;
          line-height: 1.5;
        }
      }
    }
  }
  
  .hurdles-section {
    .card {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
  }
  
  .solutions-section {
    .card {
      background: linear-gradient(135deg, #e0f7fa 0%, #80deea 100%);
    }
  }
}
</style>