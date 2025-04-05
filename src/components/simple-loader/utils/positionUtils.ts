// Position utilities for the SimpleLoader component

/**
 * Get a random position between min and max
 */
export const getRandomPosition = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Generate an array of random spotlight positions
 * @param count Number of positions to generate
 * @param min Minimum position value
 * @param max Maximum position value
 * @returns Array of random positions
 */
export const generateRandomPositions = (count: number, min: number, max: number): number[] => {
  const positions: number[] = [];
  
  // First position is always at the left edge
  positions.push(min);
  
  // Generate the rest of the positions
  for (let i = 1; i < count; i++) {
    positions.push(getRandomPosition(min, max));
  }
  
  return positions;
};

/**
 * Get the position of a letter within a text as a percentage
 * @param letter The letter element
 * @param container The container element
 * @returns The position as a percentage
 */
export const getLetterPosition = (letter: HTMLElement, container: HTMLElement): number => {
  const letterRect = letter.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  // Calculate the position as a percentage of the container width
  const position = (letterRect.left + letterRect.width / 2 - containerRect.left) / containerRect.width * 100;
  
  return position;
};

/**
 * Calculates the center position of an element
 * @param element The element to calculate the center position for
 * @returns The center position as a percentage
 */
export const calculateCenterPosition = (element: HTMLElement): number => {
  const rect = element.getBoundingClientRect();
  return (rect.left + rect.width / 2) / window.innerWidth * 100;
};

/**
 * Calculates the position of an element relative to its container
 * @param element The element to calculate the position for
 * @param container The container element
 * @returns The position as a percentage
 */
export const calculateRelativePosition = (
  element: HTMLElement,
  container: HTMLElement
): number => {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  return ((elementRect.left + elementRect.width / 2) - containerRect.left) / containerRect.width * 100;
}; 