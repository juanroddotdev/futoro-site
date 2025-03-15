<script setup>
import { ref, onMounted, onBeforeUnmount, provide, computed } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Props for the component
const props = defineProps({
  // Number of sections to coordinate
  sectionCount: {
    type: Number,
    default: 2
  },
  // Total scroll distance as percentage of viewport height
  scrollDistance: {
    type: String,
    default: '300%'
  },
  // Whether to pin the sections during scroll
  pinSections: {
    type: Boolean,
    default: true
  },
  // Smoothness of the scroll (higher = smoother)
  scrubAmount: {
    type: Number,
    default: 1
  }
});

// References
const containerRef = ref(null);

// Track active section and progress values
const activeSection = ref(0);
const sectionProgress = ref(Array(props.sectionCount).fill(0));

// Computed property for container height
const containerHeight = computed(() => props.scrollDistance);

// Track if sections are pinned
const isPinned = ref(false);

// Add these computed properties
const sectionTransitionPoint = computed(() => {
  // The point at which one section transitions to the next (0.8 = 80% through the section)
  return 0.8;
});

const sectionExitProgress = computed(() => {
  // Calculate how far into the exit transition we are for the current section
  if (activeSection.value < props.sectionCount - 1) {
    const sectionSize = 1 / props.sectionCount;
    const currentSectionProgress = sectionProgress.value[activeSection.value];
    
    if (currentSectionProgress > sectionTransitionPoint.value) {
      // Calculate normalized exit progress (0 to 1)
      return (currentSectionProgress - sectionTransitionPoint.value) / 
             (1 - sectionTransitionPoint.value);
    }
  }
  return 0;
});

const sectionEntryProgress = computed(() => {
  // Calculate how far into the entry transition we are for the next section
  if (activeSection.value > 0) {
    const previousSectionIndex = activeSection.value - 1;
    const previousSectionProgress = sectionProgress.value[previousSectionIndex];
    
    if (previousSectionProgress > sectionTransitionPoint.value) {
      // Calculate normalized entry progress (0 to 1)
      return (previousSectionProgress - sectionTransitionPoint.value) / 
             (1 - sectionTransitionPoint.value);
    }
  }
  return 0;
});

// Provide these values to child components
provide('coordinatedScroll', {
  sectionProgress,
  activeSection,
  sectionExitProgress,
  sectionEntryProgress,
  sectionTransitionPoint
});

// Cleanup function for scroll trigger
let scrollTriggerCleanup = null;

// Set up coordinated scrolling
onMounted(() => {
  // Wait for DOM to be ready
  setTimeout(setupCoordinatedScroll, 100);
});

// Clean up scroll triggers on component unmount
onBeforeUnmount(() => {
  if (scrollTriggerCleanup) {
    scrollTriggerCleanup();
  }
});

// Function to set up coordinated scrolling
function setupCoordinatedScroll() {
  if (!containerRef.value) return;
  
  // Create a scroll trigger for the entire container
  const trigger = ScrollTrigger.create({
    trigger: containerRef.value,
    start: "top top",
    end: `+=${props.scrollDistance}`,
    scrub: props.scrubAmount,
    pin: props.pinSections,
    anticipatePin: 1,
    onUpdate: (self) => {
      // Update pinned state
      isPinned.value = self.isActive;
      
      // Calculate which section should be active based on scroll progress
      const sectionSize = 1 / props.sectionCount;
      const currentSection = Math.min(
        Math.floor(self.progress / sectionSize),
        props.sectionCount - 1
      );
      
      // Update active section
      activeSection.value = currentSection;
      
      // Calculate progress for each section
      for (let i = 0; i < props.sectionCount; i++) {
        if (i < currentSection) {
          // Sections before the current one are complete
          sectionProgress.value[i] = 1;
        } else if (i > currentSection) {
          // Sections after the current one haven't started
          sectionProgress.value[i] = 0;
        } else {
          // Current section progress is normalized within its segment
          const sectionStart = i * sectionSize;
          const normalizedProgress = (self.progress - sectionStart) / sectionSize;
          sectionProgress.value[i] = Math.max(0, Math.min(1, normalizedProgress));
        }
      }
    }
  });
  
  // Store cleanup function
  scrollTriggerCleanup = () => {
    trigger.kill();
  };
}
</script>

<template>
  <div 
    ref="containerRef" 
    class="coordinated-scroll-container"
    :style="{ height: containerHeight }"
  >
    <slot 
      :section-progress="sectionProgress" 
      :active-section="activeSection"
      :section-exit-progress="sectionExitProgress"
      :section-entry-progress="sectionEntryProgress"
    ></slot>
  </div>
</template>

<style lang="scss" scoped>
.coordinated-scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}
</style>