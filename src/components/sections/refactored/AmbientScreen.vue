<template>
  <div class="ambient-screen" :style="backgroundStyle">
    <div class="ambient-time">{{ time }}</div>
    <div class="ambient-date">{{ date }}</div>
    <div class="ambient-notifications" :data-paused="!enablePullEffect">
      <LoadingDots 
        ref="notificationDotsRef"
        :dots="5" 
        :dotSize="8" 
        :dotSpacing="8"
        :dotColor="theme.accentColor || 'rgba(255, 255, 255, 0.8)'" 
        :duration="0.8" 
        :paused="true" 
        animationStyle="pulse"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import LoadingDots from '@/components/LoadingDots.vue';
import { useScroll, useTransition } from '@vueuse/core';
import gsap from 'gsap';

/**
 * AmbientScreen Component
 * 
 * This component renders a lock screen-like interface showing:
 * 1. Current time in large format
 * 2. Current date in a smaller format
 * 3. Loading dots animation that indicates pull-to-unlock functionality
 */

interface Props {
  time: string;                 // Current time string (HH:MM format)
  date: string;                 // Current date string (Day, Month Date format)
  paused?: boolean;             // Whether animations should be paused
  enablePullEffect?: boolean;   // Whether pull-to-unlock effect is enabled
  pullProgress?: number;        // Progress value for pull effect (0-1)
  theme?: {                     // Theme configuration for visual appearance
    baseColor?: string;         // Base gradient color
    endColor?: string;          // End gradient color
    accentColor?: string;       // Accent color for UI elements and effects
  };
}

const props = withDefaults(defineProps<Props>(), {
  paused: false,
  enablePullEffect: true,
  pullProgress: 0,
  theme: () => ({
    baseColor: '#1a1f2c',       // Dark blue base color
    endColor: '#2E3440',        // Slightly lighter blue end color
    accentColor: 'rgba(255, 255, 255, 0.8)' // Semi-transparent white accent
  })
});

const emit = defineEmits(['pull-threshold-reached']);

// Refs
const notificationDotsRef = ref<InstanceType<typeof LoadingDots> | null>(null);
const scrollTarget = ref(null);
const { y: scrollY } = useScroll(scrollTarget);
const thresholdReached = ref(false);

// Computed properties
const rawPullProgress = computed(() => {
  if (!props.enablePullEffect) return 0;
  
  // Convert scroll position to pull progress (0-1)
  const maxPullScroll = 100; // How many pixels of scroll = 100% pull
  return Math.min(1, Math.max(0, scrollY.value / maxPullScroll));
});

// Add smooth transition to the pull progress
const scrollPullProgress = useTransition(rawPullProgress, {
  duration: 150,
  transition: [0.25, 0.1, 0.25, 1], // Cubic bezier for smooth feel
});

const backgroundStyle = computed(() => {
  return {
    background: `linear-gradient(135deg, ${props.theme.baseColor} 0%, ${props.theme.endColor} 100%)`
  };
});

// Methods
const applyPullEffect = (progress: number) => {
  if (!props.enablePullEffect) return;
  
  const el = document.querySelector('.ambient-screen') as HTMLElement;
  if (!el) return;
  
  // Apply pull effect transformations
  const maxOffset = 40;
  const dotsContainer = notificationDotsRef.value?.$el;
  const dots = dotsContainer?.querySelectorAll('.loading-dot');
  
  if (progress > 0 && dots && dots.length > 0) {
    // Move the entire dots container
    if (dotsContainer) {
      dotsContainer.style.transform = `translateY(${progress * 15}px)`;
    }
    
    // Calculate center position
    const centerIndex = Math.floor((dots.length - 1) / 2);
    
    // Get the middle dot's offset
    const dotPosition = 0.5;
    const middleDotOffset = Math.sin(dotPosition * Math.PI) * maxOffset * progress;
    
    // Scale the pull height based on the middle dot's movement
    const pullHeight = middleDotOffset * 1.5;
    const pullWidth = progress * 40;
    
    // Create gradient effect
    const gradientColor = progress > 0.9
      ? `rgba(245, 245, 245, ${(progress - 0.9) * 10})`
      : 'transparent';
    
    const gradientPosition = 50 + (middleDotOffset / 2);
    
    // Apply background with pull-down effect
    el.style.background = `
      radial-gradient(
        ${100 + pullWidth}% ${100 + Math.abs(pullHeight)}% at ${gradientPosition}% 0%, 
        ${gradientColor} 0%, 
        transparent ${progress * 50}%
      ),
      linear-gradient(135deg, ${props.theme.baseColor} 0%, ${props.theme.endColor} 100%)
    `;
    
    // Add box-shadow for 3D effect
    el.style.boxShadow = progress > 0.3
      ? `inset 0 ${Math.abs(pullHeight) * 0.5}px ${Math.abs(pullHeight)}px -${Math.abs(pullHeight) * 0.3}px rgba(0,0,0,${progress * 0.3})`
      : 'none';
    
    // Apply transition
    el.style.transition = 'box-shadow 0.2s ease';
    
    // Apply different offsets to each dot
    dots.forEach((dot: any, index: number) => {
      const dotPosition = index / (dots.length - 1);
      const uShapeOffset = Math.sin(dotPosition * Math.PI) * maxOffset * progress;
      
      const distanceFromCenter = Math.abs(index - centerIndex);
      const maxDistance = Math.max(centerIndex, dots.length - 1 - centerIndex);
      const scaleFactor = 1 - (distanceFromCenter / maxDistance) * 0.5 * progress;
      
      const rotationAngle = (index - centerIndex) * -2 * progress;
      
      dot.style.transform = `translateY(${uShapeOffset}px) scale(${scaleFactor}) rotate(${rotationAngle}deg)`;
      dot.style.boxShadow = progress > 0.3 
        ? `0 ${uShapeOffset * 0.1}px ${uShapeOffset * 0.2}px rgba(0,0,0,${progress * 0.2})` 
        : 'none';
    });
    
    // Emit event if pull threshold reached
    if (progress > 0.9) {
      emit('pull-threshold-reached');
    }
  } else {
    // Reset styles when no pull
    resetPullEffect();
  }
};

