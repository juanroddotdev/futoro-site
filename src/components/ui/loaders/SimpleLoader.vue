<template>
  <!-- 
    ⚠️ CORE COMPONENT STRUCTURE
    DO NOT MODIFY OR REMOVE WITHOUT APPROVAL
    This structure maintains the grid, spotlight, and text animations
    
    Component Layers (from bottom to top):
    1. Grid Background with Spotlight
    2. Headline Text with Letter Animation
    3. Subheadline with:
       - Vara Text (handwritten)
       - Regular Text (legacy transition)
       - Spotlight Text (new reveal)
  -->
  <div class="preloader" :class="{ 'is-hidden': !isVisible }">
    <!-- Gradient definition - Required for text effects -->
    <svg width="0" height="0">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:var(--theme-primary, #88C0D0);" />
          <stop offset="50%" style="stop-color:var(--theme-secondary, #5E81AC);" />
          <stop offset="100%" style="stop-color:var(--theme-primary, #88C0D0);" />
        </linearGradient>
      </defs>
    </svg>
    
    <!-- Required Vara font -->
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet">
    
    <!-- 
      GRID AND SPOTLIGHT SYSTEM
      - Controls spotlight position and movement
      - Handles grid line animations
      - Contains debug yellow line
      ⚠️ DO NOT MODIFY without understanding spotlight animation sequence
    -->
    <div class="grid-container" :class="{ 'debug-mode': showDebug }" :style="{
      '--spotlight-x': `${spotlightX}%`,
      '--spotlight-y': `${spotlightY}%`
    }">
      <!-- Add spotlight position indicator -->
      <div v-if="showDebug" class="spotlight-indicator"></div>
      
      <div class="grid-lines horizontal" ref="horizontalLines">
        <div v-for="i in 20" :key="`h-${i}`" class="grid-line" />
      </div>
      <div class="grid-lines vertical" ref="verticalLines">
        <div v-for="i in 20" :key="`v-${i}`" class="grid-line" />
      </div>
    </div>
    
    <!-- 
      CONTENT WRAPPER
      Main container for all text animations
      Maintains proper spacing and centering
    -->
    <div class="content-wrapper">
      <div class="text-container">
        <!-- 
          HEADLINE SECTION
          Letter-by-letter typing animation with gradient fill
          ⚠️ Timing is critical - each letter appears with 0.1s delay
        -->
        <div class="headline theme-text--gradient-animated gradient-shine">
          <!-- Vara container for headline -->
          <div id="headline-vara-container"></div>
          
          <!-- Outline Text Layer -->
          <div class="outline-text-wrapper">
            <template v-for="(word, wordIndex) in headline.split(' ')" :key="`word-${wordIndex}`">
              <span class="word">
                <span v-for="(char, letterIndex) in word" 
                      :key="`letter-${wordIndex}-${letterIndex}`"
                      class="letter"
                      :data-word-index="wordIndex"
                      :data-letter-index="letterIndex">
                  {{ char }}
                </span>
              </span>
              <span v-if="wordIndex < headline.split(' ').length - 1" class="space">&nbsp;</span>
            </template>
          </div>
          
          <!-- Spotlight Text Layer -->
          <!-- <div class="spotlight-text-wrapper headline-spotlight theme-text--gradient-animated gradient-shine">
            {{ headline }}
          </div> -->
        </div>
        
        <!-- 
          SUBHEADLINE SECTION
          Contains three synchronized text layers:
          1. Vara Text (handwritten animation)
          2. Regular Text (legacy letter transitions)
          3. Spotlight Text (new reveal animation)
          
          ⚠️ IMPORTANT: All three layers must maintain exact positioning
          for smooth transitions. Do not modify positioning without testing
          all animation phases.
        -->
        <div class="theme-text--gradient-animated gradient-shine subheading-responsive">
          <!-- Vara container for subheadline -->
          <div id="subheadline-vara-container"></div>
          
          
          <!-- Spotlight Text Layer -->
          <div class="spotlight-text-wrapper debug theme-text--gradient-animated gradient-shine">
            {{ subheadline }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import gsap from 'gsap';
import { HeroContent, getRandomHeroContent } from '@/data/heroContentData';
import { useVara } from '@/composables/useVara';
import { applySpotlightReveal } from './utils/spotlightReveal';
import { debugLogger } from './utils/debugUtils';
import { setupInitialState, createTimeline, calculateCenterY } from './utils/timelineUtils';

const props = defineProps<{
  headline?: string;
  subheadline?: string;
  spotlightX?: number;
  spotlightY?: number;
  heroContent?: HeroContent;
  showDebug?: boolean; // New prop for visual debugging
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const isVisible = ref(true);
const horizontalLines = ref(null);
const verticalLines = ref(null);
const letterPositions = ref<{ x: number; letterIndex: number }[]>([]);
const varaLetters = ref<Element[]>([]);
const containerRightEdge = ref<number>(0);
const varaContainer = ref<HTMLElement | null>(null);
const letterPaths = ref<NodeListOf<Element> | null>(null);
const outlineLetterPositions = ref<{ element: Element; xPercent: number }[]>([]);

const isTextCrossing = ref(false); // Track when we're crossing the text

// Use provided hero content or get random one, matching HeroSectionChat
const heroContent = computed(() => props.heroContent || getRandomHeroContent());

const headline = computed(() => props.headline || heroContent.value.headline);
const subheadline = computed(() => props.subheadline || heroContent.value.subheadline);

const spotlightX = ref(props.spotlightX ?? 20);
const spotlightY = ref(props.spotlightY ?? 20);

const { loadVara } = useVara();

// Add these refs at the top with other refs
const rtlPerformanceData = ref({
  totalUpdates: 0,
  totalProcessingTime: 0,
  maxProcessingTime: 0,
  totalPathsProcessed: 0,
  totalLettersProcessed: 0
});

const outlinePerformanceData = ref({
  totalUpdates: 0,
  totalProcessingTime: 0,
  maxProcessingTime: 0,
  totalLettersProcessed: 0
});

// Animation Callbacks
const handleRTLStart = () => {
  // Show Vara text
  gsap.set('#headline-vara-container', { opacity: 1 });
  gsap.set('#headline-vara-container path', { opacity: 1 });
  
  // Keep outline wrapper hidden initially
  gsap.set('.outline-text-wrapper', { opacity: 0 });
  gsap.set('.outline-text-wrapper .letter', { opacity: 0 });
  
  if (props.showDebug) {
    debugLogger.log('🖋️ Vara text visible, starting animation');
  }
};

// Calculate letter positions once when Vara is ready
const handleVaraReady = (positions: { x: number; index: number }[]) => {
  const headlineContainer = document.querySelector('.headline') as HTMLElement;
  varaContainer.value = document.querySelector('#headline-vara-container') as HTMLElement;
  
  if (!varaContainer.value || !headlineContainer) return;

  // Store letter paths once
  letterPaths.value = varaContainer.value.querySelectorAll('path');

  // Calculate container width percentage once
  const containerRect = headlineContainer.getBoundingClientRect();
  const screenWidth = window.innerWidth;
  containerRightEdge.value = (containerRect.width / screenWidth) * 100;
  
  // Calculate outline letter positions once
  const outlineLetters = document.querySelectorAll('.outline-text-wrapper .letter');
  outlineLetterPositions.value = Array.from(outlineLetters).map(letter => {
    const letterRect = letter.getBoundingClientRect();
    const containerLeft = headlineContainer.getBoundingClientRect().left;
    // Calculate position relative to container's left edge
    const letterX = letterRect.left - containerLeft;
    const letterXPercent = (letterX / containerRect.width) * 100;
    return { element: letter, xPercent: letterXPercent };
  });
  
  if (props.showDebug) {
    debugLogger.log(`📏 Container width: ${containerRightEdge.value.toFixed(2)}% of screen`);
    debugLogger.log(`📝 Found ${outlineLetterPositions.value.length} outline letters`);
    outlineLetterPositions.value.forEach(({ xPercent }, i) => {
      debugLogger.log(`Letter ${i + 1} position: ${xPercent.toFixed(2)}%`);
    });
  }
  
  // Group paths by letter index
  const pathsByLetter = new Map<number, { x: number; index: number }[]>();
  positions.forEach(({ x, index }) => {
    const letterIndex = Math.floor(index / 2); // Assuming 2 paths per letter
    if (!pathsByLetter.has(letterIndex)) {
      pathsByLetter.set(letterIndex, []);
    }
    pathsByLetter.get(letterIndex)?.push({ x, index });
  });

  // Convert to array of letter positions, using average x position for each letter
  const letterPositionsArray = Array.from(pathsByLetter.entries()).map(([letterIndex, paths]) => {
    const avgX = paths.reduce((sum, { x }) => sum + x, 0) / paths.length;
    const percentage = (avgX / containerRect.width) * 100;
    return { x: percentage, letterIndex };
  });

  letterPositions.value = letterPositionsArray;
};

const handleRTLUpdate = (spotlightX: number) => {
  const startTime = performance.now();
  let processedCount = 0;
  
  if (!varaContainer.value || !letterPaths.value) return;
  
  // Only proceed if spotlight has reached the container's right edge
  if (spotlightX > containerRightEdge.value) return;
  
  // Show outline wrapper when we start the RTL phase
  gsap.set('.outline-text-wrapper', { opacity: 1 });
  
  // Handle Vara text transitions
  letterPaths.value.forEach((path, index) => {
    processedCount++;
    const letterIndex = Math.floor(index / 2);
    const shouldBeVisible = spotlightX <= letterPositions.value[letterIndex]?.x;
    
    if (shouldBeVisible && path.getAttribute('data-transitioning') !== 'true') {
      path.setAttribute('data-transitioning', 'true');
      gsap.to(path, {
        opacity: 0,
        duration: 0.1,
        onComplete: () => {
          path.setAttribute('data-transitioning', 'false');
        }
      });
    }
  });

  // Collect performance data
  const duration = performance.now() - startTime;
  rtlPerformanceData.value.totalUpdates++;
  rtlPerformanceData.value.totalProcessingTime += duration;
  rtlPerformanceData.value.maxProcessingTime = Math.max(rtlPerformanceData.value.maxProcessingTime, duration);
  rtlPerformanceData.value.totalPathsProcessed += processedCount;

  // Handle outline text transitions
  handleOutlineTextTransition(spotlightX);
};

const handleOutlineTextTransition = (spotlightX: number) => {
  const startTime = performance.now();
  let processedCount = 0;
  
  outlineLetterPositions.value.forEach(({ element, xPercent }) => {
    processedCount++;
    
    const shouldBeVisible = spotlightX <= xPercent && spotlightX >= xPercent - 40;
    
    if (shouldBeVisible && 
        element.getAttribute('data-transitioning') !== 'true' && 
        element.getAttribute('data-visible') !== 'true') {
      element.setAttribute('data-transitioning', 'true');
      gsap.to(element, {
        opacity: 1,
        duration: 0.1,
        onComplete: () => {
          element.setAttribute('data-transitioning', 'false');
          element.setAttribute('data-visible', 'true');
        }
      });
    }
  });
  
  // Collect performance data
  const duration = performance.now() - startTime;
  outlinePerformanceData.value.totalUpdates++;
  outlinePerformanceData.value.totalProcessingTime += duration;
  outlinePerformanceData.value.maxProcessingTime = Math.max(outlinePerformanceData.value.maxProcessingTime, duration);
  outlinePerformanceData.value.totalLettersProcessed += processedCount;
};

const handleRTLComplete = () => {
  // Hide any remaining Vara letters
  gsap.set('#headline-vara-container path', { opacity: 0 });
  // Ensure all outline letters are visible
  gsap.set('.outline-text-wrapper .letter', { opacity: 1 });
  
  if (props.showDebug) {
    debugLogger.log('🔄 Vara text hidden, outline text fully visible');
    
    // Log final performance assessment
    debugLogger.log(`📊 Final Performance Assessment:
[RTL Update]
- Total updates: ${rtlPerformanceData.value.totalUpdates}
- Average processing time: ${(rtlPerformanceData.value.totalProcessingTime / rtlPerformanceData.value.totalUpdates).toFixed(2)}ms
- Max processing time: ${rtlPerformanceData.value.maxProcessingTime.toFixed(2)}ms
- Total paths processed: ${rtlPerformanceData.value.totalPathsProcessed}
- Average paths per update: ${(rtlPerformanceData.value.totalPathsProcessed / rtlPerformanceData.value.totalUpdates).toFixed(1)}

[Outline Transition]
- Total updates: ${outlinePerformanceData.value.totalUpdates}
- Average processing time: ${(outlinePerformanceData.value.totalProcessingTime / outlinePerformanceData.value.totalUpdates).toFixed(2)}ms
- Max processing time: ${outlinePerformanceData.value.maxProcessingTime.toFixed(2)}ms
- Total letters processed: ${outlinePerformanceData.value.totalLettersProcessed}
- Average letters per update: ${(outlinePerformanceData.value.totalLettersProcessed / outlinePerformanceData.value.totalUpdates).toFixed(1)}
`);
  }
};

const handleLTRStart = () => {
  gsap.set('.outline-text-wrapper', { opacity: 1 });
  gsap.set('.outline-text-wrapper .letter', { opacity: 1 });
  gsap.set('.spotlight-text-wrapper', { 
    opacity: 1,
    clipPath: 'inset(0 100% 0 0)'
  });
  gsap.set('#subheadline-vara-container', { opacity: 1 });
  gsap.set('#subheadline-vara-container path', { opacity: 1 });
};

const handleLTRUpdate = (spotlightX: number) => {
  const spotlightText = document.querySelector('.spotlight-text-wrapper') as HTMLElement;
  if (spotlightText) {
    const clipAmount = 100 - spotlightX;
    spotlightText.style.clipPath = `inset(0 ${clipAmount}% 0 0)`;
  }
  
  const headlineOutline = document.querySelector('.outline-text-wrapper') as HTMLElement;
  if (headlineOutline) {
    applySpotlightReveal({
      element: headlineOutline,
      spotlightX,
      isRTL: false,
      showDebug: false // Force debug off for LTR
    });
  }
};

const handleLTRComplete = () => {
  gsap.set('.spotlight-text-wrapper', { 
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1
  });
  gsap.set('#subheadline-vara-container', { opacity: 0 });
  gsap.set('#subheadline-vara-container path', { opacity: 0 });
};

onMounted(() => {
  // Only enable debugging for RTL phase
  debugLogger.setOptions({ showDebug: false });

  // Setup MutationObserver for letter fill tracking
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const target = mutation.target as HTMLElement;
      if (target.classList.contains('letter')) {
        if (target.classList.contains('filled') && props.showDebug && isTextCrossing.value) {
          // Removed console.log
        }
      }
    });
  });

  // Start observing after a short delay to ensure elements are ready
  setTimeout(() => {
    const letters = document.querySelectorAll('.letter');
    letters.forEach(letter => {
      observer.observe(letter, {
        attributes: true,
        attributeFilter: ['class']
      });
    });
  }, 100);

  // Calculate center Y position and setup initial state
  const centerY = calculateCenterY();
  setupInitialState(centerY);
  
  // Create and start the animation timeline
  createTimeline({
    showDebug: props.showDebug,
    centerY,
    headline: headline.value,
    subheadline: subheadline.value,
    loadVara,
    onComplete: () => emit('complete'),
    onRTLStart: () => {
      // Enable debugging only during RTL phase
      debugLogger.setOptions({ showDebug: props.showDebug });
      handleRTLStart();
    },
    onRTLUpdate: handleRTLUpdate,
    onRTLComplete: () => {
      handleRTLComplete();
      // Disable debugging after RTL phase
      debugLogger.setOptions({ showDebug: false });
    },
    onLTRStart: handleLTRStart,
    onLTRUpdate: handleLTRUpdate,
    onLTRComplete: handleLTRComplete,
    onVaraReady: handleVaraReady
  });
});
</script>

