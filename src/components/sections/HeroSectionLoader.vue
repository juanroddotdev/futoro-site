<template>
  <div class="hero-section-loader" :class="{ 'is-hidden': !isVisible }">
    <!-- PaperGridBackground for comparison -->
    <div class="paper-grid-comparison" :style="{ display: usePaperGrid ? 'block' : 'none' }">
      <PaperGridBackground 
        :theme="currentTheme"
        :floating="true"
        :spotlight="true"
        :spotlightX="spotlightX"
        :spotlightY="spotlightY"
      />
    </div>

    <!-- Grid and Spotlight System -->
    <div class="grid-container" :class="{ 'debug-mode': showDebug }">
      <div class="grid-lines horizontal">
        <div v-for="i in 20" :key="`h-${i}`" class="grid-line" />
      </div>
      <div class="grid-lines vertical">
        <div v-for="i in 20" :key="`v-${i}`" class="grid-line" />
      </div>
      <div v-if="showDebug" class="spotlight-indicator"></div>
    </div>

    <!-- Content Container -->
    <div class="content-wrapper">
      <!-- Navbar Container -->
      <svg id="navbar-svg" class="wireframe-svg" viewBox="0 0 1200 120" preserveAspectRatio="xMidYMid meet">
        <SvgFilters />
        <!-- Container draws first -->
        <path class="navbar-container-path" 
          d="M10,10 L1190,10 L1190,110 L10,110 L10,10" 
          v-bind="getDataAttributes(animationTimings.navbar.container)"
          fill="none" stroke="white" stroke-width="2" />

        <!-- Logo and nav items draw in sequence -->
        <path class="navbar-logo-path" 
          d="M32,38 L152,38 L152,62 L32,62 L32,38" 
          v-bind="getDataAttributes(animationTimings.navbar.logo)"
          fill="none" stroke="white" stroke-width="2" />

        <path class="navbar-link-1-path" 
          d="M600,38 L680,38 L680,62 L600,62 L600,38" 
          v-bind="getDataAttributes(animationTimings.navbar.link1)"
          fill="none" stroke="white" stroke-width="2" />

        <path class="navbar-link-2-path" 
          d="M720,38 L800,38 L800,62 L720,62 L720,38" 
          v-bind="getDataAttributes(animationTimings.navbar.link2)"
          fill="none" stroke="white" stroke-width="2" />

        <path class="navbar-link-3-path" 
          d="M840,38 L920,38 L920,62 L840,62 L840,38" 
          v-bind="getDataAttributes(animationTimings.navbar.link3)"
          fill="none" stroke="white" stroke-width="2" />

        <path class="navbar-cta-path" 
          d="M960,35 L1060,35 C1080,35 1080,65 1060,65 L960,65 C940,65 940,35 960,35"
          v-bind="getDataAttributes(animationTimings.navbar.cta)"
          fill="none" stroke="white" stroke-width="2" />

        <!-- Pencil effect -->
        <circle class="pencil-dot" cx="10" cy="10" r="3" fill="#ffffff" opacity="0" />
      </svg>

      <!-- Text Container -->
      <div class="text-container">
        <!-- Headline Section -->
        <div class="headline-section">
          <svg id="headline-svg" class="wireframe-svg" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid meet">
            <SvgFilters />
            <path class="headline-container-path" 
              d="M0,0 L1200,0 L1200,200 L0,200 L0,0" 
              v-bind="getDataAttributes(animationTimings.headline.container)"
              fill="none" stroke="white" stroke-width="2" />
            <circle class="headline-pencil-dot" cx="0" cy="0" r="3" fill="#ffffff" opacity="0" />
            
            <!-- Headline Text Content -->
            <g class="headline-content">
              <!-- Vara container for headline -->
              <foreignObject x="0" y="0" width="1200" height="200">
                <div id="headline-vara-container" xmlns="http://www.w3.org/1999/xhtml"></div>
              </foreignObject>
              
              <!-- Outline Text Layer -->
              <foreignObject x="0" y="0" width="1200" height="200">
                <div class="outline-text-wrapper" xmlns="http://www.w3.org/1999/xhtml">
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
              </foreignObject>
              
              <!-- Spotlight Text Layer -->
              <foreignObject x="10" y="10" width="1180" height="180">
                <h1 class="spotlight-text-wrapper headline-spotlight theme-text--gradient-animated gradient-shine heading--accent mb-4 mt-2 heading-responsive-large" xmlns="http://www.w3.org/1999/xhtml">
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
                </h1>
              </foreignObject>
            </g>
          </svg>
        </div>

        <!-- Subheadline Section -->
        <div class="subheadline-section">
          <svg id="subheadline-svg" class="wireframe-svg" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid meet">
            <SvgFilters />
            <path class="subheadline-container-path" 
              d="M10,10 L1190,10 L1190,190 L10,190 L10,10" 
              v-bind="getDataAttributes(animationTimings.subheadline.container)"
              fill="none" stroke="white" stroke-width="2" />
            <circle class="subheadline-pencil-dot" cx="10" cy="10" r="3" fill="#ffffff" opacity="0" />
            
            <!-- Subheadline Text Content -->
            <g class="subheadline-content">
              <!-- Vara container for subheadline -->
              <foreignObject x="10" y="10" width="1180" height="180">
                <div id="subheadline-vara-container" xmlns="http://www.w3.org/1999/xhtml"></div>
              </foreignObject>
              
              <!-- Regular Text Layer -->
              <foreignObject x="10" y="10" width="1180" height="180">
                <div class="regular-text-wrapper" xmlns="http://www.w3.org/1999/xhtml">
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
              </foreignObject>
              
              <!-- Spotlight Text Layer -->
              <foreignObject x="10" y="10" width="1180" height="180">
                <p class="spotlight-text-wrapper theme-text--gradient-animated gradient-shine heading--highlight mb-8 subheading-responsive" xmlns="http://www.w3.org/1999/xhtml">
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
                </p>
              </foreignObject>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import gsap from 'gsap';
