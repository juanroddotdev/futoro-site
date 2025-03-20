<script setup lang="ts">
import { inject, computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  id?: string,
  theme?: string,
  pattern?: 'grid' | 'dots' | 'diagonal-lines' | 'diamonds' | 'hexagons' | 'checkerboard' | 'stripes' | 'circuit' | 'blueprint',
  floating?: boolean,
  spotlight?: boolean,
  spotlightCorner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
  spotlightSize?: 'small' | 'medium' | 'large',
  intensity?: 'low' | 'medium' | 'high',
  fade?: boolean
}>();

// Add reactive refs to store updated values from events
const localPattern = ref(props.pattern);
const localIntensity = ref(props.intensity);
const localFloating = ref(props.floating);
const localSpotlight = ref(props.spotlight);
const localFade = ref(props.fade);
const localSpotlightCorner = ref(props.spotlightCorner);
const localSpotlightSize = ref(props.spotlightSize);

// Inject global grid settings with fallback to props
const globalPattern = inject('gridPattern', null);
const globalIntensity = inject('gridIntensity', null);
const globalFloating = inject('gridFloating', null);
const globalSpotlight = inject('gridSpotlight', null);
const globalFade = inject('gridFade', null);

// Use global settings if available, otherwise use local or props
const effectivePattern = computed(() => globalPattern || localPattern.value || props.pattern || 'grid');
const effectiveIntensity = computed(() => globalIntensity || localIntensity.value || props.intensity || 'medium');
const effectiveFloating = computed(() => globalFloating !== null ? globalFloating : (localFloating.value !== undefined ? localFloating.value : props.floating || false));
const effectiveSpotlight = computed(() => globalSpotlight !== null ? globalSpotlight : (localSpotlight.value !== undefined ? localSpotlight.value : props.spotlight || false));
const effectiveFade = computed(() => globalFade !== null ? globalFade : (localFade.value !== undefined ? localFade.value : props.fade || false));
const effectiveSpotlightCorner = computed(() => localSpotlightCorner.value || props.spotlightCorner || 'top-left');
const effectiveSpotlightSize = computed(() => localSpotlightSize.value || props.spotlightSize || 'medium');

// Listen for overlay updates
onMounted(() => {
  if (props.id) {
    // Log initial pattern
    console.log(`Initial pattern for ${props.id}:`, effectivePattern.value);
    console.log(`Initial class:`, `pattern-${effectivePattern.value}`);
    
    document.documentElement.addEventListener('overlay-updated', ((event: CustomEvent) => {
      if (event.detail.id === props.id) {
        // Log the update event
        console.log(`Overlay ${props.id} received update:`, event.detail.settings);
        
        // Update local state with the new settings
        const settings = event.detail.settings;
        localPattern.value = settings.pattern;
        localIntensity.value = settings.intensity;
        localFloating.value = settings.floating;
        localSpotlight.value = settings.spotlight;
        localFade.value = settings.fade;
        localSpotlightCorner.value = settings.spotlightCorner;
        localSpotlightSize.value = settings.spotlightSize;
        
        // For debugging, let's log what's currently being used
        console.log('New pattern:', localPattern.value);
        console.log('Effective pattern:', effectivePattern.value);
        console.log('New class:', `pattern-${effectivePattern.value}`);
      }
    }) as EventListener);
  }
});

// Add a watcher to log when pattern changes
watch(effectivePattern, (newPattern) => {
  console.log(`Pattern changed to: ${newPattern}`);
  // Log the element's classes after a short delay to ensure DOM update
  setTimeout(() => {
    if (document.querySelector('.grid-paper-overlay')) {
      console.log('Current classes on element:', 
        document.querySelector('.grid-paper-overlay').className);
    }
  }, 100);
});
</script>

<template>
  <div 
    class="grid-paper-overlay"
    :class="[
      theme ? `theme-${theme}` : '',
      `pattern-${effectivePattern}`,
      { 
        'grid-paper-overlay--floating': effectiveFloating,
        'grid-paper-overlay--spotlight': effectiveSpotlight,
        'grid-paper-overlay--fade': effectiveFade,
        [`grid-paper-overlay--spotlight-${effectiveSpotlightCorner}`]: effectiveSpotlight,
        [`grid-paper-overlay--spotlight-size-${effectiveSpotlightSize}`]: effectiveSpotlight,
        [`grid-paper-overlay--intensity-${effectiveIntensity}`]: true
      }
    ]"
  >
    <!-- <div class="debug-info" style="position: absolute; top: 5px; left: 5px; font-size: 10px; color: white; background: rgba(0,0,0,0.5); padding: 5px; z-index: 100;">
      Pattern: {{ effectivePattern }}
    </div> -->
    <slot></slot>
  </div>
</template>

<style lang="scss">
@import '@/scss/components/grid-paper-overlay';
</style>
