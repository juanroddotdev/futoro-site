<script setup lang="ts">
import { onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { steps } from '@/data/howItWorksSteps';

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  // Animate timeline line
  gsap.from('.timeline-line', {
    scaleY: 0,
    transformOrigin: 'top',
    scrollTrigger: {
      trigger: '.timeline-container',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1
    }
  });

  // Animate timeline items
  gsap.utils.toArray('.timeline-item').forEach((item: any, i) => {
    gsap.from(item, {
      opacity: 0,
      x: i % 2 === 0 ? -50 : 50,
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'top 60%',
        scrub: 1
      }
    });
  });
});

const handleContactClick = () => {
  const contactSection = document.querySelector('#contact');
  contactSection?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<template>
  <section class="wireframe-section py-32">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Heading -->
      <div class="text-center mb-24">
        <h2 class="font-space-grotesk text-5xl font-bold mb-4 text-slate-800">
          How It Works
        </h2>
        <p class="font-raleway text-lg text-slate-600 max-w-2xl mx-auto">
          A streamlined process designed to deliver exceptional results for your web project
        </p>
      </div>

      <!-- Timeline Container -->
      <div class="timeline-container relative max-w-4xl mx-auto">
        <div class="timeline-line absolute left-1/2 -translate-x-1/2 w-[2px] h-full"></div>

        <!-- Timeline Items -->
        <div class="relative">
          <div v-for="(step, index) in steps" 
               :key="step.id"
               class="timeline-item relative mb-24 last:mb-0"
               :class="{ 'text-left ml-auto pl-8': index % 2 === 0, 'text-right mr-auto pr-8': index % 2 === 1 }"
               :style="{ width: 'calc(50% - 2rem)' }"
          >
            <!-- Connector Line -->
            <div class="timeline-connector absolute h-[2px]"
                 :class="[
                   index % 2 === 0 ? 'left-[-2rem]' : 'right-[-2rem]',
                   'w-[2rem]'
                 ]"
                 :style="{ top: '2rem' }"
            ></div>

            <!-- Step Card -->
            <div class="timeline-card relative p-6">
              <!-- Step Number -->
              <div class="step-number absolute -top-3 w-8 h-8 rounded-full flex items-center justify-center"
                   :class="[index % 2 === 0 ? '-left-3' : '-right-3']">
                <span class="font-space-grotesk font-bold">{{ step.id }}</span>
              </div>

              <!-- Content -->
              <div class="card-content">
                <h3 class="font-space-grotesk font-bold text-lg mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {{ step.step }}
                </h3>
                <ul class="space-y-3 font-raleway text-base text-slate-700">
                  <li v-for="(desc, i) in step.description" 
                      :key="i"
                      class="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-purple-500">
                    {{ desc }}
                  </li>
                </ul>
                
                <!-- Icon -->
                <div class="text-4xl mt-6" :class="[index % 2 === 0 ? 'text-right' : 'text-left']">
                  {{ step.icon }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

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
</template>

<style lang="scss" scoped>
.wireframe-section {
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(to bottom right, rgba(79, 70, 229, 0.05), rgba(147, 51, 234, 0.05));
  }
}

.timeline-line {
  background: linear-gradient(to bottom, #6366f1, #a855f7);
  opacity: 0.3;
}

.timeline-connector {
  background: linear-gradient(to right, #6366f1, #a855f7);
  opacity: 0.3;
}

.timeline-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 16px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(99, 102, 241, 0.2);
    box-shadow: 
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
}

.step-number {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

// Responsive styles
@media (max-width: 768px) {
  .timeline-item {
    width: calc(100% - 2rem) !important;
    margin-left: 2rem !important;
    padding-left: 2rem !important;
    text-align: left !important;
  }

  .timeline-line {
    left: 2rem !important;
  }

  .timeline-connector {
    left: -2rem !important;
    width: 2rem !important;
  }

  .step-number {
    left: -3rem !important;
  }
}

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
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
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
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform-origin: center center;
  }
  
  &:hover {
    .default-text {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    
    .floating-text {
      animation: suckToCenter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    
    .hover-text {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
      transition-delay: 0.4s;
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

.rotating-text {
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  .touch-circle-btn:hover & {
    transform: scale(0);
    opacity: 0;
  }
}
</style>