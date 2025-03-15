<template>
  <div class="text-animations-demo">
    <h1 class="text-4xl font-bold mb-8 text-center">Text Animations Demo</h1>
    
    <div class="grid grid-cols-1 gap-8">
      <!-- Split Animation -->
      <div class="animation-card">
        <button @click="(e) => resetSingleAnimation(e, 'split')" class="reset-button" title="Reset animation">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
        </button>
        <h3 class="text-xl mb-4 theme-text--gradient">Split Animation</h3>
        <AnimatedText 
          :resetKey="resetKeys.split"
          firstPart="Split" 
          secondPart="Animation" 
          suffix=": Smooth Entry" 
          animation="split" />
      </div>
      
      <!-- Fade Animation -->
      <div class="animation-card">
        <button @click="(e) => resetSingleAnimation(e, 'fade')" class="reset-button" title="Reset animation">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
        </button>
        <h3 class="text-xl mb-4 theme-text--gradient">Fade Animation</h3>
        <AnimatedText 
          :resetKey="resetKeys.fade"
          firstPart="Fade" 
          secondPart="Animation" 
          suffix=": Simple Fade" 
          animation="fade" />
      </div>
      
      <!-- Typewriter Animation -->
      <div class="animation-card">
        <button @click="(e) => resetSingleAnimation(e, 'typewriter')" class="reset-button" title="Reset animation">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
        </button>
        <h3 class="text-xl mb-4 theme-text--gradient">Typewriter Animation</h3>
        <AnimatedText 
          :resetKey="resetKeys.typewriter"
          firstPart="Typewriter" 
          secondPart="Animation" 
          suffix=": Character by Character" 
          animation="typewriter" />
      </div>
      
      <!-- Bounce Animation -->
      <div class="animation-card">
        <button @click="(e) => resetSingleAnimation(e, 'bounce')" class="reset-button" title="Reset animation">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
        </button>
        <h3 class="text-xl mb-4 theme-text--gradient">Bounce Animation</h3>
        <AnimatedText 
          :resetKey="resetKeys.bounce"
          firstPart="Bounce" 
          secondPart="Animation" 
          suffix=": With Elasticity" 
          animation="bounce" />
      </div>
      
      <!-- Rotate Animation -->
      <div class="animation-card">
        <button @click="(e) => resetSingleAnimation(e, 'rotate')" class="reset-button" title="Reset animation">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
        </button>
        <h3 class="text-xl mb-4 theme-text--gradient">3D Rotate Animation</h3>
        <AnimatedText 
          :resetKey="resetKeys.rotate"
          firstPart="Rotate" 
          secondPart="Animation" 
          suffix=": 3D Effect" 
          animation="rotate" />
      </div>
      
      <!-- Glitch Animation -->
      <div class="animation-card">
        <button @click="(e) => resetSingleAnimation(e, 'glitch')" class="reset-button" title="Reset animation">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
        </button>
        <h3 class="text-xl mb-4 theme-text--gradient">Glitch Animation</h3>
        <AnimatedText 
          :resetKey="resetKeys.glitch"
          firstPart="Glitch" 
          secondPart="Animation" 
          suffix=": Digital Distortion" 
          animation="glitch" />
      </div>
      
      <!-- Shake Animation -->
      <div class="animation-card">
        <button @click="(e) => resetSingleAnimation(e, 'shake')" class="reset-button" title="Reset animation">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
        </button>
        <h3 class="text-xl mb-4 theme-text--gradient">Shake Animation</h3>
        <AnimatedText 
          :resetKey="resetKeys.shake"
          firstPart="Shake" 
          secondPart="Animation" 
          suffix=": Progressive Intensity" 
          animation="shake" />
      </div>
      
      <!-- Scramble Animation -->
      <div class="animation-card">
        <button @click="(e) => resetSingleAnimation(e, 'scramble')" class="reset-button" title="Reset animation">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
        </button>
        <h3 class="text-xl mb-4 theme-text--gradient">Scramble Animation</h3>
        <AnimatedText 
          :resetKey="resetKeys.scramble"
          firstPart="Scramble" 
          secondPart="Animation" 
          suffix=": Random Characters" 
          animation="scramble" />
      </div>
      
      <!-- Single Text Demo -->
      <div class="animation-card">
        <button @click="(e) => resetSingleAnimation(e, 'single')" class="reset-button" title="Reset animation">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
        </button>
        <h3 class="text-xl mb-4 theme-text--gradient">Single Text Demo</h3>
        <AnimatedText 
          :resetKey="resetKeys.single"
          firstPart="Just This Text" 
          animation="shake" />
      </div>
      
      <!-- Gradient Text Demo -->
      <div class="animation-card">
        <button @click="(e) => resetSingleAnimation(e, 'gradient')" class="reset-button" title="Reset animation">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
        </button>
        <h3 class="text-xl mb-4 theme-text--gradient">Gradient Text</h3>
        <AnimatedText 
          :resetKey="resetKeys.gradient"
          firstPart="Gradient" 
          secondPart="Text" 
          suffix=": Colorful" 
          animation="fade"
          useGradient />
      </div>
    </div>
    
    <div class="mt-12 text-center">
      <button @click="resetAnimations" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Reset All Animations
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AnimatedText from '@/components/text/AnimatedText.vue';

// Create a reactive object to store reset keys for each animation
const resetKeys = ref({
  split: 0,
  fade: 0,
  bounce: 0,
  rotate: 0,
  glitch: 0,
  shake: 0,
  scramble: 0,
  single: 0
});

const resetAnimations = () => {
  // Force component re-render by changing the key
  window.location.reload();
};

const resetSingleAnimation = (event: MouseEvent, animationType: string) => {
  // Get the parent animation card
  const button = event.currentTarget as HTMLButtonElement;
  
  // Increment the reset key for this animation type
  resetKeys.value[animationType as keyof typeof resetKeys.value]++;
  
  // Add a small animation to indicate reset
  button.classList.add('reset-spin');
  setTimeout(() => {
    button.classList.remove('reset-spin');
  }, 500);
};
</script>

<style scoped>
.text-animations-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.animation-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
  margin-bottom: 2rem;
  position: relative;
}

.reset-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  color: #666;
}

.reset-button:hover {
  background-color: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.reset-spin {
  animation: spin 0.5s ease;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.theme-text--gradient {
  background: linear-gradient(90deg, #4f46e5, #06b6d4);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>