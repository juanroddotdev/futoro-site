import gsap from 'gsap';

// Types
interface SpotlightRevealOptions {
  spotlightX: number;
  showDebug?: boolean;
  transitionDuration?: number;
}

// Simplified RTL Transition handler
export function handleRTLHeadlineTransition(options: SpotlightRevealOptions) {
  const { spotlightX, showDebug, transitionDuration = 0.2 } = options;
  
  // Get headline elements
  const headlineVara = document.querySelector('#headline-vara-container');
  const headlineOutline = document.querySelector('.headline-section .outline-text-wrapper');
  const headlineVaraLetters = Array.from(headlineVara?.querySelectorAll('path') || []);
  const headlineOutlineLetters = Array.from(headlineOutline?.querySelectorAll('.letter') || []);
  
  // Get subheadline elements
  const subheadlineVara = document.querySelector('#subheadline-vara-container');
  const subheadlineOutline = document.querySelector('.subheadline-section .outline-text-wrapper');
  const subheadlineVaraLetters = Array.from(subheadlineVara?.querySelectorAll('path') || []);
  const subheadlineOutlineLetters = Array.from(subheadlineOutline?.querySelectorAll('.letter') || []);

  // Handle headline transition
  if (headlineVaraLetters.length && headlineOutlineLetters.length) {
    // Show outline wrapper when we start the RTL phase
    gsap.set(headlineOutline, { opacity: 1 });

    // Calculate letter positions from right to left
    const containerWidth = headlineVara?.getBoundingClientRect().width || 1200;
    const letterPositions = headlineVaraLetters.map((letter, index) => {
      const rect = letter.getBoundingClientRect();
      const letterCenter = rect.left + (rect.width / 2);
      const containerLeft = headlineVara!.getBoundingClientRect().left;
      const relativePosition = ((letterCenter - containerLeft) / containerWidth) * 100;
      return { letter, position: relativePosition };
    });

    // Sort letters by position from right to left
    letterPositions.sort((a, b) => b.position - a.position);

    // Process letters from right to left
    letterPositions.forEach(({ letter, position }, index) => {
      if (spotlightX < position) {
        // Hide Vara letter
        gsap.to(letter, {
          opacity: 0,
          duration: transitionDuration
        });

        // Show corresponding outline letter
        const outlineLetter = headlineOutlineLetters[headlineOutlineLetters.length - 1 - index];
        if (outlineLetter) {
          gsap.to(outlineLetter, {
            opacity: 1,
            duration: transitionDuration
          });
        }
      }
    });
  }

  // Handle subheadline transition
  if (subheadlineVaraLetters.length && subheadlineOutlineLetters.length) {
    // Show outline wrapper when we start the RTL phase
    gsap.set(subheadlineOutline, { opacity: 1 });

    // Calculate letter positions from right to left
    const containerWidth = subheadlineVara?.getBoundingClientRect().width || 1200;
    const letterPositions = subheadlineVaraLetters.map((letter, index) => {
      const rect = letter.getBoundingClientRect();
      const letterCenter = rect.left + (rect.width / 2);
      const containerLeft = subheadlineVara!.getBoundingClientRect().left;
      const relativePosition = ((letterCenter - containerLeft) / containerWidth) * 100;
      return { letter, position: relativePosition };
    });

    // Sort letters by position from right to left
    letterPositions.sort((a, b) => b.position - a.position);

    // Process letters from right to left
    letterPositions.forEach(({ letter, position }, index) => {
      if (spotlightX < position) {
        // Hide Vara letter
        gsap.to(letter, {
          opacity: 0,
          duration: transitionDuration
        });

        // Show corresponding outline letter
        const outlineLetter = subheadlineOutlineLetters[subheadlineOutlineLetters.length - 1 - index];
        if (outlineLetter) {
          gsap.to(outlineLetter, {
            opacity: 1,
            duration: transitionDuration
          });
        }
      }
    });
  }
}

// Add LTR Transition handler
export function handleLTRHeadlineTransition(options: SpotlightRevealOptions) {
  const { spotlightX, showDebug, transitionDuration = 0.2 } = options;
  
  // Get headline elements
  const headlineOutline = document.querySelector('.headline-section .outline-text-wrapper');
  const headlineSpotlight = document.querySelector('.headline-section .spotlight-text-wrapper');
  const headlineVara = document.querySelector('#headline-vara-container');
  
  // Get subheadline elements
  const subheadlineOutline = document.querySelector('.subheadline-section .outline-text-wrapper');
  const subheadlineSpotlight = document.querySelector('.subheadline-section .spotlight-text-wrapper');
  const subheadlineVara = document.querySelector('#subheadline-vara-container');
  
  // Calculate how much of the text to reveal based on spotlight position
  const clipPercentage = Math.max(0, Math.min(100, ((80 - spotlightX) / 30) * 100));

  // Handle headline transition
  if (headlineSpotlight && headlineOutline && headlineVara) {
    gsap.set(headlineSpotlight, { 
      opacity: 1,
      clipPath: 'inset(0 100% 0 0)'
    });

    gsap.to(headlineSpotlight, {
      clipPath: `inset(0 ${clipPercentage}% 0 0)`,
      duration: transitionDuration,
      ease: 'none'
    });

    gsap.to(headlineOutline, {
      opacity: spotlightX < 65 ? 1 : 0,
      duration: transitionDuration
    });

    gsap.to(headlineVara, {
      opacity: spotlightX < 65 ? 1 : 0,
      duration: transitionDuration
    });
  }

  // Handle subheadline transition
  if (subheadlineSpotlight && subheadlineOutline && subheadlineVara) {
    gsap.set(subheadlineSpotlight, { 
      opacity: 1,
      clipPath: 'inset(0 100% 0 0)'
    });

    gsap.to(subheadlineSpotlight, {
      clipPath: `inset(0 ${clipPercentage}% 0 0)`,
      duration: transitionDuration,
      ease: 'none'
    });

    gsap.to(subheadlineOutline, {
      opacity: spotlightX < 65 ? 1 : 0,
      duration: transitionDuration
    });

    gsap.to(subheadlineVara, {
      opacity: spotlightX < 65 ? 1 : 0,
      duration: transitionDuration
    });
  }
} 