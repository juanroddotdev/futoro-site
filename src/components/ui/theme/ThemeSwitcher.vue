<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from '@/composables/useTheme';

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
  },
  // New themes
  { 
    name: 'theme-cyber-bloom',
    gradient: 'linear-gradient(45deg, #1A1A2E, #C792EA, #64FFDA)',
    label: 'Cyber Bloom'
  },
  { 
    name: 'theme-quantum-leap',
    gradient: 'linear-gradient(45deg, #222F3E, #84CEEB, #A0E7E5)',
    label: 'Quantum Leap'
  },
  { 
    name: 'theme-pixel-nebula',
    gradient: 'linear-gradient(45deg, #121212, #4A148C, #9FA8DA)',
    label: 'Pixel Nebula'
  },
  { 
    name: 'theme-circuit-dusk',
    gradient: 'linear-gradient(45deg, #263238, #90A4AE, #AED581)',
    label: 'Circuit Dusk'
  },
  { 
    name: 'theme-professional-edge',
    gradient: 'linear-gradient(45deg, #2E3440, #434C5E, #88C0D0)',
    label: 'Professional Edge'
  }
];

const showThemes = ref(false);
const { currentTheme, handleThemeChange } = useTheme();

const currentThemeGradient = computed(() => {
  return themes.find(theme => theme.name === currentTheme.value)?.gradient || themes[0].gradient;
});

const setTheme = (themeName: string) => {
  handleThemeChange(themeName);
  showThemes.value = false;
};

const toggleThemeList = () => {
  showThemes.value = !showThemes.value;
};
</script>

<template>
  <div class="theme-switcher">
    <button 
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
      :class="{ 'hidden': !showThemes }"
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
              v-if="currentTheme === theme.name"
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
