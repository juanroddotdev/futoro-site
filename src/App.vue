<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/components/layout/Navbar.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import HeroSection from './components/sections/HeroSection.vue';
import ServicesSection from './components/sections/ServicesSection.vue';
import TimelineHowItWorks from './components/sections/TimelineHowItWorks.vue';
import StrugglesOffersTabs from './components/sections/StrugglesOffersTabs.vue';
import ContactSectionV2 from './components/sections/ContactSectionV2.vue';
import AboutSectionAlt from './components/sections/AboutSectionAlt.vue';

const currentTheme = ref('theme-neon-horizon');
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
};
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
    <div 
      class="app min-h-screen relative" 
      :class="[
        currentTheme,
        { 'theme-transition-active': isThemeTransitioning }
      ]"
    >
      <Navbar />
      <div class="main-content">
        <HeroSection />
        <StrugglesOffersTabs />
        <ServicesSection />
        <TimelineHowItWorks  />
        <AboutSectionAlt />
      </div>
      <ContactSectionV2 />
      <footer class="footer">
        <div class="footer-content">
          <p class="body-text text-white">© {{ new Date().getFullYear() }} Futoro Digital Design Lab. All rights reserved.</p>
          <div class="footer-links">
            <a href="#" class="body-text text-white hover:text-white/90">Privacy Policy</a>
            <a href="#" class="body-text text-white hover:text-white/90">Terms of Service</a>
          </div>
        </div>
      </footer>
      
      <ThemeSwitcher
        v-model:currentTheme="currentTheme"
        @update:currentTheme="handleThemeChange"
      />
    </div>
  </div>
</template>

<style lang="scss">
@import '@/scss/layout/app';
</style>
