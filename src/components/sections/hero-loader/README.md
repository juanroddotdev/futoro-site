# HeroSectionLoader Utilities

This directory contains utility functions for the HeroSectionLoader component, which handles the animated loading sequence for the hero section of the Futoro Digital Design website.

## Directory Structure

- `utils/` - Contains utility functions for the HeroSectionLoader component
  - `heroTimelineUtils.ts` - Timeline and animation sequence utilities
  - `varaAnimationUtils.ts` - Vara text animation utilities
  - `positionUtils.ts` - Position calculation utilities
  - `debugUtils.ts` - Debug logging utilities
  - `index.ts` - Exports all utility functions

## Usage

Here's an example of how to use these utilities in your component:

```typescript
import { 
  setupInitialState, 
  createHeroTimeline, 
  calculateCenterY 
} from '@/components/sections/hero-loader/utils';

// In your component's setup function
const setupAnimation = async () => {
  // Calculate the center Y position
  const centerY = calculateCenterY();
  
  // Set up the initial state
  setupInitialState(centerY);
  
  // Create the timeline
  const timeline = createHeroTimeline({
    showDebug: true,
    centerY,
    headline: 'Your Headline',
    subheadline: 'Your Subheadline',
    loadVara: yourLoadVaraFunction,
    onComplete: () => {
      console.log('Animation complete');
    },
    onRTLStart: () => {
      console.log('RTL transition started');
    },
    onRTLUpdate: (spotlightX) => {
      console.log(`RTL spotlight position: ${spotlightX}%`);
    },
    onRTLComplete: () => {
      console.log('RTL transition complete');
    },
    onLTRStart: () => {
      console.log('LTR transition started');
    },
    onLTRUpdate: (spotlightX) => {
      console.log(`LTR spotlight position: ${spotlightX}%`);
    },
    onLTRComplete: () => {
      console.log('LTR transition complete');
    },
    onVaraReady: (positions) => {
      console.log('Vara text ready with positions:', positions);
    }
  });
  
  // Play the timeline
  timeline.play();
};
```

## Animation Sequence

The animation sequence consists of the following phases:

1. **Grid Intro (0-1.6s)** - Horizontal and vertical grid lines appear with a staggered animation
2. **Headline Vara Text (1.1-3.1s)** - The headline text is drawn using Vara
3. **Subheadline Vara Text (3.1-5.1s)** - The subheadline text is drawn using Vara
4. **Spotlight Sequence (5.1-9.6s)** - The spotlight is positioned for the RTL transition
5. **Headline Transition (9.6-12.6s)** - The spotlight moves from right to left
6. **Final Transitions (12.6-15.6s)** - The spotlight moves from left to right
7. **Finale (15.6-18.6s)** - The spotlight moves to the final position

## Debug Mode

When debug mode is enabled, additional logging information is displayed in the console, and the animation may be paused at specific points for debugging purposes. 