<style scoped>
/*
  ⚠️ CORE STYLES DOCUMENTATION
  DO NOT MODIFY OR REMOVE WITHOUT APPROVAL
  
  Style Categories:
  1. LAYOUT & POSITIONING
     - Preloader container
     - Grid system
     - Content wrappers
  
  2. GRID & SPOTLIGHT
     - Grid lines
     - Spotlight mask
     - Animation positions
  
  3. TEXT ANIMATIONS
     - Headline typing
     - Vara text
     - Regular text
     - Spotlight reveal
  
  4. SHARED UTILITIES
     - Gradients
     - Animations
     - Debug helpers
*/

.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(17, 24, 39); /* Dark background matching hero */
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.8s ease;
}

.grid-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  --spotlight-x: 20%;
  --spotlight-y: 20%;
  --spotlight-size: 100%;
}

.grid-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  mask-image: radial-gradient(
    circle at var(--spotlight-x) var(--spotlight-y),
    #1a1b26 0%,
    rgba(0, 0, 0, 0.8) 20%,
    rgba(0, 0, 0, 0) var(--spotlight-size)
  );
  -webkit-mask-image: radial-gradient(
    circle at var(--spotlight-x) var(--spotlight-y),
    #1a1b26 0%,
    rgba(0, 0, 0, 0.8) 20%,
    rgba(0, 0, 0, 0) var(--spotlight-size)
  );
}

