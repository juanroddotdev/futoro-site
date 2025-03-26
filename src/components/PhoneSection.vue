<template>
  <div ref="containerRef" class="container" :id="sectionId" :class="position">
    <div ref="phoneContainerRef">
      <FloatingPhone 
        ref="floatingPhoneRef"
        :tilt-x="tiltX"
        :tilt-y="tiltY"
        :alternatePhoneStyle="alternatePhoneStyle"
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
        
        <!-- Replace the messages container with the new component -->
        <PhoneMessages
          ref="messagesComponentRef"
          :messages="messages"
          :showTypingFor="showTypingFor"
          :isVisible="isUnlocked || !ambientMode"
          :isHidden="!isUnlocked && ambientMode"
          :sectionId="sectionId"
        />
        
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
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import TypingIndicator from './TypingIndicator.vue';
import FloatingPhone from './FloatingPhone.vue';
import AmbientScreen from './sections/refactored/AmbientScreen.vue';
import PhoneMessages from './PhoneMessages.vue';

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
  alternatePhoneStyle?: boolean;
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
  unlockAnimationType: 'wave',
  alternatePhoneStyle: false
});
// Add emit for unlock events
const emit = defineEmits(['pull-threshold-reached', 'unlock']);

const containerRef = ref<HTMLElement | null>(null);
const floatingPhoneRef = ref<InstanceType<typeof FloatingPhone> | null>(null);
const messagesComponentRef = ref<InstanceType<typeof PhoneMessages> | null>(null);
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
  
  // Reset message animations using the PhoneMessages component method
  if (messagesComponentRef.value) {
    messagesComponentRef.value.resetMessageAnimations();
  }
  
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
        if ((!props.ambientMode || props.isUnlocked) && props.messages.length > 0 && messagesComponentRef.value) {
          messagesComponentRef.value.showFirstMessage();
        }
      },
      onEnterBack: () => {
        // Only reset and show messages if we're not in ambient mode or we're unlocked
        if (!props.ambientMode || props.isUnlocked) {
          if (messagesComponentRef.value) {
            messagesComponentRef.value.resetMessageAnimations();
            messagesComponentRef.value.showFirstMessage();
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
  
  // Get message timeline from PhoneMessages component and add it to our main timeline
  if (messagesComponentRef.value) {
    const messageTimeline = messagesComponentRef.value.createMessageTimeline();
    timeline.add(messageTimeline, 0);
  }
  
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

// Handle unlock animation
const handleUnlock = () => {
  // Create a timeline for the unlock animation
  const unlockTl = gsap.timeline();
  
  // Get the ambient screen element if it exists
  const ambientScreenSelector = `#${props.sectionId} .ambient-screen`;
  const ambientScreen = document.querySelector(ambientScreenSelector);
  
  if (ambientScreen) {
    // First make sure messages are behind ambient screen
    if (messagesComponentRef.value?.messagesRef) {
      // Check if messagesRef exists and is an HTMLElement
      const messagesElement = messagesComponentRef.value.messagesRef as HTMLElement;
      if (messagesElement) {
        messagesElement.style.zIndex = '1';
      }
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
  if (messagesComponentRef.value?.messagesRef) {
    unlockTl.set(messagesComponentRef.value.messagesRef, {
      zIndex: '2',
      visibility: 'visible'
    }, "-=0.4");
    
    unlockTl.to(messagesComponentRef.value.messagesRef, {
      opacity: 1,
      duration: 0.3
    }, "-=0.3");
  }
  
  // Enable scroll animations after unlock
  unlockTl.call(() => {
    nextTick(() => {
      if (messagesComponentRef.value) {
        messagesComponentRef.value.resetMessageAnimations();
        messagesComponentRef.value.showFirstMessage();
      }
      
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

// Simplified function that uses the PhoneMessages component methods
const resetMessageAnimationState = () => {
  if (messagesComponentRef.value) {
    messagesComponentRef.value.resetMessageAnimations();
  }
};

// Simplified function that uses the PhoneMessages component methods
const showFirstMessageIfVisible = () => {
  if (messagesComponentRef.value) {
    messagesComponentRef.value.showFirstMessage();
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
