/**
 * ScrollTracker - Core tracking module
 * A flexible, extensible scroll tracking utility
 */

// Core types
export interface ScrollPosition {
  scrollY: number;
  scrollX: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'none';
  previousScrollY: number;
  previousScrollX: number;
  delta: number;
}

export interface ElementPosition {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
  inView: boolean;
  progress: number; // 0 to 1 representing how much of the element is in view
}

export interface TrackerOptions {
  debug?: boolean;
  throttleMs?: number;
  observeResize?: boolean;
  plugins?: Plugin[];
}

export interface Plugin {
  name: string;
  init?: (tracker: ScrollTracker) => void;
  update?: (tracker: ScrollTracker) => void;
  destroy?: () => void;
}

export class ScrollTracker {
  private options: Required<TrackerOptions>;
  private scrollPosition: ScrollPosition;
  private trackedElements: Map<HTMLElement, ElementPosition> = new Map();
  private observers: Map<HTMLElement, IntersectionObserver> = new Map();
  private resizeObserver: ResizeObserver | null = null;
  private scrollListenerActive = false;
  private throttleTimeout: number | null = null;
  private plugins: Plugin[] = [];
  
  constructor(options: TrackerOptions = {}) {
    // Set default options
    this.options = {
      debug: false,
      throttleMs: 100,
      observeResize: true,
      plugins: [],
      ...options
    };
    
    // Initialize scroll position
    this.scrollPosition = {
      scrollY: window.scrollY,
      scrollX: window.scrollX,
      direction: 'none',
      previousScrollY: window.scrollY,
      previousScrollX: window.scrollX,
      delta: 0
    };
    
    // Initialize plugins
    this.plugins = [...this.options.plugins];
    this.plugins.forEach(plugin => {
      if (plugin.init) plugin.init(this);
    });
    
    // Start tracking
    this.initScrollListener();
    if (this.options.observeResize) {
      this.initResizeObserver();
    }
    
    if (this.options.debug) {
      console.log('ScrollTracker initialized with options:', this.options);
    }
  }
  
