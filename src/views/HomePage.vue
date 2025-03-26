<template>
  <div class="main-content">
    <!-- Fixed grid overlay that stays in viewport -->
    <div class="viewport-grid">
      <PaperGridBackground :theme="currentTheme.replace('theme-', '')" :floating="true" :spotlight="true" />
    </div>
    
    <!-- Hero Section -->
    <HeroSectionChat 
      :heroContent="heroContent"
      @mounted="onHeroMounted"
    />
    
    <!-- Hurdles and Solutions Section -->
    <LazySection id="hurdles-solutions" 
    :trackSection="false" 
    @visible="onSectionVisible('hurdles-solutions', false)">
      <HurdlesSolutionsSection />
      
      <template #placeholder>
        <div class="section-placeholder">Loading...</div>
      </template>
    </LazySection>

    <!-- Services section - use default slot instead of content slot -->
    <LazySection id="services" 
    @visible="onSectionVisible('services', false)"
    :trackSection="false" >
      <ServicesSection />
      
      <template #placeholder>
        <div class="section-placeholder">Loading...</div>
      </template>
    </LazySection>
    <!-- Timeline section - use default slot instead of content slot -->
    <LazySection id="timeline" :trackSection="false"  @visible="onSectionVisible('timeline', false)">
       <ProcessTimeline />
      
      <template #placeholder>
        <div class="section-placeholder">Loading...</div>
      </template>
    </LazySection>
    
    <!-- We'll add more sections as we go -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import HeroSectionChat from '@/components/sections/HeroSectionChat.vue';
import HurdlesSolutionsSection from '@/components/sections/HurdlesSolutionsSection.vue';
import LazySection from '@/components/LazySection.vue';
import ProcessTimeline from '@/components/sections/ProcessTimeline.vue';
import ServicesSection from '@/components/sections/ServicesSection.vue';
import { useTheme } from '../composables/useTheme';
import { useLazySection } from '../composables/useLazySection';
import { HeroContent, getRandomHeroContent } from '@/data/heroContentData';
import PaperGridBackground from '@/components/ui/backgrounds/PaperGridBackground.vue';

const heroContent = ref<HeroContent>(getRandomHeroContent());

// Get the global theme
const { currentTheme } = useTheme();
console.log('currentTheme:', currentTheme);

// Use the section loader
const sectionLoader = useLazySection();

// Add a flag to track if the hero section has been unlocked
const heroSectionUnlocked = ref(false);

// Handle section visibility
function onSectionVisible(sectionId: string, track: boolean = true) {
  sectionLoader.markSectionLoaded(sectionId, track);
  sectionLoader.markSectionVisible(sectionId, track);
}
const onHeroMounted = () => {
  sectionLoader.markSectionLoaded('hero-section', true);
  sectionLoader.markSectionVisible('hero-section', true);
};
// Update these methods
const onHeroPullThresholdReached = () => {
  // No console log needed
};

const onHeroUnlock = () => {
  // Only set the flag to true once
  heroSectionUnlocked.value = true;
};
</script>

<style lang="scss">
.main-content {
  position: relative; /* Create positioning context */
}

.viewport-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; /* Only viewport height */
  pointer-events: none; /* Allow scrolling through */
  z-index: 1;
}

/* Ensure hero content appears above grid */
.hero-section {
  position: relative;
  z-index: 2;
}

/* Make grid paper overlay fill its container */
::v-deep(.grid-paper-overlay) {
  height: 100%;
}
</style>
