<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <div class="availability-badge">
    <span class="availability-badge__text">{{ text }}</span>
    <span class="availability-badge__dot"></span>
  </div>
</template>

<style lang="scss">
@import '@/scss/components/availability-badge';
</style>