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
      <div class="spotlight-indicator"></div>
      
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
          <template v-for="(word, wordIndex) in headline.split(' ')" :key="`word-${wordIndex}`">
            <span class="word">
              <span v-for="(char, letterIndex) in word" 
                    :key="`letter-${wordIndex}-${letterIndex}`"
                    class="letter"
                    :data-word-index="wordIndex"
                    :data-letter-index="letterIndex"
                    :style="{
                      opacity: isLetterVisible(wordIndex, letterIndex) ? 1 : 0,
                      transform: isLetterVisible(wordIndex, letterIndex) ? 'translateY(0)' : 'translateY(10px)'
                    }">
                {{ char }}
              </span>
            </span>
            <span v-if="wordIndex < headline.split(' ').length - 1" 
                  class="space"
                  :style="{
                    opacity: isSpaceVisible(wordIndex) ? 1 : 0
                  }">&nbsp;</span>
          </template>
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
        <div class="theme-text--gradient-animated gradient-shine subheading-responsive heading--highlight">
          <!-- Vara container - Initial handwritten animation -->
          <div id="vara-container"></div>
          
          <!-- Regular text - Legacy transition system -->
          <div class="regular-text-wrapper">
            <span v-for="(letter, index) in subheadline" :key="index" class="letter" :style="{
              display: currentSubheadlineLetter >= index ? 'inline-block' : 'none'
            }">{{ letter }}</span>
          </div>
          
          <!-- Spotlight text - New reveal animation -->
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
  
  2. HEADLINE TYPING (1.1-3.1s)
     - Letter by letter appearance
     - Each letter takes 0.1s
     - Includes gradient fill effect
  
  3. VARA TEXT (3.1s)
     - Handwritten animation starts
     - Controlled by Vara library
     - Must complete before spotlight
  
  4. SPOTLIGHT SEQUENCE (3.1-7.6s)
     - Initial spotlight shrink
     - Random position movements
     - Final position for text crossing
  
  5. TEXT TRANSITION (7.6-13.6s)
     - Spotlight crosses text area
     - Reveals regular text
     - Vara text fades out
  
  6. FINALE (13.6-16.6s)
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

