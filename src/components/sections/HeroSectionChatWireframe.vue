<template>
  <div class="hero-section-chat-wireframe">
    <!-- SVG container for all animations -->
    <svg id="navbar-svg" class="wireframe-svg" viewBox="0 0 1200 120" preserveAspectRatio="xMidYMid meet">
      <!-- Container draws first -->
      <path class="navbar-container-path" 
            d="M10,10 L1190,10 L1190,110 L10,110 L10,10" 
            data-start="0" 
            data-duration="100"
            fill="none" 
            stroke="white" 
            stroke-width="2"/>
      
      <!-- Divider line draws next -->
      <!-- <path class="navbar-path" 
            d="M10,86 L1190,86" 
            data-start="60" 
            data-duration="30"
            fill="none" 
            stroke="white" 
            stroke-width="2" /> -->
      
      <!-- Logo and nav items draw in sequence -->
      <path class="navbar-logo-path" 
            d="M32,38 L152,38 L152,62 L32,62 L32,38" 
            data-start="120" 
            data-duration="80"
            fill="none" 
            stroke="white" 
            stroke-width="2" />
      
      <path class="navbar-link-1-path" 
            d="M600,38 L680,38 L680,62 L600,62 L600,38" 
            data-start="220" 
            data-duration="80"
            fill="none" 
            stroke="white" 
            stroke-width="2" />
      
      <path class="navbar-link-2-path" 
            d="M720,38 L800,38 L800,62 L720,62 L720,38" 
            data-start="320" 
            data-duration="80"
            fill="none" 
            stroke="white" 
            stroke-width="2" />
      
      <path class="navbar-link-3-path" 
            d="M840,38 L920,38 L920,62 L840,62 L840,38" 
            data-start="420" 
            data-duration="80"
            fill="none" 
            stroke="white" 
            stroke-width="2" />
      
      <path class="navbar-cta-path" 
            d="M960,35 L1060,35 C1080,35 1080,65 1060,65 L960,65 C940,65 940,35 960,35" 
            data-start="520" 
            data-duration="100"
            fill="none" 
            stroke="white" 
            stroke-width="2" />
      
      <!-- <path class="navbar-mobile-path" 
            d="M1140,38 L1164,38 L1164,62 L1140,62 L1140,38" 
            data-start="260" 
            data-duration="20"
            fill="none" 
            stroke="white" 
            stroke-width="2" /> -->
      
      <!-- Pencil effect -->
      <circle class="pencil-dot" cx="10" cy="10" r="2" fill="white" />
    </svg>

    <!-- Section 2: Center Headline Animation -->
    <div class="wireframe-overlay" style="display: none;">
      <div class="wireframe-headline-container">
        <div class="wireframe-headline-line"></div>
        <div class="wireframe-headline-line"></div>
        <div class="wireframe-headline-line"></div>
      </div>
    </div>

    <!-- Section 3: Content Area Animation -->
    <div class="sticky-scroll-container" style="display: none;">
      <div class="scrollable-chat-section">
        <div class="section-container">
          <div class="section-inner content-left">
            <div class="content-area">
              <div class="headline-container">
                <div class="headline-box"></div>
              </div>
              <div class="subheadline-container">
                <div class="subheadline-box"></div>
              </div>
              <div class="cta-container">
                <div class="cta-button primary"></div>
                <div class="cta-button secondary"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Vivus from 'vivus';

gsap.registerPlugin(MotionPathPlugin);

const isAnimating = ref(false);

