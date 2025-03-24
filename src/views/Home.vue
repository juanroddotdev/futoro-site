<template>
  <div class="main-content">
    <!-- Hero section is always visible immediately -->
    <GridPaperOverlay :theme="currentTheme.replace('theme-', '')" :floating="true" :spotlight="true">
      <HeroSectionWithPhone :current-theme="currentTheme" />
    </GridPaperOverlay>
    
    <!-- Lazy load all other sections -->
    <LazySection id="hurdles-solutions" @visible="onSectionVisible('hurdles-solutions')">
      <template #content>
        <HurdlesSolutionsSection />
      </template>
    </LazySection>
    
    <LazySection id="services" @visible="onSectionVisible('services')">
      <template #content>
        <ServicesSection />
      </template>
    </LazySection>
    
    <LazySection id="timeline" @visible="onSectionVisible('timeline')">
      <template #content>
        <TimelineHowItWorks />
      </template>
    </LazySection>
    
    <LazySection id="about" @visible="onSectionVisible('about')">
      <template #content>
        <AboutSectionAlt />
      </template>
    </LazySection>
  </div>
</template>

<script setup lang="ts">
import HeroSectionWithPhone from '@/components/sections/HeroSectionWithPhone.vue';
import HurdlesSolutionsSection from '@/components/sections/HurdlesSolutionsSection.vue';
import ServicesSection from '@/components/sections/ServicesSection.vue';
import TimelineHowItWorks from '@/components/sections/TimelineHowItWorks.vue';
import AboutSectionAlt from '@/components/sections/AboutSectionAlt.vue';
import LazySection from '@/components/LazySection.vue';
import { useSectionLoader } from '@/composables/useSectionLoader';
import { useTheme } from '@/composables/useTheme';

// Get the global theme
const { currentTheme } = useTheme();

// Use the section loader
const sectionLoader = useSectionLoader();

// Handle section visibility
function onSectionVisible(sectionId: string) {
  console.log(`[Home] Section ${sectionId} is now visible`);
  sectionLoader.markSectionLoaded(sectionId);
  sectionLoader.markSectionVisible(sectionId);
}
</script>

<style lang="scss">
.viewport-only {
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 1;
}

.hero-container {
  position: relative;
  // This container will be the full scrollable height
}

.viewport-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; // Only viewport height
  pointer-events: none; // Allow scrolling through
  z-index: 1;
}

// Ensure hero content appears above grid
.hero-section {
  position: sticky;
  z-index: 2;
}
</style>
