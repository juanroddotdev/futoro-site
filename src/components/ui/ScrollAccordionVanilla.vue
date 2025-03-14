<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';

interface AccordionItem {
  id: number;
  title: string;
  description: string;
}

defineProps<{
  items: AccordionItem[];
}>();

const accordionsRef = ref<HTMLElement | null>(null);
const placeholderRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;
let scrollListener: (() => void) | null = null;
let isPinned = false;
let startPosition = 0;
let endPosition = 0;
let accordionHeight = 0;
let scrollProgress = 0;
let resizeListener: (() => void) | null = null;
let rect: DOMRect;
let scrollAccordionEl: HTMLElement | null = null;

// Add a function to create height markers


// Add a function to update the current scroll position marker


onMounted(() => {
  if (!accordionsRef.value) return;
  
  // Remove transition for smoother sticky behavior
  // accordionsRef.value.style.transition = 'top 0.3s ease';
  
  scrollAccordionEl = accordionsRef.value.closest('.scroll-accordion') as HTMLElement;
  if (!scrollAccordionEl) return;
  
  // Get dimensions and positions
  rect = accordionsRef.value.getBoundingClientRect();
  startPosition = window.scrollY + rect.top - window.innerHeight * 0.1; // 10% from top
  endPosition = startPosition + rect.height * 2; // Adjust this multiplier as needed
  accordionHeight = rect.height;
  
  // Apply sticky positioning instead of fixed
  accordionsRef.value.style.position = 'sticky';
  accordionsRef.value.style.top = '10%';
  
  // Create intersection observer to detect when element enters viewport
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Add scroll listener when element is in view
      if (!scrollListener) {
        scrollListener = handleScroll;
        window.addEventListener('scroll', scrollListener);
      }
    } else {
      // Remove scroll listener when element is out of view
      if (scrollListener) {
        window.removeEventListener('scroll', scrollListener);
        scrollListener = null;
      }
    }
  }, { threshold: 0.1 });
  
  observer.observe(scrollAccordionEl);
  
  // Initial check
  handleScroll();
  
});

function handleScroll() {
  const currentScroll = window.scrollY;
  if (!scrollAccordionEl || !accordionsRef.value) return;
  
  // Remove the call to updateScrollPositionMarker
  // updateScrollPositionMarker();
  
  // Calculate scroll progress (0 to 1)
  if (currentScroll >= startPosition && currentScroll <= endPosition) {
    scrollProgress = (currentScroll - startPosition) / (endPosition - startPosition);
    animateAccordions(scrollProgress);
  } else if (currentScroll > endPosition) {
    // Animation is complete
    animateAccordions(1);
  } else {
    // We're above the start position
    animateAccordions(0);
  }
}

function animateAccordions(progress: number) {
  if (!scrollAccordionEl) return;
  
  // Get all accordion text elements
  const textElements = scrollAccordionEl.querySelectorAll('.accordion .text') as NodeListOf<HTMLElement>;
  const accordionElements = scrollAccordionEl.querySelectorAll('.accordion') as NodeListOf<HTMLElement>;
  const totalAccordions = accordionElements.length;
  
  // Track if the last accordion is closed
  let lastAccordionProgress = 0;
  
  // Animate text elements (height and opacity)
  textElements.forEach((text, index) => {
    // Calculate individual progress for each accordion
    // This ensures each accordion gets its own segment of the scroll range
    const segmentSize = 1 / totalAccordions;
    const segmentStart = index * segmentSize;
    
    // Map the overall progress to this accordion's segment
    let accordionProgress = 0;
    if (progress > segmentStart) {
      accordionProgress = Math.min(1, (progress - segmentStart) / segmentSize);
    }
    
    // Track the last accordion's progress
    if (index === totalAccordions - 1) {
      lastAccordionProgress = accordionProgress;
      
      // Log when the last accordion is fully closed (progress = 1)
      if (accordionProgress >= 0.99 && !text.dataset.fullyClosed) {
        console.log('Last accordion item is now fully closed!', {
          overallProgress: progress,
          lastItemProgress: accordionProgress,
          timestamp: new Date().toISOString()
        });
        text.dataset.fullyClosed = 'true';
      } else if (accordionProgress < 0.99 && text.dataset.fullyClosed) {
        // Reset the flag if we scroll back up
        delete text.dataset.fullyClosed;
      }
    }
    
    // Calculate height (from original to 0)
    const originalHeight = parseInt(text.dataset.originalHeight || '0');
    if (!text.dataset.originalHeight && accordionProgress === 0) {
      text.dataset.originalHeight = `${text.scrollHeight}`;
    }
    
    const height = originalHeight * (1 - accordionProgress);
    const opacity = 1 - accordionProgress;
    
    // Apply styles
    text.style.height = `${height}px`;
    text.style.opacity = opacity.toString();
    text.style.overflow = 'hidden';
    text.style.paddingBottom = `${(1 - accordionProgress) * 16}px`;
    
    // Animate accordion margins
    const accordion = accordionElements[index];
    if (accordion) {
      // Calculate margin (from original 40px to 10px)
      const marginBottom = 40 - (accordionProgress * 30);
      
      // Apply styles
      accordion.style.marginBottom = `${marginBottom}px`;
    }
  });
  
  // Add a custom event when all accordions are closed
  if (progress >= 0.99 && !scrollAccordionEl.dataset.allClosed) {
    console.log('All accordion items are now closed!', {
      progress,
      timestamp: new Date().toISOString()
    });
    
    // Dispatch a custom event
    const event = new CustomEvent('accordions-closed', { 
      detail: { timestamp: new Date().toISOString() } 
    });
    scrollAccordionEl.dispatchEvent(event);
    
    // Set a flag to prevent multiple logs
    scrollAccordionEl.dataset.allClosed = 'true';
  } else if (progress < 0.99 && scrollAccordionEl.dataset.allClosed) {
    // Reset the flag if we scroll back up
    delete scrollAccordionEl.dataset.allClosed;
  }
}

onUnmounted(() => {
  // Clean up
  if (scrollListener) {
    window.removeEventListener('scroll', scrollListener);
  }
  
  if (resizeListener) {
    window.removeEventListener('resize', resizeListener);
  }
  
  if (observer) {
    observer.disconnect();
  }
  
});
</script>

<template>
  <div class="scroll-accordion">
    <div class="placeholder" ref="placeholderRef"></div>
    <div class="accordions" ref="accordionsRef">
      <div 
        v-for="item in items" 
        :key="item.id" 
        class="accordion"
      >
        <div class="title">
          {{ item.title }}
        </div>
        <div class="text">
          {{ item.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-accordion {
  width: 100%;
  /* Set both minimum and maximum height to 2000px */
  min-height: 2000px;
  max-height: 2000px;
  position: relative;
}

.placeholder {
  /* Invisible placeholder that maintains space in document flow */
  visibility: hidden;
}

.accordions {
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  max-width: fit-content;
  margin: 0 auto;
  margin-inline: auto;
  /* Add transform-origin to ensure smooth transitions */
  transform-origin: center top;
}

.accordion {
  margin-bottom: 40px;
  background: linear-gradient(200deg, rgb(29, 145, 252) 13.57%, rgb(90, 54, 192) 98.38%);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.title {
  font-weight: bold;
  padding: 1rem;
  color: white;
}

.text {
  padding: 1rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
}

/* Remove the marker styles */
/* :deep(.scroll-height-marker) {
  pointer-events: none;
} */
</style>