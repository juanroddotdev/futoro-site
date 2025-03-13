<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useScroll } from '@vueuse/core';

const isScrolled = ref(false);
const isHidden = ref(false);
const lastScrollY = ref(0);
const { y } = useScroll(window);

const updateNavbar = () => {
  isScrolled.value = y.value > 50;
  if (y.value > lastScrollY.value && y.value > 150) {
    isHidden.value = true;
  } else {
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
    'fixed w-full z-50 transition-all duration-300 wireframe-nav',
    isScrolled ? 'h-16' : 'h-24',
    isHidden ? '-translate-y-full' : 'translate-y-0'
  ]">
    <div class="max-w-7xl mx-auto px-4 md:px-8 h-full">
      <div class="flex items-center justify-between h-full nav-content">
        <a href="#" class="logo font-bold" :class="[
          isScrolled ? 'text-xl' : 'text-2xl'
        ]">Futoro</a>
        
        <div class="hidden md:flex items-center space-x-8 nav-links">
          <a href="#about" class="nav-link">About</a>
          <a href="#services" class="nav-link">Services</a>
          <a href="#portfolio" class="nav-link">Portfolio</a>
          <a href="#contact" class="btn-wireframe btn-wireframe--primary" :class="[
            isScrolled ? 'text-sm py-2 px-4' : 'text-base py-3 px-6'
          ]">Contact Us</a>
        </div>
        
        <button class="md:hidden menu-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  transform-origin: top;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
}

.nav-content {
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: -5px;
    border: 2px solid #333;
    border-style: solid;
    filter: url(#pencil-effect);
    border-radius: 8px;
    pointer-events: none;
  }
}

.logo {
  font-family: 'Architects Daughter', cursive;
  color: #333;
  position: relative;
  filter: url(#pencil-effect);
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    background: #333;
    filter: url(#pencil-effect);
  }
}

.nav-link {
  font-family: 'Architects Daughter', cursive;
  color: #333;
  position: relative;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    background: #333;
    transform: scaleX(0);
    transition: transform 0.3s ease;
    filter: url(#pencil-effect);
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
}

.btn-wireframe {
  position: relative;
  border-radius: 9999px;
  font-family: 'Architects Daughter', cursive;
  transition: all 0.3s ease;
  color: #333;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    border: 2px solid #333;
    filter: url(#pencil-effect);
  }

  &--primary {
    &::before {
      border-style: solid;
    }
  }

  &:hover {
    transform: scale(1.02);
    
    &::before {
      filter: url(#pencil-effect) blur(0.5px);
    }
  }
}

.menu-button {
  font-family: 'Architects Daughter', cursive;
  color: #333;
  filter: url(#pencil-effect);
  
  svg {
    stroke: currentColor;
    stroke-width: 2;
  }
}
</style>
