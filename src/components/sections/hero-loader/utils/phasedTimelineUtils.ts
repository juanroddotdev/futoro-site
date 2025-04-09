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
      // Remove the onContainersDrawn callback from here
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
      // Remove the onContainersDrawn callback from here
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
    onContainersDrawn?: () => void;
  } = {}
): gsap.core.Timeline => {
  
  // Add label for the start of this phase - start immediately after timeline start
  tl.addLabel('wireframeContainersStart', 0);
  
  // Animate navbar container
  tl.to('.navbar-container-path', {
    strokeDashoffset: 0,
    duration: 0.2,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 NAVBAR CONTAINER DRAWING STARTED:', new Date().toISOString());
    },
    onComplete: () => {
      console.log('✅ NAVBAR CONTAINER DRAWING COMPLETED:', new Date().toISOString());
      // Execute the onContainersDrawn callback here, right after the first container drawing completes
      options.onContainersDrawn?.();
    }
  }, 'wireframeContainersStart')
  // Animate navbar logo
  .to('.navbar-logo-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 NAVBAR LOGO DRAWING STARTED:', new Date().toISOString());
    },
    onComplete: () => {
      console.log('✅ NAVBAR LOGO DRAWING COMPLETED:', new Date().toISOString());
    }
  }, '-=0.1')
  // Animate navbar links
  .to('.navbar-link-1-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 NAVBAR LINK 1 DRAWING STARTED:', new Date().toISOString());
    },
    onComplete: () => {
      console.log('✅ NAVBAR LINK 1 DRAWING COMPLETED:', new Date().toISOString());
    }
  }, '-=0.1')
  .to('.navbar-link-2-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 NAVBAR LINK 2 DRAWING STARTED:', new Date().toISOString());
    },
    onComplete: () => {
      console.log('✅ NAVBAR LINK 2 DRAWING COMPLETED:', new Date().toISOString());
    }
  }, '-=0.1')
  .to('.navbar-link-3-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 NAVBAR LINK 3 DRAWING STARTED:', new Date().toISOString());
    },
    onComplete: () => {
      console.log('✅ NAVBAR LINK 3 DRAWING COMPLETED:', new Date().toISOString());
    }
  }, '-=0.1')
  .to('.navbar-cta-path', {
    strokeDashoffset: 0,
    duration: 0.15,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 NAVBAR CTA DRAWING STARTED:', new Date().toISOString());
    },
    onComplete: () => {
      console.log('✅ NAVBAR CTA DRAWING COMPLETED:', new Date().toISOString());
    }
  }, '-=0.1')
  // Animate headline container
  .to('.headline-container-path', {
    strokeDashoffset: 0,
    duration: 0.3,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 HEADLINE CONTAINER DRAWING STARTED:', new Date().toISOString());
    },
    onComplete: () => {
      console.log('✅ HEADLINE CONTAINER DRAWING COMPLETED:', new Date().toISOString());
    }
  }, '-=0.15')
  // Animate subheadline container
  .to('.subheadline-container-path', {
    strokeDashoffset: 0,
    duration: 0.3,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 SUBHEADLINE CONTAINER DRAWING STARTED:', new Date().toISOString());
    },
    onComplete: () => {
      console.log('✅ SUBHEADLINE CONTAINER DRAWING COMPLETED:', new Date().toISOString());
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
      console.log('🔄 HEADLINE VARA ANIMATION STARTED:', new Date().toISOString());
    },
    onComplete: () => {
      console.log('✅ HEADLINE VARA ANIMATION COMPLETED:', new Date().toISOString());
    }
  }, 'textAnimationsStart');
  
  tl.to('#subheadline-vara-container', {
    opacity: 1,
    visibility: 'visible',
    duration: 0.5,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 SUBHEADLINE VARA ANIMATION STARTED:', new Date().toISOString());
    },
    onComplete: () => {
      console.log('✅ SUBHEADLINE VARA ANIMATION COMPLETED:', new Date().toISOString());
    }
  }, 'textAnimationsStart+=0.5');
  
  // Add a label for the completion of the text animations phase - remove the offset
  tl.addLabel('textAnimationsComplete', '>');
  
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

  // Store the current time when the spotlight is at the top left position
  const topLeftTime = Date.now();
  console.log('📍 SPOTLIGHT AT TOP LEFT POSITION:', new Date().toISOString());
  
  // Add a label for the start of the spotlight movement at exactly 4.5 seconds
  tl.addLabel('spotlightMovementStart', 4.5);

  // Position spotlight at right edge first - minimal duration
  tl.to('.grid-container', {
    '--spotlight-x': '100%',
    '--spotlight-y': '50%',
    duration: 0.5,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 SPOTLIGHT MOVEMENT TO RIGHT STARTED:', new Date().toISOString());
      console.log('⏱️ TIME SINCE TOP LEFT POSITION:', Date.now() - topLeftTime, 'ms');
    },
    onComplete: () => {
      console.log('✅ SPOTLIGHT MOVEMENT TO RIGHT COMPLETED:', new Date().toISOString());
    }
  }, 'spotlightMovementStart'); // Use the absolute time label

  // Adjust spotlight size and brightness - minimal duration
  tl.to('.grid-container', {
    '--spotlight-size': '300px',
    '--spotlight-brightness': '1.5', // Increase brightness
    duration: 0.2,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 SPOTLIGHT SIZE ADJUSTMENT STARTED:', new Date().toISOString());
    },
    onComplete: () => {
      console.log('✅ SPOTLIGHT SIZE ADJUSTMENT COMPLETED:', new Date().toISOString());
    }
  });

  // RTL Movement - Move spotlight from right to left
  tl.to('.grid-container', {
    '--spotlight-x': '0%',
    duration: 3,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 RTL TRANSITION STARTED:', new Date().toISOString());
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
      console.log('✅ RTL TRANSITION COMPLETED:', new Date().toISOString());
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
 * Phase 5: Adds the headline and subheadline transitions to the timeline
 * This phase handles the headline and subheadline text transitions in parallel
 */
export const addHeadlineAndSubheadlineTransitionsPhase = (
  tl: gsap.core.Timeline,
  options: {
    onComplete?: () => void;
  } = {}
): gsap.core.Timeline => {
  
  // Create a label for the start of this phase
  tl.addLabel('headlineAndSubheadlineStart', '>');
  
  // Start both transitions at the same time
  const headlineTween = gsap.to('.headline-section .spotlight-text-wrapper', {
    clipPath: 'inset(0 0% 0 0)',
    duration: 3.0,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 HEADLINE TRANSITION STARTED:', new Date().toISOString());
    },
    onComplete: () => {
      console.log('✅ HEADLINE TRANSITION COMPLETED:', new Date().toISOString());
    }
  });
  
  const subheadlineTween = gsap.to('.subheadline-section .spotlight-text-wrapper', {
    clipPath: 'inset(0 0% 0 0)',
    duration: 3.0,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 SUBHEADLINE TRANSITION STARTED:', new Date().toISOString());
    },
    onComplete: () => {
      console.log('✅ SUBHEADLINE TRANSITION COMPLETED:', new Date().toISOString());
    }
  });
  
  // Add both tweens to the timeline at the same position
  tl.add(headlineTween, 'headlineAndSubheadlineStart')
    .add(subheadlineTween, 'headlineAndSubheadlineStart')
    .addLabel('headlineAndSubheadlineComplete', '>+=3.0');
  
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
    duration: 0.75,
    ease: 'power2.inOut',
    onStart: () => {
      console.log('🔄 LTR TRANSITION STARTED:', new Date().toISOString());
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
      console.log('✅ LTR TRANSITION COMPLETED:', new Date().toISOString());
      if (options?.onLTRComplete) {
        options.onLTRComplete();
      }
    }
  });

  // Move spotlight back to center
  tl.to('.grid-container', {
    '--spotlight-x': '50%',
    duration: 0.75,
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
      console.log('✅ WIREFRAME CONTAINERS COMPLETED:', new Date().toISOString());
    },
    onContainersDrawn: options.onContainersDrawn
  });
  
  // Add Phase 3: Text Animations
  addTextAnimationsPhase(tl, {
    onComplete: () => {
      console.log('✅ TEXT ANIMATIONS COMPLETED:', new Date().toISOString());
    }
  });
  
  // Add Phase 4: Spotlight Sequence - start immediately after text animations
  addSpotlightSequencePhase(tl, {
    onSpotlightStart: options.onRTLStart,
    onSpotlightUpdate: options.onRTLUpdate,
    onSpotlightComplete: options.onRTLComplete,
    onComplete: () => {
      console.log('✅ SPOTLIGHT SEQUENCE COMPLETED:', new Date().toISOString());
    }
  });
  
  // Add Phase 5: Headline and Subheadline Transitions (in parallel)
  addHeadlineAndSubheadlineTransitionsPhase(tl, {
    onComplete: () => {
      console.log('✅ HEADLINE AND SUBHEADLINE TRANSITIONS COMPLETED:', new Date().toISOString());
    }
  });
  
  // Add Phase 6: Final Transitions
  addFinalTransitionsPhase(tl, {
    onLTRStart: options.onLTRStart,
    onLTRUpdate: options.onLTRUpdate,
    onLTRComplete: options.onLTRComplete,
    onComplete: () => {
      console.log('✅ FINAL TRANSITIONS COMPLETED:', new Date().toISOString());
    }
  });
  
  // Add Phase 7: Finale
  addFinalePhase(tl, {
    onComplete: () => {
      console.log('✅ FINALE COMPLETED:', new Date().toISOString());
      options.onComplete?.();
    }
  });
  
  return tl;
}; 