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
    :isUnlocked="isUnlocked"
    :ambientMode="ambientMode"
    :enablePullEffect="enablePullEffect"
    :ambientTheme="ambientTheme"
    :unlockAnimationType="unlockAnimationType"
    @pull-threshold-reached="onPullThresholdReached"
    @unlock="onUnlock"
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
  isUnlocked?: boolean;
  ambientMode?: boolean;
  enablePullEffect?: boolean;
  ambientTheme?: {
    baseColor?: string;
    endColor?: string;
    accentColor?: string;
  };
  unlockAnimationType?: 'wave' | 'ripple';
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
  messages: undefined,
  isUnlocked: false,
  ambientMode: true, // Start in ambient mode
  enablePullEffect: true,
  ambientTheme: () => ({
    baseColor: '#1a1f2c',
    endColor: '#2E3440',
    accentColor: 'rgba(245, 245, 245, 0.3)'
  }),
  unlockAnimationType: 'wave'
});

// Use provided hero content or get random one
const heroContent = computed(() => props.heroContent || getRandomHeroContent());

// Use provided messages or get default ones
const heroMessages = computed(() => props.messages || getInitialConversation());

// Calculate container height based on message count
const calculateHeroContainerHeight = (messageCount: number) => {
  return calculateContainerHeight(messageCount, {
    baseHeight: 100,
    itemHeight: 20,
    padding: 100,
    heightMultiplier: 1.8
  });
};

// Add the emit definition
const emit = defineEmits(['pull-threshold-reached', 'unlock']);

// Add state for phone lock status and threshold tracking
const isPhoneUnlocked = ref(props.isUnlocked);
const thresholdReached = ref(false);

// Update event handlers
const onPullThresholdReached = () => {
  // Only emit once if not already unlocked
  if (!thresholdReached.value && !isPhoneUnlocked.value) {
    thresholdReached.value = true;
    emit('pull-threshold-reached');
  }
};

const onUnlock = () => {
  // Only emit once if not already unlocked
  if (!isPhoneUnlocked.value) {
    isPhoneUnlocked.value = true;
    emit('unlock');
  }
};
</script>

<style lang="scss" scoped>
// Add any hero-specific styles here
</style>
