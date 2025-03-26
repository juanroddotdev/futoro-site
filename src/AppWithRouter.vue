<template>
  <GradientDefinitions />
  <div id="app" :class="[
    currentTheme,
    { 'theme-transition-active': isThemeTransitioning }
  ]">
    <Navbar />
    <router-view :currentTheme="currentTheme" />
    <ContactSectionV2 v-if="!['FloatingChatDemo', 'ChatSectionsDemo', 'Playground'].includes($route.name as string)" />
    <Footer />
    <ThemeSwitcher :currentTheme="currentTheme" @update:currentTheme="handleThemeChange" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import ContactSectionV2 from './components/sections/ContactSectionV2.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import GradientDefinitions from '@/components/ui/GradientDefinitions.vue';
import { useTheme } from '@/composables/useTheme';

const route = useRoute();
const { currentTheme, isThemeTransitioning, handleThemeChange } = useTheme();
</script>
