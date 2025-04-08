import { ref, watch } from 'vue';
import gsap from 'gsap';

export function useSpotlightEffect(initialX = 20, initialY = 20, size = 100) {
  const spotlightX = ref(initialX);
  const spotlightY = ref(initialY);
  const spotlightSize = ref(size);

  const updateSpotlightPosition = (x: number, y: number) => {
    spotlightX.value = x;
    spotlightY.value = y;
  };

  const updateSpotlightSize = (newSize: number) => {
    spotlightSize.value = newSize;
  };

  // Create a GSAP animation for smooth spotlight movement
  const animateSpotlight = (targetX: number, targetY: number, duration = 0.5, ease = 'power2.out') => {
    console.log('animateSpotlight', targetX, targetY, duration, ease);
    console.log('Current spotlight position:', spotlightX.value, spotlightY.value);
    
    return gsap.to([spotlightX, spotlightY], {
      duration,
      ease,
      x: targetX,
      y: targetY,
      onStart: () => console.log('Spotlight animation started'),
      onUpdate: () => {
        console.log('Spotlight position updated:', spotlightX.value, spotlightY.value);
        updateSpotlightPosition(spotlightX.value, spotlightY.value);
      },
      onComplete: () => console.log('Spotlight animation completed')
    });
  };

  // Create a timeline for complex spotlight animations
  const createSpotlightTimeline = () => {
    return gsap.timeline();
  };

  return {
    spotlightX,
    spotlightY,
    spotlightSize,
    updateSpotlightPosition,
    updateSpotlightSize,
    animateSpotlight,
    createSpotlightTimeline
  };
} 