.grid-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.2); /* Match PaperGridBackground opacity */
}

.horizontal .grid-line {
  width: 100%;
  height: 2px; /* Match PaperGridBackground line thickness */
  transform-origin: left center;
  left: 0;
}

.vertical .grid-line {
  width: 2px; /* Match PaperGridBackground line thickness */
  height: 100%;
  transform-origin: top center;
  top: 0;
}

/* Update grid line positions to use 40px spacing (5% intervals) */
.horizontal .grid-line:nth-child(1) { top: 5%; }
.horizontal .grid-line:nth-child(2) { top: 10%; }
.horizontal .grid-line:nth-child(3) { top: 15%; }
.horizontal .grid-line:nth-child(4) { top: 20%; }
.horizontal .grid-line:nth-child(5) { top: 25%; }
.horizontal .grid-line:nth-child(6) { top: 30%; }
.horizontal .grid-line:nth-child(7) { top: 35%; }
.horizontal .grid-line:nth-child(8) { top: 40%; }
.horizontal .grid-line:nth-child(9) { top: 45%; }
.horizontal .grid-line:nth-child(10) { top: 50%; }
.horizontal .grid-line:nth-child(11) { top: 55%; }
.horizontal .grid-line:nth-child(12) { top: 60%; }
.horizontal .grid-line:nth-child(13) { top: 65%; }
.horizontal .grid-line:nth-child(14) { top: 70%; }
.horizontal .grid-line:nth-child(15) { top: 75%; }
.horizontal .grid-line:nth-child(16) { top: 80%; }
.horizontal .grid-line:nth-child(17) { top: 85%; }
.horizontal .grid-line:nth-child(18) { top: 90%; }
.horizontal .grid-line:nth-child(19) { top: 95%; }
.horizontal .grid-line:nth-child(20) { top: 100%; }

