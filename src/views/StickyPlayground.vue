<template>
  <div class="sticky-playground-container">
    <h1 class="playground-title">Sticky Container Playground</h1>
    
    <!-- Simple sticky section test -->
    <StickySectionContainer 
      height="300vh"
      position="top"
      :offset="0"
      :zIndex="2"
      :debug="true"
    >
      <div class="demo-content">
        <h2>Sticky Content Demo</h2>
        <p>This content will stick to the top as you scroll through the 300vh container height.</p>
        <div class="demo-box">
          <div class="demo-inner">
            <span>Scroll down to see the sticky effect</span>
          </div>
        </div>
      </div>
    </StickySectionContainer>
    
    <!-- Regular content after the sticky section -->
    <div class="regular-content">
      <h2>Regular Content</h2>
      <p>This content appears after the sticky section.</p>
      <div class="content-blocks">
        <div class="block" v-for="i in 3" :key="i">
          <h3>Content Block {{ i }}</h3>
          <p>This is a regular content block that appears after the sticky section.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StickySectionContainer from '@/components/ui/containers/StickySectionContainer.vue';
</script>

<style lang="scss">
.sticky-playground-container {
  padding-top: 80px; // Space for navbar
}

.playground-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
}

.demo-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--theme-bg-primary, #f5f5f5);
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  p {
    max-width: 600px;
    text-align: center;
    margin-bottom: 2rem;
  }
}

.demo-box {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--theme-accent, #3498db), var(--theme-secondary, #9b59b6));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  .demo-inner {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 1rem 2rem;
    border-radius: 4px;
    font-weight: bold;
  }
}

.regular-content {
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 0 auto;
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 2rem;
  }
  
  .content-blocks {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    
    .block {
      background-color: var(--theme-bg-secondary, #f0f0f0);
      padding: 1.5rem;
      border-radius: 8px;
      
      h3 {
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>