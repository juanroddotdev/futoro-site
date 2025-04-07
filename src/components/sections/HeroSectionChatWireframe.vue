<template>
  <div class="hero-section-chat-wireframe">
    <!-- Add the section container structure -->
        <div class="section-container">
          <div class="section-inner content-left">
            <div class="content-area">
          <!-- SVG container for final position -->
          <div class="final-svg-container">
            <svg id="final-headline-svg" class="final-svg" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid meet">
              <SvgFilters />
              <path class="final-headline-line" 
                d="M10,10 L1190,10 L1190,190 L10,190 L10,10" 
                fill="none" 
                stroke="white" 
                stroke-width="2" />
              <circle class="final-headline-pencil-dot" cx="10" cy="10" r="3" fill="#ffffff" opacity="0" />
            </svg>

            <svg id="final-subheadline-svg" class="final-svg" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid meet">
              <SvgFilters />
              <path class="final-subheadline-line" 
                d="M10,10 L1190,10 L1190,190 L10,190 L10,10" 
                fill="none" 
                stroke="white" 
                stroke-width="2" />
              <circle class="final-subheadline-pencil-dot" cx="10" cy="10" r="3" fill="#ffffff" opacity="0" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Keep existing SVG elements -->
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

      <!-- <path class="navbar-mobile-path" 
            d="M1140,38 L1164,38 L1164,62 L1140,62 L1140,38" 
            data-start="260" 
            data-duration="20"
            fill="none" 
            stroke="white" 
            stroke-width="2" /> -->

      <!-- Pencil effect -->
      <circle class="pencil-dot" cx="10" cy="10" r="3" fill="#ffffff" opacity="0" />
    </svg>

    <div class="wireframe-overlay">
      <div class="text-container">
        <svg id="headline-svg" class="wireframe-svg headline-svg" viewBox="0 0 1200 200"
          preserveAspectRatio="xMidYMid meet">
          <SvgFilters />
          <path class="headline-line-1" 
            d="M10,10 L1190,10 L1190,190 L10,190 L10,10" 
            v-bind="getDataAttributes(animationTimings.headline.container)"
            fill="none" stroke="white" stroke-width="2" />
          <circle class="headline-pencil-dot" cx="10" cy="10" r="3" fill="#ffffff" opacity="0" />
        </svg>

        <svg id="subheadline-svg" class="wireframe-svg subheadline-svg" viewBox="0 0 1200 200"
          preserveAspectRatio="xMidYMid meet">
          <SvgFilters />
          <path class="sub-headline-line" 
            d="M10,10 L1190,10 L1190,190 L10,190 L10,10" 
            v-bind="getDataAttributes(animationTimings.subheadline.container)"
            fill="none" stroke="white" stroke-width="2" />
          <circle class="subheadline-pencil-dot" cx="10" cy="10" r="3" fill="#ffffff" opacity="0" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Vivus from 'vivus';
import SvgFilters from '@/components/svg/SvgFilters.vue';
import { useVivusInstances } from '@/composables/useVivusInstances';
import { usePencilAnimation } from '@/composables/usePencilAnimation';
import { useAnimationTimelines } from '@/composables/useAnimationTimelines';
import { useSvgElements } from '@/composables/useSvgElements';
import { useAnimationState } from '@/composables/useAnimationState';

// Animation timing configuration
const animationTimings = {
  navbar: {
    container: { start: 0, duration: 300 },
    logo: { start: 100, duration: 200 },
    link1: { start: 150, duration: 200 },
    link2: { start: 200, duration: 200 },
    link3: { start: 250, duration: 200 },
    cta: { start: 300, duration: 200 }
  },
  headline: {
    container: { start: 150, duration: 600 }
  },
  subheadline: {
    container: { start: 250, duration: 600 }
  }
};

// Helper function to get data attributes
const getDataAttributes = (timing: { start: number; duration: number }) => ({
  'data-start': timing.start,
  'data-duration': timing.duration
});

