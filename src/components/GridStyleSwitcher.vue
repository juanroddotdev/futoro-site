<script setup lang="ts">
import { ref, onMounted, provide, computed } from 'vue';

const isOpen = ref(false);
const props = defineProps({
  hideToggleButton: {
    type: Boolean,
    default: false
  },
  currentPattern: {
    type: String,
    default: 'dots'
  },
  currentIntensity: {
    type: String,
    default: 'medium'
  },
  currentFloating: {
    type: Boolean,
    default: true
  },
  currentSpotlight: {
    type: Boolean,
    default: true
  },
  currentFade: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'update:pattern',
  'update:intensity',
  'update:floating',
  'update:spotlight',
  'update:fade'
]);

// Use computed properties for two-way binding
const pattern = computed({
  get: () => props.currentPattern,
  set: (value) => emit('update:pattern', value)
});

const intensity = computed({
  get: () => props.currentIntensity,
  set: (value) => emit('update:intensity', value)
});

const floating = computed({
  get: () => props.currentFloating,
  set: (value) => emit('update:floating', value)
});

const spotlight = computed({
  get: () => props.currentSpotlight,
  set: (value) => emit('update:spotlight', value)
});

const fade = computed({
  get: () => props.currentFade,
  set: (value) => emit('update:fade', value)
});

const patterns = [
  'grid', 'dots', 'diagonal-lines', 'diamonds', 
  'hexagons', 'checkerboard', 'stripes', 'circuit', 'blueprint'
];
const intensities = ['low', 'medium', 'high'];

// Provide these values to be consumed by GridPaperOverlay components
provide('gridPattern', pattern);
provide('gridIntensity', intensity);
provide('gridFloating', floating);
provide('gridSpotlight', spotlight);
provide('gridFade', fade);

const togglePanel = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="grid-style-switcher">
    <button 
      v-if="!hideToggleButton"
      @click="togglePanel" 
      class="toggle-button"
      :class="{ 'active': isOpen }"
    >
      <span class="icon">🔳</span>
    </button>
    
    <div class="panel" :class="{ 'open': isOpen || hideToggleButton }">
      <div class="panel-header" v-if="!hideToggleButton">
        <h3>Grid Style</h3>
        <button @click="togglePanel" class="close-button">×</button>
      </div>
      
      <div class="panel-content">
        <div class="control-group">
          <label>Pattern</label>
          <div class="pattern-buttons">
            <button 
              v-for="pat in patterns" 
              :key="pat"
              @click="pattern = pat"
              :class="{ 'active': pattern === pat }"
              :title="pat"
            >
              {{ pat.charAt(0).toUpperCase() }}
            </button>
          </div>
        </div>
        
        <div class="control-group">
          <label>Intensity</label>
          <div class="intensity-buttons">
            <button 
              v-for="int in intensities" 
              :key="int"
              @click="intensity = int"
              :class="{ 'active': intensity === int }"
            >
              {{ int }}
            </button>
          </div>
        </div>
        
        <div class="control-group toggles">
          <div class="toggle">
            <label>
              <input type="checkbox" v-model="floating">
              Floating
            </label>
          </div>
          
          <div class="toggle">
            <label>
              <input type="checkbox" v-model="spotlight">
              Spotlight
            </label>
          </div>
          
          <div class="toggle">
            <label>
              <input type="checkbox" v-model="fade">
              Fade
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid-style-switcher {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: "VT323", "Courier New", monospace;
}

.toggle-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff00cc, #3333ff);
  border: 3px solid #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &.active {
    background: linear-gradient(135deg, #3333ff, #ff00cc);
  }
}

.panel {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 280px;
  background: rgba(20, 20, 40, 0.9);
  border: 2px solid #ff00cc;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 0, 204, 0.5), 0 0 40px rgba(51, 51, 255, 0.3);
  padding: 15px;
  transform: translateY(20px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  color: white;
  
  &.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
  
  h3 {
    margin: 0;
    font-size: 20px;
    color: #ff00cc;
    text-shadow: 0 0 5px rgba(255, 0, 204, 0.7);
  }
  
  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    
    &:hover {
      color: #ff00cc;
    }
  }
}

.control-group {
  margin-bottom: 1rem;
  max-width: 100%; /* Ensure control groups don't exceed container width */
  
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

/* Add this to ensure the grid layout is responsive */
.grid-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  width: 100%;
}

.pattern-buttons, .intensity-buttons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  width: 300px;
  
  button {
    background: rgba(51, 51, 255, 0.2);
    border: 1px solid #3333ff;
    color: white;
    padding: 5px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(51, 51, 255, 0.4);
    }
    
    &.active {
      background: #3333ff;
      box-shadow: 0 0 10px rgba(51, 51, 255, 0.7);
    }
  }
}

.intensity-buttons {
  grid-template-columns: repeat(3, 1fr);
}

.toggles {
  display: flex;
  justify-content: space-between;
  width:300px;
  
  .toggle {
    label {
      display: flex;
      align-items: center;
      cursor: pointer;
      
      input {
        margin-right: 5px;
      }
    }
  }
}
</style>
