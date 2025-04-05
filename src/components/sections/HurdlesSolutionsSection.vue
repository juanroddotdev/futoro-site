<template>
  <div class="progressive-reveal overflow-visible" ref="sectionContainerRef">
    <AnimatedOutlineToFillText
      class="heading-responsive solutions-heading font-bold text-center"
      text="Website Solutions"
      animation="fadeUp"
      :duration="1.5"
      :delay="0"
      :initiallyHidden="true"
      :triggerOnVisible="false"
      :triggerOnScroll="true"
      :scrub="2"
      scrollStart="top bottom"
      scrollEnd="bottom top"
      fillScrollStart="top center"
      fillScrollEnd="bottom center"
      :animateFill="true"
      :fillDuration="2.0"
      :fillDelay="1.0"
      :fluidFill="true"
      fluidFillDirection="right-to-left"
      :fluidFillDuration="3.0"
      fluidFillOverflow="fade"
      :transparentFill="true"
      :transparentFillDuration="2.5"
      ease="power2.inOut"
    />
    <TextAnimation
      ref="splitTextRef"
      class="font-bold text-center gradient-text heading-responsive"
      firstPart="From Frustration"
      secondPart="To Fantastic"
      animation="split"
      :useGradient="true"
      :duration="0.6"
      :initiallyHidden="true"
      :wordEffects="true"
      :wordTargets="['Frustration', 'Fantastic']"
      :wordEffectClasses="[
        ['frustration-word', 'gradient-theme-fire'],
        ['gradient-theme-cool'],
      ]"
      :wordEffectDuration="1.5"
      :wordEffectDelay="0.8"
      ease="power3.inOut"
      :triggerOnVisible="false"
      :triggerOnScroll="true"
      :scrub="true"
      scrollStart="top center"
      scrollEnd="bottom center"
      @word-effect-start="handleWordEffectStart"
    />
    <!-- Add ember effect for "Frustration" word -->
    <EmberAnimation
      :targetElement="frustrationElement"
      effectType="ember"
      :particleCount="30"
      :duration="0.8"
      :colors="['#ff4500', '#ff7800', '#ffaa33', '#ffcc00']"
      :relativeToParent="true"
      :startDelay="0"
      :active="true"
      ease="power2.inOut"
      @ember-start="handleEmberStart"
    />
    <EmberAnimation
      :targetElement="toFantasticRef"
      effectType="firework"
      :particleCount="60"
      :duration="0.8"
      :colors="['#00aaff', '#00ccff', '#00eeff', '#00ffff']"
      :relativeToParent="false"
      :startDelay="0"
      :offsetX="100"
      :offsetY="-200"
      :originX="50"
      :originY="0"
      :active="true"
      ease="power2.inOut"
      @ember-start="handleEmberStart"
    />

    <!-- NEW Hurdles Section -->
    <StickyScrollableCardsSection
      sectionId="stickyHurdlesSection"
      containerId="stickyHurdlesContainer"
      title="Common Hurdles"
      :items="struggles"
      sectionClass="hurdles-section sticky-version"
      cardClass="struggle-card"
      headerContainerClass="header-container--hurdles"
      titleAnimation="slideInRight"
      :reverseLayout="false"
      containerHeight="250vh"
      :debug="false"
    />

    <!-- Solutions Section -->
    <StickyScrollableCardsSection
      sectionId="solutionsSection"
      containerId="solutionsContainer"
      title="Clear Solutions"
      :items="reversedSolutions"
      sectionClass="solutions-section sticky-version"
      cardClass="solution-card"
      headerContainerClass="header-container--solutions"
      titleAnimation="slideInLeft"
      :reverseLayout="true"
      containerHeight="250vh"
      :debug="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, nextTick } from "vue";
import type { Ref } from "vue";
import ChatScrollSection from "@/components/sections/ChatScrollSection.vue";
import StickyScrollableCardsSection from "@/components/sections/StickyScrollableCardsSection.vue";
import {
  getHurdlesIntroduction,
  getTransitionToSolutions,
} from "@/data/chatSections";
import { struggles, solutions } from "@/data/strugglesAndSolutions";
import EmberAnimation from "@/components/effects/EmberAnimation.vue";
import { calculateContainerHeight } from "@/utils/containerHeightUtils";
import TextAnimation from "@/components/text/TextAnimation.vue";
import OutlineToFillText from "@/components/text/OutlineToFillText.vue";
import AnimatedOutlineToFillText from "@/components/text/AnimatedOutlineToFillText.vue";

const frustrationElement = ref<HTMLElement | null>(null);
// Computed value for ember delay
const emberDelay = ref(0);
const emberStartTime = ref<number | null>(null);

// Reference to the main container
const sectionContainerRef = ref<HTMLElement | null>(null);
const introSectionRef = ref(null);
const splitTextRef = ref<HTMLElement | null>(null);
const toFantasticRef = ref<HTMLElement | null>(null);
const fantasticWrapperRef = ref<HTMLElement | null>(null);

// Computed property to reverse the solutions array
const reversedSolutions = computed(() => [...solutions].reverse());

// Computed container heights
const introContainerHeight = computed(() =>
  calculateContainerHeight(getHurdlesIntroduction().length, {
    heightMultiplier: 1.3,
  })
);

const solutionsContainerHeight = computed(() =>
  calculateContainerHeight(getTransitionToSolutions().length, {
    heightMultiplier: 1.3,
  })
);

const handleWordEffectStart = () => {
  // Find the frustration element when word effects start
  nextTick(() => {
    frustrationElement.value = document.querySelector(".frustration-word");
    toFantasticRef.value = document.querySelector(".gradient-theme-cool");

    // Add a delay before starting ember effects
    setTimeout(() => {
      // Force the ember effects to start
      if (frustrationElement.value) {
        const emberEvent = new CustomEvent('ember-start');
        frustrationElement.value.dispatchEvent(emberEvent);
      }
      if (toFantasticRef.value) {
        const fireworkEvent = new CustomEvent('ember-start');
        toFantasticRef.value.dispatchEvent(fireworkEvent);
      }
    }, 250);
  });
};

const handleEmberStart = () => {
  emberStartTime.value = Date.now();
};

// Lifecycle hooks
onMounted(() => {
  
});
</script>

<style lang="scss" scoped>
.progressive-reveal {
  position: relative;
  margin-top: 200px;
  text-align: center;

  &.debug {
    border: 1px solid red;
  }
}
.solutions-heading {
  font-size: clamp(6rem, 8vw, 8rem);
}

.section-separator {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 50px 0;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
}

.comparison-title {
  font-size: 1.5rem;
  color: var(--theme-text-color, #ffffff);
  opacity: 0.7;
}

:deep(.hurdles-intro-section) {
  .section-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    /* Force single row */

    .phone-area {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      /* Explicitly set to first row */
      z-index: 2;
      align-self: center;
      justify-self: center;
    }

    .content-area {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
      /* Explicitly set to first row */
      z-index: 1;
      align-self: center;
    }
  }
}

/* Media query to handle mobile layout */
@media (max-width: 768px) {
  :deep(.hurdles-intro-section) {
    .section-inner {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;

      .phone-area {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
      }

      .content-area {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
      }
    }
  }
}
</style>
