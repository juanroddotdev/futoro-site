<template>
  <div ref="containerRef" class="container" :id="sectionId" :class="position">
    <div ref="phoneContainerRef">
<<<<<<< Updated upstream
      <FloatingPhone 
        ref="floatingPhoneRef"
        :tilt-x="tiltX"
        :tilt-y="tiltY"
      >
        <div ref="messagesRef" class="messages-container">
          <template v-for="(message, idx) in messages" :key="`typing-${idx}`">
            <div 
              v-if="showTypingFor.includes(idx)"
              :class="`typing-container typing-container-${idx + 1}`"
            >
              <TypingIndicator 
                :class="`typing-indicator-${idx + 1}`"
                :is-sent="message.type === 'sent'"
              />
            </div>
          </template>

          <template v-for="(message, idx) in messages" :key="`message-${idx}`">
            <div 
              :class="`message-group message-group-${idx + 1}`"
            >
              <div 
                class="message"
                :class="[
                  message.type === 'sent'  ? 'sent' : 'received',
=======
      <FloatingPhone ref="floatingPhoneRef" :tilt-x="tiltX" :tilt-y="tiltY">
        <div class="chat-screen">
          <div ref="messagesRef" class="messages-container">
            <template v-for="(message, idx) in messages" :key="`typing-${idx}`">
              <div v-if="showTypingFor.includes(idx)" :class="`typing-container typing-container-${idx + 1}`">
                <TypingIndicator :class="`typing-indicator-${idx + 1}`" :is-sent="message.type === 'sent'" />
              </div>
            </template>

            <template v-for="(message, idx) in messages" :key="`message-${idx}`">
              <div :class="`message-group message-group-${idx + 1}`">
                <div class="message" :class="[
                  message.type === 'sent' ? 'sent' : 'received',
>>>>>>> Stashed changes
                  `message-${idx + 1}`
                ]"
              >
                <div class="message-content">
                  {{ message.text }}
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="message-input-container">
          <div class="input-wrapper">
            <div class="message-input">
              <span class="placeholder"><span class="futoro">futoro</span>Message</span>
            </div>
          </div>
        </div>
      </FloatingPhone>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import TypingIndicator from './TypingIndicator.vue';
import FloatingPhone from './FloatingPhone.vue';
<<<<<<< Updated upstream
=======
import LoadingDots from './LoadingDots.vue';
import { getCurrentTime } from '@/utils/timestamp';
import {
  applyAmbientPullEffect,
  resetAmbientScreen,
  performUnlockAnimation,
  performRippleUnlockAnimation,
  animateDotsUShapeEffect
} from '@/utils/ambientEffects';
>>>>>>> Stashed changes

gsap.registerPlugin(ScrollTrigger);

interface Message {
  text: string;
  type: string;
}

interface Props {
  messages: Message[];
  sectionId: string;
  showTypingFor: number[];
  tiltX?: number;
  tiltY?: number;
  position?: 'left' | 'center' | 'right';
  pinSettings?: {
    enabled?: boolean;
    start?: string;
    end?: string;
    pinSpacing?: boolean;
    anticipatePin?: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  tiltX: 0,
  tiltY: 0,
  position: 'right',
  pinSettings: () => ({
    enabled: true,
    start: 'top top',
    end: 'bottom bottom',
    pinSpacing: true,
    anticipatePin: 1
  })
});

const containerRef = ref<HTMLElement | null>(null);
const floatingPhoneRef = ref<InstanceType<typeof FloatingPhone> | null>(null);
const messagesRef = ref<HTMLElement | null>(null);
const phoneContainerRef = ref<HTMLElement | null>(null);

// First, declare the timeline variable
let timeline: gsap.core.Timeline;

const scrollPosition = ref(0);
const isVisible = ref(false);

