<script setup lang="ts">
import { ref } from 'vue'
import HeroSection from '@/components/playground/HeroSection.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

const props = defineProps<{
  currentTheme: string
}>()

const emit = defineEmits<{
  (e: 'update:currentTheme', value: string): void
}>()
</script>

<template>
  <div 
    class="playground-view min-h-screen relative" 
    :class="`theme-${currentTheme.replace('theme-', '')}`"
  >
    <ThemeSwitcher 
      :current-theme="currentTheme"
      @update:currentTheme="(theme) => emit('update:currentTheme', theme)"
    />
    <div class="main-content">
      <HeroSection 
        :current-theme="currentTheme.replace('theme-', '')"
        :floating="true"
        :spotlight="true"
      />
    </div>
  </div>
</template>

<style lang="scss">
@import '@/scss/playground/index';

.playground-view {
  position: relative;
  
  .main-content {
    position: relative;
    z-index: 1;
  }
}
</style>