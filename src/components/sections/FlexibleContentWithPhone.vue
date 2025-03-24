<script setup lang="ts">
import { onMounted, ref, computed, defineExpose, nextTick, onUnmounted } from 'vue';
import PhoneSection from '@/components/PhoneSection.vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Import debug utilities - can be commented out or removed when not debugging
import { useFlexibleContentDebug } from '@/debug/FlexibleContentWithPhoneDebug';

gsap.registerPlugin(ScrollTrigger);

// Component props definition
interface Props {
  // Make primaryCta optional
  primaryCta?: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
  messages: any[];
  showTypingFor: number[];
  layout?: 'content-left' | 'content-right' | 'content-top';
  phonePosition?: 'left' | 'right' | 'center';
  tiltX?: number;
  tiltY?: number;
  sectionId?: string;
  stickySection?: boolean;
  wrapperHeightMultiplier?: number;
  // Animation controls
  animation?: {
    contentFirst?: boolean;
    delay?: number;
    duration?: number;
    phoneDelay?: number; // Add specific delay for phone
  };
  initiallyHidden?: boolean; // Add this prop
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'content-left',
  phonePosition: 'right',
  tiltX: 8,
  tiltY: -20,
  sectionId: 'flexible-section',
  stickySection: true,
  wrapperHeightMultiplier: 50,
  animation: () => ({
    contentFirst: true,
    duration: 0.8,
    phoneDelay: 1.0 // Default phone delay (in seconds)
  }),
  initiallyHidden: false
});

// Add refs for visibility tracking
const sectionRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const animationStarted = ref(false);
const phoneAreaRef = ref<HTMLElement | null>(null);

// Component methods
const startAnimations = () => {
  if (animationStarted.value) {
    return;
  }
  
  const contentArea = contentRef.value;
  const phoneArea = sectionRef.value?.querySelector('.phone-area');
  
  if (!contentArea || !phoneArea) {
    return;
  }
  
  // Ensure everything is visible
  contentArea.style.opacity = '1';
  (phoneArea as HTMLElement).style.opacity = '1';
  (phoneArea as HTMLElement).style.display = 'block';
  
  animationStarted.value = true;
};

// DEBUGGING CONFIGURATION
// All debug-related configuration in one place
const debugConfig = import.meta.env.DEV ? {
  // Component references needed for debugging
  refs: {
    sectionRef,
    contentRef, 
    phoneAreaRef
  },
  // Component state
  state: {
    animationStarted
  },
  // Component methods that debug needs to access
  methods: {
    startAnimations
  },
  // Props to track
  props: props,
  // Optional configuration
  options: {
    enabled: true
  }
} : null;

// Initialize debugger only if configuration exists
const debug = debugConfig ? useFlexibleContentDebug(debugConfig) : null;

// Component lifecycle hooks
onMounted(() => {
  // Initialize debugger if available
  debug?.init();
  
  // Set up phone area reference
  nextTick(() => {
    phoneAreaRef.value = sectionRef.value?.querySelector('.phone-area') as HTMLElement;
  });
  
  // If not initially hidden, start animations immediately
  if (!props.initiallyHidden) {
    startAnimations();
    // Track animation if debug is available
    debug?.trackAnimation('completed');
  }
});

onUnmounted(() => {
  // Clean up debugger if available
  debug?.cleanup();
});

// Expose the startAnimations method and animation props to parent components
defineExpose({
  startAnimations,
  animation: props.animation
});

// Calculate wrapper height based on messages
const wrapperHeight = computed(() => {
  const baseHeight = 100; // Base viewport height
  return `${baseHeight + (props.messages.length * props.wrapperHeightMultiplier)}vh`;
});
</script>

