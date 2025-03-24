/**
 * Debug file for FlexibleContentWithPhone component
 * Import this file only when debugging is needed
 */
import { watch } from 'vue';
import { createComponentDebugger } from '@/utils/scroll/debug/ComponentDebugger';

// Updated to accept a configuration object
export function useFlexibleContentDebug(config: any) {
  const { refs, state, methods, props, options } = config;
  
  // Create the debugger
  const componentDebugger = createComponentDebugger({
    componentName: 'FlexibleContentWithPhone',
    sectionId: `flexible-content-${props.sectionId}`,
    enabled: options?.enabled ?? true,
    observeElements: {
      'section': {
        ref: refs.sectionRef,
        threshold: 0.1,
        trackStyles: true
      },
      'content': {
        ref: refs.contentRef,
        threshold: 0.1,
        trackStyles: true
      },
      'phone': {
        ref: refs.phoneAreaRef,
        threshold: 0.1,
        trackStyles: true
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
      if (state && state.section && props.initiallyHidden && !config.state.animationStarted.value) {
        componentDebugger.log('Section is now visible, starting animations');
        config.methods.startAnimations();
      }
    });
  };
  
  // Track animation events
  const trackAnimation = (status: string, details?: any) => {
    componentDebugger.trackAnimation('main', status, details);
  };
  
  return {
    init,
    log: componentDebugger.log,
    error: componentDebugger.error,
    trackAnimation,
    cleanup: componentDebugger.cleanup
  };
}
