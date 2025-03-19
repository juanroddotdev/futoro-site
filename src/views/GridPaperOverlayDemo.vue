<script setup lang="ts">
import GridPaperOverlayControls from '@/components/ui/GridPaperOverlayControls.vue';
</script>

<template>
  <div class="grid-paper-overlay-demo">
    <div class="header">
      <h1>Grid Paper Overlay Demo</h1>
      <p>Use the controls below to customize the grid paper overlay and generate code for your project.</p>
    </div>
    
    <GridPaperOverlayControls />
    
    <div class="documentation">
      <h2>Documentation</h2>
      
      <h3>Properties</h3>
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>theme</code></td>
            <td>string</td>
            <td>-</td>
            <td>Theme name to apply (neon-horizon, digital-sunset, retro-wave, pastel-future)</td>
          </tr>
          <tr>
            <td><code>pattern</code></td>
            <td>string</td>
            <td>'grid'</td>
            <td>Pattern type (grid, dots, diagonal-lines, diamonds, hexagons, checkerboard, stripes, circuit, blueprint)</td>
          </tr>
          <tr>
            <td><code>floating</code></td>
            <td>boolean</td>
            <td>false</td>
            <td>Enables floating animation effect</td>
          </tr>
          <tr>
            <td><code>spotlight</code></td>
            <td>boolean</td>
            <td>false</td>
            <td>Enables spotlight gradient effect</td>
          </tr>
          <tr>
            <td><code>spotlightCorner</code></td>
            <td>string</td>
            <td>'top-left'</td>
            <td>Position of spotlight (top-left, top-right, bottom-left, bottom-right)</td>
          </tr>
          <tr>
            <td><code>spotlightSize</code></td>
            <td>string</td>
            <td>'medium'</td>
            <td>Size of spotlight effect (small, medium, large)</td>
          </tr>
          <tr>
            <td><code>intensity</code></td>
            <td>string</td>
            <td>'medium'</td>
            <td>Intensity of the pattern (low, medium, high)</td>
          </tr>
          <tr>
            <td><code>fade</code></td>
            <td>boolean</td>
            <td>false</td>
            <td>Enables fade animation effect</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Usage Example</h3>
      <pre><code>&lt;GridPaperOverlay
  theme="neon-horizon"
  pattern="dots"
  :floating="true"
  :spotlight="true"
  spotlightCorner="bottom-right"
  spotlightSize="large"
  intensity="high"
  :fade="true"
&gt;
  &lt;div class="your-content"&gt;
    &lt;h2&gt;Your Content Here&lt;/h2&gt;
    &lt;p&gt;This content will appear above the grid background&lt;/p&gt;
  &lt;/div&gt;
&lt;/GridPaperOverlay&gt;</code></pre>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid-paper-overlay-demo {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    margin-bottom: 1rem;
  }
}

.documentation {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eaeaea;
  
  h2 {
    margin-bottom: 1.5rem;
  }
  
  h3 {
    margin: 2rem 0 1rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 2rem;
    
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #eaeaea;
    }
    
    th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
    
    code {
      background-color: #f5f5f5;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
    }
  }
  
  pre {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-family: monospace;
  }
}
</style>