<template>
  <div class="progressive-reveal overflow-visible" ref="sectionContainerRef">
    <!-- Introduction section with phone on left -->
    <StickyFlexibleContent
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
        <AnimatedText 
          class="text-3xl font-bold text-center gradient-text mb-40" 
          firstPart="Website Solutions"
          animation="fadeUp" 
          :useGradient="true" 
          :duration="3" 
          :initiallyHidden="true" 
        />
      </template>
      <template #subheadline>
        <AnimatedText 
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
        :wordEffectTypes="['highlight']"
        :wordEffectStyles="[
          { 
            gradientClass: 'gradient-theme-fire',
            iterations: 3,
            customStyles: {
              transform: 'scale(1.05)',
              display: 'inline-block',
              position: 'relative',
              transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }
          }
        ]"
        :wordEffectDuration="2"
        :wordEffectDelay=".3"
      />
       <!-- Add ember effect for "Frustration" word -->
       <EmberEffect 
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
    </StickyFlexibleContent>
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
    <!-- Introduction section with phone on left -->
    <StickyFlexibleContent
      phonePosition="right"
      :messages="getTransitionToSolutions()"
      :showTypingFor="[0, 1]"
      :tilt-x="8"
      :tilt-y="-20"
      sectionId="solutions"
      layout="content-left"
      :containerHeight="solutionsContainerHeight"
      :animation="{
        contentFirst: true,
        duration: 0.7,
        phoneDelay: 1
      }"
      :debug="false"
      customClass="solutions-intro-section"
      :initiallyHidden="true" 
      ref="solutionsSectionRef"
    >
      <template #subheadline>
        <AnimatedText 
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
        :wordEffectTypes="['highlight']"
        :wordEffectStyles="[
          { 
            gradientClass: 'gradient-theme-cool',
            iterations: 3,
            customStyles: {
              transform: 'scale(1.05)',
              display: 'inline-block',
              position: 'relative',
              transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }
          }
        ]"
        :wordEffectDuration="2"
        :wordEffectDelay=".3"
      />
       <!-- Add ember effect for "Frustration" word -->
       <!-- <EmberEffect 
        :targetElement="frustrationElement" 
        effectType="ember"
        :particleCount="20"
        :duration="2.5"
        :colors="['#ff4500', '#ff7800', '#ffaa33', '#ffcc00']"
        :relativeToParent="true"
        :startDelay="emberDelay"
        :active="frustrationElement !== null"
        @ember-start="handleEmberStart"
      /> -->
      </template>
    </StickyFlexibleContent>
     <!-- NEW Hurdles Section -->
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
import StickyFlexibleContent from '@/components/sections/refactored/StickyFlexibleContent.vue';
import ScrollableCardsSection from '@/components/sections/ScrollableCardsSection.vue';
import StickyScrollableCardsSection from '@/components/sections/refactored/StickyScrollableCardsSection.vue';
import { getHurdlesIntroduction, getTransitionToSolutions } from '@/data/chatSections';
import { getTimestampForLog, formatElapsedTime } from '@/utils/timestamp';
import { struggles, solutions } from '@/data/strugglesAndSolutions';
import EmberEffect from '@/components/effects/EmberEffect.vue';
import { calculateContainerHeight } from '@/utils/containerHeightUtils';

const frustrationElement = ref<HTMLElement | null>(null);
// Computed value for ember delay
const emberDelay = ref(0.5);
const emberStartTime = ref<number | null>(null);

// Reference to the main container
const sectionContainerRef = ref<HTMLElement | null>(null);
const introSectionRef = ref(null);
const splitTextRef = ref(null);

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
  // console.log('[Refactored] HurdlesSolutionsSection mounted');
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
