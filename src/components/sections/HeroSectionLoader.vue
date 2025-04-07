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
    <div 
      class="grid-container" 
      :style="{
        '--spotlight-x': `${spotlightX}%`,
        '--spotlight-y': `${spotlightY}%`,
        '--spotlight-size': '20%'
      }"
    >
      <!-- Debug controls -->
      <div class="pause-controls" v-if="showDebug">
        <div class="pause-options">
          <label>
            <input type="checkbox" v-model="isPausedAfterVara">
            Pause after Vara
          </label>
          <label>
            <input type="checkbox" v-model="isPausedAfterRTL">
            Pause after RTL
          </label>
          <label>
            <input type="checkbox" v-model="isPausedAfterLTR">
            Pause after LTR
          </label>
        </div>
        <button 
          v-if="timeline?.paused()" 
          @click="resumeAnimation"
          class="resume-button"
        >
          Resume Animation
        </button>
      </div>

      <!-- Use PaperGridBackground with default spotlight disabled -->
      <div class="masked-grid">
        <PaperGridBackground
          :theme="currentTheme"
          :floating="true"
          :spotlight="false"
        />
      </div>

      <!-- Debug circle overlay - always visible -->
      <div class="debug-circle-overlay"></div>
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
              d="M10,10 L1190,10 L1190,190 L10,190 L10,10" 
              v-bind="getDataAttributes(animationTimings.headline.container)"
              fill="none" stroke="white" stroke-width="2" />
            <circle class="headline-pencil-dot" cx="10" cy="10" r="3" fill="#ffffff" opacity="0" />
            
            <!-- Headline Text Content -->
            <g class="headline-content">
              <!-- Vara container for headline -->
              <foreignObject x="10" y="10" width="1180" height="180">
                <div id="headline-vara-container" xmlns="http://www.w3.org/1999/xhtml"></div>
              </foreignObject>
              
              <!-- Outline Text Layer -->
              <foreignObject x="10" y="10" width="1180" height="180">
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
import { ref, onMounted, computed, watch } from 'vue';
import gsap from 'gsap';
import Vivus from 'vivus';
import { useVara } from '@/composables/useVara';
import { useVivusInstances } from '@/composables/useVivusInstances';
import { usePencilAnimation } from '@/composables/usePencilAnimation';
import SvgFilters from '@/components/svg/SvgFilters.vue';
import { HeroContent, getRandomHeroContent } from '@/data/heroContentData';
import PaperGridBackground from '@/components/ui/backgrounds/PaperGridBackground.vue';

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
}>();

// State
const isVisible = ref(true);
const spotlightX = ref(20);
const spotlightY = ref(20);
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

// Animation handlers
const handleRTLStart = () => {
  gsap.set('.outline-text-wrapper .letter', { opacity: 1 });
};

const handleRTLUpdate = (progress: number) => {
  spotlightX.value = 100 - (progress * 100);
  spotlightY.value = 50;
};

const handleRTLComplete = () => {
  if (isPausedAfterRTL.value) {
    timeline.value?.pause();
  }
};

const handleLTRStart = () => {
  gsap.set('.spotlight-text-wrapper', { clipPath: 'inset(0 100% 0 0)' });
};

const handleLTRUpdate = (progress: number) => {
  spotlightX.value = progress * 100;
  spotlightY.value = 50;
  gsap.set('.spotlight-text-wrapper', {
    clipPath: `inset(0 ${100 - (progress * 100)}% 0 0)`
  });
};

const handleLTRComplete = () => {
  if (isPausedAfterLTR.value) {
    timeline.value?.pause();
  }
  gsap.set('.outline-text-wrapper .letter', { opacity: 0 });
};

