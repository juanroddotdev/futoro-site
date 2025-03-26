<template>
  <StickySectionContainer 
    :height="computedContainerHeight"
    position="top"
    :offset="0"
    :zIndex="2"
    :debug="debug"
  >
    <SimpleFlexibleContent
      :messages="messages"
      :showTypingFor="showTypingFor"
      :layout="layout"
      :phonePosition="phonePosition"
      :tiltX="tiltX"
      :tiltY="tiltY"
      :sectionId="sectionId"
      :primaryCta="primaryCta"
      :secondaryCta="secondaryCta"
      :customClass="customClass"
      ref="flexibleContentRef"
      :ambientMode="ambientMode"
    :enablePullEffect="enablePullEffect"
    :ambientTheme="ambientTheme"
    :unlockAnimationType="unlockAnimationType"
    :isUnlocked="isUnlocked"
    @pull-threshold-reached="onPullThresholdReached"
    @unlock="onUnlock"
    >
      <template #headline>
        <slot name="headline"></slot>
      </template>
      <template #subheadline>
        <slot name="subheadline"></slot>
      </template>
      <template #content>
        <slot name="content"></slot>
      </template>
      <template #default>
        <slot></slot>
      </template>
    </SimpleFlexibleContent>
  </StickySectionContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import StickySectionContainer from '@/components/ui/containers/StickySectionContainer.vue';
import SimpleFlexibleContent from './SimpleFlexibleContent.vue';
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
  containerHeight?: string;
  debug?: boolean;
  customClass?: string;
  startAtBeginning?: boolean; 
  isUnlocked?: boolean;
  ambientMode?: boolean;
  enablePullEffect?: boolean;
  ambientTheme?: {
    baseColor?: string;
    endColor?: string;
    accentColor?: string;
  };
  unlockAnimationType?: 'wave' | 'ripple';// New prop to control starting position
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'content-left',
  phonePosition: 'right',
  tiltX: 8,
  tiltY: -20,
  sectionId: 'flexible-section',
  containerHeight: '300vh',
  debug: false,
  customClass: '',
  startAtBeginning: true, // Default to true to show first message
  isUnlocked: false,
  ambientMode: false,
  enablePullEffect: true,
  ambientTheme: () => ({
    baseColor: '#1a1f2c',
    endColor: '#2E3440',
    accentColor: 'rgba(245, 245, 245, 0.3)'
  }),
  unlockAnimationType: 'wave'
});

// Add emits
const emit = defineEmits(['pull-threshold-reached', 'unlock']);

// Add event handlers
const onPullThresholdReached = () => {
  emit('pull-threshold-reached');
};

const onUnlock = () => {
  emit('unlock');
};

// Reference to the flexible content component
const flexibleContentRef = ref(null);

// Expose methods from the child component
defineExpose({
  focusContent: () => flexibleContentRef.value?.focusContent()
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

<style lang="scss">
.sticky-flexible-content {
  position: relative;
  width: 100%;
  min-height: 100vh;
  z-index: 2;
}
</style>
