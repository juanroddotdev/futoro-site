<script setup lang="ts">
import { onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import { icons } from '@/utils/icons';

gsap.registerPlugin(ScrollTrigger);

// Map each struggle/solution to a specific icon
const getIcon = (item: any, type: 'struggle' | 'solution') => {
  const iconSet = type === 'struggle' ? icons.struggle : icons.solution;
  // Use the item's key or ID to get the corresponding icon
  const iconKey = item.iconKey || Object.keys(iconSet)[0];
  return iconSet[iconKey];
};

onMounted(() => {
  gsap.from('.struggle-card', {
    scrollTrigger: {
      trigger: '.struggles-section',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
  });

  gsap.from('.solution-card', {
    scrollTrigger: {
      trigger: '.solutions-section',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
  });
});
</script>

<template>
  <section class="section py-32">
    <div class="max-w-7xl mx-auto px-4">
      <div class="relative">
        <!-- Center Line -->
        <div class="absolute left-1/2 top-0 bottom-0 w-px theme-bg--secondary/30 transform -translate-x-1/2"></div>

        <!-- Content -->
        <div class="space-y-32">
          <!-- Struggles Section -->
          <div class="struggles-section">
            <h2 class="heading heading-2xl text-center mb-16 flex items-center justify-center gap-3 theme-text--neutral">
              <span v-html="icons.struggle.confusion" class="theme-text--secondary"></span>
              Common Struggles
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              <div 
                v-for="(struggle, index) in struggles" 
                :key="struggle.id"
                class="struggle-card relative"
                :class="index % 2 === 0 ? 'md:text-right' : 'md:col-start-2'"
              >
                <!-- Connector Line -->
                <div 
                  class="hidden md:block absolute top-1/2 w-8 h-px theme-bg--secondary/50"
                  :class="index % 2 === 0 ? '-right-8' : '-left-8'"
                ></div>
                <!-- Icon Circle -->
                <div 
                  class="hidden md:flex absolute top-1/2 w-10 h-10 theme-bg--neutral rounded-full transform -translate-y-1/2 items-center justify-center border theme-border--secondary/50"
                  :class="index % 2 === 0 ? '-right-14' : '-left-14'"
                >
                  <div class="theme-text--secondary" v-html="getIcon(struggle, 'struggle')"></div>
                </div>
                
                <div class="theme-bg--neutral/50 rounded-xl border theme-border--primary/10 p-6 hover:theme-border--secondary/50 transition-all duration-300">
                  <h3 class="text-xl font-semibold mb-3 theme-text--primary">{{ struggle.title }}</h3>
                  <p class="theme-text--neutral">{{ struggle.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Solutions Section -->
          <div class="solutions-section">
            <h2 class="heading heading-2xl text-center mb-16 flex items-center justify-center gap-3 theme-text--neutral">
              <span v-html="icons.solution.expert" class="theme-text--secondary"></span>
              Our Solutions
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              <div 
                v-for="(solution, index) in solutions" 
                :key="solution.id"
                class="solution-card relative"
                :class="index % 2 === 0 ? 'md:text-right' : 'md:col-start-2'"
              >
                <!-- Connector Line -->
                <div 
                  class="hidden md:block absolute top-1/2 w-8 h-px theme-bg--secondary/50"
                  :class="index % 2 === 0 ? '-right-8' : '-left-8'"
                ></div>
                <!-- Icon Circle -->
                <div 
                  class="hidden md:flex absolute top-1/2 w-10 h-10 theme-bg--neutral rounded-full transform -translate-y-1/2 items-center justify-center border theme-border--secondary/50"
                  :class="index % 2 === 0 ? '-right-14' : '-left-14'"
                >
                  <div class="theme-text--secondary" v-html="getIcon(solution, 'solution')"></div>
                </div>

                <div class="theme-bg--neutral/50 rounded-xl border theme-border--primary/10 p-6 hover:theme-border--secondary/50 transition-all duration-300">
                  <h3 class="text-xl font-semibold mb-3 theme-text--primary">{{ solution.title }}</h3>
                  <p class="theme-text--neutral">{{ solution.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.section {
  @apply relative overflow-hidden;
}

.heading-2xl {
  @apply text-4xl md:text-5xl font-bold;
}
</style>