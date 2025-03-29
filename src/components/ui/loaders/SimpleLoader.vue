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
    
    <div class="grid-container" :style="{
      '--spotlight-x': `${spotlightX}%`,
      '--spotlight-y': `${spotlightY}%`
    }">
      <div class="grid-lines horizontal" ref="horizontalLines">
        <div v-for="i in 20" :key="`h-${i}`" class="grid-line" />
      </div>
      <div class="grid-lines vertical" ref="verticalLines">
        <div v-for="i in 20" :key="`v-${i}`" class="grid-line" />
      </div>
    </div>
    
    <div class="content-wrapper">
      <div class="text-container">
        <div class="headline">
          <svg v-for="(word, wordIndex) in headline.split(' ')" 
            :key="`headline-${wordIndex}`"
            :class="`word-${wordIndex}`"
            class="word"
            viewBox="0 0 150 50"
            preserveAspectRatio="xMidYMid meet"
          >
            <text v-for="(letter, letterIndex) in word.split('')"
              :key="`headline-${wordIndex}-${letterIndex}`"
              :class="`letter letter-${letterIndex} heading--accent theme-text--gradient-animated gradient-shine`"
              :x="(letterIndex * 25) + 10"
              y="50%"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="none"
              stroke="var(--theme-primary, #88C0D0)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              :style="{
                strokeDasharray: '1000',
                strokeDashoffset: '1000',
                transition: 'fill 0.3s ease'
              }"
            >{{ letter }}</text>
          </svg>
        </div>
        <div class="subheadline">
          <div v-for="(word, wordIndex) in subheadline.split(' ')" 
            :key="`subheadline-${wordIndex}`"
            :class="`word-${wordIndex}`"
            class="word heading--highlight theme-text--gradient-animated gradient-shine"
          >
            <span class="word-text"></span>
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
  for (let i = 0; i < numPositions; i++) {
    positions.push({
      x: getRandomPosition(10, 90), // Keep away from edges
      y: getRandomPosition(10, 90),
      size: getRandomPosition(30, 70) // Random size between 30% and 70%
    });
  }
  return positions;
};

