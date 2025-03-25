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
import { performUnlockAnimation, performRippleUnlockAnimation,  } from '@/utils/phoneAnimations';
import { animateDotsUShapeEffect } from '@/utils/ambientEffects';
import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  console.log('[PhoneSection] 🎯 Pull threshold reached callback triggered');
  emit('pull-threshold-reached');
  
  // Automatically unlock the phone when pull threshold is reached
  unlockPhone();
});

// Handle time updates for ambient mode
const { currentTime, currentDate, cleanup: cleanupAmbientTime } = useAmbientTime(props.ambientMode);

// Unlock phone method
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
  
  const chatScreen = chatScreenRef.value?.$el as HTMLElement | undefined;
  if (!chatScreen) {
    console.warn('[PhoneSection] ⚠️ ChatScreen element not found, but continuing with unlock animation');
  }
  
  console.log('[PhoneSection] 🎬 Starting unlock animation');
  
  if (props.unlockAnimationType === 'ripple') {
    performRippleUnlockAnimation(ambientScreen, containerRef.value, () => {
      console.log('[PhoneSection] 🔓 Unlock animation complete, showing chat screen');
      isUnlocked.value = true;
      emit('unlock');
      
      nextTick(() => {
        setupScrollAnimation();
        
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
    });
  } else {
    // Default to wave animation
    performUnlockAnimation(ambientScreen, () => {
      console.log('[PhoneSection] 🔓 Unlock animation complete, showing chat screen');
      isUnlocked.value = true;
      emit('unlock');
      
      nextTick(() => {
        setupScrollAnimation();
        
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
    });
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
  const { setupPullEffect: setupPull } = usePullEffect(() => {
    console.log('[PhoneSection] 🎯 Pull threshold reached from scroll trigger');
    emit('pull-threshold-reached');
    unlockPhone();
  });
  
  setupPull(
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
