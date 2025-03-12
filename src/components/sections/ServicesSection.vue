<script setup lang="ts">
import { onMounted } from 'vue';
import { servicesSectionAnimations } from '@/animations/servicesSection';
import { services } from '@/data/services';
import ServicesData from '@/components/ServicesData.vue';

onMounted(() => {
  servicesSectionAnimations.cardsFadeIn();
});
</script>

<template>
  <section id="services" class="services-grid section theme-bg--neutral">
    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-2">
        <h2 class="heading-responsive heading--accent">How I Can Help</h2>
      </div>
      <div class="col-span-3 service-card">
        <ServicesData />
      </div>
    </div>
  </section>
</template>