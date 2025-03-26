<template>
  <div class="plain-message-layout" :class="[layout, customClass]" ref="sectionRef">
    <div class="section-container">
      <div class="section-inner">
        <!-- Content area with slots -->
        <div class="content-area" ref="contentRef">
          <slot name="headline"></slot>
          <slot name="subheadline"></slot>
          <slot name="content"></slot>
          <slot></slot>
        </div>
        
        <!-- Messages area without phone styling -->
        <div class="messages-area" ref="messagesAreaRef">
          <div class="messages-container">
            <PhoneMessages2
              ref="messagesComponentRef"
              :messages="messages"
              :showTypingFor="showTypingFor"
              :isVisible="true"
              :isHidden="false"
              :sectionId="sectionId"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import PhoneMessages2 from '@/components/PhoneMessages2.vue';
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
  sectionId?: string;
  customClass?: string;
  containerHeight?: string;
  heightMultiplier?: number;
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'content-left',
  sectionId: 'plain-message-section',
  customClass: '',
  containerHeight: '',
  heightMultiplier: 1
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
const { messages, showTypingFor, sectionId } = props;

// Add refs for elements
const sectionRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const messagesAreaRef = ref<HTMLElement | null>(null);
const messagesComponentRef = ref<any | null>(null);

// Simple method to focus on content
const focusContent = () => {
  contentRef.value?.scrollIntoView({ behavior: 'smooth' });
};

// Add an onMounted hook
onMounted(() => {
  console.log('PlainMessageLayout mounted');
  console.log('Messages count:', props.messages.length);
  
  // Check if messagesComponentRef is properly set
  nextTick(() => {
    console.log('messagesComponentRef available:', !!messagesComponentRef.value);
    if (messagesComponentRef.value) {
      console.log('PhoneMessages2 methods:', Object.keys(messagesComponentRef.value));
      
      // Try to call the checkTimelineIntegration method if it exists
      if (typeof messagesComponentRef.value.checkTimelineIntegration === 'function') {
        const checkResult = messagesComponentRef.value.checkTimelineIntegration();
        console.log('Messages component check:', checkResult);
      }
      
      // Auto-play the message timeline after a short delay
      setTimeout(() => {
        if (messagesComponentRef.value.playMessageTimeline) {
          console.log('Auto-playing message timeline');
          messagesComponentRef.value.playMessageTimeline();
        }
      }, 1000); // 1 second delay to ensure everything is ready
    }
  });
});

// Add a method to create a scroll-linked animation
const createScrollLinkedAnimation = () => {
  console.log('Creating scroll-linked animation in PlainMessageLayout');
  if (messagesComponentRef.value) {
    console.log('Getting message timeline from PhoneMessages2');
    const timeline = messagesComponentRef.value.createMessageTimeline();
    
    // Automatically play the timeline after creation
    if (timeline) {
      console.log('Automatically playing message timeline');
      timeline.play();
    }
    
    return timeline;
  }
  console.error('Cannot create scroll-linked animation - messagesComponentRef is null');
  return null;
};

// Expose methods to parent components
defineExpose({
  // Directly expose messagesComponentRef (this is the key change)
  messagesComponentRef,
  
  // Keep the existing method for backward compatibility
  messagesComponent: () => messagesComponentRef.value,
  
  // Other methods you want to expose
  focusContent: () => {
    // Implementation of focusContent
  },
  
  // Add a method to create scroll-linked animation
  createScrollLinkedAnimation: (scrollTrigger: any) => {
    if (messagesComponentRef.value && messagesComponentRef.value.createMessageTimeline) {
      return messagesComponentRef.value.createMessageTimeline(scrollTrigger);
    }
    return null;
  }
});
</script>

<style lang="scss">
.plain-message-layout {
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
      
      .messages-area {
        grid-column: 2 / 3;
        display: flex;
        justify-content: center;
        align-items: center;
        
        .messages-container {
          width: 100%;
          max-width: 375px;
          height: 667px;
          background-color: transparent;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          
          .message-input-container {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px 15px;
            background-color: #f5f5f5;
            border-top: 1px solid #e0e0e0;
            
            .input-wrapper {
              background-color: #fff;
              border-radius: 18px;
              padding: 8px 12px;
              
              .message-input {
                font-size: 14px;
                color: #999;
                
                .futoro {
                  font-weight: bold;
                  color: #007bff;
                  margin-right: 2px;
                }
              }
            }
          }
        }
      }
    }
  }
}

/* Layout variations */
.plain-message-layout {
  &.content-right {
    .section-inner {
      .content-area {
        grid-column: 2 / 3;
      }
      
      .messages-area {
        grid-column: 1 / 2;
      }
    }
  }
  
  &.content-top {
    .section-inner {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      
      .content-area {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
        text-align: center;
      }
      
      .messages-area {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
        margin-top: 2rem;
      }
    }
  }
}

/* Media query for mobile */
@media (max-width: 768px) {
  .plain-message-layout {
    .section-container .section-inner {
      grid-template-columns: 1fr;
      
      .content-area, .messages-area {
        grid-column: 1 / 2;
      }
      
      .messages-area {
        margin-top: 2rem;
      }
    }
  }
}
</style>
