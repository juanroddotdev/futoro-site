<script setup lang="ts">
import { onMounted } from 'vue';
import gsap from 'gsap';

const services = [
  {
    title: 'Web Design',
    description: 'Custom, responsive websites that captivate and convert.',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`
  },
  {
    title: 'UX/UI Design',
    description: 'Intuitive interfaces that enhance user engagement and satisfaction.',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>`
  },
  {
    title: 'Digital Branding',
    description: 'Cohesive brand identities that make lasting impressions.',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>`
  },
  {
    title: 'Motion Design',
    description: 'Dynamic animations that bring your brand to life.',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`
  }
];

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
  <section id="services" class="section py-32 bg-neutral-gray/50">
    <div class="text-center mb-16">
      <h2 class="heading">Our Services</h2>
      <p class="subheading max-w-2xl mx-auto">
        We offer a comprehensive suite of digital design services to help your business thrive in the digital age.
      </p>
    </div>
    
    <div class="services-grid grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div v-for="service in services" :key="service.title" 
           class="service-card group bg-neutral-gray p-6 rounded-xl border border-white/10 hover:border-secondary/50 transition-all duration-300">
        <div class="text-secondary mb-4" v-html="service.icon"></div>
        <h3 class="text-xl font-semibold mb-3">{{ service.title }}</h3>
        <p class="text-gray-300">{{ service.description }}</p>
      </div>
    </div>
  </section>
</template>