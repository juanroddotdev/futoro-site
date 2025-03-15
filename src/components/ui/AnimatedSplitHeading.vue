<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const props = defineProps({
  firstPart: {
    type: String,
    default: 'From Frustration'
  },
  secondPart: {
    type: String,
    default: 'to Fantastic'
  },
  suffix: {
    type: String,
    default: ': Website Solutions'
  },
  headingClass: {
    type: String,
    default: 'text-3xl font-bold text-center mb-10'
  },
  useGradient: {
    type: Boolean,
    default: false
  },
  animation: {
    type: String,
    default: 'split',
    validator: (value: string) => [
      'split', 'fade', 'typewriter', 'bounce', 'rotate',
      'glitch', 'shake', 'scramble', 'error', 'squeeze', 
      'typingMistakes', 'angryBounce'
    ].includes(value)
  }
});

const headingRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  await nextTick();
  
  if (!headingRef.value || !containerRef.value) return;
  
  // Set initial state - hide all elements
  const spans = headingRef.value.querySelectorAll('span');
  gsap.set(spans, { opacity: 0 });
  
  // Create ScrollTrigger
  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: () => animateHeading(),
    markers: false
  });
});

function animateHeading() {
  if (!headingRef.value) return;
  
  const firstPart = headingRef.value.querySelector('.first-part');
  const secondPart = headingRef.value.querySelector('.second-part');
  const suffix = headingRef.value.querySelector('.suffix');
  
  if (!firstPart || !secondPart || !suffix) return;
  
  const tl = gsap.timeline();
  
  // Reset any previous animations
  gsap.set([firstPart, secondPart, suffix], { clearProps: 'all' });
  gsap.set([firstPart, secondPart, suffix], { opacity: 0 });
  
  switch (props.animation) {
    case 'split':
      gsap.set(firstPart, { x: -50, opacity: 0 });
      gsap.set(secondPart, { x: 50, opacity: 0 });
      gsap.set(suffix, { y: 20, opacity: 0 });
      
      tl.to(firstPart, { x: 0, opacity: 1, duration: 0.6 })
        .to(secondPart, { x: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .to(suffix, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3");
      break;
      
    case 'fade':
      gsap.set([firstPart, secondPart, suffix], { y: 20, opacity: 0 });
      tl.to([firstPart, secondPart, suffix], { 
        y: 0, 
        opacity: 1, 
        stagger: 0.2, 
        duration: 0.8,
        ease: "power2.out" 
      });
      break;
      
    case 'typewriter':
      const firstText = firstPart.textContent || '';
      const secondText = secondPart.textContent || '';
      const suffixText = suffix.textContent || '';
      
      firstPart.textContent = '';
      secondPart.textContent = '';
      suffix.textContent = '';
      
      gsap.set([firstPart, secondPart, suffix], { opacity: 1 });
      
      tl.to(firstPart, { duration: 0.8, text: firstText, ease: "none" })
        .to(secondPart, { duration: 0.8, text: secondText, ease: "none" }, "+=0.2")
        .to(suffix, { duration: 0.8, text: suffixText, ease: "none" }, "+=0.2");
      break;
      
    case 'bounce':
      gsap.set([firstPart, secondPart, suffix], { y: 100, opacity: 0 });
      
      tl.to(firstPart, { y: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.3)" })
        .to(secondPart, { y: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.3)" }, "-=0.6")
        .to(suffix, { y: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.3)" }, "-=0.6");
      break;
      
    case 'rotate':
      gsap.set([firstPart, secondPart, suffix], { 
        rotationX: 180, 
        opacity: 0,
        transformPerspective: 800,
        transformOrigin: "center bottom"
      });
      
      tl.to(firstPart, { rotationX: 0, opacity: 1, duration: 1.2, ease: "back.out(2)" })
        .to(secondPart, { rotationX: 0, opacity: 1, duration: 1.2, ease: "back.out(2)" }, "-=0.8")
        .to(suffix, { rotationX: 0, opacity: 1, duration: 1.2, ease: "back.out(2)" }, "-=0.8");
      break;
      
    case 'glitch':
      gsap.set([firstPart, secondPart, suffix], { opacity: 0 });
      
      tl.to(firstPart, { opacity: 0.7, duration: 0.1 })
        .to(firstPart, { opacity: 1, x: 15, y: -10, skewX: 20, scale: 1.2, duration: 0.1 })
        .to(firstPart, { opacity: 0.5, x: -15, y: 8, skewX: -20, scale: 0.8, duration: 0.1 })
        .to(firstPart, { opacity: 1, x: 8, y: -5, skewX: 10, scale: 1.1, duration: 0.1 })
        .to(firstPart, { opacity: 0.8, x: -8, y: 3, skewX: -10, scale: 0.9, duration: 0.1 })
        .to(firstPart, { opacity: 1, x: 0, y: 0, skewX: 0, scale: 1, duration: 0.2 })
        .to(secondPart, { opacity: 1, duration: 0.4 }, "-=0.2")
        .to(suffix, { opacity: 1, duration: 0.4 }, "-=0.2");
      break;
      
    case 'shake':
      gsap.set([firstPart, secondPart, suffix], { opacity: 0 });
      
      // First appear
      tl.to(firstPart, { opacity: 1, duration: 0.3 })
        // Small shivers
        .to(firstPart, { 
          x: "+=3", 
          duration: 0.05, 
          repeat: 4, 
          yoyo: true,
          ease: "none" 
        })
        // Medium shakes
        .to(firstPart, { 
          x: "+=8", 
          duration: 0.06, 
          repeat: 3, 
          yoyo: true,
          ease: "none" 
        })
        // Large shakes
        .to(firstPart, { 
          x: "+=15", 
          duration: 0.08, 
          repeat: 4, 
          yoyo: true,
          ease: "power1.inOut" 
        })
        // Return to center with slight bounce
        .to(firstPart, { x: 0, duration: 0.3, ease: "back.out(2)" })
        
        // Animate second part and suffix
        .to(secondPart, { opacity: 1, duration: 0.3 }, "-=0.5")
        .to(suffix, { opacity: 1, duration: 0.3 }, "-=0.2");
      break;
      
    case 'error':
      gsap.set([firstPart, secondPart, suffix], { opacity: 0 });
      
      tl.to(firstPart, { opacity: 0.3, duration: 0.1 })
        .to(firstPart, { opacity: 1, color: "red", duration: 0.2 })
        .to(firstPart, { opacity: 0.5, duration: 0.1 })
        .to(firstPart, { opacity: 1, duration: 0.1 })
        .to(firstPart, { opacity: 0.7, duration: 0.1 })
        .to(firstPart, { opacity: 1, color: "currentColor", duration: 0.3 })
        .to(secondPart, { opacity: 1, duration: 0.4 }, "-=0.2")
        .to(suffix, { opacity: 1, duration: 0.4 }, "-=0.2");
      break;
      
    case 'squeeze':
      gsap.set(firstPart, { scaleX: 0.7, scaleY: 1.3, opacity: 0 });
      gsap.set([secondPart, suffix], { opacity: 0 });
      
      tl.to(firstPart, { opacity: 1, duration: 0.3 })
        .to(firstPart, { scaleX: 1.2, scaleY: 0.8, duration: 0.4, ease: "power2.inOut" })
        .to(firstPart, { scaleX: 1, scaleY: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" })
        .to(secondPart, { opacity: 1, duration: 0.4 }, "-=0.2")
        .to(suffix, { opacity: 1, duration: 0.4 }, "-=0.2");
      break;
      
    case 'angryBounce':
      gsap.set([firstPart, secondPart, suffix], { opacity: 0, y: -100 });
      
      tl.to(firstPart, { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        ease: "bounce.out",
        onComplete: () => {
          gsap.to(firstPart, {
            x: "random(-3, 3)",
            y: "random(-2, 2)",
            duration: 0.1,
            repeat: 3,
            ease: "none",
            onComplete: () => gsap.to(firstPart, { x: 0, y: 0, duration: 0.1 })
          });
        }
      })
      .to(secondPart, { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out" }, "-=0.3")
      .to(suffix, { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out" }, "-=0.2");
      break;
      
    case 'scramble':
      const originalText = firstPart.textContent || '';
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      
      // Set initial scrambled text
      let scrambledText = "";
      for (let i = 0; i < originalText.length; i++) {
        scrambledText += originalText[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
      }
      
      firstPart.textContent = scrambledText;
      gsap.set(firstPart, { opacity: 1 });
      
      // Unscramble text
      tl.to(firstPart, {
        duration: 1,
        text: originalText,
        ease: "none"
      });
      
      if (secondPart.textContent) {
        tl.to(secondPart, { opacity: 1, duration: 0.4 }, "-=0.5");
      }
      
      if (suffix.textContent) {
        tl.to(suffix, { opacity: 1, duration: 0.4 }, "-=0.2");
      }
      break;
      
    default:
      tl.to([firstPart, secondPart, suffix], { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 });
  }
}
</script>

<template>
  <div ref="containerRef" class="animated-heading-container">
    <h2 :class="headingClass" ref="headingRef">
      <span class="first-part" :class="{ 'theme-text--gradient gradient-normal': useGradient }">{{ firstPart }}</span>
      <span class="second-part" :class="{ 'theme-text--gradient gradient-normal': useGradient }"> {{ secondPart }}</span>
      <span class="suffix">{{ suffix }}</span>
    </h2>
  </div>
</template>

<style scoped>
.animated-heading-container {
  min-height: 100px;
  overflow: visible;
}

span {
  display: inline-block;
  opacity: 0;
  line-height: 1.5; /* Add proper line height */
  padding: 4px 0; /* Add some vertical padding */
  overflow: visible; /* Ensure text isn't cut off */
}

/* Ensure gradient text animations work properly */
.theme-text--gradient {
  background-size: 200% auto !important;
  animation: gradient-shift 3s ease infinite alternate !important;
  font-weight: bold !important;
}

/* For themes with more pronounced animations */
:deep(.theme-neon-horizon) .gradient-text,
:deep(.theme-digital-sunset) .gradient-text,
:deep(.theme-retro-wave) .gradient-text,
:deep(.theme-pastel-future) .gradient-text {
  animation: shine 3s linear infinite;
  background-size: 200% auto !important;
  font-weight: bold !important;
  letter-spacing: 0.02em !important;
}
</style>