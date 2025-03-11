<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useScroll } from '@vueuse/core';

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
    'fixed w-full z-50 transition-all duration-300',
    isScrolled ? 'theme-bg--primary/80 backdrop-blur-md h-16' : 'theme-bg--primary h-24',
    isHidden ? '-translate-y-full' : 'translate-y-0'
  ]">
    <div class="max-w-7xl mx-auto px-4 md:px-8 h-full">
      <div class="flex items-center justify-between h-full">
        <a href="#" class="text-neutral-100 font-bold" :class="[
          isScrolled ? 'text-xl' : 'text-2xl'
        ]">Futoro</a>
        
        <div class="hidden md:flex items-center space-x-8">
          <a href="#about" class="text-neutral-100 hover:text-secondary transition-colors">About</a>
          <a href="#services" class="text-neutral-100 hover:text-secondary transition-colors">Services</a>
          <a href="#portfolio" class="text-neutral-100 hover:text-secondary transition-colors">Portfolio</a>
          <a href="#contact" class="theme-btn theme-btn--secondary text-neutral-100" :class="[
            isScrolled ? 'text-sm py-2 px-4' : 'text-base py-3 px-6'
          ]">Contact Us</a>
        </div>
        
        <button class="md:hidden text-neutral-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>
<style scoped>
nav {
  transform-origin: top;
}

a {
  font-weight: 500;
}

.text-neutral-100 {
  color: #FBFBFB;
}
</style>
