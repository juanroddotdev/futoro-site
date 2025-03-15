import { Plugin, ScrollTracker } from '../core/ScrollTracker';

export interface MarkerOptions {
  color?: string;
  label?: string;
  position?: 'left' | 'right';
  showProgress?: boolean;
}

export interface VisualizationOptions {
  showMarkers?: boolean;
  markerPosition?: 'left' | 'right';
  showScrollBoundaries?: boolean; // New option for scroll boundaries
  showScrollPosition?: boolean;   // New option for current scroll position
}

export class VisualizationPlugin implements Plugin {
  name = 'visualization';
  private markers: Map<string, HTMLElement> = new Map();
  private markerContainer: HTMLElement | null = null;
  private boundaryMarkers: Map<string, HTMLElement[]> = new Map();
  private tracker: ScrollTracker | null = null;
  
  constructor(private options: VisualizationOptions = {}) {
    this.options = {
      showMarkers: true,
      markerPosition: 'right',
      showScrollBoundaries: false,
      showScrollPosition: false,
      ...options
    };
  }
  
  init(tracker: ScrollTracker): void {
    this.tracker = tracker;
    
    if (this.options.showMarkers) {
      this.createMarkerContainer();
    }
  }
  
  /**
   * Create a container for all markers
   */
  private createMarkerContainer(): void {
    if (this.markerContainer) return;
    
    this.markerContainer = document.createElement('div');
    this.markerContainer.className = 'scroll-tracker-markers';
    this.markerContainer.style.position = 'fixed';
    this.markerContainer.style.top = '0';
    this.markerContainer.style.right = '0';
    this.markerContainer.style.bottom = '0';
    this.markerContainer.style.pointerEvents = 'none';
    this.markerContainer.style.zIndex = '9998';
    
    document.body.appendChild(this.markerContainer);
  }
  
  /**
   * Update or create a progress marker
   * 
   * @example
   * // Show reading progress on an article
   * tracker.trackElement(articleElement, {
   *   updateCallback: (position) => {
   *     visualPlugin.updateMarker('reading-progress', position.progress, {
   *       label: `Reading: ${Math.round(position.progress * 100)}%`,
   *       showProgress: true,
   *       color: '#3498db'
   *     });
   *   }
   * });
   */
  updateMarker(
    id: string,
    progress: number,
    options: MarkerOptions = {}
  ): void {
    if (!this.markerContainer) {
      this.createMarkerContainer();
    }
    
    const {
      color = this.getColorForProgress(progress),
      label = id,
      position = this.options.markerPosition,
      showProgress = true
    } = options;
    
    let marker = this.markers.get(id);
    
    // Create marker if it doesn't exist
    if (!marker) {
      marker = document.createElement('div');
      marker.className = 'scroll-tracker-marker';
      marker.style.position = 'fixed';
      marker.style.zIndex = '9999';
      marker.style[position as 'left' | 'right'] = '10px';
      marker.style.padding = '4px 8px';
      marker.style.borderRadius = '4px';
      marker.style.fontSize = '12px';
      marker.style.fontFamily = 'monospace';
      marker.style.pointerEvents = 'none';
      marker.style.transition = 'background-color 0.3s, color 0.3s';
      
      this.markerContainer?.appendChild(marker);
      this.markers.set(id, marker);
    }
    
    // Update marker appearance
    marker.style.backgroundColor = color;
    marker.style.color = progress > 0.5 ? 'white' : 'black';
    marker.textContent = showProgress 
      ? `${label}: ${Math.round(progress * 100)}%` 
      : label;
  }
  
