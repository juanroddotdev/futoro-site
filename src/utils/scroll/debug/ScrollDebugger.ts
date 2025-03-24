/**
 * ScrollDebugger
 * A standalone utility for debugging scroll-based animations
 */

export interface ScrollDebuggerOptions {
  enabled?: boolean;
  logPrefix?: string;
  logTimestamps?: boolean;
  logPerformance?: boolean;
  exportLogs?: boolean;
  filterSectionIds?: string[];
  verbose?: boolean;
}

export interface AnimationEvent {
  type: 'section-visible' | 'animation-trigger' | 'animation-start' | 'animation-complete' | 'error' | 'info';
  sectionId: string;
  componentId?: string;
  timestamp: number;
  message: string;
  details?: any;
}

export class ScrollDebugger {
  private options: Required<ScrollDebuggerOptions>;
  private events: AnimationEvent[] = [];
  private startTime: number;
  private sections: Map<string, { 
    visible: boolean, 
    visibleTimestamp?: number,
    components: Map<string, {
      triggered: boolean,
      triggerTimestamp?: number,
      started: boolean,
      startTimestamp?: number,
      completed: boolean,
      completeTimestamp?: number
    }>
  }> = new Map();
  
  constructor(options: ScrollDebuggerOptions = {}) {
    this.startTime = performance.now();
    this.options = {
      enabled: true,
      logPrefix: '🔍 ScrollDebugger',
      logTimestamps: true,
      logPerformance: true,
      exportLogs: false,
      filterSectionIds: [],
      verbose: false,
      ...options
    };
    
    this.log('info', 'global', undefined, 'ScrollDebugger initialized', { options: this.options });
  }
  
  /**
   * Register a section to be tracked
   */
  registerSection(sectionId: string): void {
    if (this.shouldSkip(sectionId)) return;
    
    this.sections.set(sectionId, {
      visible: false,
      components: new Map()
    });
    
    this.log('info', sectionId, undefined, `Section registered: ${sectionId}`);
  }
  
  /**
   * Register a component within a section
   */
  registerComponent(sectionId: string, componentId: string): void {
    if (this.shouldSkip(sectionId)) return;
    
    const section = this.sections.get(sectionId);
    if (!section) {
      this.registerSection(sectionId);
      this.registerComponent(sectionId, componentId);
      return;
    }
    
    section.components.set(componentId, {
      triggered: false,
      started: false,
      completed: false
    });
    
    this.log('info', sectionId, componentId, `Component registered: ${componentId}`);
  }
  
  /**
   * Log when a section becomes visible in the viewport
   */
  sectionVisible(sectionId: string, details?: any): void {
    if (this.shouldSkip(sectionId)) return;
    
    const section = this.getOrCreateSection(sectionId);
    const now = performance.now();
    
    if (!section.visible) {
      section.visible = true;
      section.visibleTimestamp = now;
      
      this.log('section-visible', sectionId, undefined, `Section visible: ${sectionId}`, {
        timeFromPageLoad: this.getTimeFromStart(now),
        ...details
      });
    }
  }
  
  /**
   * Log when an animation is triggered (decision to start)
   */
  animationTriggered(sectionId: string, componentId: string, details?: any): void {
    if (this.shouldSkip(sectionId)) return;
    
    const section = this.getOrCreateSection(sectionId);
    const component = this.getOrCreateComponent(section, componentId);
    const now = performance.now();
    
    if (!component.triggered) {
      component.triggered = true;
      component.triggerTimestamp = now;
      
      const sectionVisibleTime = section.visibleTimestamp 
        ? this.getTimeFromTimestamp(now, section.visibleTimestamp) 
        : 'unknown';
      
      this.log('animation-trigger', sectionId, componentId, `Animation triggered: ${componentId}`, {
        timeFromPageLoad: this.getTimeFromStart(now),
        timeFromSectionVisible: sectionVisibleTime,
        ...details
      });
    }
  }
  
  /**
   * Log when an animation actually starts (execution begins)
   */
  animationStarted(sectionId: string, componentId: string, details?: any): void {
    if (this.shouldSkip(sectionId)) return;
    
    const section = this.getOrCreateSection(sectionId);
    const component = this.getOrCreateComponent(section, componentId);
    const now = performance.now();
    
    if (!component.started) {
      component.started = true;
      component.startTimestamp = now;
      
      const triggerTime = component.triggerTimestamp 
        ? this.getTimeFromTimestamp(now, component.triggerTimestamp) 
        : 'unknown';
      
      this.log('animation-start', sectionId, componentId, `Animation started: ${componentId}`, {
        timeFromPageLoad: this.getTimeFromStart(now),
        timeFromTrigger: triggerTime,
        ...details
      });
    }
  }
  
  /**
   * Log when an animation completes
   */
  animationCompleted(sectionId: string, componentId: string, details?: any): void {
    if (this.shouldSkip(sectionId)) return;
    
    const section = this.getOrCreateSection(sectionId);
    const component = this.getOrCreateComponent(section, componentId);
    const now = performance.now();
    
    if (!component.completed) {
      component.completed = true;
      component.completeTimestamp = now;
      
      const startTime = component.startTimestamp 
        ? this.getTimeFromTimestamp(now, component.startTimestamp) 
        : 'unknown';
      
      this.log('animation-complete', sectionId, componentId, `Animation completed: ${componentId}`, {
        timeFromPageLoad: this.getTimeFromStart(now),
        timeFromStart: startTime,
        ...details
      });
    }
  }
  
  /**
   * Log an error related to a section or component
   */
  logError(sectionId: string, componentId: string | undefined, message: string, details?: any): void {
    if (this.shouldSkip(sectionId)) return;
    
    this.log('error', sectionId, componentId, message, details);
  }
  
