/**
 * Generate a random position between min and max values
 */
export const getRandomPosition = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Generate a sequence of random spotlight positions
 * First position is always at left edge (0%)
 * Remaining positions are random within bounds
 */
export const generateRandomPositions = (numPositions: number): Array<{
  x: number;
  y: number;
  size: number;
}> => {
  const positions = [];
  
  // First position is always at the left edge
  positions.push({
    x: 0,
    y: 50,
    size: 50
  });
  
  // Generate remaining random positions
  for (let i = 1; i < numPositions; i++) {
    positions.push({
      x: getRandomPosition(20, 80), // Keep away from edges
      y: getRandomPosition(20, 80),
      size: getRandomPosition(30, 70) // Random size between 30% and 70%
    });
  }
  
  return positions;
};

/**
 * Calculate the position of a letter within text as a percentage
 */
export const getLetterPosition = (
  wordIndex: number,
  letterIndex: number,
  text: string
): number => {
  const words = text.split(' ');
  let totalCharsBefore = 0;
  
  // Count characters including spaces up to this word
  for (let i = 0; i < wordIndex; i++) {
    totalCharsBefore += words[i].length + 1; // +1 for space after each word
  }
  totalCharsBefore += letterIndex;
  
  // Calculate percentage based on total text length
  return (totalCharsBefore / text.length) * 100;
}; 