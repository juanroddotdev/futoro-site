<script setup lang="ts">
import { onMounted, ref, computed, defineEmits } from 'vue';
import { heroSectionAnimations } from '@/animations/heroSection';
import { HeroContent, getRandomHeroContent } from '@/data/heroContent';
import PhoneSection from '@/components/PhoneSection.vue';
import { getInitialConversation } from '@/data/chatSections';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
// Add import for FlexibleContentWithPhone
import FlexibleContentWithPhone from '@/components/sections/FlexibleContentWithPhone.vue';

gsap.registerPlugin(ScrollTrigger);

const heroContent = ref<HeroContent>(getRandomHeroContent());
const heroRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const navRef = ref<HTMLElement | null>(null);
const messages = getInitialConversation();
// Add ref for FlexibleContentWithPhone
const flexibleContentRef = ref(null);

// Calculate wrapper height based on messages
const wrapperHeight = computed(() => {
  const baseHeight = 100; // Base viewport height
  const messageHeight = 50; // Height per message in vh
  return `${baseHeight + (messages.length * messageHeight)}vh`;
});

// Define emits
const emit = defineEmits(['mounted']);

onMounted(() => {
  console.log('[HeroSectionWithPhone] Component mounted');
  
  // Emit mounted event
  emit('mounted');

  if (!heroRef.value || !contentRef.value) return;

  // Initial content animation
  heroSectionAnimations.contentFadeIn();

  // Remove GSAP ScrollTrigger for the hero section
  // Let CSS handle the stickiness
});
</script>

<template>
  <div class="hero-wrapper" :style="{ height: wrapperHeight }">
    <!-- New implementation using FlexibleContentWithPhone -->
    <section ref="heroRef" class="hero-section">
      <FlexibleContentWithPhone 
        phonePosition="right" 
        :messages="getInitialConversation()" 
        :showTypingFor="[0, 1]"
        :tilt-x="8" 
        :tilt-y="-20" 
        sectionId="hero-phone" 
        layout="content-left" 
        :stickySection="false"
        :animation="{
          contentFirst: true,
          duration: 0.7,
          phoneDelay: 1
        }"
        :initiallyHidden="true" 
        ref="flexibleContentRef"
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
            <a href="#contact" class="btn-round-large-primary cta">
              {{ heroContent.cta }}
            </a>
            <a href="#services" class="btn-round-large-outline-primary">
              Our Services
            </a>
          </div>
        </template>
      </FlexibleContentWithPhone>
      
      <!-- Original implementation (commented out) -->
      <!--
      <div class="hero-grid">
        <div class="headline-area">
          <h1 class="heading--accent mb-6 headline heading-responsive">
            {{ heroContent.headline }}
          </h1>
        </div>
        <div class="subheadline-area">
          <p class="mb-8 subheadline subheading-responsive heading heading--highlight">
            {{ heroContent.subheadline }}
          </p>
        </div>
        <div class="cta-area">
          <div class="flex gap-4">
            <a 
              href="#contact" 
              class="btn-round-large-primary cta"
            >
              {{ heroContent.cta }}
            </a>
            <a 
              href="#services" 
              class="btn-round-large-outline-primary"
            >
              Our Services
            </a>
          </div>
        </div>
        <div class="phone-area">
          <PhoneSection
            :messages="getInitialConversation()" 
            sectionId="hero-phone"
            :showTypingFor="[0, 1]"
            :tilt-x="8"
            :tilt-y="-20"
            position="right"
            class="hero-phone"
            :pin-settings="{
              enabled: false // Disable phone's own pinning since parent is pinned
            }"
          />
        </div>
      </div>
      -->
    </section>
  </div>
</template>

<style lang="scss">
.hero-wrapper {
  position: relative;
}

.hero-section {
  min-height: 100vh;
  width: 100%;
  position: sticky; // Make it sticky
  top: 0;         // Stick to top
  
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto 1fr;
    // gap: 2rem;
    min-height: 100vh;
    padding: 2rem;
    position: relative;
    z-index: 2;
    
    .headline-area {
      grid-column: 1 / -1;
      grid-row: 1 / 2;
      // background: rgba(255,255,255,0.1);
      padding: 1rem 1rem 0 1rem;
      .headline {
        margin-bottom: 0;
      }
    }
    
    .subheadline-area {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
      // background: rgba(255,255,255,0.1);
      padding: 0 1rem;
    }
    
    .cta-area {
      grid-column: 1 / 2;
      grid-row: 3 / 4;
      // background: rgba(255,255,255,0.1);
      padding: 1rem;
    }
    
    .phone-area {
      grid-column: 2 / -1;
      grid-row: 2 / -1;
      // background: rgba(255,255,255,0.1);
      padding: 1rem;
      align-self: start;
      position: relative;
      
      .container {
        min-height: unset;
        padding-top: 0;
      }
    }
  }
}

[class*="pin-spacer"] {
  top: 200px !important;
}

// Keep all content above message animations
.headline-area,
.subheadline-area,
.cta-area {
  position: relative;
  z-index: 3;
}
.hero-phone {
  top: 20vh !important;
}
</style> 
