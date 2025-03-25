/**
 * Debug file for StickyScrollableCardsSection component
 */
import { watch } from 'vue';
import { createComponentDebugger } from '@/utils/scroll/debug/ComponentDebugger';

export function useStickyScrollableCardsDebug(config: any) {
  const { refs, state, methods, props, options } = config;
  
  // Create the debugger
  const componentDebugger = createComponentDebugger({
    componentName: 'StickyScrollableCardsSection',
    sectionId: `sticky-cards-${props.sectionId}`,
    enabled: options?.enabled ?? true,
    observeElements: {
      'section': {
        ref: refs.sectionRef,
        threshold: 0.1,
        trackStyles: true
      },
      'container': {
        ref: refs.scrollContainer,
        threshold: 0.1,
        trackStyles: true
      },
      'animationWrap': {
        ref: refs.animationWrap,
        threshold: 0.1,
        trackStyles: true,
        trackAttributes: ['style', 'class']
      }
    },
    trackAnimations: true,
    trackProps: true,
    props
  });
  
  // Initialize on component mount
  const init = () => {
    componentDebugger.init();
    
    // Watch for visibility changes
    watch(() => componentDebugger.visibilityState, (state) => {
      if (state && state.section) {
        componentDebugger.log('Section is now visible');
      }
      if (state && state.container) {
        componentDebugger.log('Container is now visible');
      }
    });
    
    // Watch for scroll progress
    if (state.scrollProgress) {
      watch(() => state.scrollProgress.value, (progress) => {
        componentDebugger.log('Scroll progress', { progress });
      });
    }
  };
  
  // Track animation states
  const trackAnimation = (animationState: string, details?: any) => {
    componentDebugger.trackAnimation(animationState, details);
  };
  
  // Log messages
  const log = (message: string, details?: any) => {
    componentDebugger.log(message, details);
  };
  
  // Clean up on unmount
  const cleanup = () => {
    componentDebugger.cleanup();
  };
  
  return {
    init,
    trackAnimation,
    log,
    cleanup,
    visibilityState: componentDebugger.visibilityState
  };
}