const resetPullEffect = () => {
  const el = document.querySelector('.ambient-screen') as HTMLElement;
  if (!el) return;
  
  el.style.background = `linear-gradient(135deg, ${props.theme.baseColor} 0%, ${props.theme.endColor} 100%)`;
  el.style.boxShadow = 'none';
  
  const dotsContainer = notificationDotsRef.value?.$el;
  if (dotsContainer) {
    dotsContainer.style.transform = '';
    
    const dots = dotsContainer.querySelectorAll('.loading-dot');
    dots.forEach((dot: any) => {
      dot.style.transform = '';
      dot.style.boxShadow = 'none';
    });
  }
};

// Watch for changes to pullProgress prop
watch(() => props.pullProgress, (newValue) => {
  if (newValue > 0) {
    applyPullEffect(newValue);
  } else {
    resetPullEffect();
  }
});

// Watch for changes to theme prop
watch(() => props.theme, () => {
  resetPullEffect();
}, { deep: true });

// Define handleScroll function first
const handleScroll = () => {
  // Early return if pull effect is disabled or already unlocked
  if (!props.enablePullEffect || thresholdReached.value) return;
  
  // Convert scroll position to pull progress (0-1)
  const maxPullScroll = 100; // How many pixels of scroll = 100% pull
  const progress = Math.min(1, Math.max(0, window.scrollY / maxPullScroll));
  
  // Update the source reactive property that scrollPullProgress is based on
  scrollY.value = window.scrollY;

  // Apply the pull effect based on progress
  if (progress > 0) {
    applyPullEffect(progress);
    
    // Only emit once when threshold is reached
    if (progress >= 0.8 && !thresholdReached.value) {
      thresholdReached.value = true;
      emit('pull-threshold-reached');
      
      // Optionally remove scroll listener after threshold is reached
      window.removeEventListener('scroll', handleScroll);
    }
  } else {
    resetPullEffect();
  }
};

// Watch for changes to enablePullEffect
watch(() => props.enablePullEffect, (newValue, oldValue) => {
  if (!newValue) {
    resetPullEffect();
    // Remove the scroll listener when pull effect is disabled
    window.removeEventListener('scroll', handleScroll);
  } else if (!oldValue && newValue) {
    // Only add the listener if it wasn't previously enabled
    window.addEventListener('scroll', handleScroll);
  }
}, { immediate: true });

// Watch for changes to scroll pull progress
watch(scrollPullProgress, (newProgress) => {
  if (newProgress > 0) {
    applyPullEffect(newProgress);
  } else {
    resetPullEffect();
  }
});

// Expose methods for parent components
defineExpose({
  applyPullEffect,
  resetPullEffect
});

onMounted(() => {
  // Initialize with current theme
  resetPullEffect();
  
  // Add scroll listener only if pull effect is enabled
  if (props.enablePullEffect) {
    window.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.ambient-screen {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  overflow: hidden;
  border-radius: inherit;
}

.ambient-time {
  font-size: 3.5rem;
  font-weight: 300;
  margin-bottom: 0.5rem;
}

.ambient-date {
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.ambient-notifications {
  position: absolute;
  bottom: 15%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}
</style>
