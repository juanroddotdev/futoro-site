<template>
  <div class="ambient-screen" :style="backgroundStyle">
    <div class="ambient-time">{{ time }}</div>
    <div class="ambient-date">{{ date }}</div>
    <div class="ambient-notifications" :data-paused="!enablePullEffect">
      <LoadingDots 
        :dots="5" 
        :dotSize="8" 
        :dotSpacing="8"
        :dotColor="theme.accentColor || 'rgba(255, 255, 255, 0.8)'" 
        :duration="0.8" 
        :paused="!enablePullEffect" 
        animationStyle="pulse"
        :dotsDisabled="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import LoadingDots from './LoadingDots.vue';

interface Props {
  time: string;
  date: string;
  paused?: boolean;
  enablePullEffect?: boolean;
  theme?: {
    baseColor?: string;
    endColor?: string;
    accentColor?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  paused: false,
  enablePullEffect: true,
  theme: () => ({
    baseColor: '#1a1f2c',
    endColor: '#2E3440',
    accentColor: 'rgba(255, 255, 255, 0.8)'
  })
});

const emit = defineEmits(['pull-threshold-reached']);

// Add a method to handle pull threshold reached
const handlePullThresholdReached = () => {
  console.log('[AmbientScreen] 🔔 Pull threshold reached, emitting event');
  emit('pull-threshold-reached');
};

// Expose the method to parent components
defineExpose({
  handlePullThresholdReached
});

const backgroundStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.theme.baseColor} 0%, ${props.theme.endColor} 100%)`
}));
</script>

<style lang="scss" scoped>
.ambient-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(135deg, v-bind('props.theme.baseColor') 0%, v-bind('props.theme.endColor') 100%);
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
    min-height: 20px;
  }
}

.ambient-notifications[data-paused="true"] {
  /* Add styles for paused state if needed */
  opacity: 0.7;
}
</style>