import Vivus from 'vivus';
import { useVara } from '@/composables/useVara';
import { useVivusInstances } from '@/composables/useVivusInstances';
import { usePencilAnimation } from '@/composables/usePencilAnimation';
import SvgFilters from '@/components/svg/SvgFilters.vue';
import { HeroContent, getRandomHeroContent } from '@/data/heroContentData';
import PaperGridBackground from '@/components/ui/backgrounds/PaperGridBackground.vue';
import { createPhasedTimeline, buildCompleteTimeline } from './hero-loader/utils/phasedTimelineUtils';
import { createPhasedSpotlight } from './hero-loader/utils/phasedSpotlightEffect';
import { setupGridInitialState } from './hero-loader/utils/phasedTimelineUtils';

const props = defineProps<{
  headline?: string;
  subheadline?: string;
  heroContent?: HeroContent;
  showDebug?: boolean;
  pauseAnimations?: boolean;
  currentTheme?: string;
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
  (e: 'pause'): void;
  (e: 'resume'): void;
}>();

// State
const isVisible = ref(true);
const timeline = ref<gsap.core.Timeline | null>(null);
const startTime = ref<number | null>(null);
const headlineVaraInstance = ref<any>(null);
const subheadlineVaraInstance = ref<any>(null);
const usePaperGrid = ref(false);

// Pause controls
const isPausedAfterVara = ref(false);
const isPausedAfterRTL = ref(false);
const isPausedAfterLTR = ref(false);

// Content
const heroContent = computed(() => props.heroContent || getRandomHeroContent());
const headline = computed(() => props.headline || heroContent.value.headline);
const subheadline = computed(() => props.subheadline || heroContent.value.subheadline);

