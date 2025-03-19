<script setup lang="ts">
import { ref, computed } from 'vue'

const themes = [
  { 
    name: 'theme-neon-horizon',
    gradient: 'linear-gradient(45deg, #1a1b26, #2E3440, #A3BE8C)',
    label: 'Neon Horizon'
  },
  { 
    name: 'theme-digital-sunset',
    gradient: 'linear-gradient(45deg, #2E3440, #4C566A, #B48EAD)',
    label: 'Digital Sunset'
  },
  { 
    name: 'theme-retro-wave',
    gradient: 'linear-gradient(45deg, #0f0f17, #1A1A1A, #FF4081)',
    label: 'Retro Wave'
  },
  { 
    name: 'theme-pastel-future',
    gradient: 'linear-gradient(45deg, #f8f9fa, #6A5ACD, #98FB98)',
    label: 'Pastel Future'
  }
];

const showThemes = ref(false);

// Combine all props into a single defineProps call
const props = defineProps({
  currentTheme: String,
  hideToggleButton: {
    type: Boolean,
    default: false
  }
});

const currentThemeGradient = computed(() => {
  return themes.find(theme => theme.name === props.currentTheme)?.gradient || themes[0].gradient;
});

const emit = defineEmits(['update:theme', 'update:currentTheme']);

const setTheme = (themeName: string) => {
  // Emit both events for compatibility
  emit('update:theme', themeName);
  emit('update:currentTheme', themeName);
  showThemes.value = false;
};

const toggleThemeList = () => {
  showThemes.value = !showThemes.value;
};
</script>

<template>
  <div class="theme-switcher">
    <button 
      v-if="!hideToggleButton"
      @click="toggleThemeList"
      class="theme-toggle-btn"
      :class="{ 'active': showThemes }"
      :style="{ '--current-theme-gradient': currentThemeGradient }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <circle cx="8" cy="16" r="4"/>
        <circle cx="16" cy="16" r="4"/>
      </svg>
    </button>

    <div 
      class="theme-list-container"
      :class="{ 'hidden': !showThemes && !hideToggleButton }"
    >
      <div class="theme-list">
        <button
          v-for="theme in themes"
          :key="theme.name"
          @click="setTheme(theme.name)"
          class="theme-list-item"
          :style="{ background: theme.gradient }"
        >
          <div class="flex items-center gap-3">
            <div 
              v-if="props.currentTheme === theme.name || props.currentTheme === theme.name.replace('theme-', '') || `theme-${props.currentTheme}` === theme.name"
              class="active-indicator"
            ></div>
            <span>{{ theme.label }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
