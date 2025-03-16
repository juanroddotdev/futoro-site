<script setup lang="ts">
import { onMounted } from 'vue';
import { servicesSectionAnimations } from '@/animations/servicesSection';
import ServicesData from '@/components/ServicesData.vue';

onMounted(() => {
  servicesSectionAnimations.cardsFadeIn();
});
</script>

<template>
  <section id="services" class="services-grid section theme-bg--neutral ">
    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-2 sticky-heading-container">
        <h2 class="mega-heading sticky-heading gradient-text">How I Can Help</h2>
      </div>
      <div class="col-span-3 service-card">
        <ServicesData />
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.sticky-heading-container {
  position: relative;
  height: 2000px; /* Match the height of ScrollAccordionVanilla */
  display: flex;
  flex-direction: column;
  overflow: visible; /* Allow content to overflow */
}

.sticky-heading {
  position: sticky;
  top: 100px; /* Adjust this value to control vertical position when sticky */
  align-self: flex-start;
}

.mega-heading {
  font-size: clamp(4rem, 15vw, 12rem);
  line-height: 0.85;
  font-weight: 900;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  margin-left: -0.05em; /* Negative margin to create the feeling of breaking out */
  width: 150%; /* Make it wider than its container */
  max-width: 150%;
  transform-origin: left center;
  word-break: break-word;
  hyphens: auto;
  
  /* Create a slight tilt for added dynamism */
  transform: rotate(-2deg) translateX(-5%);
  
  /* Add text shadow for depth */
  text-shadow: 0.03em 0.03em 0 rgba(0, 0, 0, 0.2);
  
  /* Ensure it stays on top of other content */
  z-index: 10;
  
  /* Add subtle pulsing animation */
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: rotate(-2deg) translateX(-5%) scale(1);
  }
  50% {
    transform: rotate(-2deg) translateX(-5%) scale(1.02);
  }
}
</style>
