<template>
  <div class="progressive-reveal overflow-visible" ref="sectionContainerRef">
    <!-- Introduction section with floating chat on left -->
    <ChatScrollSection
      phonePosition="left"
      :messages="getHurdlesIntroduction()"
      :showTypingFor="[0, 1]"
      :tilt-x="8"
      :tilt-y="20"
      sectionId="hurdles-intro"
      layout="content-right"
      :containerHeight="introContainerHeight"
      :debug="false"
      customClass="hurdles-intro-section"
      ref="introSectionRef"
    >
      <template #headline>
        <TextAnimation 
          class="text-3xl font-bold text-center gradient-text mb-40" 
          firstPart="Website Solutions"
          animation="fadeUp" 
          :useGradient="true" 
          :duration="3" 
          :initiallyHidden="true" 
        />
      </template>
      <template #subheadline>
        <TextAnimation 
        ref="splitTextRef"
        class="text-3xl font-bold text-center gradient-text" 
        firstPart="From Frustration" 
        animation="slideInRight" 
        :useGradient="true" 
        :delay="3" 
        :duration="3"
        :initiallyHidden="true"
        :wordEffects="true"
        :wordTargets="['Frustration']"
        :wordEffectClasses="[
          'frustration-word'
        ]"
        :wordEffectDuration="2"
        :wordEffectDelay=".3"
      />
       <!-- Add ember effect for "Frustration" word -->
       <EmberAnimation 
        :targetElement="frustrationElement" 
        effectType="ember"
        :particleCount="20"
        :duration="2.5"
        :colors="['#ff4500', '#ff7800', '#ffaa33', '#ffcc00']"
        :relativeToParent="true"
        :startDelay="emberDelay"
        :active="frustrationElement !== null"
        @ember-start="handleEmberStart"
      />
      </template>
    </ChatScrollSection>
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
    <!-- Transition section with floating chat on right -->
    <ChatScrollSection
      phonePosition="right"
      :messages="getTransitionToSolutions()"
      :showTypingFor="[0, 1]"
      :tilt-x="8"
      :tilt-y="-20"
      sectionId="solutions"
      layout="content-left"
      :containerHeight="solutionsContainerHeight"
      :debug="false"
      customClass="solutions-intro-section"
      :initiallyHidden="true" 
      ref="solutionsSectionRef"
    >
      <template #subheadline>
        <TextAnimation 
        ref="toFantasticRef"
        class="text-3xl font-bold text-center gradient-text" 
        firstPart="To Fantastic" 
        animation="slideInLeft" 
        :useGradient="true" 
        :delay="3" 
        :duration="3"
        :initiallyHidden="true"
        :wordEffects="true"
        :wordTargets="['Fantastic']"
        :wordEffectClasses="[
          'fantastic-word'
        ]"
        :wordEffectDuration="2"
        :wordEffectDelay=".3"
      />
      </template>
    </ChatScrollSection>
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
import { ref, onMounted, computed, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import ChatScrollSection from '@/components/sections/ChatScrollSection.vue';
import StickyScrollableCardsSection from '@/components/sections/StickyScrollableCardsSection.vue';
import { getHurdlesIntroduction, getTransitionToSolutions } from '@/data/chatSections';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import EmberAnimation from '@/components/effects/EmberAnimation.vue';
import { calculateContainerHeight } from '@/utils/containerHeightUtils';
import TextAnimation from '@/components/text/TextAnimation.vue';

const frustrationElement = ref<HTMLElement | null>(null);
// Computed value for ember delay
const emberDelay = ref(0.5);
const emberStartTime = ref<number | null>(null);

// Reference to the main container
const sectionContainerRef = ref<HTMLElement | null>(null);
const introSectionRef = ref(null);
const splitTextRef = ref<HTMLElement | null>(null);
const toFantasticRef = ref<HTMLElement | null>(null);

// Computed property to reverse the solutions array
const reversedSolutions = computed(() => [...solutions].reverse());

// Computed container heights
const introContainerHeight = computed(() => 
  calculateContainerHeight(getHurdlesIntroduction().length, { heightMultiplier: 1.3 })
);

const solutionsContainerHeight = computed(() => 
  calculateContainerHeight(getTransitionToSolutions().length, { heightMultiplier: 1.3 })
);

const handleEmberStart = () => {
  emberStartTime.value = Date.now();
};
// Lifecycle hooks
onMounted(() => {
  // Find the frustration element after component is mounted
  setTimeout(() => {
    frustrationElement.value = document.querySelector('.frustration-word');
  }, 500);
});

onUnmounted(() => {
  // console.log('[Refactored] HurdlesSolutionsSection unmounted');
});
</script>

<style lang="scss" scoped>
.progressive-reveal {
  position: relative;
  margin-top: 200px;
  
  &.debug {
    border: 1px solid red;
  }
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
    grid-template-rows: 1fr; /* Force single row */
    
    .phone-area {
      grid-column: 1 / 2;
      grid-row: 1 / 2; /* Explicitly set to first row */
      z-index: 2;
      align-self: center;
      justify-self: center;
    }
    
    .content-area {
      grid-column: 2 / 3;
      grid-row: 1 / 2; /* Explicitly set to first row */
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
