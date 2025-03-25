<template>
  <div ref="containerRef" class="container" :id="sectionId" :class="position">
    <div ref="phoneContainerRef">
      <FloatingPhone ref="floatingPhoneRef" :tilt-x="tiltX" :tilt-y="tiltY">
        <AmbientScreen 
          v-if="!isUnlocked && ambientMode"
          ref="ambientScreenRef"
          :time="currentTime"
          :date="currentDate"
          :theme="normalizedTheme"
          :enable-pull-effect="enablePullEffect"
          @pull-threshold-reached="onPullThresholdReached"
        />
        <ChatScreen 
          v-if="isUnlocked || !ambientMode"
          ref="chatScreenRef"
          :messages="messages" 
          :showTypingFor="showTypingFor"
          :sectionId="sectionId"
          :pinSettings="pinSettings"
          :isUnlocked="isUnlocked"
        />
      </FloatingPhone>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import FloatingPhone from '@/components/FloatingPhone.vue';
import AmbientScreen from '@/components/AmbientScreen.vue';
import ChatScreen from '@/components/ChatScreen.vue';
import { useScrollAnimation } from '@/composables/useScrollAnimation';
import { usePullEffect } from '@/composables/usePullEffect';
import { useAmbientTime } from '@/composables/useAmbientTime';
import { performUnlockAnimation, performRippleUnlockAnimation } from '@/utils/phoneAnimations';
// import { applyAmbientPullEffect } from '@/utils/ambientEffects';
import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);

/**
 * PhoneSection Component
 * 
 * This component renders a phone UI with two possible states:
 * 1. Ambient Screen - A lock screen showing time, date and notifications
 * 2. Chat Screen - A messaging interface showing conversation messages
 * 
 * The component handles:
 * - Transitioning between ambient and chat screens via unlock animations
 * - Pull-to-unlock gesture effect with threshold detection
 * - Scroll-based animations for message appearance
 * - Phone tilting effects
 * 
 * Key features:
 * - Conditional rendering between AmbientScreen and ChatScreen components
 * - Composable-based logic for scroll animations, pull effects, and time display
 * - GSAP animations for smooth transitions and effects
 * - Event emission for parent components to react to user interactions
 */

// Component props with detailed descriptions
interface Message {
  text: string;
  type: string;
}

interface Props {
  messages: Message[];              // Array of chat messages to display
  sectionId: string;                // Unique ID for the section (used for DOM selection)
  showTypingFor: number[];          // Indices of messages that should show typing indicators
  tiltX?: number;                   // Horizontal tilt angle for the phone
  tiltY?: number;                   // Vertical tilt angle for the phone
  position?: 'left' | 'center' | 'right'; // Phone position within container
  ambientMode?: boolean;            // Whether to show ambient screen (lock screen)
  enablePullEffect?: boolean;       // Whether pull-to-unlock effect is enabled
  ambientTheme?: {                  // Theme colors for ambient screen
    baseColor?: string;             // Base gradient color
    endColor?: string;              // End gradient color
    accentColor?: string;           // Accent color for UI elements
  };
  pinSettings?: {                   // GSAP ScrollTrigger pin settings
    enabled?: boolean;              // Whether to pin the section during scroll
    start?: string;                 // ScrollTrigger start position
    end?: string;                   // ScrollTrigger end position
    pinSpacing?: boolean;           // Whether to add spacing when pinned
    anticipatePin?: number;         // Anticipation factor for pinning
  };
  unlockAnimationType?: 'wave' | 'ripple'; // Type of unlock animation to use
  isUnlocked?: boolean;             // Whether the phone is in unlocked state
}

const props = withDefaults(defineProps<Props>(), {
  tiltX: 0,
  tiltY: 0,
  position: 'right',
  ambientMode: false,
  enablePullEffect: true,
  ambientTheme: () => ({
    baseColor: '#1a1f2c',
    endColor: '#2E3440',
    accentColor: 'rgba(245, 245, 245, 0.3)'
  }),
  pinSettings: () => ({
    enabled: true,
    start: 'top top',
    end: 'bottom bottom',
    pinSpacing: true,
    anticipatePin: 1
  }),
  unlockAnimationType: 'wave',
  isUnlocked: false
});

// Emitted events
const emit = defineEmits([
  'update:ambientMode',             // When ambient mode changes
  'pull-threshold-reached',         // When pull gesture reaches threshold
  'unlock'                          // When phone is unlocked
]);

// Refs
const containerRef = ref<HTMLElement | null>(null);
const floatingPhoneRef = ref(null);
const phoneContainerRef = ref<HTMLElement | null>(null);
const ambientScreenRef = ref<InstanceType<typeof AmbientScreen> | null>(null);
const chatScreenRef = ref(null);
const isUnlocked = ref(props.isUnlocked);

// Use composables
const { setupScrollAnimation, cleanupScrollAnimation } = useScrollAnimation(
  containerRef,
  props.messages,
  props.showTypingFor,
  props.sectionId,
  props.pinSettings
);
const { setupPullEffect, cleanupPullEffect } = usePullEffect(() => {
  console.log('[PhoneSection] 🎯 Pull threshold reached callback triggered');
  emit('pull-threshold-reached');
  
  // Automatically unlock the phone when pull threshold is reached
  unlockPhone();
});

