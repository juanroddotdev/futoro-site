<template>
  <div ref="containerRef" class="container" :id="sectionId" :class="position">
    <div ref="phoneContainerRef">
      <FloatingPhone 
        ref="floatingPhoneRef"
        :tilt-x="tiltX"
        :tilt-y="tiltY"
      > 
        <AmbientScreen 
          v-if="!isUnlocked && ambientMode"
          ref="ambientScreenRef"
          :time="'4:20 PM'"
          :date="'March 26th, 2023'"
          :enable-pull-effect="enablePullEffect"
          :theme="ambientTheme"
          @pull-threshold-reached="onPullThresholdReached"
          class="ambient-screen-layer"
        />
        <!-- Always render messages but hide them when ambient mode is active -->
        <div 
          ref="messagesRef" 
          class="messages-container"
          :class="{'messages-visible': isUnlocked || !ambientMode}"
          :style="{ visibility: (!isUnlocked && ambientMode) ? 'hidden' : 'visible', opacity: (!isUnlocked && ambientMode) ? 0 : 1 }"
        >
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
        <div 
          class="message-input-container"
          :style="{ visibility: (!isUnlocked && ambientMode) ? 'hidden' : 'visible', opacity: (!isUnlocked && ambientMode) ? 0 : 1 }"
        >
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
import AmbientScreen from './sections/refactored/AmbientScreen.vue'; // Add this import

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
  isUnlocked?: boolean;
  ambientMode?: boolean;
  enablePullEffect?: boolean;
  ambientTheme?: {
    baseColor?: string;
    endColor?: string;
    accentColor?: string;
  };
  unlockAnimationType?: 'wave' | 'ripple';
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
  }),
  isUnlocked: false,
  ambientMode: false,
  enablePullEffect: true,
  ambientTheme: () => ({
    baseColor: '#1a1f2c',
    endColor: '#2E3440',
    accentColor: 'rgba(245, 245, 245, 0.3)'
  }),
  unlockAnimationType: 'wave'
});
// Add emit for unlock events
const emit = defineEmits(['pull-threshold-reached', 'unlock']);

const containerRef = ref<HTMLElement | null>(null);
const floatingPhoneRef = ref<InstanceType<typeof FloatingPhone> | null>(null);
const messagesRef = ref<HTMLElement | null>(null);
const phoneContainerRef = ref<HTMLElement | null>(null);

// Add a flag to prevent multiple unlock attempts
const isUnlocking = ref(false);

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
  
  // Always set up the animation, but only make it active when not in ambient mode
  // or when unlocked
  
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
  
  // Always reset state
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
      onEnter: () => {
        // Only try to show messages if we're not in ambient mode or we're unlocked
        if ((!props.ambientMode || props.isUnlocked) && props.messages.length > 0) {
          const sectionSelector = `#${props.sectionId}`;
          const firstGroup = `${sectionSelector} .message-group-1`;
          gsap.to(firstGroup, { opacity: 1, y: 0, duration: 0.3 });
        }
      },
      onEnterBack: () => {
        // Only reset and show messages if we're not in ambient mode or we're unlocked
        if (!props.ambientMode || props.isUnlocked) {
          resetState();
          if (props.messages.length > 0) {
            const sectionSelector = `#${props.sectionId}`;
            const firstGroup = `${sectionSelector} .message-group-1`;
            gsap.to(firstGroup, { opacity: 1, y: 0, duration: 0.3 });
          }
        }
      },
      immediateRender: true
    }
  });
  
  // If in ambient mode and not unlocked, disable the ScrollTrigger
  if (props.ambientMode && !props.isUnlocked && timeline.scrollTrigger) {
    timeline.scrollTrigger.disable();
  } else if (timeline.scrollTrigger) {
    // Make sure ScrollTrigger is enabled when not in ambient mode
    timeline.scrollTrigger.enable();
  }
  
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
  // Only reset message animations if we're not in ambient mode
  if (!props.ambientMode && !props.isUnlocked) {
    resetMessageAnimationState();
  }
  
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
const onPullThresholdReached = () => {
  // Prevent multiple unlock attempts
  if (isUnlocking.value) return;
  
  isUnlocking.value = true;
  
  // Emit the event to parent components
  emit('pull-threshold-reached');
  
  // If this component should handle the unlock directly
  if (props.ambientMode && !props.isUnlocked) {
    const unlockTl = handleUnlock();
    
    // Reset the flag when animation completes
    unlockTl.eventCallback('onComplete', () => {
      isUnlocking.value = false;
      emit('unlock');
    });
  } else {
    // Reset the flag after a short delay if parent handles unlock
    setTimeout(() => {
      isUnlocking.value = false;
    }, 500);
  }
};

