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
          <div class="spotlight-text-wrapper headline-spotlight theme-text--gradient-animated gradient-shine">
            {{ headline }}
          </div>
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
          
          <!-- Regular Text Layer -->
          <div class="regular-text-wrapper">
            <template v-for="(word, wordIndex) in subheadline.split(' ')" :key="`word-${wordIndex}`">
              <span class="word">
                <span v-for="(char, letterIndex) in word" 
                      :key="`letter-${wordIndex}-${letterIndex}`"
                      class="letter"
                      :data-word-index="wordIndex"
                      :data-letter-index="letterIndex">
                  {{ char }}
                </span>
              </span>
              <span v-if="wordIndex < subheadline.split(' ').length - 1" class="space">&nbsp;</span>
            </template>
          </div>
          
          <!-- Spotlight Text Layer -->
          <div class="spotlight-text-wrapper theme-text--gradient-animated gradient-shine">
            {{ subheadline }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* 
  ⚠️ ANIMATION SEQUENCE DOCUMENTATION
  DO NOT MODIFY WITHOUT APPROVAL
  
  Animation Timeline:
  1. GRID INTRO (0-1.6s)
     - Horizontal lines fade in with random stagger
     - Vertical lines follow with overlap
     - Text container fades in during grid animation
  
  2. HEADLINE VARA TEXT (1.1-3.1s)
     - Handwritten animation starts for headline
     - Controlled by Vara library
     - Must complete before spotlight
  
  3. SUBHEADLINE VARA TEXT (3.1-5.1s)
     - Handwritten animation starts for subheadline
     - Controlled by Vara library
     - Must complete before spotlight
  
  4. SPOTLIGHT SEQUENCE (5.1-9.6s)
     - Initial spotlight shrink
     - Random position movements
     - Final position for text crossing
  
  5. HEADLINE TRANSITION (9.6-12.6s)
     - Spotlight Reveal Right to Left
     - Transitions Headline Vara Text to Headline Outline Text
  
  6. FINAL TRANSITIONS (12.6-15.6s)
     - Spotlight Reveal Left to Right
     - Headline Outline Text transitions to Fill Animation
     - Subheadline Vara Text transitions to Regular Text
  
  7. FINALE (15.6-18.6s)
     - Spotlight moves to final position
     - Animation completes
*/

import { ref, onMounted, computed } from 'vue';
import gsap from 'gsap';
import SpotlightText from '@/components/text/SpotlightText.vue';
import { HeroContent, getRandomHeroContent } from '@/data/heroContentData';
import { useVara } from '@/composables/useVara';

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
const headlineText = ref(null);
const subheadlineText = ref(null);

const isTextCrossing = ref(false); // Track when we're crossing the text

// Add filledLetters ref for tracking
const filledLetters = ref(new Set());

// Use provided hero content or get random one, matching HeroSectionChat
const heroContent = computed(() => props.heroContent || getRandomHeroContent());

const headline = computed(() => props.headline || heroContent.value.headline);
const subheadline = computed(() => props.subheadline || heroContent.value.subheadline);

const spotlightX = ref(props.spotlightX ?? 20);
const spotlightY = ref(props.spotlightY ?? 20);

const currentIndex = ref(0);
const isTyping = ref(false);

const isAnimationComplete = ref(false);
let varaInstance: any = null;

const { loadVara } = useVara();

// Add this before the component setup
const fadedLetters = new Set();

// Add tracking for logged transitions
const loggedTransitions = new Set();

// Add tracking for logged positions
const lastLoggedPosition = ref(0);

// Add functions to check letter visibility
const isLetterVisible = (wordIndex: number, letterIndex: number) => {
  const words = headline.value.split(' ');
  let totalCharsBefore = 0;
  
  // Count characters including spaces up to this word
  for (let i = 0; i < wordIndex; i++) {
    totalCharsBefore += words[i].length + 1; // +1 for space after each word
  }
  totalCharsBefore += letterIndex;
  
  return totalCharsBefore < currentIndex.value;
};

const isSpaceVisible = (wordIndex: number) => {
  const words = headline.value.split(' ');
  let totalCharsBefore = 0;
  
  // Count characters including spaces up to this word
  for (let i = 0; i <= wordIndex; i++) {
    totalCharsBefore += words[i].length + 1; // +1 for space after each word
  }
  
  return totalCharsBefore <= currentIndex.value;
};

// Update startTyping function to handle spaces
const startTyping = () => {
  if (isTyping.value) return;
  isTyping.value = true;
  currentIndex.value = 0;
  
  const typeNextChar = () => {
    if (currentIndex.value < headline.value.length) {
      currentIndex.value++;
      setTimeout(typeNextChar, 100);
    } else {
      isTyping.value = false;
    }
  };

  setTimeout(typeNextChar, 0);
};

// Function to generate random position between min and max
const getRandomPosition = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Function to generate random spotlight positions
const generateRandomPositions = (numPositions: number) => {
  const positions = [];
  // First position is always at the left edge (0%)
  positions.push({
    x: 0,
    y: 50,
    size: 50
  });
  
  // Generate remaining random positions
  for (let i = 1; i < numPositions; i++) {
    positions.push({
      x: getRandomPosition(20, 80), // Keep away from edges
      y: getRandomPosition(20, 80),
      size: getRandomPosition(30, 70) // Random size between 30% and 70%
    });
  }
  return positions;
};

// Update function to get letter position for debugging
const getLetterPosition = (wordIndex: number, letterIndex: number) => {
  const text = headline.value;
  const words = text.split(' ');
  let totalCharsBefore = 0;
  
  // Count characters including spaces up to this word
  for (let i = 0; i < wordIndex; i++) {
    totalCharsBefore += words[i].length + 1; // +1 for space after each word
  }
  totalCharsBefore += letterIndex;
  
  // Calculate percentage based on total text length
  return (totalCharsBefore / text.length) * 100;
};

// Add new refs for subheadline transition tracking
const currentSubheadlineLetter = ref(0);
const isLetterTransitioning = ref(false);

// Add timing tracking variables
const transitionStartTime = ref<Record<string, number>>({});
const transitionEndTime = ref<Record<string, number>>({});

// Update the applySpotlightReveal function
const applySpotlightReveal = (element: HTMLElement, spotlightX: number, isRTL: boolean = false) => {
  const letters = element.querySelectorAll('.letter');
  const totalWidth = element.offsetWidth;
  const varaContainer = document.querySelector('#headline-vara-container');
  const varaLetters = varaContainer?.querySelectorAll('path');
  
  // Use fixed transition duration
  const transitionDuration = 0.2;
  
  if (isRTL) {
    // Create a mapping of visual positions to Vara indices
    const letterToVaraMap = new Map();
    let varaIndex = varaLetters ? varaLetters.length - 1 : 0;
    
    // First, map each visible letter to its corresponding Vara letter
    for (let i = letters.length - 1; i >= 0; i--) {
      const letterElement = letters[i] as HTMLElement;
      if (letterElement.textContent?.trim()) {
        letterToVaraMap.set(i, varaIndex);
        varaIndex--;
      }
    }

    // Process letters from right to left
    for (let i = letters.length - 1; i >= 0; i--) {
      const letterElement = letters[i] as HTMLElement;
      const letterRect = letterElement.getBoundingClientRect();
      const letterLeft = letterRect.left - element.getBoundingClientRect().left;
      const letterRight = letterLeft + letterRect.width;
      const letterCenterX = (letterLeft + letterRight) / 2;
      const letterPositionPercent = (letterCenterX / totalWidth) * 100;

      // Skip empty spaces in visual text
      if (!letterElement.textContent?.trim()) continue;

      const varaIndex = letterToVaraMap.get(i);
      if (!varaLetters || !varaLetters[varaIndex]) continue;

      // Calculate transition point - earlier letters should transition earlier
      const letterPosition = i / letters.length;
      const transitionPoint = Math.max(20, letterPositionPercent * (1 - letterPosition * 0.3));

      // If spotlight has passed this letter's transition point
      if (spotlightX < transitionPoint) {
        const varaLetter = varaLetters[varaIndex];
        const letterKey = `vara-${varaIndex + 1}`;
        
        // Only log if this letter hasn't been logged before
        if (props.showDebug && !loggedTransitions.has(letterKey)) {
          const letterText = letterElement.textContent || '';
          debugLog(`Letter ${varaIndex + 1}/${varaLetters.length} "${letterText}" transitioning at spotlight ${spotlightX.toFixed(1)}%`);
          loggedTransitions.add(letterKey);
        }

        gsap.to(varaLetter, {
          opacity: 0,
          duration: transitionDuration
        });

        // Fade in outline letter with debug timing
        gsap.to(letterElement, {
          opacity: 1,
          duration: transitionDuration
        });
      } else {
        const varaLetter = varaLetters[varaIndex];
        gsap.set(varaLetter, { opacity: 1 });
        gsap.set(letterElement, { opacity: 0 });
      }
    }

    // When spotlight is at 0%, ensure all letters have transitioned
    if (spotlightX <= 0) {
      letters.forEach((letter, i) => {
        const letterElement = letter as HTMLElement;
        if (!letterElement.textContent?.trim()) return;
        
        const varaIndex = letterToVaraMap.get(i);
        if (varaLetters && varaLetters[varaIndex]) {
          const varaLetter = varaLetters[varaIndex];
          const letterKey = `vara-${varaIndex + 1}`;
          
          if (!loggedTransitions.has(letterKey)) {
            const letterText = letterElement.textContent || '';
            debugLog(`Letter ${varaIndex + 1}/${varaLetters.length} "${letterText}" transitioning at final position`);
            loggedTransitions.add(letterKey);
          }

          gsap.to(varaLetter, {
            opacity: 0,
            duration: transitionDuration
          });
          gsap.to(letterElement, {
            opacity: 1,
            duration: transitionDuration
          });
        }
      });
    }
  } else if (element.classList.contains('regular-text-wrapper')) {
    // Handle subheadline transition
    const subheadlineVaraContainer = document.querySelector('#subheadline-vara-container');
    const varaLetters = subheadlineVaraContainer?.querySelectorAll('path');
    const words = element.querySelectorAll('.word');
    
    let letterCount = 0;
    words.forEach((word, wordIndex) => {
      const letters = word.querySelectorAll('.letter');
      letters.forEach((letter, i) => {
        const letterElement = letter as HTMLElement;
        const letterRect = letterElement.getBoundingClientRect();
        const letterLeft = letterRect.left - element.getBoundingClientRect().left;
        const letterRight = letterLeft + letterRect.width;
        const letterCenterX = (letterLeft + letterRight) / 2;
        const letterPositionPercent = (letterCenterX / totalWidth) * 100;

        // If spotlight has passed this letter's position
        if (spotlightX > letterPositionPercent) {
          // Fade in regular letter
          gsap.to(letterElement, {
            opacity: 1,
            duration: transitionDuration
          });
          
          // Fade out corresponding Vara letter
          if (varaLetters && varaLetters[letterCount]) {
            gsap.to(varaLetters[letterCount], {
              opacity: 0,
              duration: transitionDuration
            });
          }
          
          if (props.showDebug && !loggedTransitions.has(`subheadline-${letterCount}`)) {
            debugLog(`Subheadline letter "${letterElement.textContent}" transitioning at ${spotlightX.toFixed(1)}%`);
            loggedTransitions.add(`subheadline-${letterCount}`);
          }
        } else {
          // Keep regular letter hidden and Vara letter visible
          gsap.set(letterElement, { opacity: 0 });
          if (varaLetters && varaLetters[letterCount]) {
            gsap.set(varaLetters[letterCount], { opacity: 1 });
          }
        }
        letterCount++;
      });
    });

    // When spotlight reaches the end, ensure all letters have transitioned
    if (spotlightX >= 100) {
      if (varaLetters) {
        varaLetters.forEach((varaLetter, i) => {
          gsap.to(varaLetter, {
            opacity: 0,
            duration: transitionDuration
          });
        });
      }
      element.querySelectorAll('.letter').forEach((letter) => {
        gsap.to(letter, {
          opacity: 1,
          duration: transitionDuration
        });
      });
    }
  } else {
    // Handle headline fill animation
    letters.forEach((letter, i) => {
      const letterElement = letter as HTMLElement;
      const letterRect = letterElement.getBoundingClientRect();
      const letterLeft = letterRect.left - element.getBoundingClientRect().left;
      const letterRight = letterLeft + letterRect.width;
      const letterCenterX = (letterLeft + letterRight) / 2;
      const letterPositionPercent = (letterCenterX / totalWidth) * 100;

      // If spotlight has passed this letter's position
      if (spotlightX > letterPositionPercent) {
        // Add filled class for gradient animation
        letterElement.classList.add('filled');
        
        if (props.showDebug && !loggedTransitions.has(`fill-${i}`)) {
          debugLog(`Letter "${letterElement.textContent}" filled at ${spotlightX.toFixed(1)}%`);
          loggedTransitions.add(`fill-${i}`);
        }
      } else {
        letterElement.classList.remove('filled');
      }
    });
  }
};

// Reset the tracking when starting a new transition
const resetLoggedTransitions = () => {
  loggedTransitions.clear();
};

// Debug logging function
const debugLog = (message: string, data?: any) => {
  if (props.showDebug) {
    console.log(`[DEBUG] ${message}`, data || '');
  }
};

onMounted(() => {
  // Remove initial font check logs
  const subheadlineWords = document.querySelectorAll('.subheadline .word');
  subheadlineWords.forEach((wordElement: Element, index) => {
    const computedStyle = window.getComputedStyle(wordElement);
  });

  // Setup MutationObserver for letter fill tracking
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const target = mutation.target as HTMLElement;
      if (target.classList.contains('letter')) {
        const letter = target;
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

  // Calculate text container center position
  const textContainer = document.querySelector('.text-container');
  const textRect = textContainer?.getBoundingClientRect();
  const gridContainer = document.querySelector('.grid-container');
  const gridRect = gridContainer?.getBoundingClientRect();
  
  // Calculate the text container's center Y position as a percentage of the grid container
  const centerY = textRect && gridRect ? 
    ((textRect.top + textRect.height / 2) - gridRect.top) / gridRect.height * 100 : 50;
  
  // Generate random positions for spotlight movement
  const randomPositions = generateRandomPositions(4);
  
  // Set initial states
  gsap.set('.horizontal .grid-line', { scaleX: 0 });
  gsap.set('.vertical .grid-line', { scaleY: 0 });
  gsap.set('.text-container', { opacity: 0 });
  gsap.set('.grid-container', { 
    '--spotlight-size': '100%',
    '--spotlight-x': '0%',
    '--spotlight-y': `${centerY}%`
  });
  gsap.set('.outline-text-wrapper', { opacity: 0 });
  gsap.set('.spotlight-text-wrapper', { opacity: 0 });
  gsap.set('.regular-text-wrapper', { opacity: 0 });
  
  const tl = gsap.timeline();

  // 1. GRID INTRO (0-1.6s)
  tl.to('.horizontal .grid-line', {
    scaleX: 1,
    duration: 0.8,
    stagger: {
      each: 0.1,
      from: "random"
    },
    ease: 'power2.inOut'
  })
  .to('.vertical .grid-line', {
    scaleY: 1,
    duration: 0.8,
    stagger: {
      each: 0.1,
      from: "random"
    },
    ease: 'power2.inOut'
  }, '-=0.4')
  .to('.text-container', {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.inOut'
  }, '-=0.6')
  
  // 2. HEADLINE VARA TEXT (1.1-3.1s)
  .add(() => {
    initHeadlineVara();
  })
  .to({}, { duration: 2 }) // Wait for Vara animation
  
  // 3. SUBHEADLINE VARA TEXT (3.1-5.1s)
  .add(() => {
    initSubheadlineVara();
  })
  .to({}, { duration: 2 }) // Wait for Vara animation
  
  // 4. SPOTLIGHT SEQUENCE (5.1-9.6s)
  .to('.grid-container', {
    '--spotlight-size': '50%',
    duration: 1.5,
    ease: 'power2.inOut'
  })
  .to('.grid-container', {
    '--spotlight-x': randomPositions[0].x + '%',
    '--spotlight-y': randomPositions[0].y + '%',
    '--spotlight-size': randomPositions[0].size + '%',
    duration: 1,
    ease: 'power2.inOut'
  })
  .to('.grid-container', {
    '--spotlight-x': randomPositions[1].x + '%',
    '--spotlight-y': randomPositions[1].y + '%',
    '--spotlight-size': randomPositions[1].size + '%',
    duration: 1,
    ease: 'power2.inOut'
  })
  
  // 5. HEADLINE TRANSITION (9.6-12.6s)
  .to('.grid-container', {
    '--spotlight-size': '20%',
    '--spotlight-x': '100%',
    '--spotlight-y': `${centerY}%`,
    duration: props.showDebug ? 2 : 1.5, // Longer duration for debug
    ease: 'power2.inOut',
    onStart: () => {
      debugLog('🎯 Spotlight positioned for RTL headline transition');
      // Initialize outline letters to be hidden
      const outlineLetters = document.querySelectorAll('.outline-text-wrapper .letter');
      outlineLetters.forEach(letter => {
        gsap.set(letter, { opacity: 0 });
      });
      // Ensure Vara text is fully visible
      gsap.set('#headline-vara-container', { opacity: 1 });
      gsap.set('#headline-vara-container path', { opacity: 1 });
    }
  })
  .to('.grid-container', {
    '--spotlight-x': '0%',
    duration: 1.5, // Use standard duration
    ease: 'power1.inOut',
    onStart: () => {
      debugLog('▶️ Starting RTL movement');
      // Reset the tracking when starting new transition
      resetLoggedTransitions();
      // Hide spotlight text layer initially
      gsap.set('.headline-spotlight', { opacity: 0 });
      // Show outline text wrapper but keep letters hidden
      gsap.set('.outline-text-wrapper', { opacity: 1 });
    },
    onUpdate: function() {
      const gridContainer = document.querySelector('.grid-container');
      if (gridContainer) {
        const spotlightX = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
        
        // Only log significant position changes (every 10%)
        if (props.showDebug) {
          const currentThreshold = Math.floor(spotlightX / 10) * 10;
          if (currentThreshold !== lastLoggedPosition.value) {
            debugLog(`⭐ Spotlight at ${currentThreshold}%`);
            lastLoggedPosition.value = currentThreshold;
          }
        }

        // Apply letter-by-letter transition
        const headlineOutline = document.querySelector('.outline-text-wrapper') as HTMLElement;
        if (headlineOutline) {
          applySpotlightReveal(headlineOutline, spotlightX, true);
        }
      }
    },
    onComplete: () => {
      console.log('✅ RTL headline transition complete');
      // Ensure final state is correct
      gsap.set('#headline-vara-container', { opacity: 0 });
      gsap.set('#headline-vara-container path', { opacity: 0 });
      gsap.set('.outline-text-wrapper', { opacity: 1 });
      gsap.set('.outline-text-wrapper .letter', { opacity: 1 });
      gsap.set('.headline-spotlight', { opacity: 0 });
      
      // Check visibility after a short delay
      setTimeout(checkTextLayerVisibility, 100);
    }
  })
  
  // 6. FINAL TRANSITIONS (12.6-15.6s)
  .to('.grid-container', {
    '--spotlight-x': '0%',
    '--spotlight-y': `${centerY}%`,
    duration: 1.5,
    ease: 'power2.inOut',
    onStart: () => {
      debugLog('🔄 Starting final transitions');
      // Show outline text wrapper for fill animation
      gsap.set('.outline-text-wrapper', { opacity: 1 });
      gsap.set('.outline-text-wrapper .letter', { opacity: 1 });
      // Hide spotlight text initially
      gsap.set('.headline-spotlight', { opacity: 0 });
      // Initialize regular text wrapper
      gsap.set('.regular-text-wrapper', { opacity: 1 });
      gsap.set('.regular-text-wrapper .letter', { opacity: 0 });
      // Ensure Vara text is fully visible
      gsap.set('#subheadline-vara-container', { opacity: 1 });
      gsap.set('#subheadline-vara-container path', { opacity: 1 });
      
      // Debug check elements
      if (props.showDebug) {
        const regularWrapper = document.querySelector('.regular-text-wrapper');
        const regularLetters = regularWrapper?.querySelectorAll('.letter');
        const varaContainer = document.querySelector('#subheadline-vara-container');
        const varaLetters = varaContainer?.querySelectorAll('path');
        
        debugLog(`Regular wrapper found: ${!!regularWrapper}`);
        debugLog(`Regular letters count: ${regularLetters?.length}`);
        debugLog(`Vara container found: ${!!varaContainer}`);
        debugLog(`Vara letters count: ${varaLetters?.length}`);
      }
    }
  })
  .to('.grid-container', {
    '--spotlight-x': '100%',
    duration: 2, // Increased duration for better visibility
    ease: 'power1.inOut',
    onStart: () => {
      debugLog('▶️ Starting LTR movement');
      resetLoggedTransitions();
    },
    onUpdate: function() {
      const gridContainer = document.querySelector('.grid-container');
      if (gridContainer) {
        const spotlightX = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
        
        // Log position changes for debugging
        if (props.showDebug) {
          const currentThreshold = Math.floor(spotlightX / 10) * 10;
          if (currentThreshold !== lastLoggedPosition.value) {
            debugLog(`⭐ Spotlight at ${currentThreshold}%`);
            lastLoggedPosition.value = currentThreshold;
          }
        }
        
        // Apply fill animation to headline
        const headlineOutline = document.querySelector('.outline-text-wrapper') as HTMLElement;
        if (headlineOutline) {
          applySpotlightReveal(headlineOutline, spotlightX, false);
        }
        
        // Update subheadline with letter-by-letter transition
        const regularText = document.querySelector('.regular-text-wrapper') as HTMLElement;
        if (regularText) {
          applySpotlightReveal(regularText, spotlightX, false);
        }
      }
    },
    onComplete: () => {
      debugLog('✅ LTR transitions complete');
      // Ensure final state
      gsap.set('#subheadline-vara-container', { opacity: 0 });
      gsap.set('#subheadline-vara-container path', { opacity: 0 });
      gsap.set('.regular-text-wrapper', { opacity: 1 });
      gsap.set('.regular-text-wrapper .letter', { opacity: 1 });
      
      // Debug check final state
      if (props.showDebug) {
        setTimeout(checkTextLayerVisibility, 100);
      }
    }
  })
  
  // 7. FINALE (15.6-18.6s)
  .to('.grid-container', {
    '--spotlight-x': '80%',
    '--spotlight-y': '80%',
    '--spotlight-size': '50%',
    duration: 1.5,
    ease: 'power2.inOut'
  })
  .to('.grid-container', {
    '--spotlight-x': '20%',
    '--spotlight-y': '20%',
    duration: 1.5,
    ease: 'power2.inOut',
    onComplete: () => {
      emit('complete');
    }
  });
});

// Add new function for headline Vara animation
const initHeadlineVara = async () => {
  try {
    await loadVara();
    
    // Initialize Vara with the headline text
    const headlineVaraInstance = new window.Vara(
      "#headline-vara-container",
      "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
      [
        {
          text: headline.value,
          fontSize: 48, // Larger size for headline
          strokeWidth: 2,
          color: 'var(--theme-primary, #88C0D0)',
          duration: 2000,
          letterSpacing: 2,
          y: 35,
          x: 0,
          textAlign: "center",
          autoAnimation: false
        }
      ],
      {
        strokeWidth: 2,
        fontSize: 48,
        textAlign: "center"
      }
    );

    headlineVaraInstance.ready(() => {
      const varaText = headlineVaraInstance.get(0);
      const varaLetters = varaText.characters;
      
      headline.value.split('').forEach((letter, index) => {
        if (varaLetters[index]) {
          varaLetters[index].setAttribute('data-letter', letter);
          varaLetters[index].style.opacity = '1';
        }
      });

      headlineVaraInstance.draw(0);
    });
  } catch (error) {
    console.error('Failed to load headline Vara:', error);
  }
};

// Update existing animateWords function to be subheadline-specific
const initSubheadlineVara = async () => {
  try {
    await loadVara();
    
    // Initialize Vara with the subheadline text
    varaInstance = new window.Vara(
      "#subheadline-vara-container",
      "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
      [
        {
          text: subheadline.value,
          fontSize: 24,
          strokeWidth: 2,
          color: 'var(--theme-primary, #88C0D0)',
          duration: 2000,
          letterSpacing: 2,
          y: 35,
          x: 0,
          textAlign: "center",
          autoAnimation: false
        }
      ],
      {
        strokeWidth: 2,
        fontSize: 24,
        textAlign: "center"
      }
    );

    varaInstance.ready(() => {
      const varaText = varaInstance.get(0);
      const varaLetters = varaText.characters;
      
      subheadline.value.split('').forEach((letter, index) => {
        if (varaLetters[index]) {
          varaLetters[index].setAttribute('data-letter', letter);
          varaLetters[index].style.opacity = '1';
        }
      });

      varaInstance.draw(0);
    });
  } catch (error) {
    console.error('Failed to load subheadline Vara:', error);
  }
};

// Add TypeScript type for Vara
declare global {
  interface Window {
    Vara: any;
  }
}

// Update function to check if a letter should be filled based on spotlight position
const isLetterFilled = (wordIndex: number, letterIndex: number) => {
  const gridContainer = document.querySelector('.grid-container');
  if (!gridContainer) return false;

  // Get all words and calculate total characters before this letter
  const words = headline.value.split(' ');
  let totalCharsBefore = 0;
  for (let i = 0; i < wordIndex; i++) {
    totalCharsBefore += words[i].length;
  }
  totalCharsBefore += letterIndex;
  
  // Calculate the letter's position in the text (as a percentage)
  const totalChars = headline.value.replace(/\s/g, '').length;
  const letterPosition = (totalCharsBefore / totalChars) * 100;
  
  // Get spotlight position
  const spotlightX = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
  
  // More generous buffer and ensure letters stay filled
  const buffer = 10; // Increased buffer size
  return letterPosition <= (spotlightX + buffer) || spotlightX >= 90; // Fill all remaining letters sooner
};

// Update isSubheadlineFilled function to be simpler and more reliable
const isSubheadlineFilled = (wordIndex: number) => {
  const gridContainer = document.querySelector('.grid-container');
  if (!gridContainer) return false;

  // If animation is complete, all words should be filled
  if (isAnimationComplete.value) return true;

  // Only check spotlight position if we're actually crossing text
  if (!isTextCrossing.value) return false;

  const spotlightX = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
  const words = subheadline.value.split(' ');
  
  // Calculate word position based on index
  const wordPosition = (wordIndex / words.length) * 100;
  
  // Fill word if spotlight has passed its position
  return spotlightX >= wordPosition;
};

let hasTransitionStarted = false; // Add flag to track transition start

// Add a function to check text layer visibility
const checkTextLayerVisibility = () => {
  const varaContainer = document.querySelector('#headline-vara-container');
  const outlineWrapper = document.querySelector('.outline-text-wrapper');
  const spotlightWrapper = document.querySelector('.headline-spotlight');

  console.log('\n📊 Text Layer Visibility Check:');
  
  if (varaContainer) {
    const varaOpacity = window.getComputedStyle(varaContainer).opacity;
    const varaLetters = varaContainer.querySelectorAll('path');
    const visibleVaraLetters = Array.from(varaLetters).filter(letter => 
      window.getComputedStyle(letter).opacity !== '0'
    ).length;
    
    console.log(`📜 Vara Container:
    - Opacity: ${varaOpacity}
    - Visible Letters: ${visibleVaraLetters}/${varaLetters.length}`);
  }
  
  if (outlineWrapper) {
    const outlineOpacity = window.getComputedStyle(outlineWrapper).opacity;
    console.log(`✏️ Outline Text:
    - Opacity: ${outlineOpacity}
    - Display: ${window.getComputedStyle(outlineWrapper).display}
    - Visibility: ${window.getComputedStyle(outlineWrapper).visibility}`);
  }
  
  if (spotlightWrapper) {
    const spotlightOpacity = window.getComputedStyle(spotlightWrapper).opacity;
    const clipPath = window.getComputedStyle(spotlightWrapper).clipPath;
    console.log(`🔦 Spotlight Text:
    - Opacity: ${spotlightOpacity}
    - Clip Path: ${clipPath}`);
  }
};

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