// Handle time updates for ambient mode
const { currentTime, currentDate, cleanup: cleanupAmbientTime } = useAmbientTime(props.ambientMode);

/**
 * unlockPhone - Handles the transition from ambient to chat screen
 * 
 * This function:
 * 1. Checks if phone is already unlocked to prevent duplicate animations
 * 2. Verifies ambient screen element exists
 * 3. Performs the appropriate unlock animation (wave or ripple)
 * 4. Updates state and emits unlock event when animation completes
 * 5. Sets up scroll animations for chat messages
 * 6. Shows the first message with a slight delay
 */
const unlockPhone = () => {
  if (isUnlocked.value) {
    console.log('[PhoneSection] ⚠️ Phone already unlocked, ignoring unlock request');
    return;
  }
  
  console.log('[PhoneSection] 🔓 Unlocking phone...');
  
  const ambientScreen = ambientScreenRef.value?.$el as HTMLElement | undefined;
  
  if (!ambientScreen) {
    console.error('[PhoneSection] ❌ Cannot unlock: ambientScreen element not found');
    return;
  }
  
  // Check for chatScreen but don't block the unlock if it's not found
  const chatScreen = chatScreenRef.value?.$el as HTMLElement | undefined;
  if (!chatScreen) {
    console.warn('[PhoneSection] ⚠️ ChatScreen element not found, but continuing with unlock animation');
  }
  
  console.log('[PhoneSection] 🎬 Starting unlock animation');
  
  // Choose animation based on prop setting
  if (props.unlockAnimationType === 'ripple') {
    performRippleUnlockAnimation(ambientScreen, containerRef.value, () => {
      handleUnlockComplete();
    });
  } else {
    // Default to wave animation
    performUnlockAnimation(ambientScreen, () => {
      handleUnlockComplete();
    });
  }
};

/**
 * handleUnlockComplete - Common logic after unlock animation completes
 * 
 * This function:
 * 1. Updates the unlocked state
 * 2. Emits the unlock event
 * 3. Sets up scroll animations for messages
 * 4. Shows the first message with animation
 */
const handleUnlockComplete = () => {
  console.log('[PhoneSection] 🔓 Unlock animation complete, showing chat screen');
  isUnlocked.value = true;
  emit('unlock');
  
  // Re-setup scroll animations after unlocking
  nextTick(() => {
    setupScrollAnimation();
    
    // Show first message when chat screen appears
    if (props.messages.length > 0) {
      const sectionSelector = `#${props.sectionId}`;
      const firstMessageGroup = document.querySelector(`${sectionSelector} .message-group-1`);
      if (firstMessageGroup) {
        gsap.to(firstMessageGroup, { 
          opacity: 1, 
          y: 0, 
          duration: 0.4,
          delay: 0.2
        });
      }
    }
  });
};

// Watch for changes to isUnlocked prop
watch(() => props.isUnlocked, (newValue) => {
  isUnlocked.value = newValue;
});

// Ensure the AmbientScreen receives the correct animation state
watch(() => props.ambientMode, (newValue) => {
  // When ambient mode changes, update the animation state
  if (ambientScreenRef.value) {
    // Pause the dots animation when in ambient mode and not scrolling
    const dotsElement = ambientScreenRef.value.$el.querySelector('.ambient-notifications');
    if (dotsElement) {
      dotsElement.setAttribute('data-paused', String(!props.enablePullEffect));
    }
  }
}, { immediate: true });

const normalizedTheme = computed(() => ({
  baseColor: props.ambientTheme?.baseColor ?? '#1a1f2c',
  endColor: props.ambientTheme?.endColor ?? '#2E3440',
  accentColor: props.ambientTheme?.accentColor ?? 'rgba(245, 245, 245, 0.3)'
}));

/**
 * setupScrollTrigger - Sets up the pull effect for ambient screen
 * 
 * This function configures the pull-to-unlock effect by calling
 * the setupPullEffect function from the usePullEffect composable
 */
const setupScrollTrigger = () => {
  setupPullEffect(
    containerRef,
    ambientScreenRef,
    props.sectionId,
    props.enablePullEffect,
    props.ambientMode,
    normalizedTheme.value
  );
};

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    setupScrollTrigger();
  });
});

onUnmounted(() => {
  cleanupScrollAnimation();
  cleanupAmbientTime();
  cleanupPullEffect();
});

// Expose methods
defineExpose({
  unlockPhone
});

/**
 * onPullThresholdReached - Handler for pull gesture threshold event
 * 
 * This function:
 * 1. Logs the event
 * 2. Forwards the event to parent components
 * 3. Automatically unlocks the phone
 */
const onPullThresholdReached = () => {
  console.log('[PhoneSection] 🔔 onPullThresholdReached called from AmbientScreen');
  // Forward the event to parent components
  emit('pull-threshold-reached');
  
  // Automatically unlock the phone when pull threshold is reached
  unlockPhone();
};


</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.container.left {
  justify-content: flex-start;
}

.container.center {
  justify-content: center;
}

.container.right {
  justify-content: flex-end;
}
</style>
