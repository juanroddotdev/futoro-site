<template>
  <div class="main-content">
    <GridPaperOverlay :theme="currentTheme.replace('theme-', '')" :floating="true" :spotlight="true">
      <HeroSectionWithPhone :current-theme="currentTheme" />
      <!-- <HeroSection :current-theme="currentTheme" /> -->
    </GridPaperOverlay>
    <!-- <PhoneSection 
      :messages="getInitialConversation()" 
      sectionId="hero-phone"
      :showTypingFor="[0, 1]"
      :tilt-x="8"
      :tilt-y="-20"
    /> -->
    <HurdlesSolutionsSection />
    <ServicesSection />
    <TimelineHowItWorks />
    <AboutSectionAlt />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/sections/HeroSection.vue';
import HeroSectionWithPhone from '@/components/sections/HeroSectionWithPhone.vue';
import ServicesSection from '@/components/sections/ServicesSection.vue';
import TimelineHowItWorks from '@/components/sections/TimelineHowItWorks.vue';
import AboutSectionAlt from '@/components/sections/AboutSectionAlt.vue';
import HurdlesSolutionsSection from '@/components/sections/HurdlesSolutionsSection.vue';
import PhoneSection from '@/components/PhoneSection.vue';
import {
  getInitialConversation,
} from '@/data/chatSections';

defineProps<{
  currentTheme: string
}>();
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
