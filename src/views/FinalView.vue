<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import Hero from '@/components/sections/HeroSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import TimelineHowItWorks from '@/components/sections/TimelineHowItWorks.vue'
import StrugglesOffersTabs from '@/components/sections/StrugglesOffersTabs.vue'
import ContactSectionV2 from '@/components/sections/ContactSectionV2.vue'
import AboutSectionAlt from '@/components/sections/AboutSectionAlt.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

const currentTheme = ref('theme-neon-horizon')

const handleThemeChange = (newTheme: string) => {
  currentTheme.value = newTheme
}
</script>

<template>
  <div class="app min-h-screen relative final-view" :class="currentTheme">
    <Navbar />
    <div class="main-content">
      <Hero />
      <ServicesSection />
      <TimelineHowItWorks />
      <StrugglesOffersTabs />
      <AboutSectionAlt />
    </div>
    <ContactSectionV2 />
    <ThemeSwitcher
      v-model:currentTheme="currentTheme"
      @update:currentTheme="handleThemeChange"
    />
    <router-link 
      to="/" 
      class="view-wireframe-btn"
    >
      View Wireframe
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.view-wireframe-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 9999px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
}
</style>