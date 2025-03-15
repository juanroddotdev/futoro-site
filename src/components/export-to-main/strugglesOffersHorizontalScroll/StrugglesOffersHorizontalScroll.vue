<script setup lang="ts">
import { ref } from 'vue';
import HorizontalScrollSection from '@/components/ui/HorizontalScrollSection.vue';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import { icons } from '@/utils/icons';


// Computed properties for icons
const getIcon = (type: 'struggle' | 'solution', index: number) => {
  const iconSet = type === 'struggle' ? icons.struggle : icons.solution;
  const iconKeys = Object.keys(iconSet);
  return iconSet[iconKeys[index % iconKeys.length]];
};
</script>

<template>
  <div class="struggles-offers-horizontal">
  
    <!-- Struggles Horizontal Scroll -->
    <div>
      <HorizontalScrollSection
        :items="struggles"
        titleCardText="Common Hurdles"
        :startInMiddle="true"
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
    <div>
      <HorizontalScrollSection
        :items="solutions"
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