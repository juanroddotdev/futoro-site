import { ref, onMounted, onBeforeUnmount, reactive, computed, Ref } from 'vue';
import { throttle } from '@/utils/scroll/utils/performance';

export interface ElementPosition {
  x: number;
  y: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
  inView: boolean;
  progress: number;
  lastValidTop: number;
}

export function useElementTracker(
  elementRef: Ref<HTMLElement | null>,
  options: {
    throttleMs?: number;
    debug?: boolean;
    offset?: { top?: number; bottom?: number };
  } = {}
) {
  const { throttleMs = 100, debug = false, offset = { top: 0, bottom: 0 } } = options;
  
  const position = reactive<ElementPosition>({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    inView: false,
    progress: 0,
    lastValidTop: 0
  });
  
  const updatePosition = () => {
    if (!elementRef.value) {
      if (debug) console.log('Element ref is null, skipping position update');
      return;
    }
    
    try {
      const rect = elementRef.value.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Store current values
      const prevTop = position.top;
      const prevInView = position.inView;
      
      // Update position values
      position.x = rect.x;
      position.y = rect.y;
      position.top = rect.top;
      position.left = rect.left;
      position.bottom = rect.bottom;
      position.right = rect.right;
      position.width = rect.width;
      position.height = rect.height;
      
      // Check if element is in view (with offset)
      const topThreshold = -rect.height + (offset.top || 0);
      const bottomThreshold = windowHeight + (offset.bottom || 0);
      position.inView = rect.top < bottomThreshold && rect.bottom > topThreshold;
      
      // Calculate progress (0 when at top of viewport, 1 when at bottom)
      position.progress = Math.max(0, Math.min(1, 
        (rect.top - topThreshold) / (bottomThreshold - topThreshold - rect.height)
      ));
      
      // Handle the position jump at the end of scroll animations
      // If we detect a large jump (more than 1000px) and element was previously in view
      const jumpThreshold = 1000;
      if (prevInView && Math.abs(position.top - prevTop) > jumpThreshold) {
        // Keep the last valid position instead of the jumped value
        position.top = position.lastValidTop;
        
        if (debug) {
          console.log('Prevented position jump:', {
            prevTop,
            jumpedTop: rect.top,
            usingLastValid: position.lastValidTop
          });
        }
      } else if (position.inView) {
        // Update lastValidTop when element is in view and not jumping
        position.lastValidTop = position.top;
      }
      
      if (debug) {
        console.log('Element position updated:', { 
          top: position.top,
          bottom: position.bottom,
          inView: position.inView,
          progress: position.progress.toFixed(2)
        });
      }
    } catch (error) {
      console.error('Error updating element position:', error);
    }
  };
  
  // Throttle the update function for better performance
  const throttledUpdatePosition = throttle(updatePosition, throttleMs);
  
  onMounted(() => {
    // Initial position update
    updatePosition();
    
    // Add event listeners
    window.addEventListener('scroll', throttledUpdatePosition);
    window.addEventListener('resize', throttledUpdatePosition);
    
    // Update on any DOM changes that might affect position
    if (window.MutationObserver) {
      try {
        const observer = new MutationObserver(throttledUpdatePosition);
        if (elementRef.value && elementRef.value.parentElement) {
          observer.observe(elementRef.value.parentElement, {
            childList: true,
            subtree: true,
            attributes: true
          });
        }
      } catch (error) {
        console.error('Error setting up MutationObserver:', error);
      }
    }
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', throttledUpdatePosition);
    window.removeEventListener('resize', throttledUpdatePosition);
  });
  
  return {
    position
  };
}