  /**
   * Create height markers to visualize scroll positions
   */
  createHeightMarkers(
    container: HTMLElement, 
    startY: number, 
    endY: number, 
    count: number = 5
  ): void {
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
   * Create visual markers for scroll section boundaries
   * 
   * @example
   * // Visualize the boundaries of a scroll animation section
   * const section = document.querySelector('.animation-section');
   * const { startPosition, endPosition } = tracker.calculateElementBoundaries(section);
   * 
   * visualPlugin.createScrollBoundaryMarkers(
   *   startPosition,
   *   endPosition,
   *   'main-animation'
   * );
   */
  createScrollBoundaryMarkers(
    startPosition: number,
    endPosition: number,
    label: string = 'scroll-section'
  ): void {
    // Remove existing markers with the same label
    this.removeBoundaryMarkers(label);
    
    const markers: HTMLElement[] = [];
    
    // Create start marker
    const startMarker = document.createElement('div');
    startMarker.className = `scroll-boundary-marker scroll-boundary-marker-${label} start-marker`;
    startMarker.style.position = 'absolute';
    startMarker.style.left = '0';
    startMarker.style.right = '0';
    startMarker.style.height = '2px';
    startMarker.style.backgroundColor = 'green';
    startMarker.style.zIndex = '1000';
    startMarker.style.top = `${startPosition}px`;
    
    // Add label to start marker
    const startLabel = document.createElement('div');
    startLabel.style.position = 'absolute';
    startLabel.style.right = '10px';
    startLabel.style.backgroundColor = 'green';
    startLabel.style.color = 'white';
    startLabel.style.padding = '2px 4px';
    startLabel.style.borderRadius = '2px';
    startLabel.style.fontSize = '10px';
    startLabel.textContent = `Start: ${label} (${startPosition}px)`;
    startMarker.appendChild(startLabel);
    
    document.body.appendChild(startMarker);
    markers.push(startMarker);
    
    // Create end marker
    const endMarker = document.createElement('div');
    endMarker.className = `scroll-boundary-marker scroll-boundary-marker-${label} end-marker`;
    endMarker.style.position = 'absolute';
    endMarker.style.left = '0';
    endMarker.style.right = '0';
    endMarker.style.height = '2px';
    endMarker.style.backgroundColor = 'red';
    endMarker.style.zIndex = '1000';
    endMarker.style.top = `${endPosition}px`;
    
    // Add label to end marker
    const endLabel = document.createElement('div');
    endLabel.style.position = 'absolute';
    endLabel.style.right = '10px';
    endLabel.style.backgroundColor = 'red';
    endLabel.style.color = 'white';
    endLabel.style.padding = '2px 4px';
    endLabel.style.borderRadius = '2px';
    endLabel.style.fontSize = '10px';
    endLabel.textContent = `End: ${label} (${endPosition}px)`;
    endMarker.appendChild(endLabel);
    
    document.body.appendChild(endMarker);
    markers.push(endMarker);
    
    // Store markers for later removal
    this.boundaryMarkers.set(label, markers);
  }
  
  /**
   * Remove boundary markers for a specific label
   * 
   * @example
   * // Clean up specific markers when no longer needed
   * function hideDebugMarkers() {
   *   visualPlugin.removeBoundaryMarkers('main-animation');
   * }
   * 
   * // Toggle button
   * debugToggle.addEventListener('click', () => {
   *   if (debugToggle.checked) {
   *     visualPlugin.createScrollBoundaryMarkers(start, end, 'main-animation');
   *   } else {
   *     visualPlugin.removeBoundaryMarkers('main-animation');
   *   }
   * });
   */
  removeBoundaryMarkers(label: string): void {
    const markers = this.boundaryMarkers.get(label);
    if (markers) {
      markers.forEach(marker => {
        if (marker.parentNode) {
          marker.parentNode.removeChild(marker);
        }
      });
      this.boundaryMarkers.delete(label);
    } else {
      // If no specific markers found, try to remove by class
      document.querySelectorAll(`.scroll-boundary-marker-${label}`).forEach(marker => {
        if (marker.parentNode) {
          marker.parentNode.removeChild(marker);
        }
      });
    }
  }
  
  /**
   * Update a marker showing current scroll position
   */
  updateScrollPositionMarker(scrollY: number): void {
    if (!this.options.showScrollPosition) return;
    
    this.updateMarker('scroll-position', 0, {
      label: `Scroll: ${Math.round(scrollY)}px`,
      position: this.options.markerPosition === 'right' ? 'left' : 'right',
      showProgress: false,
      color: '#3498db'
    });
    
    // Position the marker at the current scroll position
    const marker = this.markers.get('scroll-position');
    if (marker) {
      marker.style.top = `${window.innerHeight / 2}px`;
    }
  }
  
  update(tracker: ScrollTracker): void {
    if (this.options.showScrollPosition) {
      const scrollPosition = tracker.getScrollPosition();
      this.updateScrollPositionMarker(scrollPosition.scrollY);
    }
  }
  
  /**
   * Clean up all markers
   */
  destroy(): void {
    if (this.markerContainer) {
      document.body.removeChild(this.markerContainer);
      this.markerContainer = null;
    }
    
    this.markers.clear();
    
    // Clean up boundary markers
    this.boundaryMarkers.forEach(markers => {
      markers.forEach(marker => {
        if (marker.parentNode) {
          marker.parentNode.removeChild(marker);
        }
      });
    });
    this.boundaryMarkers.clear();
  }
}

export default VisualizationPlugin;