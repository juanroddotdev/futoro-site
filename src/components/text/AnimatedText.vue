<template>
  <div 
    ref="containerRef" 
    :class="['animated-text-container', { 'initially-hidden': initiallyHidden }]"
  >
    <span v-if="firstPart" ref="firstPartRef" :class="{ 'theme-text--gradient': useGradient }">{{ firstPart }}</span>
    <span v-if="secondPart" ref="secondPartRef" :class="{ 'theme-text--gradient': useGradient }">{{ secondPart }}</span>
    <span v-if="suffix" ref="suffixRef" :class="{ 'theme-text--gradient': useGradient }">{{ suffix }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue';
import { textAnimations, type TextAnimationType } from '@/animations/text/textAnimations';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

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
    type: Array,
    default: () => []  // For highlight: gradients, for others: animation parameters
  },
  wordEffectDuration: {
    type: Number,
    default: 2
  },
  wordEffectDelay: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['animation-complete', 'word-effect-complete']);

const containerRef = ref<HTMLElement | null>(null);
const firstPartRef = ref<HTMLElement | null>(null);
const secondPartRef = ref<HTMLElement | null>(null);
const suffixRef = ref<HTMLElement | null>(null);
const hasAnimated = ref(false);
let observer: IntersectionObserver | null = null;

