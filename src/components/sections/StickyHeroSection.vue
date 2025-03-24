<template>
  <StickySectionContainer 
    height="300vh"
    position="top"
    :offset="0"
    :zIndex="2"
    :debug="debug"
  >
    <HeroSectionWithPhone 
      :current-theme="currentTheme" 
      ref="heroSectionRef"
    />
  </StickySectionContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HeroSectionWithPhone from './HeroSectionWithPhone.vue';
import StickySectionContainer from '@/components/ui/containers/StickySectionContainer.vue';

// Define props
const props = withDefaults(defineProps<{
  currentTheme?: string;
  debug?: boolean;
}>(), {
  currentTheme: 'theme-default',
  debug: false
});

// Reference to the inner HeroSectionWithPhone component
const heroSectionRef = ref(null);

// Expose the inner component's methods and properties if needed
defineExpose({
  heroSectionRef
});
</script>

<style lang="scss">
// No additional styles needed as they're handled by the inner components
</style>