gsap.registerPlugin(MotionPathPlugin);

const { instances: vivusInstances, createVivusInstance } = useVivusInstances();
const { animatePencilAlongPath } = usePencilAnimation();
const { createNavbarTimeline, createHeadlineTimeline, createSubheadlineTimeline } = useAnimationTimelines();
const { elements, initializeElements, hideAllPaths, showAllPaths, validateElements } = useSvgElements();
const { state, startAnimation, stopAnimation, startTransition, handleLTRStart, handleLTRUpdate, getAnimationDuration } = useAnimationState();

const startAnimationSequence = () => {
  if (state.value.isAnimating) return;
  startAnimation();

  // Initialize SVG elements
  initializeElements();
  
  if (!validateElements()) {
    return;
  }

  

  // Create and start navbar timeline
  const navbarTl = createNavbarTimeline(
    state.value.startTime!,
    elements.value.navbar.paths,
    elements.value.navbar.pencilDot!,
    animatePencilAlongPath,
    () => {
     
    }
  );


  // Create new Vivus instances
  try {
    // Create navbar Vivus
    if (elements.value.navbar.svg) {
      vivusInstances.value.navbar = createVivusInstance(elements.value.navbar.svg, {
        type: 'scenario',
        start: 'manual',
        dashGap: 10,
        forceRender: true,
        pathTimingFunction: Vivus.EASE_OUT,
        onReady: function (obj) {
          if (obj) {
            obj.reset();
            setTimeout(() => {
              obj.play(1);
              console.log(`[Navbar] Animation started at ${new Date().toISOString()}`);
              navbarTl.play();
            }, 100);
          }
        }
      });
    }

    // Create headline Vivus
    if (elements.value.headline.svg) {
      vivusInstances.value.headline = createVivusInstance(elements.value.headline.svg, {
        type: 'scenario',
        start: 'manual',
        dashGap: 10,
        forceRender: true,
        pathTimingFunction: Vivus.EASE_OUT,
        onReady: function (obj) {
          if (obj) {
            obj.reset();
            const configuredStartTime = animationTimings.headline.container.start;
            const actualStartTime = Date.now() - state.value.startTime!;
            console.log(`[Headline] Configured to start at ${configuredStartTime}ms, actually starting at ${actualStartTime}ms`);
            
            setTimeout(() => {
              obj.play(1);
              const timeline = createHeadlineTimeline(
                obj,
                elements.value.headline.path!,
                elements.value.headline.pencilDot!,
                state.value.startTime!,
                animatePencilAlongPath
              );
              
              timeline.eventCallback('onComplete', () => {
                const endTime = Date.now();
                const duration = endTime - state.value.startTime!;
                console.log(`[Headline] Animation completed at ${new Date().toISOString()} (Duration: ${duration}ms)`);
              });
            }, configuredStartTime);
          }
        }
      });
    }

    // Create subheadline Vivus
    if (elements.value.subheadline.svg) {
      vivusInstances.value.subheadline = createVivusInstance(elements.value.subheadline.svg, {
        type: 'scenario',
        start: 'manual',
        dashGap: 10,
        forceRender: true,
        pathTimingFunction: Vivus.EASE_OUT,
        onReady: function (obj) {
          if (obj) {
            obj.reset();
            const configuredStartTime = animationTimings.subheadline.container.start;
            const actualStartTime = Date.now() - state.value.startTime!;
            console.log(`[Subheadline] Configured to start at ${configuredStartTime}ms, actually starting at ${actualStartTime}ms`);
            
            setTimeout(() => {
              obj.play(1);
              const timeline = createSubheadlineTimeline(
                obj,
                elements.value.subheadline.path!,
                elements.value.subheadline.pencilDot!,
                state.value.startTime!,
                animatePencilAlongPath
              );
              
              timeline.eventCallback('onComplete', () => {
                const endTime = Date.now();
                const duration = endTime - state.value.startTime!;
                console.log(`[Subheadline] Animation completed at ${new Date().toISOString()} (Duration: ${duration}ms)`);
              });
            }, configuredStartTime);
          }
        }
      });
    }

    // Create final headline Vivus
    const finalHeadlineSvg = document.getElementById('final-headline-svg');
    if (finalHeadlineSvg instanceof SVGElement) {
      vivusInstances.value.finalHeadline = createVivusInstance(finalHeadlineSvg, {
        type: 'scenario',
        start: 'manual',
        dashGap: 10,
        forceRender: true,
        pathTimingFunction: Vivus.EASE_OUT,
        onReady: function (obj) {
          if (obj) {
            obj.reset();
            const configuredStartTime = animationTimings.headline.container.start;
            const actualStartTime = Date.now() - state.value.startTime!;
            console.log(`[Final Headline] Configured to start at ${configuredStartTime}ms, actually starting at ${actualStartTime}ms`);
            
            setTimeout(() => {
              obj.play(1);
              const path = finalHeadlineSvg.querySelector('.final-headline-line');
              const dot = finalHeadlineSvg.querySelector('.final-headline-pencil-dot');
              if (path instanceof SVGPathElement && dot instanceof SVGCircleElement) {
                const timeline = createHeadlineTimeline(
                  obj,
                  path,
                  dot,
                  state.value.startTime!,
                  animatePencilAlongPath
                );
                
                timeline.eventCallback('onComplete', () => {
                  const endTime = Date.now();
                  const duration = endTime - state.value.startTime!;
                  console.log(`[Final Headline] Animation completed at ${new Date().toISOString()} (Duration: ${duration}ms)`);
                });
              }
            }, configuredStartTime);
          }
        }
      });
    }

    // Create final subheadline Vivus
    const finalSubheadlineSvg = document.getElementById('final-subheadline-svg');
    if (finalSubheadlineSvg instanceof SVGElement) {
      vivusInstances.value.finalSubheadline = createVivusInstance(finalSubheadlineSvg, {
        type: 'scenario',
        start: 'manual',
        dashGap: 10,
        forceRender: true,
        pathTimingFunction: Vivus.EASE_OUT,
        onReady: function (obj) {
          if (obj) {
            obj.reset();
            const configuredStartTime = animationTimings.subheadline.container.start;
            const actualStartTime = Date.now() - state.value.startTime!;
            console.log(`[Final Subheadline] Configured to start at ${configuredStartTime}ms, actually starting at ${actualStartTime}ms`);
            
            setTimeout(() => {
              obj.play(1);
              const path = finalSubheadlineSvg.querySelector('.final-subheadline-line');
              const dot = finalSubheadlineSvg.querySelector('.final-subheadline-pencil-dot');
              if (path instanceof SVGPathElement && dot instanceof SVGCircleElement) {
                const timeline = createSubheadlineTimeline(
                  obj,
                  path,
                  dot,
                  state.value.startTime!,
                  animatePencilAlongPath
                );
                
                timeline.eventCallback('onComplete', () => {
                  const endTime = Date.now();
                  const duration = endTime - state.value.startTime!;
                  console.log(`[Final Subheadline] Animation completed at ${new Date().toISOString()} (Duration: ${duration}ms)`);
                });
              }
            }, configuredStartTime);
          }
        }
      });
    }
  } catch (error) {
    // Silently handle error
  }
};

