// Phased implementation of timeline utilities for the HeroSectionLoader component
// This file contains the implementation broken down into phases for better maintainability

import gsap from 'gsap';
import { initHeadlineVara, initSubheadlineVara } from './varaAnimationUtils';
import { handleRTLHeadlineTransition, handleLTRHeadlineTransition } from './phasedSpotlightReveal';

export interface PhasedTimelineOptions {
  showDebug?: boolean;
  centerY?: number;
  headline: any;
  subheadline: any;
  loadVara: () => Promise<void>;
  onComplete?: () => void;
  onContainersDrawn?: () => void;
}

export interface PhasedTimelineCallbacks {
  onRTLStart?: () => void;
  onRTLUpdate?: (x: number, y: number) => void;
  onRTLComplete?: () => void;
  onLTRStart?: () => void;
  onLTRUpdate?: (x: number, y: number) => void;
  onLTRComplete?: () => void;
  onVaraReady?: () => void;
  onSpotlightStart?: () => void;
  onSpotlightUpdate?: (x: number, y: number) => void;
  onSpotlightComplete?: () => void;
}

export interface SpotlightSequenceOptions {
  onSpotlightStart?: () => void;
  onSpotlightUpdate?: (x: number, y: number) => void;
  onSpotlightComplete?: () => void;
  onComplete?: () => void;
}

export interface FinalTransitionsOptions {
  onLTRStart?: () => void;
  onLTRUpdate?: (x: number, y: number) => void;
  onLTRComplete?: () => void;
  onComplete?: () => void;
}

/**
 * Phase 1: Sets up the initial state for the animation
 * This function initializes all elements to their starting positions
 */
export const setupInitialState = (centerY: number): void => {
  
  // Set grid lines to their initial state
  gsap.set('.horizontal .grid-line', { scaleX: 0 });
  gsap.set('.vertical .grid-line', { scaleY: 0 });
  
  // Set text container to initial state
  gsap.set('.text-container', { opacity: 0 });
  
  // Set spotlight to initial state
  gsap.set('.grid-container', { 
    '--spotlight-size': '100%',
    '--spotlight-x': '0%',
    '--spotlight-y': `${centerY}%`
  });
  
  // Set text wrappers to initial state
  gsap.set('.outline-text-wrapper', { opacity: 0 });
  gsap.set('.spotlight-text-wrapper', { opacity: 0 });
  
};

/**
 * Sets up the initial state for grid lines only
 */
export const setupGridInitialState = (): void => {
  
  // Set grid lines to their initial state
  gsap.set('.horizontal .grid-line', { scaleX: 0 });
  gsap.set('.vertical .grid-line', { scaleY: 0 });
  
};

/**
 * Phase 1: Creates and returns the main animation timeline with proper configuration
 * This is the foundation for all subsequent phases
 */
export const createPhasedTimeline = ({
  showDebug = false,
  centerY = 50,
  headline = '',
  subheadline = '',
  loadVara,
  onComplete,
  onContainersDrawn,
  onRTLStart,
  onRTLUpdate,
  onRTLComplete,
  onLTRStart,
  onLTRUpdate,
  onLTRComplete,
  onVaraReady
}: PhasedTimelineOptions & PhasedTimelineCallbacks): gsap.core.Timeline => {
  
  // Create the main timeline with proper configuration
  const tl = gsap.timeline({
    paused: true,
    onStart: () => {
    },
    onComplete: () => {
      onComplete?.();
    },
    onUpdate: () => {
      // Use the debounced progress logging function
    }
  });
  
  // Add labels for better organization and debugging
  tl.addLabel('start', 0);
  
  // Phase 1: Grid Intro (0-1.6s)
  tl.to('.horizontal .grid-line', {
    scaleX: 1,
    duration: 0.8,
    stagger: {
      each: 0.1,
      from: "random"
    },
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
    }
  })
  .to('.vertical .grid-line', {
    scaleY: 1,
    duration: 0.8,
    stagger: {
      each: 0.1,
      from: "random"
    },
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
    }
  }, '-=0.4')
  .to('.text-container', {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
      onContainersDrawn?.();
    }
  }, '-=0.6')
  .addLabel('gridIntroComplete', '>');
  
  
  return tl;
};

/**
 * Calculates the center Y position of the text container
 */
export const calculateCenterY = (): number => {
  const textContainer = document.querySelector('.text-container');
  const textRect = textContainer?.getBoundingClientRect();
  const gridContainer = document.querySelector('.grid-container');
  const gridRect = gridContainer?.getBoundingClientRect();
  
  return textRect && gridRect ? 
    ((textRect.top + textRect.height / 2) - gridRect.top) / gridRect.height * 100 : 50;
};

