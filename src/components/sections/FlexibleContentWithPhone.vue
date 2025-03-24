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

// Compute position class based on phonePosition prop
const position = computed(() => {
  return `position-${props.phonePosition}`;
});

// Add refs for visibility tracking
const sectionRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const animationStarted = ref(false);
const phoneAreaRef = ref<HTMLElement | null>(null);

// Calculate wrapper height based on messages
const wrapperHeight = computed(() => {
  const baseHeight = 100; // Base viewport height
  return `${baseHeight + (props.messages.length * props.wrapperHeightMultiplier)}vh`;
});

// Component methods
const startAnimations = () => {
  if (animationStarted.value) {
    return;
  }
  
  const contentArea = contentRef.value;
  const phoneArea = phoneAreaRef.value;
  
  if (!contentArea || !phoneArea) {
    console.error('[FlexibleContentWithPhone] Cannot start animations: elements not found');
    return;
  }
  
  // Ensure everything is visible
  contentArea.style.opacity = '1';
  phoneArea.style.opacity = '1';
  phoneArea.style.display = 'block';
  
  animationStarted.value = true;
  console.log('[FlexibleContentWithPhone] Animations started');
};

// Expose the startAnimations method and animation props to parent components
defineExpose({
  startAnimations,
  animation: props.animation
});

// Apply the wrapper height to the component
onMounted(() => {
  console.log('[FlexibleContentWithPhone] Component mounted');
  
  if (sectionRef.value) {
    sectionRef.value.style.height = wrapperHeight.value;
  }
  
  // If not initially hidden, start animations
  if (!props.initiallyHidden) {
    nextTick(() => {
      startAnimations();
    });
  }
});
</script>

<template>
  <div class="flexible-content-with-phone" :class="[layout, position]" ref="sectionRef" :style="{ height: wrapperHeight }">
    <section class="section-container">
      <div class="section-inner">
        <!-- Content area with slots -->
        <div class="content-area" ref="contentRef">
          <slot name="headline"></slot>
          <slot name="subheadline"></slot>
          <slot name="content"></slot>
          <slot></slot>
        </div>
        
        <!-- Phone area with PhoneSection component -->
        <div class="phone-area" ref="phoneAreaRef">
          <PhoneSection
            :messages="props.messages"
            :showTypingFor="props.showTypingFor"
            :sectionId="props.sectionId"
            :tilt-x="props.tiltX"
            :tilt-y="props.tiltY"
            :position="props.phonePosition"
            :pin-settings="{ enabled: props.stickySection }"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.flexible-content-with-phone {
  position: relative;
  min-height: 100vh; /* Ensure minimum height */
  width: 100%;
  
  .section-container {
    min-height: 100vh;
    width: 100%;
    
    .section-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
      padding: 2rem;
      
      .content-area {
        grid-column: 1 / 2;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .phone-area {
        grid-column: 2 / 3;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      /* Layout variations */
      .position-left .section-inner {
        .content-area {
          grid-column: 2 / 3;
        }
        
        .phone-area {
          grid-column: 1 / 2;
        }
      }
      
      .position-center .section-inner {
        grid-template-columns: 1fr;
        
        .content-area {
          grid-column: 1 / 2;
          text-align: center;
        }
        
        .phone-area {
          grid-column: 1 / 2;
          margin-top: 2rem;
        }
      }
    }
  }
}

/* Media query for mobile */
@media (max-width: 768px) {
  .flexible-content-with-phone {
    .section-container .section-inner {
      grid-template-columns: 1fr;
      
      .content-area, .phone-area {
        grid-column: 1 / 2;
      }
      
      .phone-area {
        margin-top: 2rem;
      }
    }
  }
}
</style>
