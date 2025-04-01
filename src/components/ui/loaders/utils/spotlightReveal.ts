import gsap from 'gsap';
import { debugLogger } from './debugUtils';
import { isLetterFilled } from './letterStateUtils';

// Types
interface SpotlightRevealOptions {
  element: HTMLElement;
  spotlightX: number;
  isRTL: boolean;
  showDebug?: boolean;
  transitionDuration?: number;
  onLetterTransition?: (letter: HTMLElement) => void;
}

// Track revealed letters across function calls
const revealedLetters = new Set<number>();

// Utility functions
function calculateLetterPosition(letter: HTMLElement, container: HTMLElement): number {
  const letterRect = letter.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const letterLeft = letterRect.left - containerRect.left;
  const letterRight = letterLeft + letterRect.width;
  const letterCenterX = (letterLeft + letterRight) / 2;
  return (letterCenterX / containerRect.width) * 100;
}

/**
 * Determines if a Vara letter should transition out during RTL movement
 * Returns true when the letter should be hidden (transitioned out)
 */
function shouldVaraLetterTransitionOut(
  letterElement: HTMLElement,
  spotlightX: number,
  container: HTMLElement
): boolean {
  const letterPosition = calculateLetterPosition(letterElement, container);
  // Add a small buffer (5%) to ensure smooth transition
  const buffer = 5;
  // Letter should transition out when spotlight passes over it
  return spotlightX < letterPosition + buffer;
}

function updateVaraLetterVisibility(varaLetter: Element, isVisible: boolean, duration: number) {
  if (isVisible) {
    gsap.to(varaLetter, {
      opacity: 1,
      duration
    });
  } else {
    gsap.to(varaLetter, {
      opacity: 0,
      duration
    });
  }
}

// RTL Transition handlers
function handleRTLHeadlineTransition(options: SpotlightRevealOptions) {
  console.log('handleRTLHeadlineTransition');
  const { element, spotlightX, showDebug, transitionDuration = 0.2, onLetterTransition } = options;
  const letters = element.querySelectorAll('.letter');
  const varaContainer = document.querySelector('#headline-vara-container');
  const varaLetters = varaContainer?.querySelectorAll('path');
  
  if (!varaLetters) return;

  // Create mapping of visual positions to Vara indices
  const letterToVaraMap = new Map();
  let varaIndex = varaLetters.length - 1;
  
  // Map each visible letter to its corresponding Vara letter
  for (let i = letters.length - 1; i >= 0; i--) {
    const letterElement = letters[i] as HTMLElement;
    if (letterElement.textContent?.trim()) {
      letterToVaraMap.set(i, varaIndex);
      varaIndex--;
    }
  }

  // Reset tracking when spotlight starts from the right
  if (spotlightX >= 100) {
    revealedLetters.clear();
  }

  // Process letters from right to left to match spotlight movement
  for (let i = letters.length - 1; i >= 0; i--) {
    const letterElement = letters[i] as HTMLElement;
    if (!letterElement.textContent?.trim()) continue;

    // Skip letters we've already transitioned to prevent flickering
    if (revealedLetters.has(i)) continue;

    const varaIndex = letterToVaraMap.get(i);
    if (!varaLetters[varaIndex]) continue;

    const varaLetter = varaLetters[varaIndex];
    
    // Use our new function to determine Vara letter visibility
    const shouldHideVara = shouldVaraLetterTransitionOut(letterElement, spotlightX, element);
    
    if (shouldHideVara && !revealedLetters.has(i)) {
      if (showDebug) {
        debugLogger.log(`Letter ${varaIndex + 1}/${varaLetters.length} "${letterElement.textContent}" transitioning at ${Math.floor(spotlightX)}%`);
      }

      // Hide Vara letter and show outline letter
      updateVaraLetterVisibility(varaLetter, false, transitionDuration);
      gsap.to(letterElement, {
        opacity: 1,
        duration: transitionDuration,
        onComplete: () => {
          revealedLetters.add(i);
          onLetterTransition?.(letterElement);
        }
      });
    }
  }

  // Reset tracking when spotlight reaches the left side
  if (spotlightX <= 0) {
    revealedLetters.clear();
  }
}

// LTR Transition handlers
function handleLTRHeadlineFill(options: SpotlightRevealOptions) {
  const { element, spotlightX, showDebug } = options;
  const letters = element.querySelectorAll('.letter');

  letters.forEach((letter, i) => {
    const letterElement = letter as HTMLElement;
    const letterPositionPercent = calculateLetterPosition(letterElement, element);

    if (spotlightX > letterPositionPercent) {
      letterElement.classList.add('filled');
    } else {
      letterElement.classList.remove('filled');
    }
  });
}

function handleSubheadlineTransition(options: SpotlightRevealOptions) {
  const { spotlightX, showDebug, transitionDuration = 0.2 } = options;
  const subheadlineVaraContainer = document.querySelector('#subheadline-vara-container');
  const varaLetters = subheadlineVaraContainer?.querySelectorAll('path');
  const spotlightText = document.querySelector('.spotlight-text-wrapper') as HTMLElement;

  if (!varaLetters || !spotlightText) return;

  const spotlightRect = spotlightText.getBoundingClientRect();
  varaLetters.forEach((varaLetter, i) => {
    const letterPositionPercent = calculateLetterPosition(varaLetter as unknown as HTMLElement, spotlightText);

    if (spotlightX > letterPositionPercent) {
      updateVaraLetterVisibility(varaLetter, false, transitionDuration);
    } else {
      updateVaraLetterVisibility(varaLetter, true, transitionDuration);
    }
  });

  // Ensure all Vara letters are hidden when spotlight reaches the end
  if (spotlightX >= 100) {
    varaLetters.forEach((varaLetter) => {
      updateVaraLetterVisibility(varaLetter, false, transitionDuration);
    });
  }
}

// Main function
export function applySpotlightReveal(options: SpotlightRevealOptions) {
  const { element, isRTL } = options;

  if (isRTL) {
    handleRTLHeadlineTransition(options);
  } else {
    handleLTRHeadlineFill(options);
    handleSubheadlineTransition(options);
  }
} 