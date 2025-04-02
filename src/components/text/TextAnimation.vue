<template>
  <div 
    ref="containerRef" 
    :class="['animated-text-container', { 'initially-hidden': initiallyHidden }]"
  >
    <span v-if="firstPart" 
          ref="firstPartRef" 
          :class="{ 
            'theme-text--gradient': useGradient && props.animation !== 'outlineToFill',
            'outline-gradient': props.animation === 'outlineToFill'
          }">{{ firstPart }}</span>
    <span v-if="secondPart" ref="secondPartRef" :class="{ 'theme-text--gradient': useGradient }">{{ secondPart }}</span>
    <span v-if="suffix" ref="suffixRef" :class="{ 'theme-text--gradient': useGradient }">{{ suffix }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted, PropType } from 'vue';
import { textAnimations, type TextAnimationType } from '@/animations/text/textAnimations';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

// Add instance tracking
const activeInstances = new Set<string>();

interface EffectStyle {
  gradientClass?: string;
  customStyles?: Record<string, string>;
  scaleX?: number;
  scaleY?: number;
  intensity?: number;
  iterations?: number;
  height?: number;
  ease?: string;
  [key: string]: any;
}

const props = defineProps({
  firstPart: {
    type: String,
    required: true
  },
  secondPart: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  useGradient: {
    type: Boolean,
    default: false
  },
  animation: {
    type: String as () => TextAnimationType,
    default: 'fade' as TextAnimationType
  },
  duration: {
    type: Number,
    default: 1
  },
  delay: {
    type: Number,
    default: 0
  },
  ease: {
    type: String,
    default: 'power2.out'
  },
  // Add a key prop to force re-render
  resetKey: {
    type: Number,
    default: 0
  },
  // New prop
  triggerOnVisible: {
    type: Boolean,
    default: true
  },
  // New prop
  restartOnVisible: {
    type: Boolean,
    default: true
  },
  // Add initiallyHidden prop
  initiallyHidden: {
    type: Boolean,
    default: true
  },
  // New props for word-level animations
  wordEffects: {
    type: Boolean,
    default: false
  },
  wordTargets: {
    type: Array,
    default: () => []
  },
  wordEffectTypes: {
    type: Array,
    default: () => []  // 'highlight', 'bounce', 'shake', 'squeeze', etc.
  },
  wordEffectStyles: {
    type: Array as PropType<EffectStyle[]>,
    default: () => []
  },
  wordEffectDuration: {
    type: Number,
    default: 2
  },
  wordEffectDelay: {
    type: Number,
    default: 1
  },
  // Add wordEffectClasses prop
  wordEffectClasses: {
    type: Array,
    default: () => []
  },
  instanceId: {
    type: String,
    default: () => `text-animation-${Math.random().toString(36).substr(2, 9)}`
  }
});

const emit = defineEmits(['animation-complete', 'word-effect-start', 'word-effect-complete', 'animation-start']);

const containerRef = ref<HTMLElement | null>(null);
const firstPartRef = ref<HTMLElement | null>(null);
const secondPartRef = ref<HTMLElement | null>(null);
const suffixRef = ref<HTMLElement | null>(null);
const hasAnimated = ref(false);
const isAnimating = ref(false);
let observer: IntersectionObserver | null = null;

