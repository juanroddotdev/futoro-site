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
  animationStyle: 'bounce'
});

const dotsContainer = ref<HTMLElement | null>(null);
let loadingAnimation: ReturnType<typeof createLoadingDots> | null = null;

onMounted(() => {
  if (dotsContainer.value) {
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
</script>

<style scoped>
.loading-dots-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
