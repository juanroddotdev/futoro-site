<script setup lang="ts">
import { onMounted } from 'vue';
import { servicesSectionAnimations } from '@/animations/servicesSection';
import ServicesData from '@/components/ServicesData.vue';

onMounted(() => {
  servicesSectionAnimations.cardsFadeIn();
});
</script>

<template>
  <section id="services" class="services-grid section theme-bg--neutral debug">
    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-2 sticky-heading-container">
        <h2 class="heading-responsive heading--accent sticky-heading gradient-text">How I Can Help</h2>
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
  height: 2500px; /* Match the height of ScrollAccordionVanilla */
  display: flex;
  flex-direction: column;
}

.sticky-heading {
  position: sticky;
  top: 100px; /* Adjust this value to control vertical position when sticky */
  align-self: flex-start;
}
</style>
