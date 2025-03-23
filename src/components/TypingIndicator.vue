
<template>
  <div 
    class="typing-indicator"
    :class="{ 'sent': isSent }"
  >
    <div class="typing-animation">
      <LoadingDots 
        :dots="3"
        :dotSize="6"
        :dotSpacing="4"
        :yOffset="3"
        :duration="0.6"
        :dotColor="isSent ? 'rgba(255, 255, 255, 0.7)' : ''"
        animationStyle="pulse"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingDots from './LoadingDots.vue';

defineProps<{
  isSent?: boolean;
}>();
</script>

<style lang="scss" scoped>
@import '../scss/components/typing-indicator';

.typing-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 20px;
}
</style> 
