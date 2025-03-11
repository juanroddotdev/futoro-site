<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import { icons } from '@/utils/icons';
import gsap from 'gsap';

const activeTab = ref('struggles');

const animateCards = (show: 'struggles' | 'solutions') => {
  const cards = show === 'struggles' ? '.struggle-card' : '.solution-card';
  const otherCards = show === 'struggles' ? '.solution-card' : '.struggle-card';

  // Simultaneously animate both sets of cards
  gsap.to(otherCards, {
    x: show === 'struggles' ? -100 : 100,
    opacity: 0,
    duration: 0.3,
    stagger: 0.02,
  });

  gsap.fromTo(cards,
    { 
      x: show === 'struggles' ? 100 : -100, 
      opacity: 0,
      display: 'none'
    },
    {
      x: 0,
      opacity: 1,
      duration: 0.3,
      stagger: 0.02,
      display: 'block',
      ease: 'power2.out',
      delay: 0.1 // Slight delay to create pushing effect
    }
  );
};

// Initial animation for first load
onMounted(() => {
  gsap.fromTo('.struggle-card', 
    { x: 100, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.3, stagger: 0.02, ease: 'power2.out' }
  );
});

// Watch for tab changes
watch(activeTab, (newTab) => {
  animateCards(newTab as 'struggles' | 'solutions');
});
</script>

<template>
  <section class="section py-32">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="heading heading-responsive text-center mb-12">From Frustration to Fantastic: Website Solutions</h1>
      <!-- Tab Headers -->
      <div class="flex justify-center mb-12">
        <div class="btn-round-pill-container">
          <div 
            class="btn-round-pill-slider"
            :class="{ 'slide-right': activeTab === 'solutions' }"
          ></div>
          <button 
            @click="activeTab = 'struggles'"
            class="btn-round-pill"
            :class="{ 'active': activeTab === 'struggles' }"
          >
            <span class="inline-flex items-center justify-center">
              <span v-html="icons.struggle.confusion" class="w-5 h-5 mr-2"></span>
              <span>Common Struggles</span>
            </span>
          </button>
          <button 
            @click="activeTab = 'solutions'"
            class="btn-round-pill"
            :class="{ 'active': activeTab === 'solutions' }"
          >
            <span class="inline-flex items-center justify-center">
              <span v-html="icons.solution.expert" class="w-5 h-5 mr-2"></span>
              <span>Our Solutions</span>
            </span>
          </button>
        </div>
      </div>
      <!-- Tab Content -->
      <div class="relative" style="min-height: 800px;"> <!-- Increased min-height -->
        <!-- Struggles Tab -->
        <div 
          v-show="activeTab === 'struggles'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 absolute w-full"
          style="transform-origin: center; backface-visibility: hidden;"
        >
          <div 
            v-for="(struggle, index) in struggles" 
            :key="struggle.id"
            class="struggle-card group hover-card p-6 relative overflow-hidden"
          >
            <span 
              class="absolute right-0 bottom-0 w-32 h-32 flex items-center justify-center transform translate-x-6 translate-y-6 theme-text--secondary icon-imprint"
              v-html="icons.struggle[Object.keys(icons.struggle)[index % Object.keys(icons.struggle).length]]"
            ></span>
            <div class="relative z-10">
              <h3 class="text-md font-semibold gradient-text mb-3">
                {{ struggle.title }}
              </h3>
              <p class="theme-text--neutral">{{ struggle.description }}</p>
            </div>
          </div>
        </div>

        <!-- Solutions Tab -->
        <div 
          v-show="activeTab === 'solutions'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 absolute w-full"
          style="transform-origin: center; backface-visibility: hidden;"
        >
          <div 
            v-for="(solution, index) in solutions" 
            :key="solution.id"
            class="solution-card group hover-card p-6 relative overflow-hidden"
          >
            <span 
              class="absolute right-0 bottom-0 w-32 h-32 flex items-center justify-center transform translate-x-6 translate-y-6 theme-text--secondary icon-imprint"
              v-html="icons.solution[Object.keys(icons.solution)[index % Object.keys(icons.solution).length]]"
            ></span>
            <div class="relative z-10">
              <h3 class="text-md font-semibold gradient-text mb-3">
                {{ solution.title }}
              </h3>
              <p class="theme-text--neutral">{{ solution.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/scss/abstracts/variables';
@import '@/scss/components/buttons-round';

.section {
  @apply relative overflow-hidden;
}

.heading-responsive {
  @apply text-3xl md:text-4xl lg:text-5xl font-bold;
}

// Card icon styles
.hover-card span svg {
  @apply w-32 h-32;
}

.icon-imprint svg {
  filter: opacity(0.4) drop-shadow(0 1px 1px rgba(255, 255, 255, 0.1)) drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.2));
}

/* Theme-specific icon styles */
:deep(.theme-neon-horizon), :deep(.theme-digital-sunset), :deep(.theme-retro-wave) {
  .icon-imprint svg {
    filter: opacity(0.3)
      drop-shadow(0 1px 1px rgba(255, 255, 255, 0.15))
      drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.3))
      drop-shadow(0 0 2px rgba(255, 255, 255, 0.1));
  }
}

:deep(.theme-pastel-future) {
  .icon-imprint svg {
    filter: opacity(0.15)
      drop-shadow(0 1px 1px rgba(255, 255, 255, 0.2))
      drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.1));
  }
}

.struggle-card,
.solution-card {
  will-change: transform, opacity;
  backface-visibility: hidden;
}
</style>