// Define setupScrollAnimation function
const setupScrollAnimation = () => {
  const container = containerRef.value;
  if (!container) {
    return;
  }

  // Reset function to set initial state - make sure ALL messages are hidden initially
  const resetState = () => {
    // Hide all messages initially - use more specific selectors
    const sectionSelector = `#${props.sectionId}`;
    
    // Hide all message groups
    gsap.set(`${sectionSelector} .message-group`, { 
      opacity: 0, 
      y: 20,
      force3D: true 
    });
    
    // Hide all typing containers
    gsap.set(`${sectionSelector} .typing-container`, { 
      opacity: 0, 
      y: 20,
      force3D: true 
    });
  };
  
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
      // markers: import.meta.env.DEV, // Add markers in dev mode for debugging
      onEnter: () => {
        // Show first message only when scrolling begins
        if (props.messages.length > 0) {
          const sectionSelector = `#${props.sectionId}`;
          const firstGroup = `${sectionSelector} .message-group-1`;
          gsap.to(firstGroup, { opacity: 1, y: 0, duration: 0.3 });
        }
      },
      onEnterBack: () => {
        resetState();
        // Show first message when scrolling back into view
        if (props.messages.length > 0) {
          const sectionSelector = `#${props.sectionId}`;
          const firstGroup = `${sectionSelector} .message-group-1`;
          gsap.to(firstGroup, { opacity: 1, y: 0, duration: 0.3 });
        }
      },
      immediateRender: true
    }
  });
  
  // Modify selectors to be scoped to this section
  const sectionSelector = `#${props.sectionId}`;
  
  // Don't show first message immediately - wait for scroll to begin

  const MESSAGE_OFFSET = 100;

  props.messages.forEach((_, idx) => {
    const currentGroup = `${sectionSelector} .message-group-${idx + 1}`;
    if (idx > 0) {
      const previousGroups = props.messages
        .slice(0, idx)
        .map((_, i) => `${sectionSelector} .message-group-${i + 1}`);
      
      timeline.to(previousGroups, {
        y: `-=${MESSAGE_OFFSET}`,
        duration: 0.3,
        ease: "power2.out",
        stagger: {
          amount: 0.1,
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
    })
    .to({}, { duration: 0.3 });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        scrollPosition.value = 0;  // Reset scroll position
      } else {
        isVisible.value = false;
      }
    });
  }, {
    threshold: 0.1
  });

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }

  return () => observer.disconnect();
};

onMounted(() => {
  // Hide all messages immediately on mount, before any animations
  const sectionSelector = `#${props.sectionId}`;
  gsap.set(`${sectionSelector} .message-group`, { 
    opacity: 0, 
    y: 20,
    force3D: true 
  });
  
  gsap.set(`${sectionSelector} .typing-container`, { 
    opacity: 0, 
    y: 20,
    force3D: true 
  });
  
  // Then continue with setup
  nextTick(() => {
    setupScrollAnimation();
  });
});

onUnmounted(() => {
  // Clean up ScrollTrigger
  if (timeline) {
    timeline.scrollTrigger?.kill();
    timeline.kill();
  }
});
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;

  &.left {
    justify-content: flex-start;
    
    :deep(.floating-container) {
      margin: 0;
      position: absolute;
      left: 0;
      transform: translateX(-25%);
    }
  }

  &.right {
    justify-content: flex-end;
    
    :deep(.floating-container) {
      margin: 0;
      position: absolute;
      right: 0;
      transform: translateX(25%);
    }
  }

  &.center {
    justify-content: center;
    padding: 0 40px;
    
    :deep(.floating-container) {
      margin: 0 auto;
    }
  }
}
<<<<<<< Updated upstream
</style> 
=======

.ambient-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(135deg, #1a1f2c 0%, #2E3440 100%);
  color: white;
  padding: 20px;
  text-align: center;

  .ambient-time {
    font-size: 3.5rem;
    font-weight: 300;
    margin-bottom: 0.5rem;
  }

  .ambient-date {
    font-size: 1rem;
    opacity: 0.8;
    margin-bottom: 2rem;
  }

  .ambient-notifications {
    display: flex;
    justify-content: center;
    min-height: 20px; // Ensure space is reserved even when dots are not visible
  }
}

.chat-screen {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
}

.messages-container {
  flex: 1;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.message-group {
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  will-change: transform;
  margin-bottom: 16px;
}

.typing-container {
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 20px;
  opacity: 0;
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

.sent .message-content {
  background: linear-gradient(135deg, #007aff, #0063cc);
  color: white;
  border-bottom-right-radius: 4px;
}

.received .message-content {
  background: linear-gradient(135deg, #e5e5ea, #d1d1d6);
  color: black;
  border-bottom-left-radius: 4px;
}

.message-input-container {
  padding: 10px 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.input-wrapper {
  background: white;
  border-radius: 20px;
  padding: 10px 15px;
}

.message-input {
  width: 100%;
  min-height: 24px;
}

.placeholder {
  color: #8e8e93;
  font-size: 16px;
}

.futoro {
  font-weight: bold;
  color: #007aff;
  margin-right: 4px;
}
</style>
gi
>>>>>>> Stashed changes
