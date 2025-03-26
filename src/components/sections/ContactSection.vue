<script setup lang="ts">
import { onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const email = 'juan@juanrod.dev';

onMounted(() => {
  const content = document.querySelector('.contact-v2__content');
  
  // Set initial state of content
  gsap.set(content, { opacity: 0, y: 50 });

  // Create scroll trigger for content fade in
  gsap.to(content, {
    scrollTrigger: {
      trigger: '.contact-v2',
      start: 'top center',
      toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out'
  });
});
</script>

<template>
  <section class="contact-v2">
    <div class="contact-v2__content">
      <h2 class="contact-v2__heading">
        Let's create something
        <span class="underline">extraordinary</span>
        together
      </h2>
      
      <div class="contact-v2__cta">
        <a :href="`mailto:${email}`" class="contact-v2__email">
          {{ email }}
        </a>
        <a :href="`mailto:${email}`" class="contact-v2__button">
          Get in Touch
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.contact-v2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>