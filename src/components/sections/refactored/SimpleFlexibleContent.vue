<template>
  <div class="simple-flexible-content" :class="[layout, position, customClass]" ref="sectionRef">
    <div class="section-container">
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
            :messages="messages"
            :showTypingFor="showTypingFor"
            :sectionId="sectionId"
            :tilt-x="tiltX"
            :tilt-y="tiltY"
            :position="phonePosition"
            :pin-settings="{ enabled: false }"
            :ambient-mode="ambientMode"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PhoneSection from '@/components/PhoneSection.vue';
import { calculateContainerHeight } from '@/utils/containerHeightUtils';

// Component props definition
interface Props {
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
  customClass?: string;
  containerHeight?: string;
  heightMultiplier?: number;
  ambientMode?: boolean; // New prop for ambient mode
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'content-left',
  phonePosition: 'right',
  tiltX: 8,
  tiltY: -20,
  sectionId: 'flexible-section',
  customClass: '',
  containerHeight: '',
  heightMultiplier: 1,
  ambientMode: false // Default to false
});

const computedContainerHeight = computed(() => {
  if (props.containerHeight) {
    return props.containerHeight;
  }
  return calculateContainerHeight(props.messages.length, {
    heightMultiplier: props.heightMultiplier
  });
});

// Destructure props for easier template access
const { messages, showTypingFor, sectionId, tiltX, tiltY, phonePosition } = props;

// Compute position class based on phonePosition prop
const position = computed(() => {
  return `position-${props.phonePosition}`;
});

// Add refs for elements
const sectionRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const phoneAreaRef = ref<HTMLElement | null>(null);

// Simple method to focus on content
const focusContent = () => {
  contentRef.value?.scrollIntoView({ behavior: 'smooth' });
};

// Expose methods to parent components
defineExpose({
  focusContent
});
</script>

<style lang="scss">
.simple-flexible-content {
  position: relative;
  width: 100%;
  min-height: 100vh;
  z-index: 2;
  
  .section-container {
    width: 100%;
    min-height: 100vh;
    
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
    }
  }
}

/* Layout variations */
.simple-flexible-content {
  &.position-left {
    .section-inner {
      .content-area {
        grid-column: 2 / 3;
      }
      
      .phone-area {
        grid-column: 1 / 2;
      }
    }
  }
  
  &.position-center {
    .section-inner {
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

/* Media query for mobile */
@media (max-width: 768px) {
  .simple-flexible-content {
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
