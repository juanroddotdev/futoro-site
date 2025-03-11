
<script setup lang="ts">
import { onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { struggles, solutions } from '@/data/strugglesAndSolutions';

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  gsap.from('.struggles-content', {
    scrollTrigger: {
      trigger: '.struggles-content',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
  });

  gsap.from('.solutions-content', {
    scrollTrigger: {
      trigger: '.solutions-content',
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
  <section class="section py-32">
    <div class="grid grid-cols-2 gap-16">
      <!-- Struggles Section -->
      <div class="struggles-content">
        <h2 class="heading text-neutral-medium heading-2xl mb-8">Common Struggles</h2>
        <div class="space-y-6">
          <div v-for="struggle in struggles" 
               :key="struggle.id"
               class="p-6 bg-neutral-gray/50 rounded-xl border border-white/10">
            <h3 class="text-xl font-semibold mb-2">{{ struggle.title }}</h3>
            <p class="text-gray-300">{{ struggle.description }}</p>
          </div>
        </div>
      </div>

      <!-- Solutions Section -->
      <div class="solutions-content">
        <h2 class="heading text-neutral-medium heading-2xl mb-8">Our Solutions</h2>
        <div class="space-y-6">
          <div v-for="solution in solutions" 
               :key="solution.id"
               class="p-6 bg-neutral-gray/50 rounded-xl border border-white/10 hover:border-secondary/50 transition-all duration-300">
            <h3 class="text-xl font-semibold mb-2">{{ solution.title }}</h3>
            <p class="text-gray-300">{{ solution.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.heading-2xl {
  @apply text-4xl md:text-5xl font-bold;
}
</style>