// Function to apply word effects
const applyWordEffects = () => {
  if (!props.wordEffects || !containerRef.value || props.wordTargets.length === 0) {
    // Release animation lock if no word effects
    isAnimating.value = false;
    activeInstances.delete(props.instanceId);
    console.log('TextAnimation: Animation lock released (no word effects)', {
      timestamp: new Date().toISOString(),
      isAnimating: isAnimating.value,
      instanceId: props.instanceId,
      activeInstances: Array.from(activeInstances)
    });
    emit('animation-complete');
    return;
  }
  
  // Emit that word effects are starting
  emit('word-effect-start');
  
  // Process each element to find and wrap target words
  const elements = [
    firstPartRef.value,
    secondPartRef.value,
    suffixRef.value
  ].filter(Boolean) as HTMLElement[];
  
  // Store original styles for each word element to restore later
  const originalStyles = new Map();
  
  elements.forEach((element) => {
    if (!element) return;
    
    const originalText = element.textContent || '';
    let newHTML = originalText;
    
    // Replace each target word with a span
    props.wordTargets.forEach((word, wordIndex) => {
      if (typeof word !== 'string' || !originalText.includes(word)) return;
      
      const effectType = props.wordEffectTypes[wordIndex] || 'highlight';
      const effectStyle = props.wordEffectStyles[wordIndex] || {};
      const gradientClass = effectStyle.gradientClass || 'theme-text--gradient';
      
      // Add the specific class for this word based on its index
      const additionalClasses = Array.isArray(props.wordEffectClasses[wordIndex]) 
        ? props.wordEffectClasses[wordIndex].join(' ') 
        : props.wordEffectClasses[wordIndex] || '';
      
      const wordClass = `word-effect word-${effectType} word-index-${wordIndex} ${gradientClass} ${additionalClasses}`;
      
      newHTML = newHTML.replace(
        new RegExp(`\\b${word}\\b`, 'g'), // Use word boundary for exact match
        `<span class="${wordClass}" data-word-index="${wordIndex}">${word}</span>`
      );
    });
    
    // Only update if we found and replaced words
    if (newHTML !== originalText) {
      element.innerHTML = newHTML;
    }
  });
  
  // Get all word effect elements
  const wordElements = containerRef.value.querySelectorAll('.word-effect');
  if (wordElements.length === 0) {
    emit('animation-complete');
    return;
  }
  
  // Apply default transition to all word elements for smoother animations
  wordElements.forEach(el => {
    // Add a smooth transition with longer duration
    (el as HTMLElement).style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  });

  // Create animation timeline with the effect delay
  const tl = gsap.timeline({
    delay: props.wordEffectDelay,
    onComplete: () => {
      // Remove custom styles when animation completes
      wordElements.forEach(el => {
        const wordIndex = parseInt(el.getAttribute('data-word-index') || '0');
        const effectStyle = props.wordEffectStyles[wordIndex] || {};
        
        // Remove transition along with other custom styles
        (el as HTMLElement).style.transition = '';
        
        if (effectStyle.customStyles) {
          // Restore original styles
          Object.keys(effectStyle.customStyles).forEach(prop => {
            (el as HTMLElement).style[prop as any] = '';
          });
        }
      });
      
      // Release animation lock after word effects complete
      isAnimating.value = false;
      activeInstances.delete(props.instanceId);
      console.log('TextAnimation: Animation lock released (word effects complete)', {
        timestamp: new Date().toISOString(),
        isAnimating: isAnimating.value,
        instanceId: props.instanceId,
        activeInstances: Array.from(activeInstances)
      });
      
      emit('word-effect-complete');
      emit('animation-complete');
    }
  });
  
  // Apply effects based on their type
  Array.from(wordElements).forEach((el, index) => {
    const classList = Array.from(el.classList);
    let effectType = 'highlight'; // Default
    let wordIndex = parseInt(el.getAttribute('data-word-index') || '0');
    
    // Find the effect type from class
    const effectClass = classList.find(cls => 
      cls.startsWith('word-') && 
      cls !== 'word-effect' && 
      !cls.startsWith('word-index-')
    );
    
    if (effectClass) {
      effectType = effectClass.replace('word-', '');
    }
    
    const effectStyle = props.wordEffectStyles[wordIndex] || {};
    
    // Apply custom styles if provided
    if (effectStyle.customStyles) {
      Object.entries(effectStyle.customStyles).forEach(([prop, value]) => {
        (el as HTMLElement).style[prop as any] = value as string;
      });
    }
    
    // Apply the appropriate effect
    switch (effectType) {
      case 'highlight':
        applyHighlightEffect(tl, el as HTMLElement, effectStyle, wordIndex);
        break;
      case 'bounce':
        applyBounceEffect(tl, el as HTMLElement, effectStyle, wordIndex);
        break;
      case 'shake':
        applyShakeEffect(tl, el as HTMLElement, effectStyle, wordIndex);
        break;
      case 'squeeze':
        applySqueezeEffect(tl, el as HTMLElement, effectStyle, wordIndex);
        break;
    }
  });
};

