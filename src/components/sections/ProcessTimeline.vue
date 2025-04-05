<script setup lang="ts">
import { onMounted, computed, ref, onUnmounted, watch } from "vue";
import { timelineAnimations } from "@/animations/processTimeline";
import { steps as defaultSteps, alternativeSteps, type ProcessSteps } from "@/data/howItWorksSteps";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// =============================================
// Types and Interfaces
// =============================================
interface Props {
  useAlternative?: boolean; // Toggle between default and alternative step sets
}

// =============================================
// Props and State Management
// =============================================
const props = withDefaults(defineProps<Props>(), {
  useAlternative: false
});

// Computed property to determine which step set to use
const steps = computed<ProcessSteps>(() => 
  props.useAlternative ? alternativeSteps : defaultSteps
);

// State management for timeline tracking
const activeStepId = ref<number | null>(null); // Currently active step
const timelineProgress = ref(0); // Overall timeline progress (0-1)
const timelineItems = ref<Element[]>([]); // DOM elements for each timeline item
const scrollTriggers = ref<ScrollTrigger[]>([]); // GSAP scroll triggers
const timelineContainer = ref<HTMLElement | null>(null);

// =============================================
// Navigation Handlers
// =============================================
/**
 * Handles the contact button click by smoothly scrolling to the contact section
 */
const handleContactClick = () => {
  const contactSection = document.querySelector('#contact');
  contactSection?.scrollIntoView({ behavior: 'smooth' });
};


// =============================================
// Timeline Step Tracking
// =============================================
/**
 * Sets up scroll triggers for each timeline step
 * Tracks when steps enter/leave the viewport and updates active step accordingly
 */
function setupStepTracking() {
  // Get all timeline items from the DOM
  timelineItems.value = Array.from(document.querySelectorAll('.timeline-item'));
  
  // Create scroll triggers for each timeline item
  timelineItems.value.forEach((item, index) => {
    const step = steps.value[index];
    const trigger = ScrollTrigger.create({
      trigger: item,
      start: 'top 70%', // Start when top of item is 70% down viewport
      end: 'bottom 30%', // End when bottom of item is 30% down viewport
      onEnter: () => {
        activeStepId.value = step.id;
      },
      onEnterBack: () => {
        activeStepId.value = step.id;
      },
      onLeave: () => {
        // Only update if this is the active step
        if (activeStepId.value === step.id) {
          const nextIndex = index + 1;
          if (nextIndex < steps.value.length) {
            activeStepId.value = steps.value[nextIndex].id;
          }
        }
      },
      onLeaveBack: () => {
        // Only update if this is the active step
        if (activeStepId.value === step.id) {
          const prevIndex = index - 1;
          if (prevIndex >= 0) {
            activeStepId.value = steps.value[prevIndex].id;
          } else {
            activeStepId.value = null; // Before first step
          }
        }
      },
      markers: false // Disable markers
    });
    
    scrollTriggers.value.push(trigger);
  });
  
  // Track overall timeline progress
  if (timelineContainer.value) {
    ScrollTrigger.create({
      trigger: timelineContainer.value,
      start: 'top center',
      end: 'bottom center',
      onUpdate: (self) => {
        timelineProgress.value = self.progress;
      },
      markers: false // Disable markers
    });
  }
}

