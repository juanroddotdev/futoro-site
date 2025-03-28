<template>
  <StickyScrollContainer 
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
            <!-- <FloatingChat2
              :messages="messages"
              sectionId="chat-section"
            /> -->
            <FloatingChat
              :messages="messages"
              :showTypingFor="showTypingFor"
              :sectionId="sectionId"
              :tiltX="tiltX"
              :tiltY="tiltY"
              :handDrawnStyle="true"
              animationStyle="stack"
              slideEasing="power1.out"
              :pinSettings="{
                enabled: false, // No need to pin as StickyScrollContainer handles this
                start: 'top top',
                end: `+=${messages.length * 50}%`,
                pinSpacing: false
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </StickyScrollContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StickyScrollContainer from '@/components/ui/containers/StickyScrollContainer.vue';
import FloatingChat from '@/components/chat/FloatingChat.vue';
import FloatingChat2 from '@/components/chat/FloatingChat2.vue';
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
  tiltX?: number;
  tiltY?: number;
  // Add phone-related props for compatibility with ScrollablePhoneSection
  primaryCta?: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
  phonePosition?: 'left' | 'right' | 'center';
  startAtBeginning?: boolean;
  isUnlocked?: boolean;
  ambientMode?: boolean;
  enablePullEffect?: boolean;
  ambientTheme?: {
    baseColor?: string;
    endColor?: string;
    accentColor?: string;
  };
  unlockAnimationType?: 'wave' | 'ripple';
  alternatePhoneStyle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'content-left',
  sectionId: 'floating-chat-section',
  containerHeight: '300vh',
  debug: false,
  customClass: '',
  tiltX: 8,
  tiltY: -20,
  phonePosition: 'right',
  startAtBeginning: true,
  isUnlocked: false,
  ambientMode: false,
  enablePullEffect: true,
  ambientTheme: () => ({
    baseColor: '#1a1f2c',
    endColor: '#2E3440',
    accentColor: 'rgba(245, 245, 245, 0.3)'
  }),
  unlockAnimationType: 'wave',
  alternatePhoneStyle: false
});

// Add emits for compatibility with ScrollablePhoneSection
const emit = defineEmits(['pull-threshold-reached', 'unlock']);

// These methods are no-ops but included for API compatibility
const onPullThresholdReached = () => {
  emit('pull-threshold-reached');
};

const onUnlock = () => {
  emit('unlock');
};

const computedContainerHeight = computed(() => {
  if (props.containerHeight) {
    return props.containerHeight;
  }
  return calculateContainerHeight(props.messages.length, {
    itemHeight: 50, // Adjust as needed for message height
    heightMultiplier: 1.3
  });
});

// Expose methods for compatibility with ScrollablePhoneSection
defineExpose({
  focusContent: () => {
    // No-op implementation for compatibility
    console.log('focusContent called on ChatScrollSection');
  }
});
</script>

<style lang="scss" scoped>

</style>