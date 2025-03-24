import { onMounted, onUnmounted, ref, watch } from 'vue';
import scrollDebugger from '@/utils/scroll/debug/ScrollDebugger';
import { formatDuration } from '@/utils/timestamp';

export interface UseScrollDebuggerOptions {
  sectionId: string;
  enabled?: boolean;
  observeElement?: boolean;
  threshold?: number;
}

export function useScrollDebugger(options: UseScrollDebuggerOptions) {
  const { 
    sectionId, 
    enabled = true, 
    observeElement = true,
    threshold = 0.1
  } = options;
  
  const elementRef = ref<HTMLElement | null>(null);
  const isVisible = ref(false);
  let observer: IntersectionObserver | null = null;
  
  // Register the section with the debugger
  onMounted(() => {
    if (!enabled) return;
    
    const timeSincePageLoad = scrollDebugger.getTimeSincePageLoad();
    console.log(`[ScrollDebugger] 🚀 Initializing for section: ${sectionId} (${timeSincePageLoad} since page load)`);
    
    scrollDebugger.registerSection(sectionId);
    
    // Create a watcher for the elementRef that will set up the observer when it becomes available
    if (observeElement) {
      const setupObserver = () => {
        if (!elementRef.value) {
          console.warn(`[ScrollDebugger] ⚠️ Element ref not available for section: ${sectionId}`);
          return false;
        }
        
        observer = new IntersectionObserver((entries) => {
          const [entry] = entries;
          
          if (entry.isIntersecting && !isVisible.value) {
            isVisible.value = true;
            const currentTimeSincePageLoad = scrollDebugger.getTimeSincePageLoad();
            console.log(`[ScrollDebugger] 👁️✨ Section visible: ${sectionId} (${currentTimeSincePageLoad} since page load)`);
            scrollDebugger.sectionVisible(sectionId, {
              intersectionRatio: entry.intersectionRatio,
              boundingClientRect: entry.boundingClientRect,
              timeSincePageLoad: currentTimeSincePageLoad
            });
          }
        }, {
          threshold
        });
        
        observer.observe(elementRef.value);
        return true;
      };
      
      // Try to set up immediately if element is available
      if (!setupObserver()) {
        // If not available, set up a watcher to try again when it becomes available
        watch(elementRef, (newValue) => {
          if (newValue) {
            setupObserver();
          }
        });
      }
    }
  });
  
  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });
  
  // Helper functions to log animation events
  const debugAnimation = {
    trigger: (componentId: string, details?: any) => {
      if (!enabled) return;
      scrollDebugger.animationTriggered(sectionId, componentId, {
        ...details,
        timeSincePageLoad: scrollDebugger.getTimeSincePageLoad()
      });
    },
    start: (componentId: string, details?: any) => {
      if (!enabled) return;
      scrollDebugger.animationStarted(sectionId, componentId, {
        ...details,
        timeSincePageLoad: scrollDebugger.getTimeSincePageLoad()
      });
    },
    complete: (componentId: string, details?: any) => {
      if (!enabled) return;
      scrollDebugger.animationCompleted(sectionId, componentId, {
        ...details,
        timeSincePageLoad: scrollDebugger.getTimeSincePageLoad()
      });
    },
    error: (componentId: string, message: string, details?: any) => {
      if (!enabled) return;
      scrollDebugger.logError(sectionId, componentId, message, {
        ...details,
        timeSincePageLoad: scrollDebugger.getTimeSincePageLoad()
      });
    },
    info: (componentId: string, message: string, details?: any) => {
      if (!enabled) return;
      scrollDebugger.logInfo(sectionId, componentId, message, {
        ...details,
        timeSincePageLoad: scrollDebugger.getTimeSincePageLoad()
      });
    }
  };
  
  return {
    elementRef,
    isVisible,
    debugAnimation
  };
}
