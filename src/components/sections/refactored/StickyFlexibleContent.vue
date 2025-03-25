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
      :ambientMode="ambientMode"
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
  startAtBeginning?: boolean; // New prop to control starting position
  ambientMode?: boolean; // New prop for ambient mode
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
  ambientMode: true // Changed from false to true
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
</script>

<style lang="scss">
.sticky-flexible-content {
  position: relative;
  width: 100%;
  min-height: 100vh;
  z-index: 2;
}
</style>
