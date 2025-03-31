import gsap from 'gsap';

// Types
interface SpotlightRevealOptions {
  element: HTMLElement;
  spotlightX: number;
  isRTL: boolean;
  showDebug?: boolean;
  transitionDuration?: number;
}

// Utility functions
function calculateLetterPosition(letter: HTMLElement, container: HTMLElement): number {
  const letterRect = letter.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const letterLeft = letterRect.left - containerRect.left;
  const letterRight = letterLeft + letterRect.width;
  const letterCenterX = (letterLeft + letterRight) / 2;
  return (letterCenterX / containerRect.width) * 100;
}

function updateVaraLetterVisibility(varaLetter: Element, isVisible: boolean, duration: number) {
  if (isVisible) {
    gsap.set(varaLetter, { opacity: 1 });
  } else {
    gsap.to(varaLetter, {
      opacity: 0,
      duration
    });
  }
}

function logTransition(letterKey: string, message: string, spotlightX: number, showDebug: boolean) {
  if (showDebug) {
    console.log(`[DEBUG] ${message} at spotlight ${spotlightX.toFixed(1)}%`);
  }
}

// RTL Transition handlers
function handleRTLHeadlineTransition(options: SpotlightRevealOptions) {
  const { element, spotlightX, showDebug, transitionDuration = 0.2 } = options;
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

  // Process letters from right to left
  for (let i = letters.length - 1; i >= 0; i--) {
    const letterElement = letters[i] as HTMLElement;
    if (!letterElement.textContent?.trim()) continue;

    const letterPositionPercent = calculateLetterPosition(letterElement, element);
    const varaIndex = letterToVaraMap.get(i);
    if (!varaLetters[varaIndex]) continue;

    // Calculate transition point - earlier letters should transition earlier
    const letterPosition = i / letters.length;
    const transitionPoint = Math.max(20, letterPositionPercent * (1 - letterPosition * 0.3));

    if (spotlightX < transitionPoint) {
      const varaLetter = varaLetters[varaIndex];
      const letterKey = `vara-${varaIndex + 1}`;
      
      logTransition(letterKey, `Letter ${varaIndex + 1}/${varaLetters.length} "${letterElement.textContent}" transitioning`, spotlightX, showDebug ?? false);

      updateVaraLetterVisibility(varaLetter, false, transitionDuration);
      gsap.to(letterElement, {
        opacity: 1,
        duration: transitionDuration
      });
    } else {
      const varaLetter = varaLetters[varaIndex];
      updateVaraLetterVisibility(varaLetter, true, transitionDuration);
      gsap.set(letterElement, { opacity: 0 });
    }
  }

  // Ensure all letters have transitioned when spotlight is at 0%
  if (spotlightX <= 0) {
    letters.forEach((letter, i) => {
      const letterElement = letter as HTMLElement;
      if (!letterElement.textContent?.trim()) return;
      
      const varaIndex = letterToVaraMap.get(i);
      if (varaLetters[varaIndex]) {
        const varaLetter = varaLetters[varaIndex];
        const letterKey = `vara-${varaIndex + 1}`;
        
        logTransition(letterKey, `Letter ${varaIndex + 1}/${varaLetters.length} "${letterElement.textContent}" transitioning at final position`, spotlightX, showDebug ?? false);

        updateVaraLetterVisibility(varaLetter, false, transitionDuration);
        gsap.to(letterElement, {
          opacity: 1,
          duration: transitionDuration
        });
      }
    });
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
      
      if (showDebug) {
        logTransition(`fill-${i}`, `Letter "${letterElement.textContent}" filled`, spotlightX, showDebug ?? false);
      }
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
      if (showDebug) {
        logTransition(`vara-${i}`, `Vara letter ${i + 1}/${varaLetters.length} transitioning`, spotlightX, showDebug);
      }
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