// Define helper functions for animation state management
const handleUnlock = () => {
  // Create a timeline for the unlock animation
  const unlockTl = gsap.timeline();
  
  // Get the ambient screen element if it exists
  const ambientScreenSelector = `#${props.sectionId} .ambient-screen`;
  const ambientScreen = document.querySelector(ambientScreenSelector);
  
  if (ambientScreen) {
    // First make sure messages are behind ambient screen
    if (messagesRef.value) {
      messagesRef.value.style.zIndex = '1';
    }
    
    // Fade out the ambient screen
    unlockTl.to(ambientScreen, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut"
    });
    
    // After fade out, set visibility to hidden and adjust z-index
    unlockTl.set(ambientScreen, {
      visibility: 'hidden',
      zIndex: '1'
    });
  }
  
  // Make messages container visible with higher z-index
  if (messagesRef.value) {
    unlockTl.set(messagesRef.value, {
      zIndex: '2',
      visibility: 'visible'
    }, "-=0.4");
    
    unlockTl.to(messagesRef.value, {
      opacity: 1,
      duration: 0.3
    }, "-=0.3");
  }
  
  // Enable scroll animations after unlock
  unlockTl.call(() => {
    nextTick(() => {
      resetMessageAnimationState();
      showFirstMessageIfVisible();
      
      // Enable the ScrollTrigger if it exists
      if (timeline && timeline.scrollTrigger) {
        timeline.scrollTrigger.enable();
        timeline.scrollTrigger.refresh();
      } else {
        // If timeline doesn't exist yet, create it
        setupScrollAnimation();
      }
    });
  });
  
  return unlockTl;
};

const resetMessageAnimationState = () => {
  const sectionSelector = `#${props.sectionId}`;
  
  // Check if elements exist before trying to animate them
  const messageGroups = document.querySelectorAll(`${sectionSelector} .message-group`);
  const typingContainers = document.querySelectorAll(`${sectionSelector} .typing-container`);
  
  // Only animate if elements exist
  if (messageGroups.length > 0) {
    gsap.set(messageGroups, { 
      opacity: 0, 
      y: 20,
      force3D: true 
    });
  }
  
  if (typingContainers.length > 0) {
    gsap.set(typingContainers, { 
      opacity: 0, 
      y: 20,
      force3D: true 
    });
  }
};

const showFirstMessageIfVisible = () => {
  if (props.messages.length > 0) {
    const sectionSelector = `#${props.sectionId}`;
    const firstGroupSelector = `${sectionSelector} .message-group-1`;
    const firstGroup = document.querySelector(firstGroupSelector);
    
    if (firstGroup) {
      gsap.to(firstGroup, { opacity: 1, y: 0, duration: 0.3 });
    }
  }
};

const refreshScrollAnimation = () => {
  if (timeline && timeline.scrollTrigger) {
    ScrollTrigger.refresh();
  }
};

const handleModeTransition = () => {
  // Wait for DOM update before manipulating elements
  nextTick(() => {
    resetMessageAnimationState();
    showFirstMessageIfVisible();
    refreshScrollAnimation();
  });
};

// Watch for changes in ambient mode or unlock state
watch([() => props.ambientMode, () => props.isUnlocked], ([newAmbientMode, newIsUnlocked], [oldAmbientMode, oldIsUnlocked]) => {
  // If we're switching from ambient mode to normal mode, or from locked to unlocked
  if ((!newAmbientMode || newIsUnlocked) && props.messages.length > 0) {
    handleModeTransition();
  }
}, { immediate: false });

// Watch for changes to isUnlocked prop
watch(() => props.isUnlocked, (newValue, oldValue) => {
  // Only proceed if there's an actual change and we're not already unlocking
  if (newValue !== oldValue && !isUnlocking.value) {
    if (newValue) {
      isUnlocking.value = true;
      
      const unlockTl = handleUnlock();
      unlockTl.eventCallback('onComplete', () => {
        isUnlocking.value = false;
      });
    }
  }
}, { immediate: false });
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
/* Add these new classes without removing existing styles */
.ambient-screen-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10; /* Higher z-index to be on top initially */
  border-radius: inherit;
}

// .messages-container {
//   position: relative;
//   width: auto;
//   height: 100%;
//   z-index: 1; /* Lower z-index initially */
//   transition: opacity 0.3s ease;
// }

.messages-visible {
  z-index: 10; /* Higher z-index when visible */
}
</style> 
