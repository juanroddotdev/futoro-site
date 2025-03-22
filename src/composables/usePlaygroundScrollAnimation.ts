import { ref } from 'vue';

interface PlaygroundScrollAnimationOptions {
  onScroll: () => void;
  threshold?: number;
  rootMargin?: string;
}

export function usePlaygroundScrollAnimation(options: PlaygroundScrollAnimationOptions) {
  const { onScroll, threshold = 0.1, rootMargin = '0px' } = options;
  
  // Store observers for cleanup
  const observers = ref<IntersectionObserver[]>([]);
  
  // Set up intersection observers for scroll animations
  function setupScrollObservers(element: HTMLElement | null) {
    if (!element) return;
    
    // Create observer for section visibility
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const sectionId = entry.target.id;
          const activeClass = `${sectionId}-active`;
          
          if (entry.isIntersecting) {
            document.body.classList.add(activeClass);
            // Call the onScroll callback when the section is visible
            window.addEventListener('scroll', onScroll);
            // Initial call to set up animations
            onScroll();
          } else {
            document.body.classList.remove(activeClass);
            window.removeEventListener('scroll', onScroll);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );
    
    // Observe the section
    sectionObserver.observe(element);
    observers.value.push(sectionObserver);
  }
  
  // Clean up observers on component unmount
  function cleanupScrollObservers() {
    // Remove scroll event listeners
    window.removeEventListener('scroll', onScroll);
    
    // Disconnect all observers
    observers.value.forEach(observer => {
      observer.disconnect();
    });
    observers.value = [];
  }
  
  return {
    setupScrollObservers,
    cleanupScrollObservers
  };
}