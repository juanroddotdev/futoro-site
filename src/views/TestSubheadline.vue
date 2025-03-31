<template>
  <div class="test-subheadline-view">
    <div class="test-env-indicator">TEST ENVIRONMENT</div>
    <AnimatedSubheadline
      text="Welcome to our creative digital journey. Let's make something amazing together."
      :showDebug="true"
      @complete="onAnimationComplete"
    />
  </div>
</template>

<script setup lang="ts">
import AnimatedSubheadline from '@/components/text/AnimatedSubheadline.vue';

const onAnimationComplete = () => {
  console.log('Animation completed!');
};
</script>

<style scoped>
.test-subheadline-view {
  min-height: 100vh;
  width: 100%;
  background: rgb(17, 24, 39);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.test-env-indicator {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 50;
}
</style> 