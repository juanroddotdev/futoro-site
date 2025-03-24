<template>
  <SimpleFlexibleContent
    :messages="messages"
    :showTypingFor="[0, 1]"
    layout="content-left"
    phonePosition="right"
    :tiltX="8"
    :tiltY="-20"
    sectionId="hero-section"
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
    </template>
    <template #content>
      <div class="flex gap-4">
        <a href="#contact" class="btn-round-large-primary cta">
          {{ heroContent.cta }}
        </a>
        <a href="#services" class="btn-round-large-outline-primary">
          Our Services
        </a>
      </div>
    </template>
  </SimpleFlexibleContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { HeroContent, getRandomHeroContent } from '@/data/heroContent';
import { getInitialConversation } from '@/data/chatSections';
import SimpleFlexibleContent from './SimpleFlexibleContent.vue';

// Define props
const props = withDefaults(defineProps<{
  currentTheme?: string;
}>(), {
  currentTheme: 'theme-default'
});

const heroContent = ref<HeroContent>(getRandomHeroContent());
const messages = getInitialConversation();
</script>

<style lang="scss">
.simple-hero-section {
  width: 100%;
  min-height: 100vh;
  
  .hero-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 100vh;
    padding: 2rem;
    
    .content-area {
      grid-column: 1 / 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 2rem;
    }
    
    .phone-area {
      grid-column: 2 / 3;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

@media (max-width: 768px) {
  .simple-hero-section {
    .hero-content {
      grid-template-columns: 1fr;
      
      .content-area, .phone-area {
        grid-column: 1 / 2;
      }
      
      .phone-area {
        margin-top: 2rem;
      }
    }
  }
}
</style>