/**
 * Phase 2: Adds the wireframe containers animation to the timeline
 * This phase animates the navbar, headline, and subheadline containers
 */
export const addWireframeContainersPhase = (
  tl: gsap.core.Timeline,
  options: {
    onComplete?: () => void;
  } = {}
): gsap.core.Timeline => {
  
  // Add label for the start of this phase
  tl.addLabel('wireframeContainersStart', '>');
  
  // Animate navbar container
  tl.to('.navbar-container-path', {
    strokeDashoffset: 0,
    duration: 0.2,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
    }
  })
  // Animate navbar logo
  .to('.navbar-logo-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
    }
  }, '-=0.1')
  // Animate navbar links
  .to('.navbar-link-1-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
    }
  }, '-=0.1')
  .to('.navbar-link-2-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
    }
  }, '-=0.1')
  .to('.navbar-link-3-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
    }
  }, '-=0.1')
  .to('.navbar-cta-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
    }
  }, '-=0.1')
  // Animate headline container
  .to('.headline-container-path', {
    strokeDashoffset: 0,
    duration: 0.3,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
    }
  }, '-=0.15')
  // Animate subheadline container
  .to('.subheadline-container-path', {
    strokeDashoffset: 0,
    duration: 0.3,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
      options.onComplete?.();
    }
  }, '-=0.25')
  .addLabel('wireframeContainersComplete', '>');
  
  
  return tl;
};

/**
 * Phase 3: Adds the text animations to the timeline
 * This phase animates the headline and subheadline text
 */
export const addTextAnimationsPhase = (
  tl: gsap.core.Timeline,
  options: {
    onComplete?: () => void;
  } = {}
): gsap.core.Timeline => {
  
  // Add a label for the start of the text animations phase
  tl.addLabel('textAnimationsStart', '+=0.1');
  
  // Show the Vara text containers
  tl.to('#headline-vara-container', {
    opacity: 1,
    visibility: 'visible',
    duration: 0.5,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
    }
  }, 'textAnimationsStart');
  
  tl.to('#subheadline-vara-container', {
    opacity: 1,
    visibility: 'visible',
    duration: 0.5,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
    }
  }, 'textAnimationsStart+=0.5');
  
  // Add a label for the completion of the text animations phase
  tl.addLabel('textAnimationsComplete', '+=0.5');
  
  // Call the onComplete callback if provided
  if (options?.onComplete) {
    tl.call(options.onComplete, [], 'textAnimationsComplete');
  }
  
  return tl;
};

/**
 * Phase 4: Spotlight Sequence
 * Moves the spotlight from initial position to right center of viewport edge
 */
export const addSpotlightSequencePhase = (tl: gsap.core.Timeline, options?: SpotlightSequenceOptions) => {
  
  // Call onSpotlightStart callback if provided
  if (options?.onSpotlightStart) {
    options.onSpotlightStart();
  }

  // Position spotlight at right edge first
  tl.to('.grid-container', {
    '--spotlight-x': '100%',
    '--spotlight-y': '50%',
    duration: 0.5,
    ease: 'power2.inOut'
  }, '+=0.1');

  // Adjust spotlight size and brightness
  tl.to('.grid-container', {
    '--spotlight-size': '300px',
    '--spotlight-brightness': '1.5', // Increase brightness
    duration: 1.5,
    ease: 'power2.inOut'
  });

  // RTL Movement - Move spotlight from right to left
  tl.to('.grid-container', {
    '--spotlight-x': '0%',
    duration: 3,
    ease: 'power2.inOut',
    onStart: () => {
      // Show Vara text initially
      gsap.set('#headline-vara-container', { opacity: 1 });
      gsap.set('#headline-vara-container path', { opacity: 1 });
    },
    onUpdate: function() {
      // Get current spotlight position
      const gridContainer = document.querySelector('.grid-container');
      if (gridContainer) {
        const x = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
        if (options?.onSpotlightUpdate) {
          options.onSpotlightUpdate(x, 50); // y is fixed at 50%
        }
        
        // Use our simplified RTL transition handler
        handleRTLHeadlineTransition({
          spotlightX: x,
          showDebug: true,
          transitionDuration: 0.2
        });
      }
    },
    onComplete: () => {
      // Ensure all Vara text is hidden
      gsap.set('#headline-vara-container path', { opacity: 0 });
      
      if (options?.onSpotlightComplete) {
        options.onSpotlightComplete();
      }
    }
  });

  return tl;
};

/**
 * Phase 5: Adds the headline transition to the timeline
 * This phase handles the RTL (right-to-left) transition
 */
