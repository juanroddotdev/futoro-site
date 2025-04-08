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
  
  // Get Vara letters
  const varaContainer = document.querySelector('#headline-vara-container');
  const varaLetters = Array.from(varaContainer?.querySelectorAll('path') || []);
  
  if (!varaLetters.length) return;

  // Calculate letter positions from right to left
  const containerWidth = varaContainer?.getBoundingClientRect().width || 1200;
  const letterPositions = varaLetters.map((letter, index) => {
    const rect = letter.getBoundingClientRect();
    const letterCenter = rect.left + (rect.width / 2);
    const containerLeft = varaContainer!.getBoundingClientRect().left;
    const relativePosition = ((letterCenter - containerLeft) / containerWidth) * 100;
    return { letter, position: relativePosition };
  });

  // Sort letters by position from right to left
  letterPositions.sort((a, b) => b.position - a.position);

  // Process letters from right to left
  letterPositions.forEach(({ letter, position }, index) => {
    // If spotlight has passed this letter's position, hide it
    if (spotlightX < position) {
      if (showDebug) {
        console.log(`Letter ${index + 1}/${varaLetters.length} at position ${Math.floor(position)}% transitioning at spotlight ${Math.floor(spotlightX)}%`);
      }
      
      gsap.to(letter, {
        opacity: 0,
        duration: transitionDuration
      });
    }
  });
} 