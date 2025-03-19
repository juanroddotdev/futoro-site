<template>
  <div class="container">
    <h2>Text Animation Examples</h2>
    
    <div class="animation-example">
      <h3>Fade Animation</h3>
      <AnimatedText 
        firstPart="This text" 
        secondPart="fades in" 
        suffix="smoothly" 
        animation="fade"
        :resetKey="resetKeys.fade"
      />
      <button @click="resetKeys.fade++">Reset</button>
    </div>
    
    <div class="animation-example">
      <h3>Typewriter Animation</h3>
      <AnimatedText 
        firstPart="Typing" 
        secondPart="one character" 
        suffix="at a time" 
        animation="typewriter"
        :resetKey="resetKeys.typewriter"
      />
      <button @click="resetKeys.typewriter++">Reset</button>
    </div>
    
    <div class="animation-example">
      <h3>Bounce Animation</h3>
      <AnimatedText 
        firstPart="Bouncy" 
        secondPart="text" 
        suffix="animation" 
        animation="bounce"
        :resetKey="resetKeys.bounce"
      />
      <button @click="resetKeys.bounce++">Reset</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AnimatedText from './AnimatedText.vue';

const resetKeys = ref({
  fade: 0,
  typewriter: 0,
  bounce: 0
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.animation-example {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #2A3FFB;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #1a2fe0;
}
</style>