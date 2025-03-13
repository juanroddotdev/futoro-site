<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/components/the-process/Navbar.vue'
import Hero from '@/components/the-process/Hero.vue'
import StrugglesOffersTabs from '@/components/the-process/StrugglesOffersTabs.vue'
import ProcessTimeline from '@/components/the-process/ProcessTimeline.vue'
import ServicesSection from '@/components/the-process/ServicesSection.vue'
import ContactSection from '@/components/the-process/ContactSection.vue'
import ViewFinalButton from '@/components/the-process/ViewFinalButton.vue'

const currentTheme = ref('theme-wireframe')
</script>

<template>
  <div class="app min-h-screen relative the-process" :class="currentTheme">
    <Navbar />
    <div class="main-content">
      <Hero />
      <StrugglesOffersTabs />
      <ProcessTimeline />
      <ServicesSection />
    </div>
    <ContactSection />
    <ViewFinalButton />
  </div>
</template>

<style lang="scss">
@import '@/scss/views/_process.scss';
</style>