.vertical .grid-line:nth-child(1) { left: 5%; }
.vertical .grid-line:nth-child(2) { left: 10%; }
.vertical .grid-line:nth-child(3) { left: 15%; }
.vertical .grid-line:nth-child(4) { left: 20%; }
.vertical .grid-line:nth-child(5) { left: 25%; }
.vertical .grid-line:nth-child(6) { left: 30%; }
.vertical .grid-line:nth-child(7) { left: 35%; }
.vertical .grid-line:nth-child(8) { left: 40%; }
.vertical .grid-line:nth-child(9) { left: 45%; }
.vertical .grid-line:nth-child(10) { left: 50%; }
.vertical .grid-line:nth-child(11) { left: 55%; }
.vertical .grid-line:nth-child(12) { left: 60%; }
.vertical .grid-line:nth-child(13) { left: 65%; }
.vertical .grid-line:nth-child(14) { left: 70%; }
.vertical .grid-line:nth-child(15) { left: 75%; }
.vertical .grid-line:nth-child(16) { left: 80%; }
.vertical .grid-line:nth-child(17) { left: 85%; }
.vertical .grid-line:nth-child(18) { left: 90%; }
.vertical .grid-line:nth-child(19) { left: 95%; }
.vertical .grid-line:nth-child(20) { left: 100%; }