// Composables
const { loadVara } = useVara();
const { instances: vivusInstances, createVivusInstance } = useVivusInstances();
const { animatePencilAlongPath } = usePencilAnimation();

// Add spotlight position refs
const spotlightX = ref(20);
const spotlightY = ref(20);

// Add a function to update the spotlight position
const updateSpotlightPosition = (x: number, y: number) => {
  const gridContainer = document.querySelector('.grid-container') as HTMLElement;
  if (gridContainer) {
    gridContainer.style.setProperty('--spotlight-x', `${x}%`);
    gridContainer.style.setProperty('--spotlight-y', `${y}%`);
  }
  spotlightX.value = x;
  spotlightY.value = y;
};

// Animation timing configuration
const animationTimings = {
  // Phase 1: Grid Intro (0-1.6s)
  grid: {
    horizontal: { start: 0, duration: 0.8 },
    vertical: { start: 0.4, duration: 0.8 },
    textContainer: { start: 0.8, duration: 0.5 }
  },
  
  // Phase 2: Wireframe Containers
  navbar: {
    container: { start: 0, duration: 0.2 },
    logo: { start: 0.1, duration: 0.15 },
    link1: { start: 0.15, duration: 0.15 },
    link2: { start: 0.2, duration: 0.15 },
    link3: { start: 0.25, duration: 0.15 },
    cta: { start: 0.3, duration: 0.15 }
  },
  headline: {
    container: { start: 0.15, duration: 0.3 }
  },
  subheadline: {
    container: { start: 0.25, duration: 0.3 }
  },
  
  // Phase 3: Text Animations
  text: {
    headline: { start: 1.1, duration: 2.0 },
    subheadline: { start: 3.1, duration: 2.0 }
  },
  
  // Phase 4: Spotlight Sequence (5.1-9.6s)
  spotlight: {
    sizeAdjust: { start: 5.1, duration: 1.5 },
    positionRTL: { start: 6.6, duration: 3.0 }
  },
  
  // Phase 5: Headline Transition (9.6-12.6s)
  transition: {
    rtl: { start: 9.6, duration: 3.0 }
  },
  
  // Phase 6: Final Transitions (12.6-15.6s)
  final: {
    ltr: { start: 12.6, duration: 1.5 },
    ltrMove: { start: 14.1, duration: 1.5 }
  },
  
  // Phase 7: Finale (15.6-18.6s)
  finale: {
    spotlight1: { start: 15.6, duration: 1.5 },
    spotlight2: { start: 17.1, duration: 1.5 }
  }
};

// Helper function to get data attributes
const getDataAttributes = (timing: { start: number; duration: number }) => ({
  'data-start': timing.start * 1000, // Convert to milliseconds
  'data-duration': timing.duration * 1000 // Convert to milliseconds
});

// Helper function to get timeline position
const getTimelinePosition = (timing: { start: number; duration: number }) => {
  return `+=${timing.start}`;
};

// Helper function to get timeline duration
const getTimelineDuration = (timing: { start: number; duration: number }) => {
  return timing.duration;
};

const resumeAnimation = () => {
  if (timeline.value) {
    timeline.value.resume();
  }
};

const showDebug = ref(false);

// Update the font size calculation
const calculateResponsiveFontSize = (containerWidth: number, text: string) => {
  // Base size for reference width of 1200px and height of 200px
  const baseSize = 72;
  const baseWidth = 1200;
  const baseHeight = 200;
  
  // Calculate size based on container width and text length
  const textLength = text.length;
  const scaleFactor = Math.min(containerWidth / baseWidth, 1);
  
  // Adjust for text length - longer text should be smaller
  const lengthFactor = Math.min(1, 25 / textLength);
  
  // Calculate final size
  const fontSize = Math.floor(baseSize * scaleFactor * lengthFactor);
  
  // Ensure font size doesn't exceed container height
  const maxSize = Math.floor(baseHeight * 0.4); // 40% of container height
  return Math.min(fontSize, maxSize);
};

