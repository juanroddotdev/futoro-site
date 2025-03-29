<template>
  <SimpleLoader :heroContent="heroContent" @complete="onLoadComplete" />
  <GradientDefinitions />
  <div id="app" :class="[
    currentTheme,
    { 'theme-transition-active': isThemeTransitioning }
  ]" :style="appStyle">
    <Navbar v-if="!['WireframeDemo'].includes($route.name as string)" />
    <router-view :currentTheme="currentTheme" :heroContent="heroContent" />
    <ContactSection v-if="!['FloatingChatDemo', 'ChatSectionsDemo', 'Playground', 'WireframeDemo'].includes($route.name as string)" />
    <Footer v-if="!['WireframeDemo'].includes($route.name as string)" />
    <ThemeSwitcher :currentTheme="currentTheme" @update:currentTheme="handleThemeChange" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import ContactSection from './components/sections/ContactSection.vue';
import ThemeSwitcher from '@/components/ui/theme/ThemeSwitcher.vue';
import GradientDefinitions from '@/components/ui/GradientDefinitions.vue';
import SimpleLoader from '@/components/ui/loaders/SimpleLoader.vue';
import { useTheme } from './composables/useTheme';
import { HeroContent, getRandomHeroContent } from '@/data/heroContentData';

const route = useRoute();
const { currentTheme, isThemeTransitioning, handleThemeChange } = useTheme();
const isLoading = ref(true);
const heroContent = ref<HeroContent>(getRandomHeroContent());

const appStyle = computed(() => ({
  opacity: isLoading.value ? 0 : 1,
  transform: isLoading.value ? 'translateY(20px)' : 'none',
  transition: 'opacity 0.5s ease, transform 0.5s ease'
}));

const onLoadComplete = () => {
  isLoading.value = false;
};
</script>
