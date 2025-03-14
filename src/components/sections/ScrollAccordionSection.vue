<script setup lang="ts">
import { ref } from 'vue';
import ScrollAccordion from '@/components/ui/ScrollAccordion.vue';
import { services } from '@/data/services';

// Use the same data as ServicesAccordion
const accordionItems = ref(services.map((service, index) => ({
  id: index + 1,
  title: service.title,
  description: service.description
})));
</script>

<template>
  <section class="scroll-accordion-section section py-20 debug">
    <h2 class="heading-responsive gradient-text text-center mb-12">Our Services</h2>
    <div class="scroll-accordion-wrapper">
      <ScrollAccordion :items="accordionItems" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/scss/components/_scroll-accordion.scss';

.scroll-accordion-wrapper {
  position: relative;
  
  // Override the first spacer height to bring title closer
  :deep(.scroll-accordion .spacer:first-child) {
    height: 20vh; // Reduced from 70vh
  }
}
</style>