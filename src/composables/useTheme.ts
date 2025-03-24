import { ref, readonly } from 'vue';

// Create a singleton instance for the theme
const currentTheme = ref('theme-neon-horizon');
const isThemeTransitioning = ref(false);

export function useTheme() {
  const handleThemeChange = (newTheme: string) => {
    if (currentTheme.value === newTheme) return;

    isThemeTransitioning.value = true;
    document.documentElement.classList.add('theme-transition-active');

    setTimeout(() => {
      currentTheme.value = newTheme;
    }, 50);

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition-active');
      isThemeTransitioning.value = false;
    }, 800);
  };

  return {
    currentTheme: readonly(currentTheme),
    isThemeTransitioning: readonly(isThemeTransitioning),
    handleThemeChange
  };
}