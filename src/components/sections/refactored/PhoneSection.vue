<template>
  <div ref="containerRef" class="container" :id="sectionId" :class="position">
    <div ref="phoneContainerRef">
      <FloatingPhone ref="floatingPhoneRef" :tilt-x="tiltX" :tilt-y="tiltY">
        <AmbientScreen 
          v-if="!isUnlocked && ambientMode"
          ref="ambientScreenRef"
          :time="currentTime"
          :date="currentDate"
          :theme="ambientTheme"
          :enable-pull-effect="enablePullEffect"
          @pull-threshold-reached="onPullThresholdReached"
        />
        <ChatScreen 
          v-else
          ref="chatScreenRef"
          :messages="messages"
          :show-typing-for="showTypingFor"
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
import { applyAmbientPullEffect } from '@/utils/ambientEffects';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);

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
  ambientMode?: boolean;
  enablePullEffect?: boolean;
  ambientTheme?: {
    baseColor?: string;
    endColor?: string;
    accentColor?: string;
  };
  pinSettings?: {
    enabled?: boolean;
    start?: string;
    end?: string;
    pinSpacing?: boolean;
    anticipatePin?: number;
  };
  unlockAnimationType?: 'wave' | 'ripple';
  isUnlocked?: boolean;
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

const emit = defineEmits(['update:ambientMode', 'pull-threshold-reached', 'unlock']);

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
  emit('pull-threshold-reached');
});

// Handle time updates for ambient mode
const { currentTime, currentDate, cleanup: cleanupAmbientTime } = useAmbientTime(props.ambientMode);

// Unlock phone method
const unlockPhone = () => {
  if (isUnlocked.value) return;
  
  const ambientScreen = ambientScreenRef.value?.$el as HTMLElement | undefined;
  
  if (ambientScreen) {
    if (props.unlockAnimationType === 'ripple') {
      performRippleUnlockAnimation(ambientScreen, containerRef.value, () => {
        isUnlocked.value = true;
        emit('unlock');
        
        // Re-setup scroll animations after unlocking
        nextTick(() => {
          setupScrollAnimation();
        });
      });
    } else {
      // Default to wave animation
      performUnlockAnimation(ambientScreen, () => {
        isUnlocked.value = true;
        emit('unlock');
        
        // Re-setup scroll animations after unlocking
        nextTick(() => {
          setupScrollAnimation();
        });
      });
    }
  }
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

const onPullThresholdReached = () => {
  // Forward the event to parent components
  emit('pull-threshold-reached');
  
  // You can choose to automatically unlock the phone here
  // unlockPhone();
};

// Add this watch to handle the transition when isUnlocked changes
watch(isUnlocked, (newValue) => {
  if (newValue) {
    // When phone is unlocked, ensure messages are visible
    nextTick(() => {
      // Get reference to the chat screen elements
      const chatScreenElement = chatScreenRef.value?.$el;
      if (chatScreenElement) {
        // Animate messages appearing
        const messagesContainer = chatScreenElement.querySelector('.messages-container');
        if (messagesContainer) {
          gsap.to(messagesContainer, {
            opacity: 1,
            duration: 0.3
          });
          
          // Animate each message group
          const messageGroups = messagesContainer.querySelectorAll('.message-group');
          if (messageGroups.length > 0) {
            gsap.to(messageGroups, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.1,
              delay: 0.2
            });
          }
          
          // Animate typing indicators if any
          const typingContainers = messagesContainer.querySelectorAll('.typing-container');
          if (typingContainers.length > 0) {
            gsap.to(typingContainers, {
              opacity: 1,
              duration: 0.3,
              delay: 0.1
            });
          }
        }
      }
    });
  }
});
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
