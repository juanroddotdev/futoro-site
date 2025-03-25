<script setup lang="ts">
import { onMounted, computed, ref, onUnmounted } from "vue";
import { timelineAnimations } from "@/animations/timelineHowItWorks";
import { steps as defaultSteps, alternativeSteps, type ProcessSteps } from "@/data/howItWorksSteps";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createComponentDebugger } from "@/utils/scroll/debug/ComponentDebugger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface Props {
  useAlternative?: boolean;
  debug?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  useAlternative: false,
  debug: import.meta.env.DEV
});

const steps = computed<ProcessSteps>(() => 
  props.useAlternative ? alternativeSteps : defaultSteps
);

const timelineContainerRef = ref<HTMLElement | null>(null);
const timelineLineRef = ref<HTMLElement | null>(null);
const timelineItemsRef = ref<HTMLElement[]>([]);

// Add refs for animation control
const timelineAnimationComplete = ref(false);
const timelineItemsVisible = ref<boolean[]>([]);

// Add a direct console log to verify script execution
console.log('[Timeline] Script section executing');

// ===== DEBUG CODE START =====
// Initialize the component debug utility
const debug = createComponentDebugger({
  componentName: 'Timeline',
  sectionId: 'howItWorks',
  enabled: props.debug,
  observeElements: {
    container: {
      ref: timelineContainerRef,
      threshold: 0.1,
      trackStyles: true
    },
    timeline: {
      ref: timelineLineRef,
      trackStyles: true
    }
  },
  trackAnimations: true,
  trackProps: true,
  props
});

// Add direct console log to verify debug object creation
console.log('[Timeline] Debug object created:', debug);
// ===== DEBUG CODE END =====

const handleContactClick = () => {
  const contactSection = document.querySelector('#contact');
  contactSection?.scrollIntoView({ behavior: 'smooth' });
};

// Timeline animation functions
const timelineAnimations = {
  initMainTimeline() {
    // Reset timeline line to be invisible initially
    gsap.set('.timeline-line', { autoAlpha: 0, scaleY: 0, transformOrigin: 'top center' });
    
    // Reset all timeline items to be invisible initially
    gsap.set('.timeline-item', { autoAlpha: 0 });
    gsap.set('.timeline-stem', { scaleX: 0 });
    
    // Create the main timeline animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: timelineContainerRef.value,
        start: 'top 70%',
        end: 'bottom 30%',
        toggleActions: 'play none none none',
        onEnter: () => {
          console.log('[Timeline] ScrollTrigger entered');
        }
      },
      onComplete: () => {
        console.log('[Timeline] Center timeline animation complete');
      }
    });
    
    // Animate the main timeline line growing from top to bottom
    tl.to('.timeline-line', {
      autoAlpha: 1,
      scaleY: 1,
      duration: 1.5,
      ease: 'power2.out'
    });
    
    return tl;
  },
  
  // Function to animate timeline items as they become visible
  animateTimelineItems() {
    if (!timelineItemsRef.value.length) return;
    
    timelineItemsRef.value.forEach((item, index) => {
      // Create a scroll trigger for each timeline item
      ScrollTrigger.create({
        trigger: item,
        start: 'top 80%',
        onEnter: () => {
          // Only animate if the main timeline has completed
          if (timelineLineRef.value && 
              window.getComputedStyle(timelineLineRef.value).transform.includes('1')) {
            console.log(`[Timeline] Item ${index + 1} visible`);
            
            // Animate the item appearing
            gsap.to(item, {
              autoAlpha: 1,
              duration: 0.5,
              ease: 'power2.out'
            });
            
            // Animate the stem line
            const stem = item.querySelector('.timeline-stem');
            if (stem) {
              gsap.to(stem, {
                scaleX: 1,
                duration: 0.5,
                ease: 'power2.out',
                delay: 0.2
              });
            }
          }
        }
      });
    });
  }
};

