<template>
  <div class="home-view">
    <GridPaperOverlay :theme="currentTheme.replace('theme-', '')" :floating="true" :spotlight="true">
      <HeroSection />
    </GridPaperOverlay>
    <HurdlesSolutionsSection />
    <ServicesSection />
    <TimelineHowItWorks />
    <AboutSectionAlt />
    <ContactSectionV2 />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import HeroSection from '@/components/sections/HeroSection.vue';
import HurdlesSolutionsSection from '@/components/sections/HurdlesSolutionsSection.vue';
import ServicesSection from '@/components/sections/ServicesSection.vue';
import TimelineHowItWorks from '@/components/sections/TimelineHowItWorks.vue';
import AboutSectionAlt from '@/components/sections/AboutSectionAlt.vue';
import ContactSectionV2 from '@/components/sections/ContactSectionV2.vue';
import GridPaperOverlay from '@/components/ui/backgrounds/GridPaperOverlay.vue';

// Get current theme from parent component or use default
const currentTheme = computed(() => {
  // You might need to adjust this based on how your theme is managed
  return document.querySelector('#app > div')?.className.split(' ')[0] || 'theme-neon-horizon';
});
</script>

<style scoped>
.home-view {
  width: 100%;
}
</style>
<!-- <svg width="0" height="0" class="hidden">
  <defs>
    <linearGradient id="accordion-gradient-neon" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="var(--neon-horizon-secondary)" />
      <stop offset="100%" stop-color="var(--neon-horizon-accent)" />
    </linearGradient>
    <linearGradient id="accordion-gradient-sunset" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="var(--digital-sunset-secondary)" />
      <stop offset="100%" stop-color="var(--digital-sunset-accent)" />
    </linearGradient>
    <linearGradient id="accordion-gradient-retro" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="var(--retro-wave-secondary-start)" />
      <stop offset="100%" stop-color="var(--retro-wave-secondary-end)" />
    </linearGradient>
    <linearGradient id="accordion-gradient-pastel" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="var(--pastel-future-secondary)" />
      <stop offset="100%" stop-color="var(--pastel-future-accent)" />
    </linearGradient>
  </defs>
</svg> -->

<!-- const currentTheme = ref('theme-neon-horizon');
const isThemeTransitioning = ref(false);

const handleThemeChange = (newTheme: string) => {
  if (currentTheme.value === newTheme) return;

  isThemeTransitioning.value = true;
  document.documentElement.classList.add('theme-transition-active');

  setTimeout(() => {
    currentTheme.value = newTheme;
  }, 50);

  setTimeout(() => {
    document.documentElement.classList.remove('theme-transition-active');
    isThemeTransitioning.value = false;
  }, 800);
}; -->
