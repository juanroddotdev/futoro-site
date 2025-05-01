<template>
  <div class="hero-section-chat hero-section-mobile">
    <TwoColumnSection :layout="layout" :customClass="customClass">  
      <template #headline>
        <div class="hero-content-mobile">
          <h1 class="heading--accent mb-4 mt-2 heading-responsive-large theme-text--gradient-animated gradient-shine">
            <TextAnimation 
              :firstPart="heroContent.headline" 
              animation="fadeUp" 
              :useGradient="true"
              :duration="3" 
              :initiallyHidden="true" 
              :triggerOnVisible="true" 
              :restartOnVisible="true" 
            />
          </h1>
        </div>
      </template>
      <template #subheadline>
        <div class="hero-content-mobile">
          <p class="mb-8 subheading-responsive heading--highlight">
            <TextAnimation 
              :firstPart="heroContent.subheadline" 
              animation="fade" 
              :useGradient="true"
              :duration="3" 
              :initiallyHidden="true" 
              :triggerOnVisible="true" 
              :restartOnVisible="true" 
            />
          </p>
        </div>
      </template>
      <template #content>
        <div class="hero-content-mobile">
          <div class="flex gap-4">
            <a :href="primaryCtaLink" class="btn-round--secondary btn-round--large cta">
              {{ heroContent.cta }}
            </a>
            <a :href="secondaryCtaLink" class="btn-round-large-outline-secondary">
              {{ secondaryCtaText }}
            </a>
          </div>
        </div>
      </template>
      <template #right-content>
        <div class="right-content-placeholder right-content-placeholder-mobile">
          <!-- Placeholder for right content -->
        </div>
      </template>
    </TwoColumnSection>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ChatScrollSection from '@/components/sections/ChatScrollSection.vue';
import { getInitialConversation } from '@/data/chatSections';
import { HeroContent, getRandomHeroContent } from '@/data/heroContentData';
import { calculateContainerHeight } from '@/utils/containerHeightUtils';
import TextAnimation from '../text/TextAnimation.vue';
import TwoColumnSection from '@/components/sections/TwoColumnSection.vue';
// Define props with defaults
const props = withDefaults(defineProps<{
  heroContent?: HeroContent;
  layout?: 'content-left' | 'content-right' | 'content-top';
  sectionId?: string;
  debug?: boolean;
  customClass?: string;
  primaryCtaLink?: string;
  secondaryCtaLink?: string;
  secondaryCtaText?: string;
  messages?: any[];
}>(), {
  heroContent: undefined,
  layout: 'content-left',
  sectionId: 'hero-section',
  debug: false,
  customClass: 'dark-theme',
  primaryCtaLink: '#contact',
  secondaryCtaLink: '#services',
  secondaryCtaText: 'Our Services',
  messages: undefined
});

// Use provided hero content or get random one
const heroContent = computed(() => props.heroContent || getRandomHeroContent());

// Use provided messages or get default ones
const heroMessages = computed(() => props.messages || getInitialConversation());

// Calculate container height based on message count
const calculateHeroContainerHeight = (messageCount: number) => {
  return calculateContainerHeight(messageCount, {
    baseHeight: 100, // Increased base height
    itemHeight: 30,  // Increased item height
    padding: 150,    // Increased padding
    heightMultiplier: 1.5 // Increased multiplier
  });
};

// Define emits
const emit = defineEmits<{
  (e: 'mounted'): void;
}>();

// Emit mounted event when component is mounted
onMounted(() => {
  emit('mounted');
});
</script>

<style lang="scss" scoped>
.hero-section-chat {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;

  :deep(.heading--accent) {
    position: relative;
    z-index: 10;
  }

  :deep(.heading--highlight) {
    position: relative;
    z-index: 10;
  }

  :deep(.content-area) {
    position: relative;
    z-index: 10;
  }
}

.hero-content-mobile {
  width: 100%;
  max-width: 100%;
}

.right-content-placeholder {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
