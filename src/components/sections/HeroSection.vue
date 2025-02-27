<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import gsap from 'gsap';
import heroImage from '@/assets/images/hero-image.jpg';

onMounted(() => {
  gsap.from('.hero-content > *', {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power2.out'
  });
});
const heading = reactive({
  one: 'Designing the Future of Digital',
  two: 'Pioneering the Future of Design',
})
</script>

<template>
  <section class="min-h-screen flex items-center relative overflow-hidden">
    <!-- Background Animation -->
    <!-- <div class="absolute inset-0 bg-neutral-gray">
      <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-50"></div>
      <div class="absolute w-96 h-96 bg-secondary/30 rounded-full filter blur-3xl -top-20 -right-20 animate-pulse"></div>
      <div class="absolute w-96 h-96 bg-primary/30 rounded-full filter blur-3xl -bottom-20 -left-20 animate-pulse"></div>
    </div> -->
    
    <div class="section relative z-10 my-40">
      <div class="hero-content max-w-auto">
          <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
           {{ heading.two }}
        </h1>

        <img class="h-auto max-w-full rounded-lg shadow-lg mb-8" :src="heroImage" alt="Design showcase">

        <div class="flex flex-wrap gap-4">
          <a href="#contact" class="btn-neutral btn-neutral--primary">Get Started</a>
          <a href="#howItWorks" class="btn-neutral btn-neutral--secondary">How It Works</a>
        </div>
      </div>
    </div>
  </section>
</template>
