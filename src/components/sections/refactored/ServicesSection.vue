<template>
  <StickySectionContainer 
    id="services" 
    class="services-grid section theme-bg--neutral"
    :height="containerHeight || calculateServicesHeight(services.length)"
    position="top"
    :offset="0"
    :zIndex="2"
    :debug="debug"
  >
    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-2 sticky-heading-container">
        <AnimatedText 
          class="sticky-heading text-3xl font-bold text-center my-16 gradient-text"
          firstPart="How I" 
          secondPart="Can Help" 
          animation="split"
          :useGradient="true"
          :duration="3"
          :initiallyHidden="true"
          :triggerOnVisible="true"
          :restartOnVisible="true"
        />
      </div>
      <div class="col-span-3 service-card">
        <ScrollAccordionVanilla :items="services" />
      </div>
    </div>
  </StickySectionContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import StickySectionContainer from '@/components/ui/containers/StickySectionContainer.vue';
import ScrollAccordionVanilla from '@/components/ui/ScrollAccordionVanilla.vue';
import { services } from '@/data/services';
import { calculateServicesHeight } from '@/utils/containerHeightUtils';

// Define props
const props = withDefaults(defineProps<{
  containerHeight?: string;
  debug?: boolean;
  heightMultiplier?: number;
}>(), {
  containerHeight: '',
  debug: false,
  heightMultiplier: 1.2
});

// Computed container height that respects the prop or calculates based on services
const computedContainerHeight = computed(() => {
  if (props.containerHeight) {
    return props.containerHeight;
  }
  return calculateServicesHeight(services.length, {
    heightMultiplier: props.heightMultiplier
  });
});
</script>

<style lang="scss" scoped>
@import '@/scss/components/_services-section.scss';

// You can add additional styles specific to this component here
</style>
