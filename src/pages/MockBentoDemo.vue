<script setup lang="ts">
import MockBentoSection from '@/components/MockBentoSection.vue';
</script>

<template>
  <div class="container py-8">
    <h1 class="text-3xl font-bold mb-8">Bento Box Demo</h1>
    
    <MockBentoSection 
      title="Bento Box Example" 
      description="A simple demonstration of the bento box layout with placeholder content"
    />
    
    <div class="mt-12">
      <h2 class="text-2xl font-semibold mb-4">How to Use</h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>The bento grid is defined in <code>src/scss/components/_form-grid.scss</code></li>
        <li>Each cell uses BEM-style classes like <code>bento-cell</code>, <code>bento-content</code>, etc.</li>
        <li>Responsive modifiers control the layout on different screen sizes</li>
        <li>Add your own content inside the <code>bento-body</code> sections</li>
      </ul>
    </div>
  </div>
</template>