// Individual effect functions
const applyHighlightEffect = (
  tl: gsap.core.Timeline, 
  el: HTMLElement, 
  effectStyle: EffectStyle, 
  wordIndex: number
) => {
  const iterations = effectStyle?.iterations || 2;
  
  // Animate the gradient position back and forth
  for (let i = 0; i < iterations; i++) {
    tl.to(el, {
      backgroundPosition: '100% center',
      duration: props.wordEffectDuration / (iterations * 2),
      ease: 'sine.inOut'
    }, i * props.wordEffectDuration / iterations);
    
    tl.to(el, {
      backgroundPosition: '0% center',
      duration: props.wordEffectDuration / (iterations * 2),
      ease: 'sine.inOut'
    }, (props.wordEffectDuration / (iterations * 2)) + (i * props.wordEffectDuration / iterations));
  }
  
  // Return to original styling but keep the gradient
  tl.to(el, {
    backgroundPosition: '50% center',
    duration: 0.5,
    ease: 'power2.inOut'
  }, props.wordEffectDuration);
};

const applyBounceEffect = (
  tl: gsap.core.Timeline, 
  el: HTMLElement, 
  effectStyle: EffectStyle, 
  wordIndex: number
) => {
  // Default bounce parameters
  const bounceHeight = effectStyle?.height || 20;
  const bounceEase = effectStyle?.ease || 'elastic.out(1, 0.3)';
  
  // Set initial state with no transform to ensure clean start
  gsap.set(el, { 
    transformOrigin: 'center bottom',
    y: 0,
    scale: 1
  });
  
  // Create more pronounced bounce animation
  tl.to(el, {
    y: -bounceHeight,
    scale: 1.1,
    duration: 0.3,
    ease: 'power2.out'
  }, 0);
  
  tl.to(el, {
    y: 0,
    scale: 1,
    duration: 0.5,
    ease: bounceEase
  }, 0.3);
};

const applyShakeEffect = (
  tl: gsap.core.Timeline, 
  el: HTMLElement, 
  effectStyle: EffectStyle, 
  wordIndex: number
) => {
  // Default shake parameters
  const intensity = effectStyle?.intensity || 5;
  const iterations = effectStyle?.iterations || 5;
  
  // Set initial state with no transform to ensure clean start
  gsap.set(el, { 
    transformOrigin: 'center center',
    x: 0,
    y: 0,
    rotation: 0
  });
  
  // Create more pronounced shake animation
  for (let i = 0; i < iterations; i++) {
    // Random x position
    tl.to(el, {
      x: Math.random() > 0.5 ? intensity : -intensity,
      y: Math.random() > 0.5 ? intensity/2 : -intensity/2,
      rotation: Math.random() > 0.5 ? 2 : -2,
      duration: 0.1,
      ease: 'power1.inOut'
    }, 0.1 * i);
  }
  
  // Return to original position
  tl.to(el, {
    x: 0,
    y: 0,
    rotation: 0,
    duration: 0.2,
    ease: 'power2.out'
  }, 0.1 * iterations);
};

const applySqueezeEffect = (
  tl: gsap.core.Timeline, 
  el: HTMLElement, 
  params: EffectStyle, 
  index: number
) => {
  const scaleX = params?.scaleX || 0.7;
  const scaleY = params?.scaleY || 1.3;
  
  tl.to(el, {
    scaleX: scaleX,
    scaleY: scaleY,
    duration: 0.3,
    ease: 'power2.out'
  }, index * 0.1);
  
  tl.to(el, {
    scaleX: 1,
    scaleY: 1,
    duration: 0.5,
    ease: 'elastic.out(1, 0.3)'
  }, index * 0.1 + 0.3);
};

