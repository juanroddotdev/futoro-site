<template>
  <div 
    ref="containerRef" 
    class="chat-container" 
    :id="sectionId"
    :style="containerStyle"
  >
    <div ref="messagesRef" class="messages-container">
      <!-- Typing indicators -->
      <!-- <template v-for="(message, idx) in messages" :key="`typing-${idx}`">
        <div 
          v-if="showTypingFor.includes(idx)"
          :class="`typing-container typing-container-${idx + 1}`"
        >
          <ChatTypingIndicator 
            :class="`typing-indicator-${idx + 1}`"
            :is-sent="message.type === 'sent'"
          />
        </div>
      </template> -->

      <!-- Messages -->
      <template v-for="(message, idx) in messages" :key="`message-${idx}`">
        <div :class="`message-group message-group-${idx + 1}`">
          <!-- Transition between geometric and thought bubble -->
          <component 
            :is="getMessageComponent(idx)"
            :class="['message-bubble', message.type]"
            class="wavy-filter"
            :showBackgroundBubble="shouldShowBackgroundBubble(idx)"
            :backgroundOpacity="0.3"
            :backgroundOffsetX="2"
            :backgroundOffsetY="6"
            :backgroundRotate="-2"
            :fillColor="getMessageFillColor(message.type, idx)"
            :strokeColor="getMessageStrokeColor(message.type, idx)"
            :rotate="message.rotate || 0"
            :contentPadding="message.contentPadding || '20px 30px 20px 20px'"
            :isSent="message.type === 'sent'"
          >
            <div class="message-content-bubble">
              {{ message.text }}
            </div>
          </component>
          
          
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
import ChatTypingIndicator from '@/components/chat/ChatTypingIndicator.vue';
import ThoughtBubble from '@/components/ui/ThoughtBubble.vue';
import GeometricMessageBox from '@/components/ui/GeometricMessageBox.vue';

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
  if (props.animationStyle === 'stack') {
    return {
      ...themeVariables.value
      // No tilt for stack animation
    };
  }
  
  return {
    ...themeVariables.value,
    ...tiltStyle.value
  };
});

// Determine which component to use based on message index and current state
const getMessageComponent = (idx: number) => {
  // Get the current visible message index
  // const currentVisibleIdx = getCurrentVisibleMessageIndex();
  
  // // Use geometric for new messages and first two messages
  // if (idx >= currentVisibleIdx - 2) {
  //   return GeometricMessageBox;
  // }
  
  // Use thought bubble for older messages
  return ThoughtBubble;
};

// Track the current visible message index
const currentMessageIndex = ref(0);
const getCurrentVisibleMessageIndex = () => currentMessageIndex.value;

// Helper functions for styling based on component type
const shouldShowBackgroundBubble = (idx: number) => {
  return getMessageComponent(idx) === ThoughtBubble;
};

const getMessageFillColor = (type: string, idx: number) => {
  const isThoughtBubble = getMessageComponent(idx) === ThoughtBubble;
  
  if (isThoughtBubble) {
    return getThoughtBubbleColor(type);
  }
  
  // For geometric message box, use a more solid but still semi-transparent fill
  return 'rgba(255, 255, 255, 0.05)';
};

const getMessageStrokeColor = (type: string, idx: number) => {
  const isThoughtBubble = getMessageComponent(idx) === ThoughtBubble;
  
  if (isThoughtBubble) {
    return getThoughtBubbleStrokeColor(type);
  }
  
  // For geometric, we'll use the gradient defined in the component
  return '';
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
  showTypingFor: number[];
  pinSettings?: {
    enabled?: boolean;
    start?: string;
    end?: string;
    pinSpacing?: boolean;
    anticipatePin?: number;
  };
  tiltX?: number;
  tiltY?: number;
  // New animation control props
  messageAnimationConfig?: {
    scaleDecrement?: number;     // How much to reduce scale per message (default: 0.05)
    opacityDecrement?: number;   // How much to reduce opacity per message (default: 0.2)
    verticalOffset?: number;     // Vertical offset for previous messages (default: 100)
    duration?: number;           // Animation duration (default: 0.3)
    staggerAmount?: number;      // Stagger amount for animations (default: 0.1)
    minScale?: number;           // Minimum scale for oldest messages (default: 0.7)
    minOpacity?: number;         // Minimum opacity for oldest messages (default: 0.2)
  };
  handDrawnStyle?: boolean;
  theme?: string; // New prop for theme selection
  animationStyle?: 'default' | 'stack'; // Animation style option
  slideDistance?: number; // Distance for slide animation
  slideEasing?: 'power1.out' | 'power2.out' | 'power3.out' | 'back.out' | 'elastic.out' | 'bounce.out'; // Easing options
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
    scaleDecrement: .05,
    opacityDecrement: 0.1,
    verticalOffset: 100,
    duration: 0.5,
    staggerAmount: 0.1,
    minScale: 0.4,
    minOpacity: 0.2
  }),
  handDrawnStyle: false,
  theme: 'neon-horizon', // Default theme
  animationStyle: 'default',
  slideDistance: 100, // Default slide distance in pixels
  slideEasing: 'power2.out' // Changed from power3.out to power2.out for smoother effect
});

