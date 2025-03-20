import { ref } from 'vue';

interface ScrollAnimationOptions {
  onScroll: () => void;
  threshold?: number;
  rootMargin?: string;
}

export function useScrollAnimation(options: ScrollAnimationOptions) {
  const observers = ref<IntersectionObserver[]>([]);
  
  // Set up intersection observers for sections
  function setupScrollObservers(
    hurdlesSection: HTMLElement | null, 
    solutionsSection: HTMLElement | null
  ) {
    if (!hurdlesSection || !solutionsSection) return;
    
    // Observer options
    const observerOptions = { 
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px' 
    };
    
    // Hurdles section observer
    const hurdlesObserver = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        document.body.classList.add('hurdles-active');
        document.body.classList.remove('solutions-active');
      } else {
        document.body.classList.remove('hurdles-active');
      }
    }, observerOptions);
    
    // Solutions section observer
    const solutionsObserver = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        document.body.classList.add('solutions-active');
        document.body.classList.remove('hurdles-active');
      } else {
        document.body.classList.remove('solutions-active');
      }
    }, observerOptions);
    
    // Observe sections
    hurdlesObserver.observe(hurdlesSection);
    solutionsObserver.observe(solutionsSection);
    
    // Store observers for cleanup
    observers.value = [hurdlesObserver, solutionsObserver];
  }
  
  // Clean up observers
  function cleanupScrollObservers() {
    observers.value.forEach(observer => observer.disconnect());
    observers.value = [];
  }
  
  return {
    setupScrollObservers,
    cleanupScrollObservers
  };
}