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
  <section class="min-h-screen flex items-center relative overflow-hidden theme-bg--primary">
    <!-- Background Animation -->
    <!-- <div class="absolute inset-0 bg-neutral-gray">
      <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-50"></div>
      <div class="absolute w-96 h-96 bg-secondary/30 rounded-full filter blur-3xl -top-20 -right-20 animate-pulse"></div>
      <div class="absolute w-96 h-96 bg-primary/30 rounded-full filter blur-3xl -bottom-20 -left-20 animate-pulse"></div>
    </div> -->
    
    <div class="section relative z-10 my-40">
      <h1 class="heading heading--accent mb-6">{{ heading.one }}</h1>
      <!-- <h2 class="heading heading--highlight mb-12">{{ heading.two }}</h2> -->
      <p class="body-text text-xl mb-8">
        We craft digital experiences that inspire, engage, and transform.
      </p>
      <div class="flex gap-4">
        <a href="#contact" class="theme-btn theme-btn--secondary">Start Your Project</a>
        <a href="#services" class="theme-btn theme-btn--outline">Our Services</a>
      </div>
    </div>
  </section>
</template>
