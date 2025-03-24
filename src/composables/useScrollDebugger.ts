import { onMounted, onUnmounted, ref } from 'vue';
import scrollDebugger from '@/utils/scroll/debug/ScrollDebugger';

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
    
    console.log(`[ScrollDebugger] 🚀 Initializing for section: ${sectionId}`);
    
    scrollDebugger.registerSection(sectionId);
    
    if (observeElement && elementRef.value) {
      observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting && !isVisible.value) {
          isVisible.value = true;
          console.log(`[ScrollDebugger] 👁️✨ Section visible: ${sectionId}`);
          scrollDebugger.sectionVisible(sectionId, {
            intersectionRatio: entry.intersectionRatio,
            boundingClientRect: entry.boundingClientRect
          });
        }
      }, {
        threshold
      });
      
      observer.observe(elementRef.value);
    } else {
      console.warn(`[ScrollDebugger] ⚠️ Element ref not available for section: ${sectionId}`);
    }
  });
  
  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });
  
  // Helper functions for component animations
  const debugAnimation = {
    triggered: (componentId: string, details?: any) => {
      console.log(`[ScrollDebugger] 🎯 Animation triggered: ${sectionId}/${componentId}`);
      scrollDebugger.animationTriggered(sectionId, componentId, details);
    },
    
    started: (componentId: string, details?: any) => {
      console.log(`[ScrollDebugger] 🚀 Animation started: ${sectionId}/${componentId}`);
      scrollDebugger.animationStarted(sectionId, componentId, details);
    },
    
    completed: (componentId: string, details?: any) => {
      console.log(`[ScrollDebugger] 🎉 Animation completed: ${sectionId}/${componentId}`);
      scrollDebugger.animationCompleted(sectionId, componentId, details);
    },
    
    info: (componentId: string, message: string, details?: any) => {
      console.log(`[ScrollDebugger] 🧠 Info: ${sectionId}/${componentId} - ${message}`);
      scrollDebugger.log('info', sectionId, componentId, message, details);
    },
    
    error: (componentId: string, message: string, details?: any) => {
      console.error(`[ScrollDebugger] 🔥 Error: ${sectionId}/${componentId} - ${message}`);
      scrollDebugger.log('error', sectionId, componentId, message, details);
    },
    
    registerComponent: (componentId: string) => {
      console.log(`[ScrollDebugger] 📝 Registering component: ${sectionId}/${componentId}`);
      scrollDebugger.registerComponent(sectionId, componentId);
    }
  };
  
  return {
    elementRef,
    isVisible,
    debugAnimation
  };
}
