<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/components/layout/Navbar.vue';
import HeroSection from './components/sections/HeroSection.vue';
import AboutSection from './components/sections/AboutSection.vue';
import ServicesSection from './components/sections/ServicesSection.vue';
import HowItWorksSection from './components/sections/HowItWorksSection.vue';
import StrugglesOffersSection from './components/sections/StrugglesOffersSection.vue';
import ContactSection from '@/components/sections/ContactSection.vue';

const themes = ['theme-neon-horizon', 'theme-digital-sunset', 'theme-retro-wave', 'theme-pastel-future']
const currentTheme = ref('theme-neon-horizon')

const setTheme = (theme: string) => {
  currentTheme.value = theme
}
</script>

<template>
  <div id="app" class="debug">
    <div class="app min-h-screen" :class="currentTheme">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <HowItWorksSection />
        <StrugglesOffersSection />
        <ContactSection />
      </main>
      <footer class="footer theme-bg--neutral">
        <div class="footer-content">
          <p class="body-text">© {{ new Date().getFullYear() }} Futoro Digital Design Lab. All rights reserved.</p>
          <div class="footer-links">
            <a href="#" class="body-text">Privacy Policy</a>
            <a href="#" class="body-text">Terms of Service</a>
          </div>
        </div>
      </footer>
      <div class="fixed bottom-4 right-4 flex gap-2">
        <button 
          v-for="theme in themes" 
          :key="theme"
          @click="setTheme(theme)"
          class="theme-btn theme-btn--outline text-sm">
          {{ theme.replace('theme-', '') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.footer {
  @apply py-8 text-center text-gray-400 text-sm;

  &-content {
    @apply max-w-7xl mx-auto px-4;
  }

  &-links {
    @apply mt-4 space-x-4;

    a {
      @apply hover:text-white transition-colors;
    }
  }
}
</style>
