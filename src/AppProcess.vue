<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/components/layout/Navbar.vue';
import Hero from '@/components/the-process/Hero.vue';

// Simplified version for wireframe prototype
const currentTheme = ref('theme-wireframe');
</script>

<template>
  <div id="app">
    <div 
      class="app min-h-screen relative" 
      :class="currentTheme"
    >
      <Navbar />
      <div class="main-content">
        <Hero />
      </div>
      <footer class="footer border-t-2 border-gray-200 mt-20">
        <div class="footer-content p-4 text-center">
          <p class="body-text text-gray-600">© {{ new Date().getFullYear() }} Futoro Digital Design Lab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<style lang="scss">
// Import base styles
@import '@/scss/layout/app';

// Wireframe-specific styles
:root {
  --wireframe-primary: #333333;
  --wireframe-secondary: #666666;
  --wireframe-background: #ffffff;
  --wireframe-grid: #e6e6e6;
}

.theme-wireframe {
  background-color: var(--wireframe-background);
  color: var(--wireframe-primary);
  
  // Add grid background to the entire app
  background-image: 
    linear-gradient(90deg, var(--wireframe-grid) 1px, transparent 1px),
    linear-gradient(var(--wireframe-grid) 1px, transparent 1px);
  background-size: 20px 20px;
}

// Override some default styles for wireframe look
.navbar, .footer {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
}

.body-text {
  font-family: 'Architects Daughter', cursive;
}
</style>
