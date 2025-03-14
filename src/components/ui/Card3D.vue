<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

const props = defineProps<{
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  currentTheme?: string;
}>();

const card = ref<HTMLElement | null>(null);
const bounds = ref<DOMRect | null>(null);
const mousePosition = ref({ x: 0, y: 0 });
const isHovering = ref(false);

const rotateToMouse = (e: MouseEvent) => {
  if (!bounds.value || !isHovering.value) return;
  
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const leftX = mouseX - bounds.value.x;
  const topY = mouseY - bounds.value.y;
  const center = {
    x: leftX - bounds.value.width / 2,
    y: topY - bounds.value.height / 2
  };
  
  mousePosition.value = center;
};

const handleMouseEnter = () => {
  isHovering.value = true;
  if (card.value) {
    bounds.value = card.value.getBoundingClientRect();
  }
};

const handleMouseLeave = () => {
  isHovering.value = false;
  mousePosition.value = { x: 0, y: 0 };
};

const updateBounds = () => {
  if (card.value) {
    bounds.value = card.value.getBoundingClientRect();
  }
};

onMounted(() => {
  updateBounds();
  window.addEventListener('resize', updateBounds);
  
  // Initial GSAP setup - set starting state
  gsap.set(card.value, {
    opacity: 0,
    y: 30,
    rotateX: 5,
    rotateY: -5
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', updateBounds);
});
</script>

<template>
  <div 
    ref="card" 
    class="card-3d"
    :class="[currentTheme ? `theme-${currentTheme}` : '']"
    @mousemove="rotateToMouse"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :style="{
      transform: isHovering ? 
        `rotateX(${mousePosition.y / 10}deg) rotateY(${-mousePosition.x / 10}deg)` : 
        'rotateX(0deg) rotateY(0deg)'
    }"
  >
    <div class="card-3d__content">
      <div 
        class="card-3d__image"
        :style="{ backgroundImage: `url(${imageUrl || ''})` }"
      ></div>
      <div class="card-3d__info">
        <h3 class="card-3d__title">{{ title || 'Card Title' }}</h3>
        <p class="card-3d__subtitle">{{ subtitle || 'Card Subtitle' }}</p>
        <a 
          v-if="linkUrl" 
          :href="linkUrl" 
          class="card-3d__link"
        >
          {{ linkText || 'Learn More' }}
        </a>
      </div>
    </div>
    <div 
      class="card-3d__shine"
      :style="{
        background: isHovering ? 
          `radial-gradient(
            circle at ${mousePosition.x + bounds?.width / 2}px ${mousePosition.y + bounds?.height / 2}px, 
            rgba(255, 255, 255, 0.2), 
            rgba(255, 255, 255, 0) 40%
          )` : ''
      }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/playground/components/_card-3d-showcase.scss';
</style>