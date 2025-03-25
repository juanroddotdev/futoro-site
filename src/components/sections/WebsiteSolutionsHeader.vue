<template>
  <div class="pb-20">
    <AnimatedText 
      class="text-3xl font-bold text-center gradient-text mb-40" 
      firstPart="Website Solutions"
      animation="fadeUp" 
      :useGradient="true" 
      :duration="3" 
      :initiallyHidden="true" 
    />
    <div class="relative">
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
        @animation-start="handleAnimationStart"
        @word-effect-start="handleWordEffectStart"
        @word-effect-complete="handleWordEffectComplete"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import EmberEffect from '@/components/effects/EmberEffect.vue';
import { getTimestampForLog, formatElapsedTime } from '@/utils/timestamp';

// Reference to the split text component
const splitTextRef = ref<{ $el: HTMLElement } | null>(null);
const frustrationElement = ref<HTMLElement | null>(null);

// Add a flag to track if animation has started
const animationStarted = ref(false);

// Add debug refs to track timing
const animationStartTime = ref<number | null>(null);
const wordEffectStartTime = ref<number | null>(null);
const emberStartTime = ref<number | null>(null);

// Computed value for ember delay
const emberDelay = ref(0.5);

// Event handlers
const handleAnimationStart = () => {
  animationStarted.value = true;
  animationStartTime.value = Date.now();
  // console.log('Animation started at:', new Date().toISOString());
  
  // Find the "Frustration" word element immediately
  nextTick(() => {
    const firstPartElement = splitTextRef.value?.$el.querySelector('.first-part');
    if (firstPartElement) {
      const wordElements = firstPartElement.querySelectorAll('span');
      wordElements.forEach(el => {
        if (el.textContent === 'Frustration') {
          frustrationElement.value = el as HTMLElement;
        }
      });
    }
  });
};

const handleWordEffectStart = () => {
  wordEffectStartTime.value = Date.now();
  // console.log('Word effect started at:', new Date().toISOString());
};

const handleWordEffectComplete = () => {
  // console.log('Word effect completed at:', new Date().toISOString());
};

const handleEmberStart = () => {
  emberStartTime.value = Date.now();
  console.log('Ember effect started at:', getTimestampForLog());
};

const handleEmberEnd = () => {
  const endTime = Date.now();
  console.log('Ember effect ended. Duration:', emberStartTime.value ? formatElapsedTime(emberStartTime.value, endTime) : 'unknown');
};
</script>