// Add this before onMounted
const updateVaraFontSize = () => {
  if (!headlineVaraInstance.value) return;
  
  const container = document.querySelector('#headline-vara-container');
  if (!container) return;
  
  const containerWidth = container.clientWidth;
  const fontSize = calculateResponsiveFontSize(containerWidth, headline.value);
  
  // Update Vara instance with new font size
  headlineVaraInstance.value.setFontSize(fontSize);
};

// Add debounced resize handler
let resizeTimeout: number | null = null;
const handleResize = () => {
  if (resizeTimeout) {
    window.clearTimeout(resizeTimeout);
  }
  
  resizeTimeout = window.setTimeout(() => {
    updateVaraFontSize();
  }, 250);
};

onMounted(async () => {
  // Set start time
  startTime.value = Date.now();
  console.log(`[HeroSectionLoader] Component mounted`);
  
  // Initialize Vivus instances
  const navbarSvg = document.querySelector('#navbar-svg') as SVGElement;
  const headlineSvg = document.querySelector('#headline-svg') as SVGElement;
  const subheadlineSvg = document.querySelector('#subheadline-svg') as SVGElement;

  // Setup initial state for grid animations only
  setupGridInitialState();

  // Build the complete timeline with all phases
  const timeline = buildCompleteTimeline({
    headline: headlineVaraInstance.value,
    subheadline: subheadlineVaraInstance.value,
    loadVara: async () => {
      return Promise.resolve();
    },
    onContainersDrawn: async () => {
      // Get container width for responsive sizing
      const container = document.querySelector('#headline-vara-container');
      const containerWidth = container?.clientWidth || 1180;
      
      // Initialize Vara text instances after containers are drawn
      headlineVaraInstance.value = await loadVara('#headline-vara-container', {
        fontSize: calculateResponsiveFontSize(containerWidth, headline.value),
        strokeWidth: 2,
        textAlign: 'center',
        text: headline.value,
        y: 100,
        duration: 2000,
        delay: 1000,
        letterSpacing: 0.1,
        autoAnimation: true,
        color: 'var(--theme-primary, #88C0D0)',
        font: '/futoro-site/fonts/Satisfy/SatisfySL.json',
      });

      subheadlineVaraInstance.value = await loadVara('#subheadline-vara-container', {
        fontSize: 36,
        strokeWidth: 2,
        textAlign: 'center',
        text: subheadline.value,
        y: 20,
        duration: 2000,
        letterSpacing: 0.1,
        autoAnimation: true,
        color: 'var(--theme-primary, #88C0D0)',
        font: '/futoro-site/fonts/Satisfy/SatisfySL.json',
        delay: 1000
      });
    },
    onSpotlightStart: () => {
      console.log('Spotlight movement started');
    },
    onSpotlightUpdate: (x, y) => {
      updateSpotlightPosition(x, y);
    },
    onSpotlightComplete: () => {
      console.log('Spotlight movement completed');
    },
    onComplete: () => {
      console.log('Animation completed - staying on loader for debugging');
    }
  });

  // Initialize Vivus instances
  const navbarVivus = createVivusInstance(navbarSvg, {
    type: 'scenario',
    start: 'autostart',
    duration: 100,
    onReady: () => {
      // console.log(`[Navbar] Vivus instance ready at ${new Date().toISOString()}, elapsed: ${Date.now() - startTime.value!}ms`);
    }
  });

  const headlineVivus = createVivusInstance(headlineSvg, {
    type: 'scenario',
    start: 'autostart',
    duration: 100,
    onReady: () => {
      // console.log(`[Headline] Vivus instance ready at ${new Date().toISOString()}, elapsed: ${Date.now() - startTime.value!}ms`);
    }
  });

  const subheadlineVivus = createVivusInstance(subheadlineSvg, {
    type: 'scenario',
    start: 'autostart',
    duration: 100,
    onReady: () => {
      // console.log(`[Subheadline] Vivus instance ready at ${new Date().toISOString()}, elapsed: ${Date.now() - startTime.value!}ms`);
    }
  });

  // Get path elements for pencil animation
  const navbarPath = document.querySelector('.navbar-container-path') as SVGPathElement;
  const headlinePath = document.querySelector('.headline-container-path') as SVGPathElement;
  const subheadlinePath = document.querySelector('.subheadline-container-path') as SVGPathElement;
  const pencilDot = document.querySelector('.pencil-dot') as SVGCircleElement;
  const headlinePencilDot = document.querySelector('.headline-pencil-dot') as SVGCircleElement;
  const subheadlinePencilDot = document.querySelector('.subheadline-pencil-dot') as SVGCircleElement;

  // Initialize the spotlight effect
  const spotlightEffect = createPhasedSpotlight({
    initialX: 20,
    initialY: 20,
    initialSize: 100,
    debug: true
  });

  // Update the spotlight position refs
  updateSpotlightPosition(spotlightEffect.spotlightX, spotlightEffect.spotlightY);

  // Start the main timeline if not paused
  if (!isPausedAfterVara.value) {
    console.log('Starting timeline');
    timeline.play();
  }

  // Add resize listener
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // Remove resize listener
  window.removeEventListener('resize', handleResize);
  
  // Clear timeout if it exists
  if (resizeTimeout) {
    window.clearTimeout(resizeTimeout);
  }
});
</script>

