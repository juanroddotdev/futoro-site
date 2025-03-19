<script setup lang="ts">
import { ref, computed } from 'vue';
import GridPaperOverlay from '@/components/export-to-main/gridBackground/GridPaperOverlay.vue';

// Available options
const themes = ['neon-horizon', 'digital-sunset', 'retro-wave', 'pastel-future'];
const patterns = [
  'grid', 'dots', 'diagonal-lines', 'diamonds', 
  'hexagons', 'checkerboard', 'stripes', 'circuit', 'blueprint'
];
const spotlightCorners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const spotlightSizes = ['small', 'medium', 'large'];
const intensities = ['low', 'medium', 'high'];

// Default settings
const settings = ref({
  theme: 'neon-horizon',
  pattern: 'grid',
  floating: false,
  spotlight: false,
  spotlightCorner: 'top-left',
  spotlightSize: 'medium',
  intensity: 'medium',
  fade: false
});

// Generate unique ID for the preview
const previewId = computed(() => 
  `preview-${settings.value.theme}-${settings.value.pattern}-${Date.now()}`
);

// Generate code snippet based on current settings
const codeSnippet = computed(() => {
  let code = `<GridPaperOverlay\n`;
  code += `  theme="${settings.value.theme}"\n`;
  code += `  pattern="${settings.value.pattern}"`;
  
  if (settings.value.floating) code += `\n  :floating="true"`;
  if (settings.value.spotlight) {
    code += `\n  :spotlight="true"`;
    code += `\n  spotlightCorner="${settings.value.spotlightCorner}"`;
    code += `\n  spotlightSize="${settings.value.spotlightSize}"`;
  }
  if (settings.value.intensity !== 'medium') {
    code += `\n  intensity="${settings.value.intensity}"`;
  }
  if (settings.value.fade) code += `\n  :fade="true"`;
  
  code += `\n>\n  <!-- Your content here -->\n</GridPaperOverlay>`;
  return code;
});

// Copy code to clipboard
const copyToClipboard = () => {
  navigator.clipboard.writeText(codeSnippet.value);
};
</script>

<template>
  <div class="grid-paper-overlay-controls">
    <div class="controls-panel">
      <h2>Grid Paper Overlay Controls</h2>
      
      <div class="control-group">
        <label>Theme</label>
        <select v-model="settings.theme">
          <option v-for="theme in themes" :key="theme" :value="theme">{{ theme }}</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Pattern</label>
        <select v-model="settings.pattern">
          <option v-for="pattern in patterns" :key="pattern" :value="pattern">{{ pattern }}</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="settings.floating">
          Floating Animation
        </label>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="settings.fade">
          Fade Animation
        </label>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="settings.spotlight">
          Spotlight Effect
        </label>
      </div>
      
      <div class="control-group" v-if="settings.spotlight">
        <label>Spotlight Corner</label>
        <select v-model="settings.spotlightCorner">
          <option v-for="corner in spotlightCorners" :key="corner" :value="corner">{{ corner }}</option>
        </select>
      </div>
      
      <div class="control-group" v-if="settings.spotlight">
        <label>Spotlight Size</label>
        <select v-model="settings.spotlightSize">
          <option v-for="size in spotlightSizes" :key="size" :value="size">{{ size }}</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Intensity</label>
        <select v-model="settings.intensity">
          <option v-for="intensity in intensities" :key="intensity" :value="intensity">{{ intensity }}</option>
        </select>
      </div>
      
      <div class="code-snippet">
        <h3>Code Snippet</h3>
        <pre><code>{{ codeSnippet }}</code></pre>
        <button @click="copyToClipboard" class="copy-button">Copy to Clipboard</button>
      </div>
    </div>
    
    <div class="preview-panel">
      <h3>Live Preview</h3>
      <GridPaperOverlay
        :key="previewId"
        :theme="settings.theme"
        :pattern="settings.pattern"
        :floating="settings.floating"
        :spotlight="settings.spotlight"
        :spotlightCorner="settings.spotlightCorner"
        :spotlightSize="settings.spotlightSize"
        :intensity="settings.intensity"
        :fade="settings.fade"
      >
        <div class="preview-content">
          <h2>Preview Content</h2>
          <p>This is how your content will look with the selected overlay settings.</p>
        </div>
      </GridPaperOverlay>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid-paper-overlay-controls {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
}

.controls-panel {
  flex: 1;
  padding: 1.5rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
}

.preview-panel {
  flex: 2;
  
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
}

.control-group {
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  select, input {
    padding: 0.5rem;
    width: 100%;
    max-width: 300px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
}

.code-snippet {
  margin-top: 2rem;
  
  pre {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-family: monospace;
  }
  
  .copy-button {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #4a5568;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #2d3748;
    }
  }
}

.preview-content {
  padding: 3rem;
  text-align: center;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  h2 {
    margin-bottom: 1rem;
  }
}
</style>