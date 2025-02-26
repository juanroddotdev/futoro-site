<script setup lang="ts">
// import Navbar from './components/layout/Navbar.vue';
import NeutralNavbar from './components/layout/NeutralNavbar.vue';
// import HeroSection from './components/sections/HeroSection.vue';
import NeutralHeroSection from './components/sections/NeutralHeroSection.vue';
import NeutralAboutSection from './components/sections/NeutralAboutSection.vue';
// import AboutSection from './components/sections/AboutSection.vue';
// import ServicesSection from './components/sections/ServicesSection.vue';
import NeutralServicesSection from './components/sections/NeutralServicesSection.vue';
// import PortfolioSection from './components/sections/PortfolioSection.vue';
// import TestimonialsSection from './components/sections/TestimonialsSection.vue';
// import ContactSection from './components/sections/ContactSection.vue';
</script>

<template>
  <div class="app">
    <!-- <Navbar /> -->
    <NeutralNavbar />
    <main>
      <NeutralHeroSection />
      <NeutralAboutSection />
      <NeutralServicesSection />
      <!-- <HeroSection /> -->
      <!-- <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <TestimonialsSection />
      <ContactSection /> -->
    </main>
    <footer class="footer">
      <div class="footer-content">
        <p>© {{ new Date().getFullYear() }} Futoro Digital Design Lab. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
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
