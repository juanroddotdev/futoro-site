// Position utilities for the HeroSectionLoader component

/**
 * Generates random positions for text elements
 * This function creates a set of positions for each character in the text
 * that can be used for animations
 */
export const generateRandomPositions = (text: string): { x: number; index: number }[] => {
  const positions: { x: number; index: number }[] = [];
  const words = text.split(' ');
  
  words.forEach((word, wordIndex) => {
    const chars = word.split('');
    chars.forEach((char, charIndex) => {
      positions.push({
        x: Math.random() * 100, // Random position between 0 and 100
        index: wordIndex * 100 + charIndex // Unique index for each character
      });
    });
  });
  
  return positions;
};

/**
 * Calculates the position of a character based on its index in the text
 * This is a more deterministic approach than random positions
 */
export const calculateCharacterPosition = (
  text: string, 
  charIndex: number, 
  containerWidth: number
): number => {
  // This is a simplified calculation - you may need to adjust based on your specific needs
  const charWidth = containerWidth / text.length;
  return charIndex * charWidth;
};

/**
 * Generates a sequence of positions for a smooth animation
 * This creates a path for the spotlight to follow
 */
export const generateSpotlightPath = (
  startX: number,
  endX: number,
  steps: number = 10
): number[] => {
  const path: number[] = [];
  const stepSize = (endX - startX) / steps;
  
  for (let i = 0; i <= steps; i++) {
    path.push(startX + (stepSize * i));
  }
  
  return path;
}; 