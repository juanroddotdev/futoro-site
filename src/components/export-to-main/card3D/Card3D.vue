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
.card-3d {
  position: relative;
  width: 300px;
  height: 400px;
  border-radius: 20px;
  perspective: 1000px;
  transform-style: preserve-3d;
  transform: rotateX(0deg) rotateY(0deg);
  transition: transform 0.1s ease;
  overflow: hidden;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2);
  
  &__content {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform: translateZ(0);
    border-radius: 20px;
    overflow: hidden;
  }
  
  &__image {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transform: translateZ(0);
    transition: transform 0.3s ease;
  }
  
  &__info {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
    color: white;
    transform: translateZ(20px);
  }
  
  &__title {
    margin: 0 0 5px;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  &__subtitle {
    margin: 0 0 15px;
    font-size: 1rem;
    opacity: 0.8;
  }
  
  &__link {
    display: inline-block;
    padding: 8px 16px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    backdrop-filter: blur(5px);
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
  
  &__shine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 40%);
    pointer-events: none;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    .card-3d__shine {
      opacity: 1;
    }
    
    .card-3d__image {
      transform: scale(1.05) translateZ(0);
    }
  }
  
  // Theme integration
  // @each $theme-name, $theme-map in $themes {
  //   &.theme-#{$theme-name} {
  //     .card-3d__link {
  //       background-color: rgba(map-get($theme-map, 'accent'), 0.8);
        
  //       &:hover {
  //         background-color: rgba(map-get($theme-map, 'accent'), 1);
  //       }
  //     }
  //   }
  // }
}
</style>