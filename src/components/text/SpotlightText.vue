<template>
  <div ref="containerRef" class="spotlight-text">
    <OutlineToFillText 
      :text="text"
      :fillPercentage="fillPercentage"
      :spotlightEnabled="true"
      :spotlightX="spotlightX"
      :spotlightY="spotlightY"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch, onMounted, onUnmounted } from 'vue';
import OutlineToFillText from '@/components/text/OutlineToFillText.vue';

const props = defineProps<{
  text: string;
  animated?: boolean;
}>();

// Get spotlight context from provider
const spotlight = inject('spotlight', {
  spotlightX: ref(50),
  spotlightY: ref(50),
  followMouse: ref(false),
  calculateFillPercentage: () => 0
});

const { spotlightX, spotlightY, calculateFillPercentage } = spotlight;
const containerRef = ref<HTMLElement | null>(null);
const fillPercentage = ref(0);

// Update fill percentage based on position
const updateFillPercentage = () => {
  fillPercentage.value = calculateFillPercentage(containerRef);
};

// Watch for spotlight position changes
watch([spotlightX, spotlightY], () => {
  updateFillPercentage();
});

// Set up intersection observer to only calculate when visible
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      updateFillPercentage();
      // Add event listeners when visible
      window.addEventListener('resize', updateFillPercentage);
      window.addEventListener('scroll', updateFillPercentage);
    } else {
      // Remove event listeners when not visible
      window.removeEventListener('resize', updateFillPercentage);
      window.removeEventListener('scroll', updateFillPercentage);
    }
  });
  
  if (containerRef.value) {
    observer.observe(containerRef.value);
  }
  
  return () => {
    if (containerRef.value) {
      observer.unobserve(containerRef.value);
    }
    window.removeEventListener('resize', updateFillPercentage);
    window.removeEventListener('scroll', updateFillPercentage);
  };
});
</script>

<style scoped>
.spotlight-text {
  position: relative;
  display: inline-block;
}
</style>