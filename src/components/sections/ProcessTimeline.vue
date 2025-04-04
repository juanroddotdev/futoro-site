<script setup lang="ts">
import { onMounted, computed, ref, onUnmounted } from "vue";
import { timelineAnimations } from "@/animations/processTimeline";
import { steps as defaultSteps, alternativeSteps, type ProcessSteps } from "@/data/howItWorksSteps";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface Props {
  useAlternative?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  useAlternative: false
});

const steps = computed<ProcessSteps>(() => 
  props.useAlternative ? alternativeSteps : defaultSteps
);

// Track active step
const activeStepId = ref<number | null>(null);
const timelineProgress = ref(0);
const timelineItems = ref<Element[]>([]);
const scrollTriggers = ref<ScrollTrigger[]>([]);

const handleContactClick = () => {
  const contactSection = document.querySelector('#contact');
  contactSection?.scrollIntoView({ behavior: 'smooth' });
};

// Add this computed property to the script section
const isDevelopment = computed(() => import.meta.env.DEV);

// Track when timeline reaches each step
function setupStepTracking() {
  timelineItems.value = Array.from(document.querySelectorAll('.timeline-item'));
  
  timelineItems.value.forEach((item, index) => {
    const step = steps.value[index];
    const trigger = ScrollTrigger.create({
      trigger: item,
      start: 'top 70%',
      end: 'bottom 30%',
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
      markers: false // Set to true for debugging
    });
    
    scrollTriggers.value.push(trigger);
  });
  
  // Track overall timeline progress
  const timelineContainer = document.querySelector('.timeline-container');
  if (timelineContainer) {
    ScrollTrigger.create({
      trigger: timelineContainer,
      start: 'top 80%',
      end: 'bottom 20%',
      onUpdate: (self) => {
        timelineProgress.value = self.progress;
      },
      markers: false // Set to true for debugging
    });
  }
}

onMounted(() => {
  // Initialize main timeline animation
  timelineAnimations.initMainTimeline();

  // Animate each timeline item
  document.querySelectorAll('.timeline-item').forEach((item, index) => {
    timelineAnimations.animateTimelineItems(item, index);
  });
  
  // Setup step tracking
  setupStepTracking();
});

onUnmounted(() => {
  // Clean up ScrollTriggers to prevent memory leaks
  scrollTriggers.value.forEach(trigger => trigger.kill());
});
</script>

<template>
  <section id="howItWorks" class="section py-32">
    <div class="text-center mb-24">
      <h2 class="heading-responsive text-5xl heading--accent">How It Works</h2>
      <p class="body-text text-md max-w-2xl mx-auto mt-4">
        A streamlined process designed to deliver exceptional results for your web project
      </p>
    </div>

    <div class="timeline-container max-w-4xl mx-auto relative">
      <!-- Timeline line with progress indicator -->
      <div class="timeline-line absolute left-1/2 transform -translate-x-1/2 h-full w-1"></div>
      <div class="timeline-progress absolute left-1/2 transform -translate-x-1/2 w-1"
           :style="{ height: `${timelineProgress * 100}%`, backgroundColor: 'var(--color-accent)' }"></div>

      <!-- Timeline items -->
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
          <!-- Stem line from main timeline -->
          <div class="timeline-stem absolute h-1"
               :class="[
                 index % 2 === 0 ? 'left-[-2rem]' : 'right-[-2rem]',
                 'w-[4rem]'
               ]"
               :style="{ top: index === 0 ? '0px' : 'calc(0.2rem + 1px)' }"
          ></div>

          <!-- Content -->
          <div class="timeline-card item hover-card-themed p-6 relative">
            <!-- Number in corner -->
            <div class="timeline-number absolute -top-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                 :class="[
                   index % 2 === 0 ? '-left-3' : '-right-3',
                 ]">
              {{ step.id }}
            </div>

            <h3 class="text-md font-semibold gradient-text mb-3 "
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


</style>
