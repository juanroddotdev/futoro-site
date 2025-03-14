<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
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
let lenis: any = null;

onMounted(() => {
  // Add Lenis script to document if it doesn't exist
  if (!document.getElementById('lenis-script')) {
    const script = document.createElement('script');
    script.id = 'lenis-script';
    script.src = 'https://unpkg.com/@studio-freight/lenis';
    script.async = true;
    document.head.appendChild(script);
    
    script.onload = initLenis;
  } else {
    // If script already exists, initialize Lenis directly
    initLenis();
  }
  
  function initLenis() {
    // Wait a bit to ensure Lenis is fully loaded
    setTimeout(() => {
      try {
        // @ts-ignore
        lenis = new window.Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        });

        // Connect Lenis to ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // Connect GSAP ticker to Lenis
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });

        // Make ScrollTrigger use Lenis's scroll position
        gsap.ticker.lagSmoothing(0);

        initScrollAccordion();
      } catch (error) {
        console.error('Error initializing Lenis:', error);
        // Initialize scroll accordion without Lenis
        initScrollAccordion();
      }
    }, 100);
  }

  function initScrollAccordion() {
    if (accordionsRef.value) {
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
  }
});

// Clean up Lenis instance when component is unmounted
onUnmounted(() => {
  if (lenis) {
    lenis.destroy();
    gsap.ticker.remove(lenis.raf);
  }
});
</script>

<template>
  <div class="scroll-accordion">
    <div class="spacer" style="height: 30vh;"></div>
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
    <div class="spacer" style="height: 30vh;"></div>
  </div>
</template>

<style lang="scss">
.scroll-accordion {
  .spacer {
    height: 70vh;
  }

  .accordions {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20vh;
  }

  .accordion {
    background: linear-gradient(200deg, rgb(29, 145, 252) 13.57%, rgb(90, 54, 192) 98.38%);
    width: max(50vw, 280px);
    padding: 25px 30px 10px;
    border-radius: 15px;
    margin-bottom: 40px;
    box-shadow: 0 30px 30px -10px rgba(0, 0, 0, .3);
    
    &:nth-child(1) {
      background: linear-gradient(200deg, rgb(29, 145, 252) 13.57%, rgb(90, 54, 192) 98.38%);
    }
    
    &:nth-child(2) {
      background: linear-gradient(200deg, rgb(242, 136, 133) 13.57%, rgb(233, 79, 102) 98.38%);
    }
    
    &:nth-child(3) {
      background: linear-gradient(200deg, rgb(101, 187, 118) 13.57%, rgb(70, 111, 171) 98.38%);
    }
    
    &:nth-child(4) {
      background: linear-gradient(200deg, #c215d1 13.57%, #9813a1 98.38%);
    }

    .title {
      font-size: max(2vw, 24px);
      line-height: 1.1;
      padding-bottom: .4em;
      color: rgb(255, 255, 255);
      text-shadow: 0 2px 2px rgba(0, 0, 0, .1);
    }

    .text {
      font-size: max(1vw, 15px);
      line-height: 1.4;
      overflow: hidden;
      padding-bottom: 20px;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  @media (max-width: 480px) {
    .accordion {
      padding: 15px 20px 8px;
    }
    .title {
      font-size: 20px;
    }
  }
}
</style>