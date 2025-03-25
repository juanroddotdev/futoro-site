import { ref, onMounted, onUnmounted } from 'vue';

export function useAmbientTime(ambientMode: boolean) {
  const currentTime = ref('');
  const currentDate = ref('');
  let timeInterval: number | null = null;

  const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    currentDate.value = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  onMounted(() => {
    if (ambientMode) {
      updateTime();
      timeInterval = window.setInterval(updateTime, 60000);
    }
  });

  const cleanup = () => {
    if (timeInterval) {
      clearInterval(timeInterval);
      timeInterval = null;
    }
  };

  onUnmounted(cleanup);

  return {
    currentTime,
    currentDate,
    cleanup
  };
}