<template>
  <div class="flexible-wrapper debug" :style="stickySection ? { height: wrapperHeight } : {}">
    <section 
      ref="sectionRef" 
      class="flexible-section" 
      :class="[
        layout,
        { 'sticky-section': stickySection }
      ]"
    >
      <div class="flexible-grid" :class="layout">
        <!-- Headline area (spans full width in default layout) -->
        <div class="headline-area" v-if="$slots.headline">
          <slot name="headline"></slot>
        </div>
        
        <!-- Subheadline area -->
        <div class="subheadline-area" v-if="$slots.subheadline">
          <slot name="subheadline"></slot>
        </div>
        
        <!-- CTA area -->
        <div class="cta-area" v-if="primaryCta || secondaryCta">
          <div class="flex gap-4">
            <a 
              v-if="primaryCta"
              :href="primaryCta.link" 
              class="btn-round-large-primary cta"
            >
              {{ primaryCta.text }}
            </a>
            <a 
              v-if="secondaryCta"
              :href="secondaryCta.link" 
              class="btn-round-large-outline-primary"
            >
              {{ secondaryCta.text }}
            </a>
          </div>
        </div>
        
        <!-- Phone area -->
        <div class="phone-area">
          <PhoneSection
            :messages="messages" 
            :sectionId="sectionId"
            :showTypingFor="showTypingFor"
            :tilt-x="tiltX"
            :tilt-y="tiltY"
            :position="phonePosition"
            class="section-phone"
            :pin-settings="{
              enabled: false, // Disable phone's own pinning since parent is pinned
              start: 'top 30%',
            }"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.flexible-wrapper {
  position: relative;
}

.flexible-section {
  min-height: 100vh;
  width: 100%;
  
  &.sticky-section {
    position: sticky;
    top: 0;
  }
  
  .flexible-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto 1fr;
    min-height: 100vh;
    padding: 2rem;
    position: relative;
    z-index: 2;
    
    // Default layout (content-left)
    .headline-area {
      grid-column: 1 / -1;
      grid-row: 1 / 2;
      padding: 1rem 1rem 0.5rem 1rem;
      opacity: 1;
      position: relative;
      z-index: 3;
    }
    
    .subheadline-area {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
      padding: 0.5rem 1rem;
      opacity: 1;
      position: relative;
      z-index: 3;
    }
    
    .cta-area {
      grid-column: 1 / 2;
      grid-row: 3 / 4;
      padding: 1rem;
      opacity: 1;
      position: relative;
      z-index: 3;
    }
    
    .phone-area {
      grid-column: 2 / -1;
      grid-row: 2 / -1;
      padding: 1rem;
      align-self: center;
      position: relative;
      opacity: 1;
      
      .container {
        min-height: unset;
        padding-top: 0;
      }
    }
    
    // Content right layout
    &.content-right {
      .subheadline-area {
        grid-column: 2 / -1;
      }
      
      .cta-area {
        grid-column: 2 / -1;
      }
      
      .phone-area {
        grid-column: 1 / 2;
      }
    }
    
    // Content top layout
    &.content-top {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto 1fr;
      
      .headline-area {
        grid-column: 1 / -1;
        grid-row: 1 / 2;
      }
      
      .subheadline-area {
        grid-column: 1 / -1;
        grid-row: 2 / 3;
      }
      
      .cta-area {
        grid-column: 1 / -1;
        grid-row: 3 / 4;
      }
      
      .phone-area {
        grid-column: 1 / -1;
        grid-row: 4 / 5;
        display: flex;
        justify-content: center;
      }
    }
  }
}

// Media queries for responsive layout
@media (max-width: 768px) {
  .flexible-section {
    .flexible-grid {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto 1fr;
      
      .headline-area {
        grid-column: 1 / -1;
        grid-row: 1 / 2;
      }
      
      .subheadline-area {
        grid-column: 1 / -1;
        grid-row: 2 / 3;
      }
      
      .cta-area {
        grid-column: 1 / -1;
        grid-row: 3 / 4;
      }
      
      .phone-area {
        grid-column: 1 / -1;
        grid-row: 4 / 5;
        justify-content: center;
        display: flex;
      }
    }
  }
}
</style>
