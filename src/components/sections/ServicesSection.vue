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
  <section id="services" class="section w-fullbg-neutral-gray/50">
    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-2">
        <h2 class="heading text-neutral-medium heading-2xl">Our Services</h2>
      </div>
      <div class="col-span-3">
        <ServicesData />
      </div>
    </div>
  </section>
</template>