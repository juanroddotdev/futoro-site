<template>
  <div class="hero-section-chat">
    <ScrollableChatSection
      :messages="heroMessages"
      :showTypingFor="[0, 1]"
      :layout="layout"
      :sectionId="sectionId"
      :containerHeight="calculateHeroContainerHeight(heroMessages.length)"
      :tiltX="8"
      :tiltY="-20"
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
    </ScrollableChatSection>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ScrollableChatSection from '@/components/sections/refactored/ScrollableChatSection.vue';
import { getInitialConversation } from '@/data/chatSections';
import { HeroContent, getRandomHeroContent } from '@/data/heroContent';
import { calculateContainerHeight } from '@/utils/containerHeightUtils';

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
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  
  // Import hero section styles
  :deep(.scrollable-chat-section) {
    min-height: 100vh;
    display: flex;
    align-items: center;
    
    .section-container {
      padding: 2rem;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      
      @media (min-width: 768px) {
        padding: 4rem 2rem;
      }
    }
    
    .section-inner {
      gap: 2rem;
      
      @media (min-width: 1024px) {
        gap: 4rem;
      }
    }
    
    .content-area {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 2rem 0;
      
      @media (min-width: 768px) {
        padding: 3rem 0;
      }
    }
  }
}

.headline {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
}

.subheadline {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
}

.heading-responsive {
  font-size: clamp(2rem, 5vw, 3.5rem);
}

.subheading-responsive {
  font-size: clamp(1rem, 3vw, 1.5rem);
}

// Add hero-specific styling
.flex {
  display: flex;
  
  &.gap-4 {
    gap: 1rem;
  }
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

// Button styles
.btn-round-large-primary,
.btn-round-large-outline-primary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.btn-round-large-primary {
  background-color: var(--theme-primary);
  color: var(--theme-text-on-primary);
  
  &:hover {
    background-color: var(--theme-primary-dark);
  }
}

.btn-round-large-outline-primary {
  border: 2px solid var(--theme-primary);
  color: var(--theme-primary);
  
  &:hover {
    background-color: var(--theme-primary-light);
  }
}
</style>