const runAnimation = () => {
  // Check if any other instance is animating
  if (activeInstances.size > 0 && !activeInstances.has(props.instanceId)) {
    console.log('TextAnimation: Another instance is animating, skipping', {
      timestamp: new Date().toISOString(),
      instanceId: props.instanceId,
      activeInstances: Array.from(activeInstances)
    });
    return;
  }

  // If already animating, don't start again
  if (isAnimating.value) {
    console.log('TextAnimation: Animation already in progress, skipping', {
      timestamp: new Date().toISOString(),
      instanceId: props.instanceId
    });
    return;
  }

  // Add this instance to active instances
  activeInstances.add(props.instanceId);
  
  // Set animation lock
  isAnimating.value = true;
  console.log('TextAnimation: Animation lock set', {
    timestamp: new Date().toISOString(),
    isAnimating: isAnimating.value,
    instanceId: props.instanceId,
    activeInstances: Array.from(activeInstances)
  });
  
  // Emit that animation is starting
  emit('animation-start');
  console.log('TextAnimation: Starting animation', {
    animation: props.animation,
    delay: props.delay,
    duration: props.duration,
    timestamp: new Date().toISOString()
  });
  
  if (!containerRef.value) {
    console.warn('TextAnimation: Container ref is not available');
    isAnimating.value = false; // Release lock if error
    return;
  }

  // Add initial delay before starting any animation
  setTimeout(() => {
    nextTick().then(() => {
      if (containerRef.value) {
        // Add animated class to make it visible if initially hidden
        if (props.initiallyHidden) {
          containerRef.value.classList.add('animated');
          console.log('TextAnimation: Added animated class', {
            timestamp: new Date().toISOString()
          });
        }
        
        // Create an array of all elements that should be animated
        const elements = [
          firstPartRef.value,
          secondPartRef.value,
          suffixRef.value
        ].filter(Boolean) as HTMLElement[];
        
        console.log('TextAnimation: Found elements', {
          count: elements.length,
          elements: elements.map(el => el.textContent),
          timestamp: new Date().toISOString()
        });
        
        // Create a timeline for the animation
        const tl = gsap.timeline({
          defaults: {
            ease: props.ease,
            duration: props.duration
          },
          onStart: () => console.log('TextAnimation: Timeline started', {
            timestamp: new Date().toISOString(),
            delay: props.delay,
            duration: props.duration,
            isAnimating: isAnimating.value,
            instanceId: props.instanceId
          }),
          onComplete: () => {
            console.log('TextAnimation: Timeline completed', {
              timestamp: new Date().toISOString(),
              totalDuration: props.duration,
              isAnimating: isAnimating.value,
              instanceId: props.instanceId
            });
            
            // If word effects are enabled, start them after the delay
            if (props.wordEffects) {
              setTimeout(() => {
                console.log('TextAnimation: Starting word effects', {
                  timestamp: new Date().toISOString(),
                  delay: props.wordEffectDelay,
                  duration: props.wordEffectDuration,
                  isAnimating: isAnimating.value,
                  instanceId: props.instanceId
                });
                applyWordEffects();
              }, props.wordEffectDelay * 1000);
            } else {
              // Release animation lock after completion
              isAnimating.value = false;
              activeInstances.delete(props.instanceId);
              console.log('TextAnimation: Animation lock released', {
                timestamp: new Date().toISOString(),
                isAnimating: isAnimating.value,
                instanceId: props.instanceId,
                activeInstances: Array.from(activeInstances)
              });
              emit('animation-complete');
            }
          }
        });
        
        // Apply animation with options
        console.log('TextAnimation: Applying animation', {
          animation: props.animation,
          options: {
            duration: props.duration,
            ease: props.ease
          },
          timestamp: new Date().toISOString(),
          isAnimating: isAnimating.value
        });
        textAnimations.applyAnimation(props.animation as TextAnimationType, elements, {
          duration: props.duration,
          ease: props.ease
        });
        
        hasAnimated.value = true;
      } else {
        console.warn('TextAnimation: No container found to animate');
        isAnimating.value = false; // Release lock if error
      }
    });
  }, props.delay * 1000); // Convert seconds to milliseconds
};

