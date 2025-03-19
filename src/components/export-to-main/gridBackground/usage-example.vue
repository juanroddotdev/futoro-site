<template>
  <div class="examples-container">
    <h2>Grid Paper Overlay Examples</h2>
    
    <div class="example">
      <h3>Grid Pattern (Default)</h3>
      <GridPaperOverlay theme="neon-horizon" pattern="grid">
        <div class="content-box">
          <h4>Grid Pattern</h4>
          <p>Classic graph paper style grid</p>
        </div>
      </GridPaperOverlay>
    </div>
    
    <div class="example">
      <h3>Dots Pattern</h3>
      <GridPaperOverlay theme="digital-sunset" pattern="dots" :floating="true">
        <div class="content-box">
          <h4>Dots Pattern</h4>
          <p>Evenly spaced dots with floating animation</p>
        </div>
      </GridPaperOverlay>
    </div>
    
    <div class="example">
      <h3>Diagonal Lines Pattern</h3>
      <GridPaperOverlay theme="retro-wave" pattern="diagonal-lines" :spotlight="true">
        <div class="content-box">
          <h4>Diagonal Lines Pattern</h4>
          <p>Diagonal lines with spotlight effect</p>
        </div>
      </GridPaperOverlay>
    </div>
    
    <div class="example">
      <h3>Diamonds Pattern</h3>
      <GridPaperOverlay theme="pastel-future" pattern="diamonds" :fade="true">
        <div class="content-box">
          <h4>Diamonds Pattern</h4>
          <p>Diamond grid with fade animation</p>
        </div>
      </GridPaperOverlay>
    </div>
    
    <div class="example">
      <h3>Hexagons Pattern</h3>
      <GridPaperOverlay theme="neon-horizon" pattern="hexagons" :floating="true" :spotlight="true">
        <div class="content-box">
          <h4>Hexagons Pattern</h4>
          <p>Honeycomb pattern with floating and spotlight effects</p>
        </div>
      </GridPaperOverlay>
    </div>
    
    <div class="example">
      <h3>Checkerboard Pattern</h3>
      <GridPaperOverlay theme="digital-sunset" pattern="checkerboard" intensity="high">
        <div class="content-box">
          <h4>Checkerboard Pattern</h4>
          <p>Classic checkerboard with high intensity</p>
        </div>
      </GridPaperOverlay>
    </div>
    
    <div class="example">
      <h3>Stripes Pattern</h3>
      <GridPaperOverlay theme="retro-wave" pattern="stripes" :floating="true" intensity="low">
        <div class="content-box">
          <h4>Stripes Pattern</h4>
          <p>Horizontal stripes with floating animation</p>
        </div>
      </GridPaperOverlay>
    </div>
    
    <div class="example">
      <h3>Circuit Pattern</h3>
      <GridPaperOverlay theme="pastel-future" pattern="circuit" :spotlight="true" spotlightCorner="bottom-right">
        <div class="content-box">
          <h4>Circuit Pattern</h4>
          <p>Circuit board style with spotlight effect</p>
        </div>
      </GridPaperOverlay>
    </div>
    
    <div class="example">
      <h3>Blueprint Pattern</h3>
      <GridPaperOverlay theme="neon-horizon" pattern="blueprint" :fade="true" :floating="true">
        <div class="content-box">
          <h4>Blueprint Pattern</h4>
          <p>Engineering blueprint style with fade and floating effects</p>
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
