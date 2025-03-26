<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { heroSectionAnimations } from '@/animations/heroSection';
import { HeroContent, getRandomHeroContent } from '@/data/heroContent';
import { getInitialConversation } from '@/data/chatSections';
import FlexibleContentWithPhone from '@/_unused/components/FlexibleContentWithPhone.vue';

const heroContent = ref<HeroContent>(getRandomHeroContent());
const flexibleContentRef = ref(null);
const messages = getInitialConversation();

// Calculate wrapper height based on messages
const wrapperHeight = computed(() => {
  const baseHeight = 100; // Base viewport height
  const messageHeight = 50; // Height per message in vh
  return `${baseHeight + (messages.length * messageHeight)}vh`;
});

onMounted(() => {
  heroSectionAnimations.contentFadeIn();
});
</script>

<template>
  <div class="hero-wrapper" :style="{ height: wrapperHeight }">
    <section
      class="hero-section min-h-screen flex items-center relative overflow-hidden theme-bg--primary mx-auto px-4 md:px-8 h-full">
      <FlexibleContentWithPhone phonePosition="right" :messages="getInitialConversation()" :showTypingFor="[0, 1]"
        :tilt-x="8" :tilt-y="-20" sectionId="hero-phone" layout="content-left" 
        :stickySection="false"
        :animation="{
          contentFirst: true,
          duration: 0.7,
          phoneDelay: 1
        }"
        :initiallyHidden="true" ref="flexibleContentRef">
        <template #headline>
          <h1 class="heading--accent mb-6 headline heading-responsive">{{ heroContent.headline }}</h1>
        </template>
        <template #subheadline>
          <p class="mb-8 subheadline subheading-responsive heading heading--highlight">{{ heroContent.subheadline }}</p>
          <div class="flex gap-4">
            <a href="#contact" class="btn-round-large-primary cta">
              {{ heroContent.cta }}
            </a>
            <a href="#services" class="btn-round-large-outline-primary">
              Our Services
            </a>
          </div>
        </template>
      </FlexibleContentWithPhone>
    </section>
  </div>
</template>
<style lang="scss">
[class*="pin-spacer"] {
  top: 200px !important;
}

.hero-wrapper {
  position: relative;
}

.hero-section {
  position: sticky;
  top: 0;
  z-index: 2;
}
</style>
