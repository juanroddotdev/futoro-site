/**
 * Timestamp utility functions
 */

/**
 * Format a date to display time in 12-hour format (e.g., "10:30am")
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(/\s/g, '').toLowerCase();
}

/**
 * Get current time formatted
 */
export function getCurrentTime(): string {
  return formatTime(new Date());
}

/**
 * Format a duration in milliseconds to a human-readable string
 * @param ms Duration in milliseconds
 * @param includeMs Whether to include milliseconds in the output
 */
export function formatDuration(ms: number, includeMs: boolean = false): string {
  if (ms < 1000 && includeMs) {
    return `${ms.toFixed(0)}ms`;
  }
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  
  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${seconds}s${includeMs ? ` ${ms % 1000}ms` : ''}`;
  }
}

/**
 * Get a timestamp string for logging
 */
export function getTimestampForLog(): string {
  return new Date().toISOString();
}

/**
 * Calculate elapsed time between two timestamps
 */
export function getElapsedTime(startTime: number, endTime: number = Date.now()): number {
  return endTime - startTime;
}

/**
 * Format elapsed time for display
 */
export function formatElapsedTime(startTime: number, endTime: number = Date.now()): string {
  const elapsed = getElapsedTime(startTime, endTime);
  return formatDuration(elapsed, true);
}