<script setup lang="ts">
import { services } from '@/data/services';
import ScrollAccordionVanilla from '@/components/ui/ScrollAccordionVanilla.vue';
</script>

<template>
  <div class="services-container">
    <ScrollAccordionVanilla :items="services" />
  </div>
</template>

<style scoped>
.services-container {
  max-width: 900px;
  margin: 0 auto;
}
</style>