<template>
  <div class="main-content">
    <!-- Hero section is always visible immediately -->
    <GridPaperOverlay :theme="currentTheme.replace('theme-', '')" :floating="true" :spotlight="true">
      <HeroSectionWithPhone :current-theme="currentTheme" />
    </GridPaperOverlay>
    
    <!-- Lazy load all other sections -->
    <LazySection id="hurdles-solutions" @visible="onSectionVisible('hurdles-solutions')">
      <!-- Use the default slot instead of a named slot -->
      <HurdlesSolutionsSection />
      
      <!-- Add a placeholder if needed -->
      <template #placeholder>
        <div class="section-placeholder">Loading...</div>
      </template>
    </LazySection>
    
    <!-- Services section - use default slot instead of content slot -->
    <LazySection id="services" @visible="onSectionVisible('services')">
      <!-- Remove the template #content wrapper -->
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
    
    <!-- About section - use default slot instead of content slot -->
    <LazySection id="about" @visible="onSectionVisible('about')">
      <!-- Remove the template #content wrapper -->
      <AboutSectionAlt />
      
      <template #placeholder>
        <div class="section-placeholder">Loading...</div>
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
