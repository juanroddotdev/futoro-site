<script setup lang="ts">
import { onMounted } from 'vue';
import { servicesSectionAnimations } from '@/animations/servicesSection';
import ServicesData from '@/components/ServicesData.vue';

onMounted(() => {
  servicesSectionAnimations.cardsFadeIn();
});
</script>

<template>
  <section id="services" class="services-grid section theme-bg--neutral">
    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-2 sticky-heading-container">
        <AnimatedText 
        class="sticky-heading text-3xl font-bold text-center my-16 gradient-text"
        firstPart="How I" 
        secondPart="Can Help" 
        animation="split"
        :useGradient="true"
        :duration="3"
        :initiallyHidden="true"
        :triggerOnVisible="true"
        :restartOnVisible="true"
      />
      </div>
      <div class="col-span-3 service-card">
        <ServicesData />
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>

</style>