onMounted(() => {
  console.log('Loader mounted, starting animation sequence');
  
  // Generate random positions for spotlight movement
  const randomPositions = generateRandomPositions(4); // Generate 4 random positions
  
  // Set initial states for horizontal and vertical lines separately
  gsap.set('.horizontal .grid-line', { scaleX: 0 });
  gsap.set('.vertical .grid-line', { scaleY: 0 });
  gsap.set('.text-container', { opacity: 0 });
  gsap.set('.grid-container', { 
    '--spotlight-size': '100%',
    '--spotlight-x': '50%',
    '--spotlight-y': '50%'
  }); // Start with full spotlight at center
  
  const tl = gsap.timeline();

  // Grid animation - horizontal lines
  tl.to('.horizontal .grid-line', {
    scaleX: 1,
    duration: 0.8,
    stagger: {
      each: 0.1,
      from: "random"
    },
    ease: 'power2.inOut',
    onStart: () => console.log('Horizontal grid animation started')
  })
  // Grid animation - vertical lines
  .to('.vertical .grid-line', {
    scaleY: 1,
    duration: 0.8,
    stagger: {
      each: 0.1,
      from: "random"
    },
    ease: 'power2.inOut',
    onStart: () => console.log('Vertical grid animation started')
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
    ease: 'power2.inOut',
    onStart: () => console.log('Spotlight size animation started')
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
  // Shrink spotlight to text size and move to right edge of text
  .to('.grid-container', {
    '--spotlight-size': '20%', // Smaller size for text scanning
    '--spotlight-x': '80%', // Start from right edge
    '--spotlight-y': '50%', // Center vertically
    duration: 1.5,
    ease: 'power2.inOut'
  })
  // Move spotlight horizontally through text and fill letters
  .to('.grid-container', {
    '--spotlight-x': '20%', // Move to left edge
    duration: 1.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      const letters = document.querySelectorAll('.headline .letter');
      const gridContainer = document.querySelector('.grid-container');
      if (!gridContainer) return;

      const spotlightX = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
      const spotlightSize = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-size'));
      
      letters.forEach(letter => {
        const rect = letter.getBoundingClientRect();
        const letterCenter = rect.left + rect.width / 2;
        const viewportWidth = window.innerWidth;
        
        // Calculate distance from spotlight center to letter center
        const spotlightCenterX = viewportWidth * (spotlightX / 100);
        const distance = Math.abs(letterCenter - spotlightCenterX);
        const maxDistance = viewportWidth * (spotlightSize / 100);
        
        // Fill letter if within spotlight range or if spotlight has passed
        if (distance < maxDistance || spotlightCenterX < letterCenter) {
          letter.classList.add('filled');
          letter.setAttribute('fill', 'url(#gradient)');
          letter.setAttribute('stroke', 'none');
        }
      });
    }
  })
  // Move spotlight to bottom right
  .to('.grid-container', {
    '--spotlight-x': '80%',
    '--spotlight-y': '80%',
    '--spotlight-size': '50%',
    duration: 1.5,
    ease: 'power2.inOut',
    onComplete: () => {
      // Ensure all letters remain filled at the end
      const letters = document.querySelectorAll('.headline .letter');
      letters.forEach(letter => {
        letter.classList.add('filled');
        letter.setAttribute('fill', 'url(#gradient)');
        letter.setAttribute('stroke', 'none');
      });
    }
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
  });
});

// Function to animate words
const animateWords = () => {
  const headlineWords = headline.value.split(' ');
  const subheadlineWords = subheadline.value.split(' ');
  
  // Create timeline for headline words with stroke animation
  const headlineTl = gsap.timeline();
  headlineWords.forEach((word, wordIndex) => {
    const letters = word.split('');
    letters.forEach((letter, letterIndex) => {
      headlineTl.to(`.headline .word-${wordIndex} .letter-${letterIndex}`, {
        strokeDashoffset: 0,
        duration: 0.2,
        ease: 'power2.inOut',
        delay: 0.01,
        onStart: () => console.log(`Animating headline letter ${letterIndex + 1} of word ${wordIndex + 1}`)
      });
    });
    // Add a smaller pause between words
    headlineTl.to({}, { duration: 0.1 });
  });
  
  // Create timeline for subheadline words with typewriter effect
  const subheadlineTl = gsap.timeline();
  subheadlineWords.forEach((word, wordIndex) => {
    subheadlineTl.to(`.subheadline .word-${wordIndex} .word-text`, {
      text: { value: word, delimiter: '' },
      duration: 0.2, // Make it a bit faster
      ease: 'none',
      delay: 0.02,
      onStart: () => console.log(`Animating subheadline word ${wordIndex + 1}`)
    });
  });
  
  // Start subheadline animation after headline
  headlineTl.add(subheadlineTl, '-=0.6');
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
}

.text-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.headline, .subheadline {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.15rem;
}

.word {
  display: inline-block;
  position: relative;
  width: auto;
  height: 1.2em;
  margin: 0 0.5em;
  overflow: visible;
}

.letter {
  font-family: inherit;
  will-change: stroke-dashoffset, fill;
  transition: fill 0.3s ease;
}

.headline .word {
  font-size: 2.5rem;
  font-weight: bold;
  min-width: 100px;
}

.headline .letter {
  font-family: inherit;
  will-change: stroke-dashoffset, fill;
  transition: fill 0.3s ease;
}

.headline .letter.filled {
  fill: url(#gradient);
  stroke: none;
}

.subheadline .word {
  font-size: 1.5rem;
  min-width: 80px;
  display: inline-block;
  margin: 0 0.25em;
}

.subheadline .word-text {
  display: inline-block;
  background: linear-gradient(to right, var(--theme-primary, #88C0D0), var(--theme-secondary, #5E81AC));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
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
  animation: shine 3s linear infinite;
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}

.gradient-shine {
  animation: shine 3s linear infinite;
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
</style> 