// =============================================
// Lifecycle Hooks
// =============================================
onMounted(() => {
  // Initialize main timeline animation
  timelineAnimations.initMainTimeline();

  // Animate each timeline item
  document.querySelectorAll('.timeline-item').forEach((item, index) => {
    timelineAnimations.animateTimelineItems(item, index);
  });
  
  // Setup step tracking
  setupStepTracking();

  if (!timelineContainer.value) return;

  // Create a master timeline for the entire process
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: timelineContainer.value,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        timelineProgress.value = self.progress;
      }
    }
  });

  // Create a separate ScrollTrigger for the progress line
  const progressLine = document.querySelector('.timeline-progress');
  if (progressLine) {
    ScrollTrigger.create({
      trigger: timelineContainer.value,
      start: 'top center',
      end: 'bottom center',
      onUpdate: (self) => {
        // Calculate the height needed to reach the viewport center
        const viewportCenter = window.innerHeight / 2;
        const containerRect = timelineContainer.value?.getBoundingClientRect();
        
        if (containerRect) {
          // Calculate the position of the viewport center relative to the container
          const viewportCenterRelativeToContainer = viewportCenter - containerRect.top;
          
          // Calculate the height needed for the progress line to reach the viewport center
          const heightToCenter = viewportCenterRelativeToContainer;
          
          // Apply the height to the progress line
          if (heightToCenter > 0) {
            gsap.to(progressLine, {
              height: heightToCenter,
              duration: 0.3,
              ease: 'power1.out'
            });
          }
        }
      }
    });
  }
});

onUnmounted(() => {
  // Clean up ScrollTriggers to prevent memory leaks
  scrollTriggers.value.forEach(trigger => trigger.kill());
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
</script>

<template>
  <section id="howItWorks" class="section py-32">
    <!-- Section Header -->
    <div class="text-center mb-24">
      <h2 class="heading-responsive text-5xl heading--accent">How It Works</h2>
      <p class="body-text text-md max-w-2xl mx-auto mt-4">
        A streamlined process designed to deliver exceptional results for your web project
      </p>
    </div>

    <!-- Timeline Container -->
    <div class="timeline-container max-w-4xl mx-auto relative" ref="timelineContainer">
      <!-- Timeline Lines -->
      <div class="timeline-line absolute left-1/2 transform -translate-x-1/2 h-full w-1"></div>
      
      <!-- Progress Line - Using a different approach -->
      <div class="timeline-progress absolute left-1/2 transform -translate-x-1/2 w-1"
           :style="{ 
             backgroundColor: 'var(--color-accent)',
             position: 'absolute',
             top: '0',
             transform: 'translate(-50%, 0)'
           }"></div>

      <!-- Timeline Items -->
      <div class="relative">
        <div v-for="(step, index) in steps" 
             :key="step.id"
             class="timeline-item relative mb-24 last:mb-0"
             :class="[
               { 'text-left ml-auto pl-8': index % 2 === 0, 'text-right mr-auto pr-8': index % 2 === 1 },
               { 'timeline-item--active': activeStepId === step.id }
             ]"
             :style="{ width: 'calc(50% - 4rem)' }"
        >
          <!-- Connecting Stem Line -->
          <div class="timeline-stem absolute h-1"
               :class="[
                 index % 2 === 0 ? 'left-[-2rem]' : 'right-[-2rem]',
                 'w-[4rem]'
               ]"
               :style="{ top: index === 0 ? '0px' : 'calc(0.2rem + 1px)' }"
          ></div>

          <!-- Step Content Card -->
          <div class="timeline-card item hover-card-themed p-6 relative">
            <!-- Step Number -->
            <div class="timeline-number absolute -top-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                 :class="[
                   index % 2 === 0 ? '-left-3' : '-right-3',
                 ]">
              {{ step.id }}
            </div>

            <!-- Step Title and Description -->
            <h3 class="text-md font-semibold gradient-text mb-3"
                :class="index % 2 === 0 ? 'gradient-normal' : 'gradient-reverse'"
            >{{ step.step || step.title }}</h3>
            <ul class="space-y-2" :class="index % 2 === 1 ? 'pl-4' : 'pl-4'">
              <li v-for="(bullet, bulletIndex) in step.description" 
                  :key="bulletIndex"
                  class="timeline-bullet theme-text--neutral list-none body-text-md"
                  :data-step-id="step.id"
                  :data-bullet-index="bulletIndex">
                {{ bullet }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action Button -->
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
// Add your scoped styles here
</style>
