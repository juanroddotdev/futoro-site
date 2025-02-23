<script setup lang="ts">
import Navbar from './components/layout/Navbar.vue';
import HeroSection from './components/sections/HeroSection.vue';
import AboutSection from './components/sections/AboutSection.vue';
import ServicesSection from './components/sections/ServicesSection.vue';
import PortfolioSection from './components/sections/PortfolioSection.vue';
import TestimonialsSection from './components/sections/TestimonialsSection.vue';
import ContactSection from './components/sections/ContactSection.vue';
</script>

<template>
  <div class="app">
    <Navbar />
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
    <footer class="py-8 text-center text-gray-400 text-sm">
      <div class="max-w-7xl mx-auto px-4">
        <p>© {{ new Date().getFullYear() }} Futoro Digital Design Lab. All rights reserved.</p>
        <div class="mt-4 space-x-4">
          <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  </div>
</template>