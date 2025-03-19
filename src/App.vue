<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import CombinedSwitcher from '@/components/CombinedSwitcher.vue';
import HeroSection from './components/sections/HeroSection.vue';
import ServicesSection from './components/sections/ServicesSection.vue';
import TimelineHowItWorks from './components/sections/TimelineHowItWorks.vue';
import ContactSectionV2 from './components/sections/ContactSectionV2.vue';
import AboutSectionAlt from './components/sections/AboutSectionAlt.vue';
import GridPaperOverlay from '@/components/export-to-main/gridBackground/GridPaperOverlay.vue';
import VanillaVersion from '@/components/test-progressive-reveal/VanillaVersion.vue';

// Define grid overlays configuration
const gridOverlays = ref([
  {
    id: 'hero-bg',
    name: 'Hero Background',
    settings: {
      theme: 'neon-horizon',
      pattern: 'dots',
      floating: true,
      spotlight: true,
      spotlightCorner: 'top-left',
      spotlightSize: 'medium',
      intensity: 'low',
      fade: false
    }
  },
  {
    id: 'services-bg',
    name: 'Services Background',
    settings: {
      theme: 'neon-horizon',
      pattern: 'grid',
      floating: false,
      spotlight: true,
      spotlightCorner: 'bottom-right',
      spotlightSize: 'small',
      intensity: 'medium',
      fade: true
    }
  },
  {
    id: 'timeline-bg',
    name: 'Timeline Background',
    settings: {
      theme: 'neon-horizon',
      pattern: 'diagonal-lines',
      floating: false,
      spotlight: true,
      spotlightCorner: 'top-right',
      spotlightSize: 'small',
      intensity: 'medium',
      fade: true
    }
  }
]);

const selectedOverlayId = ref('hero-bg');

// Function to get overlay settings by ID
const getOverlaySettings = (id: string) => {
  const overlay = gridOverlays.value.find(o => o.id === id);
  console.log(`Getting settings for overlay ${id}:`, overlay?.settings);
  return {
    id: id,  // Explicitly include the ID
    ...overlay?.settings
  };
};

// Function to update an overlay
const updateOverlay = (updatedOverlay: any) => {
  const index = gridOverlays.value.findIndex(o => o.id === updatedOverlay.id);
  if (index !== -1) {
    gridOverlays.value[index] = updatedOverlay;
  }
};

const currentTheme = ref('theme-neon-horizon');
const isThemeTransitioning = ref(false);

const handleThemeChange = (newTheme: string) => {
  console.log('App.vue handleThemeChange called with:', newTheme);
  
  if (currentTheme.value === newTheme) return;
  
  isThemeTransitioning.value = true;
  
  document.documentElement.classList.add('theme-transition-active');

  setTimeout(() => {
    currentTheme.value = newTheme;
    console.log('Theme updated to:', currentTheme.value);
  }, 50);

  setTimeout(() => {
    document.documentElement.classList.remove('theme-transition-active');
    isThemeTransitioning.value = false;
  }, 800);
};

onMounted(() => {
  document.documentElement.addEventListener('theme-changed', ((event: CustomEvent) => {
    handleThemeChange(event.detail.theme);
  }) as EventListener);
});
</script>

<template>
  <svg width="0" height="0" class="hidden">
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
  </svg>
  <div id="app">
    <!-- <div id="app" class="debug"> -->
    <div class="app min-h-screen relative" :class="[
      currentTheme,
      { 'theme-transition-active': isThemeTransitioning }
    ]">
      <Navbar />
      <div class="main-content">
        <GridPaperOverlay 
        v-bind="getOverlaySettings('hero-bg')"
        id="hero-bg"
        class="hero-overlay"
          :theme="currentTheme.replace('theme-', '')" 
          pattern="dots" 
          :floating="true" 
          :spotlight="true" 
          intensity="low"
        >
          <HeroSection />
        </GridPaperOverlay>
        <VanillaVersion />
        <GridPaperOverlay  v-bind="getOverlaySettings('services-bg')"
        class="services-overlay":theme="currentTheme.replace('theme-', '')" :floating="false" :spotlight="true"
          spotlightCorner="bottom-right" spotlightSize="small" :fade="true"
          intensity="medium">
          <ServicesSection />
        </GridPaperOverlay>
        <!-- <ServicesSection /> -->
        <GridPaperOverlay 
        v-bind="getOverlaySettings('timeline-bg')"
        class="timeline-overlay"
        :theme="currentTheme.replace('theme-', '')"       :floating="false" 
        :spotlight="true"
        spotlightCorner="top-right" spotlightSize="small" :fade="true" intensity="medium">
          <TimelineHowItWorks />
        </GridPaperOverlay>
        <AboutSectionAlt />
      </div>
      <ContactSectionV2 />
      <Footer />

      <CombinedSwitcher 
        :overlays="gridOverlays"
        v-model:selectedOverlayId="selectedOverlayId"
        @update:overlay="updateOverlay"
        :currentTheme="currentTheme"
        @update:currentTheme="handleThemeChange"
      />
    </div>
  </div>
</template>

<style lang="scss">
@import '@/scss/layout/app';

</style>