const transitionToFinalPosition = () => {
  const headlineSvg = document.getElementById('headline-svg');
  const subheadlineSvg = document.getElementById('subheadline-svg');
  const contentArea = document.querySelector('.content-area');
  const finalContainer = document.querySelector('.final-svg-container');
  const textContainer = document.querySelector('.text-container');

  if (headlineSvg && subheadlineSvg && contentArea && finalContainer && textContainer) {
    const contentRect = contentArea.getBoundingClientRect();
    
    // Add transition class to trigger the animation
    headlineSvg.classList.add('transition-to-content');
    subheadlineSvg.classList.add('transition-to-content');
    textContainer.classList.add('transitioning');
    
    // After the transition completes, show the final container
    setTimeout(() => {
      finalContainer.classList.add('ready');
    }, 1000); // Match the transition duration
    
    startTransition();
  }
};

// Add this function to handle the spotlight animation progress
const handleSpotlightProgress = (spotlightX: number, spotlightY: number) => {
  // When the spotlight reaches 80% of its animation during the final diagonal movement, start the transition
  if (spotlightX >= 80 && spotlightY >= 80 && !state.value.isTransitioning) {
    transitionToFinalPosition();
  }
};

onMounted(() => {
  // Initialize SVG elements
  initializeElements();
  
  // Hide all paths initially
  hideAllPaths();

  // Watch for spotlight position changes
  const gridContainer = document.querySelector('.grid-container');
  if (gridContainer) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const spotlightX = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
          const spotlightY = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-y'));
          handleSpotlightProgress(spotlightX, spotlightY);
        }
      });
    });

    observer.observe(gridContainer, {
      attributes: true,
      attributeFilter: ['style']
    });
  }

  setTimeout(() => {
    // Make all paths visible before starting animation
    showAllPaths();
    startAnimationSequence();
  }, 2000);
});
</script>

