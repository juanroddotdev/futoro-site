//TODO: smooth out accordion transitions
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { gsap } from 'gsap';

interface Service {
  id: number;
  title: string;
  description: string;
}

const props = defineProps<{
  services: Service[];
  defaultOpenIndex?: number;
}>();

// Track which service is currently open
const openServiceId = ref(props.services[props.defaultOpenIndex || 0]?.id);

// References to content elements
const accordionRef = ref<HTMLElement | null>(null);

// Toggle accordion item
const toggleService = async (serviceId: number, event?: Event) => {
  // Prevent default behavior to avoid page scrolling
  if (event) {
    event.preventDefault();
  }
  
  // Get the current scroll position
  const scrollPosition = window.scrollY;
  
  if (openServiceId.value === serviceId) {
    // Close the current item
    const content = document.querySelector(`.accordion-item[data-id="${serviceId}"] .accordion-content`);
    if (content) {
      // Get the height before animation to maintain container size
      const contentHeight = content.scrollHeight;
      const accordionHeight = accordionRef.value?.offsetHeight || 0;
      
      // Set a fixed height on the accordion container to prevent layout shifts
      if (accordionRef.value) {
        gsap.set(accordionRef.value, { height: accordionHeight });
      }
      
      await animateClose(content);
      openServiceId.value = -1;
      
      // Animate the accordion container back to its natural height
      if (accordionRef.value) {
        gsap.to(accordionRef.value, { 
          height: 'auto', 
          duration: 0.3, 
          ease: 'power2.out',
          onComplete: () => {
            // Reset to natural flow after animation
            gsap.set(accordionRef.value, { clearProps: 'height' });
          }
        });
      }
    }
  } else {
    // If another item is open, close it first
    if (openServiceId.value !== -1) {
      // Get the current accordion height before any changes
      const accordionHeight = accordionRef.value?.offsetHeight || 0;
      
      // Fix the height of the accordion container
      if (accordionRef.value) {
        gsap.set(accordionRef.value, { height: accordionHeight });
      }
      
      const oldContent = document.querySelector(`.accordion-item[data-id="${openServiceId.value}"] .accordion-content`);
      if (oldContent) {
        await animateClose(oldContent);
      }
    }
    
    // Open the new item
    openServiceId.value = serviceId;
    await nextTick();
    
    const newContent = document.querySelector(`.accordion-item[data-id="${serviceId}"] .accordion-content`);
    if (newContent) {
      await animateOpen(newContent);
      
      // Animate the accordion container to its new height
      if (accordionRef.value) {
        gsap.to(accordionRef.value, { 
          height: 'auto', 
          duration: 0.3, 
          ease: 'power2.out',
          onComplete: () => {
            // Reset to natural flow after animation
            gsap.set(accordionRef.value, { clearProps: 'height' });
          }
        });
      }
    }
  }
  
  // Maintain the same scroll position
  window.scrollTo(0, scrollPosition);
};

// Animation functions
const animateOpen = (element: Element) => {
  // First measure the content
  const contentInner = element.querySelector('.content-inner');
  const contentHeight = contentInner ? contentInner.scrollHeight : 0;
  
  // Set initial state
  gsap.set(element, { 
    height: 0, 
    opacity: 0, 
    overflow: 'hidden',
    visibility: 'visible'
  });
  
  // Animate to the exact measured height
  return gsap.to(element, { 
    duration: 0.4, 
    height: contentHeight,
    opacity: 1, 
    ease: 'power2.out'
  });
};

const animateClose = (element: Element) => {
  // Animate to zero height
  return gsap.to(element, { 
    duration: 0.4, 
    height: 0,
    opacity: 0,
    ease: 'power2.in',
    overflow: 'hidden'
  });
};

// Handle keyboard events
const handleKeydown = (serviceId: number, event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleService(serviceId, event);
  }
};

// Initialize the default open item with animation
onMounted(async () => {
  await nextTick();
  if (openServiceId.value !== -1) {
    const content = document.querySelector(`.accordion-item[data-id="${openServiceId.value}"] .accordion-content`);
    if (content) {
      // Set initial state for the open content
      const contentInner = content.querySelector('.content-inner');
      const contentHeight = contentInner ? contentInner.scrollHeight : 0;
      
      gsap.set(content, { 
        height: contentHeight,
        opacity: 1, 
        visibility: 'visible' 
      });
    }
  }
});
</script>

<template>
  <div class="services-accordion theme-bg--neutral" ref="accordionRef">
    <div 
      v-for="service in services" 
      :key="service.id" 
      class="accordion-item body-text border-neutral-900"
      :class="{ 'active': openServiceId === service.id }"
      :data-id="service.id"
    >
      <button 
        class="accordion-header theme-btn theme-btn--outline w-full text-left"
        @click="toggleService(service.id, $event)"
      >
        <h3 class="heading heading--highlight">{{ service.title }}</h3>
      </button>
      <div class="accordion-content">
        <div class="content-inner body-text">
          {{ service.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.services-accordion {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  position: relative; /* For positioning context */
}

.accordion-item {
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
  overflow: hidden;
  position: relative; /* For positioning context */
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none; /* Prevent text selection */
  position: relative; /* Keep header in place */
  z-index: 2;
}

.accordion-icon {
  transition: transform 0.3s ease;
}

.accordion-item.active .accordion-icon {
  transform: rotate(0deg);
}

.accordion-content {
  overflow: hidden;
  will-change: height, opacity; /* Optimize for animations */
  height: 0;
  opacity: 0;
  visibility: hidden;
  position: relative;
  z-index: 1;
}

.content-inner {
  padding: 0 20px 20px;
  line-height: 1.6;
}
</style>