<template>
  <div class="examples-container">
    <h2>Grid Paper Overlay Examples</h2>
    
    <div class="example">
      <h3>Basic Grid</h3>
      <GridPaperOverlay theme="neon-horizon">
        <div class="content-box">
          <h4>Basic Grid Background</h4>
          <p>Static grid with no animations</p>
        </div>
      </GridPaperOverlay>
    </div>
    
    <div class="example">
      <h3>Floating Grid</h3>
      <GridPaperOverlay theme="digital-sunset" :floating="true">
        <div class="content-box">
          <h4>Floating Grid Background</h4>
          <p>Grid with smooth floating animation</p>
        </div>
      </GridPaperOverlay>
    </div>
    
    <div class="example">
      <h3>Spotlight Grid</h3>
      <GridPaperOverlay theme="retro-wave" :spotlight="true">
        <div class="content-box">
          <h4>Spotlight Grid Background</h4>
          <p>Grid with spotlight effect</p>
        </div>
      </GridPaperOverlay>
    </div>
    
    <div class="example">
      <h3>Combined Effects</h3>
      <GridPaperOverlay theme="pastel-future" :floating="true" :spotlight="true">
        <div class="content-box">
          <h4>Combined Effects</h4>
          <p>Grid with both floating animation and spotlight</p>
        </div>
      </GridPaperOverlay>
    </div>
  </div>
</template>

<script setup lang="ts">
import GridPaperOverlay from './GridPaperOverlay.vue';
</script>

<style scoped>
.examples-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.example {
  margin-bottom: 2rem;
}

.content-box {
  padding: 3rem;
  text-align: center;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>