onMounted(() => {
  console.log('[Timeline] Component mounted');
  
  // Initialize main timeline animation
  const mainTimeline = timelineAnimations.initMainTimeline();
  
  // Set up timeline items animation after main timeline completes
  mainTimeline.then(() => {
    timelineAnimations.animateTimelineItems();
  });
  
  // Find timeline items
  timelineItemsRef.value = Array.from(document.querySelectorAll('.timeline-item'));
  console.log(`[Timeline] Found ${timelineItemsRef.value.length} timeline items`);
  
  // Remove debug styles that were forcing visibility
  // Comment these out for now to let the animations work
  /*
  gsap.set('.timeline-line', { autoAlpha: 1, scaleY: 1 });
  gsap.set('.timeline-item', { autoAlpha: 1 });
  gsap.set('.timeline-stem', { scaleX: 1 });
  */
});

onUnmounted(() => {
  // ===== DEBUG CODE START =====
  debug.cleanup();
  // ===== DEBUG CODE END =====
});
</script>

<template>
  <section id="howItWorks" class="section py-32">
    <!-- Add a debug indicator -->
    <div v-if="debug" class="debug-indicator">
      TIMELINE COMPONENT IS HERE
    </div>
    
    <div class="text-center mb-24">
      <h2 class="heading-responsive text-5xl heading--accent">How It Works</h2>
      <p class="body-text text-md max-w-2xl mx-auto mt-4">
        A streamlined process designed to deliver exceptional results for your web project
      </p>
    </div>

    <div ref="timelineContainerRef" class="timeline-container max-w-4xl mx-auto relative">
      <!-- Timeline line with debug styles -->
      <div ref="timelineLineRef" class="timeline-line absolute left-1/2 transform -translate-x-1/2 h-full w-1"
           style="border: 2px solid red; background-color: blue; width: 5px;">
      </div>

      <!-- Timeline items -->
      <div class="relative">
        <div v-for="(step, index) in steps" 
             :key="step.id"
             class="timeline-item relative mb-24 last:mb-0"
             :class="{ 'text-left ml-auto pl-8': index % 2 === 0, 'text-right mr-auto pr-8': index % 2 === 1 }"
             :style="{ width: 'calc(50% - 2rem)' }"
        >
          <!-- Stem line from main timeline -->
          <div class="timeline-stem absolute h-1"
               :class="[
                 index % 2 === 0 ? 'left-[-2rem]' : 'right-[-2rem]',
                 'w-[4rem]'
               ]"
               :style="{ top: 'calc(0.2rem + 1px)' }"
          ></div>

          <!-- Content -->
          <div class="timeline-card bg-opacity-30 rounded-xl p-6 backdrop-blur-sm relative">
            <!-- Number in corner -->
            <div class="timeline-number absolute -top-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                 :class="[
                   index % 2 === 0 ? '-left-3' : '-right-3',
                 ]">
              {{ step.id }}
            </div>

            <h3 class="timeline-title text-lg font-semibold mb-4 theme-text--gradient"
                :class="index % 2 === 0 ? 'gradient-normal' : 'gradient-reverse'"
            >{{ step.step || step.title }}</h3>
            <ul class="space-y-2" :class="index % 2 === 1 ? 'pl-4' : 'pl-4'">
              <li v-for="(bullet, bulletIndex) in step.description" 
                  :key="bulletIndex"
                  class="timeline-bullet text-sm body-text list-none"
                  :data-step-id="step.id"
                  :data-bullet-index="bulletIndex">
                {{ bullet }}
              </li>
            </ul>
            
            <!-- Emoji icon -->
            <div class="flex mt-4" :class="[step.id % 2 === 0 ? 'justify-start' : 'justify-end']">
              <span class="text-4xl opacity-80">{{ step.icon }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-24 relative">
      <button 
        type="button"
        class="touch-circle-btn btn-round--outline-secondary"
        @click="handleContactClick"
      >
        <div class="pulse-gradient"></div>
        <div class="floating-texts">
          <span class="floating-text" style="--delay: 0s; --x: -25px; --y: -15px;">CLICK ME</span>
          <span class="floating-text" style="--delay: 1.2s; --x: 15px; --y: -28px;">CLICK ME</span>
          <span class="floating-text" style="--delay: 2.4s; --x: -18px; --y: 25px;">CLICK ME</span>
          <span class="floating-text" style="--delay: 3.6s; --x: 28px; --y: 12px;">CLICK ME</span>
        </div>
        <svg class="rotating-text" viewBox="0 0 200 200" width="200" height="200">
          <defs>
            <path id="circlePath" 
                  d="M 100,100 m -70,0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
                  fill="none"/>
          </defs>
          <text class="circle-text">
            <textPath href="#circlePath" startOffset="0%">
              ☞ ☞CLICK ME ☞ CLICK ME
            </textPath>
          </text>
        </svg>
        <div class="hover-text">Let's Get Started</div>
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.rotating-text {
  position: absolute;
  inset: 0;
  z-index: 2;
  animation: rotate 10s linear infinite;
  
  .circle-text {
    fill: currentColor;
    font-size: 1.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.timeline-line {
  background: linear-gradient(to bottom, 
    var(--color-primary-500) 0%, 
    var(--color-secondary-500) 100%);
  border-radius: 4px;
  /* Remove the !important flags to allow animations to work */
  /* opacity: 1 !important;
  visibility: visible !important;
  transform: scaleY(1) !important; */
  z-index: 10;
  width: 2px; /* Set a reasonable width */
}

/* Timeline item styles */
.timeline-item {
  transition: opacity 0.5s ease;
  /* Remove the !important flags to allow animations to work */
  /* opacity: 1 !important;
  visibility: visible !important; */
}

.timeline-stem {
  background: linear-gradient(to right, 
    var(--color-primary-500) 0%, 
    var(--color-secondary-500) 100%);
  border-radius: 4px;
}

.timeline-number {
  background: var(--color-primary-500);
  color: var(--color-background);
  box-shadow: 0 0 10px rgba(var(--color-primary-rgb), 0.5);
}

.timeline-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }
}

.btn-round-large-primary {
  position: relative;
  padding: 1.5rem 3rem;
  border-radius: 9999px;
  background: var(--color-primary-500);
  color: var(--color-text-on-primary);
  font-weight: 600;
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    background: var(--color-primary-600);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(var(--color-primary-rgb), 0.3);
    
    .rotating-text {
      opacity: 1;
    }
    
    .hover-text {
      opacity: 0;
    }
  }
  
  .rotating-text {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .hover-text {
    transition: opacity 0.3s ease;
  }
}

/* Debug styles */
.debug-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 10px;
  font-family: monospace;
  font-size: 12px;
  max-width: 300px;
  max-height: 80vh;
  overflow: auto;
}

/* ===== DEBUG STYLES START ===== */
.debug-marker {
  pointer-events: none;
  box-shadow: 0 0 0 2px white, 0 0 10px rgba(0,0,0,0.5);
  
  &--end {
    animation: pulse-red 2s infinite;
  }
  
  &--stem {
    animation: pulse-blue 2s infinite;
  }
}

@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
}

@keyframes pulse-blue {
  0% { box-shadow: 0 0 0 0 rgba(0, 0, 255, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(0, 0, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 0, 255, 0); }
}
/* ===== DEBUG STYLES END ===== */

/* Add animation styles */
.timeline-item {
  transition: opacity 0.5s ease;
  opacity: 0;
  visibility: hidden;
}

.timeline-stem {
  transform-origin: left center;
  transform: scaleX(0);
  
  .timeline-item:nth-child(even) & {
    transform-origin: right center;
  }
}

/* Override the initial invisible state for debugging */
.timeline-item {
  opacity: 1 !important;
  visibility: visible !important;
}

.timeline-line {
  opacity: 1 !important;
  visibility: visible !important;
  transform: scaleY(1) !important;
}

.timeline-stem {
  transform: scaleX(1) !important;
}

/* Debug indicator */
.debug-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: red;
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  z-index: 9999;
}
</style>
