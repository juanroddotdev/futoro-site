<template>
  <GradientDefinitions />
  <div id="app" :class="[
    currentTheme,
    { 'theme-transition-active': isThemeTransitioning }
  ]">
    <Navbar v-if="!['WireframeDemo'].includes($route.name as string)" />
    <router-view :currentTheme="currentTheme" />
    <ContactSection v-if="!['FloatingChatDemo', 'ChatSectionsDemo', 'Playground', 'WireframeDemo'].includes($route.name as string)" />
    <Footer v-if="!['WireframeDemo'].includes($route.name as string)" />
    <ThemeSwitcher :currentTheme="currentTheme" @update:currentTheme="handleThemeChange" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import ContactSection from './components/sections/ContactSection.vue';
import ThemeSwitcher from '@/components/ui/theme/ThemeSwitcher.vue';
import GradientDefinitions from '@/components/ui/GradientDefinitions.vue';
import { useTheme } from './composables/useTheme';

const route = useRoute();
const { currentTheme, isThemeTransitioning, handleThemeChange } = useTheme();
</script>
