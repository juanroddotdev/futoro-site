import { Plugin, ScrollTracker } from '../core/ScrollTracker';

export interface AnimationTrackingOptions {
  element: HTMLElement;
  id: string;
  threshold?: number;
  onComplete?: (detail: any) => void;
  onReset?: () => void;
  eventName?: string;
  logEvents?: boolean;
}

export class AnimationPlugin implements Plugin {
  name = 'animation';
  private tracker: ScrollTracker | null = null;
  private completedAnimations: Map<string, boolean> = new Map();
  private debug: boolean = false;
  
  constructor(options: { debug?: boolean } = {}) {
    this.debug = options.debug || false;
  }
  
  init(tracker: ScrollTracker): void {
    this.tracker = tracker;
  }
  
  /**
   * Track progress of a scroll animation and trigger events
   * 
   * @example
   * // Track a scroll animation and trigger a completion event
   * tracker.trackElement(heroSection, {
   *   updateCallback: (position) => {
   *     animationPlugin.trackProgress(position.progress, {
   *       element: heroSection,
   *       id: 'hero-animation',
   *       threshold: 0.8,
   *       onComplete: () => {
   *         // Show the next section or a call-to-action
   *         document.querySelector('.cta-button').classList.add('visible');
   *       },
   *       onReset: () => {
   *         // Reset when scrolling back up
   *         document.querySelector('.cta-button').classList.remove('visible');
   *       }
   *     });
   *   }
   * });
   */
  trackProgress(
    progress: number, 
    options: AnimationTrackingOptions
  ): boolean {
    const { 
      element, 
      id, 
      threshold = 0.99, 
      onComplete, 
      onReset,
      eventName = 'animation-complete',
      logEvents = this.debug
    } = options;
    
    const isComplete = progress >= threshold;
    const wasComplete = this.completedAnimations.get(id) || false;
    
    // Animation just completed
    if (isComplete && !wasComplete) {
      // Mark as complete
      this.completedAnimations.set(id, true);
      
      // Optional logging
      if (logEvents) {
        console.log(`Animation "${id}" completed`, {
          progress,
          timestamp: new Date().toISOString()
        });
      }
      
      // Dispatch event
      element.dispatchEvent(new CustomEvent(eventName, {
        detail: { id, progress, timestamp: new Date().toISOString() },
        bubbles: true
      }));
      
      // Call completion callback
      if (onComplete) {
        onComplete({
          id,
          progress,
          timestamp: new Date().toISOString()
        });
      }
      
      return true;
    }
    
    // Animation was complete but is now reset
    if (!isComplete && wasComplete) {
      // Mark as not complete
      this.completedAnimations.set(id, false);
      
      // Optional logging
      if (logEvents) {
        console.log(`Animation "${id}" reset`, {
          progress,
          timestamp: new Date().toISOString()
        });
      }
      
      // Call reset callback
      if (onReset) {
        onReset();
      }
      
      return false;
    }
    
    return isComplete;
  }
  
  /**
   * Clean up all animation tracking
   */
  destroy(): void {
    this.completedAnimations.clear();
  }
}

export default AnimationPlugin;