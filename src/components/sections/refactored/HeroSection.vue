<template>
  <ScrollablePhoneSection
    :messages="heroMessages"
    :showTypingFor="[0, 1]"
    :tilt-x="tiltX" 
    :tilt-y="tiltY" 
    :layout="layout"
    :phonePosition="phonePosition"
    :sectionId="sectionId"
    :containerHeight="calculateHeroContainerHeight(heroMessages.length)"
    :debug="debug"
    :customClass="customClass"
  >
    <template #headline>
      <h1 class="heading--accent mb-6 headline heading-responsive">
        {{ heroContent.headline }}
      </h1>
    </template>
    <template #subheadline>
      <p class="mb-8 subheadline subheading-responsive heading heading--highlight">
        {{ heroContent.subheadline }}
      </p>
      <div class="flex gap-4">
        <a :href="primaryCtaLink" class="btn-round-large-primary cta">
          {{ heroContent.cta }}
        </a>
        <a :href="secondaryCtaLink" class="btn-round-large-outline-primary">
          {{ secondaryCtaText }}
        </a>
      </div>
    </template>
  </ScrollablePhoneSection>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ScrollablePhoneSection from '@/components/sections/refactored/ScrollablePhoneSection.vue';
import { getInitialConversation } from '@/data/chatSections';
import { HeroContent, getRandomHeroContent } from '@/data/heroContent';
import { calculateContainerHeight } from '@/utils/containerHeightUtils';

// Define props with defaults
const props = withDefaults(defineProps<{
  heroContent?: HeroContent;
  tiltX?: number;
  tiltY?: number;
  layout?: 'content-left' | 'content-right' | 'content-top';
  phonePosition?: 'left' | 'right' | 'center';
  sectionId?: string;
  debug?: boolean;
  customClass?: string;
  primaryCtaLink?: string;
  secondaryCtaLink?: string;
  secondaryCtaText?: string;
  messages?: any[];
}>(), {
  heroContent: undefined,
  tiltX: 8,
  tiltY: -20,
  layout: 'content-left',
  phonePosition: 'right',
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
    baseHeight: 100,
    itemHeight: 15,
    padding: 100,
    heightMultiplier: 1.5
  });
};
</script>

<style lang="scss" scoped>
// Add any hero-specific styles here
</style>