.content-wrapper {
  position: relative;
  z-index: 2;
  text-align: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
}

.text-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  position: relative;
  max-width: 800px;
}

.headline {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: bold;
  min-height: 120px;
}

.headline .letter {
  position: relative;
  color: transparent;
  -webkit-text-stroke: 2px var(--theme-primary, #88C0D0);
  transition: all 0.3s ease;
  display: inline-block;
  min-width: 0.5em;
  opacity: 1;
  transform: none;
}

/* Modified filled state specifically for headline letters */
.headline .letter.filled {
  color: transparent;
  -webkit-text-stroke: 0;
  -webkit-text-stroke-width: 0;
  background: linear-gradient(
    to right,
    var(--theme-primary, #88C0D0),
    var(--theme-secondary, #5E81AC),
    var(--theme-primary, #88C0D0)
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shine 3s linear infinite;
  opacity: 1;
  transform: translateY(0);
}

/* Subheadline specific styles */
.subheadline {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 120px;
  margin-top: 4rem; /* Reduce from 8rem to 4rem */
  margin-bottom: 2rem;
  font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);
  line-height: 1.5;
  font-weight: 500;
  letter-spacing: -0.025em;
  color: var(--theme-text-primary, #E5E9F0);
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
}

#headline-vara-container,
#subheadline-vara-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

.outline-text-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  z-index: 2;
  opacity: 0;
}

.outline-text-wrapper .letter {
  color: transparent;
  -webkit-text-stroke: 2px var(--theme-primary, #88C0D0);
  transition: all 0.3s ease;
}

.spotlight-text-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  opacity: 0;
  clip-path: inset(0 100% 0 0);
}

.spotlight-text-wrapper.headline-spotlight {
  font-size: 2.5rem;
  font-weight: bold;
}

.regular-text-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  z-index: 2;
  opacity: 0;
}

.regular-text-wrapper .word {
  display: inline-flex;
  align-items: center;
}

.regular-text-wrapper .space {
  display: inline-block;
  width: 0.4em;
}

.regular-text-wrapper .letter {
  display: inline-block;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.subheading-responsive {
  position: relative;
  width: 100%;
  min-height: 120px;
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);
  line-height: 1.5;
}

/* Debug styles for Vara letters */
#headline-vara-container svg path,
#subheadline-vara-container svg path {
  outline: 1px solid rgba(255, 0, 255, 0.5);
}

.theme-text--gradient-animated {
  background: linear-gradient(
    to right,
    var(--theme-primary, #88C0D0),
    var(--theme-secondary, #5E81AC),
    var(--theme-primary, #88C0D0)
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
}

.gradient-shine {
  animation: shine 3s linear infinite;
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}

/* For Firefox which doesn't support -webkit-text-stroke well */
@-moz-document url-prefix() {
  .word {
    text-shadow: 
      -2px -2px 0 var(--theme-primary, #88C0D0),
      2px -2px 0 var(--theme-primary, #88C0D0),
      -2px 2px 0 var(--theme-primary, #88C0D0),
      2px 2px 0 var(--theme-primary, #88C0D0);
  }
}

.is-hidden {
  opacity: 0;
  pointer-events: none;
}

/* Update debug styles to only show unfilled letters */
.debug-highlight {
  outline: 2px solid rgba(255, 0, 0, 0.8);
  outline-offset: 2px;
  transition: outline-color 0.3s ease;
}

.debug-highlight.filled {
  outline: none;
}

/* Update spotlight overlay to be more visible during text crossing */
.grid-container.debug-mode::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: radial-gradient(
    circle at var(--spotlight-x) var(--spotlight-y),
    rgba(255, 255, 0, 0.2) 0%,
    rgba(255, 255, 0, 0) var(--spotlight-size)
  );
  opacity: 0.3;
  z-index: 1;
  display: block;
}

/* Add spotlight position indicator */
.spotlight-indicator {
  position: absolute;
  top: 0;
  left: var(--spotlight-x);
  width: 2px;
  height: 100%;
  background: rgba(255, 255, 0, 0.8);
  z-index: 10;
  pointer-events: none;
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
}

/* Add styles for the test container */
.test-subheadline {
  margin-top: 4rem;
  font-family: 'Raleway', sans-serif;
  font-size: 26px;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  opacity: 1; /* Change to 1 since we'll use clip-path to hide/show */
  clip-path: inset(0 100% 0 0); /* Start fully hidden from right side */
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.spotlight-text-wrapper {
  width: 100%;
  height: auto;
  min-height: 120px;
  position: absolute;
  top: 0;
  left: 0;
  transform: none;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: pre-wrap;
  opacity: 1;
  clip-path: inset(0 100% 0 0);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  background: linear-gradient(
    to right,
    var(--theme-primary, #88C0D0),
    var(--theme-secondary, #5E81AC),
    var(--theme-primary, #88C0D0)
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shine 3s linear infinite;
}

.subheading-responsive {
  position: relative;
  width: 100%;
  height: 120px;
  margin-top: 2rem; /* Reduce from 4rem to 2rem */
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);
  line-height: 1.5;
  font-weight: 500;
  letter-spacing: -0.025em;
  color: var(--theme-text-primary, #E5E9F0);
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
}

/* Add styles for headline spotlight */
.headline-spotlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  font-size: 2.5rem;
  font-weight: bold;
  clip-path: inset(0 100% 0 0);
  pointer-events: none;
}
</style> 