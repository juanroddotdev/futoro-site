<template>
  <div class="main-content">
    <!-- Fixed grid overlay that stays in viewport -->
    <div class="viewport-grid">
      <GridPaperOverlay :theme="currentTheme.replace('theme-', '')" :floating="true" :spotlight="true" />
    </div>
    
    <!-- Hero Section -->
    <HeroSection 
      :heroContent="heroContent"
    />
    
    <!-- Hurdles and Solutions Section -->
    <LazySection id="hurdles-solutions" @visible="onSectionVisible('hurdles-solutions')">
      <HurdlesSolutionsSection />
      
      <template #placeholder>
        <div class="section-placeholder">Loading...</div>
      </template>
    </LazySection>

    <!-- Services section - use default slot instead of content slot -->
    <LazySection id="services" @visible="onSectionVisible('services')">
      <ServicesSection />
      
      <template #placeholder>
        <div class="section-placeholder">Loading...</div>
      </template>
    </LazySection>
    <!-- Timeline section - use default slot instead of content slot -->
    <LazySection id="timeline" @visible="onSectionVisible('timeline')">
      <!-- Remove the template #content wrapper -->
      <TimelineHowItWorks />
      
      <template #placeholder>
        <div class="section-placeholder">Loading...</div>
      </template>
    </LazySection>
    
    <!-- We'll add more sections as we go -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import HeroSection from '@/components/sections/refactored/HeroSection.vue';
import HurdlesSolutionsSection from '@/components/sections/refactored/HurdlesSolutionsSection.vue';
import LazySection from '@/components/LazySection.vue';
import TimelineHowItWorks from '@/components/sections/TimelineHowItWorks.vue';
import ServicesSection from '@/components/sections/refactored/ServicesSection.vue';
import { useTheme } from '@/composables/useTheme';
import { useSectionLoader } from '@/composables/useSectionLoader';
import { HeroContent, getRandomHeroContent } from '@/data/heroContent';

const heroContent = ref<HeroContent>(getRandomHeroContent());

// Get the global theme
const { currentTheme } = useTheme();

// Use the section loader
const sectionLoader = useSectionLoader();


// Handle section visibility
function onSectionVisible(sectionId: string) {

  sectionLoader.markSectionLoaded(sectionId);
  sectionLoader.markSectionVisible(sectionId);
}

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
