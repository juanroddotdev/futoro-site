<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { aboutSectionAnimations } from '@/animations/aboutSectionAlt';
import { highlights, expertise, journey } from '@/data/aboutSectionData';

const animatedNumbers = ref<string[]>(highlights.map(highlight => 
  highlight.number.includes('+') ? '0+' : 
  highlight.number.includes('%') ? '0%' : 
  highlight.number.includes('/') ? '0/7' : '0'
));

onMounted(() => {
  try {
    // Initialize highlights counter animations
    highlights.forEach((highlight, index) => {
      let endNumber = parseInt(highlight.number.replace(/[^0-9]/g, '')) || 0;
      const obj = { val: 0 };
      
      aboutSectionAnimations.highlightCounter(obj, endNumber)
        .eventCallback('onUpdate', () => {
          const value = Math.round(obj.val).toString();
          if (highlight.number.includes('+')) {
            animatedNumbers.value[index] = value + '+';
          } else if (highlight.number.includes('%')) {
            animatedNumbers.value[index] = value + '%';
          } else if (highlight.number.includes('/')) {
            animatedNumbers.value[index] = value + '/7';
          } else {
            animatedNumbers.value[index] = value;
          }
        });
    });

    // Initialize card animations
    aboutSectionAnimations.expertiseCards();
    aboutSectionAnimations.journeyCards();
    
  } catch (error) {
    console.error('Error in animation setup:', error);
  }
});
</script>

<template>
  <section id="about" class="about-section">
    <div class="text-center mb-20">
      <h2 class="heading heading--accent heading-responsive mb-6">About Futoro</h2>
      <div class="max-w-3xl mx-auto">
        <p class="theme-text--highlight mb-4 body-text text-md">Transforming Ideas into Engaging Digital Experiences</p>
      </div>
    </div>

    <!-- Highlights Section -->
    <div class="highlights mb-20">
      <div v-for="(highlight, index) in highlights" :key="highlight.label" class="highlights__card">
        <h3 class="highlights__number">{{ animatedNumbers[index] }}</h3>
        <p class="theme-text--neutral">{{ highlight.label }}</p>
      </div>
    </div>

    <!-- Journey Section -->
    <div class="journey-section mb-20">
      <div v-for="item in journey" :key="item.title" class="journey-section__card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.content }}</p>
      </div>
    </div>

    <!-- Expertise Section -->
    <div class="expertise-grid mb-20">
      <div v-for="item in expertise" :key="item.title" class="expertise-grid__card p-6 rounded-lg theme-bg--secondary"
        style="visibility: visible; opacity: 1;">
        <div class="text-4xl mb-4">{{ item.icon }}</div>
        <h3 class="text-xl font-bold mb-3">{{ item.title }}</h3>
        <p class="theme-text--neutral">{{ item.description }}</p>
      </div>
    </div>
  </section>

</template>

<style lang="scss" scoped>
.expertise-grid__card {
  will-change: transform, opacity;
  backface-visibility: hidden;
}
</style>

