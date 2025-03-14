<script setup lang="ts">
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AccordionItem {
  id: number;
  title: string;
  description: string;
}

defineProps<{
  items: AccordionItem[];
}>();

const accordionsRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (accordionsRef.value) {
    // Enable scroll markers for debugging
    ScrollTrigger.defaults({ markers: true });
    
    // Create a container reference for pinning
    const scrollAccordionEl = accordionsRef.value.closest('.scroll-accordion');
    
    // Accordion effect with pinning
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollAccordionEl || accordionsRef.value,
        start: 'top 20%',
        end: 'bottom 20%',
        pin: true,
        pinSpacing: true,
        scrub: 1,
        markers: true
      }
    });
    
    // Animate accordion text closing
    tl.to('.accordion .text', {
      height: 0,
      paddingBottom: 0,
      opacity: 0,
      stagger: 0.2,
    });
    
    // Animate accordion margin reduction
    tl.to('.accordion', {
      marginBottom: 10, // Reduced from original 40px
      stagger: 0.2,
    }, '<');
  }
});
</script>

<template>
  <div class="scroll-accordion">
    <div class="spacer"></div>
    <div class="accordions" ref="accordionsRef">
      <div 
        v-for="item in items" 
        :key="item.id" 
        class="accordion"
      >
        <div class="title">
          {{ item.title }}
        </div>
        <div class="text">
          {{ item.description }}
        </div>
      </div>
    </div>
    <div class="spacer"></div>
  </div>
</template>
<style lang="scss">
@import '@/scss/components/_scroll-accordion.scss';
</style>