const startAnimation = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;

  const startTime = Date.now();
  console.log('Animation starting at:', new Date().toISOString());
  
  const navbarSvg = document.getElementById('navbar-svg');
  if (!navbarSvg) {
    console.error('Could not find navbar SVG element');
    return;
  }

  // Get all paths and pencil dot
  const allPaths = Array.from(navbarSvg.querySelectorAll('path'));
  const pencilDot = document.querySelector('.pencil-dot') as HTMLElement;

  console.log(`Found ${allPaths.length} paths`);
  
  // Log initial path information
  allPaths.forEach((path, index) => {
    const startAttr = path.getAttribute('data-start');
    const durationAttr = path.getAttribute('data-duration');
    console.log(`Path ${index + 1}:`, {
      class: path.getAttribute('class'),
      start: startAttr ? `${startAttr}ms` : 'N/A',
      duration: durationAttr ? `${durationAttr}ms` : 'N/A'
    });
  });

  // Create new Vivus instance with scenario type
  const vivusAnimation = new Vivus(navbarSvg, {
    type: 'scenario-sync',
    duration: 800,
    start: 'manual',
    dashGap: 10,
    forceRender: true,
    pathTimingFunction: Vivus.EASE_OUT,
    onReady: function() {
      const readyTime = Date.now() - startTime;
      console.log(`Vivus ready after ${readyTime}ms`);
    }
  });

  // Function to animate pencil dot along a path
  const animatePencilAlongPath = (path: SVGPathElement) => {
    const length = path.getTotalLength();
    const durationAttr = path.getAttribute('data-duration');
    const duration = durationAttr ? parseFloat(durationAttr) * 10 : 0;
    
    return gsap.to(pencilDot, {
      duration: duration / 1000,
      motionPath: {
        path: path,
        align: path,
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
      },
      ease: "none",
      onStart: () => {
        const currentTime = Date.now() - startTime;
        console.log(`Path animation starting at ${currentTime}ms:`, {
          class: path.getAttribute('class'),
          duration: `${duration}ms`
        });
      },
      onComplete: () => {
        const currentTime = Date.now() - startTime;
        console.log(`Path animation complete at ${currentTime}ms:`, {
          class: path.getAttribute('class')
        });
      }
    });
  };

  // Create timeline for pencil animation
  const tl = gsap.timeline({
    onStart: () => {
      const timelineStartTime = Date.now() - startTime;
      console.log(`Timeline starting at ${timelineStartTime}ms`);
    },
    onComplete: () => {
      const timelineEndTime = Date.now() - startTime;
      console.log(`Timeline complete at ${timelineEndTime}ms`);
      if (pencilDot) {
        gsap.to(pencilDot, {
          duration: 0.3,
          opacity: 0
        });
      }
    }
  });

  // Add each path animation to timeline
  allPaths.forEach((path) => {
    const startAttr = path.getAttribute('data-start');
    const delay = startAttr ? parseFloat(startAttr) * 20 : 0;
    tl.add(animatePencilAlongPath(path as SVGPathElement), delay / 1000);
  });

  // Make paths visible immediately
  allPaths.forEach(path => {
    path.style.visibility = 'visible';
    path.style.opacity = '0';
  });

  // Start both animations after initial delay
  setTimeout(() => {
    const animationStartTime = Date.now() - startTime;
    console.log(`Starting Vivus animation at ${animationStartTime}ms`);
    
    // Make paths and pencil visible
    if (pencilDot) {
      pencilDot.style.visibility = 'visible';
      pencilDot.style.opacity = '1';
    }
    
    // Add animation class to paths
    allPaths.forEach((path, index) => {
      path.classList.add('start-animation');
      console.log(`Added start-animation class to path ${index + 1}`);
    });

    vivusAnimation.play(1);
    tl.play();
  }, 100);
};

onMounted(() => {
  console.log('Component mounted, starting animation in 2 seconds...');
  setTimeout(() => {
    startAnimation();
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
  padding: 20px; /* Exact 20px padding */
  background: rgba(0, 0, 0, 0.5);
}

.wireframe-svg {
  position: fixed;
  top: 20px; /* Exact 20px from top */
  left: 20px;
  right: 20px;
  width: calc(100% - 40px); /* Account for left and right margin */
  height: 120px; /* Fixed height for navbar */
  z-index: 10001;
  pointer-events: none;
  outline: none;
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
  filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.3));
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

// Wireframe overlay styles
.wireframe-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10002;
}

// Wireframe headline container styles
.wireframe-headline-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
}

.wireframe-headline-line {
  height: 48px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  
  &:nth-child(1) {
    width: 90%;
  }
  
  &:nth-child(2) {
    width: 75%;
  }
  
  &:nth-child(3) {
    width: 60%;
  }
}

// Existing styles
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

// Headline styles
.headline-container {
  width: 100%;
}

.headline-box {
  height: 60px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  transform-origin: left;
}

// Subheadline styles
.subheadline-container {
  width: 100%;
}

.subheadline-box {
  height: 40px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  transform-origin: left;
}

// CTA buttons
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

// Chat area
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

// Message bubbles
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

/* Remove these rules that are hiding our paths */
// .navbar-logo-path,
// .navbar-link-1-path,
// .navbar-link-2-path,
// .navbar-link-3-path,
// .navbar-cta-path,
// .navbar-mobile-path {
//   opacity: 0;
// }

.pencil-dot {
  opacity: 0;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
  transition: opacity 0.3s ease;
}
</style> 