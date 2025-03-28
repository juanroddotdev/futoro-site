<template>
  <div 
    ref="containerRef" 
    class="chat-container" 
    :id="sectionId"
    :style="containerStyle"
  >
    <div ref="messagesRef" class="messages-container">

      <!-- Messages -->
      <template v-for="(message, idx) in messages" :key="`message-${idx}`">
        <div :class="`message-group message-group-${idx + 1}`">
          <ThoughtBubble
            :class="['message-bubble', message.type]"
            class="wavy-filter"
            :showBackgroundBubble="true"
            :backgroundOpacity="0.3"
            :backgroundOffsetX="2"
            :backgroundOffsetY="6"
            :backgroundRotate="-2"
            :fillColor="getThoughtBubbleColor(message.type)"
            :strokeColor="getThoughtBubbleStrokeColor(message.type)"
            :rotate="message.rotate || 0"
            :contentPadding="message.contentPadding || '20px 30px 20px 20px'"
            :isSent="message.type === 'sent'"
          >
            <div class="message-content-bubble">
              {{ message.text }}
            </div>
          </ThoughtBubble>
        </div>
      </template>
    </div>
  </div>
  <div class="svg-filters">
    <svg xmlns="http://www.w3.org/2000/svg">
      <filter id="wavy-border">
        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ThoughtBubble from '@/components/ui/ThoughtBubble.vue';

gsap.registerPlugin(ScrollTrigger);

// Add computed property for tilt style
const tiltStyle = computed(() => {
  return {
    transform: `perspective(1000px) rotateX(${props.tiltX}deg) rotateY(${props.tiltY}deg)`,
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.3s ease'
  };
});

// Add computed property for theme variables
const themeVariables = computed(() => {
  // Default theme colors
  const themes = {
    'neon-horizon': { accent: '#A3BE8C', secondary: '#1a1b26' },
    'digital-sunset': { accent: '#B48EAD', secondary: '#2E3440' },
    'retro-wave': { accent: '#FF4081', secondary: '#0f0f17' },
    'pastel-future': { accent: '#98FB98', secondary: '#f8f9fa' },
    // New themes
    'cyber-bloom': { accent: '#64FFDA', secondary: '#1A1A2E' },
    'quantum-leap': { accent: '#A0E7E5', secondary: '#222F3E' },
    'pixel-nebula': { accent: '#9FA8DA', secondary: '#121212' },
    'circuit-dusk': { accent: '#AED581', secondary: '#263238' },
    'professional-edge': { accent: '#88C0D0', secondary: '#2E3440' }
  };
  
  // Get current theme from props or use default
  const currentTheme = props.theme || 'neon-horizon';
  // Use type assertion with a type guard to ensure currentTheme is a valid key
  const themeColors = themes[currentTheme as keyof typeof themes] || themes['neon-horizon'];
  
  return {
    '--theme-accent': themeColors.accent,
    '--theme-secondary': themeColors.secondary
  };
});

// Add theme variables to container style
const containerStyle = computed(() => {
  return {
    ...themeVariables.value,
    ...tiltStyle.value
    // Add any other existing styles here
  };
});

// Track the current visible message index
const currentMessageIndex = ref(0);
const getCurrentVisibleMessageIndex = () => currentMessageIndex.value;

// Helper functions for styling based on component type
const shouldShowBackgroundBubble = (idx: number) => {
  return true;
};

const getMessageFillColor = (type: string, idx: number) => {
  return getThoughtBubbleColor(type);
};

const getMessageStrokeColor = (type: string, idx: number) => {
  return getThoughtBubbleStrokeColor(type);
};

// Existing color functions
const getThoughtBubbleColor = (type: string) => {
  return type === 'sent' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(129, 199, 132, 0.2)';
};

const getThoughtBubbleStrokeColor = (type: string) => {
  return type === 'sent' ? '#90CAF9' : '#81C784';
};

// Helper function to handle dimension values
const getBubbleDimension = (value: string | number | undefined): number | string => {
  if (value === undefined || value === 'auto') {
    // Instead of 100%, use a fixed width that's proportional to content
    return 'auto'; // Let the ThoughtBubble component determine the appropriate size
  }
  return value;
};
// Alternative helper function if numeric values are required
// const getBubbleDimension = (value: string | number | undefined): number => {
//   if (value === undefined || value === 'auto') {
//     return 200; // Default width/height in pixels
//   }
//   if (typeof value === 'string') {
//     // Try to parse numeric values from strings like "200px" or "20rem"
//     const numericValue = parseFloat(value);
//     return isNaN(numericValue) ? 200 : numericValue;
//   }
//   return value;
// };

interface Message {
  text: string;
  type: string;
  isThought?: boolean;
  bubbleWidth?: string | number;
  bubbleHeight?: string | number;
  rotate?: number;
  contentPadding?: string;
}

interface Props {
  messages: Message[];
  sectionId: string;
  pinSettings?: {
    enabled?: boolean;
    start?: string;
    end?: string;
    pinSpacing?: boolean;
    anticipatePin?: number;
  };
  tiltX?: number;
  tiltY?: number;
  messageAnimationConfig?: {
    verticalOffset?: number;
    duration?: number;
    staggerAmount?: number;
  };
  theme?: string;
  animationStyle?: 'stack' | 'slide-stack' | 'fall-stack';
  slideEasing?: string;
}

