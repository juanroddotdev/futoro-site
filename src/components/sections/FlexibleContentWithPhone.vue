<script setup lang="ts">
import { onMounted, ref, computed, defineExpose } from 'vue';
import { heroSectionAnimations } from '@/animations/heroSection';
import PhoneSection from '@/components/PhoneSection.vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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


onMounted(() => {

  
  // If not initially hidden, start animations immediately
  if (!props.initiallyHidden) {
    startAnimations();
  }
});

// Create a method to start animations that can be called externally
const startAnimations = () => {
  if (animationStarted.value) {
    return; // Prevent multiple starts
  }
  
  const contentArea = contentRef.value;
  const phoneArea = sectionRef.value?.querySelector('.phone-area');
  
  if (!contentArea || !phoneArea) {
    return;
  }
  
  // Set initial state - hide both elements
  gsap.set(contentArea, { 
    autoAlpha: 0,
    y: 30
  });
  
  gsap.set(phoneArea, { 
    autoAlpha: 0,
    y: 30
  });
  
  // Create timeline for sequential animation
  const tl = gsap.timeline({
    delay: props.animation.delay || 0
  });
  
  // Always animate content first
  tl.to(contentArea, {
    autoAlpha: 1,
    y: 0,
    duration: props.animation.duration,
    ease: "power2.out"
  });
  
  // Add phone with specific delay
  tl.to(phoneArea, {
    autoAlpha: 1,
    y: 0,
    duration: props.animation.duration,
    ease: "power2.out"
  }, `+=${props.animation.phoneDelay}`);
  
  animationStarted.value = true;
};

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
  <div class="flexible-wrapper" :style="stickySection ? { height: wrapperHeight } : {}">
    <section 
      ref="sectionRef" 
      class="flexible-section" 
      :class="[
        layout,
        { 'sticky-section': stickySection }
      ]"
    >
      <div class="flexible-grid" :class="layout">
        <div class="content-area" ref="contentRef">
          <!-- Only show headline area if slot content is provided -->
          <div class="headline-area mb-6" v-if="$slots.headline">
            <slot name="headline"></slot>
          </div>
          
          <!-- Only show subheadline area if slot content is provided -->
          <div class="subheadline-area mb-8" v-if="$slots.subheadline">
            <slot name="subheadline"></slot>
          </div>
          
          <!-- Only show CTA area if at least one CTA is provided -->
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
        </div>
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
    min-height: 100vh;
    padding: 2rem;
    position: relative;
    z-index: 2;
    
    .content-area {
      visibility: hidden; /* Initially hidden */
    }
    
    .phone-area {
      visibility: hidden; /* Initially hidden */
    }
    
    &.content-left {
      grid-template-columns: 1fr 1fr;
      grid-template-areas: 
        "content phone";
      
      .content-area {
        grid-area: content;
        padding-right: 2rem;
      }
      
      .phone-area {
        grid-area: phone;
      }
    }
    
    &.content-right {
      grid-template-columns: 1fr 1fr;
      grid-template-areas: 
        "phone content";
      
      .content-area {
        grid-area: content;
        padding-left: 2rem;
      }
      
      .phone-area {
        grid-area: phone;
      }
    }
    
    &.content-top {
      grid-template-rows: auto 1fr;
      grid-template-areas: 
        "content"
        "phone";
      
      .content-area {
        grid-area: content;
        padding-bottom: 2rem;
      }
      
      .phone-area {
        grid-area: phone;
        display: flex;
        justify-content: center;
      }
    }
    
    .content-area {
      display: flex;
      flex-direction: column;
      justify-content: center;
      
      .headline-area, 
      .subheadline-area, 
      .cta-area {
        position: relative;
        z-index: 3;
        padding: 1rem;
      }
    }
    
    .phone-area {
      align-self: center;
      position: relative;
      
      .container {
        min-height: unset;
        padding-top: 0;
      }
    }
  }
}

// Media queries for responsive layout
@media (max-width: 768px) {
  .flexible-section {
    .flexible-grid {
      &.content-left,
      &.content-right {
        grid-template-columns: 1fr;
        grid-template-areas: 
          "content"
          "phone";
      }
      
      .content-area {
        padding: 1rem;
      }
      
      .phone-area {
        padding: 1rem;
        justify-content: center;
        display: flex;
      }
    }
  }
}
</style>