// Add function to handle spotlight reveal effect
const applySpotlightReveal = (element: HTMLElement, spotlightX: number) => {
  if (!element) return;
  const clipAmount = Math.max(0, Math.min(100, 100 - spotlightX));
  element.style.clipPath = `inset(0 ${clipAmount}% 0 0)`;
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
  
  const tl = gsap.timeline();

  // Grid animation - horizontal lines
  tl.to('.horizontal .grid-line', {
    scaleX: 1,
    duration: 0.8,
    stagger: {
      each: 0.1,
      from: "random"
    },
    ease: 'power2.inOut'
  })
  // Grid animation - vertical lines
  .to('.vertical .grid-line', {
    scaleY: 1,
    duration: 0.8,
    stagger: {
      each: 0.1,
      from: "random"
    },
    ease: 'power2.inOut'
  }, '-=0.4')
  // Fade in text container and start text animation
  .to('.text-container', {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.inOut',
    onComplete: () => {
      startTyping();
    }
  }, '-=0.6')
  // Continue with the rest of the animations
  .to({}, { duration: 1.5 })
  // First shrink the spotlight
  .to('.grid-container', {
    '--spotlight-size': '50%',
    duration: 1.5,
    ease: 'power2.inOut',
    onComplete: () => {
      // Start subheadline animation after headline typing is complete
      animateWords();
    }
  })
  // Move spotlight to random positions with random sizes
  .to('.grid-container', {
    '--spotlight-x': `${randomPositions[0].x}%`,
    '--spotlight-y': `${randomPositions[0].y}%`,
    '--spotlight-size': `${randomPositions[0].size}%`,
    duration: 1.5,
    ease: 'power2.inOut'
  })
  .to('.grid-container', {
    '--spotlight-x': `${randomPositions[1].x}%`,
    '--spotlight-y': `${randomPositions[1].y}%`,
    '--spotlight-size': `${randomPositions[1].size}%`,
    duration: 1.5,
    ease: 'power2.inOut'
  })
  .to('.grid-container', {
    '--spotlight-x': `${randomPositions[2].x}%`,
    '--spotlight-y': `${randomPositions[2].y}%`,
    '--spotlight-size': `${randomPositions[2].size}%`,
    duration: 1.5,
    ease: 'power2.inOut'
  })
  .to('.grid-container', {
    '--spotlight-x': `${randomPositions[3].x}%`,
    '--spotlight-y': `${randomPositions[3].y}%`,
    '--spotlight-size': `${randomPositions[3].size}%`,
    duration: 1.5,
    ease: 'power2.inOut'
  })
  // Add new simple right-to-left movement
  .to('.grid-container', {
    '--spotlight-x': '100%',
    '--spotlight-y': `${centerY}%`,
    duration: 1.5,
    ease: 'power2.inOut'
  })
  .to('.grid-container', {
    '--spotlight-x': '0%',
    '--spotlight-y': `${centerY}%`,
    duration: 3,
    ease: 'power1.inOut'
  })
  // First text crossing (left to right)
  .to('.grid-container', {
    '--spotlight-size': '20%',
    '--spotlight-x': '0%',
    '--spotlight-y': `${centerY}%`,
    duration: 1.5,
    ease: 'power2.inOut',
    onComplete: () => {
      isTextCrossing.value = true;
    }
  })
  .to('.grid-container', {
    '--spotlight-x': '100%',
    '--spotlight-y': `${centerY}%`,
    duration: 6,
    ease: 'power1.inOut',
    onStart: () => {
      isTextCrossing.value = true;
      currentSubheadlineLetter.value = 0;
    },
    onUpdate: function() {
      const gridContainer = document.querySelector('.grid-container');
      if (gridContainer) {
        const spotlightX = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
        
        if (isTextCrossing.value) {
          const headlineLetters = document.querySelectorAll('.headline .letter');
          headlineLetters.forEach((letter, index) => {
            const letterPosition = (index / headlineLetters.length) * 100;
            if (spotlightX >= letterPosition) {
              letter.classList.add('filled');
            }
          });

          const spotlightTextWrapper = document.querySelector('.spotlight-text-wrapper') as HTMLElement;
          if (spotlightTextWrapper) {
            applySpotlightReveal(spotlightTextWrapper, spotlightX);
          }
        }
        
        if (isTextCrossing.value && !isLetterTransitioning.value) {
          const text = subheadline.value;
          if (currentSubheadlineLetter.value < text.length) {
            const progress = spotlightX / 100;
            const letterProgress = (currentSubheadlineLetter.value + 1) / text.length;
            const transitionPoint = 0.05 + (letterProgress * 0.4);
            
            if (progress >= transitionPoint) {
              const varaContainer = document.querySelector('#vara-container') as HTMLElement;
              const regularLetters = document.querySelectorAll('.regular-text-wrapper .letter') as NodeListOf<HTMLElement>;
              const currentLetter = regularLetters[currentSubheadlineLetter.value];
              
              if (currentLetter && currentLetter.style.opacity !== '1') {
                isLetterTransitioning.value = true;
                
                const varaText = varaInstance.get(0);
                const varaLetter = varaText.characters[currentSubheadlineLetter.value];
                
                if (varaLetter && varaContainer) {
                  const varaRect = varaLetter.getBoundingClientRect();
                  const containerRect = varaContainer.getBoundingClientRect();
                  
                  const allVaraLetters = varaText.characters;
                  
                  let lineStartIndex = currentSubheadlineLetter.value;
                  while (lineStartIndex > 0) {
                    const prevChar = subheadline.value[lineStartIndex - 1];
                    if (prevChar === '\n' || prevChar === '\r') {
                      break;
                    }
                    lineStartIndex--;
                  }
                  
                  const lineFirstVaraLetter = allVaraLetters[lineStartIndex];
                  const lineBaselineTop = lineFirstVaraLetter ? 
                    lineFirstVaraLetter.getBoundingClientRect().top - containerRect.top : 
                    varaRect.top - containerRect.top;
                  
                  currentLetter.style.display = 'block';
                  currentLetter.style.position = 'absolute';
                  currentLetter.style.left = `${varaRect.left - containerRect.left}px`;
                  currentLetter.style.top = `${lineBaselineTop}px`;
                  currentLetter.style.opacity = '0';
                  
                  currentLetter.offsetHeight;
                  
                  const letterTimeline = gsap.timeline({
                    onComplete: () => {
                      isLetterTransitioning.value = false;
                      currentSubheadlineLetter.value++;
                    }
                  });

                  letterTimeline
                    .to(varaLetter, {
                      opacity: 0,
                      duration: 0.05,
                      ease: 'none'
                    })
                    .to(currentLetter, {
                      opacity: 1,
                      duration: 0.05,
                      ease: 'none'
                    }, '<');
                }
              }
            }
          }
        }
      }
    },
    onComplete: () => {
      console.log('🎯 First Spotlight Animation Complete');
      isTextCrossing.value = false;
    }
  })
  // Move spotlight to bottom right
  .to('.grid-container', {
    '--spotlight-x': '80%',
    '--spotlight-y': '80%',
    '--spotlight-size': '50%',
    duration: 1.5,
    ease: 'power2.inOut'
  })
  // Move spotlight diagonally to final position
  .to('.grid-container', {
    '--spotlight-x': '20%',
    '--spotlight-y': '20%',
    duration: 1.5,
    ease: 'power2.inOut',
    onComplete: () => {
      emit('complete');
    },
    onUpdate: () => {
      const gridContainer = document.querySelector('.grid-container');
      if (gridContainer && props.showDebug) {
        const spotlightX = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
        const spotlightSize = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-size'));
      }
    }
  });
});

