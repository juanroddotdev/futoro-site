<template>
  <div class="preloader" :class="{ 'is-hidden': !isVisible }">
    <!-- Add SVG defs for gradient -->
    <svg width="0" height="0">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:var(--theme-primary, #88C0D0);" />
          <stop offset="50%" style="stop-color:var(--theme-secondary, #5E81AC);" />
          <stop offset="100%" style="stop-color:var(--theme-primary, #88C0D0);" />
        </linearGradient>
      </defs>
    </svg>
    
    <div class="grid-container" :class="{ 'debug-mode': debugMode }" :style="{
      '--spotlight-x': `${spotlightX}%`,
      '--spotlight-y': `${spotlightY}%`
    }">
      <!-- Add spotlight position indicator -->
      <div v-if="debugMode && isTextCrossing" class="spotlight-indicator"></div>
      
      <div class="grid-lines horizontal" ref="horizontalLines">
        <div v-for="i in 20" :key="`h-${i}`" class="grid-line" />
      </div>
      <div class="grid-lines vertical" ref="verticalLines">
        <div v-for="i in 20" :key="`v-${i}`" class="grid-line" />
      </div>
    </div>
    
    <div class="content-wrapper">
      <div class="text-container">
        <div class="headline theme-text--gradient-animated gradient-shine">
          <span v-for="(word, wordIndex) in headline.split(' ')" 
                :key="`word-${wordIndex}`"
                class="word">
            <span v-for="(letter, letterIndex) in word.split('')"
                  :key="`letter-${letterIndex}`"
                  class="letter"
                  :class="{ 
                    'filled': isLetterFilled(wordIndex, letterIndex),
                    'debug-highlight': debugMode && isLetterFilled(wordIndex, letterIndex)
                  }"
                  :data-position="getLetterPosition(wordIndex, letterIndex)"
                  :data-word-index="wordIndex"
                  :data-letter-index="letterIndex">
              {{ letter }}
            </span>
          </span>
        </div>
        
        <div class="subheadline theme-text--gradient-animated gradient-shine">
          <div v-for="(word, wordIndex) in subheadline.split(' ')" 
            :key="`subheadline-${wordIndex}`"
            :class="`word word-${wordIndex} heading--highlight`"
          >
            {{ word }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import gsap from 'gsap';
import SpotlightText from '@/components/text/SpotlightText.vue';
import { HeroContent, getRandomHeroContent } from '@/data/heroContentData';

const props = defineProps<{
  headline?: string;
  subheadline?: string;
  spotlightX?: number;
  spotlightY?: number;
  heroContent?: HeroContent;
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const isVisible = ref(true);
const horizontalLines = ref(null);
const verticalLines = ref(null);
const headlineText = ref(null);
const subheadlineText = ref(null);

const debugMode = ref(false);
const isTextCrossing = ref(false); // Track when we're crossing the text

// Add filledLetters ref for tracking
const filledLetters = ref(new Set());

// Use provided hero content or get random one, matching HeroSectionChat
const heroContent = computed(() => props.heroContent || getRandomHeroContent());

const headline = computed(() => props.headline || heroContent.value.headline);
const subheadline = computed(() => props.subheadline || heroContent.value.subheadline);

const spotlightX = ref(props.spotlightX ?? 20);
const spotlightY = ref(props.spotlightY ?? 20);

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

// Add function to get letter position for debugging
const getLetterPosition = (wordIndex: number, letterIndex: number) => {
  const words = headline.value.split(' ');
  let totalCharsBefore = 0;
  for (let i = 0; i < wordIndex; i++) {
    totalCharsBefore += words[i].length;
  }
  totalCharsBefore += letterIndex;
  
  const totalChars = headline.value.replace(/\s/g, '').length;
  return (totalCharsBefore / totalChars) * 100;
};

onMounted(() => {
  // Setup MutationObserver for letter fill tracking
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const target = mutation.target as HTMLElement;
      if (target.classList.contains('letter')) {
        const letter = target;
        if (target.classList.contains('filled') && debugMode.value && isTextCrossing.value) {
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
  }, '-=0.4') // Start vertical lines before horizontal lines finish
  // Fade in text container and start text animation earlier
  .to('.text-container', {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.inOut',
    onStart: () => {
      // Start word animations while grid is still animating
      animateWords();
    }
  }, '-=0.6') // Start text container fade in 0.6s before grid animation ends
  // Wait a bit before starting the spotlight animation
  .to({}, { duration: 1.5 }) // Add a pause before spotlight starts
  // First shrink the spotlight
  .to('.grid-container', {
    '--spotlight-size': '50%',
    duration: 1.5,
    ease: 'power2.inOut'
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
  // Shrink spotlight to text size and move to left edge of text
  .to('.grid-container', {
    '--spotlight-size': '20%',
    '--spotlight-x': '0%',
    '--spotlight-y': `${centerY}%`, // Use text center Y
    duration: 1.5,
    ease: 'power2.inOut',
    onComplete: () => {
      isTextCrossing.value = true;
    }
  })
  // Move spotlight horizontally through text and fill letters
  .to('.grid-container', {
    '--spotlight-x': '100%',
    '--spotlight-y': `${centerY}%`, // Keep Y centered on text
    duration: 4, // Increased from 3 to 4 seconds
    ease: 'power1.inOut',
    onStart: () => {
      isTextCrossing.value = true;
    },
    onUpdate: function() {
      if (debugMode.value) {
        const progress = this.progress();
        const gridContainer = document.querySelector('.grid-container');
        if (gridContainer) {
          const spotlightX = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
          
          // Force update all letters based on current spotlight position
          const words = headline.value.split(' ');
          words.forEach((word, wordIndex) => {
            word.split('').forEach((_, letterIndex) => {
              const letterPosition = getLetterPosition(wordIndex, letterIndex);
              const letter = document.querySelector(`[data-word-index="${wordIndex}"][data-letter-index="${letterIndex}"]`);
              if (letter && letterPosition <= (spotlightX + 10)) { // Increased buffer during animation
                letter.classList.add('filled');
              }
            });
          });
        }
      }
    },
    onComplete: () => {
      // Force fill any remaining letters
      const letters = document.querySelectorAll('.letter');
      letters.forEach((letter: Element) => {
        (letter as HTMLElement).classList.add('filled');
      });
      
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
    }
  })
  // Add debug logging to spotlight movement
  .to('.grid-container', {
    '--spotlight-x': '20%',
    duration: 1.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      const gridContainer = document.querySelector('.grid-container');
      if (gridContainer && debugMode.value) {
        const spotlightX = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
        const spotlightSize = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-size'));
      }
    }
  });
});

// Simplify animateWords function to just handle subheadline text
const animateWords = () => {
  const subheadlineWords = subheadline.value.split(' ');
  
  // Animate subheadline words
  const subheadlineTl = gsap.timeline();
  subheadlineWords.forEach((word, index) => {
    subheadlineTl.fromTo(`.subheadline .word-${index}`, {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
      delay: index * 0.1
    });
  });
};

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
</script>

<style scoped>
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
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: bold;
}

.subheadline {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.subheadline .word {
  font-size: 1.5rem;
  /* padding: 0.5rem 1rem; */
  background: linear-gradient(to right, var(--theme-primary, #88C0D0), var(--theme-secondary, #5E81AC));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0;
  transform: translateY(20px);
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
}

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
</style> 