<template>
  <div ref="dotsContainer" class="loading-dots-container" :class="customClass"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { createLoadingDots, LoadingDotsAnimationStyle } from '@/animations/loading/loadingDots';

const props = withDefaults(defineProps<{
  dots?: number;
  duration?: number;
  delay?: number;
  dotSize?: number;
  dotColor?: string;
  dotSpacing?: number;
  yOffset?: number;
  loop?: boolean;
  customClass?: string;
  paused?: boolean;
  dotsDisabled?: boolean;  // New property to disable animation
  animationStyle?: LoadingDotsAnimationStyle;
}>(), {
  dots: 3,
  duration: 0.6,
  delay: 0,
  dotSize: 4,
  dotColor: 'currentColor',
  dotSpacing: 4,
  yOffset: 3,
  loop: true,
  customClass: '',
  paused: false,
  dotsDisabled: false,  // Default is false
  animationStyle: 'bounce'
});

const dotsContainer = ref<HTMLElement | null>(null);
let loadingAnimation: ReturnType<typeof createLoadingDots> | null = null;

onMounted(() => {
  if (dotsContainer.value) {
    // Only create animation if not dotsDisabled
    if (!props.dotsDisabled) {
      loadingAnimation = createLoadingDots({
        container: dotsContainer.value,
        dots: props.dots,
        duration: props.duration,
        delay: props.delay,
        dotSize: props.dotSize,
        dotColor: props.dotColor,
        dotSpacing: props.dotSpacing,
        yOffset: props.yOffset,
        loop: props.loop,
        animationStyle: props.animationStyle
      });
      
      if (props.paused) {
        loadingAnimation.pause();
      }
    } else {
      // Just create static dots without animation
      createStaticDots();
    }
  }
});

watch(() => props.paused, (newValue) => {
  if (loadingAnimation) {
    if (newValue) {
      loadingAnimation.pause();
    } else {
      loadingAnimation.resume();
    }
  }
});

watch(() => props.dotColor, (newValue) => {
  if (loadingAnimation) {
    loadingAnimation.setColor(newValue);
  }
});

onBeforeUnmount(() => {
  if (loadingAnimation) {
    loadingAnimation.stop();
  }
});

// Add this new function to create static dots without animation
const createStaticDots = () => {
  if (!dotsContainer.value) return;
  
  // Clear container
  dotsContainer.value.innerHTML = '';
  
  // Create dots container
  const dotsWrapper = document.createElement('div');
  dotsWrapper.className = 'loading-dots';
  dotsWrapper.style.display = 'flex';
  dotsWrapper.style.alignItems = 'center';
  dotsWrapper.style.gap = `${props.dotSpacing}px`;
  
  // Create static dots
  for (let i = 0; i < props.dots; i++) {
    const dot = document.createElement('span');
    dot.className = 'loading-dot';
    dot.style.width = `${props.dotSize}px`;
    dot.style.height = `${props.dotSize}px`;
    dot.style.backgroundColor = props.dotColor;
    dot.style.borderRadius = '50%';
    dot.style.display = 'inline-block';
    
    dotsWrapper.appendChild(dot);
  }
  
  dotsContainer.value.appendChild(dotsWrapper);
};
</script>

<style scoped>
.loading-dots-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
