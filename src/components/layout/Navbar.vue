<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useScroll } from '@vueuse/core';
import { RouterLink } from 'vue-router';

const isScrolled = ref(false);
const isHidden = ref(false);
const lastScrollY = ref(0);
const { y } = useScroll(window);

const updateNavbar = () => {
  // Check if we've scrolled past threshold
  isScrolled.value = y.value > 50;
  
  // Determine scroll direction and update visibility
  if (y.value > lastScrollY.value && y.value > 150) {
    // Scrolling down & past threshold - hide navbar
    isHidden.value = true;
  } else {
    // Scrolling up or at top - show navbar
    isHidden.value = false;
  }
  
  lastScrollY.value = y.value;
};

onMounted(() => {
  updateNavbar();
  window.addEventListener('scroll', updateNavbar);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateNavbar);
});
</script>

<template>
  <nav :class="[
    'navbar',
    isScrolled ? 'navbar--scrolled' : 'navbar--default',
    isHidden ? 'navbar--hidden' : 'navbar--visible'
  ]">
    <div class="navbar__container">
      <div class="navbar__content">
        <a href="#" class="navbar__logo" :class="[
          isScrolled ? 'navbar__logo--small' : 'navbar__logo--large'
        ]">Futoro</a>
        
        <div class="navbar__links">
          <a href="#services" class="navbar__link">Services</a>
          <a href="#solutions" class="navbar__link">Solutions</a>
          <a href="#timeline" class="navbar__link">Process</a>
          <router-link to="/client-form" class="navbar__link">Questionnaire</router-link>
          <a href="#contact" class="navbar__cta" :class="[
            isScrolled ? 'btn-round-medium-primary' : 'btn-round-large-primary'
          ]">Contact Us</a>
        </div>
        
        <button class="navbar__mobile-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>
<style lang="scss">

</style>
