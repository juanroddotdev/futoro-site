<template>
  <ScrollPinWrapper 
    height="300vh"
    position="top"
    :offset="0"
    :zIndex="10"
    :debug="true"
  >
    <HeroSectionWithPhone 
      :current-theme="currentTheme" 
      ref="heroSectionRef"
      @mounted="onHeroMounted"
    />
  </ScrollPinWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import HeroSectionWithPhone from './HeroSectionWithPhone.vue';
import ScrollPinWrapper from '@/components/ui/containers/ScrollPinWrapper.vue';

// Define props
const props = withDefaults(defineProps<{
  currentTheme?: string;
}>(), {
  currentTheme: 'theme-default'
});

// Reference to the hero section component
const heroSectionRef = ref(null);

// Track when hero section is mounted
const onHeroMounted = () => {
  console.log('[StickyHeroSectionTest] HeroSectionWithPhone mounted');
  
  // Give time for all child components to mount
  nextTick(() => {
    console.log('[StickyHeroSectionTest] All children should be mounted now');
  });
};

onMounted(() => {
  console.log('[StickyHeroSectionTest] Component mounted');
});
</script>