const containerRef = ref<HTMLElement | null>(null);
const messagesRef = ref<HTMLElement | null>(null);
let timeline: gsap.core.Timeline;

// Modify the resetState function
const resetState = () => {
  if (!messagesRef.value) return;
  
  // Reset all message groups with a starting position below
  const messageGroups = messagesRef.value.querySelectorAll('.message-group');
  gsap.set(messageGroups, { 
    opacity: 0, 
    y: 100 // Start below instead of at 0
  });
  
  // Reset all typing indicators
  const typingContainers = messagesRef.value.querySelectorAll('.typing-container');
  gsap.set(typingContainers, { opacity: 0 });
};

onMounted(() => {
  const container = containerRef.value;
  if (!container) return;

  // Initial reset
  resetState();

  // Create timeline with ScrollTrigger
  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "center bottom", // Changed from 'top top' to 'center bottom'
      end: props.pinSettings.end || `+=${props.messages.length * 50}%`,
      scrub: 0.5,
      pin: props.pinSettings.enabled,
      pinSpacing: props.pinSettings.enabled ? props.pinSettings.pinSpacing : false,
      anticipatePin: props.pinSettings.enabled ? props.pinSettings.anticipatePin : 0,
      onEnter: resetState,
      onEnterBack: resetState,
      markers: true, // Add this temporarily to debug trigger points
      onUpdate: (self) => {
        // Calculate current message index based on scroll progress
        const progress = self.progress;
        const messageCount = props.messages.length;
        currentMessageIndex.value = Math.min(
          Math.floor(progress * messageCount),
          messageCount - 1
        );
      }
    }
  });

  const sectionSelector = `#${props.sectionId}`;
  
  if (props.animationStyle === 'stack') {
    props.messages.forEach((message, idx) => {
      const currentGroup = `${sectionSelector} .message-group-${idx + 1}`;
      
      // Set initial state for all messages
      gsap.set(currentGroup, {
        opacity: 0,
        y: 100 // Start 100px below
      });

      // Move previous messages up
      if (idx > 0) {
        const previousGroups = props.messages
          .slice(0, idx)
          .map((_, i) => `${sectionSelector} .message-group-${i + 1}`);
        
        timeline.to(previousGroups, {
          y: `-=50`,
          duration: 0.5,
          ease: "power2.out"
        });
      }

      // Fade in and slide up new message
      timeline.to(currentGroup, 
        { 
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: props.slideEasing
        }
      );
    });
  } else {
    // Default animation style (existing code)
    const {
      scaleDecrement,
      opacityDecrement,
      verticalOffset,
      duration,
      staggerAmount,
      minScale,
      minOpacity
    } = props.messageAnimationConfig;

    props.messages.forEach((_, idx) => {
      const currentGroup = `${sectionSelector} .message-group-${idx + 1}`;
      
      if (idx > 0) {
        const previousGroups = props.messages
          .slice(0, idx)
          .map((_, i) => `${sectionSelector} .message-group-${i + 1}`);
        
        // Modified animation for previous groups with configurable values
        timeline.to(previousGroups, {
          y: `-=${verticalOffset}`,
          scale: (i, target) => {
            // Get the actual index from the target element class
            const groupClass = target.className.match(/message-group-(\d+)/);
            const groupIdx = groupClass ? parseInt(groupClass[1]) - 1 : 0;
            // Apply scale based on how old the message is
            const age = idx - groupIdx;
            // Apply scale with minimum limit
            return Math.max(1 - (age * (scaleDecrement ?? 0.05)), minScale ?? 0.7);
          },
          opacity: (i, target) => {
            // Get the actual index from the target element class
            const groupClass = target.className.match(/message-group-(\d+)/);
            const groupIdx = groupClass ? parseInt(groupClass[1]) - 1 : 0;
            // Apply opacity based on how old the message is
            const age = idx - groupIdx;
            // Apply opacity with minimum limit
            return Math.max(1 - (age * (opacityDecrement ?? 0.2)), minOpacity ?? 0.2);
          },
          duration: duration,
          ease: "power2.out",
          stagger: {
            amount: staggerAmount,
            ease: "power1.in"
          }
        });
      }

      if (props.showTypingFor.includes(idx)) {
        const typingContainer = `${sectionSelector} .typing-container-${idx + 1}`;
        
        timeline
          .to(typingContainer, { 
            opacity: 1, 
            duration: 0.15,
            ease: "power1.out"
          })
          .to({}, { duration: 0.3 })
          .to(typingContainer, { 
            opacity: 0, 
            duration: 0.15,
            ease: "power1.in"
          });
      }

      timeline.to(currentGroup, { 
        opacity: 1,
        duration: 0.2,
        ease: "power1.out"
      });
    });
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
  display: flex;
  flex-direction: column;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: visible;
  padding: 20px;
  position: relative;
  min-height: 300px; // Increased minimum height
  margin-bottom: 100px; // Add bottom margin for scroll space
}

.message-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  will-change: transform;
  transform-origin: bottom center; // Add this to ensure animations pivot from bottom
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
</style>
