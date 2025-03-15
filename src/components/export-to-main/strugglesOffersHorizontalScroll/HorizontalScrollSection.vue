<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

// Define props
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  titleCardText: {
    type: String,
    default: 'Section Title'
  },
  initialDirection: {
    type: String,
    default: 'normal' // 'normal' or 'reverse'
  },
  startInMiddle: {
    type: Boolean,
    default: false
  }
});

// Refs for DOM elements
const sectionRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const animWrapRef = ref<HTMLElement | null>(null);
const isFixed = ref(false);
const progress = ref(0);

// Computed styles
const transformStyle = computed(() => {
  if (!animWrapRef.value) return '';
  
  const direction = props.initialDirection === 'reverse' ? 1 : -1;
  const maxScroll = animWrapRef.value.scrollWidth - window.innerWidth;
  return `translateX(${progress.value * direction * maxScroll}px)`;
});

// Scroll handling
let observer: IntersectionObserver | null = null;
let scrollListener: (() => void) | null = null;

onMounted(() => {
  if (!sectionRef.value || !containerRef.value || !animWrapRef.value) return;
  
  // Set initial position if startInMiddle is true
  if (props.startInMiddle && animWrapRef.value) {
    progress.value = 0.5;
  }
  
  // Create intersection observer to detect when section is in view
  observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      isFixed.value = true;
    } else {
      isFixed.value = entry.boundingClientRect.top > 0;
    }
  }, { threshold: 0.1 });
  
  observer.observe(sectionRef.value);
  
  // Add scroll listener
  scrollListener = () => {
    if (!sectionRef.value) return;
    
    const rect = sectionRef.value.getBoundingClientRect();
    const sectionHeight = sectionRef.value.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // Calculate scroll progress (0 to 1)
    const scrollStart = -rect.top;
    const scrollEnd = sectionHeight - viewportHeight;
    progress.value = Math.max(0, Math.min(1, scrollStart / scrollEnd));
  };
  
  window.addEventListener('scroll', scrollListener);
  
  // Initial calculation
  if (scrollListener) scrollListener();
});

onBeforeUnmount(() => {
  // Clean up
  if (observer) {
    observer.disconnect();
  }
  
  if (scrollListener) {
    window.removeEventListener('scroll', scrollListener);
  }
});
</script>

<template>
  <section ref="sectionRef" class="horizontal-scroll-section" :class="{ 'reverse': initialDirection === 'reverse' }">
    <div ref="containerRef" class="container" :class="{ 'is-fixed': isFixed }">
      <div class="row">
        <div 
          ref="animWrapRef" 
          class="animation-wrap"
          :class="{ 'to-left': initialDirection === 'reverse', 'to-right': initialDirection === 'normal' }"
          :style="{ transform: transformStyle }"
        >
          <!-- Title card -->
          <div class="item title-card">
            <slot name="titleCard">
              <h3 class="heading-responsive">{{ titleCardText }}</h3>
            </slot>
          </div>
          
          <!-- Content cards - normal direction -->
          <template v-if="initialDirection === 'normal'">
            <slot name="items"></slot>
          </template>
          
          <!-- Content cards - reverse direction -->
          <template v-else>
            <slot name="items-reversed"></slot>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.horizontal-scroll-section {
  position: relative;
  min-height: 200vh;
  overflow-x: hidden;
  z-index: 1;
  
  .container {
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    
    &.is-fixed {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
    }
  }
  
  .row {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
  }
  
  .animation-wrap {
    display: flex;
    position: relative;
    height: 100%;
    width: max-content;
    min-width: 200%;
    align-items: center;
    padding: 0 5vw;
    will-change: transform;
    
    &.to-right {
      flex-direction: row;
    }
    
    &.to-left {
      flex-direction: row-reverse;
    }
  }
  
  .item {
    position: relative;
    flex: 0 0 500px;
    height: 60vh;
    max-height: 600px;
    margin: 0 2rem;
    padding: 2rem;
    border-radius: 0.5rem;
    background-color: var(--theme-card-background, rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    &.title-card {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      box-shadow: none;
      backdrop-filter: none;
    }
  }
  
  // Styles for hover effects
  .hover-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>