<style lang="scss" scoped>
.hero-section-chat-wireframe {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  pointer-events: none;
  padding: 20px;
  // background: rgba(0, 0, 0, 0.5); /// DO NOT BRING THIS BACK
}

/* Add the section container structure */
.section-container {
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  height: 100vh; /* Full viewport height */
  display: flex;
  align-items: center; /* Center vertically */
}

.section-inner {
  display: grid;
  gap: 2rem;
  width: 100%;
  
  &.content-left {
    grid-template-columns: 1fr 1fr;
  }
}

.content-area {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  min-height: 400px;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  position: relative;
  width: 100%;
  
  &.ready {
    opacity: 1;
  }
}

/* Final SVG container styles */
.final-svg-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 832px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  
  &.ready {
    opacity: 1;
  }
}

.final-svg {
  width: 100%;
  height: 200px;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.final-headline-line,
.final-subheadline-line {
  stroke: white;
  stroke-width: 2;
  fill: none;
  stroke-dasharray: 4760;
  stroke-dashoffset: 4760;
  filter: url(#PencilTexture);
  opacity: 1;
  visibility: visible;
}

.final-headline-pencil-dot,
.final-subheadline-pencil-dot {
  opacity: 0;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.6));
  transition: opacity 0.3s ease;
  r: 3;
  fill: #ffffff;
  animation: pencilPulse 1.5s ease-in-out infinite;
}

/* Update wireframe SVG positioning */
.wireframe-svg {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  width: calc(100% - 40px);
  height: 120px;
  z-index: 10001;
  pointer-events: none;
  outline: none;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible; /* Allow pencil effect to show */
}

/* Wireframe container structure */
.wireframe-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10002;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;

}

.text-container {
  position: relative;
  width: 832px; /* Fixed width */
  height: 424px; /* Fixed height: 200px per SVG + 24px gap */
  margin: 0 auto;
  display: grid;
  grid-template-rows: 200px 24px 200px; /* Fixed heights with gap */
  align-items: center;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10002;
  gap: 40px;
}

