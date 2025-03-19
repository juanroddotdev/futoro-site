// Types
export interface Elements {
  hurdlesSection: HTMLElement;
  solutionsSection: HTMLElement;
  hurdlesContainer: HTMLElement;
  solutionsContainer: HTMLElement;
}

export interface Config {
  observerThreshold: number;
  viewportPadding: number;
  transitionDuration: number;
  // Add class names as configuration
  classNames: {
    hurdlesActiveClass: string;
    solutionsActiveClass: string;
    cardSelector: string;
  };
}

export interface State {
  hurdlesScrollWidth: number;
  solutionsScrollWidth: number;
  isHurdlesSectionComplete: boolean;
}

// Initialize the progressive reveal functionality
export function initProgressiveReveal(elements: Elements, config: Config): () => void {
  // Set default class names if not provided
  const classNames = {
    hurdlesActiveClass: 'hurdles-active',
    solutionsActiveClass: 'solutions-active',
    cardSelector: '.card',
    ...config.classNames
  };
  
  // Updated config with class names
  const updatedConfig = {
    ...config,
    classNames
  };
  
  // State
  const state: State = {
    hurdlesScrollWidth: calculateScrollableWidth(elements.hurdlesContainer, config.viewportPadding),
    solutionsScrollWidth: calculateScrollableWidth(elements.solutionsContainer, config.viewportPadding),
    isHurdlesSectionComplete: false
  };
  
  // Set up observers and event listeners
  setupIntersectionObservers(elements, updatedConfig);
  setupScrollHandler(elements, state, updatedConfig);
  
  // Return cleanup function
  return cleanupEventListeners;
}

// Calculate total scrollable width for a container
export function calculateScrollableWidth(container: HTMLElement, padding: number): number {
  return container.scrollWidth - window.innerWidth + padding;
}

// Set up intersection observers for sections
function setupIntersectionObservers(elements: Elements, config: Config): void {
  // Observer options
  const observerOptions = { threshold: config.observerThreshold };
  const { hurdlesActiveClass, solutionsActiveClass } = config.classNames;
  
  // Create and store observers for cleanup
  window.sectionObservers = [];
  
  // Hurdles section observer
  const hurdlesObserver = createSectionObserver(hurdlesActiveClass, solutionsActiveClass, observerOptions);
  hurdlesObserver.observe(elements.hurdlesSection);
  window.sectionObservers.push(hurdlesObserver);
  
  // Solutions section observer
  const solutionsObserver = createSectionObserver(solutionsActiveClass, hurdlesActiveClass, observerOptions);
  solutionsObserver.observe(elements.solutionsSection);
  window.sectionObservers.push(solutionsObserver);
}

// Create an intersection observer for a section
function createSectionObserver(activeClass: string, inactiveClass: string, options: IntersectionObserverInit): IntersectionObserver {
  return new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      document.body.classList.add(activeClass);
      document.body.classList.remove(inactiveClass);
    } else {
      document.body.classList.remove(activeClass);
    }
  }, options);
}

// Set up scroll event handler
function setupScrollHandler(elements: Elements, state: State, config: Config): void {
  const scrollHandler = () => {
    handleHurdlesScroll(elements, state, config);
    handleSolutionsScroll(elements, state, config);
  };
  
  window.addEventListener('scroll', scrollHandler);
  
  // Store handler for cleanup
  window.scrollHandler = scrollHandler;
}

// Handle scroll for hurdles section
function handleHurdlesScroll(elements: Elements, state: State, config: Config): void {
  const { hurdlesSection, hurdlesContainer } = elements;
  const { hurdlesScrollWidth } = state;
  const { hurdlesActiveClass } = config.classNames;
  
  // Calculate scroll progress regardless of active state
  const progress = calculateSectionProgress(hurdlesSection);
  
  // Always apply transform if the section is in view
  const rect = hurdlesSection.getBoundingClientRect();
  const isInView = rect.top < window.innerHeight && rect.bottom > 0;
  
  if (isInView) {
    // Apply horizontal scroll based on vertical progress
    applyHorizontalScroll(hurdlesContainer, progress, hurdlesScrollWidth);
  }
  
  // Handle active state and completion
  if (document.body.classList.contains(hurdlesActiveClass)) {
    // Check if section is complete (only when scrolling down)
    if (!state.isHurdlesSectionComplete && isLastCardVisible(hurdlesContainer, config.classNames.cardSelector)) {
      state.isHurdlesSectionComplete = true;
      
      // Remove active class after animation completes
      setTimeout(() => {
        document.body.classList.remove(hurdlesActiveClass);
      }, config.transitionDuration);
    }
    
    // Reset completion state when scrolling back up
    if (state.isHurdlesSectionComplete && progress < 0.9) {
      state.isHurdlesSectionComplete = false;
    }
  } else if (isInView && progress < 0.1) {
    // Re-add active class when scrolling back to the top of the section
    document.body.classList.add(hurdlesActiveClass);
  }
}

// Handle scroll for solutions section
function handleSolutionsScroll(elements: Elements, state: State, config: Config): void {
  const { solutionsSection, solutionsContainer } = elements;
  const { solutionsScrollWidth } = state;
  const { solutionsActiveClass } = config.classNames;
  
  if (document.body.classList.contains(solutionsActiveClass)) {
    // Calculate scroll progress
    const progress = calculateSectionProgress(solutionsSection);
    
    // Apply horizontal scroll based on vertical progress (reversed)
    const reversedProgress = 1 - progress;
    applyHorizontalScroll(solutionsContainer, reversedProgress, solutionsScrollWidth);
  }
}

// Calculate section scroll progress (0 to 1)
export function calculateSectionProgress(section: HTMLElement): number {
  const rect = section.getBoundingClientRect();
  return Math.min(1, Math.max(0, 
    -rect.top / (section.offsetHeight - window.innerHeight)
  ));
}

// Apply horizontal scroll transform
export function applyHorizontalScroll(container: HTMLElement, progress: number, maxScrollWidth: number): void {
  const transformValue = progress * maxScrollWidth;
  container.style.transform = `translateX(-${transformValue}px)`;
}

// Check if the last card is visible (section complete)
function isLastCardVisible(container: HTMLElement, cardSelector: string): boolean {
  const cards = container.querySelectorAll(cardSelector);
  if (cards.length === 0) return false;
  
  const lastCard = cards[cards.length - 1];
  const lastCardRect = lastCard.getBoundingClientRect();
  
  const rightEdgeOfViewport = window.innerWidth;
  const rightEdgeOfLastCard = lastCardRect.right;
  
  // Allow a small margin of error (20px)
  return rightEdgeOfLastCard <= rightEdgeOfViewport + 20 && 
         rightEdgeOfLastCard >= rightEdgeOfViewport - 20;
}

// Clean up event listeners and observers
export function cleanupEventListeners(): void {
  // Remove scroll listener
  if (window.scrollHandler) {
    window.removeEventListener('scroll', window.scrollHandler);
  }
  
  // Disconnect observers
  if (window.sectionObservers) {
    window.sectionObservers.forEach(observer => observer.disconnect());
  }
}

// Add TypeScript declarations for window properties
declare global {
  interface Window {
    scrollHandler: any;
    sectionObservers: IntersectionObserver[];
  }
}