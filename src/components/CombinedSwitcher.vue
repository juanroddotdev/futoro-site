<script setup lang="ts">
import { ref, computed, inject, provide } from 'vue';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import GridStyleSwitcher from '@/components/GridStyleSwitcher.vue';

// Define interface for overlay type
interface Overlay {
  id: string;
  name: string;
  settings: Record<string, any>;
}

// Props to receive overlay configurations from parent
const props = defineProps({
  overlays: {
    type: Array,
    default: () => [],
    required: true
  },
  selectedOverlayId: {
    type: String,
    default: ''
  },
  currentTheme: {
    type: String,
    default: 'theme-neon-horizon'
  }
});

// State management
const isPanelOpen = ref(false);
const activePanel = ref(''); // Empty string initially instead of 'theme'

// Emit events for changes
const emit = defineEmits([
  'update:selectedOverlayId',
  'update:overlay',
  'update:currentTheme'
]);

// Track the selected overlay
const selectedId = computed({
  get: () => props.selectedOverlayId,
  set: (value) => emit('update:selectedOverlayId', value)
});

// Select an overlay
const selectOverlay = (id: string) => {
  selectedId.value = id;
};

// Toggle panel open/closed
const togglePanel = () => {
  if (isPanelOpen.value) {
    // If panel is open, close it
    isPanelOpen.value = false;
    activePanel.value = '';
  } else {
    // If panel is closed, just show the pill buttons
    isPanelOpen.value = true;
  }
};

// Close panel
const closePanel = () => {
  isPanelOpen.value = false;
};

// Activate theme panel
const activateThemePanel = () => {
  activePanel.value = 'theme';
  isPanelOpen.value = true;
};

// Activate grid panel
const activateGridPanel = () => {
  console.log('Grid panel activated');
  console.log('Current selected overlay ID:', selectedId.value);
  console.log('Current overlay settings:', selectedOverlay.value?.settings);
  console.log('Available overlays:', props.overlays);
  
  activePanel.value = 'grid';
  isPanelOpen.value = true;
};

// Get the currently selected overlay
const selectedOverlay = computed(() => {
  return props.overlays.find((overlay: Overlay) => overlay.id === selectedId.value) || null;
});

// Update settings for the selected overlay
const updateSetting = (property: string, value: any) => {
  if (!selectedOverlay.value) return;
  
  console.log(`Updating ${property} to:`, value);
  console.log('Before update, overlay settings:', selectedOverlay.value.settings);
  
  const updatedOverlay = {
    ...selectedOverlay.value,
    settings: {
      ...selectedOverlay.value.settings,
      [property]: value
    }
  };
  
  console.log('After update, overlay settings:', updatedOverlay.settings);
  emit('update:overlay', updatedOverlay);
  
  // Dispatch a custom event to notify GridPaperOverlay components
  console.log('Dispatching overlay-updated event for ID:', updatedOverlay.id);
  document.documentElement.dispatchEvent(
    new CustomEvent('overlay-updated', { 
      detail: { 
        id: updatedOverlay.id,
        settings: updatedOverlay.settings
      } 
    })
  );
};

// Helper methods for specific settings
const updateTheme = (theme: string) => {
  console.log('CombinedSwitcher updateTheme called with:', theme);
  
  // Check if theme already has the 'theme-' prefix
  const themeValue = theme.startsWith('theme-') ? theme.replace('theme-', '') : theme;
  
  // Update the overlay's theme setting with the base theme name (without prefix)
  updateSetting('theme', themeValue);
  
  // Ensure we're using the properly formatted theme name for the event
  const formattedTheme = theme.startsWith('theme-') ? theme : `theme-${theme}`;
  
  console.log('Emitting update:currentTheme with:', formattedTheme);
  
  // Emit the theme change event to App.vue
  emit('update:currentTheme', formattedTheme);
  
  // Dispatch a custom event for global theme change
  document.documentElement.dispatchEvent(
    new CustomEvent('theme-changed', { 
      detail: { theme: formattedTheme } 
    })
  );
};
const updatePattern = (pattern: string) => {
  console.log('Pattern update requested:', pattern);
  updateSetting('pattern', pattern);
};
const updateIntensity = (intensity: string) => updateSetting('intensity', intensity);
const updateFloating = (floating: boolean) => updateSetting('floating', floating);
const updateSpotlight = (spotlight: boolean) => updateSetting('spotlight', spotlight);
const updateFade = (fade: boolean) => updateSetting('fade', fade);
</script>