  /**
   * Log general information
   */
  logInfo(sectionId: string, componentId: string | undefined, message: string, details?: any): void {
    if (this.shouldSkip(sectionId)) return;
    
    this.log('info', sectionId, componentId, message, details);
  }
  
  /**
   * Export logs to console or file
   */
  exportLogs(): AnimationEvent[] {
    console.group(`${this.options.logPrefix} - Exported Logs`);
    console.table(this.events.map(event => ({
      type: event.type,
      sectionId: event.sectionId,
      componentId: event.componentId || '-',
      time: `${(event.timestamp - this.startTime).toFixed(0)}ms`,
      message: event.message
    })));
    console.groupEnd();
    
    return this.events;
  }
  
  /**
   * Get summary of all tracked sections and components
   */
  getSummary(): void {
    console.group(`${this.options.logPrefix} - Summary`);
    
    this.sections.forEach((section, sectionId) => {
      const sectionTime = section.visibleTimestamp 
        ? `${(section.visibleTimestamp - this.startTime).toFixed(0)}ms` 
        : 'not visible';
      
      console.group(`Section: ${sectionId} (visible at: ${sectionTime})`);
      
      section.components.forEach((component, componentId) => {
        console.log(`Component: ${componentId}`, {
          triggered: component.triggered ? `at ${(component.triggerTimestamp! - this.startTime).toFixed(0)}ms` : 'no',
          started: component.started ? `at ${(component.startTimestamp! - this.startTime).toFixed(0)}ms` : 'no',
          completed: component.completed ? `at ${(component.completeTimestamp! - this.startTime).toFixed(0)}ms` : 'no',
          duration: component.started && component.completed 
            ? `${(component.completeTimestamp! - component.startTimestamp!).toFixed(0)}ms` 
            : 'incomplete'
        });
      });
      
      console.groupEnd();
    });
    
    console.groupEnd();
  }
  
  /**
   * Enable or disable the debugger
   */
  setEnabled(enabled: boolean): void {
    this.options.enabled = enabled;
    this.log('info', 'global', undefined, `ScrollDebugger ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  /**
   * Filter debugging to specific sections
   */
  filterSections(sectionIds: string[]): void {
    this.options.filterSectionIds = sectionIds;
    this.log('info', 'global', undefined, `Now filtering sections: ${sectionIds.join(', ') || 'none'}`);
  }
  
  /**
   * Check if we should skip logging for this section
   */
  private shouldSkip(sectionId: string): boolean {
    if (!this.options.enabled) return true;
    
    if (this.options.filterSectionIds.length > 0 && 
        !this.options.filterSectionIds.includes(sectionId) && 
        sectionId !== 'global') {
      return true;
    }
    
    return false;
  }
  
  /**
   * Get or create a section entry
   */
  private getOrCreateSection(sectionId: string) {
    let section = this.sections.get(sectionId);
    
    if (!section) {
      this.registerSection(sectionId);
      section = this.sections.get(sectionId)!;
    }
    
    return section;
  }
  
  /**
   * Get or create a component entry
   */
  private getOrCreateComponent(section: any, componentId: string) {
    let component = section.components.get(componentId);
    
    if (!component) {
      section.components.set(componentId, {
        triggered: false,
        started: false,
        completed: false
      });
      component = section.components.get(componentId)!;
    }
    
    return component;
  }
  
  /**
   * Format and log an event
   */
  private log(
    type: AnimationEvent['type'], 
    sectionId: string, 
    componentId: string | undefined, 
    message: string, 
    details?: any
  ): void {
    if (!this.options.enabled) return;
    
    const now = performance.now();
    const event: AnimationEvent = {
      type,
      sectionId,
      componentId,
      timestamp: now,
      message,
      details
    };
    
    this.events.push(event);
    
    if (this.options.verbose || type === 'error' || type === 'section-visible' || 
        type === 'animation-trigger' || type === 'animation-start' || type === 'animation-complete') {
      
      let logMessage = `${this.options.logPrefix}`;
      
      if (this.options.logTimestamps) {
        const timeFromStart = this.getTimeFromStart(now);
        logMessage += ` [+${timeFromStart}]`;
      }
      
      logMessage += ` ${this.getIconForType(type)} ${message}`;
      
      if (componentId) {
        logMessage += ` (${componentId})`;
      }
      
      if (type === 'error') {
        console.error(logMessage, details || '');
      } else {
        console.log(logMessage, details || '');
      }
    }
    
    if (this.options.exportLogs && type === 'animation-complete') {
      this.exportLogs();
    }
  }
  
  /**
   * Get formatted time from start
   */
  private getTimeFromStart(timestamp: number): string {
    return `${(timestamp - this.startTime).toFixed(0)}ms`;
  }
  
  /**
   * Get formatted time between two timestamps
   */
  private getTimeFromTimestamp(current: number, previous: number): string {
    return `${(current - previous).toFixed(0)}ms`;
  }
  
  /**
   * Get icon for event type
   */
  private getIconForType(type: AnimationEvent['type']): string {
    switch (type) {
      case 'section-visible': return '👁️✨'; // Eye with sparkles
      case 'animation-trigger': return '🔔🎯'; // Bell with target
      case 'animation-start': return '🚀▶️'; // Rocket with play button
      case 'animation-complete': return '✅🎉'; // Checkmark with celebration
      case 'error': return '❌🔥'; // X with fire
      case 'info': return 'ℹ️🧠'; // Info with brain
      default: return '🔍🔮'; // Magnifying glass with crystal ball
    }
  }
}

// Create a default instance for easy import
export const scrollDebugger = new ScrollDebugger();

// Export default for convenience
export default scrollDebugger;
