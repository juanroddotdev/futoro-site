// Vara animation utilities for the HeroSectionLoader component

import { debugLogger } from './debugUtils';
import { generateRandomPositions as generatePositions } from './positionUtils';

/**
 * Initializes the headline Vara text animation
 */
export const initHeadlineVara = async (
  headline: string,
  loadVara: () => Promise<any>,
  onVaraReady?: (positions: { x: number; index: number }[]) => void
): Promise<void> => {
  try {
    const headlineVaraInstance = await loadVara('#headline-vara-container', {
      fontSize: 72,
      strokeWidth: 2,
      textAlign: 'center',
      text: headline,
      y: 20,
      duration: 2000,
      delay: 1000,
      letterSpacing: 0.1,
      autoAnimation: true,
      color: 'var(--theme-primary, #88C0D0)',
      font: '/futoro-site/fonts/Satisfy/SatisfySL.json',
    });
    
    debugLogger.log('Headline Vara instance created');
    
    // If callback provided, call it with the positions
    if (onVaraReady && headlineVaraInstance) {
      const positions = generatePositions(headline);
      onVaraReady(positions);
    }
  } catch (error) {
    debugLogger.error('Error initializing headline Vara');
  }
};

/**
 * Initializes the subheadline Vara text animation
 */
export const initSubheadlineVara = async (
  subheadline: string,
  loadVara: () => Promise<any>
): Promise<void> => {
  try {
    const subheadlineVaraInstance = await loadVara('#subheadline-vara-container', {
      fontSize: 36,
      strokeWidth: 2,
      textAlign: 'center',
      text: subheadline,
      y: 20,
      duration: 2000,
      letterSpacing: 0.1,
      autoAnimation: true,
      color: 'var(--theme-primary, #88C0D0)',
      font: '/futoro-site/fonts/Satisfy/SatisfySL.json',
      delay: 1000
    });
    
    debugLogger.log('Subheadline Vara instance created');
  } catch (error) {
    debugLogger.error('Error initializing subheadline Vara');
  }
};

/**
 * Generates random positions for text elements
 * This is a placeholder function - you'll need to implement the actual logic
 */
const generateRandomPositions = (text: string): { x: number; index: number }[] => {
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