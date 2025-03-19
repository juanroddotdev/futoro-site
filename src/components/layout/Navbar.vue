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
          <a href="#about" class="navbar__link">About</a>
          <a href="#services" class="navbar__link">Services</a>
          <a href="#portfolio" class="navbar__link">Portfolio</a>
          <a href="#contact" class="navbar__cta" :class="[
            isScrolled ? 'navbar__cta--small' : 'navbar__cta--large'
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
// @import '../scss/abstracts/variables';
// @import '../scss/abstracts/mixins';

// .navbar {
//   position: fixed;
//   width: 100%;
//   z-index: 50;
//   transition: all 0.3s ease;
//   transform-origin: top;
  
//   &--default {
//     height: 6rem; // 24px equivalent
    
//     @each $theme-name, $theme-map in $themes {
//       .theme-#{$theme-name} & {
//         background-color: map-get($theme-map, 'primary');
//       }
//     }
//   }
  
//   &--scrolled {
//     height: 4rem; // 16px equivalent
//     backdrop-filter: blur(8px);
    
//     @each $theme-name, $theme-map in $themes {
//       .theme-#{$theme-name} & {
//         background-color: rgba(map-get($theme-map, 'primary'), 0.8);
//       }
//     }
//   }
  
//   &--visible {
//     transform: translateY(0);
//   }
  
//   &--hidden {
//     transform: translateY(-100%);
//   }
  
//   &__container {
//     max-width: 80rem; // 1280px
//     margin: 0 auto;
//     padding: 0 1rem;
//     height: 100%;
    
//     @include respond-to('md') {
//       padding: 0 2rem;
//     }
//   }
  
//   &__content {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     height: 100%;
//   }
  
//   &__logo {
//     font-weight: 700;
//     color: map-get($colors, 'neutral-100');
//     transition: all 0.3s ease;
    
//     &--large {
//       font-size: 1.5rem; // 24px
//     }
    
//     &--small {
//       font-size: 1.25rem; // 20px
//     }
//   }
  
//   &__links {
//     display: none;
    
//     @include respond-to('md') {
//       display: flex;
//       align-items: center;
//       gap: 2rem;
//     }
//   }
  
//   &__link {
//     color: map-get($colors, 'neutral-100');
//     font-weight: 500;
//     transition: color 0.3s ease;
    
//     &:hover {
//       color: map-get($colors, 'secondary');
//     }
//   }
  
//   &__cta {
//     font-weight: 500;
//     border: 3px solid;
//     transition: all 0.3s ease;
    
//     @each $theme-name, $theme-map in $themes {
//       .theme-#{$theme-name} & {
//         color: map-get($theme-map, 'neutral');
//         border-color: map-get($theme-map, 'neutral');
        
//         &:hover {
//           color: map-get($theme-map, 'secondary');
//           border-color: map-get($theme-map, 'secondary');
//         }
//       }
//     }
    
//     &--large {
//       padding: 0.75rem 1.5rem;
//       font-size: 1rem;
//     }
    
//     &--small {
//       padding: 0.5rem 1rem;
//       font-size: 0.875rem;
//     }
//   }
  
//   &__mobile-toggle {
//     display: block;
//     color: map-get($colors, 'neutral-100');
    
//     @include respond-to('md') {
//       display: none;
//     }
//   }
// }
</style>