<template>
  <div class="combined-switcher">
    <button 
      @click="togglePanel" 
      class="toggle-button"
      :class="{ 'active': isPanelOpen }"
    >
      <svg class="spiral-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,1C5.9,1,1,5.9,1,12s4.9,11,11,11s11-4.9,11-11S18.1,1,12,1z M12,21c-5,0-9-4-9-9s4-9,9-9s9,4,9,9S17,21,12,21z" />
        <path d="M12,7c-2.8,0-5,2.2-5,5s2.2,5,5,5s5-2.2,5-5S14.8,7,12,7z M12,15c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S13.7,15,12,15z" />
        <path d="M12,11c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S12.6,11,12,11z" />
      </svg>
    </button>
    
    <div class="pill-container" :class="{ 'expanded': isPanelOpen }">
      <button 
        @click="activateThemePanel" 
        class="pill-button"
        :class="{ 'active': activePanel === 'theme' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <circle cx="8" cy="16" r="4"/>
          <circle cx="16" cy="16" r="4"/>
        </svg>
      </button>
      
      <button 
        @click="activateGridPanel" 
        class="pill-button"
        :class="{ 'active': activePanel === 'grid' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
      </button>
    </div>
    
    <div class="panel theme-panel" :class="{ 'expanded': isPanelOpen && activePanel === 'theme' }">
      <div class="panel-header">
        <h3>Theme Settings</h3>
        <button @click="closePanel" class="close-button">×</button>
      </div>
      
      <div class="panel-content">
        <div v-if="selectedOverlay" class="theme-content">
          <ThemeSwitcher 
            :hideToggleButton="true"
            :currentTheme="currentTheme" 
            @update:theme="updateTheme"/> <!-- Note: check if this should be @update:currentTheme instead -->
          />
        </div>
      </div>
    </div>
    
    <div class="panel grid-panel" :class="{ 'expanded': isPanelOpen && activePanel === 'grid' }">
      <div class="panel-header">
        <h3>Grid Settings</h3>
        <button @click="closePanel" class="close-button">×</button>
      </div>
      
      <div class="panel-content">
        <!-- Move overlay selector to grid panel -->
        <div class="overlay-selector" v-if="props.overlays.length > 1">
          <label>Select Background:</label>
          <div class="overlay-buttons">
            <button 
              v-for="overlay in props.overlays" 
              :key="overlay.id"
              @click="selectOverlay(overlay.id)"
              :class="{ 'active': selectedId === overlay.id }"
            >
              {{ overlay.name }}
            </button>
          </div>
        </div>
        
        <div v-if="selectedOverlay" class="grid-content">
          <GridStyleSwitcher 
            :hideToggleButton="true"
            :currentPattern="selectedOverlay.settings.pattern"
            :currentIntensity="selectedOverlay.settings.intensity"
            :currentFloating="selectedOverlay.settings.floating"
            :currentSpotlight="selectedOverlay.settings.spotlight"
            :currentFade="selectedOverlay.settings.fade"
            @update:pattern="updatePattern"
            @update:intensity="updateIntensity"
            @update:floating="updateFloating"
            @update:spotlight="updateSpotlight"
            @update:fade="updateFade"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.combined-switcher {
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
  background: rgba(20, 20, 40, 0.8);
  border: 2px solid #ff00cc;
  box-shadow: 0 0 15px rgba(255, 0, 204, 0.5), 0 0 30px rgba(51, 51, 255, 0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  position: relative;
  z-index: 10;
  
  &.active {
    transform: rotate(180deg);
    box-shadow: 0 0 20px rgba(255, 0, 204, 0.7), 0 0 40px rgba(51, 51, 255, 0.5);
  }
  
  .spiral-icon {
    width: 30px;
    height: 30px;
    fill: none;
    stroke: white;
    stroke-width: 1.5;
    transition: all 0.4s ease;
    
    path {
      transform-origin: center;
    }
  }
  
  &:hover .spiral-icon {
    transform: rotate(90deg);
  }
  
  &.active .spiral-icon {
    transform: rotate(360deg);
  }
}

.pill-container {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  background: rgba(20, 20, 40, 0.8);
  border-radius: 50px;
  padding: 5px;
  border: 2px solid #ff00cc;
  box-shadow: 0 0 15px rgba(255, 0, 204, 0.5), 0 0 30px rgba(51, 51, 255, 0.3);
  width: 50px;
  height: 50px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  overflow: hidden;
  
  &.expanded {
    width: 110px;
    opacity: 1;
    visibility: visible;
  }
}

.pill-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin: 0 2px;
  border: none;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background: linear-gradient(135deg, #ff00cc, #3333ff);
  }
}

.panel {
  position: absolute;
  bottom: 60px;
  right: 0;
  min-width: 320px;
  width: max-content;
  max-width: 500px;
  background: rgba(20, 20, 40, 0.9);
  border: 2px solid #ff00cc;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 0, 204, 0.5), 0 0 40px rgba(51, 51, 255, 0.3);
  padding: 0;
  max-height: 0;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  color: white;
  overflow: hidden;
  transform: translateY(20px);
  
  &.expanded {
    padding: 15px;
    max-height: 500px;
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 0, 204, 0.3);
  padding-bottom: 10px;
  
  h3 {
    margin: 0;
    font-size: 1.2rem;
    background: linear-gradient(135deg, #ff00cc, #3333ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .close-button {
    background: transparent;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(255, 0, 204, 0.2);
    }
  }
}

.overlay-selector {
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .overlay-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
    
    button {
      background: rgba(51, 51, 255, 0.2);
      border: 1px solid #3333ff;
      color: white;
      padding: 8px;
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
}

// Override child component styles
:deep(.theme-switcher),
:deep(.grid-style-switcher) {
  position: static;
  width: 100%;
  
  .toggle-button {
    display: none;
  }
  
  .panel,
  .theme-list-container {
    position: static;
    transform: none;
    opacity: 1;
    visibility: visible;
    width: 100%;
    margin-top: 0;
    box-shadow: none;
    border: none;
    background: transparent;
    max-width: none;
  }
}
</style>