const resumeAnimation = () => {
  if (timeline.value) {
    timeline.value.resume();
  }
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

onMounted(async () => {
  // Set start time
  startTime.value = Date.now();
  console.log(`[HeroSectionLoader] Component mounted at ${new Date().toISOString()}`);
  
  // Initialize Vivus instances
  const navbarSvg = document.querySelector('#navbar-svg') as SVGElement;
  const headlineSvg = document.querySelector('#headline-svg') as SVGElement;
  const subheadlineSvg = document.querySelector('#subheadline-svg') as SVGElement;

  // Initialize Vara text instances
  console.log('Initializing headline Vara text...');
  headlineVaraInstance.value = await loadVara('#headline-vara-container', {
    fontSize: 72,
    strokeWidth: 2,
    textAlign: 'center',
    text: headline.value,
    y: 20,
    duration: 2000,
    delay: 1000,
    letterSpacing: 0.1,
    autoAnimation: true,
    color: 'var(--theme-primary, #88C0D0)',
    font: '/futoro-site/fonts/Satisfy/SatisfySL.json',
  });
  console.log('Headline Vara instance created:', headlineVaraInstance.value);

  console.log('Initializing subheadline Vara text...');
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
  console.log('Subheadline Vara instance created:', subheadlineVaraInstance.value);

  const navbarVivus = createVivusInstance(navbarSvg, {
    type: 'scenario',
    start: 'autostart',
    duration: 100,
    onReady: () => {
      console.log(`[Navbar] Vivus instance ready at ${new Date().toISOString()}, elapsed: ${Date.now() - startTime.value!}ms`);
    }
  });

  const headlineVivus = createVivusInstance(headlineSvg, {
    type: 'scenario',
    start: 'autostart',
    duration: 100,
    onReady: () => {
      console.log(`[Headline] Vivus instance ready at ${new Date().toISOString()}, elapsed: ${Date.now() - startTime.value!}ms`);
    }
  });

  const subheadlineVivus = createVivusInstance(subheadlineSvg, {
    type: 'scenario',
    start: 'autostart',
    duration: 100,
    onReady: () => {
      console.log(`[Subheadline] Vivus instance ready at ${new Date().toISOString()}, elapsed: ${Date.now() - startTime.value!}ms`);
    }
  });

  // Get path elements for pencil animation
  const navbarPath = document.querySelector('.navbar-container-path') as SVGPathElement;
  const headlinePath = document.querySelector('.headline-container-path') as SVGPathElement;
  const subheadlinePath = document.querySelector('.subheadline-container-path') as SVGPathElement;
  const pencilDot = document.querySelector('.pencil-dot') as SVGCircleElement;
  const headlinePencilDot = document.querySelector('.headline-pencil-dot') as SVGCircleElement;
  const subheadlinePencilDot = document.querySelector('.subheadline-pencil-dot') as SVGCircleElement;

  // Create main timeline
  timeline.value = gsap.timeline({
    paused: props.pauseAnimations,
    onStart: () => {
      console.log(`[Animation] 🚀 Timeline started at ${new Date().toISOString()}`);
      console.log(`[Animation] Moving spotlight from left to right`);
    },
    onComplete: () => {
      console.log(`[Animation] 🏁 Movement complete at ${new Date().toISOString()}`);
      emit('complete');
    }
  });

  // Just move spotlight from left to right
  timeline.value
    .to('.grid-container', {
      '--spotlight-x': '80%',
      '--spotlight-y': '20%',
      duration: 1.5,
      ease: 'none',
      onStart: () => {
        console.log(`[Animation] ➡️ Moving spotlight right`);
        console.log(`[Animation] Starting position: x=${spotlightX.value}%, y=${spotlightY.value}%`);
      },
      onComplete: () => {
        console.log(`[Animation] ✅ Movement complete`);
        console.log(`[Animation] Final position: x=${spotlightX.value}%, y=${spotlightY.value}%`);
      }
    });

  // Start animation if not paused
  if (!props.pauseAnimations) {
    timeline.value.play();
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
  background: rgb(17, 24, 39);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 1;
  transition: opacity 0.8s ease;
}

.grid-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: visible;
  --spotlight-x: 20%;
  --spotlight-y: 20%;
  --spotlight-size: 100%;
  isolation: isolate;
}

.grid-lines {
  display: none;
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
  font-family: 'Satisfy', cursive;
  dominant-baseline: middle;
  text-anchor: middle;
}

.subheadline-content .word {
  font-size: 36px;
}

.outline-text-wrapper .letter {
  color: transparent;
  -webkit-text-stroke: 2px var(--theme-primary, #88C0D0);
  opacity: 0;
}

.spotlight-text-wrapper {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 0.1s ease;
}

.spotlight-text-wrapper .letter {
  opacity: 1;
  color: var(--theme-primary, #88C0D0);
}

.spotlight-text-wrapper.headline-spotlight .letter {
  color: white;
  -webkit-text-stroke: 2px var(--theme-primary, #88C0D0);
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  background: radial-gradient(
    circle at var(--spotlight-x) var(--spotlight-y),
    transparent 0%,
    transparent calc(var(--spotlight-size) * 0.95),
    rgba(255, 255, 0, 1) calc(var(--spotlight-size) * 0.95),
    rgba(255, 255, 0, 1) var(--spotlight-size),
    transparent var(--spotlight-size)
  );
}

/* Add masking to the grid container's wrapper */
.masked-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  mask-image: radial-gradient(
    circle at var(--spotlight-x) var(--spotlight-y),
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) var(--spotlight-size),
    rgba(0, 0, 0, 0) var(--spotlight-size)
  );
  -webkit-mask-image: radial-gradient(
    circle at var(--spotlight-x) var(--spotlight-y),
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) var(--spotlight-size),
    rgba(0, 0, 0, 0) var(--spotlight-size)
  );
}

.is-hidden {
  opacity: 0;
  pointer-events: none;
}

#headline-vara-container,
#subheadline-vara-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

#headline-vara-container svg,
#subheadline-vara-container svg {
  height: 100%;
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
  clip-path: inset(0 0% 0 0);
  transition: clip-path 0.1s ease;
}

.outline-text-wrapper .letter {
  color: transparent;
  -webkit-text-stroke: 2px var(--theme-primary, #88C0D0);
  transition: all 0.3s ease;
}

.spotlight-text-wrapper {
  position: absolute;
  top: 0;
  left: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  opacity: 1;
  clip-path: inset(0 100% 0 0);
  transition: clip-path 0.1s ease;
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

.hidden {
  display: none;
}

/* Ensure PaperGridBackground fills the masked container */
.masked-grid :deep(.grid-paper-overlay) {
  width: 100%;
  height: 100%;
}
</style> 