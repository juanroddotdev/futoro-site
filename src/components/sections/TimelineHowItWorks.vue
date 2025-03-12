<script setup lang="ts">
import { onMounted, computed } from "vue";
import { timelineAnimations } from "@/animations/timelineHowItWorks";
import { steps as defaultSteps, alternativeSteps, type ProcessSteps } from "@/data/howItWorksSteps";

interface Props {
  useAlternative?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  useAlternative: false
});

const steps = computed<ProcessSteps>(() => 
  props.useAlternative ? alternativeSteps : defaultSteps
);

const handleContactClick = () => {
  const contactSection = document.querySelector('#contact');
  contactSection?.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
  // Initialize main timeline animation
  timelineAnimations.initMainTimeline();

  // Animate each timeline item
  document.querySelectorAll('.timeline-item').forEach((item, index) => {
    timelineAnimations.animateTimelineItems(item, index);
  });
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
      <!-- Timeline line -->
      <div class="timeline-line absolute left-1/2 transform -translate-x-1/2 h-full w-1"></div>

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
            >{{ step.step }}</h3>
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
      <!-- <div class="absolute left-1/2 transform -translate-x-1/2 -top-4 w-1 h-4 timeline-connector"></div> -->
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

.floating-texts {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-text {
  position: absolute;
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0;
  transform: translate(var(--x), var(--y));
  animation: floatText 4.8s linear infinite;
  animation-delay: var(--delay);
  pointer-events: none;
}

@keyframes floatText {
  0%, 100% {
    opacity: 0;
    transform: translate(var(--x), var(--y));
  }
  25%, 75% {
    opacity: 1;
    transform: translate(var(--x), var(--y)) translateY(-10px);
  }
}

.touch-circle-btn {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  
  .default-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); // Increased from 0.4s to 0.8s
    transform-origin: center center;
    
    span {
      display: block;
      text-align: center;
    }
  }
  
  .hover-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); // Increased from 0.4s to 0.8s
    transform-origin: center center;
  }
  
  &:hover {
    .default-text {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    
    .floating-text {
      animation: suckToCenter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; // Increased from 0.4s to 0.8s
    }
    
    .hover-text {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
      transition-delay: 0.4s; // Increased from 0.2s to 0.4s
    }
  }
}

@keyframes suckToCenter {
  0% {
    transform: translate(var(--x), var(--y));
    opacity: 1;
  }
  100% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
}

// Ensure the rotating text also gets sucked in slower
.rotating-text {
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); // Increased from 0.4s to 0.8s
  
  .touch-circle-btn:hover & {
    transform: scale(0);
    opacity: 0;
  }
}
</style>