<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { heroSectionAnimations } from '@/animations/heroSection';
import { HeroContent, getRandomHeroContent } from '@/data/heroContent';

const heroContent = ref<HeroContent>(getRandomHeroContent());
import { getInitialConversation } from '@/data/chatSections';
import FlexibleContentWithPhone from '@/components/sections/FlexibleContentWithPhone.vue';

onMounted(() => {
  heroSectionAnimations.contentFadeIn();
});
</script>

<template>
  <section
    class="min-h-screen flex items-center relative overflow-hidden theme-bg--primary mx-auto px-4 md:px-8 h-full">
    <FlexibleContentWithPhone phonePosition="right" :messages="getInitialConversation()" :showTypingFor="[0, 1]"
      :tilt-x="8" :tilt-y="-20" sectionId="hero-phone" layout="content-left" :animation="{
        contentFirst: true,
        duration: 0.7,
        phoneDelay: 1
      }" :pin-settings="{
          enabled: false // Disable phone's own pinning since parent is pinned
        }" :initiallyHidden="true" ref="flexibleContentRef">
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
</template>
<style lang="scss">
[class*="pin-spacer"] {
  top: 200px !important;
}
</style>
