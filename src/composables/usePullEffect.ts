import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Ref } from 'vue';
import { applyAmbientPullEffect } from '@/utils/ambientEffects';

interface AmbientTheme {
  baseColor: string;
  endColor: string;
  accentColor: string;
}

export function usePullEffect(onThresholdReached: () => void) {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);
  
  let scrollTriggerInstance: ScrollTrigger;
  
  const setupPullEffect = (
    containerRef: Ref<HTMLElement | null>,
    ambientScreenRef: Ref<any>,
    sectionId: string,
    enablePullEffect: boolean,
    ambientMode: boolean,
    ambientTheme: AmbientTheme,
    pullThreshold = 0.9
  ) => {
    // Clean up any existing ScrollTrigger
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }
    
    if (!containerRef.value || !enablePullEffect) return;
    
    console.log(`[PullEffect] 🔄 Setting up pull effect for section: ${sectionId}`);
    
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: containerRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => {
        // Only apply pull effect when in ambient mode and past halfway point
        if (self.progress > 0.5 && ambientMode && ambientScreenRef.value) {
          const progress = Math.min(1, Math.max(0, (self.progress - 0.5) * 2)); // Normalize to 0-1
          
          console.log(`[PullEffect] 📜 Pull Effect - Section: ${sectionId}, Progress: ${progress.toFixed(2)}`);
          
          // Apply the pull effect to the ambient screen
          const maxPullReached = applyAmbientPullEffect(
            ambientScreenRef.value.$el,
            progress,
            ambientTheme
          );
          
          // Apply U-shaped effect to notification dots
          const dotsContainer = ambientScreenRef.value.$el.querySelector('.ambient-notifications');
          if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.loading-dot');
            if (dots.length > 0) {
              const maxOffset = 40; // Maximum downward movement
              const maxScale = 1.5; // Maximum scale factor for middle dot
              
              // Calculate the middle index
              const middleIndex = Math.floor(dots.length / 2);
              
              dots.forEach((dot: HTMLElement, index: number) => {
                // Calculate distance from middle (0 to 1)
                const distFromMiddle = Math.abs(index - middleIndex) / middleIndex;
                
                // Calculate offset based on distance from middle (U-shape)
                const offset = progress * maxOffset * (1 - distFromMiddle);
                
                // Calculate scale based on distance from middle (middle dot scales more)
                const scale = 1 + (progress * (maxScale - 1) * (1 - distFromMiddle));
                
                // Apply transformations
                dot.style.transform = `translateY(${offset}px) scale(${scale})`;
              });
            }
          }
          
          // Handle pull threshold detection
          if (self.progress > pullThreshold && maxPullReached) {
            console.log(`[PullEffect] 🚨 THRESHOLD REACHED - Section: ${sectionId}, Progress: ${progress.toFixed(2)}`);
            onThresholdReached();
          }
        }
      }
    }) as ScrollTrigger;
    
    return scrollTriggerInstance;
  };
  
  const cleanupPullEffect = () => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }
  };
  
  return {
    setupPullEffect,
    cleanupPullEffect,
    onPullThresholdReached: onThresholdReached
  };
}
