// Timeline and animation sequence utilities for the SimpleLoader component

import gsap from 'gsap';
import { debugLogger } from './debugUtils';
import { initHeadlineVara, initSubheadlineVara } from './varaAnimation';
import { generateRandomPositions } from './positionUtils';

interface TimelineOptions {
  showDebug?: boolean;
  centerY?: number;
  headline?: string;
  subheadline?: string;
  loadVara: () => Promise<any>;
  onComplete?: () => void;
}

interface TimelineCallbacks {
  onRTLStart?: () => void;
  onRTLUpdate?: (spotlightX: number) => void;
  onRTLComplete?: () => void;
  onLTRStart?: () => void;
  onLTRUpdate?: (spotlightX: number) => void;
  onLTRComplete?: () => void;
}

/**
 * Sets up the initial state for the animation
 */
export const setupInitialState = (centerY: number): void => {
  gsap.set('.horizontal .grid-line', { scaleX: 0 });
  gsap.set('.vertical .grid-line', { scaleY: 0 });
  gsap.set('.text-container', { opacity: 0 });
  gsap.set('.grid-container', { 
    '--spotlight-size': '100%',
    '--spotlight-x': '0%',
    '--spotlight-y': `${centerY}%`
  });
  gsap.set('.outline-text-wrapper', { opacity: 0 });
  gsap.set('.spotlight-text-wrapper', { opacity: 0 });
};

/**
 * Creates and returns the main animation timeline
 */
export const createTimeline = ({
  showDebug = false,
  centerY = 50,
  headline = '',
  subheadline = '',
  loadVara,
  onComplete,
  onRTLStart,
  onRTLUpdate,
  onRTLComplete,
  onLTRStart,
  onLTRUpdate,
  onLTRComplete
}: TimelineOptions & TimelineCallbacks): gsap.core.Timeline => {
  const tl = gsap.timeline();
  
  // 1. GRID INTRO (0-1.6s)
  tl.to('.horizontal .grid-line', {
    scaleX: 1,
    duration: 0.8,
    stagger: {
      each: 0.1,
      from: "random"
    },
    ease: 'power2.inOut'
  })
  .to('.vertical .grid-line', {
    scaleY: 1,
    duration: 0.8,
    stagger: {
      each: 0.1,
      from: "random"
    },
    ease: 'power2.inOut'
  }, '-=0.4')
  .to('.text-container', {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.inOut'
  }, '-=0.6')
  
  // 2. HEADLINE VARA TEXT (1.1-3.1s)
  .add(() => {
    initHeadlineVara(headline, loadVara);
  })
  .to({}, { duration: 2 })
  
  // 3. SUBHEADLINE VARA TEXT (3.1-5.1s)
  .add(() => {
    initSubheadlineVara(subheadline, loadVara);
  })
  .to({}, { duration: 2 })
  
  // 4. SPOTLIGHT SEQUENCE (5.1-9.6s)
  .to('.grid-container', {
    '--spotlight-size': '50%',
    duration: 1.5,
    ease: 'power2.inOut'
  })
  .to('.grid-container', {
    '--spotlight-size': '20%',
    '--spotlight-x': '100%',
    '--spotlight-y': `${centerY}%`,
    duration: showDebug ? 2 : 1.5,
    ease: 'power2.inOut',
    onStart: () => {
      debugLogger.log('🎯 Spotlight positioned for RTL headline transition');
      onRTLStart?.();
    }
  })
  
  // 5. HEADLINE TRANSITION (9.6-12.6s)
  .to('.grid-container', {
    '--spotlight-x': '0%',
    duration: 1.5,
    ease: 'power1.inOut',
    onStart: () => {
      debugLogger.startTransition('RTL');
      onRTLStart?.();
    },
    onUpdate: function() {
      const gridContainer = document.querySelector('.grid-container');
      if (gridContainer) {
        const spotlightX = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
        debugLogger.logSpotlightPosition(spotlightX);
        onRTLUpdate?.(spotlightX);
      }
    },
    onComplete: () => {
      debugLogger.endTransition('RTL');
      onRTLComplete?.();
    }
  })
  
  // 6. FINAL TRANSITIONS (12.6-15.6s)
  .to('.grid-container', {
    '--spotlight-x': '0%',
    '--spotlight-y': `${centerY}%`,
    duration: 1.5,
    ease: 'power2.inOut',
    onStart: () => {
      debugLogger.log('🔄 Starting final transitions');
      onLTRStart?.();
    }
  })
  .to('.grid-container', {
    '--spotlight-x': '100%',
    duration: 1.5,
    ease: 'power1.inOut',
    onStart: () => {
      debugLogger.startTransition('LTR');
      onLTRStart?.();
    },
    onUpdate: function() {
      const gridContainer = document.querySelector('.grid-container');
      if (gridContainer) {
        const spotlightX = parseFloat(getComputedStyle(gridContainer).getPropertyValue('--spotlight-x'));
        debugLogger.logSpotlightPosition(spotlightX);
        onLTRUpdate?.(spotlightX);
      }
    },
    onComplete: () => {
      debugLogger.endTransition('LTR');
      debugLogger.log('✅ LTR transitions complete');
      onLTRComplete?.();
    }
  })
  
  // 7. FINALE (15.6-18.6s)
  .to('.grid-container', {
    '--spotlight-x': '80%',
    '--spotlight-y': '80%',
    '--spotlight-size': '50%',
    duration: 1.5,
    ease: 'power2.inOut'
  })
  .to('.grid-container', {
    '--spotlight-x': '20%',
    '--spotlight-y': '20%',
    duration: 1.5,
    ease: 'power2.inOut',
    onComplete: () => {
      onComplete?.();
    }
  });

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