// Update animateWords function to properly handle Vara
const animateWords = async () => {
  try {
    await loadVara();
    
    // Initialize Vara with the subheadline text
    varaInstance = new window.Vara(
      "#vara-container",
      "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
      [
        {
          text: subheadline.value,
          fontSize: 24, // Matching the max size of regular text (3rem = 48px)
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
        fontSize: 24, // Matching the max size of regular text
        textAlign: "center"
      }
    );

    // When Vara is ready
    varaInstance.ready(() => {
      console.log('=== Vara Animation Start ===');
      isAnimationComplete.value = true;
      
      // Get the Vara text object
      const varaText = varaInstance.get(0);
      // Store references to each letter's SVG group
      const varaLetters = varaText.characters;
      
      // Add data attributes to each letter using subheadline
      subheadline.value.split('').forEach((letter, index) => {
        if (varaLetters[index]) {
          varaLetters[index].setAttribute('data-letter', letter);
          varaLetters[index].style.opacity = '1';
        }
      });

      // Draw the Vara text immediately
      varaInstance.draw(0);
    });
  } catch (error) {
    console.error('Failed to load Vara:', error);
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem; /* Reduce from 8rem to 2rem */
  font-size: 2.5rem;
  font-weight: bold;
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

#vara-container {
  pointer-events: none;
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.regular-text-wrapper {
  visibility: hidden;
  pointer-events: none;
  position: absolute;
  z-index: 1;
}

/* Add debug styles for Vara letters */
#vara-container svg path {
  outline: 1px solid rgba(255, 0, 255, 0.5); /* Magenta border for Vara letters */
}

.regular-text-wrapper {
  width: 100%;
  height: auto;
  min-height: 120px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  white-space: pre-wrap;
  visibility: visible; /* Make visible again */
  pointer-events: none;
  opacity: 1; /* Make fully visible */
  clip-path: inset(0 100% 0 0); /* Start fully hidden */
}

.regular-text-wrapper .letter {
  position: absolute;
  opacity: 0;
  display: none;
  background: linear-gradient(
    to right,
    var(--theme-primary, #88C0D0),
    var(--theme-secondary, #5E81AC)
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shine 3s linear infinite;
  font-family: 'Raleway', sans-serif;
  font-size: clamp(1rem, 2.5vw, 3rem);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0;
  margin: 0;
  pointer-events: none;
  max-width: 100%; /* Added to prevent overflow */
}

.subheadline .word {
  font-size: 1.5rem;
  background: linear-gradient(to right, var(--theme-primary, #88C0D0), var(--theme-secondary, #5E81AC));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0;
  transform: translateY(20px);
  transition: font-family 0.3s ease;
}

.word {
  display: inline-flex;
  gap: 0.1em;
}

.letter {
  position: relative;
  color: transparent;
  -webkit-text-stroke: 2px var(--theme-primary, #88C0D0);
  transition: all 0.3s ease;
  display: inline-block;
  min-width: 0.5em;
  opacity: 1;
  transform: none;
}

/* Remove the old animation delays */
.letter:nth-child(1) { animation-delay: 0s; }
.letter:nth-child(2) { animation-delay: 0s; }
/* ... remove all other letter delays ... */

/* Calculate animation delay for each letter */
.letter:nth-child(1) { animation-delay: 0.1s; }
.letter:nth-child(2) { animation-delay: 0.2s; }
.letter:nth-child(3) { animation-delay: 0.3s; }
.letter:nth-child(4) { animation-delay: 0.4s; }
.letter:nth-child(5) { animation-delay: 0.5s; }
.letter:nth-child(6) { animation-delay: 0.6s; }
.letter:nth-child(7) { animation-delay: 0.7s; }
.letter:nth-child(8) { animation-delay: 0.8s; }
.letter:nth-child(9) { animation-delay: 0.9s; }
.letter:nth-child(10) { animation-delay: 1s; }
.letter:nth-child(11) { animation-delay: 1.1s; }
.letter:nth-child(12) { animation-delay: 1.2s; }
.letter:nth-child(13) { animation-delay: 1.3s; }
.letter:nth-child(14) { animation-delay: 1.4s; }
.letter:nth-child(15) { animation-delay: 1.5s; }
.letter:nth-child(16) { animation-delay: 1.6s; }
.letter:nth-child(17) { animation-delay: 1.7s; }
.letter:nth-child(18) { animation-delay: 1.8s; }
.letter:nth-child(19) { animation-delay: 1.9s; }
.letter:nth-child(20) { animation-delay: 2s; }

@keyframes writeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modified filled state to work with writing animation */
.letter.filled {
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
</style> 