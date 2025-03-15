/**
 * Performance utilities for scroll-based animations and tracking
 */

/**
 * Throttle function to limit how often a function can be called
 * 
 * @example
 * // Throttle a scroll handler to improve performance
 * import { throttle } from './utils/scroll/utils/performance';
 * 
 * const handleScroll = () => {
 *   // Expensive DOM operations
 *   updateElementPositions();
 * };
 * 
 * // Only call once every 100ms maximum
 * const throttledScrollHandler = throttle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScrollHandler);
 * 
 * @example
 * // Use with ScrollTracker for manual tracking
 * import { throttle } from './utils/scroll/utils/performance';
 * import { ScrollTracker } from './utils/scroll/core/ScrollTracker';
 * 
 * const tracker = new ScrollTracker();
 * const updateAnimation = () => {
 *   const position = tracker.getScrollPosition();
 *   element.style.opacity = (position.scrollY / 1000).toString();
 * };
 * 
 * window.addEventListener('scroll', throttle(updateAnimation, 50));
 * 
 * @param fn The function to throttle
 * @param delay The minimum time between function calls in milliseconds
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: number | null = null;
  
  return function(...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    
    if (timeSinceLastCall >= delay) {
      // If enough time has passed, call the function immediately
      lastCall = now;
      fn(...args);
    } else if (!timeoutId) {
      // Otherwise, schedule a call after the remaining delay
      const remainingTime = delay - timeSinceLastCall;
      timeoutId = window.setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn(...args);
      }, remainingTime);
    }
  };
}

/**
 * Debounce function to delay execution until after a period of inactivity
 * 
 * @example
 * // Debounce a resize handler
 * import { debounce } from './utils/scroll/utils/performance';
 * 
 * const handleResize = () => {
 *   // Recalculate element dimensions
 *   recalculateLayout();
 * };
 * 
 * // Only call after resizing has stopped for 200ms
 * const debouncedResizeHandler = debounce(handleResize, 200);
 * window.addEventListener('resize', debouncedResizeHandler);
 * 
 * @example
 * // Use with ScrollTracker for expensive calculations
 * import { debounce } from './utils/scroll/utils/performance';
 * 
 * // Recalculate boundaries when window is resized
 * const recalculateBoundaries = () => {
 *   const { startPosition, endPosition } = tracker.calculateElementBoundaries(
 *     element,
 *     { topOffset: 0.2, heightMultiplier: 1.5 }
 *   );
 *   // Update animation settings
 * };
 * 
 * window.addEventListener('resize', debounce(recalculateBoundaries, 150));
 * 
 * @param fn The function to debounce
 * @param delay The time to wait after the last call before executing in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    
    timeoutId = window.setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * RAF (requestAnimationFrame) throttle for smooth animations
 * 
 * @example
 * // Create a smooth scroll animation
 * import { rafThrottle } from './utils/scroll/utils/performance';
 * 
 * const animateScroll = () => {
 *   const scrollY = window.scrollY;
 *   element.style.transform = `translateY(${scrollY * 0.5}px)`;
 * };
 * 
 * // Use RAF for smoother animations than setTimeout
 * window.addEventListener('scroll', rafThrottle(animateScroll));
 * 
 * @param fn The function to throttle with requestAnimationFrame
 * @returns A RAF-throttled version of the function
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => void {
  let ticking = false;
  
  return function(...args: Parameters<T>) {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
}