  /**
   * Initialize scroll event listener
   */
  private initScrollListener(): void {
    if (this.scrollListenerActive) return;
    
    const handleScroll = () => {
      if (this.throttleTimeout !== null) return;
      
      this.throttleTimeout = window.setTimeout(() => {
        this.updateScrollPosition();
        this.throttleTimeout = null;
      }, this.options.throttleMs);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    this.scrollListenerActive = true;
    
    // Initial update
    this.updateScrollPosition();
  }
  
  /**
   * Initialize resize observer
   */
  private initResizeObserver(): void {
    if (!window.ResizeObserver) return;
    
    this.resizeObserver = new ResizeObserver(() => {
      this.updateAllElementPositions();
    });
  }
  
  /**
   * Update current scroll position and direction
   */
  private updateScrollPosition(): void {
    const currentScrollY = window.scrollY;
    const currentScrollX = window.scrollX;
    const previousScrollY = this.scrollPosition.scrollY;
    const previousScrollX = this.scrollPosition.scrollX;
    
    // Determine scroll direction
    let direction: ScrollPosition['direction'] = 'none';
    if (currentScrollY < previousScrollY) direction = 'up';
    else if (currentScrollY > previousScrollY) direction = 'down';
    else if (currentScrollX < previousScrollX) direction = 'left';
    else if (currentScrollX > previousScrollX) direction = 'right';
    
    // Calculate delta
    const delta = Math.abs(currentScrollY - previousScrollY);
    
    // Update scroll position
    this.scrollPosition = {
      scrollY: currentScrollY,
      scrollX: currentScrollX,
      direction,
      previousScrollY,
      previousScrollX,
      delta
    };
    
    // Update all tracked elements
    this.updateAllElementPositions();
    
    // Update plugins
    this.plugins.forEach(plugin => {
      if (plugin.update) plugin.update(this);
    });
    
    if (this.options.debug) {
      console.log('Scroll position updated:', this.scrollPosition);
    }
  }
  
  /**
   * Track an element's position relative to the viewport
   * 
   * @example
   * // Track a section and add a class when it's in view
   * const section = document.querySelector('.my-section');
   * tracker.trackElement(section, {
   *   updateCallback: (position) => {
   *     if (position.inView && position.progress > 0.3) {
   *       section.classList.add('active');
   *     } else {
   *       section.classList.remove('active');
   *     }
   *   }
   * });
   */
  trackElement(element: HTMLElement, options: {
    threshold?: number | number[];
    rootMargin?: string;
    updateCallback?: (position: ElementPosition) => void;
  } = {}): void {
    if (!element) return;
    
    // Initial position calculation
    const position = this.calculateElementPosition(element);
    this.trackedElements.set(element, position);
    
    // Set up IntersectionObserver for more efficient tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const trackedPosition = this.trackedElements.get(element);
          if (!trackedPosition) return;
          
          // Update inView status
          const updatedPosition = {
            ...trackedPosition,
            inView: entry.isIntersecting
          };
          
          this.trackedElements.set(element, updatedPosition);
          
          // Call update callback if provided
          if (options.updateCallback) {
            options.updateCallback(updatedPosition);
          }
        });
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || '0px'
      }
    );
    
    observer.observe(element);
    this.observers.set(element, observer);
    
    // Add to resize observer if enabled
    if (this.resizeObserver) {
      this.resizeObserver.observe(element);
    }
    
    if (this.options.debug) {
      console.log('Element tracked:', element, position);
    }
  }
  
  /**
   * Stop tracking an element
   * 
   * @example
   * // Clean up when component is destroyed
   * const cleanup = () => {
   *   tracker.untrackElement(myElement);
   * };
   */
  untrackElement(element: HTMLElement): void {
    // Remove from intersection observer
    const observer = this.observers.get(element);
    if (observer) {
      observer.unobserve(element);
      observer.disconnect();
      this.observers.delete(element);
    }
    
    // Remove from resize observer
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(element);
    }
    
    // Remove from tracked elements
    this.trackedElements.delete(element);
    
    if (this.options.debug) {
      console.log('Element untracked:', element);
    }
  }
  
  /**
   * Calculate an element's position relative to the viewport
   */
  private calculateElementPosition(element: HTMLElement): ElementPosition {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how much of the element is in view (0-1)
    let progress = 0;
    if (rect.height > 0) {
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(windowHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      progress = visibleHeight / rect.height;
    }
    
    return {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height,
      inView: (
        rect.top < windowHeight &&
        rect.bottom > 0
      ),
      progress
    };
  }
  
  /**
   * Update positions of all tracked elements
   */
  private updateAllElementPositions(): void {
    this.trackedElements.forEach((position, element) => {
      const updatedPosition = this.calculateElementPosition(element);
      this.trackedElements.set(element, updatedPosition);
    });
  }
  
  /**
   * Get current scroll position information
   * 
   * @example
   * // Check scroll direction to apply different animations
   * const scrollPos = tracker.getScrollPosition();
   * if (scrollPos.direction === 'down') {
   *   // Apply downward animation
   *   element.style.transform = `translateY(${scrollPos.delta * 0.5}px)`;
   * } else if (scrollPos.direction === 'up') {
   *   // Apply upward animation
   *   element.style.transform = `translateY(${-scrollPos.delta * 0.5}px)`;
   * }
   */
  getScrollPosition(): ScrollPosition {
    return { ...this.scrollPosition };
  }
  
  /**
   * Get position information for a tracked element
   * 
   * @example
   * // Get element progress to update a progress bar
   * const position = tracker.getElementPosition(contentSection);
   * if (position) {
   *   progressBar.style.width = `${position.progress * 100}%`;
   * }
   */
  getElementPosition(element: HTMLElement): ElementPosition | null {
    return this.trackedElements.get(element) || null;
  }
  
  /**
   * Register a plugin to extend functionality
   * 
   * @example
   * // Add visualization during development
   * if (process.env.NODE_ENV === 'development') {
   *   const visualPlugin = new VisualizationPlugin({
   *     showMarkers: true,
   *     showScrollPosition: true
   *   });
   *   tracker.registerPlugin(visualPlugin);
   * }
   */
  registerPlugin(plugin: Plugin): void {
    if (this.plugins.some(p => p.name === plugin.name)) {
      console.warn(`Plugin with name "${plugin.name}" already registered`);
      return;
    }
    
    this.plugins.push(plugin);
    if (plugin.init) plugin.init(this);
  }
  
  /**
   * Remove a plugin by name
   * 
   * @example
   * // Remove visualization plugin for production
   * tracker.unregisterPlugin('visualization');
   */
  unregisterPlugin(pluginName: string): void {
    const index = this.plugins.findIndex(p => p.name === pluginName);
    if (index === -1) return;
    
    const plugin = this.plugins[index];
    if (plugin.destroy) plugin.destroy();
    
    this.plugins.splice(index, 1);
  }
  
  /**
   * Calculate element boundaries with flexible offsets and multipliers
   * 
   * @example
   * // Calculate custom boundaries for a parallax section
   * const parallaxSection = document.querySelector('.parallax');
   * const { startPosition, endPosition } = tracker.calculateElementBoundaries(
   *   parallaxSection,
   *   { topOffset: 0.2, heightMultiplier: 1.5 }
   * );
   * 
   * // Use with GSAP ScrollTrigger
   * gsap.to('.parallax-bg', {
   *   scrollTrigger: {
   *     trigger: parallaxSection,
   *     start: `${startPosition}px top`,
   *     end: `${endPosition}px bottom`,
   *     scrub: true
   *   },
   *   y: -100
   * });
   */
  calculateElementBoundaries(
    element: HTMLElement,
    options: {
      topOffset?: number;
      bottomOffset?: number;
      heightMultiplier?: number;
    } = {}
  ): { startPosition: number; endPosition: number } {
    const {
      topOffset = 0.1,
      bottomOffset = 0,
      heightMultiplier = 1
    } = options;
    
    const rect = element.getBoundingClientRect();
    const startPosition = window.scrollY + rect.top - window.innerHeight * topOffset;
    const endPosition = startPosition + rect.height * heightMultiplier + window.innerHeight * bottomOffset;
    
    return { startPosition, endPosition };
  }

  /**
   * Calculate progress for a segment within an overall progress range
   * Useful for sequential animations like accordions, carousels, etc.
   * 
   * @example
   * // Animate a 5-step process sequentially as user scrolls
   * const steps = document.querySelectorAll('.process-step');
   * const section = document.querySelector('.process-section');
   * 
   * tracker.trackElement(section, {
   *   updateCallback: (position) => {
   *     // For each step, calculate its individual progress
   *     steps.forEach((step, index) => {
   *       const stepProgress = tracker.calculateSegmentProgress(
   *         position.progress,
   *         index,
   *         steps.length
   *       );
   *       
   *       // Apply animations based on step progress
   *       step.style.opacity = stepProgress.toString();
   *       step.style.transform = `translateY(${(1 - stepProgress) * 50}px)`;
   *     });
   *   }
   * });
   */
  calculateSegmentProgress(
    overallProgress: number,
    segmentIndex: number,
    totalSegments: number
  ): number {
    const segmentSize = 1 / totalSegments;
    const segmentStart = segmentIndex * segmentSize;
    
    // Map the overall progress to this segment
    if (overallProgress > segmentStart) {
      return Math.min(1, (overallProgress - segmentStart) / segmentSize);
    }
    return 0;
  }

  /**
   * Clean up all trackers and listeners
   * 
   * @example
   * // Clean up when page is unmounted
   * function unmountHandler() {
   *   tracker.destroy();
   * }
   */
  destroy(): void {
    // Remove scroll listener
    window.removeEventListener('scroll', this.updateScrollPosition);
    
    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    // Clear tracked elements
    this.trackedElements.clear();
    
    // Destroy plugins
    this.plugins.forEach(plugin => {
      if (plugin.destroy) plugin.destroy();
    });
    
    if (this.options.debug) {
      console.log('ScrollTracker destroyed');
    }
  }
}

// Create a default instance for easy import
export const scrollTracker = new ScrollTracker();

// Export default for convenience
export default scrollTracker;