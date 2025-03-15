<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { struggles } from '@/data/strugglesAndSolutions';
import { icons } from '@/utils/icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollTracker } from '@/utils/scroll/utils/core/ScrollTracker';
import { AnimationPlugin } from '@/utils/scroll/plugins/AnimationPlugin';
import { useElementTracker } from '@/composables/useElementTracker';
import ElementTracker from '@/components/ui/ElementTracker.vue';

gsap.registerPlugin(ScrollTrigger);

// Fix: Initialize ScrollTracker properly with a single instance
const animationPlugin = new AnimationPlugin({ debug: true });
const scrollTracker = new ScrollTracker({
  plugins: [animationPlugin],
  debug: true
});

let scrollTriggerInstance: ScrollTrigger;
const pinWrapRef = ref<HTMLElement | null>(null);
const { position: pinWrapPosition } = useElementTracker(pinWrapRef, {
  throttleMs: 16, // ~60fps for smoother updates
  debug: true,
  offset: { top: 100, bottom: 100 } // Larger offset to detect earlier
});

// Debug function to log pin-wrap position
const logPinWrapPosition = () => {
  if (!pinWrapPosition.value) {
    console.log('Pin-wrap position not available yet');
    return;
  }
  
  console.log('Pin-wrap position:', {
    top: pinWrapPosition.value.top,
    inView: pinWrapPosition.value.inView,
    progress: pinWrapPosition.value.progress,
    height: pinWrapPosition.value.height
  });
};

onMounted(() => {
  // Wait a bit for DOM to be ready
  setTimeout(() => {
    const section = document.querySelector('section.horizontal-struggles');
    pinWrapRef.value = section?.querySelector('.pin-wrap') as HTMLElement;
    const animWrap = pinWrapRef.value?.querySelector('.animation-wrap');
    
    if (section && pinWrapRef.value && animWrap) {
      // Calculate the total width needed for all items to be visible
      const lastItem = animWrap.querySelector('.item:last-child');
      const lastItemWidth = lastItem ? lastItem.getBoundingClientRect().width : 0;
      const extraSpace = window.innerWidth - lastItemWidth;
      const getToValue = () => -(animWrap.scrollWidth - window.innerWidth + extraSpace);
      
      // Use ScrollTrigger with sticky positioning
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => "+=" + (animWrap.scrollWidth + extraSpace),
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        scrub: 1,
        markers: true,
        pinReparent: false, // Don't reparent the pinned element
        onUpdate: (self) => {
          // Update animation with eased progress for smoother movement
          gsap.set(animWrap, { 
            x: self.progress * getToValue() 
          });
          
          // Track progress for debugging
          scrollTracker.trackProgress(self.progress, {
            element: section as HTMLElement,
            id: 'horizontalScroll',
            threshold: 0.99,
            logEvents: true
          });
          
          // Log pin-wrap position for debugging
          logPinWrapPosition();
        },
        onLeave: () => {
          // When the end marker is reached, add a class to keep the section in place
          section.classList.add('pin-complete');
        },
        onEnterBack: () => {
          // When scrolling back into the section, remove the class
          section.classList.remove('pin-complete');
        }
      });
    }
  }, 100);
});

onBeforeUnmount(() => {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
  }
  
  // Reset any inline styles that might cause jumps
  if (pinWrapRef.value) {
    gsap.set(pinWrapRef.value, { clearProps: "all" });
  }
});
</script>

<template>
  <section class="horizontal-struggles section py-16">
    <div class="pin-wrap" ref="pinWrapRef">
      <div class="animation-wrap to-right">
        <!-- Title card -->
        <div class="item title-card">
          <h2 class="heading-responsive gradient-text">Common Hurdles</h2>
        </div>
        
        <!-- Struggle cards -->
        <div 
          v-for="(struggle, index) in struggles" 
          :key="struggle.id"
          class="item struggle-card group hover-card"
        >
          <span 
            class="absolute right-0 bottom-0 w-32 h-32 flex items-center justify-center transform translate-x-6 translate-y-6 theme-text--secondary icon-imprint"
            v-html="icons.struggle[Object.keys(icons.struggle)[index % Object.keys(icons.struggle).length]]"
          ></span>
          <div class="relative z-10">
            <h3 class="text-md font-semibold gradient-text mb-3">
              {{ struggle.title }}
            </h3>
            <p class="theme-text--neutral">{{ struggle.description }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Element tracker for pin-wrap - positioned on the right -->
    <ElementTracker 
      targetSelector=".pin-wrap" 
      :showMarker="true" 
      :showInfo="true" 
      color="#42b883"
      position="right"
      :offset="10"
    />
    
    <!-- Element tracker for section - positioned on the left -->
    <ElementTracker 
      targetSelector="section.horizontal-struggles" 
      :showMarker="true" 
      :showInfo="true" 
      color="#ff5722"
      position="left"
      :offset="10"
    />
  </section>
</template>

<style lang="scss" scoped>
@import '@/scss/abstracts/variables';

section.horizontal-struggles {
  overflow-x: hidden;
  
  // When pinning is complete, keep the section in its final position
  &.pin-complete {
    position: relative;
    // This will ensure it stays in its final position
    transform: none !important;
  }
  
  .pin-wrap {
    position: relative;
    z-index: 1;
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }
  
  .animation-wrap {
    display: flex;
    position: relative;
    height: 100%;
    will-change: transform;
  }
  
  .item {
    position: relative;
    padding: 40px;
    flex: 0 0 500px;
    height: calc(100vh - 300px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.7;
    user-select: none;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
    background-color: transparent;
    overflow: hidden;
    margin: auto 0;
  }
  
  .title-card {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .struggle-card {
    position: relative;
    
    .icon-imprint {
      opacity: 0.1;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      .icon-imprint {
        opacity: 0.2;
      }
    }
  }
}
</style>