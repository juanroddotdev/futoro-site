<template>
  <div class="delay-test">
    <h2>Delay Test</h2>
    
    <div class="test-case">
      <h3>No Delay (0s)</h3>
      <AnimatedText 
        firstPart="Immediate" 
        secondPart="animation" 
        animation="fade"
        :delay="0"
      />
    </div>
    
    <div class="test-case">
      <h3>Short Delay (1s)</h3>
      <AnimatedText 
        firstPart="Short" 
        secondPart="delay" 
        animation="fade"
        :delay="1"
      />
    </div>
    
    <div class="test-case">
      <h3>Long Delay (3s)</h3>
      <AnimatedText 
        firstPart="Long" 
        secondPart="delay" 
        animation="fade"
        :delay="3"
      />
    </div>
    
    <button @click="resetAll">Reset All</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AnimatedText from './AnimatedText.vue';

const resetKey = ref(0);

function resetAll() {
  resetKey.value++;
}
</script>

<style scoped>
.delay-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.test-case {
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
</style>