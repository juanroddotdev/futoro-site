<template>
  <ScrollPinWrapper 
    :height="computedContainerHeight"
    position="top"
    :offset="0"
    :zIndex="2"
    :debug="debug"
  >
    <div class="scrollable-chat-section" :class="customClass">
      <div class="section-container">
        <div class="section-inner" :class="layout">
          <!-- Content area with slots -->
          <div class="content-area">
            <slot name="headline"></slot>
            <slot name="subheadline"></slot>
            <slot name="content"></slot>
            <slot></slot>
          </div>
          
          <!-- Chat area -->
          <div class="chat-area">
            <FloatingChatInterface
              :messages="messages"
              :showTypingFor="showTypingFor"
              :sectionId="sectionId"
              :tiltX="tiltX"
              :tiltY="tiltY"
              :pinSettings="{
                enabled: false, // No need to pin as ScrollPinWrapper handles this
                start: 'top top',
                end: `+=${messages.length * 50}%`,
                pinSpacing: false
              }"
              :messageAnimationConfig="{
                scaleDecrement: 0.03,    // Smaller scale reduction
                opacityDecrement: 0.15,  // Smaller opacity reduction
                verticalOffset: 80,      // Less vertical movement
                minScale: 0.8,           // Higher minimum scale
                minOpacity: 0.4          // Higher minimum opacity
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </ScrollPinWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ScrollPinWrapper from '@/components/ui/containers/ScrollPinWrapper.vue';
import FloatingChatInterface from '@/components/FloatingChatInterface.vue';
import { calculateContainerHeight } from '@/utils/containerHeightUtils';

// Component props definition
interface Props {
  messages: any[];
  showTypingFor: number[];
  layout?: 'content-left' | 'content-right' | 'content-top';
  sectionId?: string;
  containerHeight?: string;
  debug?: boolean;
  customClass?: string;
  tiltX?: number; // Add tilt X property
  tiltY?: number; // Add tilt Y property
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'content-left',
  sectionId: 'floating-chat-section',
  containerHeight: '300vh',
  debug: false,
  customClass: '',
  tiltX: 8, // Default tilt X value
  tiltY: -20 // Default tilt Y value
});

const computedContainerHeight = computed(() => {
  if (props.containerHeight) {
    return props.containerHeight;
  }
  return calculateContainerHeight(props.messages.length, {
    itemHeight: 50, // Adjust as needed for message height
    heightMultiplier: 1.3
  });
});
</script>

<style lang="scss" scoped>
.scrollable-chat-section {
  width: 100%;
  
  .section-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .section-inner {
    display: flex;
    gap: 40px;
    
    &.content-left {
      flex-direction: row;
    }
    
    &.content-right {
      flex-direction: row-reverse;
    }
    
    &.content-top {
      flex-direction: column;
    }
  }
  
  .content-area {
    flex: 1;
    padding: 20px;
  }
  
  .chat-area {
    flex: 1;
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  .scrollable-chat-section {
    .section-inner {
      flex-direction: column !important;
    }
    
    .chat-area {
      max-width: 100%;
    }
  }
}
</style>
