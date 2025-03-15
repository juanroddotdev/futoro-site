<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card3D from './Card3D.vue';
import { card3DAnimations } from './card3DAnimations';

defineProps<{
  currentTheme: string
}>();

const showcaseRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (showcaseRef.value) {
    // Initialize animations using our animation module
    card3DAnimations.animateCardGroup(showcaseRef.value);
  }
});
</script>

<template>
  <section ref="showcaseRef" class="card-3d-showcase section py-20">
    <h2 class="heading--accent mb-12 text-center">3D Interactive Cards</h2>
    
    <div class="card-grid">
      <Card3D
        :current-theme="currentTheme"
        title="Web Development"
        subtitle="Modern, responsive websites built with the latest technologies"
        image-url="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
        link-url="#services"
        link-text="Our Services"
      />
      
      <Card3D
        :current-theme="currentTheme"
        title="UI/UX Design"
        subtitle="Beautiful, intuitive interfaces that users love"
        image-url="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80"
        link-url="#design"
        link-text="Design Process"
      />
      
      <Card3D
        :current-theme="currentTheme"
        title="Mobile Apps"
        subtitle="Cross-platform applications for iOS and Android"
        image-url="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        link-url="#mobile"
        link-text="Mobile Solutions"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
// Card3D Showcase Section
.card-3d-showcase {
  position: relative;
  padding: 5rem 0;
  
  // Card grid layout
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
}
</style>