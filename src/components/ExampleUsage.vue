<template>
  <div class="example-container">
    <!-- Basic usage -->
    <ThoughtBubble>
      <p>This is a thought bubble!</p>
    </ThoughtBubble>
    
    <!-- Customized bubble -->
    <ThoughtBubble 
      width="300" 
      height="200" 
      fillColor="rgba(173, 216, 230, 0.8)" 
      strokeColor="#4682B4"
      contentPadding="30px 40px"
      :scale="1.2"
      :rotate="-5"
    >
      <h3>Custom Thought</h3>
      <p>You can customize the size, colors, and rotation!</p>
    </ThoughtBubble>
    
    <!-- Overlaying on an image -->
    <div class="relative-container">
      <img src="/path/to/image.jpg" alt="Background image" />
      <ThoughtBubble 
        class="overlay-bubble" 
        fillColor="rgba(255, 255, 255, 0.85)"
        :hasFilter="true"
      >
        <p>I'm thinking about this image...</p>
      </ThoughtBubble>
    </div>
  </div>
</template>

<script setup>
import ThoughtBubble from '@/components/ui/ThoughtBubble.vue';
</script>

<style scoped>
.example-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
}

.relative-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.relative-container img {
  width: 100%;
  height: auto;
  display: block;
}

.overlay-bubble {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 200px;
}
</style>