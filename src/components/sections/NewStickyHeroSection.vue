<template>
  <StickySectionContainer 
    height="300vh"
    position="top"
    :offset="0"
    :zIndex="2"
    :debug="debug"
  >
    <SimpleHeroSection :current-theme="currentTheme" />
  </StickySectionContainer>
</template>

<script setup lang="ts">
import StickySectionContainer from '@/components/ui/containers/StickySectionContainer.vue';
import SimpleHeroSection from './SimpleHeroSection.vue';

// Define props
const props = withDefaults(defineProps<{
  currentTheme?: string;
  debug?: boolean;
}>(), {
  currentTheme: 'theme-default',
  debug: false
});
</script>