<style scoped>
.hero-section-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(26, 27, 38);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 1;
  transition: opacity 0.8s ease;
}

.grid-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;
}

.grid-lines {
  position: absolute;
  inset: 0;
  mask-image: radial-gradient(
    circle at var(--spotlight-x) var(--spotlight-y),
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.8) 20%,
    rgba(0, 0, 0, 0) 50%
  );
  -webkit-mask-image: radial-gradient(
    circle at var(--spotlight-x) var(--spotlight-y),
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.8) 20%,
    rgba(0, 0, 0, 0) 50%
  );
  animation: grid-float 3s linear infinite;
  --spotlight-brightness: 1;
  --spotlight-focus: 0;
  filter: brightness(var(--spotlight-brightness));
  transition: --spotlight-focus 0.5s ease;
}

.grid-lines.focused {
  mask-image: radial-gradient(
    circle at var(--spotlight-x) var(--spotlight-y),
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  -webkit-mask-image: radial-gradient(
    circle at var(--spotlight-x) var(--spotlight-y),
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.grid-lines.horizontal .grid-line,
.grid-lines.vertical .grid-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
}

.grid-lines.horizontal .grid-line {
  width: 100%;
  height: 1px;
}

.grid-lines.horizontal .grid-line:nth-child(1) { top: 5%; }
.grid-lines.horizontal .grid-line:nth-child(2) { top: 10%; }
.grid-lines.horizontal .grid-line:nth-child(3) { top: 15%; }
.grid-lines.horizontal .grid-line:nth-child(4) { top: 20%; }
.grid-lines.horizontal .grid-line:nth-child(5) { top: 25%; }
.grid-lines.horizontal .grid-line:nth-child(6) { top: 30%; }
.grid-lines.horizontal .grid-line:nth-child(7) { top: 35%; }
.grid-lines.horizontal .grid-line:nth-child(8) { top: 40%; }
.grid-lines.horizontal .grid-line:nth-child(9) { top: 45%; }
.grid-lines.horizontal .grid-line:nth-child(10) { top: 50%; }
.grid-lines.horizontal .grid-line:nth-child(11) { top: 55%; }
.grid-lines.horizontal .grid-line:nth-child(12) { top: 60%; }
.grid-lines.horizontal .grid-line:nth-child(13) { top: 65%; }
.grid-lines.horizontal .grid-line:nth-child(14) { top: 70%; }
.grid-lines.horizontal .grid-line:nth-child(15) { top: 75%; }
.grid-lines.horizontal .grid-line:nth-child(16) { top: 80%; }
.grid-lines.horizontal .grid-line:nth-child(17) { top: 85%; }
.grid-lines.horizontal .grid-line:nth-child(18) { top: 90%; }
.grid-lines.horizontal .grid-line:nth-child(19) { top: 95%; }
.grid-lines.horizontal .grid-line:nth-child(20) { top: 100%; }

.grid-lines.vertical .grid-line {
  height: 100%;
  width: 1px;
}

.grid-lines.vertical .grid-line:nth-child(1) { left: 5%; }
.grid-lines.vertical .grid-line:nth-child(2) { left: 10%; }
.grid-lines.vertical .grid-line:nth-child(3) { left: 15%; }
.grid-lines.vertical .grid-line:nth-child(4) { left: 20%; }
.grid-lines.vertical .grid-line:nth-child(5) { left: 25%; }
.grid-lines.vertical .grid-line:nth-child(6) { left: 30%; }
.grid-lines.vertical .grid-line:nth-child(7) { left: 35%; }
.grid-lines.vertical .grid-line:nth-child(8) { left: 40%; }
.grid-lines.vertical .grid-line:nth-child(9) { left: 45%; }
.grid-lines.vertical .grid-line:nth-child(10) { left: 50%; }
.grid-lines.vertical .grid-line:nth-child(11) { left: 55%; }
.grid-lines.vertical .grid-line:nth-child(12) { left: 60%; }
.grid-lines.vertical .grid-line:nth-child(13) { left: 65%; }
.grid-lines.vertical .grid-line:nth-child(14) { left: 70%; }
.grid-lines.vertical .grid-line:nth-child(15) { left: 75%; }
.grid-lines.vertical .grid-line:nth-child(16) { left: 80%; }
.grid-lines.vertical .grid-line:nth-child(17) { left: 85%; }
.grid-lines.vertical .grid-line:nth-child(18) { left: 90%; }
.grid-lines.vertical .grid-line:nth-child(19) { left: 95%; }
.grid-lines.vertical .grid-line:nth-child(20) { left: 100%; }

.debug-mode .grid-lines {
  mask-image: none;
}

.spotlight-indicator {
  position: absolute;
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  left: var(--spotlight-x);
  top: var(--spotlight-y);
}

.content-wrapper {
  position: relative;
  z-index: 2;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0;
}

.text-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
}

.headline-section,
.subheadline-section {
  width: 100%;
}

.wireframe-svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}

