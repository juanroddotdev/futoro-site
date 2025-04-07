// Debug utilities for the HeroSectionLoader component

/**
 * Debug logger for the HeroSectionLoader component
 */
export const debugLogger = {
  /**
   * Logs a message to the console if debug mode is enabled
   */
  log: (message: string): void => {
    console.log(`[HeroLoader] ${message}`);
  },
  
  /**
   * Logs a spotlight position update
   */
  logSpotlightPosition: (spotlightX: number): void => {
    console.log(`[HeroLoader] Spotlight position: ${spotlightX}%`);
  },
  
  /**
   * Logs the start of a transition
   */
  startTransition: (direction: 'RTL' | 'LTR'): void => {
    console.log(`[HeroLoader] Starting ${direction} transition`);
  },
  
  /**
   * Logs the end of a transition
   */
  endTransition: (direction: 'RTL' | 'LTR'): void => {
    console.log(`[HeroLoader] ${direction} transition complete`);
  },
  
  /**
   * Logs an error message
   */
  error: (message: string): void => {
    console.error(`[HeroLoader] Error: ${message}`);
  }
}; 