<template>
  <div class="main-content">
    <!-- Fixed grid overlay that stays in viewport -->
    <div class="viewport-grid">
      <GridPaperOverlay :theme="currentTheme.replace('theme-', '')" :floating="true" :spotlight="true" />
    </div>
    
    <!-- Test StickyHeroSectionTest -->
    <StickyHeroSectionTest :current-theme="currentTheme" />
    
    <!-- Keep one section for comparison -->
    <LazySection id="about" @visible="onSectionVisible('about')">
      <AboutSectionAlt />
      
      <template #placeholder>
        <div class="section-placeholder">Loading...</div>
      </template>
    </LazySection>
  </div>
</template>

<script setup lang="ts">
import StickyHeroSectionTest from '@/components/sections/StickyHeroSectionTest.vue';
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
  console.log(`[HomeHeroTest] Section ${sectionId} is now visible`);
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