<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import { icons } from '@/utils/icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Combine struggles and solutions for the scroll sequence
const cards = ref([
  ...struggles.map(item => ({ ...item, type: 'struggle' })),
  ...solutions.map(item => ({ ...item, type: 'solution' }))
]);

// Scroll state
const scrollState = ref({
  progress: 0,
  activeIndex: 0
});

// References
const sectionRef = ref<HTMLElement | null>(null);
const cardsContainerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!sectionRef.value || !cardsContainerRef.value) return;
  
  // Set initial state
  gsap.set('.reveal-card', { 
    opacity: 0,
    y: 50,
    scale: 0.95
  });
  
  gsap.set('.reveal-card:first-child', { 
    opacity: 1,
    y: 0,
    scale: 1
  });
  
  // Create the scroll animation
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: `+=${cards.value.length * 100}vh`,
      pin: true,
      scrub: 1,
      markers: true,
      onUpdate: (self) => {
        // Update active card based on scroll progress
        const newIndex = Math.min(
          Math.floor(self.progress * cards.value.length),
          cards.value.length - 1
        );
        
        if (newIndex !== scrollState.value.activeIndex) {
          scrollState.value.activeIndex = newIndex;
        }
        
        scrollState.value.progress = self.progress;
      }
    }
  });
  
  // Add animations for each card transition
  cards.value.forEach((_, index) => {
    if (index < cards.value.length - 1) {
      tl.to(`.reveal-card:nth-child(${index + 1})`, {
        opacity: 0,
        y: -50,
        scale: 0.95,
        duration: 0.5
      }, index);
      
      tl.fromTo(`.reveal-card:nth-child(${index + 2})`, 
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5 },
        index
      );
    }
  });
});

onBeforeUnmount(() => {
  // Clean up ScrollTrigger instances
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});

// Helper to get icon based on type and index
function getIcon(type: string, index: number) {
  const iconSet = type === 'struggle' ? icons.struggle : icons.solution;
  const iconKeys = Object.keys(iconSet);
  return iconSet[iconKeys[index % iconKeys.length]];
}
</script>

<template>
  <section ref="sectionRef" class="scroll-reveal-cards py-32 relative">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="heading-responsive gradient-text text-center mb-20">From Frustration to Fantastic: Website Solutions</h1>
      
      <!-- Progress indicator -->
      <div class="progress-bar-container">
        <div class="progress-bar">
          <div 
            class="progress-indicator" 
            :style="{ width: `${scrollState.progress * 100}%` }"
          ></div>
        </div>
        <div class="progress-labels">
          <span>Struggles</span>
          <span>Solutions</span>
        </div>
      </div>
      
      <!-- Cards container -->
      <div ref="cardsContainerRef" class="cards-container relative mt-16">
        <div 
          v-for="(card, index) in cards" 
          :key="`${card.type}-${card.id}`"
          class="reveal-card absolute top-0 left-0 w-full"
          :class="[
            card.type === 'struggle' ? 'struggle-card' : 'solution-card',
            { 'active': index === scrollState.activeIndex }
          ]"
        >
          <div class="card-inner group hover-card p-8 relative overflow-hidden">
            <span 
              class="absolute right-0 bottom-0 w-32 h-32 flex items-center justify-center transform translate-x-6 translate-y-6 theme-text--secondary icon-imprint"
              v-html="getIcon(card.type, index)"
            ></span>
            <div class="relative z-10 max-w-2xl">
              <div class="card-type text-sm uppercase mb-2">
                {{ card.type === 'struggle' ? 'Common Hurdle' : 'Clear Solution' }}
              </div>
              <h3 class="text-xl font-semibold gradient-text mb-4">
                {{ card.title }}
              </h3>
              <p class="theme-text--neutral text-lg">{{ card.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scroll indicator -->
      <div class="scroll-indicator">
        <span>Scroll to explore</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.scroll-reveal-cards {
  min-height: 100vh;
  overflow: hidden;
}

.heading-responsive {
  @apply text-3xl md:text-4xl lg:text-5xl font-bold;
}

.progress-bar-container {
  @apply max-w-md mx-auto mb-8;
  
  .progress-bar {
    @apply h-2 bg-gray-200 rounded-full overflow-hidden;
    
    .progress-indicator {
      @apply h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300;
    }
  }
  
  .progress-labels {
    @apply flex justify-between mt-2 text-sm;
  }
}

.cards-container {
  height: 400px;
  
  .reveal-card {
    @apply transition-all duration-500;
    
    &.active {
      @apply z-10;
    }
  }
  
  .card-inner {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg;
  }
}
</style>