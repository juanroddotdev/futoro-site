<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

const projects = [
  {
    title: 'TechVision Rebrand',
    category: 'Branding',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'EcoFlow App',
    category: 'UX/UI Design',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Quantum Labs',
    category: 'Web Design',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Nova Entertainment',
    category: 'Motion Design',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
  }
];

onMounted(() => {
  gsap.from('.portfolio-item', {
    scrollTrigger: {
      trigger: '.portfolio-grid',
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
  <section id="portfolio" class="section py-32">
    <div class="text-center mb-16">
      <h2 class="heading">Our Work</h2>
      <p class="subheading max-w-2xl mx-auto">
        Explore our latest projects and see how we've helped businesses transform their digital presence.
      </p>
    </div>
    
    <div class="portfolio-grid grid md:grid-cols-2 gap-8">
      <div v-for="project in projects" :key="project.title" 
           class="portfolio-item group relative overflow-hidden rounded-xl">
        <img :src="project.image" :alt="project.title" 
             class="w-full h-[300px] object-cover transform group-hover:scale-110 transition-transform duration-500" />
        <div class="absolute inset-0 bg-gradient-to-t from-space to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <p class="text-secondary mb-2">{{ project.category }}</p>
            <h3 class="text-2xl font-bold">{{ project.title }}</h3>
          </div>
        </div>
      </div>
    </div>
    
    <div class="text-center mt-12">
      <a href="#contact" class="btn btn-primary">Start Your Project</a>
    </div>
  </section>
</template>