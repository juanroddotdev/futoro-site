// Debug and logging utilities for the SimpleLoader component

interface DebugOptions {
  showDebug?: boolean;
  logLevel?: 'info' | 'warn' | 'error' | 'debug';
  prefix?: string;
  timestamp?: boolean;
}

interface TransitionData {
  startTime: number;
  endTime: number;
  duration: number;
  type: string;
}

interface PerformanceData {
  totalUpdates: number;
  totalProcessingTime: number;
  maxProcessingTime: number;
  totalElementsProcessed: number;
  name: string;
}

class DebugLogger {
  private static instance: DebugLogger;
  private showDebug: boolean;
  private logLevel: 'info' | 'warn' | 'error' | 'debug';
  private prefix: string;
  private timestamp: boolean;
  private transitions: Map<string, TransitionData>;
  private lastLoggedPosition: number;
  private performanceData: Map<string, PerformanceData>;

  private constructor(options: DebugOptions = {}) {
    this.showDebug = options.showDebug ?? false;
    this.logLevel = options.logLevel ?? 'info';
    this.prefix = options.prefix ?? '[DEBUG]';
    this.timestamp = options.timestamp ?? true;
    this.transitions = new Map();
    this.lastLoggedPosition = 0;
    this.performanceData = new Map();
  }

  public static getInstance(options?: DebugOptions): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger(options);
    }
    return DebugLogger.instance;
  }

  public setOptions(options: Partial<DebugOptions>): void {
    if (options.showDebug !== undefined) this.showDebug = options.showDebug;
    if (options.logLevel !== undefined) this.logLevel = options.logLevel;
    if (options.prefix !== undefined) this.prefix = options.prefix;
    if (options.timestamp !== undefined) this.timestamp = options.timestamp;
  }

  private formatMessage(message: string, data?: any): string {
    const parts = [this.prefix];
    
    if (this.timestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }
    
    parts.push(message);
    
    if (data !== undefined) {
      parts.push(typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
    }
    
    return parts.join(' ');
  }

  public log(message: string, data?: any): void {
    if (!this.showDebug) return;
    console.log(this.formatMessage(message, data));
  }

  public warn(message: string, data?: any): void {
    if (!this.showDebug) return;
    console.warn(this.formatMessage(message, data));
  }

  public error(message: string, data?: any): void {
    if (!this.showDebug) return;
    console.error(this.formatMessage(message, data));
  }

  public debug(message: string, data?: any): void {
    if (!this.showDebug || this.logLevel !== 'debug') return;
    console.debug(this.formatMessage(message, data));
  }

  public logSpotlightPosition(spotlightX: number): void {
    if (!this.showDebug) return;
    
    const currentThreshold = Math.floor(spotlightX / 10) * 10;
    if (currentThreshold !== this.lastLoggedPosition) {
      this.log(`⭐ Spotlight at ${currentThreshold}%`);
      this.lastLoggedPosition = currentThreshold;
    }
  }

  public startTransition(type: string): void {
    if (!this.showDebug) return;
    
    this.transitions.set(type, {
      startTime: Date.now(),
      endTime: 0,
      duration: 0,
      type
    });
    
    this.log(`▶️ Starting ${type} transition`);
  }

  public endTransition(type: string): void {
    if (!this.showDebug) return;
    
    const transition = this.transitions.get(type);
    if (transition) {
      transition.endTime = Date.now();
      transition.duration = transition.endTime - transition.startTime;
      
      this.log(`✅ ${type} transition complete (${transition.duration}ms)`);
      this.transitions.delete(type);
    }
  }

  public logTextLayerVisibility(): void {
    if (!this.showDebug) return;

    const varaContainer = document.querySelector('#headline-vara-container');
    const outlineWrapper = document.querySelector('.outline-text-wrapper');
    const spotlightWrapper = document.querySelector('.spotlight-text-wrapper');

    this.log('\n📊 Text Layer Status:');
    
    if (varaContainer) {
      const varaLetters = varaContainer.querySelectorAll('path');
      const visibleVaraLetters = Array.from(varaLetters).filter(letter => 
        window.getComputedStyle(letter).opacity !== '0'
      ).length;
      
      this.log(`📜 Vara: ${visibleVaraLetters}/${varaLetters.length} letters visible`);
    }
    
    if (outlineWrapper) {
      const outlineOpacity = window.getComputedStyle(outlineWrapper).opacity;
      this.log(`✏️ Outline: ${outlineOpacity} opacity`);
    }
    
    if (spotlightWrapper) {
      const spotlightOpacity = window.getComputedStyle(spotlightWrapper).opacity;
      this.log(`🔦 Spotlight: ${spotlightOpacity} opacity`);
    }
  }

  public startPerformanceTracking(name: string): void {
    if (!this.showDebug) return;
    
    this.performanceData.set(name, {
      totalUpdates: 0,
      totalProcessingTime: 0,
      maxProcessingTime: 0,
      totalElementsProcessed: 0,
      name
    });
  }

  public trackPerformance(name: string, duration: number, elementsProcessed: number): void {
    if (!this.showDebug) return;
    
    const data = this.performanceData.get(name);
    if (!data) return;

    data.totalUpdates++;
    data.totalProcessingTime += duration;
    data.maxProcessingTime = Math.max(data.maxProcessingTime, duration);
    data.totalElementsProcessed += elementsProcessed;
  }

  public logPerformanceSummary(): void {
    if (!this.showDebug) return;

    let summary = '📊 Final Performance Assessment:\n';
    
    this.performanceData.forEach((data) => {
      summary += `\n[${data.name}]\n`;
      summary += `- Total updates: ${data.totalUpdates}\n`;
      summary += `- Average processing time: ${(data.totalProcessingTime / data.totalUpdates).toFixed(2)}ms\n`;
      summary += `- Max processing time: ${data.maxProcessingTime.toFixed(2)}ms\n`;
      summary += `- Total elements processed: ${data.totalElementsProcessed}\n`;
      summary += `- Average elements per update: ${(data.totalElementsProcessed / data.totalUpdates).toFixed(1)}\n`;
    });

    this.log(summary);
  }

  public reset(): void {
    this.transitions.clear();
    this.lastLoggedPosition = 0;
    this.performanceData.clear();
  }
}

export const debugLogger = DebugLogger.getInstance(); 