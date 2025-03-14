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
  accordionsRef: HTMLElement,
  scrollState: ScrollState,
  handlers: Handlers,
  handleScroll: () => void
) {
  if (!accordionsRef) return;
  
  scrollState.scrollAccordionEl = accordionsRef.closest('.scroll-accordion') as HTMLElement;
  if (!scrollState.scrollAccordionEl) return;
  
  // Use the generic scroll tracking utility with accordion-specific element
  initScrollTracking(
    accordionsRef,
    scrollState,
    handlers,
    handleScroll,
    { topOffset: 0.1, heightMultiplier: 2 }
  );
}

export function calculateAccordionProgress(
  overallProgress: number, 
  index: number, 
  totalAccordions: number
): number {
  const segmentSize = 1 / totalAccordions;
  const segmentStart = index * segmentSize;
  
  // Map the overall progress to this accordion's segment
  if (overallProgress > segmentStart) {
    return Math.min(1, (overallProgress - segmentStart) / segmentSize);
  }
  return 0;
}

export function animateAccordionText(
  element: HTMLElement, 
  progress: number
) {
  // Store original height if not already stored
  if (!element.dataset.originalHeight && progress === 0) {
    element.dataset.originalHeight = `${element.scrollHeight}`;
  }
  
  const originalHeight = parseInt(element.dataset.originalHeight || '0');
  const height = originalHeight * (1 - progress);
  const opacity = 1 - progress;
  
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
