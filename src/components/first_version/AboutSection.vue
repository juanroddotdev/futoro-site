<script setup lang="ts">
import { onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  gsap.from('.about-content', {
    scrollTrigger: {
      trigger: '.about-content',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  });
});
</script>

<template>
  <section id="about" class="section py-32">
    <div class="about-content grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="heading bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
          About Futoro
        </h2>
        <p class="text-lg text-gray-300 mb-6">
          At Futoro Digital Design Lab, we're not just designers – we're innovators, experimenters, and digital craftsmen. Our mission is to push the boundaries of digital design while delivering practical, results-driven solutions for our clients.
        </p>
        <p class="text-lg text-gray-300">
          Our lab approach means we're constantly exploring new technologies and techniques, ensuring your digital presence stays ahead of the curve. We combine cutting-edge innovation with rock-solid reliability to create designs that don't just look good – they perform.
        </p>
      </div>
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl transform rotate-3"></div>
        <div class="relative bg-neutral-gray p-8 rounded-2xl border border-white/10">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 text-center">
              <h3 class="text-4xl font-bold text-secondary mb-2">150+</h3>
              <p class="text-gray-300">Projects Completed</p>
            </div>
            <div class="p-4 text-center">
              <h3 class="text-4xl font-bold text-accent mb-2">98%</h3>
              <p class="text-gray-300">Client Satisfaction</p>
            </div>
            <div class="p-4 text-center">
              <h3 class="text-4xl font-bold text-primary mb-2">10+</h3>
              <p class="text-gray-300">Years Experience</p>
            </div>
            <div class="p-4 text-center">
              <h3 class="text-4xl font-bold text-secondary mb-2">24/7</h3>
              <p class="text-gray-300">Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>