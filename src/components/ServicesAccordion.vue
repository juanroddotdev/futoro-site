//TODO: smooth out accordion transitions
<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
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
  if (event) {
    event.preventDefault();
  }
  
  if (openServiceId.value === serviceId) {
    const content = document.querySelector(`.accordion-item[data-id="${serviceId}"] .accordion-content`);
    if (content) {
      await animateClose(content);
      openServiceId.value = -1;
    }
  } else {
    if (openServiceId.value !== -1) {
      const oldContent = document.querySelector(`.accordion-item[data-id="${openServiceId.value}"] .accordion-content`);
      if (oldContent) {
        await animateClose(oldContent);
      }
    }
    
    openServiceId.value = serviceId;
    await nextTick();
    
    const newContent = document.querySelector(`.accordion-item[data-id="${serviceId}"] .accordion-content`);
    if (newContent) {
      await animateOpen(newContent);
    }
  }
};

// Animation functions
const animateOpen = (element: Element) => {
  const contentInner = element.querySelector('.content-inner');
  const contentHeight = contentInner ? contentInner.scrollHeight : 0;
  
  gsap.set(element, { 
    height: 0,
    visibility: 'visible'
  });
  
  return gsap.to(element, { 
    height: contentHeight,
    duration: 0.3,
    ease: 'power1.inOut'
  });
};

const animateClose = (element: Element) => {
  return gsap.to(element, { 
    height: 0,
    duration: 0.3,
    ease: 'power1.inOut'
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
      class="accordion-item body-text"
      :class="{ 'active': openServiceId === service.id }"
      :data-id="service.id"
    >
      <button 
        class="accordion-header theme-btn theme-btn--outline"
        @click="toggleService(service.id, $event)"
      >
        <h3 class="subheading-responsive heading--highlight">{{ service.title }}</h3>
        <span 
          class="accordion-icon"
          :class="{ 
            'gradient-fill': openServiceId === service.id,
            'theme-text--secondary': openServiceId !== service.id,
            'rotate': openServiceId === service.id 
          }"
        >
          <svg class="plus-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
      </button>
      <div class="accordion-content">
        <div class="content-inner body-text">
          {{ service.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/scss/components/accordion';

.accordion-icon {
  @apply transition-transform duration-300 ease-in-out;
  
  .plus-icon {
    @apply w-6 h-6;
    
    line {
      transition: stroke 0.3s ease;
    }
  }
  
  &.rotate {
    transform: rotate(45deg);
  }

  // Default colors for each theme
  .theme-neon-horizon & .plus-icon line {
    stroke: var(--neon-horizon-neutral);
  }
  
  .theme-digital-sunset & .plus-icon line {
    stroke: var(--digital-sunset-neutral);
  }
  
  .theme-retro-wave & .plus-icon line {
    stroke: var(--retro-wave-neutral);
  }
  
  .theme-pastel-future & .plus-icon line {
    stroke: var(--pastel-future-primary-dark); // Using the darker shade for better contrast
  }

  // Gradient styles for different themes when active
  &.gradient-fill {
    .theme-neon-horizon & .plus-icon line {
      stroke: var(--neon-horizon-secondary);
    }
    
    .theme-digital-sunset & .plus-icon line {
      stroke: var(--digital-sunset-secondary);
    }
    
    .theme-retro-wave & .plus-icon line {
      stroke: var(--retro-wave-secondary);
    }
    
    .theme-pastel-future & .plus-icon line {
      stroke: var(--pastel-future-secondary);
    }
  }
}
</style>