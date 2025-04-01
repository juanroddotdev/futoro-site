interface PerformanceData {
  totalUpdates: number;
  totalProcessingTime: number;
  maxProcessingTime: number;
  totalElementsProcessed: number;
  name: string;
}

export class PerformanceTracker {
  private performanceData: Map<string, PerformanceData>;

  constructor() {
    this.performanceData = new Map();
  }

  public startTracking(name: string): void {
    this.performanceData.set(name, {
      totalUpdates: 0,
      totalProcessingTime: 0,
      maxProcessingTime: 0,
      totalElementsProcessed: 0,
      name
    });
  }

  public track(name: string, duration: number, elementsProcessed: number): void {
    const data = this.performanceData.get(name);
    if (!data) return;

    data.totalUpdates++;
    data.totalProcessingTime += duration;
    data.maxProcessingTime = Math.max(data.maxProcessingTime, duration);
    data.totalElementsProcessed += elementsProcessed;
  }

  public getSummary(): string {
    let summary = '📊 Final Performance Assessment:\n';
    
    this.performanceData.forEach((data) => {
      summary += `\n[${data.name}]\n`;
      summary += `- Total updates: ${data.totalUpdates}\n`;
      summary += `- Average processing time: ${(data.totalProcessingTime / data.totalUpdates).toFixed(2)}ms\n`;
      summary += `- Max processing time: ${data.maxProcessingTime.toFixed(2)}ms\n`;
      summary += `- Total elements processed: ${data.totalElementsProcessed}\n`;
      summary += `- Average elements per update: ${(data.totalElementsProcessed / data.totalUpdates).toFixed(1)}\n`;
    });

    return summary;
  }

  public reset(): void {
    this.performanceData.clear();
  }
} 