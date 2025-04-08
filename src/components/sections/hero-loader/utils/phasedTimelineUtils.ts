// Phased implementation of timeline utilities for the HeroSectionLoader component
// This file contains the implementation broken down into phases for better maintainability

import gsap from 'gsap';
import { debugLogger } from './debugUtils';
import { initHeadlineVara, initSubheadlineVara } from './varaAnimationUtils';
import { handleRTLHeadlineTransition } from './phasedSpotlightReveal';

// Helper function for more efficient logging with debounce
let lastLogTime = 0;
let lastProgressLog = -1;
let lastSpotlightLog = { x: -1, y: -1 };

const log = (message: string, data?: any) => {
  const now = Date.now();
  // Only log if at least 100ms has passed since the last log
  if (now - lastLogTime > 100) {
    if (data) {
      console.log(`[HeroLoader] ${message}`, data);
    } else {
      console.log(`[HeroLoader] ${message}`);
    }
    lastLogTime = now;
  }
};

// Helper function for logging progress with debounce
const logProgress = (progress: number) => {
  const roundedProgress = Math.round(progress * 100);
  // Only log if progress has changed by at least 10%
  if (roundedProgress !== lastProgressLog && roundedProgress % 10 === 0) {
    log(`Progress: ${roundedProgress}%`);
    lastProgressLog = roundedProgress;
  }
};

// Helper function for logging spotlight position with debounce
const logSpotlightPosition = (x: number, y: number) => {
  // Only log if position has changed by at least 5%
  if (Math.abs(x - lastSpotlightLog.x) > 5 || Math.abs(y - lastSpotlightLog.y) > 5) {
    log(`Spotlight position: x=${x.toFixed(1)}%, y=${y.toFixed(1)}%`);
    lastSpotlightLog = { x, y };
  }
};

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
  console.log('Phase 1: Setting up initial state');
  
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
  
  console.log('Initial state setup complete');
};

/**
 * Sets up the initial state for grid lines only
 */
export const setupGridInitialState = (): void => {
  console.log('Phase 1: Setting up grid initial state');
  
  // Set grid lines to their initial state
  gsap.set('.horizontal .grid-line', { scaleX: 0 });
  gsap.set('.vertical .grid-line', { scaleY: 0 });
  
  console.log('Grid initial state setup complete');
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
  log('Creating phased timeline');
  
  // Create the main timeline with proper configuration
  const tl = gsap.timeline({
    paused: true,
    onStart: () => {
      log('Timeline started');
    },
    onComplete: () => {
      log('Timeline completed');
      onComplete?.();
    },
    onUpdate: () => {
      // Use the debounced progress logging function
      logProgress(tl.progress());
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
      log('Horizontal grid lines animation started');
    },
    onComplete: () => {
      log('Horizontal grid lines animation completed');
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
      log('Vertical grid lines animation started');
    },
    onComplete: () => {
      log('Vertical grid lines animation completed');
    }
  }, '-=0.4')
  .to('.text-container', {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.inOut',
    onStart: () => {
      log('Text container fade-in started');
    },
    onComplete: () => {
      log('Text container fade-in completed');
      onContainersDrawn?.();
    }
  }, '-=0.6')
  .addLabel('gridIntroComplete', '>');
  
  log('Timeline creation complete');
  
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
  console.log('Phase 2: Adding wireframe containers phase');
  
  // Add label for the start of this phase
  tl.addLabel('wireframeContainersStart', '>');
  
  // Animate navbar container
  tl.to('.navbar-container-path', {
    strokeDashoffset: 0,
    duration: 0.2,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('Phase 2: Navbar container animation started');
    },
    onComplete: () => {
      console.log('Phase 2: Navbar container animation completed');
    }
  })
  // Animate navbar logo
  .to('.navbar-logo-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('Phase 2: Navbar logo animation started');
    },
    onComplete: () => {
      console.log('Phase 2: Navbar logo animation completed');
    }
  }, '-=0.1')
  // Animate navbar links
  .to('.navbar-link-1-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('Phase 2: Navbar link 1 animation started');
    },
    onComplete: () => {
      console.log('Phase 2: Navbar link 1 animation completed');
    }
  }, '-=0.1')
  .to('.navbar-link-2-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('Phase 2: Navbar link 2 animation started');
    },
    onComplete: () => {
      console.log('Phase 2: Navbar link 2 animation completed');
    }
  }, '-=0.1')
  .to('.navbar-link-3-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('Phase 2: Navbar link 3 animation started');
    },
    onComplete: () => {
      console.log('Phase 2: Navbar link 3 animation completed');
    }
  }, '-=0.1')
  .to('.navbar-cta-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('Phase 2: Navbar CTA animation started');
    },
    onComplete: () => {
      console.log('Phase 2: Navbar CTA animation completed');
    }
  }, '-=0.1')
  // Animate headline container
  .to('.headline-container-path', {
    strokeDashoffset: 0,
    duration: 0.3,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('Phase 2: Headline container animation started');
    },
    onComplete: () => {
      console.log('Phase 2: Headline container animation completed');
    }
  }, '-=0.15')
  // Animate subheadline container
  .to('.subheadline-container-path', {
    strokeDashoffset: 0,
    duration: 0.3,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('Phase 2: Subheadline container animation started');
    },
    onComplete: () => {
      console.log('Phase 2: Subheadline container animation completed');
      options.onComplete?.();
    }
  }, '-=0.25')
  .addLabel('wireframeContainersComplete', '>');
  
  console.log('Phase 2: Wireframe containers phase added');
  
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
  console.log('Phase 3: Adding text animations phase');
  
  // Add a label for the start of the text animations phase
  tl.addLabel('textAnimationsStart', '+=0.1');
  
  // Show the Vara text containers
  tl.to('#headline-vara-container', {
    opacity: 1,
    visibility: 'visible',
    duration: 0.5,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('Phase 3: Headline Vara text animation started');
    },
    onComplete: () => {
      console.log('Phase 3: Headline Vara text animation completed');
    }
  }, 'textAnimationsStart');
  
  tl.to('#subheadline-vara-container', {
    opacity: 1,
    visibility: 'visible',
    duration: 0.5,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('Phase 3: Subheadline Vara text animation started');
    },
    onComplete: () => {
      console.log('Phase 3: Subheadline Vara text animation completed');
    }
  }, 'textAnimationsStart+=0.5');
  
  // Add a label for the completion of the text animations phase
  tl.addLabel('textAnimationsComplete', '+=0.5');
  
  // Call the onComplete callback if provided
  if (options?.onComplete) {
    tl.call(options.onComplete, [], 'textAnimationsComplete');
  }
  
  console.log('Phase 3: Text animations phase added');
  return tl;
};

