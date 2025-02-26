<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useScroll } from '@vueuse/core';

const isScrolled = ref(false);
const { y } = useScroll(window);

const updateNavbar = () => {
  isScrolled.value = y.value > 50;
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
  <nav :class="['fixed w-full z-50 transition-all duration-300', 
    isScrolled ? 'bg-neutral-gray backdrop-blur-md py-4' : 'py-6']">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
      <div class="flex items-center justify-between">
        <a href="#" class="text-2xl font-bold text-white">Futoro</a>
        
        <div class="hidden md:flex items-center space-x-8">
          <a href="#about" class="text-white hover:text-secondary transition-colors">About</a>
          <a href="#services" class="text-white hover:text-secondary transition-colors">Services</a>
          <a href="#portfolio" class="text-white hover:text-secondary transition-colors">Portfolio</a>
          <a href="#contact" class="btn-neutral btn-neutral--primary">Contact Us</a>
        </div>
        
        <button class="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>