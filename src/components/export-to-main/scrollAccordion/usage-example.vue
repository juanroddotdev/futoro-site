<template>
  <div class="scroll-accordion-demo">
    <h2 class="demo-heading">Scroll Accordion Demo</h2>
    <p class="demo-description">
      Scroll down to see the accordion animation in action. Each item will collapse as you scroll.
    </p>
    
    <ScrollAccordionVanilla :items="accordionItems" />
    
    <div class="demo-controls">
      <button @click="resetItems">Reset Demo</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ScrollAccordionVanilla from './ScrollAccordionVanilla.vue';

// Sample accordion items for the demo
const accordionItems = ref([
  { 
    id: 1, 
    title: 'Web Development', 
    description: 'Modern, responsive websites built with the latest technologies. We create fast, accessible, and SEO-friendly sites that look great on any device.' 
  },
  { 
    id: 2, 
    title: 'UI/UX Design', 
    description: 'User-centered design that delights your audience. Our design process focuses on creating intuitive interfaces that guide users to take action.' 
  },
  { 
    id: 3, 
    title: 'Digital Marketing', 
    description: 'Strategic campaigns that drive results. We help you reach your target audience through data-driven marketing strategies across multiple channels.' 
  },
  { 
    id: 4, 
    title: 'Content Creation', 
    description: 'Engaging content that tells your story. From copywriting to video production, we create content that resonates with your audience and builds your brand.' 
  },
]);

// Function to reset the demo (could be expanded to actually reset the animation)
function resetItems() {
  // In a real implementation, you might want to reset the scroll position
  // or trigger a re-render of the component
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
</script>

<style scoped>
.scroll-accordion-demo {
  padding: 2rem 0;
}

.demo-heading {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
}

.demo-description {
  max-width: 600px;
  margin: 0 auto 3rem;
  text-align: center;
  line-height: 1.6;
}

.demo-controls {
  margin-top: 3rem;
  text-align: center;
}

button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(200deg, rgb(29, 145, 252) 13.57%, rgb(90, 54, 192) 98.38%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.9;
}
</style>