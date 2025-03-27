<template>
  <div 
    ref="containerRef" 
    class="chat-container" 
    :id="sectionId"
    :style="tiltStyle"
  >
    <div ref="messagesRef" class="messages-container">
      <!-- Typing indicators -->
      <template v-for="(message, idx) in messages" :key="`typing-${idx}`">
        <div 
          v-if="showTypingFor.includes(idx)"
          :class="`typing-container typing-container-${idx + 1}`"
        >
          <ChatTypingIndicator 
            :class="`typing-indicator-${idx + 1}`"
            :is-sent="message.type === 'sent'"
          />
        </div>
      </template>

      <!-- Messages -->
      <template v-for="(message, idx) in messages" :key="`message-${idx}`">
        <div :class="`message-group message-group-${idx + 1}`">
          <div 
            :class="[
              'message', 
              message.type, 
              props.handDrawnStyle ? 'hand-drawn' : '',
              props.handDrawnStyle && message.isThought ? 'thought' : ''
            ]"
          >
            <div class="message-content">
              {{ message.text }}
            </div>
          </div>
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

gsap.registerPlugin(ScrollTrigger);

// Add computed property for tilt style
const tiltStyle = computed(() => {
  return {
    transform: `perspective(1000px) rotateX(${props.tiltX}deg) rotateY(${props.tiltY}deg)`,
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.3s ease'
  };
});

interface Message {
  text: string;
  type: string;
  isThought?: boolean; // Optional property to indicate thought bubbles
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
    scaleDecrement: 0.05,
    opacityDecrement: 0.2,
    verticalOffset: 100,
    duration: 0.3,
    staggerAmount: 0.1,
    minScale: 0.7,
    minOpacity: 0.2
  }),
  handDrawnStyle: false 
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
      start: props.pinSettings.start,
      end: props.pinSettings.end || `+=${props.messages.length * 50}%`,
      scrub: 0.5,
      pin: props.pinSettings.enabled,
      pinSpacing: props.pinSettings.enabled ? props.pinSettings.pinSpacing : false,
      anticipatePin: props.pinSettings.enabled ? props.pinSettings.anticipatePin : 0,
      onEnter: resetState,
      onEnterBack: resetState,
    }
  });

  // Modify selectors to be scoped to this section
  const sectionSelector = `#${props.sectionId}`;
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
  max-width: 400px;
  margin: 0 auto;
  border-radius: 12px;
  // box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transform-origin: center center;
  height: 600px;
  // height: 800px;
  min-height: 500px;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.messages-container {
  flex: 1;
  padding: 20px;
  position: relative;
  overflow: hidden; /* Hide messages that go beyond the container */
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.message-group {
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  will-change: transform, opacity, scale;
  margin-bottom: 16px;
  z-index: 3;
  transform-origin: bottom center; /* Scale from bottom center */
}

.typing-container {
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 20px;
  opacity: 0;
  z-index: 3; /* Ensure typing indicators are visible */
}

.message {
  max-width: 80%;
  padding-bottom: 8px;
  
  &.sent {
    margin-left: auto;
    margin-right: 0;
  }
  
  &.received {
    margin-right: auto;
    margin-left: 0;
  }
  
  &-content {
    padding: 12px 16px;
    border-radius: 20px;
    font-size: 16px;
    line-height: 1.4;
  }
}

// .sent .message-content {
//   background: linear-gradient(135deg, #007aff, #0063cc);
//   color: white;
//   border-bottom-right-radius: 4px;
// }

// .received .message-content {
//   background: #e5e5ea;
//   color: #000;
//   border-bottom-left-radius: 4px;
// }

// .message-input-container {
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   right: 0;
//   padding: 10px 20px;
//   background: rgba(245, 245, 245, 0.9);
//   backdrop-filter: blur(10px);
// }

// .input-wrapper {
//   background: white;
//   border-radius: 20px;
//   padding: 8px 15px;
// }

// .message-input {
//   font-size: 16px;
//   line-height: 1.4;
// }

// .placeholder {
//   color: #8e8e93;
// }

/* Hand-drawn thought bubble styles with 3D effect */
.message {
  &.hand-drawn {
    position: relative;
    
    .message-content {
      background-color: transparent !important; /* Force override with !important */
      background-image: none !important; /* Remove any gradient backgrounds */
      border: 2px solid white;
      border-radius: 30px 30px 30px 5px;
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
      position: relative;
      color: white !important; /* Force text color override */
      
      /* Wavy border effect */
      filter: url('#wavy-border');
      z-index: 2; /* Ensure content is above the 3D layer */
      
      /* 3D effect with ::after pseudo-element */
      &::after {
        content: '';
        position: absolute;
        top: 4px;
        left: 4px;
        width: 100%;
        height: 100%;
        background-color: transparent;
        border: 2px solid #fff;
        border-radius: 30px 30px 30px 5px;
        z-index: -1;
        filter: url('#wavy-border');
      }
      
      /* Speech bubble tail */
      &::before {
        content: '';
        position: absolute;
        bottom: -18px;
        left: 10px;
        width: 20px;
        height: 10px;
        background-color: transparent;
        border-right: 2px solid #fff;
        border-bottom: 2px solid #fff;
        border-radius: 0 0 20px 0;
        transform: rotate(10deg);
        z-index: 1;
      }
    }
    
    /* Sent messages (right side) */
    &.sent {
      .message-content {
        border-radius: 30px 30px 5px 30px;
        background-color: transparent !important;
        
        /* 3D effect for sent messages */
        &::after {
          border-radius: 30px 30px 5px 30px;
        }
        
        /* Speech bubble tail for sent messages */
        &::before {
          left: auto;
          right: 18px;
          border-left: 2px solid #fff;
          border-right: none;
          border-radius: 0 0 0 20px;
          transform: rotate(-10deg);
        }
      }
      
      /* Thought bubble modifications */
      &.thought {
        .message-content {
          border-radius: 30px;
          
          /* 3D effect for thought bubbles */
          &::after {
            border-radius: 30px;
          }
          
          /* Remove speech bubble tail for thought bubbles */
          &::before {
            display: none;
          }
        }
        
        /* Add thought bubble indicators */
        &::after, &::before {
          content: '';
          position: absolute;
          background-color: transparent;
          border: 2px solid #fff;
          border-radius: 50%;
          z-index: 1;
        }
        
        &::after {
          width: 12px;
          height: 12px;
          bottom: -15px;
          right: 15px;
        }
        
        &::before {
          width: 8px;
          height: 8px;
          bottom: -25px;
          right: 5px;
        }
      }
    }
    
    /* Different colors for received messages */
    &.received {
      .message-content {
        background-color: transparent !important;
        
        &::after {
          background-color: transparent;
        }
      }
      
      /* Thought bubble for received messages */
      &.thought {
        .message-content {
          border-radius: 30px;
          
          &::after {
            border-radius: 30px;
          }
          
          &::before {
            display: none;
          }
        }
        
        &::after, &::before {
          content: '';
          position: absolute;
          background-color: transparent;
          border: 2px solid #fff;
          border-radius: 50%;
        }
        
        &::after {
          width: 12px;
          height: 12px;
          bottom: -15px;
          left: 15px;
        }
        
        &::before {
          width: 8px;
          height: 8px;
          bottom: -25px;
          left: 5px;
        }
      }
    }
  }
}

/* Add SVG filter for wavy borders */
.svg-filters {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
