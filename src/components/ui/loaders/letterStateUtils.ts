/**
 * Check if a letter should be visible based on current typing index
 */
export const isLetterVisible = (
  wordIndex: number,
  letterIndex: number,
  currentIndex: number,
  text: string
): boolean => {
  const words = text.split(' ');
  let totalCharsBefore = 0;
  
  // Count characters including spaces up to this word
  for (let i = 0; i < wordIndex; i++) {
    totalCharsBefore += words[i].length + 1; // +1 for space after each word
  }
  totalCharsBefore += letterIndex;
  
  return totalCharsBefore < currentIndex;
};

/**
 * Check if a space should be visible based on current typing index
 */
export const isSpaceVisible = (
  wordIndex: number,
  currentIndex: number,
  text: string
): boolean => {
  const words = text.split(' ');
  let totalCharsBefore = 0;
  
  // Count characters including spaces up to this word
  for (let i = 0; i <= wordIndex; i++) {
    totalCharsBefore += words[i].length + 1; // +1 for space after each word
  }
  
  return totalCharsBefore <= currentIndex;
};

/**
 * Check if a letter should be filled based on spotlight position
 */
export const isLetterFilled = (
  wordIndex: number,
  letterIndex: number,
  spotlightX: number,
  text: string
): boolean => {
  // Get all words and calculate total characters before this letter
  const words = text.split(' ');
  let totalCharsBefore = 0;
  for (let i = 0; i < wordIndex; i++) {
    totalCharsBefore += words[i].length;
  }
  totalCharsBefore += letterIndex;
  
  // Calculate the letter's position in the text (as a percentage)
  const totalChars = text.replace(/\s/g, '').length;
  const letterPosition = (totalCharsBefore / totalChars) * 100;
  
  // More generous buffer and ensure letters stay filled
  const buffer = 10; // Increased buffer size
  return letterPosition <= (spotlightX + buffer) || spotlightX >= 90; // Fill all remaining letters sooner
};

/**
 * Check if a subheadline word should be filled based on spotlight position
 */
export const isSubheadlineFilled = (
  wordIndex: number,
  spotlightX: number,
  isTextCrossing: boolean,
  isAnimationComplete: boolean,
  text: string
): boolean => {
  // If animation is complete, all words should be filled
  if (isAnimationComplete) return true;

  // Only check spotlight position if we're actually crossing text
  if (!isTextCrossing) return false;

  const words = text.split(' ');
  
  // Calculate word position based on index
  const wordPosition = (wordIndex / words.length) * 100;
  
  // Fill word if spotlight has passed its position
  return spotlightX >= wordPosition;
}; 