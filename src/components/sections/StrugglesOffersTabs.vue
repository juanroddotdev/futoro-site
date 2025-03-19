<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import { icons } from '@/utils/icons';
import { strugglesOffersAnimations } from '@/animations/strugglesOffersTabs';

const activeTab = ref('struggles');

onMounted(() => {
  strugglesOffersAnimations.initializeCards();
});

// Watch for tab changes
watch(activeTab, (newTab) => {
  strugglesOffersAnimations.switchTabs(newTab as 'struggles' | 'solutions');
});
</script>

<template>
  <section class="section py-32">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="heading-responsive gradient-text text-center mb-40">From Frustration to Fantastic: Website Solutions</h1>
      <!-- Tab Headers -->
      <div class="flex justify-center mb-12">
        <div class="btn-round-pill-container">
          <div 
            class="btn-round-pill-slider"
            :class="{ 'slide-right': activeTab === 'solutions' }"
          ></div>
          <!-- Common Hurdles button -->
          <button 
            @click="activeTab = 'struggles'"
            class="btn-round-pill btn-round--medium"
            :class="{ 'active': activeTab === 'struggles' }"
          >
            <span class="inline-flex items-center justify-center">
              <span 
                v-html="activeTab === 'solutions' ? icons.happyFaceRight : icons.struggle.poorUX" 
                class="w-8 h-8 mr-2"
              ></span>
              <span>Common Hurdles</span>
            </span>
          </button>
          <!-- Clear Solutions button -->
          <button 
            @click="activeTab = 'solutions'"
            class="btn-round-pill btn-round--medium"
            :class="{ 'active': activeTab === 'solutions' }"
          >
            <span class="inline-flex items-center justify-center">
              <span 
                v-html="activeTab === 'struggles' ? icons.sadFaceLeft : icons.happyFace" 
                class="w-8 h-8 mr-2"
              ></span>
              <span>Clear Solutions</span>
            </span>
          </button>
        </div>
      </div>
      <!-- Tab Content -->
      <div class="relative" style="min-height: 900px;">
        <!-- Struggles Tab -->
        <div 
          :style="{ display: activeTab === 'struggles' ? 'grid' : 'none' }"
          class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 absolute w-full"
          style="transform-origin: center; backface-visibility: hidden;"
        >
          <div 
            v-for="(struggle, index) in struggles" 
            :key="struggle.id"
            class="struggle-card group hover-card-themed p-6 relative overflow-hidden"
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
          :style="{ display: activeTab === 'solutions' ? 'grid' : 'none' }"
          class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 absolute w-full"
          style="transform-origin: center; backface-visibility: hidden;"
        >
          <div 
            v-for="(solution, index) in solutions" 
            :key="solution.id"
            class="solution-card group hover-card-themed p-6 relative overflow-hidden"
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
.hover-card-themed span svg {
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

// Only keep the slide-right animation as it's specific to this component
.btn-round-pill-slider {
  &.slide-right {
    transform: translateX(100%);
  }
}
</style>