// Function to apply word effects
const applyWordEffects = () => {
  if (!props.wordEffects || !containerRef.value || props.wordTargets.length === 0) {
    emit('animation-complete');
    return;
  }
  
  // Process each element to find and wrap target words
  const elements = [
    firstPartRef.value,
    secondPartRef.value,
    suffixRef.value
  ].filter(Boolean) as HTMLElement[];
  
  elements.forEach((element) => {
    if (!element) return;
    
    const originalText = element.textContent || '';
    let newHTML = originalText;
    
    // Replace each target word with a span
    props.wordTargets.forEach((word, wordIndex) => {
      if (typeof word !== 'string' || !originalText.includes(word)) return;
      
      const effectType = props.wordEffectTypes[wordIndex] || 'highlight';
      const wordClass = `word-effect word-${effectType} word-index-${wordIndex}`;
      newHTML = newHTML.replace(
        new RegExp(`\\b${word}\\b`, 'g'), // Use word boundary for exact match
        `<span class="${wordClass}">${word}</span>`
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
  
  console.log('Found word elements:', wordElements.length); // Debug log
  
  // Create animation timeline with the effect delay
  const tl = gsap.timeline({
    delay: props.wordEffectDelay,
    onComplete: () => {
      console.log('Word effects complete'); // Debug log
      emit('word-effect-complete');
    }
  });
  
  // Apply effects based on their type
  Array.from(wordElements).forEach((el, index) => {
    const classList = Array.from(el.classList);
    let effectType = 'highlight'; // Default
    let wordIndex = index;
    
    // Find the effect type from class
    const effectClass = classList.find(cls => 
      cls.startsWith('word-') && 
      cls !== 'word-effect' && 
      !cls.startsWith('word-index-')
    );
    
    if (effectClass) {
      effectType = effectClass.replace('word-', '');
    }
    
    // Get the word index from class
    const indexClass = classList.find(cls => cls.startsWith('word-index-'));
    if (indexClass) {
      wordIndex = parseInt(indexClass.replace('word-index-', ''));
    }
    
    const effectStyle = props.wordEffectStyles[wordIndex] || {};
    
    console.log(`Applying ${effectType} effect to word ${wordIndex}`); // Debug log
    
    // Apply the appropriate effect
    switch (effectType) {
      case 'highlight':
        applyHighlightEffect(tl, el, effectStyle, wordIndex);
        break;
      case 'bounce':
        applyBounceEffect(tl, el, effectStyle, wordIndex);
        break;
      case 'shake':
        applyShakeEffect(tl, el, effectStyle, wordIndex);
        break;
      case 'squeeze':
        applySqueezeEffect(tl, el, effectStyle, wordIndex);
        break;
      default:
        console.log(`Unknown effect type: ${effectType}`); // Debug log
    }
  });
  
  // Final animation to complete the sequence
  tl.call(() => emit('animation-complete'));
};

// Individual effect functions
const applyHighlightEffect = (tl, el, gradient, index) => {
  const defaultGradient = 'linear-gradient(90deg, #64B5F6, #81C784, #4ECDC4, #7000FF)';
  const effectGradient = gradient || defaultGradient;
  
  tl.to(el, {
    backgroundImage: effectGradient,
    backgroundSize: '200% auto',
    backgroundClip: 'text',
    webkitBackgroundClip: 'text',
    color: 'transparent',
    duration: 0.5,
    ease: 'power2.inOut'
  }, 0);
  
  // Animate gradient position
  tl.to(el, {
    backgroundPosition: '100% center',
    duration: props.wordEffectDuration,
    ease: 'none'
  }, 0.5);
  
  // Return to original styling
  tl.to(el, {
    backgroundImage: '',
    color: '',
    duration: 0.5,
    ease: 'power2.inOut'
  }, props.wordEffectDuration + 0.5);
};

const applyBounceEffect = (tl, el, params, index) => {
  // Default bounce parameters
  const bounceHeight = params?.height || 20;
  const bounceEase = params?.ease || 'elastic.out(1, 0.3)';
  
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

const applyShakeEffect = (tl, el, params, index) => {
  // Default shake parameters
  const intensity = params?.intensity || 5;
  const iterations = params?.iterations || 5;
  
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

const applySqueezeEffect = (tl, el, params, index) => {
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

const runAnimation = async () => {
  if (!containerRef.value) return;
  
  await nextTick();
  
  if (containerRef.value) {
    // Add animated class to make it visible if initially hidden
    if (props.initiallyHidden) {
      containerRef.value.classList.add('animated');
    }
    
    // Create an array of all elements that should be animated
    const elements = [
      firstPartRef.value,
      secondPartRef.value,
      suffixRef.value
    ].filter(Boolean) as HTMLElement[];
    
    // Store original text for each element
    elements.forEach(el => {
      if (el && !el.getAttribute('data-original-text')) {
        el.setAttribute('data-original-text', el.textContent || '');
      }
    });
    
    // Kill any existing animations
    elements.forEach(el => {
      if (el) gsap.killTweensOf(el);
    });
    
    // Create a timeline for the animation
    const tl = gsap.timeline({
      defaults: {
        ease: props.ease,
        duration: props.duration
      },
      delay: props.delay,
      onComplete: () => {
        // If word effects are enabled, do that next
        if (props.wordEffects) {
          setTimeout(() => {
            applyWordEffects();
          }, 100); // Small delay to ensure DOM is ready
        } else {
          // Otherwise, just emit completion
          emit('animation-complete');
        }
      }
    });
    
    // Apply animation with options
    textAnimations.applyAnimation(props.animation as TextAnimationType, elements, {
      duration: props.duration,
      delay: props.delay,
      ease: props.ease
    });
    
    hasAnimated.value = true;
  }
};

const setupObserver = () => {
  // Clean up any existing observer
  if (observer) {
    observer.disconnect();
  }
  
  // Create new observer
  observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    
    if (entry.isIntersecting) {
      // If element is visible
      if (!hasAnimated.value || props.restartOnVisible) {
        runAnimation();
        
        // If we don't want to restart, disconnect after first animation
        if (!props.restartOnVisible) {
          observer?.disconnect();
        }
      }
    } else {
      // Element is not visible, reset hasAnimated if restartOnVisible is true
      if (props.restartOnVisible) {
        hasAnimated.value = false;
      }
    }
  }, { threshold: 0.2 }); // Trigger when 20% visible
  
  if (containerRef.value) {
    observer.observe(containerRef.value);
  }
};

onMounted(() => {
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
</style>
