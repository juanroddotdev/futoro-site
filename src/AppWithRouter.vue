<template>
  <div class="app-container" :class="currentTheme">
    <!-- Loader overlay -->
    <SimpleLoader 
      :heroContent="heroContent" 
      :showDebug="false"
      :pauseAnimations="false"
      @complete="onLoadComplete" 
      v-if="isLoading"
      class="loader-overlay"
    />
    
    <!-- Wireframe overlay -->
    <HeroSectionChatWireframe v-if="isLoading" />
    
    <!-- Main app content -->
    <div id="app" 
      :class="[
        currentTheme,
        { 'theme-transition-active': isThemeTransitioning }
      ]" 
      :style="appStyle"
    >
      <GradientDefinitions />
      <Navbar />
      <router-view :currentTheme="currentTheme" :heroContent="heroContent" />
      <ContactSection />
      <Footer />
      <ThemeSwitcher :currentTheme="currentTheme" @update:currentTheme="handleThemeChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import ContactSection from './components/sections/ContactSection.vue';
import ThemeSwitcher from '@/components/ui/theme/ThemeSwitcher.vue';
import GradientDefinitions from '@/components/ui/GradientDefinitions.vue';
import SimpleLoader from '@/components/ui/loaders/SimpleLoader.vue';
import { useTheme } from './composables/useTheme';
import { HeroContent, getRandomHeroContent } from '@/data/heroContentData';
import HeroSectionChatWireframe from '@/components/sections/HeroSectionChatWireframe.vue';

const route = useRoute();
const { currentTheme, isThemeTransitioning, handleThemeChange } = useTheme();
const isLoading = ref(true);
const heroContent = ref<HeroContent>(getRandomHeroContent());

// Enhanced app style transitions
const appStyle = computed(() => ({
  opacity: isLoading.value ? 0 : 1,
  transition: 'opacity 0.8s ease',
  pointerEvents: isLoading.value ? 'none' as const : 'auto' as const
}));

// Enhanced loader completion handler with smoother transition
const onLoadComplete = () => {
  requestAnimationFrame(() => {
    // isLoading.value = false;
  });
};
</script>

<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
  background-color: rgb(17, 24, 39); /* Match loader background */
}

/* Theme-specific background colors */
.app-container.theme-nord {
  background-color: rgb(17, 24, 39);
}

.app-container.theme-monokai {
  background-color: #272822;
}

.app-container.theme-github-dark {
  background-color: #0d1117;
}

.app-container.theme-github-light {
  background-color: #ffffff;
}

#app {
  position: relative;
  width: 100%;
  min-height: 100vh;
  will-change: opacity;
}

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
</style>
