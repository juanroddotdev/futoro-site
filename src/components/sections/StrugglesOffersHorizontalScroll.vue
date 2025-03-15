<script setup lang="ts">
import { ref } from 'vue';
import HorizontalScrollSection from '@/components/ui/HorizontalScrollSection.vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import { icons } from '@/utils/icons';

// Toggle between struggles and solutions
const activeTab = ref('struggles');

// Toggle function
const toggleTab = () => {
  activeTab.value = activeTab.value === 'struggles' ? 'solutions' : 'struggles';
};

// Computed properties for icons
const getIcon = (type: 'struggle' | 'solution', index: number) => {
  const iconSet = type === 'struggle' ? icons.struggle : icons.solution;
  const iconKeys = Object.keys(iconSet);
  return iconSet[iconKeys[index % iconKeys.length]];
};
</script>

<template>
  <div class="struggles-offers-horizontal">
    <!-- Tab toggle button -->
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
    
    <!-- Struggles Horizontal Scroll -->
    <div v-if="activeTab === 'struggles'">
      <HorizontalScrollSection
        :items="struggles"
        sectionTitle="From Frustration to Fantastic: Website Solutions"
        titleCardText="Common Hurdles"
      >
        <template #titleCard>
          <h3 class="heading-responsive gradient-text">Common Hurdles</h3>
        </template>
        
        <template #items>
          <div 
            v-for="(struggle, index) in struggles" 
            :key="struggle.id"
            class="item struggle-card group hover-card p-6 relative overflow-hidden"
          >
            <span 
              class="absolute right-0 bottom-0 w-32 h-32 flex items-center justify-center transform translate-x-6 translate-y-6 theme-text--secondary icon-imprint"
              v-html="getIcon('struggle', index)"
            ></span>
            <div class="relative z-10">
              <h3 class="text-md font-semibold gradient-text mb-3">
                {{ struggle.title }}
              </h3>
              <p class="theme-text--neutral">{{ struggle.description }}</p>
            </div>
          </div>
        </template>
      </HorizontalScrollSection>
    </div>
    
    <!-- Solutions Horizontal Scroll -->
    <div v-else>
      <HorizontalScrollSection
        :items="solutions"
        sectionTitle="From Frustration to Fantastic: Website Solutions"
        titleCardText="Clear Solutions"
        initialDirection="reverse"
      >
        <template #titleCard>
          <h3 class="heading-responsive gradient-text">Clear Solutions</h3>
        </template>
        
        <template #items-reversed>
          <div 
            v-for="(solution, index) in solutions" 
            :key="solution.id"
            class="item solution-card group hover-card p-6 relative overflow-hidden"
          >
            <span 
              class="absolute right-0 bottom-0 w-32 h-32 flex items-center justify-center transform translate-x-6 translate-y-6 theme-text--secondary icon-imprint"
              v-html="getIcon('solution', index)"
            ></span>
            <div class="relative z-10">
              <h3 class="text-md font-semibold gradient-text mb-3">
                {{ solution.title }}
              </h3>
              <p class="theme-text--neutral">{{ solution.description }}</p>
            </div>
          </div>
        </template>
      </HorizontalScrollSection>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/abstracts/variables';
@import '@/scss/components/buttons-round';

.struggles-offers-horizontal {
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
</style>