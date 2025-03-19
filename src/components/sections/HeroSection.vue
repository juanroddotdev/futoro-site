<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { heroSectionAnimations } from '@/animations/heroSection';
import heroImage from '@/assets/images/hero-image.jpg';
import { HeroContent, getRandomHeroContent } from '@/data/heroContent';

const heroContent = ref<HeroContent>(getRandomHeroContent());

onMounted(() => {
  heroSectionAnimations.contentFadeIn();
});
</script>

<template>
  <section class="min-h-screen flex items-center relative overflow-hidden theme-bg--primary mx-auto px-4 md:px-8 h-full">
    <div class="section relative z-10 my-40 hero-content">
      <h1 class="heading--accent mb-6 headline heading-responsive">{{ heroContent.headline }}</h1>
      <p class="mb-8 subheadline subheading-responsive heading heading--highlight">
        {{ heroContent.subheadline }}
      </p>
      <div class="flex gap-4">
        <a 
          href="#contact" 
          class="btn-round-large-primary cta"
        >
          {{ heroContent.cta }}
        </a>
        <a 
          href="#services" 
          class="btn-round-large-outline-primary"
        >
          Our Services
        </a>
      </div>
    </div>
  </section>
</template>