/**
 * Phase 4: Spotlight Sequence
 * Moves the spotlight from initial position to right center of viewport edge
 */
export const addSpotlightSequencePhase = (tl: gsap.core.Timeline, options?: SpotlightSequenceOptions) => {
  console.log('Phase 4: Adding spotlight sequence phase');
  
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
      console.log('RTL Phase: Starting right-to-left movement');
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
      console.log('RTL Phase: Completed right-to-left movement');
      // Ensure all Vara text is hidden
      gsap.set('#headline-vara-container path', { opacity: 0 });
      
      if (options?.onSpotlightComplete) {
        options.onSpotlightComplete();
      }
    }
  });

  console.log('Phase 4: Spotlight sequence phase added');
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
  console.log('Phase 5: Adding headline transition phase');
  
  // Add label for the start of this phase
  tl.addLabel('headlineTransitionStart', '>');
  
  // Transition headline text
  tl.to('.headline-spotlight', {
    clipPath: 'inset(0 0% 0 0)',
    duration: 3.0,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('Phase 5: Headline transition started');
    },
    onComplete: () => {
      console.log('Phase 5: Headline transition completed');
      options.onComplete?.();
    }
  })
  .addLabel('headlineTransitionComplete', '>');
  
  console.log('Phase 5: Headline transition phase added');
  
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
  console.log('Phase 6: Adding final transitions phase');
  
  // Move spotlight from right to left
  tl.to('.grid-container', {
    '--spotlight-x': '80%',
    duration: 1.5,
    ease: 'power2.inOut'
  }, '+=0.1');

  // Move spotlight back to center
  tl.to('.grid-container', {
    '--spotlight-x': '50%',
    duration: 1.5,
    ease: 'power2.inOut'
  });

  console.log('Phase 6: Final transitions phase added');
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
  console.log('Phase 7: Adding finale phase');
  
  // First spotlight movement
  tl.to('.grid-container', {
    '--spotlight-x': '20%',
    '--spotlight-y': '20%',
    duration: 1.5,
    ease: 'power2.inOut'
  }, '+=0.1');

  // Second spotlight movement
  tl.to('.grid-container', {
    '--spotlight-x': '80%',
    '--spotlight-y': '80%',
    duration: 1.5,
    ease: 'power2.inOut'
  });

  // Call onComplete callback if provided
  if (options?.onComplete) {
    tl.call(options.onComplete);
  }

  console.log('Phase 7: Finale phase added');
  
  return tl;
};

/**
 * Builds the complete timeline with all phases
 * This function creates a timeline and adds all phases to it
 */
export const buildCompleteTimeline = (
  options: PhasedTimelineOptions & PhasedTimelineCallbacks
): gsap.core.Timeline => {
  log('Building complete timeline with all phases');
  
  // Create the base timeline
  const tl = createPhasedTimeline(options);
  
  // Add Phase 2: Wireframe Containers
  addWireframeContainersPhase(tl, {
    onComplete: () => {
      log('Wireframe containers phase completed');
    }
  });
  
  // Add Phase 3: Text Animations
  addTextAnimationsPhase(tl, {
    onComplete: () => {
      log('Text animations phase completed');
    }
  });
  
  // Add Phase 4: Spotlight Sequence
  addSpotlightSequencePhase(tl, {
    onSpotlightStart: options.onRTLStart,
    onSpotlightUpdate: options.onRTLUpdate,
    onSpotlightComplete: options.onRTLComplete,
    onComplete: () => {
      log('Spotlight sequence phase completed');
    }
  });
  
  // Add Phase 5: Headline Transition
  addHeadlineTransitionPhase(tl, {
    onComplete: () => {
      log('Headline transition phase completed');
    }
  });
  
  // Add Phase 6: Final Transitions
  addFinalTransitionsPhase(tl, {
    onLTRStart: options.onLTRStart,
    onLTRUpdate: options.onLTRUpdate,
    onLTRComplete: options.onLTRComplete,
    onComplete: () => {
      log('Final transitions phase completed');
    }
  });
  
  // Add Phase 7: Finale
  addFinalePhase(tl, {
    onComplete: () => {
      log('Finale phase completed');
      options.onComplete?.();
    }
  });
  
  log('Complete timeline built with all phases');
  
  return tl;
}; 