<script setup lang="ts">
import { onMounted } from 'vue';
import gsap from 'gsap';

onMounted(() => {
  gsap.from('.hero-content > *', {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power2.out'
  });
});
</script>

<template>
  <section class="min-h-screen flex items-center relative overflow-hidden">
    <!-- Background Animation -->
    <div class="absolute inset-0 bg-space">
      <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-50"></div>
      <div class="absolute w-96 h-96 bg-secondary/30 rounded-full filter blur-3xl -top-20 -right-20 animate-pulse"></div>
      <div class="absolute w-96 h-96 bg-primary/30 rounded-full filter blur-3xl -bottom-20 -left-20 animate-pulse"></div>
    </div>
    
    <div class="section relative z-10">
      <div class="hero-content max-w-3xl">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Designing the Future of Digital
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8">
          Transform your digital presence with cutting-edge design solutions that push the boundaries of innovation.
        </p>
        <div class="flex flex-wrap gap-4">
          <a href="#contact" class="btn btn--primary">Get Started</a>
          <a href="#portfolio" class="btn border border-white/20 hover:bg-white/10">View Our Work</a>
        </div>
      </div>
    </div>
  </section>
</template>
