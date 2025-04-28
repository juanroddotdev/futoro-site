<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>

<section class="bento-section">
      <div class="bento-section--heading">
        <h2>{{ title }}</h2>
      </div>
      
      <div v-if="description" class="bento-section--description">
        <p>{{ description }}</p>
      </div>
    <div class="parent-grid">
      <slot />
    </div>
   
</section>
    
  <!-- <section class="form-grid">
    <div class="form-grid-heading">
      <h2>{{ title }}</h2>
    </div>
    
    <div v-if="description" class="description">
      <p>{{ description }}</p>
    </div>

    <div class="form-content">
      <slot />
    </div>
  </section> -->
</template>

<style scoped>
/* Add any specific styles for the section container itself if needed */
</style> 