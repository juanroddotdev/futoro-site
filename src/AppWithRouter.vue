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
  <div id="app" :class="[
    currentTheme,
    { 'theme-transition-active': isThemeTransitioning }
  ]">
    <Navbar />
    <router-view :currentTheme="currentTheme" />
    <ContactSectionV2 v-if="$route.name !== 'Playground' && $route.name !== 'PhoneTest'" />
    <Footer />
    <ThemeSwitcher :currentTheme="currentTheme" @update:currentTheme="handleThemeChange" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import ContactSectionV2 from './components/sections/ContactSectionV2.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import { useTheme } from '@/composables/useTheme';

const route = useRoute();
const { currentTheme, isThemeTransitioning, handleThemeChange } = useTheme();
</script>