const setupObserver = () => {
  // Clean up any existing observer
  if (observer) {
    observer.disconnect();
  }

  // Add debounce timer
  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 300; // 300ms debounce
  
  // Create new observer
  observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    
    // Clear any existing debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set new debounce timer
    debounceTimer = window.setTimeout(() => {
      if (entry.isIntersecting) {
        console.log('TextAnimation: Element became visible (debounced)', {
          timestamp: new Date().toISOString(),
          hasAnimated: hasAnimated.value,
          restartOnVisible: props.restartOnVisible,
          isAnimating: isAnimating.value
        });
        
        // If element is visible and not currently animating
        if ((!hasAnimated.value || props.restartOnVisible) && !isAnimating.value) {
          runAnimation();
          
          // If we don't want to restart, disconnect after first animation
          if (!props.restartOnVisible) {
            observer?.disconnect();
          }
        }
      } else {
        // Only reset if not currently animating
        if (props.restartOnVisible && !isAnimating.value) {
          hasAnimated.value = false;
          console.log('TextAnimation: Element no longer visible (debounced), reset animation state', {
            timestamp: new Date().toISOString(),
            isAnimating: isAnimating.value
          });
        }
      }
    }, DEBOUNCE_DELAY);
  }, { 
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  if (containerRef.value) {
    observer.observe(containerRef.value);
    console.log('TextAnimation: Observer set up with debounce and animation lock', {
      timestamp: new Date().toISOString(),
      threshold: 0.1,
      debounceDelay: DEBOUNCE_DELAY
    });
  }
};

onMounted(() => {
  // Set data-text attribute for gradient outline text
  if (props.animation === 'outlineToFill' && secondPartRef.value) {
    secondPartRef.value.setAttribute('data-text', secondPartRef.value.textContent || '');
  }
  
  // Store original text content for reset purposes
  if (firstPartRef.value) {
    firstPartRef.value.setAttribute('data-original-text', props.firstPart);
  }
  if (secondPartRef.value) {
    secondPartRef.value.setAttribute('data-original-text', props.secondPart);
  }
  if (suffixRef.value) {
    suffixRef.value.setAttribute('data-original-text', props.suffix);
  }
  
  if (props.triggerOnVisible) {
    setupObserver();
  } else {
    // Trigger animation immediately
    runAnimation();
  }
});

// Clean up observer on component unmount
onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  if (isAnimating.value) {
    isAnimating.value = false;
    activeInstances.delete(props.instanceId);
    console.log('TextAnimation: Cleanup on unmount', {
      timestamp: new Date().toISOString(),
      instanceId: props.instanceId,
      activeInstances: Array.from(activeInstances)
    });
  }
});

// Watch for resetKey changes to restart animation
watch(() => props.resetKey, runAnimation);
</script>

<style scoped>
.animated-text-container {
  min-height: 100px;
  overflow: visible;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* line-height: .9; */
}

.initially-hidden {
  opacity: 0;
  visibility: hidden;
  
  &.animated {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.3s ease;
  }
}

.word-effect {
  display: inline-block;
  position: relative;
  transform-origin: center bottom;
  white-space: nowrap; /* Prevent words from breaking */
  will-change: transform; /* Optimize for animations */
}

.word-highlight {
  background-clip: text;
  -webkit-background-clip: text;
  transition: background-image 0.5s ease;
}

.word-bounce, .word-shake {
  display: inline-block;
  position: relative;
}



.gradient-theme-cool {
  --party-color-1: #00FFFF;  /* Cyan */
  --party-color-2: #FF1493;  /* Deep Pink */
  --party-color-3: #00FF00;  /* Lime */
  background-image: linear-gradient(90deg,
    var(--theme-primary),
    var(--party-color-1),
    var(--party-color-2),
    var(--party-color-3),
    var(--theme-secondary)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-size: 300% auto;
  animation: party-gradient 3s ease-in-out infinite;
}

@keyframes fire-gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes party-gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
