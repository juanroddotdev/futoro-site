<template>
  <div class="scrollable-section" :class="customClass">
    <div class="section-container">
      <div class="section-inner" :class="layout">
        <!-- Content area with slots -->
        <div class="content-area">
          <slot name="headline"></slot>
          <slot name="subheadline"></slot>
          <slot name="content"></slot>
          <slot></slot>
        </div>
        
        <!-- Right content area -->
        <div class="content-area right">
          <slot name="right-content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component props definition
interface Props {
  layout?: 'content-left' | 'content-right' | 'content-top';
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'content-left',
  customClass: ''
});
</script>

<style lang="scss" scoped>
.scrollable-section {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  height: 100vh;
  
  // Container structure
  .section-container {
    padding: 2rem;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    
    @media (min-width: 768px) {
      padding: 4rem 2rem;
    }
  }
  
  .section-inner {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    
    @media (min-width: 1024px) {
      flex-direction: row;
      gap: 4rem;
    }
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  // Content area
  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem 0;
    
    @media (min-width: 768px) {
      padding: 3rem 0;
    }
    
    &.right {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      max-width: 600px;
      margin-right: 100px;
      
      @media (max-width: 1024px) {
        margin-right: 0;
        max-width: 100%;
      }
    }
  }
  
  // Layout variations
  &.content-left {
    .section-inner {
      @media (min-width: 1024px) {
        flex-direction: row;
      }
    }
  }
  
  &.content-right {
    .section-inner {
      @media (min-width: 1024px) {
        flex-direction: row-reverse;
      }
    }
  }
  
  &.content-top {
    .section-inner {
      flex-direction: column;
    }
  }
}
</style> 