export const addHeadlineTransitionPhase = (
  tl: gsap.core.Timeline,
  options: {
    onComplete?: () => void;
  } = {}
): gsap.core.Timeline => {
  
  // Add label for the start of this phase
  tl.addLabel('headlineTransitionStart', '>');
  
  // Transition headline text
  tl.to('.headline-section .spotlight-text-wrapper', {
    clipPath: 'inset(0 0% 0 0)',
    duration: 3.0,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
      options.onComplete?.();
    }
  })
  .addLabel('headlineTransitionComplete', '>');
  
  
  return tl;
};

/**
 * Phase 6: Final Transitions
 * Moves the spotlight from right center to center of viewport
 */
export const addFinalTransitionsPhase = (
  tl: gsap.core.Timeline,
  options?: FinalTransitionsOptions
) => {
  
  // Move spotlight from right to left
  tl.to('.grid-container', {
    '--spotlight-x': '80%',
    duration: 1.5,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onUpdate: function() {
      // Get current spotlight position
      const gridContainer = document.querySelector('.grid-container');
      if (gridContainer) {
        const x = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
        if (options?.onLTRUpdate) {
          options.onLTRUpdate(x, 50); // y is fixed at 50%
        }
        
        // Use our LTR transition handler
        handleLTRHeadlineTransition({
          spotlightX: x,
          showDebug: true,
          transitionDuration: 0.2
        });
      }
    },
    onComplete: () => {
      if (options?.onLTRComplete) {
        options.onLTRComplete();
      }
    }
  }, '+=0.1');

  // Move spotlight back to center
  tl.to('.grid-container', {
    '--spotlight-x': '50%',
    duration: 1.5,
    ease: 'power2.inOut'
  });

  return tl;
};

/**
 * Phase 7: Adds the finale to the timeline
 * This phase completes the animation sequence
 */
export const addFinalePhase = (
  tl: gsap.core.Timeline,
  options: {
    onComplete?: () => void;
  } = {}
): gsap.core.Timeline => {
  
  // First spotlight movement
  tl.to('.grid-container', {
    '--spotlight-x': '20%',
    '--spotlight-y': '20%',
    duration: 1.5,
    ease: 'power2.inOut'
  }, '+=0.1');

  // Call onComplete callback if provided
  if (options?.onComplete) {
    tl.call(options.onComplete);
  }

  return tl;
};

/**
 * Phase 8: Adds the subheadline transition to the timeline
 * This phase handles the subheadline text transition
 */
export const addSubheadlineTransitionPhase = (
  tl: gsap.core.Timeline,
  options: {
    onComplete?: () => void;
  } = {}
): gsap.core.Timeline => {
  
  // Add label for the start of this phase
  tl.addLabel('subheadlineTransitionStart', '>');
  
  // Transition subheadline text using clip-path reveal instead of fade
  tl.to('.subheadline-section .spotlight-text-wrapper', {
    clipPath: 'inset(0 0% 0 0)',
    duration: 3.0,
    ease: 'power2.inOut',
    onStart: () => {
    },
    onComplete: () => {
      options.onComplete?.();
    }
  })
  .addLabel('subheadlineTransitionComplete', '>');
  
  
  return tl;
};

/**
 * Builds the complete timeline with all phases
 * This function creates a timeline and adds all phases to it
 */
export const buildCompleteTimeline = (
  options: PhasedTimelineOptions & PhasedTimelineCallbacks
): gsap.core.Timeline => {
  
  // Create the base timeline
  const tl = createPhasedTimeline(options);
  
  // Add Phase 2: Wireframe Containers
  addWireframeContainersPhase(tl, {
    onComplete: () => {
    }
  });
  
  // Add Phase 3: Text Animations
  addTextAnimationsPhase(tl, {
    onComplete: () => {
    }
  });
  
  // Add Phase 4: Spotlight Sequence
  addSpotlightSequencePhase(tl, {
    onSpotlightStart: options.onRTLStart,
    onSpotlightUpdate: options.onRTLUpdate,
    onSpotlightComplete: options.onRTLComplete,
    onComplete: () => {
    }
  });
  
  // Add Phase 5: Headline Transition
  addHeadlineTransitionPhase(tl, {
    onComplete: () => {
    }
  });
  
  // Add Phase 6: Subheadline Transition
  addSubheadlineTransitionPhase(tl, {
    onComplete: () => {
    }
  });
  
  // Add Phase 7: Final Transitions
  addFinalTransitionsPhase(tl, {
    onLTRStart: options.onLTRStart,
    onLTRUpdate: options.onLTRUpdate,
    onLTRComplete: options.onLTRComplete,
    onComplete: () => {
    }
  });
  
  // Add Phase 8: Finale
  addFinalePhase(tl, {
    onComplete: () => {
      options.onComplete?.();
    }
  });
  
  
  return tl;
}; 