import {
  ScrollState as BaseScrollState,
  ScrollHandlers,
  initScrollTracking,
  updateScrollBoundaries,
  setupIntersectionObserver,
  calculateScrollProgress,
  trackAnimationCompletion,
  cleanup
} from '@/utils/scroll/scrollUtils';

export interface AccordionItem {
  id: number;
  title: string;
  description: string;
}

// Extend the base ScrollState to include accordion-specific properties
export interface ScrollState extends BaseScrollState {
  scrollAccordionEl: HTMLElement | null;
}

// Alias ScrollHandlers to maintain backward compatibility
export type Handlers = ScrollHandlers;

export function initAccordionScrollTracking(
  accordionsEl: HTMLElement,
  scrollState: ScrollState,
  handlers: Handlers,
  handleScroll: () => void
) {
  // Set up intersection observer to initialize only when in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('Accordion section entering viewport');
        
        // Initialize only when entering viewport
        scrollState.scrollAccordionEl = accordionsEl;
        
        const textElements = accordionsEl.querySelectorAll('.accordion .text') as NodeListOf<HTMLElement>;
        
        // Reset and store initial states
        textElements.forEach((text, index) => {
          text.dataset.originalHeight = `${text.scrollHeight}`;
          text.style.height = 'auto';
          text.style.opacity = '1';
          
          console.log(`Text element ${index} initialized on viewport entry:`, {
            originalHeight: text.dataset.originalHeight,
            currentHeight: text.style.height,
            opacity: text.style.opacity
          });
        });

        // Initialize scroll tracking
        initScrollTracking(
          accordionsEl,
          scrollState,
          handlers,
          handleScroll,
          { topOffset: 0.1, heightMultiplier: 2 }
        );

        // Disconnect observer after initialization
        observer.disconnect();
      }
    });
  }, {
    threshold: 0.1
  });

  // Start observing
  observer.observe(accordionsEl);
}

export function calculateAccordionProgress(
  overallProgress: number, 
  index: number, 
  totalAccordions: number
): number {
  const segmentSize = 1 / totalAccordions;
  const segmentStart = index * segmentSize;
  
  const progress = overallProgress > segmentStart 
    ? Math.min(1, (overallProgress - segmentStart) / segmentSize)
    : 0;

  console.log(`Accordion ${index} progress:`, {
    overallProgress,
    segmentSize,
    segmentStart,
    progress
  });
  
  return progress;
}

export function animateAccordionText(
  element: HTMLElement, 
  progress: number
) {
  // Get stored original height
  const originalHeight = parseInt(element.dataset.originalHeight || '0');
  
  // Calculate new dimensions
  const height = originalHeight * (1 - progress);
  const opacity = 1 - progress;
  
  console.log('Animating accordion text:', {
    originalHeight,
    calculatedHeight: height,
    progress,
    opacity
  });

  // Apply styles
  element.style.height = `${height}px`;
  element.style.opacity = opacity.toString();
  element.style.overflow = 'hidden';
  element.style.paddingBottom = `${(1 - progress) * 16}px`;
}

export function animateAccordionMargin(
  element: HTMLElement, 
  progress: number
) {
  if (!element) return;
  
  // Calculate margin (from original 40px to 10px)
  const marginBottom = 40 - (progress * 30);
  element.style.marginBottom = `${marginBottom}px`;
}

export function trackLastAccordionProgress(
  element: HTMLElement, 
  progress: number, 
  index: number, 
  total: number, 
  overallProgress: number
) {
  if (index === total - 1) {
    if (progress >= 0.99 && !element.dataset.fullyClosed) {
      console.log('Last accordion item is now fully closed!', {
        overallProgress,
        lastItemProgress: progress,
        timestamp: new Date().toISOString()
      });
      element.dataset.fullyClosed = 'true';
    } else if (progress < 0.99 && element.dataset.fullyClosed) {
      delete element.dataset.fullyClosed;
    }
  }
}

export function trackAccordionCompletion(
  scrollState: ScrollState,
  progress: number
) {
  if (!scrollState.scrollAccordionEl) return;
  
  trackAnimationCompletion(
    scrollState,
    progress,
    'accordions-closed',
    0.99
  );
}

// Re-export the generic utilities for backward compatibility
export {
  updateScrollBoundaries,
  setupIntersectionObserver,
  calculateScrollProgress,
  cleanup
};
