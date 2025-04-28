<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="bg-background">
    <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
      <h2 class="text-center text-base/7 font-semibold text-primary">{{ title }}</h2>
      <p class="mx-auto mt-2 max-w-lg text-center text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">{{ description }}</p>
      
      <!-- Bento Grid Layout -->
      <div class="form-grid">
        
        <!-- Left Column (spans 2 rows) -->
        <div class="bento-cell bento-cell--span-2">
          <div class="bento-bg bento-bg--left-rounded"></div>
          <div class="bento-content bento-content--left-rounded">
            <div class="bento-header">
              <p>Left Column Header</p>
            </div>
            
            <div class="bento-body">
              <!-- Item 1 -->
              <div class="mock-item mb-6">
                <div class="mock-item-header">Item 1</div>
                <div class="mock-item-content"></div>
              </div>
              
              <!-- Item 2 -->
              <div class="mock-item mb-6">
                <div class="mock-item-header">Item 2</div>
                <div class="mock-item-content"></div>
              </div>
            </div>
          </div>
          <div class="bento-border bento-border--left-rounded"></div>
        </div>
        
        <!-- Top Right -->
        <div class="bento-cell bento-cell--row-1-mobile">
          <div class="bento-bg bento-bg--top-rounded-mobile"></div>
          <div class="bento-content bento-content--top-rounded-mobile">
            <div class="bento-header">
              <p>Top Right Header</p>
            </div>
            
            <div class="bento-body">
              <!-- Item 3 -->
              <div class="mock-item">
                <div class="mock-item-header">Item 3</div>
                <div class="mock-item-content"></div>
              </div>
            </div>
          </div>
          <div class="bento-border bento-border--top-rounded-mobile"></div>
        </div>
        
        <!-- Bottom Middle -->
        <div class="bento-cell bento-cell--row-3-mobile bento-cell--col-2 bento-cell--row-2">
          <div class="bento-bg"></div>
          <div class="bento-content">
            <div class="bento-header">
              <p>Bottom Middle Header</p>
            </div>
            
            <div class="bento-body">
              <!-- Item 4 -->
              <div class="mock-item">
                <div class="mock-item-header">Item 4</div>
                <div class="mock-item-content"></div>
              </div>
            </div>
          </div>
          <div class="bento-border"></div>
        </div>
        
        <!-- Right Column (spans 2 rows) -->
        <div class="bento-cell bento-cell--span-2">
          <div class="bento-bg bento-bg--right-rounded"></div>
          <div class="bento-content bento-content--right-rounded">
            <div class="bento-header">
              <p>Right Column Header</p>
            </div>
            
            <div class="bento-body">
              <!-- Item 5 -->
              <div class="mock-item">
                <div class="mock-item-header">Item 5</div>
                <div class="mock-item-content"></div>
              </div>
            </div>
          </div>
          <div class="bento-border bento-border--right-rounded"></div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mock-item {
  border: 2px dashed hsl(var(--muted-foreground));
  border-radius: var(--radius);
  padding: 1rem;
  
  &-header {
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
  }
  
  &-content {
    height: 4rem;
    background-color: hsl(var(--muted) / 0.3);
    border-radius: var(--radius);
  }
}
</style>
