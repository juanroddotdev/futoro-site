<script setup lang="ts">
import { onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { highlights, expertise, journey } from '@/data/aboutSectionData';

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  gsap.from('.highlights__number', {
    scrollTrigger: {
      trigger: '.highlights',
      start: 'top 80%',
    },
    textContent: 0,
    duration: 2,
    ease: 'power1.out',
    snap: { textContent: 1 },
    stagger: 0.2
  });

  gsap.from('.expertise-grid__card', {
    scrollTrigger: {
      trigger: '.expertise-grid',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2
  });

  gsap.from('.journey-section__card', {
    scrollTrigger: {
      trigger: '.journey-section',
      start: 'top 80%',
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2
  });
});
</script>

<template>
  <section id="about" class="about-section">
    <div class="text-center mb-20">
      <h2 class="heading heading--accent mb-6">About Futoro</h2>
      <div class="max-w-3xl mx-auto">
        <p class="text-xl theme-text--highlight mb-4">Transforming Ideas into Engaging Digital Experiences</p>
      </div>
    </div>

    <div class="highlights">
      <div v-for="highlight in highlights" :key="highlight.label" 
           class="highlights__card">
        <h3 class="highlights__number">{{ highlight.number }}</h3>
        <p class="theme-text--neutral">{{ highlight.label }}</p>
      </div>
    </div>

    <div class="journey-section">
      <div v-for="item in journey" :key="item.title"
           class="journey-section__card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.content }}</p>
      </div>
    </div>

    <div class="expertise-grid">
      <div v-for="item in expertise" :key="item.title" 
           class="expertise-grid__card">
        <div class="icon">{{ item.icon }}</div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </section>
</template>

