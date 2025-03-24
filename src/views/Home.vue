<template>
  <div class="main-content">
    <!-- Fixed grid overlay that stays in viewport -->
    <div class="viewport-grid">
      <GridPaperOverlay :theme="currentTheme.replace('theme-', '')" :floating="true" :spotlight="true" />
    </div>
    
    <!-- Use the new NewStickyHeroSection -->
    <NewStickyHeroSection :current-theme="currentTheme" :debug="true" />
    
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
import { ref, onMounted } from 'vue';
import NewStickyHeroSection from '@/components/sections/NewStickyHeroSection.vue';
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

// Existing styles...
</style>
