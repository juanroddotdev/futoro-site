/**
 * ScrollAnimationTracker
 * Utility for tracking and visualizing scroll-based animations
 */

// Types
export interface AnimationTrackingOptions {
  element: HTMLElement;
  id: string;
  threshold?: number;
  onComplete?: (detail: any) => void;
  onReset?: () => void;
  eventName?: string;
  logEvents?: boolean;
  showMarkers?: boolean;
}

export interface MarkerOptions {
  color?: string;
  label?: string;
  position?: 'left' | 'right';
  showProgress?: boolean;
}

// Main tracking class
export class ScrollAnimationTracker {
  private markers: Map<string, HTMLElement> = new Map();
  private trackedElements: Map<string, HTMLElement> = new Map();
  private markerContainer: HTMLElement | null = null;
  
  constructor(private options: {
    showMarkers?: boolean;
    markerPosition?: 'left' | 'right';
    debug?: boolean;
  } = {}) {
    this.options = {
      showMarkers: false,
      markerPosition: 'right',
      debug: false,
      ...options
    };
    
    if (this.options.showMarkers) {
      this.createMarkerContainer();
    }
  }
  
  /**
   * Track progress of a scroll animation and trigger events
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
      logEvents = this.options.debug,
      showMarkers = this.options.showMarkers
    } = options;
    
    // Store reference to element
    this.trackedElements.set(id, element);
    
    // Update marker if enabled
    if (showMarkers) {
      this.updateMarker(id, progress, {
        label: id,
        position: this.options.markerPosition,
        showProgress: true
      });
    }
    
    const isComplete = progress >= threshold;
    const wasComplete = element.dataset[`${id}Complete`] === 'true';
    
    // Animation just completed
    if (isComplete && !wasComplete) {
      // Mark as complete
      element.dataset[`${id}Complete`] = 'true';
      
      // Optional logging
      if (logEvents) {
        console.log(`Animation "${id}" completed`, {
          progress,
          timestamp: new Date().toISOString()
        });
      }
      
      // Dispatch event
      if (eventName) {
        const event = new CustomEvent(eventName, { 
          detail: { 
            id,
            progress,
            timestamp: new Date().toISOString() 
          } 
        });
        element.dispatchEvent(event);
      }
      
      // Call completion callback
      if (onComplete) {
        onComplete({
          element,
          id,
          progress,
          timestamp: new Date().toISOString()
        });
      }
      
      return true;
    } 
    // Animation was complete but now reset
    else if (!isComplete && wasComplete) {
      // Reset completion flag
      delete element.dataset[`${id}Complete`];
      
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
   * Create or update a visual marker for tracking animation progress
   */
  updateMarker(id: string, progress: number, options: MarkerOptions = {}) {
    if (!this.markerContainer) {
      this.createMarkerContainer();
    }
    
    const {
      color = this.getColorForProgress(progress),
      label = id,
      position = 'right',
      showProgress = true
    } = options;
    
    let marker = this.markers.get(id);
    
    // Create marker if it doesn't exist
    if (!marker) {
      marker = document.createElement('div');
      marker.className = 'scroll-animation-marker';
      marker.style.position = 'fixed';
      marker.style.zIndex = '9999';
      marker.style[position] = '10px';
      marker.style.padding = '4px 8px';
      marker.style.borderRadius = '4px';
      marker.style.fontSize = '12px';
      marker.style.fontFamily = 'monospace';
      marker.style.pointerEvents = 'none';
      marker.style.transition = 'background-color 0.3s, color 0.3s';
      
      this.markerContainer?.appendChild(marker);
      this.markers.set(id, marker);
    }
    
    // Update marker position based on tracked element
    const element = this.trackedElements.get(id);
    if (element) {
      const rect = element.getBoundingClientRect();
      marker.style.top = `${rect.top}px`;
    }
    
    // Update marker appearance
    marker.style.backgroundColor = color;
    marker.style.color = progress > 0.5 ? 'white' : 'black';
    marker.textContent = showProgress 
      ? `${label}: ${Math.round(progress * 100)}%` 
      : label;
  }
  
  /**
   * Create a container for all markers
   */
  private createMarkerContainer() {
    if (this.markerContainer) return;
    
    this.markerContainer = document.createElement('div');
    this.markerContainer.className = 'scroll-animation-markers';
    this.markerContainer.style.position = 'fixed';
    this.markerContainer.style.top = '0';
    this.markerContainer.style.right = '0';
    this.markerContainer.style.bottom = '0';
    this.markerContainer.style.pointerEvents = 'none';
    this.markerContainer.style.zIndex = '9998';
    
    document.body.appendChild(this.markerContainer);
  }
  
  /**
   * Get a color based on progress value
   */
  private getColorForProgress(progress: number): string {
    // Red (0%) to Yellow (50%) to Green (100%)
    if (progress < 0.5) {
      // Red to Yellow
      const r = 255;
      const g = Math.round(255 * (progress * 2));
      return `rgb(${r}, ${g}, 0)`;
    } else {
      // Yellow to Green
      const r = Math.round(255 * (1 - (progress - 0.5) * 2));
      const g = 255;
      return `rgb(${r}, ${g}, 0)`;
    }
  }
  
  /**
   * Create height markers to visualize scroll positions
   */
  createHeightMarkers(
    container: HTMLElement, 
    startY: number, 
    endY: number, 
    count: number = 5
  ) {
    if (!this.options.showMarkers) return;
    
    // Remove any existing height markers
    const existingMarkers = container.querySelectorAll('.scroll-height-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    // Create new markers
    for (let i = 0; i <= count; i++) {
      const progress = i / count;
      const y = startY + (endY - startY) * progress;
      
      const marker = document.createElement('div');
      marker.className = 'scroll-height-marker';
      marker.style.position = 'absolute';
      marker.style.left = '0';
      marker.style.right = '0';
      marker.style.top = `${y}px`;
      marker.style.height = '1px';
      marker.style.backgroundColor = this.getColorForProgress(progress);
      marker.style.opacity = '0.5';
      marker.style.pointerEvents = 'none';
      marker.style.zIndex = '9997';
      
      // Add label
      const label = document.createElement('span');
      label.style.position = 'absolute';
      label.style.right = '10px';
      label.style.backgroundColor = this.getColorForProgress(progress);
      label.style.color = progress > 0.5 ? 'white' : 'black';
      label.style.padding = '2px 4px';
      label.style.borderRadius = '2px';
      label.style.fontSize = '10px';
      label.style.fontFamily = 'monospace';
      label.textContent = `${Math.round(progress * 100)}%`;
      
      marker.appendChild(label);
      container.appendChild(marker);
    }
  }
  
  /**
   * Update a marker showing current scroll position
   */
  updateScrollPositionMarker(scrollY: number, startY: number, endY: number) {
    if (!this.options.showMarkers) return;
    
    const progress = Math.max(0, Math.min(1, (scrollY - startY) / (endY - startY)));
    this.updateMarker('scroll-position', progress, {
      label: 'Scroll',
      position: this.options.markerPosition === 'right' ? 'left' : 'right',
      showProgress: true
    });
  }
  
  /**
   * Clean up all markers and listeners
   */
  destroy() {
    if (this.markerContainer) {
      document.body.removeChild(this.markerContainer);
      this.markerContainer = null;
    }
    
    this.markers.clear();
    this.trackedElements.clear();
  }
}

// Create a default instance for easy import
export const scrollTracker = new ScrollAnimationTracker({ 
  showMarkers: false,
  debug: false
});

// Export default for convenience
export default scrollTracker;