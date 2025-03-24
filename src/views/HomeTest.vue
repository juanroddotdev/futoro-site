<template>
  <div class="main-content">
    <!-- Fixed grid overlay that stays in viewport -->
    <div class="viewport-grid">
      <GridPaperOverlay :theme="currentTheme.replace('theme-', '')" :floating="true" :spotlight="true" />
    </div>
    
    <!-- Test StickySectionContainer directly -->
    <StickySectionContainer 
      height="300vh"
      position="top"
      :offset="0"
      :zIndex="10"
      :debug="true"
    >
      <div class="test-sticky-content">
        <h2>Test Sticky Content</h2>
        <p>This is a direct test of StickySectionContainer in HomeTest.vue</p>
      </div>
    </StickySectionContainer>
    
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
// import GridPaperOverlay from '@/components/ui/GridPaperOverlay.vue';
import StickySectionContainer from '@/components/ui/containers/StickySectionContainer.vue';
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
  console.log(`[HomeTest] Section ${sectionId} is now visible`);
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

/* Test content styling */
.test-sticky-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  color: var(--theme-bg-primary, #f5f5f5);
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  p {
    max-width: 600px;
    text-align: center;
    margin-bottom: 2rem;
  }
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