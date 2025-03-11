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

const props = defineProps<{
  currentTheme: string
}>();

const currentThemeGradient = computed(() => {
  return themes.find(theme => theme.name === props.currentTheme)?.gradient || themes[0].gradient;
});

const emit = defineEmits<{
  (e: 'update:currentTheme', value: string): void
}>();

const setTheme = (themeName: string) => {
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
      @click="toggleThemeList"
      class="theme-toggle-btn"
      :class="{ 'active': showThemes }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <circle cx="8" cy="16" r="4"/>
        <circle cx="16" cy="16" r="4"/>
      </svg>
    </button>

    <div 
      v-show="showThemes"
      class="theme-list-container"
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
.theme-switcher {
  @apply fixed bottom-4 right-4 z-50;

  .theme-toggle-btn {
    @apply w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    position: relative;
    color: inherit;
    
    // Create pseudo-element for the gradient border
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 50%;
      padding: 2px;
      background: v-bind('currentThemeGradient');
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
    
    &.active {
      @apply bg-opacity-20;
      transform: rotate(180deg);
    }

    &:hover {
      @apply bg-opacity-20;
    }

    svg {
      @apply w-6 h-6;
    }
  }

  .theme-list-container {
    @apply absolute bottom-full right-0 mb-2;
    min-width: 200px;
  }

  .theme-list {
    @apply flex flex-col gap-2 p-2;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px);
    border-radius: 8px;
    animation: slideIn 0.2s ease-out;
  }

  .theme-list-item {
    @apply w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition-all duration-300;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

    .active-indicator {
      @apply w-2 h-2 rounded-full bg-white;
    }

    &:hover {
      opacity: 0.9;
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>