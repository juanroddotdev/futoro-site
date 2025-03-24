<template>
  <div class="main-content">
    <!-- Fixed grid overlay that stays in viewport -->
    <div class="viewport-grid">
      <GridPaperOverlay :theme="currentTheme.replace('theme-', '')" :floating="true" :spotlight="true" />
    </div>
    
    <!-- Hero Section -->
    <StickyFlexibleContent
      :messages="heroMessages"
      :showTypingFor="[0, 1]"
      :tilt-x="8" 
      :tilt-y="-20" 
      layout="content-left"
      phonePosition="right"
      sectionId="hero-section"
      containerHeight="400vh"
      :debug="false"
      customClass="dark-theme"
    >
    <template #headline>
      <h1 class="heading--accent mb-6 headline heading-responsive">
        {{ heroContent.headline }}
      </h1>
    </template>
    <template #subheadline>
      <p class="mb-8 subheadline subheading-responsive heading heading--highlight">
        {{ heroContent.subheadline }}
      </p>
      <div class="flex gap-4">
        <a href="#contact" class="btn-round-large-primary cta">
          {{ heroContent.cta }}
        </a>
        <a href="#services" class="btn-round-large-outline-primary">
          Our Services
        </a>
      </div>
    </template>
    </StickyFlexibleContent>
    
    <!-- We'll add more sections as we go -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import StickyFlexibleContent from '@/components/sections/StickyFlexibleContent.vue';
import { useTheme } from '@/composables/useTheme';
import { getInitialConversation } from '@/data/chatSections';
import { HeroContent, getRandomHeroContent } from '@/data/heroContent';
const heroContent = ref<HeroContent>(getRandomHeroContent());

// Get the global theme
const { currentTheme } = useTheme();

// Sample messages for the hero section
const heroMessages = getInitialConversation();

// We'll add more data and functionality as we rebuild each section
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