#navbar-svg {
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  height: auto;
}

/* SVG Styles */
.navbar-container-path,
.navbar-logo-path,
.navbar-link-1-path,
.navbar-link-2-path,
.navbar-link-3-path,
.navbar-cta-path,
.headline-container-path,
.subheadline-container-path {
  stroke: var(--theme-primary, #88C0D0);
  stroke-width: 2;
  fill: none;
  stroke-dasharray: 4760;
  stroke-dashoffset: 4760;
  filter: url(#PencilTexture);
  opacity: 1;
  visibility: visible;
}

.pencil-dot,
.headline-pencil-dot,
.subheadline-pencil-dot {
  opacity: 0;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.6));
  transition: opacity 0.3s ease;
  r: 3;
  fill: #ffffff;
  animation: pencilPulse 1.5s ease-in-out infinite;
}

@keyframes pencilPulse {
  0% {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 1)) drop-shadow(0 0 24px rgba(255, 255, 255, 0.8));
  }
  100% {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.6));
  }
}

/* Add a class to show paths when animation starts */
.navbar-container-path.start-animation,
.navbar-logo-path.start-animation,
.navbar-link-1-path.start-animation,
.navbar-link-2-path.start-animation,
.navbar-link-3-path.start-animation,
.navbar-cta-path.start-animation,
.headline-container-path.start-animation,
.subheadline-container-path.start-animation {
  opacity: 1;
  visibility: visible;
}

