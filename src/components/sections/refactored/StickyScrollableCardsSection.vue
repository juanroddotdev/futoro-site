<template>
  <StickySectionContainer
    :id="props.sectionId"
    ref="sectionRef"
    :height="computedContainerHeight"
    position="top"
    :offset="0"
    :zIndex="2"
    :debug="false"
    class="horizontal-scroll-section"
  >
    <div class="header-container" :class="headerContainerClass">
      <AnimatedText 
        class="section-title gradient-text"
        :firstPart="title"  
        :animation="titleAnimation"
        :useGradient="true" 
        :duration="3" 
        :initiallyHidden="true"
      />
    </div>
    <div class="container">
      <div class="animation-wrap" :id="containerId" ref="scrollContainer">
        <div v-if="!reverseLayout" class="item title-card">
          <!-- placeholder card -->
        </div>
        <div 
          class="item hover-card-themed p-6 relative overflow-hidden"
          :class="cardClass"
          v-for="item in items" 
          :key="`${sectionId}-${item.id}`"
        >
          <div class="relative z-10">
            <h3 class="text-md font-semibold gradient-text mb-3">{{ item.title }}</h3>
            <p class="theme-text--neutral">{{ item.description }}</p>
          </div>
        </div>
        <div v-if="reverseLayout" class="item title-card">
          <!-- placeholder card -->
        </div>
      </div>
    </div>
  </StickySectionContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import StickySectionContainer from '@/components/ui/containers/StickySectionContainer.vue';
import { calculateContainerHeight } from '@/utils/containerHeightUtils';
// import { useStickyScrollableCardsDebug } from '@/debug/StickyScrollableCardsDebug';

interface Item {
  id: number;
  title: string;
  description: string;
}

interface Props {
  sectionId: string;
  containerId: string;
  title: string;
  items: Item[];
  sectionClass?: string;
  cardClass?: string;
  headerContainerClass?: string;
  titleAnimation?: string;
  reverseLayout?: boolean;
  containerHeight?: string;
  debug?: boolean;
  heightMultiplier?: number;
}

const props = withDefaults(defineProps<Props>(), {
  sectionClass: '',
  cardClass: '',
  headerContainerClass: '',
  titleAnimation: 'slideInRight',
  reverseLayout: false,
  containerHeight: '200vh',
  debug: false,
  heightMultiplier: 1.2
});

// Add scroll functionality
const sectionRef = ref<HTMLElement | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);
const animationWrap = ref<HTMLElement | null>(null);
let scrollWidth = 0;
let observer: IntersectionObserver | null = null;

// Track scroll progress for debugging
const scrollProgress = ref(0);

// Add computed property for container height
const computedContainerHeight = computed(() => {
  if (props.containerHeight) {
    return props.containerHeight;
  }
  return calculateContainerHeight(props.items.length, {
    baseHeight: 100,
    itemHeight: 50,
    padding: 100,
    heightMultiplier: props.heightMultiplier || 1.2
  });
});

onMounted(() => {
  if (scrollContainer.value) {
    // Calculate scrollable width
    scrollWidth = scrollContainer.value.scrollWidth - window.innerWidth + 100; // Adding padding
    
    // Set up intersection observer
    observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        document.body.classList.add('horizontal-scroll-active');
        window.addEventListener('scroll', handleScroll);
      } else {
        document.body.classList.remove('horizontal-scroll-active');
        window.removeEventListener('scroll', handleScroll);
      }
    }, { threshold: 0.1 });
    
    // Observe the container
    const sectionElement = document.getElementById(props.sectionId);
    if (sectionElement) {
      observer.observe(sectionElement);
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (observer) {
    observer.disconnect();
  }
});

function handleScroll() {
  const sectionElement = document.getElementById(props.sectionId);
  if (!sectionElement || !scrollContainer.value) return;
  
  const rect = sectionElement.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, 
    -rect.top / (sectionElement.offsetHeight - window.innerHeight)
  ));
  
  // Apply transform based on scroll progress
  const transformValue = progress * scrollWidth;
  scrollContainer.value.style.transform = `translateX(-${transformValue}px)`;
}



</script>

<style lang="scss" scoped>
@import '@/scss/components/_horizontal-scroll.scss';
@import '@/scss/components/_hurdles-solutions.scss';

// Additional styles to ensure horizontal layout
.horizontal-scroll-section {
  .container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    background-color: transparent; // Changed to transparent
  }
  .header-container {
        position: absolute;
        z-index: 1;
        padding: 4px 20px;
        bottom:  220px;
        .section-title {
          font-size: 4.5rem;
          margin-block: 0;
          text-align: center;
        }

        
        // Use the tapered-blur mixin
        @include tapered-blur(5px, -20px);

        &--hurdles {
          margin-inline: 0 50px;
          right: 50px;
        }
        &--solutions {
          /* right: 0; */
          margin-inline: 0 50px;
          left: 50px;
        }
      }
  
  .animation-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 2rem;
    min-width: max-content;
    transition: transform 0.1s ease-out;
    
    // Match the styling from _hurdles-solutions.scss
    .item {
      flex: 0 0 auto;
      max-width: 340px;
      min-width: 300px;
      height: 380px;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      will-change: transform, opacity;
      backface-visibility: hidden;
      margin: 0 1rem;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
      }
      
      h3 {
        font-size: 1.5rem;
        margin-bottom: 0;
        margin-top: 0;
      }
      
      p {
        font-size: 1.2rem;
        line-height: 1.5;
      }
      
      &.title-card {
        width: 350px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        background: transparent;
        box-shadow: none;
        border: none;
      }
    }
  }
}

// Add a class to help identify the sticky version
.sticky-version {
  position: relative;
  background: transparent; // Added transparent background
  
  &::after {
    content: "Sticky Version";
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10;
  }
}
</style>