.headline-svg,
.subheadline-svg {
  width: 100%;
  height: 200px;
  position: relative;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Update transition styles */
.headline-svg.transition-to-content,
.subheadline-svg.transition-to-content {
  position: absolute;
  width: 100%;
  height: 200px;
  transform-origin: center;
  left: 0;
  right: 0;
  opacity: 1;
  visibility: visible;
}

.headline-svg.transition-to-content {
  top: 0;
  transform: scale(0.8);
}

.subheadline-svg.transition-to-content {
  top: 224px; /* 200px height + 24px gap */
  transform: scale(0.8);
}

.text-container.transitioning {
  transform: translate(-50%, -50%) scale(0.8);
  opacity: 0.8;
  visibility: visible;
}

/* Responsive adjustments */
@media (max-width: 872px) {
  .text-container {
    width: calc(100% - 40px);
    min-width: 320px;
    height: 324px; /* Reduced height for mobile */
    grid-template-rows: 150px 24px 150px; /* Smaller SVGs on mobile */
  }

  .headline-svg,
  .subheadline-svg {
    height: 150px;
  }

  .subheadline-svg.transition-to-content {
    top: 174px; /* 150px height + 24px gap */
  }
}

.test-path {
  stroke: white;
  stroke-width: 3;
  opacity: 1;
}

/* Base styles for all SVG paths */
path {
  fill: none;
  stroke: white;
  stroke-width: 2;
  stroke-linecap: round;
  filter: url(#PencilTexture);
  opacity: 1;
  visibility: hidden;
  /* Start hidden by default */
}

.navbar-container-path,
.navbar-logo-path,
.navbar-link-1-path,
.navbar-link-2-path,
.navbar-link-3-path,
.navbar-cta-path {
  stroke: white;
  stroke-width: 2;
}

/* Class to show paths when animation starts */
path.start-animation {
  opacity: 1;
}

.navbar-path {
  stroke: rgba(255, 255, 255, 0.8);
}

/* Wireframe headline container styles */
.wireframe-headline-container {
  display: none;
}

.headline-line-1,
.sub-headline-line {
  stroke: white;
  stroke-width: 2;
  fill: none;
  opacity: 1;  /* Change back to 1 to allow Vivus to animate */
  stroke-dasharray: 4760;  /* Total length of the path */
  stroke-dashoffset: 4760; /* Start fully offset */
  visibility: visible;  /* Change to visible to allow Vivus to animate */
  /* The stroke-dashoffset will keep it hidden until animation starts */
}

/* Add a class to show paths when animation starts */
.headline-line-1.start-animation,
.sub-headline-line.start-animation {
  opacity: 1;
  visibility: visible;
}

.pencil-dot,
.headline-pencil-dot,
.subheadline-pencil-dot {
  opacity: 0; /* Start hidden */
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.6));
  transition: opacity 0.3s ease;
  r: 3; /* Large radius */
  fill: #ffffff;
  z-index: 10003;
}

/* Add a pulsing animation to make the dots more noticeable */
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

.pencil-dot,
.headline-pencil-dot,
.subheadline-pencil-dot {
  animation: pencilPulse 1.5s ease-in-out infinite;
}

/* Existing styles */
.sticky-scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}

.scrollable-chat-section {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-container {
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.section-inner {
  display: grid;
  gap: 2rem;
  
  &.content-left {
    grid-template-columns: 1fr 1fr;
  }
}

.content-area {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
}

/* Headline styles */
.headline-container {
  width: 100%;
}

.headline-box {
  height: 60px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  transform-origin: left;
}

/* Subheadline styles */
.subheadline-container {
  width: 100%;
}

.subheadline-box {
  height: 40px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  transform-origin: left;
}

/* CTA buttons */
.cta-container {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.cta-button {
  height: 48px;
  width: 160px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  transform-origin: left;
}

/* Chat area */
.chat-area {
  position: relative;
  height: 100%;
  min-height: 500px;
}

.floating-chat {
  position: relative;
  width: 100%;
  height: 100%;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 1rem;
  transform: perspective(1000px) rotateY(-5deg) rotateX(1deg);
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

/* Message bubbles */
.message-bubble {
  height: 40px;
  width: 200px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);

  &.left {
    align-self: flex-start;
    border-radius: 20px 20px 20px 4px;
  }

  &.right {
    align-self: flex-end;
    border-radius: 20px 20px 4px 20px;
  }
}
</style> 