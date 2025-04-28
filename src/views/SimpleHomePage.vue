<template>
  <div class="simple-home">
    <!-- Fixed grid overlay that stays in viewport -->
    <div class="viewport-grid">
      <PaperGridBackground
        :theme="currentTheme.replace('theme-', '')"
        :floating="true"
        :spotlight="true"
      />
    </div>

    <!-- Hero Section -->
    <HeroSectionNoChat 
      :heroContent="heroContent"
      @mounted="onHeroMounted"
    />

    <!-- Services Section -->
    <ServicesSection id="services" />

    <!-- Process Timeline Section -->
    <ProcessTimeline id="timeline" />

    <!-- Contact Section -->
    <ContactSection id="contact" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from '../composables/useTheme';
import { HeroContent, getRandomHeroContent } from '@/data/heroContentData';
import HeroSectionNoChat from '@/components/sections/HeroSectionNoChat.vue';
import ServicesSection from '@/components/sections/ServicesSection.vue';
import ProcessTimeline from '@/components/sections/ProcessTimeline.vue';
import ContactSection from '@/components/sections/ContactSection.vue';

// Get the global theme
const { currentTheme } = useTheme();

// Get random hero content
const heroContent = ref<HeroContent>(getRandomHeroContent());

// Handle hero section mount
const onHeroMounted = () => {
  console.log('Hero section mounted');
};
</script>

<style lang="scss" scoped>
.simple-home {
  position: relative;
  min-height: 100vh;
  z-index: 3;
}

.viewport-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
}

section {
  position: relative;
  z-index: 2;
  padding: 4rem 2rem;
  
  h1, h2 {
    margin-bottom: 1.5rem;
  }
}
</style> 