const props = withDefaults(defineProps<Props>(), {
  pinSettings: () => ({
    enabled: true,
    start: 'top top',
    pinSpacing: true,
    anticipatePin: 1
  }),
  tiltX: 0,
  tiltY: 0,
  messageAnimationConfig: () => ({
    verticalOffset: 100,
    duration: 0.5,
    staggerAmount: 0.1
  }),
  theme: 'neon-horizon', // Default theme
  animationStyle: 'stack',
  slideEasing: 'power2.out'
});

const containerRef = ref<HTMLElement | null>(null);
const messagesRef = ref<HTMLElement | null>(null);
let timeline: gsap.core.Timeline;

// Reset all message states
const resetState = () => {
  if (!messagesRef.value) return;
  
  // Reset all message groups
  const messageGroups = messagesRef.value.querySelectorAll('.message-group');
  gsap.set(messageGroups, { opacity: 0, y: 0 });
};

const createStackAnimation = (container: HTMLElement) => {
  // Original stacking animation
  const sectionSelector = `#${props.sectionId}`;
  const {
    verticalOffset,
    duration,
    staggerAmount
  } = props.messageAnimationConfig;

  props.messages.forEach((_, idx) => {
    const currentGroup = `${sectionSelector} .message-group-${idx + 1}`;
    
    if (idx > 0) {
      const previousGroups = props.messages
        .slice(0, idx)
        .map((_, i) => `${sectionSelector} .message-group-${i + 1}`);
      
      timeline.to(previousGroups, {
        y: `-=${verticalOffset}`,
        duration: duration,
        ease: "power2.out"
      });
    }

    timeline.to(currentGroup, { 
      opacity: 1,
      duration: 0.2,
      ease: "power1.out"
    });
  });
};

const createSlideStackAnimation = (container: HTMLElement) => {
  const sectionSelector = `#${props.sectionId}`;
  const {
    verticalOffset,
    duration,
    staggerAmount
  } = props.messageAnimationConfig;

  props.messages.forEach((message, idx) => {
    const currentGroup = `${sectionSelector} .message-group-${idx + 1}`;
    
    const isReceived = message.type !== 'sent';
    const slideDirection = isReceived ? -150 : 150;
    
    gsap.set(currentGroup, {
      opacity: 0,
      x: slideDirection,
      y: 50
    });

    if (idx > 0) {
      const previousGroups = props.messages
        .slice(0, idx)
        .map((_, i) => `${sectionSelector} .message-group-${i + 1}`);
      
      timeline.to(previousGroups, {
        y: `-=${verticalOffset}`,
        duration: 0.8,
        ease: "power3.out",
        stagger: {
          amount: 0.2,
          ease: "power2.inOut"
        }
      });
    }

    timeline.to(currentGroup, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "back.out(1.4)",
      stagger: {
        amount: 0.1,
        from: "start"
      }
    });
  });
};

const createFallStackAnimation = (container: HTMLElement) => {
  const sectionSelector = `#${props.sectionId}`;
  const {
    verticalOffset,
    duration,
    staggerAmount
  } = props.messageAnimationConfig;

  props.messages.forEach((message, idx) => {
    const currentGroup = `${sectionSelector} .message-group-${idx + 1}`;
    
    // Set initial state - larger and above final position
    gsap.set(currentGroup, {
      opacity: 0,
      scale: 1.5,
      y: -100,
      transformOrigin: message.type === 'sent' ? 'right center' : 'left center'
    });

    if (idx > 0) {
      const previousGroups = props.messages
        .slice(0, idx)
        .map((_, i) => `${sectionSelector} .message-group-${i + 1}`);
      
      // Move previous messages up
      timeline.to(previousGroups, {
        y: `-=${verticalOffset}`,
        duration: 0.8,
        ease: "power3.out",
        stagger: {
          amount: 0.2,
          ease: "power2.inOut"
        }
      });
    }

    // Animate current message falling into place
    timeline.to(currentGroup, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1,
      ease: "bounce.out", // Add bounce when landing
      stagger: {
        amount: 0.1,
        from: "start"
      }
    });
  });
};

onMounted(() => {
  const container = containerRef.value;
  if (!container) return;

  resetState();

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: props.pinSettings.start,
      end: props.pinSettings.end || `+=${props.messages.length * 50}%`,
      scrub: 0.5,
      pin: props.pinSettings.enabled,
      pinSpacing: props.pinSettings.enabled ? props.pinSettings.pinSpacing : false,
      anticipatePin: props.pinSettings.enabled ? props.pinSettings.anticipatePin : 0,
      onEnter: resetState,
      onEnterBack: resetState,
      onUpdate: (self) => {
        const progress = self.progress;
        const messageCount = props.messages.length;
        currentMessageIndex.value = Math.min(
          Math.floor(progress * messageCount),
          messageCount - 1
        );
      }
    }
  });

  // Choose animation based on style prop
  if (props.animationStyle === 'slide-stack') {
    createSlideStackAnimation(container);
  } else if (props.animationStyle === 'fall-stack') {
    createFallStackAnimation(container);
  } else {
    createStackAnimation(container);
  }
});

onUnmounted(() => {
  if (timeline) {
    timeline.kill();
  }
});
</script>

<style lang="scss" scoped>
.chat-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  overflow: visible;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  overflow: visible;
  position: relative;
  clip-path: inset(0 -100% -100% -100%);
}

.message-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.message-bubble {
  max-width: 80%;
  align-self: flex-start;
  
  &.sent {
    align-self: flex-end;
  }
}
.message-content-bubble {
  color: white;
}

// Add any additional styling you need
</style>
