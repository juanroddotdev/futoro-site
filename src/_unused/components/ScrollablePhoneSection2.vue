<template>
  <ScrollPinWrapper 
    :height="computedContainerHeight"
    position="top"
    :offset="0"
    :zIndex="2"
    :debug="debug"
    :isUnlocked="isUnlocked"
    :ambientMode="ambientMode"
    :enablePullEffect="enablePullEffect"
    :ambientTheme="ambientTheme"
    :unlockAnimationType="unlockAnimationType"
    @pull-threshold-reached="onPullThresholdReached"
    @unlock="onUnlock"
  >
    <PhoneContentLayout
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
      :isUnlocked="isUnlocked"
      :ambientMode="ambientMode"
      :enablePullEffect="enablePullEffect"
      :ambientTheme="ambientTheme"
      :unlockAnimationType="unlockAnimationType"
      @pull-threshold-reached="onPullThresholdReached"
      @unlock="onUnlock"
      ref="flexibleContentRef"
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
    </PhoneContentLayout>
  </ScrollPinWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ScrollPinWrapper from '@/components/ui/containers/ScrollPinWrapper.vue';
import PhoneContentLayout from './PhoneContentLayout.vue';
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
  unlockAnimationType?: 'wave' | 'ripple'; 
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
  startAtBeginning: true,
  isUnlocked: false,
  ambientMode: false,
  enablePullEffect: true,
  ambientTheme: () => ({
    baseColor: '#1a1f2c',
    endColor: '#2E3440',
    accentColor: 'rgba(245, 245, 245, 0.3)'
  }),
  unlockAnimationType: 'wave'// 
});

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
// Add emits
const emit = defineEmits(['pull-threshold-reached', 'unlock']);

// Add event handlers
const onPullThresholdReached = () => {
  emit('pull-threshold-reached');
};

const onUnlock = () => {
  emit('unlock');
};
</script>

<style lang="scss">
.sticky-flexible-content {
  position: relative;
  width: 100%;
  min-height: 100vh;
  z-index: 2;
}
</style>
