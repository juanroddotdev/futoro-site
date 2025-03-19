export interface ScrollState {
  startPosition: number;
  endPosition: number;
  progress: number;
  element: HTMLElement | null;
}

export interface ScrollHandlers {
  observer: IntersectionObserver | null;
  scrollListener: (() => void) | null;
  resizeListener: (() => void) | null;
}

/**
 * Initializes scroll tracking for an element
 */
export function initScrollTracking(
  targetElement: HTMLElement,
  scrollState: ScrollState,
  handlers: ScrollHandlers,
  handleScroll: () => void,
  options = { topOffset: 0.1, heightMultiplier: 2 }
) {
  if (!targetElement) return;
  
  scrollState.element = targetElement;
  
  // Calculate scroll boundaries
  updateScrollBoundaries(targetElement, scrollState, options);
  
  // Apply sticky positioning if needed
  targetElement.style.position = 'sticky';
  targetElement.style.top = `${options.topOffset * 100}%`;
  
  // Set up intersection observer
  setupIntersectionObserver(scrollState, handlers, handleScroll);
  
  // Add resize listener to recalculate boundaries when window size changes
  handlers.resizeListener = () => {
    updateScrollBoundaries(targetElement, scrollState, options);
  };
  window.addEventListener('resize', handlers.resizeListener);
  
  // Initial animation state
  handleScroll();
}

/**
 * Updates the scroll boundaries for an element
 */
export function updateScrollBoundaries(
  targetElement: HTMLElement,
  scrollState: ScrollState,
  options = { topOffset: 0.1, heightMultiplier: 2 }
) {
  if (!targetElement || !scrollState.element) return;
  
  const rect = targetElement.getBoundingClientRect();
  scrollState.startPosition = window.scrollY + rect.top - window.innerHeight * options.topOffset;
  scrollState.endPosition = scrollState.startPosition + rect.height * options.heightMultiplier;
}

/**
 * Sets up an intersection observer for scroll tracking
 */
export function setupIntersectionObserver(
  scrollState: ScrollState,
  handlers: ScrollHandlers,
  handleScroll: () => void,
  threshold = 0.1
) {
  if (!scrollState.element) return;
  
  handlers.observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Add scroll listener when element is in view
      if (!handlers.scrollListener) {
        handlers.scrollListener = handleScroll;
        window.addEventListener('scroll', handlers.scrollListener);
      }
    } else {
      // Remove scroll listener when element is out of view
      if (handlers.scrollListener) {
        window.removeEventListener('scroll', handlers.scrollListener);
        handlers.scrollListener = null;
      }
    }
  }, { threshold });
  
  handlers.observer.observe(scrollState.element);
}

/**
 * Calculates scroll progress (0 to 1) based on current scroll position
 */
export function calculateScrollProgress(
  scrollState: ScrollState
): number {
  const currentScroll = window.scrollY;
  
  if (currentScroll >= scrollState.startPosition && currentScroll <= scrollState.endPosition) {
    return (currentScroll - scrollState.startPosition) / 
           (scrollState.endPosition - scrollState.startPosition);
  } else if (currentScroll > scrollState.endPosition) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * Tracks animation completion and dispatches an event
 */
export function trackAnimationCompletion(
  scrollState: ScrollState,
  progress: number,
  eventName = 'animation-completed',
  completionThreshold = 0.99
) {
  if (!scrollState.element) return;
  
  if (progress >= completionThreshold && !scrollState.element.dataset.animationCompleted) {
    console.log(`Animation completed at ${progress}`, {
      timestamp: new Date().toISOString()
    });
    
    // Dispatch a custom event
    const event = new CustomEvent(eventName, { 
      detail: { timestamp: new Date().toISOString(), progress } 
    });
    scrollState.element.dispatchEvent(event);
    
    scrollState.element.dataset.animationCompleted = 'true';
  } else if (progress < completionThreshold && scrollState.element.dataset.animationCompleted) {
    delete scrollState.element.dataset.animationCompleted;
  }
}

/**
 * Cleans up all event listeners and observers
 */
export function cleanup(handlers: ScrollHandlers) {
  if (handlers.scrollListener) {
    window.removeEventListener('scroll', handlers.scrollListener);
  }
  
  if (handlers.resizeListener) {
    window.removeEventListener('resize', handlers.resizeListener);
  }
  
  if (handlers.observer) {
    handlers.observer.disconnect();
  }
}