/* Text Styles */
.word {
  font-size: 72px;
  dominant-baseline: middle;
  text-anchor: middle;
}

.subheadline-content .word {
  font-size: 36px;
}

.outline-text-wrapper,
.regular-text-wrapper,
.spotlight-text-wrapper {
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
  clip-path: inset(0 0% 0 0);
  transition: clip-path 0.1s ease;
}

.outline-text-wrapper .letter {
  color: transparent;
  -webkit-text-stroke: 2px var(--theme-primary, #88C0D0);
  transition: all 0.3s ease;
}

/* Modified filled state specifically for headline letters */
.outline-text-wrapper .letter.filled {
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

@keyframes shine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

#headline-vara-container,
#subheadline-vara-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  opacity: 1;
  visibility: visible;
  overflow: visible;
}

#headline-vara-container svg,
#subheadline-vara-container svg {
  width: 100%;
  height: 100%;
  max-height: 200px;
  opacity: 1;
  visibility: visible;
  overflow: visible;
  object-fit: contain;
}

.spotlight-text-wrapper {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 0.1s ease;
  z-index: 1;
}

.spotlight-text-wrapper .letter {
  opacity: 1;
  color: var(--theme-primary, #88C0D0);
}

.spotlight-text-wrapper.headline-spotlight .letter {
  color: white;
  -webkit-text-stroke: 2px var(--theme-primary, #88C0D0);
}

/* Hide Vara text when spotlight text is visible */
.spotlight-text-wrapper:not([style*="clip-path: inset(0 100% 0 0)"]) ~ #headline-vara-container,
.spotlight-text-wrapper:not([style*="clip-path: inset(0 100% 0 0)"]) ~ #subheadline-vara-container {
  opacity: 0;
  visibility: hidden;
}

/* Debug Controls */
.pause-controls {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 8px;
  color: white;
}

.pause-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resume-button {
  margin-top: 1rem;
  background: var(--theme-primary, #88C0D0);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

/* Debug circle overlay */
.debug-circle-overlay {
  display: none;
}

/* Add masking to the grid container's wrapper */
.masked-grid {
  display: none;
}

.is-hidden {
  opacity: 0;
  pointer-events: none;
}

.spotlight-text-wrapper .word {
  display: inline-flex;
  align-items: center;
}

.spotlight-text-wrapper .space {
  display: inline-block;
  width: 0.4em;
}

.spotlight-text-wrapper .letter {
  display: inline-block;
  opacity: 1;
  color: var(--theme-primary, #88C0D0);
  transition: opacity 0.3s ease;
}

.spotlight-text-wrapper.headline-spotlight .letter {
  color: white;
  -webkit-text-stroke: 2px var(--theme-primary, #88C0D0);
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

.hidden {
  display: none;
}

/* Ensure PaperGridBackground fills the masked container */
.masked-grid :deep(.grid-paper-overlay) {
  width: 100%;
  height: 100%;
}

@keyframes grid-float {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(20px, 20px);
  }
}

/* RTL Transition Styles */
.outline-text-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.outline-text-wrapper .word {
  display: flex;
  margin: 0 0.25rem;
}

.outline-text-wrapper .letter {
  position: relative;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.outline-text-wrapper .letter.focused {
  opacity: 1;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
}

#headline-vara-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.3s ease;
}

#headline-vara-container path {
  transition: opacity 0.2s ease;
}

.spotlight-text-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.spotlight-text-wrapper .word {
  display: flex;
  margin: 0 0.25rem;
}

.spotlight-text-wrapper .letter {
  position: relative;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.spotlight-text-wrapper .letter.focused {
  opacity: 1;
}

.headline-content {
  transform-origin: center;
}
</style> 