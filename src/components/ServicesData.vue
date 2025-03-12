<script setup lang="ts">
import ServicesAccordion from './ServicesAccordion.vue';
import { services } from '@/data/services';
</script>

<template>
  <div class="services-container">
    <ServicesAccordion :services="services" :defaultOpenIndex="0" />
  </div>
</template>

<style scoped>
.services-container {
  max-width: 900px;
  margin: 0 auto;
}
</style>