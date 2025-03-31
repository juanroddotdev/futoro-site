<template>
  <div class="animated-subheadline">
    <!-- Content wrapper -->
    <div class="content-wrapper">
      <div class="text-container">
        <!-- Subheadline with two layers -->
        <div class="theme-text--gradient-animated gradient-shine subheading-responsive">
          <!-- Vara container - Initial handwritten animation -->
          <div id="vara-container"></div>
          
          <!-- Regular text - Legacy transition system (keeping for now) -->
          <div class="regular-text-wrapper">
            <span v-for="(letter, index) in text" :key="index" class="letter" :style="{
              display: currentLetter >= index ? 'inline-block' : 'none'
            }">{{ letter }}</span>
          </div>
          
          <!-- Spotlight text - New reveal animation -->
          <div class="spotlight-text-wrapper theme-text--gradient-animated gradient-shine">
            {{ text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import gsap from 'gsap';
import { useVara } from '@/composables/useVara';

const props = defineProps<{
  text: string;
  direction?: 'ltr' | 'rtl';
  spotlightProgress?: number; // 0 to 100, represents spotlight position
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const { loadVara } = useVara();

// State management
const currentLetter = ref(0);
const isLetterTransitioning = ref(false);
let varaInstance: any = null;

// Function to handle spotlight reveal effect
const applySpotlightReveal = (element: HTMLElement, progress: number) => {
  if (!element) return;
  const clipAmount = props.direction === 'rtl' 
    ? Math.max(0, Math.min(100, progress))
    : Math.max(0, Math.min(100, 100 - progress));
  element.style.clipPath = `inset(0 ${clipAmount}% 0 0)`;
};

// Watch for spotlight progress changes
watch(() => props.spotlightProgress, (newProgress) => {
  if (typeof newProgress !== 'number') return;

  const spotlightTextWrapper = document.querySelector('.spotlight-text-wrapper') as HTMLElement;
  if (spotlightTextWrapper) {
    applySpotlightReveal(spotlightTextWrapper, newProgress);
  }

  // Handle Vara text transition
  const varaContainer = document.querySelector('#vara-container') as HTMLElement;
  if (varaContainer && !isLetterTransitioning.value && varaInstance) {
    const varaText = varaInstance.get(0);
    if (varaText && varaText.characters) {
      const text = props.text;
      if (currentLetter.value < text.length) {
        const varaLetter = varaText.characters[currentLetter.value];
        if (varaLetter) {
          const varaRect = varaLetter.getBoundingClientRect();
          const containerRect = varaContainer.getBoundingClientRect();
          
          // Calculate letter position as percentage
          const letterPosition = ((varaRect.left - containerRect.left) / containerRect.width) * 100;
          
          // Determine if letter should transition based on direction
          const shouldTransition = props.direction === 'rtl'
            ? letterPosition > (100 - newProgress) // RTL: transition when spotlight passes from right
            : letterPosition < newProgress;        // LTR: transition when spotlight passes from left
          
          if (shouldTransition) {
            isLetterTransitioning.value = true;
            
            const letterTimeline = gsap.timeline({
              onComplete: () => {
                isLetterTransitioning.value = false;
                currentLetter.value++;
                
                // Emit complete when all letters are transitioned
                if (currentLetter.value >= text.length) {
                  emit('complete');
                }
              }
            });

            letterTimeline.to(varaLetter, {
              opacity: 0,
              duration: 0.05,
              ease: 'none'
            });
          }
        }
      }
    }
  }
}, { immediate: true });

// Initialize Vara animation
const initVara = async () => {
  try {
    await loadVara();
    
    varaInstance = new window.Vara(
      "#vara-container",
      "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
      [
        {
          text: props.text,
          fontSize: 24,
          strokeWidth: 2,
          color: 'var(--theme-primary, #88C0D0)',
          duration: 2000,
          letterSpacing: 2,
          y: 35,
          x: 0,
          textAlign: "center",
          autoAnimation: false
        }
      ],
      {
        strokeWidth: 2,
        fontSize: 24,
        textAlign: "center"
      }
    );

    varaInstance.ready(() => {
      const varaText = varaInstance.get(0);
      const varaLetters = varaText.characters;
      
      props.text.split('').forEach((letter, index) => {
        if (varaLetters[index]) {
          varaLetters[index].setAttribute('data-letter', letter);
          varaLetters[index].style.opacity = '1';
        }
      });

      varaInstance.draw(0);
    });
  } catch (error) {
    console.error('Failed to load Vara:', error);
  }
};

onMounted(() => {
  initVara();
});

// Add TypeScript type for Vara
declare global {
  interface Window {
    Vara: any;
  }
}
</script>

<style scoped>
.animated-subheadline {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  text-align: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
}

.text-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  position: relative;
  max-width: 800px;
}

#vara-container {
  pointer-events: none;
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.regular-text-wrapper {
  width: 100%;
  height: auto;
  min-height: 120px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  white-space: pre-wrap;
  visibility: visible;
  pointer-events: none;
  opacity: 1;
  clip-path: inset(0 100% 0 0);
}

.regular-text-wrapper .letter {
  position: absolute;
  opacity: 0;
  display: none;
  background: linear-gradient(
    to right,
    var(--theme-primary, #88C0D0),
    var(--theme-secondary, #5E81AC)
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shine 3s linear infinite;
  font-family: 'Raleway', sans-serif;
  font-size: clamp(1rem, 2.5vw, 3rem);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0;
  margin: 0;
  pointer-events: none;
  max-width: 100%;
}

.spotlight-text-wrapper {
  width: 100%;
  height: auto;
  min-height: 120px;
  position: absolute;
  top: 0;
  left: 0;
  transform: none;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: pre-wrap;
  opacity: 1;
  clip-path: inset(0 100% 0 0);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  background: linear-gradient(
    to right,
    var(--theme-primary, #88C0D0),
    var(--theme-secondary, #5E81AC),
    var(--theme-primary, #88C0D0)
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shine 3s linear infinite;
}

.subheading-responsive {
  position: relative;
  width: 100%;
  height: 120px;
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);
  line-height: 1.5;
  font-weight: 500;
  letter-spacing: -0.025em;
  color: var(--theme-text-primary, #E5E9F0);
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
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
}

.gradient-shine {
  animation: shine 3s linear infinite;
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}
</style> 