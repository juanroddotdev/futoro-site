<template>
  <div 
    class="typing-indicator"
    :class="{ 'sent': isSent }"
  >
    <div class="typing-animation">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isSent?: boolean;
}>();
</script>

<style lang="scss" scoped>
@import '../scss/components/typing-indicator';
</style> 
