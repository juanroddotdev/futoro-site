import { ref, onMounted, onUnmounted, Ref } from 'vue';
import { ScrollTracker, ElementPosition, ScrollPosition } from '@/utils/scroll/core/ScrollTracker';

export interface UseScrollTrackerOptions {
  throttleMs?: number;
  debug?: boolean;
  observeResize?: boolean;
  plugins?: any[];
}

export function useScrollTracker(
  elementRef: Ref<HTMLElement | null>,
  options: UseScrollTrackerOptions = {}
) {
  const tracker = new ScrollTracker({
    throttleMs: options.throttleMs,
    debug: options.debug,
    observeResize: options.observeResize,
    plugins: options.plugins
  });
  
  const elementPosition = ref<ElementPosition | null>(null);
  const scrollPosition = ref<ScrollPosition>(tracker.getScrollPosition());
  
  onMounted(() => {
    if (elementRef.value) {
      tracker.trackElement(elementRef.value, {
        updateCallback: (position) => {
          elementPosition.value = position;
        }
      });
      
      // Initial position
      const position = tracker.getElementPosition(elementRef.value);
      if (position) {
        elementPosition.value = position;
      }
    }
    
    // Update scroll position on scroll
    window.addEventListener('scroll', () => {
      scrollPosition.value = tracker.getScrollPosition();
    }, { passive: true });
  });
  
  onUnmounted(() => {
    if (elementRef.value) {
      tracker.untrackElement(elementRef.value);
    }
    tracker.destroy();
  });
  
  return {
    elementPosition,
    scrollPosition,
    tracker
  };
}

export default useScrollTracker;