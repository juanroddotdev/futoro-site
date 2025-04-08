// Phased implementation of the spotlight effect for the HeroSectionLoader component
// This file contains the implementation broken down into phases for better maintainability

import { ref } from 'vue';

export interface PhasedSpotlightOptions {
  initialX?: number;
  initialY?: number;
  initialSize?: number;
  debug?: boolean;
}

/**
 * Phase 1: Creates a spotlight effect with GSAP animations
 * This function sets up the spotlight element and returns functions to control it
 */
export const createPhasedSpotlight = (options: PhasedSpotlightOptions = {}) => {
  console.log('Phase 1: Creating phased spotlight effect');

  const spotlightX = ref(options.initialX || 20);
  const spotlightY = ref(options.initialY || 20);
  const spotlightSize = ref(options.initialSize || 100);

  // Initialize the grid container with CSS variables
  const gridContainer = document.querySelector('.grid-container') as HTMLElement;
  if (gridContainer) {
    gridContainer.style.setProperty('--spotlight-x', `${spotlightX.value}%`);
    gridContainer.style.setProperty('--spotlight-y', `${spotlightY.value}%`);
    gridContainer.style.setProperty('--spotlight-size', `${spotlightSize.value}%`);
    console.log('Spotlight effect initialized on grid container');
  } else {
    console.warn('Grid container not found');
  }

  return {
    spotlightX: spotlightX.value,
    spotlightY: spotlightY.value,
    spotlightSize: spotlightSize.value,
    updatePosition: (x: number, y: number) => {
      if (gridContainer) {
        gridContainer.style.setProperty('--spotlight-x', `${x}%`);
        gridContainer.style.setProperty('--spotlight-y', `${y}%`);
        spotlightX.value = x;
        spotlightY.value = y;
      }
    },
    updateSize: (size: number) => {
      if (gridContainer) {
        gridContainer.style.setProperty('--spotlight-size', `${size}%`);
        spotlightSize.value = size;
      }
    }
  };
}; 