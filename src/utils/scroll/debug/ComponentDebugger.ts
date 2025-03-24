/**
 * ComponentDebugger
 * A utility for debugging components without cluttering component code
 */
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import ScrollDebugger from './ScrollDebugger';

export interface ComponentDebugOptions {
  componentName: string;
  sectionId: string;
  enabled?: boolean;
  observeElements?: {
    [key: string]: { // element identifier
      ref: any; // Vue ref to the element
      threshold?: number;
      trackStyles?: boolean; // Whether to track style changes
      trackAttributes?: string[]; // Specific attributes to track
    }
  };
  trackAnimations?: boolean;
  trackProps?: boolean;
  props?: Record<string, any>;
}

export function createComponentDebugger(options: ComponentDebugOptions) {
  if (!options.enabled) {
    // Return no-op functions when debugging is disabled
    return {
      init: () => {},
      log: () => {},
      error: () => {},
      trackElement: () => {},
      trackAnimation: () => {},
      cleanup: () => {}
    };
  }

  const { componentName, sectionId } = options;
  const debugId = `${sectionId}-${componentName}`;
  
  // Initialize ScrollDebugger
  ScrollDebugger.registerSection(sectionId);
  ScrollDebugger.registerComponent(sectionId, componentName);
  
  // Track element observers
  const observers: { [key: string]: IntersectionObserver | MutationObserver } = {};
  const visibilityState = ref<{ [key: string]: boolean }>({});
  
  // Initialize function to be called in onMounted
  const init = () => {
    ScrollDebugger.logInfo(sectionId, componentName, 'Component initialized', {
      options,
      timestamp: new Date().toISOString()
    });
    
    if (options.trackProps && options.props) {
      ScrollDebugger.logInfo(sectionId, componentName, 'Props', options.props);
    }
    
    // Set up element observers after DOM is ready
    nextTick(() => {
      if (options.observeElements) {
        Object.entries(options.observeElements).forEach(([elementId, config]) => {
          trackElement(elementId, config);
        });
      }
    });
  };
  
  // Track element visibility and attributes
  const trackElement = (elementId: string, config: any) => {
    const element = config.ref.value;
    if (!element) {
      ScrollDebugger.logError(sectionId, componentName, `Element not found: ${elementId}`);
      return;
    }
    
    // Track visibility with IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const isVisible = entry.isIntersecting;
          visibilityState.value[elementId] = isVisible;
          
          ScrollDebugger.logInfo(
            sectionId, 
            componentName, 
            `Element ${elementId} is ${isVisible ? 'visible' : 'hidden'}`,
            { 
              boundingRect: entry.boundingClientRect,
              intersectionRatio: entry.intersectionRatio
            }
          );
        });
      },
      { threshold: config.threshold || 0.1 }
    );
    
    observer.observe(element);
    observers[`visibility-${elementId}`] = observer;
    
    // Track style/attribute changes with MutationObserver if requested
    if (config.trackStyles || config.trackAttributes) {
      const styleObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'style' && config.trackStyles) {
            const style = (mutation.target as HTMLElement).style;
            ScrollDebugger.logInfo(
              sectionId,
              componentName,
              `Element ${elementId} style changed`,
              {
                opacity: style.opacity,
                visibility: style.visibility,
                display: style.display,
                transform: style.transform
              }
            );
          } else if (config.trackAttributes?.includes(mutation.attributeName || '')) {
            ScrollDebugger.logInfo(
              sectionId,
              componentName,
              `Element ${elementId} attribute changed: ${mutation.attributeName}`,
              {
                newValue: (mutation.target as HTMLElement).getAttribute(mutation.attributeName || '')
              }
            );
          }
        });
      });
      
      styleObserver.observe(element, { 
        attributes: true, 
        attributeFilter: [
          'style', 
          ...(config.trackAttributes || [])
        ] 
      });
      
      observers[`style-${elementId}`] = styleObserver;
    }
  };
  
  // Track animation events
  const trackAnimation = (animationId: string, status: string, details?: any) => {
    ScrollDebugger.logInfo(
      sectionId,
      componentName,
      `Animation ${animationId}: ${status}`,
      details
    );
  };
  
  // Logging helpers
  const log = (message: string, details?: any) => {
    ScrollDebugger.logInfo(sectionId, componentName, message, details);
  };
  
  const error = (message: string, details?: any) => {
    ScrollDebugger.logError(sectionId, componentName, message, details);
  };
  
  // Cleanup function to be called in onUnmounted
  const cleanup = () => {
    Object.values(observers).forEach(observer => {
      if (observer instanceof IntersectionObserver || observer instanceof MutationObserver) {
        observer.disconnect();
      }
    });
    
    ScrollDebugger.logInfo(sectionId, componentName, 'Component cleanup', {
      timestamp: new Date().toISOString()
    });
  };
  
  return {
    init,
    log,
    error,
    trackElement,
    trackAnimation,
    cleanup,
    visibilityState
  };
}