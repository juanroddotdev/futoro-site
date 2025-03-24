/**
 * Calculates container height based on message count or content size
 * 
 * @param messageCount - Number of messages or content items
 * @param options - Configuration options
 * @returns Formatted height string with vh units
 */
export function calculateContainerHeight(
  messageCount: number, 
  options: {
    baseHeight?: number;        // Base viewport height (default: 100vh)
    itemHeight?: number;        // Height per item in vh (default: 30vh)
    padding?: number;           // Additional padding in vh (default: 50vh)
    heightMultiplier?: number;  // Multiplier for final height (default: 1)
    minHeight?: number;         // Minimum height in vh (default: 100vh)
    adaptToScreenSize?: boolean; // Whether to adapt to screen size (default: true)
  } = {}
): string {
  // Default values
  const {
    baseHeight = 100,
    itemHeight = 30,
    padding = 50,
    heightMultiplier = 1,
    minHeight = 100,
    adaptToScreenSize = true
  } = options;
  
  // Screen size multiplier (smaller for larger screens)
  const screenHeightMultiplier = adaptToScreenSize 
    ? (window.innerHeight > 800 ? 0.8 : 1) 
    : 1;
  
  // Calculate height
  const calculatedHeight = (baseHeight + (messageCount * itemHeight) + padding) 
    * screenHeightMultiplier 
    * heightMultiplier;
  
  // Ensure minimum height
  const finalHeight = Math.max(calculatedHeight, minHeight);
  
  return `${finalHeight}vh`;
}

/**
 * Calculates container height specifically for services section
 * 
 * @param serviceCount - Number of service items
 * @param options - Additional configuration options
 * @returns Formatted height string with vh units
 */
export function calculateServicesHeight(
  serviceCount: number,
  options: {
    itemHeight?: number;       // Height per service in vh
    heightMultiplier?: number; // Overall multiplier
  } = {}
): string {
  return calculateContainerHeight(serviceCount, {
    baseHeight: 100,
    itemHeight: options.itemHeight || 40, // Services need more space
    padding: 100,                         // More padding for services
    heightMultiplier: options.heightMultiplier || 1.2,
    minHeight: 200                        // Minimum 200vh for services
  });
}

/**
 * Calculates container height for horizontal scrolling card sections
 * 
 * @param cardCount - Number of cards in the section
 * @param options - Additional configuration options
 * @returns Formatted height string with vh units
 */
export function calculateHorizontalScrollHeight(
  cardCount: number,
  options: {
    baseHeight?: number;       // Base height in vh
    heightMultiplier?: number; // Overall multiplier
    minHeight?: number;        // Minimum height in vh
  } = {}
): string {
  const { 
    baseHeight = 150,
    heightMultiplier = 1.2,
    minHeight = 250
  } = options;
  
  // For horizontal scroll sections, we often want more height
  // to ensure smooth scrolling experience
  return calculateContainerHeight(cardCount, {
    baseHeight,
    itemHeight: 20, // Each card adds some height
    padding: 100,   // Extra padding for scroll sections
    heightMultiplier,
    minHeight
  });
}
