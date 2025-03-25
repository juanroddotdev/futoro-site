import { ref, onUnmounted } from 'vue';

/**
 * useAmbientTime Composable
 * 
 * This composable provides reactive time and date values for the ambient screen.
 * It sets up an interval to update the time and date values every second when
 * the ambient mode is active.
 * 
 * Key features:
 * - Provides reactive time string in HH:MM format
 * - Provides reactive date string in "Day, Month Date" format
 * - Automatically updates values every second when enabled
 * - Provides cleanup functionality to prevent memory leaks
 * 
 * @param enabled - Whether the time updates should be enabled
 * @returns Object with current time, date, and cleanup function
 */
export function useAmbientTime(enabled = true) {
  // Reactive references for time and date
  const currentTime = ref('');
  const currentDate = ref('');
  
  // Interval reference for cleanup
  let timeInterval: number | null = null;
  
  /**
   * updateTime - Updates the time and date values
   * 
   * This function:
   * 1. Gets the current date object
   * 2. Formats the time as HH:MM
   * 3. Formats the date as "Day, Month Date"
   * 4. Updates the reactive references
   */
  const updateTime = () => {
    const now = new Date();
    
    // Format time as HH:MM
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    currentTime.value = `${hours}:${minutes}`;
    
    // Format date as "Day, Month Date"
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    currentDate.value = now.toLocaleDateString('en-US', options);
  };
  
  // Initial update
  updateTime();
  
  // Set up interval if enabled
  if (enabled) {
    timeInterval = window.setInterval(updateTime, 1000);
  }
  
  /**
   * cleanup - Cleans up the interval
   * 
   * This function:
   * 1. Checks if an interval exists
   * 2. Clears the interval to prevent memory leaks
   */
  const cleanup = () => {
    if (timeInterval !== null) {
      clearInterval(timeInterval);
      timeInterval = null;
    }
  };
  
  // Clean up on component unmount
  onUnmounted(cleanup);
  
  return {
    currentTime,
    currentDate,
    cleanup
  };
}
