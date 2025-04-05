/**
 * Utility functions for managing letter states in the SimpleLoader component
 */

/**
 * Checks if a letter element has the 'filled' class
 * @param letter The letter element to check
 * @returns True if the letter is filled, false otherwise
 */
export function isLetterFilled(letter: HTMLElement): boolean {
  return letter.classList.contains('filled');
}

/**
 * Sets the filled state of a letter element
 * @param letter The letter element to update
 * @param filled Whether the letter should be filled
 */
export function setLetterFilled(letter: HTMLElement, filled: boolean): void {
  if (filled) {
    letter.classList.add('filled');
  } else {
    letter.classList.remove('filled');
  }
}

/**
 * Gets all letters in a container
 * @param container The container element
 * @returns An array of letter elements
 */
export function getAllLetters(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll('.letter')) as HTMLElement[];
}

/**
 * Gets all filled letters in a container
 * @param container The container element
 * @returns An array of filled letter elements
 */
export function getFilledLetters(container: HTMLElement): HTMLElement[] {
  return getAllLetters(container).filter(isLetterFilled);
}

/**
 * Gets all unfilled letters in a container
 * @param container The container element
 * @returns An array of unfilled letter elements
 */
export function getUnfilledLetters(container: HTMLElement): HTMLElement[] {
  return getAllLetters(container).filter(letter => !isLetterFilled(letter));
}

/**
 * Sets the filled state of all letters in a container
 * @param container The container element
 * @param filled Whether the letters should be filled
 */
export function setAllLettersFilled(container: HTMLElement, filled: boolean): void {
  getAllLetters(container).forEach(letter => setLetterFilled(letter, filled));
}

/**
 * Gets the percentage of filled letters in a container
 * @param container The container element
 * @returns The percentage of filled letters (0-100)
 */
export function getFilledPercentage(container: HTMLElement): number {
  const allLetters = getAllLetters(container);
  if (allLetters.length === 0) return 0;
  
  const filledLetters = getFilledLetters(container);
  return (filledLetters.length / allLetters.length) * 100;
} 