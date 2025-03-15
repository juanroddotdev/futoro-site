<script setup lang="ts">
import { ref } from 'vue'
import HeroSection from '@/components/playground/HeroSection.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import Card3DShowcase from '@/components/sections/Card3DShowcase.vue'
import ScrollAccordionVanilla from '@/components/ui/ScrollAccordionVanilla.vue'
import StrugglesOffersHorizontalScroll from '@/components/sections/StrugglesOffersHorizontalScroll.vue'
import AnimatedSplitHeading from '@/components/ui/AnimatedSplitHeading.vue'
import TextAnimationsDemo from '@/views/TextAnimationsDemo.vue'
// import CustomHorizontalScrollV2 from '../components/playground/CustomHorizontalScrollV2.vue'
// Import the horizontal scroll components
// import HorizontalScrollContainer from '@/components/horizontal-scroll/HorizontalScrollContainer.vue'
// import ScrollRow from '@/components/horizontal-scroll/ScrollRow.vue'
// import ScrollItem from '@/components/horizontal-scroll/ScrollItem.vue'
// import { struggles, solutions } from '@/data/strugglesAndSolutions'
// import { icons } from '@/utils/icons'

defineProps<{
  currentTheme: string
}>()

const emit = defineEmits<{
  (e: 'update:currentTheme', value: string): void
}>()

// Sample accordion items for testing
const accordionItems = ref([
  { id: 1, title: 'First Item', description: 'This is the description for the first accordion item. It contains some text that will be animated.' },
  { id: 2, title: 'Second Item', description: 'Here is the second item with its own unique description. This text will collapse as you scroll.' },
  { id: 3, title: 'Third Item', description: 'The third item in our accordion list. This content will also animate based on scroll position.' },
  { id: 4, title: 'Fourth Item', description: 'Our final accordion item with some descriptive text that will be part of the animation sequence.' },
])
</script>

<template>
  <div class="playground-view min-h-screen relative" :class="`theme-${currentTheme.replace('theme-', '')}`">
    <ThemeSwitcher :current-theme="currentTheme" @update:currentTheme="(theme) => emit('update:currentTheme', theme)" />
    <div class="main-content">
      <HeroSection :current-theme="currentTheme.replace('theme-', '')" :floating="true" :spotlight="true" />
      <Card3DShowcase :current-theme="currentTheme.replace('theme-', '')" />


      <!-- Vanilla scroll accordion component -->
      <div class="py-20">
        <h2 class="text-3xl font-bold text-center mb-10 theme-text--gradient">Vanilla Scroll Accordion</h2>
        <ScrollAccordionVanilla :items="accordionItems" />
      </div>

      <!-- Text Animations Demo Section -->
      <div class="py-20">
        <TextAnimationsDemo />
      </div>

      <!-- StrugglesOffersHorizontalScroll section -->
      <div class="py-20">
        <AnimatedSplitHeading firstPart="From Frustration" secondPart="to Fantastic" animation="shake"
          headingClass="text-3xl font-bold text-center mb-10 gradient-text" />
        <StrugglesOffersHorizontalScroll />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/scss/playground/index';

.playground-view {
  position: relative;

  .main-content {
    position: relative;
    z-index: 1;
  }
}
</style>