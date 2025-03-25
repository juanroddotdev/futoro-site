<template>
  <ScrollPinWrapper 
    :height="computedContainerHeight"
    position="top"
    :offset="0"
    :zIndex="2"
    :debug="debug"
  >
    <PhoneContentLayout
      v-bind="phoneContentProps"
      ref="phoneContentRef"
      @pull-threshold-reached="$emit('pull-threshold-reached')"
      @unlock="$emit('unlock')"
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
import { ref, computed } from 'vue';
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
  ambientMode?: boolean;
  enablePullEffect?: boolean;
  ambientTheme?: {
    baseColor?: string;
    endColor?: string;
    accentColor?: string;
  };
  unlockAnimationType?: 'wave' | 'ripple';
  isUnlocked?: boolean;
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
  ambientMode: true,
  enablePullEffect: true,
  ambientTheme: () => ({
    baseColor: '#1a1f2c',
    endColor: '#2E3440',
    accentColor: 'rgba(245, 245, 245, 0.3)'
  }),
  unlockAnimationType: 'wave',
  isUnlocked: false
});

// Pass all relevant props to PhoneContentLayout
const phoneContentProps = computed(() => {
  const { 
    messages, showTypingFor, layout, phonePosition, tiltX, tiltY, 
    sectionId, primaryCta, secondaryCta, customClass, ambientMode,
    enablePullEffect, ambientTheme, unlockAnimationType, isUnlocked
  } = props;
  
  return {
    messages, showTypingFor, layout, phonePosition, tiltX, tiltY, 
    sectionId, primaryCta, secondaryCta, customClass, ambientMode,
    enablePullEffect, ambientTheme, unlockAnimationType, isUnlocked
  };
});

// Reference to the phone content component
const phoneContentRef = ref<{ focusContent: () => void } | null>(null);

// Expose methods from the child component
defineExpose({
  focusContent: () => phoneContentRef.value?.focusContent()
});

const computedContainerHeight = computed(() => {
  if (props.containerHeight) {
    return props.containerHeight;
  }
  return calculateContainerHeight(props.messages.length, {
    itemHeight: 50,
    heightMultiplier: 1.3
  });
});

// Define emits
const emit = defineEmits(['pull-threshold-reached', 'unlock']);
</script>

<style lang="scss">
.sticky-flexible-content {
  position: relative;
  width: 100%;
  min-height: 100vh;
  z-index: 2;
}
</style>
