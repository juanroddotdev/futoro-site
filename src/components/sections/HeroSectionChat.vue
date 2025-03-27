<template>
  <div class="hero-section-chat">
    <ChatScrollSection
      :messages="heroMessages"
      :showTypingFor="[0, 1]"
      :layout="layout"
      :sectionId="sectionId"
      :containerHeight="calculateHeroContainerHeight(heroMessages.length)"
      :tiltX="1"
      :tiltY="-5"
      :debug="debug"
      :customClass="customClass"
    >
      <template #headline>
        <h1 class="heading--accent mb-4 heading-responsive theme-text--gradient-animated gradient-shine">
          <TextAnimation 
            :firstPart="heroContent.headline" 
            animation="fadeUp" 
            :useGradient="true"
            :duration="3" 
            :initiallyHidden="true" 
            :triggerOnVisible="true" 
            :restartOnVisible="true" 
          />
          <!-- {{ heroContent.headline }} -->
        </h1>
      </template>
      <template #subheadline>
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
          <!-- {{ heroContent.subheadline }} -->
        </p>
        <div class="flex gap-4">
          <a :href="primaryCtaLink" class="btn-round--secondary btn-round--large cta">
            {{ heroContent.cta }}
          </a>
          <a :href="secondaryCtaLink" class="btn-round-large-outline-secondary">
            {{ secondaryCtaText }}
          </a>
        </div>
      </template>
    </ChatScrollSection>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ChatScrollSection from '@/components/sections/ChatScrollSection.vue';
import { getInitialConversation } from '@/data/chatSections';
import { HeroContent, getRandomHeroContent } from '@/data/heroContentData';
import { calculateContainerHeight } from '@/utils/containerHeightUtils';
import TextAnimation from '../text/TextAnimation.vue';

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


</style>
