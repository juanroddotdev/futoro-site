import { ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function usePullEffect(onThresholdReached: () => void) {
  const pullProgress = ref(0);
  const isMaxPullReached = ref(false);
  const isRebounding = ref(false);
  let scrollTriggerInstance: ScrollTrigger | null = null;

  const setupPullEffect = (
    containerRef: any,
    ambientScreenRef: any,
    sectionId: string,
    enablePullEffect: boolean,
    ambientMode: boolean,
    theme: { baseColor: string; endColor: string; accentColor: string }
  ) => {
    if (!containerRef.value || !enablePullEffect || !ambientMode) {
      return;
    }

    const container = containerRef.value;
    const pullThreshold = 0.9; // Threshold at which to trigger the unlock

    // Clean up any existing ScrollTrigger
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    // Create a new ScrollTrigger
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=100%',
      scrub: 0.5,
      onUpdate: (self) => {
        // Calculate pull progress (0-1)
        const progress = Math.min(1, Math.max(0, (self.progress - 0.5) * 2));
        pullProgress.value = progress;

        // If we have an AmbientScreen component, apply the pull effect
        if (ambientScreenRef.value && typeof ambientScreenRef.value.applyPullEffect === 'function') {
          ambientScreenRef.value.applyPullEffect(progress);
        }

        // Check if we've reached the threshold
        if (progress > pullThreshold && !isMaxPullReached.value && !isRebounding.value) {
          console.log('MAX PULL REACHED - TRIGGERING UNLOCK:', progress.toFixed(3));
          isMaxPullReached.value = true;
          isRebounding.value = true;

          // Call the callback
          onThresholdReached();

          // Reset after animation
          setTimeout(() => {
            isRebounding.value = false;
            isMaxPullReached.value = false;
            pullProgress.value = 0;
            
            // Reset the ambient screen
            if (ambientScreenRef.value && typeof ambientScreenRef.value.resetPullEffect === 'function') {
              ambientScreenRef.value.resetPullEffect();
            }
          }, 2000);
        }
      }
    });

    return scrollTriggerInstance;
  };

  const cleanupPullEffect = () => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }
    pullProgress.value = 0;
    isMaxPullReached.value = false;
    isRebounding.value = false;
  };

  return {
    pullProgress,
    isMaxPullReached,
    isRebounding,
    setupPullEffect,
    cleanupPullEffect
  };
}
