<template>
  <div ref="containerRef" class="spotlight-text" :style="containerStyle">
    <OutlineToFillText 
      :text="text"
      :fillPercentage="fillPercentage"
      :spotlightEnabled="true"
      :spotlightX="spotlightX"
      :spotlightY="spotlightY"
      :width="width"
      :textAlign="textAlign"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch, onMounted, onUnmounted, computed } from 'vue';
import OutlineToFillText from '@/components/text/OutlineToFillText.vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  animated: {
    type: Boolean,
    default: false
  },
  width: {
    type: [String, Number],
    default: 'auto'
  },
  textAlign: {
    type: String,
    default: 'left'
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
});

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

// Container style with width support
const containerStyle = computed(() => {
  if (props.fullWidth) {
    return { width: '100%', display: 'block', textAlign: props.textAlign };
  }
  
  const styles: Record<string, string> = {};
  
  if (props.width !== 'auto') {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
    styles.display = 'block';
  }
  
  return styles;
});

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
