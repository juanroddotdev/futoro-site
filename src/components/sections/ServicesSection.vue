<script setup lang="ts">
import { onMounted } from 'vue';
import gsap from 'gsap';
import ServicesData from '../ServicesData.vue';

onMounted(() => {
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
  });
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