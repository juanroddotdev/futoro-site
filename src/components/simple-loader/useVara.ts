import { ref } from 'vue';

export function useVara() {
  const isVaraLoaded = ref(false);

  const loadVara = () => {
    return new Promise((resolve, reject) => {
      if (typeof window.Vara !== 'undefined') {
        isVaraLoaded.value = true;
        resolve(window.Vara);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/akzhy/vara@master/src/vara.min.js';
      script.async = true;
      script.onload = () => {
        isVaraLoaded.value = true;
        resolve(window.Vara);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  return {
    isVaraLoaded,
    loadVara
  };
}

// Add TypeScript type for Vara
declare global {
  interface Window {
    Vara: any;
  }
} 