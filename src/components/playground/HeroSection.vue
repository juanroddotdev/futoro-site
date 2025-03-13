<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { heroSectionAnimations } from '@/animations/heroSection';
import { HeroContent, getRandomHeroContent } from '@/data/heroContent';

const heroContent = ref<HeroContent>(getRandomHeroContent());

defineProps<{
  currentTheme: string,
  floating?: boolean,
  spotlight?: boolean // Added spotlight prop
}>();

onMounted(() => {
  heroSectionAnimations.playgroundHeroFadeIn();
});
</script>

<template>
  <section 
    class="playground-hero grid-paper-overlay"
    :class="[
      `theme-${currentTheme}`,
      { 
        'grid-paper-overlay--floating': floating,
        'grid-paper-overlay--spotlight': spotlight
      }
    ]"
  >
    <div class="section my-40 hero-content">
      <h1 class="heading--accent mb-6 headline heading-responsive">{{ heroContent.headline }}</h1>
      <p class="mb-8 subheadline subheading-responsive heading heading--highlight">
        {{ heroContent.subheadline }}
      </p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.playground-hero {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  
  .section {
    @apply px-4 mx-auto max-w-7xl;
  }

  .heading-responsive {
    @apply text-3xl md:text-4xl lg:text-5xl font-bold;
  }

  .subheading-responsive {
    @apply text-xl md:text-2xl lg:text-3xl;
  }
}
</style>