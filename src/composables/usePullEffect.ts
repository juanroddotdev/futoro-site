import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Ref } from 'vue';
import { applyAmbientPullEffect } from '@/utils/ambientEffects';

interface AmbientTheme {
  baseColor: string;
  endColor: string;
  accentColor: string;
}

/**
 * usePullEffect Composable
 * 
 * This composable provides functionality for creating a pull-to-unlock effect
 * on an ambient screen element. It uses GSAP ScrollTrigger to track scroll position
 * and applies visual effects to the ambient screen based on scroll progress.
 * 
 * Key features:
 * - Creates a GSAP ScrollTrigger to track scroll position
 * - Applies visual effects to the ambient screen based on scroll progress
 * - Triggers a callback when the pull threshold is reached
 * - Provides cleanup functionality to prevent memory leaks
 * 
 * @param onThresholdReached - Callback function to execute when pull threshold is reached
 * @returns Object with setup and cleanup functions
 */
export function usePullEffect(onThresholdReached: () => void) {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);
  
  let scrollTriggerInstance: ScrollTrigger;
  
  /**
   * setupPullEffect - Creates and configures the pull effect
   * 
   * This function:
   * 1. Cleans up any existing ScrollTrigger instance
   * 2. Gets the container and ambient screen elements
   * 3. Creates a new ScrollTrigger instance to track scroll position
   * 4. Applies visual effects to the ambient screen based on scroll progress
   * 5. Triggers the onThresholdReached callback when the pull threshold is reached
   * 
   * @param containerRef - Reference to the container element
   * @param ambientScreenRef - Reference to the ambient screen component
   * @param sectionId - Unique ID for the section (used for DOM selection)
   * @param enablePullEffect - Whether the pull effect is enabled
   * @param ambientMode - Whether the ambient mode is active
   * @param ambientTheme - Theme colors for the ambient screen
   * @param pullThreshold - Threshold value (0-1) that triggers the callback
   */
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
    
    // If pull effect is disabled or ambient mode is off, don't set up
    if (!enablePullEffect || !ambientMode) {
      return;
    }
    
    const container = containerRef.value;
    if (!container) {
      console.warn('[usePullEffect] Container element not found');
      return;
    }
    
    // Get the ambient screen element
    const ambientScreenEl = ambientScreenRef.value?.$el as HTMLElement;
    if (!ambientScreenEl) {
      console.warn('[usePullEffect] Ambient screen element not found');
      return;
    }
    
    // Create a new ScrollTrigger instance
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=100%',
      scrub: true,
      onUpdate: (self) => {
        // Apply visual effects based on scroll progress
        const progress = self.progress;
        
        // Apply the ambient pull effect to the screen
        applyAmbientPullEffect(ambientScreenEl, progress, ambientTheme);
        
        // Check if we've reached the pull threshold
        if (progress >= pullThreshold && !self.vars.thresholdReached) {
          console.log('[usePullEffect] 🎯 Pull threshold reached!');
          
          // Call the threshold reached callback
          onThresholdReached();
          
          // Mark as reached to prevent multiple calls
          self.vars.thresholdReached = true;
        }
      }
    });
    
    // Add a custom property to track if threshold was reached
    scrollTriggerInstance.vars.thresholdReached = false;
  };
  
  /**
   * cleanupPullEffect - Cleans up the ScrollTrigger instance
   * 
   * This function:
   * 1. Checks if a ScrollTrigger instance exists
   * 2. Kills the ScrollTrigger to prevent memory leaks
   */
  const cleanupPullEffect = () => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }
  };
  
  return {
    setupPullEffect,
    cleanupPullEffect
  };
}
