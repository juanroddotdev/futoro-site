<script setup lang="ts">
defineProps<{
  text: string;
  responseTime?: string;
}>();
</script>

<template>
  <div class="availability-badge">
    <span class="availability-badge__dot"></span>
    <div class="availability-badge__content">
      <span class="availability-badge__text">{{ text }}</span>
      <span v-if="responseTime" class="availability-badge__response">{{ responseTime }}</span>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/scss/components/availability-badge';

.availability-badge {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  &__response {
    font-size: 0.75rem;
    opacity: 0.8;
  }
}
</style>